// Public surface of the engine. UI, net, and app layers import ONLY from
// here (or from './types'/'./actions'/'./events' for types) — never from
// engine/systems/* directly. Systems are internal.

export { reduce, reject, type ReduceResult } from './reducer';
export { assertInvariants } from './invariants';
export * from './types';
export type { GameAction, EncounterPick, FavorTarget } from './actions';
export type { GameEvent } from './events';
export {
  seedRng, nextU32, nextFloat, nextInt, d20, d20Slot, pick, pickWeighted,
  shuffled, type RngState,
} from './rng';
export { waitingOn, getDie, isFaceEligible, stageableApproaches, unlockedFavorTier } from './selectors';
