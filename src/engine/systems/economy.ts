// ============================================================================
// ECONOMY — gold, FAVOR, the Merchant, and the Wheel.
//
// STATUS: STUB. Implement per docs/briefs/07-economy-and-shops.md.
//
// Key rules (README "Start-of-Stage Upgrade Shop" + "Merchant"):
//  - Stage clear: leftover gold converts to FAVOR at 10G -> 1F (floor),
//    plus the stage's base grant (stage 2 -> 3F, 3 -> 6F, 4 -> 9F, 5 -> 12F).
//  - FAVOR upgrades are single-purchase, freely equip/unequip at stage
//    start; tier N+1 unlocks by ASSIGNED favor (3 -> tier2, 5 -> tier3,
//    8 -> tier4, 12 -> tier5).
//  - Merchant bump: cost starts at 1G, +1G per bump, resets each VISIT.
//    Caps value at 19. Only faces with provenance 'base' or 'merchant'
//    are eligible (selectors.isFaceEligible).
//  - Wheel: 3G per spin, 5 equally-weighted outcomes (double capped 19 /
//    half min 2 / +1 hope rider / +1 doom rider / player-chosen intertwine).
//    Wheel-touched faces are wheel-only thereafter.
// ============================================================================

import type { GameAction } from '../actions';
import type { GameEvent } from '../events';
import type { ReduceResult } from '../reducer';
import type { RunState, StageNumber } from '../types';

export function addGold(state: RunState, amount: number, reason: string): [RunState, GameEvent[]] {
  void state; void amount; void reason;
  throw new Error('addGold not implemented (brief-07)');
}

/** Stage-clear conversion: gold -> favor, base grant, DOOM reset hook. */
export function settleStage(state: RunState, cleared: StageNumber): ReduceResult {
  void state; void cleared;
  throw new Error('settleStage not implemented (brief-07)');
}

export function merchantBump(state: RunState, action: Extract<GameAction, { type: 'MERCHANT_BUMP' }>): ReduceResult {
  void state; void action;
  throw new Error('merchantBump not implemented (brief-07)');
}

export function spinWheel(state: RunState, action: Extract<GameAction, { type: 'MERCHANT_SPIN_WHEEL' }>): ReduceResult {
  void state; void action;
  throw new Error('spinWheel not implemented (brief-07)');
}

export function favorPurchase(state: RunState, action: Extract<GameAction, { type: 'FAVOR_PURCHASE' }>): ReduceResult {
  void state; void action;
  throw new Error('favorPurchase not implemented (brief-07)');
}

export function favorAssign(state: RunState, action: Extract<GameAction, { type: 'FAVOR_ASSIGN' }>): ReduceResult {
  void state; void action;
  throw new Error('favorAssign not implemented (brief-07)');
}

export function favorUnassign(state: RunState, action: Extract<GameAction, { type: 'FAVOR_UNASSIGN' }>): ReduceResult {
  void state; void action;
  throw new Error('favorUnassign not implemented (brief-07)');
}
