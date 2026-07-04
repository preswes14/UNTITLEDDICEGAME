// ============================================================================
// INVARIANTS — cheap structural checks run after every reduce() in dev/test.
//
// STATUS: STUB. Implement per docs/briefs/01-engine-core.md.
//
// These exist because the legacy prototype's worst bugs were silent state
// corruption (gold becoming NaN, favor leaking across runs, shared object
// references after shallow copies — REVIEW.md #1, #7, #9). Fail LOUDLY in
// dev; in production, log and continue.
// ============================================================================

import type { RunState } from './types';

/** Throws with a descriptive message if the state is structurally broken. */
export function assertInvariants(state: RunState): void {
  // TODO(brief-01), checks to implement:
  //  - gold, doom, hope, shields, favor.total are finite integers >= 0
  //  - hope <= maxHope, shields <= maxShields
  //  - exactly 3 heroes; each hero has exactly 3 dice, one per approach
  //  - every die has exactly 20 faces
  //  - every 'value' face is an integer in [1, 20]
  //  - every 'intertwine' face targets a die that exists and is not
  //    the face's own die
  //  - map.currentNodeId, node connections, and encounter ids all resolve
  //  - phase-specific: combat approach successes <= threshold + overflow,
  //    activeHero in [0,2], pendingDoomRolls are valid player ids
  //  - JSON round-trip safety: no undefined-only keys, no functions
  //    (checked in tests rather than at runtime)
  void state;
  throw new Error('assertInvariants not implemented (brief-01)');
}
