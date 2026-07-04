// ============================================================================
// SELECTORS — pure read-only views over RunState for the UI and net layers.
//
// STATUS: implemented except unlockedFavorTier (brief 07 — needs FAVOR_STORE
// content to sum assigned tiers).
//
// UI code must never reach into RunState internals directly for derived
// facts — add a selector. This keeps the state shape free to evolve.
// ============================================================================

import type { Approach, Die, DieRef, PlayerId, RunState } from './types';

const APPROACHES: Approach[] = ['physical', 'verbal', 'preventative'];

/** Whose input is the game currently waiting on? (empty = host/any/"continue") */
export function waitingOn(state: RunState): PlayerId[] {
  const phase = state.phase;
  switch (phase.kind) {
    case 'combat':
      if (phase.pendingDoomRolls.length > 0) return [...phase.pendingDoomRolls];
      return [phase.combat.activeHero];
    case 'overworld': {
      if (!phase.voting) return [];
      const seats: PlayerId[] = [];
      for (const p of [0, 1, 2] as const) {
        if (phase.voting.votes[p] === undefined) seats.push(p);
      }
      return seats;
    }
    default:
      return [];
  }
}

/** Resolve a DieRef to the actual Die. */
export function getDie(state: RunState, ref: DieRef): Die {
  const hero = state.heroes[ref.player];
  return hero.dice[ref.approach];
}

/**
 * Can this face be modified by the given source? Implements the Merchant
 * "warranty" rule (README): the Merchant only touches value faces whose
 * provenance is 'base' or 'merchant', never a 20, and never a face carrying
 * riders. The Wheel only re-touches 'base' or 'wheel' faces.
 */
export function isFaceEligible(
  state: RunState, ref: DieRef, slot: number,
  source: 'merchant' | 'wheel' | 'other',
): boolean {
  const face = getDie(state, ref).faces[slot];
  if (!face) return false;
  if (source === 'other') return true;
  if (face.hope !== undefined || face.doom !== undefined || face.marked) return false;
  if (source === 'merchant') {
    return (
      face.kind === 'value' &&
      face.value < 20 &&
      (face.provenance === 'base' || face.provenance === 'merchant')
    );
  }
  // wheel
  return (
    face.kind === 'value' &&
    (face.provenance === 'base' || face.provenance === 'wheel')
  );
}

/** Legal dice the hero may stage right now (BOMB immunity excluded;
 *  encounter-specific allowed-type restrictions layer on in brief 06). */
export function stageableApproaches(state: RunState, player: PlayerId): Approach[] {
  void player;
  if (state.phase.kind !== 'combat') return [];
  const immune = state.phase.combat.immuneApproach;
  return APPROACHES.filter((a) => a !== immune);
}

/** Favor tier currently unlocked, derived from assigned favor total
 *  (3 assigned unlocks tier 2, 5 -> tier 3, 8 -> tier 4, 12 -> tier 5). */
export function unlockedFavorTier(state: RunState): 1 | 2 | 3 | 4 | 5 {
  void state;
  throw new Error('unlockedFavorTier not implemented (brief-07)');
}
