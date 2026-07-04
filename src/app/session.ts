// ============================================================================
// SESSION — binds engine + transport + UI together. The only stateful glue.
//
// STATUS: STUB. Implement per docs/briefs/09-multiplayer.md.
//
// Two roles, one class each:
//
// HostSession (also used for solo, over localTransport):
//   - owns the authoritative RunState
//   - queues incoming actions, applies reduce() ONE AT A TIME in arrival
//     order (no interleaving), runs assertInvariants in dev
//   - broadcasts 'sync' after each action; autosaves (debounced — the
//     legacy synchronous save-on-every-meter-change froze combat,
//     REVIEW.md #21)
//
// ClientSession:
//   - sends the local player's actions; applies received snapshots
//   - never mutates state locally (no prediction in v1)
//
// Both expose the same observable surface so UI code doesn't care which
// role it's rendering for:
//   getState(): RunState | null
//   subscribe(cb: (state: RunState, events: GameEvent[]) => void): () => void
//   dispatch(action: GameAction): void   // local seat's intent
//   localSeats(): PlayerId[]             // solo host = [0,1,2]
// ============================================================================

import type { GameAction } from '@engine/actions';
import type { GameEvent } from '@engine/events';
import type { PlayerId, RunState } from '@engine/types';
import type { Transport } from '@net/transport';

export interface Session {
  getState(): RunState | null;
  subscribe(cb: (state: RunState, events: GameEvent[]) => void): () => void;
  dispatch(action: GameAction): void;
  localSeats(): PlayerId[];
  close(): Promise<void>;
}

export function createHostSession(opts: {
  transport: Transport;
  localSeats: PlayerId[];
  initialState: RunState | null;   // null until START_RUN
}): Session {
  void opts;
  throw new Error('createHostSession not implemented (brief-09)');
}

export function createClientSession(opts: {
  transport: Transport;
  roomCode: string;
  playerName: string;
}): Promise<Session> {
  void opts;
  throw new Error('createClientSession not implemented (brief-09)');
}
