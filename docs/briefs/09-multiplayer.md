# Brief 09 — Sessions & multiplayer transport

**Depends on:** 01 (types; testable with a scripted reducer before other
systems land). **Blocks:** 10, 11.

> **STATUS: CORE DONE.** localTransport hub, host/client sessions (lobby,
> seat claiming, serial application, seq-ordered snapshot sync, anti-spoof,
> disconnect-pause, rejoin-by-name, solo-over-loopback), and the
> supabaseTransport are implemented; session tests green
> (`src/app/session.test.ts`). Remaining: (1) verify supabaseTransport
> against a live Supabase project — it cannot run in CI; (2) heartbeat
> ping/pong timers for timeout-based liveness over real networks
> (localTransport presence is connect/close so tests don't exercise
> timeouts); (3) autosave wiring once brief 08 lands (TODO in session.ts).
> Note the protocol change: sync dedup keys on `seq`, not engine tick —
> rejected actions emit events without advancing the tick.

## Goal

The `Session` glue and both `Transport` implementations, per the protocol
fixed in `src/net/transport.ts`. After this brief, three browser tabs (or
three vitest "clients" over the local hub) can run a lobby, and solo mode
runs through the identical code path over loopback.

## You own

- `src/net/localTransport.ts` — in-process hub (build FIRST; all session
  tests run over it).
- `src/net/supabaseTransport.ts` — Supabase Realtime broadcast channels.
- `src/app/session.ts` — `createHostSession`, `createClientSession`.
- Lobby/seat-claiming flow (pre-`START_RUN`): `hello` → host assigns seats
  in join order → `lobby` broadcasts; host starts the run when 1-3 humans
  are seated (unclaimed seats become host-controlled local seats — that IS
  solo mode when it's all three).
- Tests.

## Spec

- **Host applies actions strictly serially** in arrival order: queue, one
  `reduce()` at a time, `assertInvariants` in dev, broadcast
  `sync{tick, snapshot, events}`, debounced autosave (brief 08 when
  available). Reject-events go in the same sync so the offending client
  can toast (`ACTION_REJECTED.player` scopes who shows it).
- **Clients are dumb:** dispatch → `action` message; render whatever
  snapshot arrives. Out-of-order tick (< last seen) dropped; gap ⇒
  `resync-request`.
- **Presence:** heartbeat ping/pong ~5s, 15s timeout (port constants from
  legacy `js/multiplayer.js`). A seated player dropping ⇒ host broadcasts
  `paused` (game input rejected while paused except save/quit), rejoin by
  name reclaims the seat ⇒ `welcome{seat, snapshot}` + `resumed`.
- **Supabase specifics:** one broadcast channel per room
  (`room:{CODE}` — 4-letter code scheme from legacy, no I/O letters);
  credentials via `import.meta.env.VITE_SUPABASE_URL` / `_ANON_KEY`
  (add `.env.example`; legacy hard-coded them in source). Messages are
  already-serializable `NetMessage`s — no game types in this file beyond
  imports.
- **Security posture:** the host trusts seat claims within a room but the
  reducer re-validates every action (wrong-seat ⇒ rejected). Never eval or
  innerHTML anything from the wire. Player names are untrusted strings —
  cap length, strip control chars at the session boundary.

## Required tests (all over localTransport)

1. Lobby: 3 joins ⇒ seats 0,1,2; 4th join refused/spectator (pick + test).
2. Action round-trip: client dispatch ⇒ host reduce ⇒ all clients' snapshot
   tick advances; rejected action reaches only-loser toast semantics.
3. Serial application: 50 concurrent dispatches ⇒ final tick = accepted
   count, deterministic final state given arrival order.
4. Resync: client with stale tick requests and receives current snapshot.
5. Disconnect: missed heartbeats ⇒ paused broadcast; rejoin ⇒ same seat,
   current snapshot, resumed.
6. Solo: host session with localSeats [0,1,2] plays actions for all seats
   without any transport peer.
