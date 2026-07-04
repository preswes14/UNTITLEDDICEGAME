# Brief 08 — Save / load

**Depends on:** 01. **Blocks:** 10, 13.

## Goal

Three-slot localStorage persistence. Deliberately small because the
architecture already did the work: `RunState` is plain data containing its
own RNG and mid-encounter runtime, so a save is an envelope around
`JSON.stringify(state)` and mid-combat resume is free.

## You own

- `src/app/save.ts` — everything in the stub.
- Envelope + versioning policy.
- Tests (vitest with a localStorage shim, or `@vitest/environment-jsdom`
  — your call, keep it light).

## Spec

- Key scheme: `udg:v{schemaVersion}:slot{0|1|2}`. Envelope
  `{ schemaVersion, savedAt, slot, state }`. `savedAt` from the caller
  (app layer), not inside the engine.
- `listSaves` reads envelopes only (cheap metadata: stage, hero names,
  savedAt) without hydrating full state.
- Load validates: schemaVersion match (pre-1.0 policy: older version ⇒
  return null + console.warn, do NOT attempt legacy `js/save.js` migration
  — different game shape entirely), then `assertInvariants(state)`; a save
  that fails invariants returns null rather than loading corruption
  (legacy shipped corrupted saves around, REVIEW #9).
- `autosave`: trailing-edge debounce ~800ms, `requestIdleCallback` when
  available (REVIEW #21: legacy wrote synchronously up to 3× per roll).
  Expose `flushAutosave()` for pagehide/beforeunload.
- Quota/exception safety: storage full or unavailable ⇒ warn + carry on;
  never crash the game over persistence.

## Required tests

1. Round trip: save → load ⇒ deep-equal state; RNG continues identically
   (draw after load matches draw without save/load).
2. Mid-combat state round-trips (fixture from testkit with combat phase).
3. Corrupted JSON / failed invariants / version mismatch ⇒ null, no throw.
4. Debounce: 10 rapid autosaves ⇒ 1 write (fake timers); flush forces it.
5. `listSaves` on empty/partial/full slots.
