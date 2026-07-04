// ============================================================================
// SESSION — binds engine + transport + UI together. The only stateful glue.
//
// STATUS: IMPLEMENTED (brief 09 core). Remaining for brief 09: heartbeat
// timers over real networks (localTransport presence is connect/close, so
// timeout-based liveness is exercised only with the Supabase transport) and
// autosave wiring once brief 08 lands (see TODO below).
//
// HostSession (also used for solo, over localTransport):
//   - owns the authoritative RunState; applies actions ONE AT A TIME in
//     arrival order through reduce(); runs invariants (logs, never crashes
//     a live game); broadcasts full-snapshot 'sync' after each action.
// ClientSession:
//   - sends the local seat's actions; renders received snapshots; never
//     mutates state locally (no prediction in v1).
//
// Seat security model: the host maps transport endpoint ids -> seats on
// 'hello' and stamps/checks the seat on every incoming action; the reducer
// re-validates turn order on top. Player names are untrusted: trimmed,
// length-capped, control chars stripped, and only ever rendered via
// textContent in the UI layer.
// ============================================================================

import { reduce } from '@engine/reducer';
import { assertInvariants } from '@engine/invariants';
import { startRun } from '@engine/lifecycle';
import type { GameAction } from '@engine/actions';
import type { GameEvent } from '@engine/events';
import type { PlayerId, RunState } from '@engine/types';
import type { LobbyPlayer, NetMessage, Transport } from '@net/transport';

export interface Session {
  getState(): RunState | null;
  subscribe(cb: (state: RunState, events: GameEvent[]) => void): () => void;
  dispatch(action: GameAction): void;
  localSeats(): PlayerId[];
  close(): Promise<void>;
}

const ALL_SEATS: PlayerId[] = [0, 1, 2];

export function sanitizeName(raw: string): string {
  // eslint-disable-next-line no-control-regex
  const cleaned = raw.replace(/[\u0000-\u001f\u007f]/g, '').trim();
  return (cleaned || 'Anon').slice(0, 24);
}

// ---------------------------------------------------------------------------
// Host
// ---------------------------------------------------------------------------

