// ============================================================================
// REDUCER — the engine's single entry point.
//
// STATUS: SKELETON. Implement per docs/briefs/01-engine-core.md.
//
// Contract (do not change):
//   reduce(state, action) -> { state, events }
//   - Pure: no I/O, no Math.random, no Date, no mutation of the input state.
//   - Total: never throws on bad input from the network. Illegal or
//     out-of-turn actions return the SAME state plus an ACTION_REJECTED
//     event. (Throwing is reserved for engine bugs / broken invariants.)
//   - All randomness comes from state.rng and the new rng state is stored
//     back into the returned state.
//
// The reducer itself stays thin: validate phase + actor, then delegate to
// the owning system in ./systems/. Keep per-mechanic logic OUT of this file.
// ============================================================================

import type { GameAction } from './actions';
import type { GameEvent } from './events';
import type { PlayerId, RunState } from './types';

export interface ReduceResult {
  state: RunState;
  events: GameEvent[];
}

/** Convenience for systems: unchanged state + a rejection event. */
export function reject(state: RunState, reason: string, player: PlayerId | null = null): ReduceResult {
  return { state, events: [{ type: 'ACTION_REJECTED', player, reason }] };
}

export function reduce(state: RunState, action: GameAction): ReduceResult {
  // TODO(brief-01): dispatch on action.type + state.phase.kind.
  //
  // Sketch of the intended shape:
  //
  //   switch (action.type) {
  //     case 'START_RUN':        return runLifecycle.startRun(action);
  //     case 'CONFIRM_ROLL':     return rolls.confirmRoll(state, action);
  //     case 'CAST_VOTE':        return overworld.castVote(state, action);
  //     case 'MERCHANT_BUMP':    return economy.merchantBump(state, action);
  //     ...
  //     default:                 return reject(state, `unknown action`);
  //   }
  //
  // Invariants to assert (dev builds) after every dispatch — see invariants.ts.
  throw new Error(`reduce not implemented (brief-01); got action ${action.type} in phase ${state.phase.kind}`);
}
