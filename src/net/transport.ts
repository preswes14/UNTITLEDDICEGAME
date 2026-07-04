// ============================================================================
// TRANSPORT — the seam between the game and any networking backend.
//
// FULLY SPECIFIED (interface). Implementations:
//   - localTransport.ts    loopback for solo mode and tests (brief-09)
//   - supabaseTransport.ts Supabase Realtime channels     (brief-09)
//
// Protocol (host-authoritative):
//   1. Every client sends ONLY ClientToHost messages.
//   2. The HOST runs the engine. On receiving an action it calls reduce(),
//      then broadcasts HostToClient 'sync' with the new snapshot + events.
//   3. Clients never run reduce(); they render snapshots and animate events.
//      `tick` orders messages; a client that misses a tick requests resync.
//   State is small (a few KB) so full snapshots per action are fine — no
//   delta sync, no divergence bugs. Revisit only if profiling says so.
// ============================================================================

import type { GameAction } from '@engine/actions';
import type { GameEvent } from '@engine/events';
import type { PlayerId, RunState } from '@engine/types';

export type NetMessage = ClientToHost | HostToClient;

export type ClientToHost =
  | { t: 'hello'; playerName: string }
  | { t: 'action'; from: PlayerId; action: GameAction }
  | { t: 'resync-request'; haveTick: number }
  | { t: 'ping' };

export type HostToClient =
  | { t: 'welcome'; seat: PlayerId; snapshot: RunState | null }
  | { t: 'sync'; tick: number; snapshot: RunState; events: GameEvent[] }
  | { t: 'lobby'; players: LobbyPlayer[] }
  | { t: 'paused'; reason: 'disconnect'; missing: PlayerId[] }
  | { t: 'resumed' }
  | { t: 'pong' };

export interface LobbyPlayer {
  seat: PlayerId | null;
  name: string;
  connected: boolean;
}

export interface Transport {
  /** Host: create a room; resolves to the join code (e.g. 4 letters). */
  host(): Promise<string>;
  /** Client: join an existing room by code. */
  join(code: string): Promise<void>;
  send(msg: NetMessage): void;
  onMessage(cb: (msg: NetMessage, senderId: string) => void): () => void;
  /** Presence changes (join/leave/timeout). */
  onPresence(cb: (present: string[]) => void): () => void;
  close(): Promise<void>;
}
