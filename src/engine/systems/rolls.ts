// ============================================================================
// ROLL RESOLUTION — the heart of the game. STATUS: IMPLEMENTED (brief 02).
//
// Resolves one confirmed roll into a full RollResolution chain:
//   value face      -> done (exotic behavior transforms may apply)
//   scratched face  -> re-roll the SAME die (append step, continue)
//   intertwine face -> roll the TARGET ally die; the face's bonus joins the
//                      accumulator (chains can keep hopping dice)
//   chaos face      -> roll all 3 of the hero's dice, take the middle value
//
// Chain-safety: intertwines can form cycles (A links to B, B links to A).
// The chain is capped at MAX_CHAIN_DEPTH steps; on hitting the cap the roll
// force-resolves to a uniform draw among the ORIGINAL die's value faces
// (guaranteed termination).
//
// Rider accounting: hope/doom riders on EVERY face stepped through
// accumulate (a marked Ferryman face carries its curse as a doom rider —
// nothing is hardcoded to "marked"). Natural 1 / natural 20 are judged on
// the FINAL step's raw face value, pre-bonus:
//   natural 1  -> +BALANCE.doom.perNatural1 DOOM
//   natural 20 -> +1 HOPE (riders stack on top; the legacy double-count of
//                 a 20-with-hope-segment is resolved as 1 + rider,
//                 REVIEW.md #5)
//
// Exotic behavior rulings (documented decisions):
//   lucky-sevens (7->17, 17->20) and six-nine (6->9) transform the face
//     value itself; naturalness is judged POST-transform (a Lucky-7s 17
//     rolling into a 20 IS a natural 20 — that's the die's whole point).
//   doubler doubles the TOTAL (except on a raw 1); naturalness is judged
//     on the RAW value — a doubled 10 is a 20 for the DC, not a natural 20.
//   wildcard redirects to a uniformly-random die of a random ally before
//     any face matters (its own faces are all scratched cosmetics).
// ============================================================================

import { BALANCE } from '@content/balance';
import { EXOTIC_DICE } from '@content/index';
import { d20Slot, nextInt, pick, type RngState } from '../rng';
import type {
  Die, DieRef, Face, RollResolution, RollStep, RunState, ValueFace,
} from '../types';

export const MAX_CHAIN_DEPTH = BALANCE.rollChain.maxDepth;

function getDie(state: RunState, ref: DieRef): Die {
  return state.heroes[ref.player].dice[ref.approach];
}

function behaviorOf(die: Die): string | undefined {
  return die.exoticId ? EXOTIC_DICE[die.exoticId]?.behavior : undefined;
}

/** Value transform for behaviors that change what the face reads as. */
function transformValue(raw: number, behavior: string | undefined): number {
  if (behavior === 'lucky-sevens') {
    if (raw === 7) return 17;
    if (raw === 17) return 20;
  }
  if (behavior === 'six-nine' && raw === 6) return 9;
  return raw;
}

function riderTotals(face: Face): { hope: number; doom: number } {
  return { hope: face.hope ?? 0, doom: face.doom ?? 0 };
}

/** All value faces of a die (used for forced termination + chaos fallback). */
function valueFaces(die: Die): ValueFace[] {
  return die.faces.filter((f): f is ValueFace => f.kind === 'value');
}

/** Every die on the table except `except`. */
function otherDice(except: DieRef): DieRef[] {
  const refs: DieRef[] = [];
  for (const player of [0, 1, 2] as const) {
    for (const approach of ['physical', 'verbal', 'preventative'] as const) {
      if (player === except.player && approach === except.approach) continue;
      refs.push({ player, approach });
    }
  }
  return refs;
}

/**
 * Chaos sub-draw: draw slots on a die until a value face comes up (bounded);
 * fall back to the die's first value face, then to a neutral 10 for a die
 * with no value faces at all.
 */
function chaosSubRoll(
  die: Die, ref: DieRef, rng: RngState, steps: RollStep[],
): [number, RngState] {
  let s = rng;
  for (let i = 0; i < MAX_CHAIN_DEPTH; i++) {
    const [slot, s2] = d20Slot(s);
    s = s2;
    const face = die.faces[slot] as Face;
    steps.push({ die: ref, slot, face, via: 'chaos' });
    if (face.kind === 'value') {
      return [transformValue(face.value, behaviorOf(die)), s];
    }
  }
  const values = valueFaces(die);
  return [values.length > 0 ? (values[0] as ValueFace).value : 10, s];
}

/**
 * Pure roll resolver. Draws from `rng`, never touches state.rng directly —
 * the caller (combat / encounter system) threads rng back into state.
 */
export function resolveRoll(
  state: RunState,
  die: DieRef,
  rng: RngState,
): [RollResolution, RngState] {
  const origin: DieRef = die;
  const steps: RollStep[] = [];
  let s = rng;
  let bonus = 0;
  let hope = 0;
  let doom = 0;
  let current: DieRef = die;
  let via: RollStep['via'] = 'initial';

  let finalRaw: number | null = null;
  let doubler = false;

  for (let depth = 0; depth < MAX_CHAIN_DEPTH && finalRaw === null; depth++) {
    const currentDie = getDie(state, current);
    const behavior = behaviorOf(currentDie);

    // Wildcard redirects before its own (all-scratched) faces matter.
    if (behavior === 'wildcard') {
      const [target, s2] = pick(s, otherDice(current));
      s = s2;
      current = target;
      via = 'intertwine';
      continue;
    }

    const [slot, s2] = d20Slot(s);
    s = s2;
    const face = currentDie.faces[slot] as Face;
    steps.push({ die: current, slot, face, via });
    const riders = riderTotals(face);
    hope += riders.hope;
    doom += riders.doom;

    switch (face.kind) {
      case 'value':
        finalRaw = transformValue(face.value, behavior);
        doubler = behavior === 'doubler';
        break;
      case 'scratched':
        via = 'scratch-reroll';
        break;
      case 'intertwine':
        bonus += face.bonus;
        current = face.target;
        via = 'intertwine';
        break;
      case 'chaos': {
        const hero = state.heroes[current.player];
        const draws: number[] = [];
        for (const approach of ['physical', 'verbal', 'preventative'] as const) {
          const ref: DieRef = { player: hero.id, approach };
          const [v, s3] = chaosSubRoll(hero.dice[approach], ref, s, steps);
          s = s3;
          draws.push(v);
        }
        draws.sort((a, b) => a - b);
        finalRaw = draws[1] as number;
        break;
      }
    }
  }

  // Forced termination: uniform draw among the ORIGINAL die's value faces.
  if (finalRaw === null) {
    const values = valueFaces(getDie(state, origin));
    if (values.length > 0) {
      const [i, s2] = nextInt(s, 0, values.length - 1);
      s = s2;
      finalRaw = (values[i] as ValueFace).value;
    } else {
      finalRaw = 10;
    }
  }

  const natural1 = finalRaw === 1;
  const natural20 = finalRaw === 20;
  if (natural1) doom += BALANCE.doom.perNatural1;
  if (natural20) hope += 1;

  let total = finalRaw + bonus;
  if (doubler && finalRaw !== 1) total = finalRaw * 2 + bonus;
  total = Math.max(1, total);

  return [
    { steps, total, natural1, natural20, hopeGained: hope, doomGained: doom },
    s,
  ];
}
