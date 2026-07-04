// ============================================================================
// COMBAT — regular enemies, minibosses, and bosses.
//
// STATUS: STUB. Implement per docs/briefs/04-combat.md.
//
// Round flow (README "Boss Combat Mechanics"):
//  1. Heroes act in seat order; each stages a die and confirms a roll.
//  2. Success (total >= that approach's DC, approach not immune) increments
//     that approach's success counter and flips that hero's light green.
//  3. After all 3 heroes: 3 greens -> free round (lights flash + reset, no
//     enemy turn). Any red -> enemy attacks (attacksPerRound times), queueing
//     DOOM rolls for hit heroes.
//  4. Any approach reaching its threshold ends combat (victory).
//  5. BOMB only: immunity cycles to a random different approach after each
//     enemy attack (IMMUNITY_CYCLED event).
//
// Known legacy bugs this must NOT reproduce: gold reward NaN (REVIEW.md #1),
// approach lock-in across rounds (#16), biased shuffle for DC assignment (#2).
// ============================================================================

import type { GameAction } from '../actions';
import type { ReduceResult } from '../reducer';
import type { RunState } from '../types';

/** Enter combat: roll DCs/thresholds from the node's EncounterParams (already
 *  fixed at map generation) and build CombatState. */
export function startCombat(state: RunState, enemyId: string): ReduceResult {
  void state; void enemyId;
  throw new Error('startCombat not implemented (brief-04)');
}

export function stageDie(state: RunState, action: Extract<GameAction, { type: 'STAGE_DIE' }>): ReduceResult {
  void state; void action;
  throw new Error('stageDie not implemented (brief-04)');
}

/** Confirm the staged die: resolve the roll (systems/rolls.ts), apply
 *  success/failure, advance turn / round / enemy attack / victory. */
export function confirmRoll(state: RunState, action: Extract<GameAction, { type: 'CONFIRM_ROLL' }>): ReduceResult {
  void state; void action;
  throw new Error('confirmRoll not implemented (brief-04)');
}

/** Generate per-approach DCs summing to totalDcSum, each within its band.
 *  MUST enforce the exact sum (legacy version silently didn't — REVIEW.md #3).
 *  Pure helper, unit-test heavily. */
export function rollApproachDCs(
  totalDcSum: number,
  bands: { easy: [number, number]; medium: [number, number]; hard: [number, number] },
  rng: import('../rng').RngState,
): [Record<import('../types').Approach, number>, import('../rng').RngState] {
  void totalDcSum; void bands; void rng;
  throw new Error('rollApproachDCs not implemented (brief-04)');
}
