// ============================================================================
// REDUCER — the engine's single entry point.
//
// STATUS: dispatcher implemented; arms route to systems as those land.
// Unimplemented mechanics are REJECTED (not thrown) so the reducer stays
// total over network input while briefs are in flight.
//
// Contract (do not change):
//   reduce(state, action) -> { state, events }
//   - Pure: no I/O, no Math.random, no Date, no mutation of the input state.
//   - Total: never throws on bad input from the network. Illegal or
//     out-of-turn actions return the SAME state (identity) plus an
//     ACTION_REJECTED event. Throwing is reserved for engine bugs.
//   - All randomness comes from state.rng; the new rng state is stored
//     back into the returned state.
//
// The reducer stays thin: validate phase + actor, then delegate to the
// owning system in ./systems/. Keep per-mechanic logic OUT of this file.
// ============================================================================

import type { GameAction } from './actions';
import type { GameEvent } from './events';
import type { PlayerId, RunState } from './types';
import { waitingOn } from './selectors';

export interface ReduceResult {
  state: RunState;
  events: GameEvent[];
}

/** Convenience for systems: unchanged state + a rejection event. */
export function reject(state: RunState, reason: string, player: PlayerId | null = null): ReduceResult {
  return { state, events: [{ type: 'ACTION_REJECTED', player, reason }] };
}

/** Accepted actions advance the tick exactly once, here. */
function accept(state: RunState, events: GameEvent[]): ReduceResult {
  return { state: { ...state, tick: state.tick + 1 }, events };
}

function notImplemented(state: RunState, brief: string, what: string): ReduceResult {
  return reject(state, `${what} is not implemented yet (${brief})`);
}

/** Does the acting seat have the floor for seat-scoped actions? */
function seatMayAct(state: RunState, player: PlayerId): boolean {
  const waiting = waitingOn(state);
  return waiting.length === 0 || waiting.includes(player);
}

export function reduce(state: RunState, action: GameAction): ReduceResult {
  if (!action || typeof (action as { type?: unknown }).type !== 'string') {
    return reject(state, 'malformed action');
  }

  // Seat validation for player-scoped actions.
  const player = (action as { player?: unknown }).player;
  if (player !== undefined) {
    if (player !== 0 && player !== 1 && player !== 2) {
      return reject(state, `invalid seat ${String(player)}`);
    }
    if (!seatMayAct(state, player)) {
      return reject(state, 'not your turn', player);
    }
  }

  switch (action.type) {
    case 'START_RUN':
      // Run creation happens in lifecycle.startRun (app layer calls it when
      // no run exists). Reaching the reducer means a run is already live.
      return reject(state, 'a run is already in progress');

    case 'ABANDON_RUN':
      return accept(
        { ...state, phase: { kind: 'defeat', reason: 'abandoned' } },
        [{ type: 'RUN_ENDED', result: 'defeat', reason: 'abandoned' }],
      );

    case 'CONTINUE':
      return notImplemented(state, 'briefs 05/07/12', 'stage flow');

    case 'DRAFT_CHOOSE':
      return notImplemented(state, 'brief 12', 'the draft');

    case 'CAST_VOTE':
    case 'RESOLVE_VOTE':
      return notImplemented(state, 'brief 05', 'overworld voting');

    case 'CHOOSE_ENCOUNTER_OPTION':
    case 'ENCOUNTER_PICK':
      return notImplemented(state, 'brief 06', 'encounters');

    case 'STAGE_DIE':
    case 'UNSTAGE_DIE':
    case 'CONFIRM_ROLL':
      return notImplemented(state, 'brief 04', 'combat rolling');

    case 'ROLL_DOOM':
    case 'SPEND_HOPE_TO_SURVIVE':
    case 'SPEND_SHIELD_TO_SURVIVE':
      return notImplemented(state, 'brief 03', 'DOOM rolls');

    case 'MERCHANT_BUMP':
    case 'MERCHANT_SPIN_WHEEL':
    case 'FAVOR_PURCHASE':
    case 'FAVOR_ASSIGN':
    case 'FAVOR_UNASSIGN':
    case 'LEAVE_SHOP':
      return notImplemented(state, 'brief 07', 'the economy');

    default:
      return reject(state, `unknown action type ${(action as { type: string }).type}`);
  }
}
