// ============================================================================
// ROLL RESOLUTION — the heart of the game.
//
// STATUS: STUB. Implement per docs/briefs/02-dice-rolls-and-intertwine.md.
//
// Resolves one confirmed roll into a full RollResolution chain:
//   value face      -> done
//   scratched face  -> re-roll the SAME die (append step, continue)
//   intertwine face -> roll the TARGET ally die, apply the face's bonus
//                      to the final total (chain can continue from there)
//   chaos face      -> roll all 3 of the hero's dice, take the middle value
//
// Chain-safety: intertwines can form cycles (A links to B, B links to A).
// Cap the chain (MAX_CHAIN_DEPTH) and fall back to treating the last face
// as a scratched re-roll on the ORIGINAL die.
// ============================================================================

import type { RngState } from '../rng';
import type { DieRef, RollResolution, RunState } from '../types';

export const MAX_CHAIN_DEPTH = 8;

/**
 * Pure roll resolver. Draws from `rng`, never touches state.rng directly —
 * the caller (combat / encounter system) threads rng back into state.
 *
 * Naturalness rule: natural1/natural20 are judged on the RAW face value of
 * the FINAL step, before intertwine bonuses. hopeGained/doomGained aggregate
 * face riders (hope/doom fields) plus the natural-1/natural-20 rules.
 */
export function resolveRoll(
  state: RunState,
  die: DieRef,
  rng: RngState,
): [RollResolution, RngState] {
  void state; void die; void rng;
  throw new Error('resolveRoll not implemented (brief-02)');
}
