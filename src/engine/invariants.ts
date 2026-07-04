// ============================================================================
// INVARIANTS — cheap structural checks run after every reduce() in dev/test.
//
// These exist because the legacy prototype's worst bugs were silent state
// corruption (gold becoming NaN, favor leaking across runs, shared object
// references after shallow copies — REVIEW.md #1, #7, #9). Fail LOUDLY in
// dev; in production, log and continue (the session layer decides).
// ============================================================================

import type { Approach, RunState } from './types';

const APPROACHES: Approach[] = ['physical', 'verbal', 'preventative'];

function check(cond: boolean, msg: string): void {
  if (!cond) throw new Error(`Invariant violated: ${msg}`);
}

function isCount(n: unknown): boolean {
  return typeof n === 'number' && Number.isFinite(n) && Number.isInteger(n) && n >= 0;
}

/** Throws with a descriptive message if the state is structurally broken. */
export function assertInvariants(state: RunState): void {
  // Meters
  check(isCount(state.gold), `gold is ${state.gold}`);
  check(isCount(state.doom), `doom is ${state.doom}`);
  check(isCount(state.hope), `hope is ${state.hope}`);
  check(isCount(state.shields), `shields is ${state.shields}`);
  check(isCount(state.favor.total), `favor.total is ${state.favor.total}`);
  check(isCount(state.tick), `tick is ${state.tick}`);
  check(state.hope <= state.maxHope, `hope ${state.hope} > maxHope ${state.maxHope}`);
  check(state.shields <= state.maxShields, `shields ${state.shields} > maxShields ${state.maxShields}`);

  // Heroes & dice
  check(state.heroes.length === 3, `expected 3 heroes, got ${state.heroes.length}`);
  state.heroes.forEach((hero, hi) => {
    check(hero.id === hi, `hero ${hi} has id ${hero.id}`);
    for (const approach of APPROACHES) {
      const die = hero.dice[approach];
      check(!!die, `hero ${hi} missing ${approach} die`);
      check(die.approach === approach, `hero ${hi} ${approach} die claims ${die.approach}`);
      check(die.faces.length === 20, `hero ${hi} ${approach} die has ${die.faces.length} faces`);
      die.faces.forEach((face, slot) => {
        const where = `hero ${hi} ${approach} slot ${slot}`;
        if (face.kind === 'value') {
          check(
            Number.isInteger(face.value) && face.value >= 1 && face.value <= 20,
            `${where} value ${face.value} outside [1,20]`,
          );
        } else if (face.kind === 'intertwine') {
          check(
            face.target.player >= 0 && face.target.player <= 2,
            `${where} intertwine targets player ${face.target.player}`,
          );
          check(
            !(face.target.player === hi && face.target.approach === approach),
            `${where} intertwines to its own die`,
          );
          check(Number.isFinite(face.bonus), `${where} intertwine bonus ${face.bonus}`);
        }
      });
    }
  });

  // Map
  const nodeIds = new Set(state.map.nodes.map((n) => n.id));
  check(nodeIds.size === state.map.nodes.length, 'duplicate map node ids');
  if (state.map.currentNodeId !== null) {
    check(nodeIds.has(state.map.currentNodeId), `currentNodeId ${state.map.currentNodeId} not on map`);
  }
  for (const node of state.map.nodes) {
    for (const conn of node.connections) {
      check(nodeIds.has(conn), `node ${node.id} connects to missing ${conn}`);
    }
  }

  // Phase-specific
  const phase = state.phase;
  if (phase.kind === 'combat') {
    const c = phase.combat;
    check(c.activeHero >= 0 && c.activeHero <= 2, `activeHero ${c.activeHero}`);
    check(c.lights.length === 3, 'combat lights must have 3 entries');
    check(isCount(c.round) && c.round >= 1, `combat round ${c.round}`);
    for (const approach of APPROACHES) {
      const t = c.approaches[approach];
      check(isCount(t.successes), `${approach} successes ${t.successes}`);
      check(isCount(t.dc) && t.dc >= 1, `${approach} dc ${t.dc}`);
      check(isCount(t.threshold) && t.threshold >= 1, `${approach} threshold ${t.threshold}`);
    }
    for (const p of phase.pendingDoomRolls) {
      check(p >= 0 && p <= 2, `pendingDoomRolls has seat ${p}`);
    }
  }

  // RNG state shape
  check(state.rng.length === 4 && state.rng.every((w) => isCount(w)), 'rng state malformed');
}
