// ============================================================================
// DOOM / HOPE / SHIELDS — party survival meters.
//
// STATUS: STUB. Implement per docs/briefs/03-doom-hope-shields.md.
//
// Rules (README "DOOM & HOPE System"):
//  - +1 DOOM whenever a natural 1 is rolled; other misfortunes add DOOM.
//  - DOOM modifies ONLY DOOM rolls: effective = raw - doom (natural 20 exempt).
//  - DOOM roll outcomes: effective <= 1 -> stage loss (HOPE/shield can save);
//    natural 20 -> +1 HOPE; otherwise survive and +1 DOOM.
//  - HOPE is capped at maxHope (FAVOR upgrades raise the cap).
//  - DOOM resets between stages.
//
// BALANCE MANDATE (REVIEW.md #12): the raw design death-spirals. This
// system owns whatever rubber-banding gets adopted (DOOM cap, decay, or
// diminishing gains) — see the brief for the recommended fix and the knobs
// that must stay tunable from content/balance.ts.
// ============================================================================

import type { GameEvent } from '../events';
import type { DoomRollResolution, PlayerId, RunState } from '../types';
import type { RngState } from '../rng';

export function addDoom(state: RunState, amount: number, reason: string): [RunState, GameEvent[]] {
  void state; void amount; void reason;
  throw new Error('addDoom not implemented (brief-03)');
}

export function addHope(state: RunState, amount: number, reason: string): [RunState, GameEvent[]] {
  void state; void amount; void reason;
  throw new Error('addHope not implemented (brief-03)');
}

/** Resolve one pending DOOM roll for `player`. Draws from rng. */
export function resolveDoomRoll(
  state: RunState, player: PlayerId, rng: RngState,
): [DoomRollResolution, RngState] {
  void state; void player; void rng;
  throw new Error('resolveDoomRoll not implemented (brief-03)');
}