export function createHostSession(opts: {
  transport: Transport;
  localSeats: PlayerId[];
  initialState: RunState | null;
}): Session {
  const { transport } = opts;
  let state: RunState | null = opts.initialState;
  const subscribers = new Set<(s: RunState, e: GameEvent[]) => void>();

  interface Remote { seat: PlayerId; name: string; connected: boolean }
  const remotes = new Map<string, Remote>(); // endpointId -> seat claim
  let paused = false;
  let seq = 0; // broadcast sequence (independent of engine tick)

  function lobby(): LobbyPlayer[] {
    const players: LobbyPlayer[] = opts.localSeats.map((seat) => ({
      seat, name: `Player ${seat + 1}`, connected: true,
    }));
    for (const r of remotes.values()) {
      players.push({ seat: r.seat, name: r.name, connected: r.connected });
    }
    return players;
  }

  function notify(events: GameEvent[]): void {
    if (state === null) return;
    for (const cb of subscribers) cb(state, events);
  }

  function broadcastSync(events: GameEvent[]): void {
    if (state === null) return;
    seq += 1;
    transport.send({ t: 'sync', seq, tick: state.tick, snapshot: state, events });
  }

  /** The single choke point: actions apply strictly one at a time (JS is
   *  single-threaded and reduce() is synchronous, so arrival order IS
   *  application order). */
  function apply(action: GameAction): void {
    if (state === null) {
      if (action.type === 'START_RUN') {
        state = startRun(action);
        checkInvariants();
        notify([]);
        broadcastSync([]);
      }
      return; // no run: everything else is a no-op
    }
    const result = reduce(state, action);
    state = result.state;
    checkInvariants();
    notify(result.events);
    broadcastSync(result.events);
    // TODO(brief-08): debounced autosave here.
  }

  function checkInvariants(): void {
    if (state === null) return;
    try {
      assertInvariants(state);
    } catch (err) {
      // Engine bug: log loudly but never kill a live party's game.
      console.error('[session] invariant violation after reduce:', err);
    }
  }

  function freeSeat(): PlayerId | null {
    const taken = new Set<PlayerId>([
      ...opts.localSeats,
      ...[...remotes.values()].map((r) => r.seat),
    ]);
    return ALL_SEATS.find((s) => !taken.has(s)) ?? null;
  }

  function handleMessage(msg: NetMessage, senderId: string): void {
    switch (msg.t) {
      case 'hello': {
        const name = sanitizeName(msg.playerName);
        // Rejoin: a disconnected remote with the same name reclaims its seat.
        const rejoin = [...remotes.entries()].find(
          ([, r]) => !r.connected && r.name === name,
        );
        let seat: PlayerId | null;
        if (rejoin) {
          remotes.delete(rejoin[0]);
          seat = rejoin[1].seat;
        } else {
          seat = freeSeat();
        }
        if (seat !== null) remotes.set(senderId, { seat, name, connected: true });
        transport.send({ t: 'welcome', forClient: senderId, seat, snapshot: state });
        transport.send({ t: 'lobby', players: lobby() });
        if (rejoin && paused && missingSeats().length === 0) {
          paused = false;
          transport.send({ t: 'resumed' });
        }
        break;
      }
      case 'action': {
        const remote = remotes.get(senderId);
        if (!remote || !remote.connected) return; // unknown sender: drop
        if (paused) return; // game paused on disconnect: input rejected
        // Anti-spoof: the envelope's claimed seat must match the seat this
        // endpoint was welcomed into. The reducer still gates turn order.
        if (msg.from !== remote.seat) return;
        apply(msg.action);
        break;
      }
      case 'resync-request': {
        broadcastSync([]);
        break;
      }
      case 'ping':
        transport.send({ t: 'pong' });
        break;
      default:
        break; // host ignores host-to-client messages echoed back
    }
  }

  function missingSeats(): PlayerId[] {
    return [...remotes.values()].filter((r) => !r.connected).map((r) => r.seat);
  }

  function handlePresence(present: string[]): void {
    let changed = false;
    for (const [id, remote] of remotes) {
      const isPresent = present.includes(id);
      if (remote.connected && !isPresent) {
        remote.connected = false;
        changed = true;
      }
    }
    if (!changed) return;
    transport.send({ t: 'lobby', players: lobby() });
    const missing = missingSeats();
    if (missing.length > 0 && state !== null && !paused) {
      paused = true;
      transport.send({ t: 'paused', reason: 'disconnect', missing });
    }
  }

  const unsubMsg = transport.onMessage(handleMessage);
  const unsubPresence = transport.onPresence(handlePresence);

  return {
    getState: () => state,
    subscribe: (cb) => {
      subscribers.add(cb);
      return () => subscribers.delete(cb);
    },
    dispatch: (action) => apply(action),
    localSeats: () => [...opts.localSeats],
    close: async () => {
      unsubMsg();
      unsubPresence();
      subscribers.clear();
      await transport.close();
    },
  };
}

// ---------------------------------------------------------------------------
// Client
// ---------------------------------------------------------------------------

export async function createClientSession(opts: {
  transport: Transport;
  roomCode: string;
  playerName: string;
}): Promise<Session> {
  const { transport } = opts;
  let state: RunState | null = null;
  let lastSeq = -1;
  let seat: PlayerId | null = null;
  const subscribers = new Set<(s: RunState, e: GameEvent[]) => void>();

  await transport.join(opts.roomCode);

  const welcome = new Promise<void>((resolve, reject) => {
    const unsub = transport.onMessage((msg) => {
      if (msg.t !== 'welcome' || msg.forClient !== transport.endpointId) return;
      unsub();
      if (msg.seat === null) {
        reject(new Error('room is full'));
        return;
      }
      seat = msg.seat;
      if (msg.snapshot) state = msg.snapshot;
      resolve();
    });
  });

  const unsubSync = transport.onMessage((msg) => {
    if (msg.t !== 'sync') return;
    if (msg.seq <= lastSeq) return; // stale/duplicate: drop
    state = msg.snapshot;
    lastSeq = msg.seq;
    for (const cb of subscribers) cb(msg.snapshot, msg.events);
  });

  transport.send({ t: 'hello', playerName: sanitizeName(opts.playerName) });
  await welcome;

  return {
    getState: () => state,
    subscribe: (cb) => {
      subscribers.add(cb);
      return () => subscribers.delete(cb);
    },
    dispatch: (action) => {
      if (seat === null) return;
      transport.send({ t: 'action', from: seat, action });
    },
    localSeats: () => (seat === null ? [] : [seat]),
    close: async () => {
      unsubSync();
      subscribers.clear();
      await transport.close();
    },
  };
}
