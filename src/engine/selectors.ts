// ============================================================================
// SELECTORS — pure read-only views over RunState for the UI and net layers.
//
// STATUS: STUB. Implement per docs/briefs/01-engine-core.md (grow as needed).
//
// UI code must never reach into RunState internals directly for derived
// facts — add a selector. This keeps the state shape free to evolve.
// ============================================================================

import type { Approach, Die, DieRef, PlayerId, RunState } from './types';

/** Whose input is the game currently waiting on? (null = host/any/"continue") */
export function waitingOn(state: RunState): PlayerId[] {
  void state;
  throw new Error('waitingOn not implemented (brief-01)');
}

/** Resolve a DieRef to the actual Die. Throws on invalid ref (engine bug). */
export function getDie(state: RunState, ref: DieRef): Die {
  const hero = state.heroes[ref.player];
  return hero.dice[ref.approach];
}

/** Can this face be modified by the given source? Implements the Merchant
 *  provenance rule and general face-locking (brief-07). */
export function isFaceEligible(
  state: RunState, ref: DieRef, slot: number,
  source: 'merchant' | 'wheel' | 'other',
): boolean {
  void state; void ref; void slot; void source;
  throw new Error('isFaceEligible not implemented (brief-07)');
}

/** Legal dice the active hero may stage right now (combat approach locks,
 *  BOMB immunity, encounter allowed-types). */
export function stageableApproaches(state: RunState, player: PlayerId): Approach[] {
  void state; void player;
  throw new Error('stageableApproaches not implemented (brief-04)');
}

/** Favor tier currently unlocked, derived from assigned favor total
 *  (3 assigned unlocks tier 2, 5 -> tier 3, 8 -> tier 4, 12 -> tier 5). */
export function unlockedFavorTier(state: RunState): 1 | 2 | 3 | 4 | 5 {
  void state;
  throw new Error('unlockedFavorTier not implemented (brief-07)');
}
