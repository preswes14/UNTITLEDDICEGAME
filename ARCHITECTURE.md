# UNTITLED DICE GAME — Architecture

This document is the map for turning the prototype into a real game. Read it
first; then pick up a brief from `docs/briefs/` and implement it. The
prototype at the repo root (`index.html` + `js/`) stays playable and
untouched until the new app reaches parity (brief 13).

- **What the game is:** `README.md` (the design doc — mechanics, encounters,
  bosses, narrative, balance tables).
- **What was wrong with the prototype:** `REVIEW.md` (24 findings; the
  architectural ones motivated everything below).
- **Who builds what, in what order:** `docs/briefs/` (14 self-contained work
  packages with acceptance criteria).

---

## 1. Why re-architect at all

The prototype works, and a lot of it is good — the mechanics are proven, the
tutorial lands, the encounter variety is real. But it has three structural
problems that patching can't fix:

1. **One global mutable `gameState`, mutated from everywhere.** ~15,000 lines
   across 15 script tags share one scope. Save bugs (REVIEW #7–#9), the NaN
   gold bug (#1), and cross-run state leaks all trace back to "anything can
   write anything, and serialization is a hand-maintained copy of the state
   shape."
2. **`Math.random()` everywhere.** Rolls aren't reproducible, so multiplayer
   sync means shipping every derived result over the wire and praying, saves
   can't capture mid-encounter randomness faithfully, and no bug involving a
   roll can be replayed.
3. **Rules, content, and DOM are interleaved.** Encounter logic builds HTML;
   combat logic calls UI functions; narrative strings live inside switch
   statements. Nothing can be tested without a browser, and adding an
   encounter means touching five files.

## 2. The architecture in one paragraph

The game becomes a **pure, deterministic engine** — a single reducer
`reduce(state, action) → { state, events }` over a plain-data `RunState`
that contains its own RNG state — surrounded by thin shells: a **content
layer** (encounters, enemies, dice, narrative as data), a **transport layer**
(host-authoritative multiplayer where clients send actions and receive
snapshots), an **app layer** (session glue + saves = `JSON.stringify(state)`),
and a **UI layer** (renders snapshots, animates events, dispatches actions).
Determinism is the keystone: it makes saves trivial, multiplayer sync
trivial, and every mechanic unit-testable in Node.

```
            actions                    actions
 ┌──────────┐  │   ┌────────────────┐   │  ┌──────────────────┐
 │ Main-    │  ▼   │      APP       │   ▼  │ Player controller │
 │ screen UI│◄─────│ Session (host) │◄─────│ UI (phones)       │
 │ (the TV) │ snap │  ┌──────────┐  │ snap │  via Transport    │
 └──────────┘ +evts│  │  ENGINE  │  │ +evts└──────────────────┘
                   │  │ reduce() │  │
                   │  └────┬─────┘  │        ┌──────────────┐
                   │       │ reads  │        │  NET          │
                   │  ┌────▼─────┐  │        │ localTransport│
                   │  │ CONTENT  │  │        │ supabase...   │
                   │  └──────────┘  │        └──────────────┘
                   │  saves: JSON   │
                   └────────────────┘
```

## 3. Layers and their laws

### `src/engine/` — the rules (pure)
- **`types.ts`** — the domain model. Single source of truth; also the save
  format and the wire format. Fully written; read it before anything else.
- **`actions.ts` / `events.ts`** — the input and output vocabulary. Fully
  written.
- **`rng.ts`** — seeded, serializable RNG (sfc32). **Fully implemented with
  tests** — the reference for engine code style. Every draw returns
  `[value, nextState]`; RNG state lives inside `RunState`.
- **`reducer.ts`** — thin dispatcher to `systems/*`. Never throws on bad
  network input; returns `ACTION_REJECTED` events instead.
- **`systems/`** — one module per mechanic: `rolls` (the intertwine chain
  resolver), `faces` (the only code allowed to modify die faces), `doom`,
  `combat`, `map`, `encounters` (interpreter over content), `economy`.
- **Laws:** no DOM, no `Math.random`, no `Date`, no I/O, no mutation of
  inputs. `JSON.parse(JSON.stringify(state))` must round-trip. All face
  mutation goes through `systems/faces.ts` (clamping + provenance).
  `invariants.ts` runs after every reduce in dev and tests.

### `src/content/` — the game's substance (data)
- **`schema.ts`** — `EncounterDef`, `Effect`, `EnemyDef`, `ExoticDieDef`,
  `FavorUpgradeDef`, `StageDef`. Fully written.
- **`balance.ts`** — every tunable number, lifted from README tables. Fully
  written. Engine code never hard-codes gameplay numbers.
- **`index.ts`** — registries (`ENCOUNTERS`, `ENEMIES`, `EXOTIC_DICE`,
  `FAVOR_STORE`, `STAGES`, `NARRATIVE`) to be populated by porting
  `js/config.js` and the README tables.
- **Laws:** data only — no functions, no engine imports beyond types.
  Narrative prose lives in the `NARRATIVE` registry keyed by string ids, so
  writers iterate without touching logic. Adding an encounter = adding a
  content file, zero engine changes.

### `src/net/` — moving messages (dumb pipes)
- **`transport.ts`** — the `Transport` interface + `NetMessage` protocol.
  Fully written. Host-authoritative: clients send actions; the host runs the
  engine and broadcasts full snapshots + events. Snapshots are a few KB —
  no deltas, no client prediction, no divergence class of bugs.
- **`localTransport.ts`** — in-process loopback. Solo mode IS multiplayer
  over loopback, so there is exactly one code path.
- **`supabaseTransport.ts`** — Supabase Realtime channels (port the
  room-code/heartbeat handling from `js/multiplayer.js`; leave the game
  logic behind).

### `src/app/` — glue (the only stateful code)
- **`session.ts`** — `HostSession` (owns authoritative state, serializes
  action application, autosaves debounced) and `ClientSession` (renders
  snapshots). Same `Session` interface either way, so UI never branches on
  role.
- **`save.ts`** — 3 slots, envelope + `JSON.stringify(state)`. The state
  contains its RNG, mid-encounter runtime, everything — mid-combat resume
  falls out for free.
- **`main.ts`** — composition root; URL routing (plain load = host/TV,
  `?room=CODE` = phone controller).

### `src/ui/` — presentation (thin)
Two surfaces: the shared **main screen** (the "TV": overworld map, encounter
art, the 3D dice tray where all rolls animate, DOOM meter, traffic light)
and the **player controller** (each player's phone: their three dice,
private face inspection, drag-to-stage, tap-to-confirm). Laws in
`src/ui/README.md`: selectors + dispatch only; state renders layout, events
drive animation; no innerHTML with remote strings.

## 4. Key decisions and why

| Decision | Why |
|---|---|
| **TypeScript, strict** | Ten different agents will code against these contracts; the compiler is the referee. The domain (face unions, phase machine, action/event unions) is exactly what discriminated unions are for. |
| **Vite + vitest** | Zero-config for a vanilla-TS DOM app, instant dev server, and the engine tests run in Node with no browser. |
| **Event-sourced reducer** | One choke point for all state change kills the "anything mutates anything" bug class; events give the UI an animation feed and tests an assertion surface. |
| **RNG in state** | Reproducible rolls ⇒ saves capture everything, bugs replay from a seed, and the host never has to ship derived randomness. |
| **`Face` as tagged union with provenance** | The legacy parallel arrays (`faces`/`swaps`/`hopeSegments`/`crossedSegments`) were the #1 source of dice bugs. Provenance makes the Merchant "warranty" rule (README) checkable in one place. |
| **Host-authoritative full snapshots** | State is tiny. Full snapshots make late-join, reconnect, and resync one code path and eliminate divergence. |
| **Solo = multiplayer over loopback** | The legacy code branched on `gameMode` in dozens of places (and still had solo-only voting friction, REVIEW #14). One path, with `localSeats()` = `[0,1,2]` in solo. |
| **Content as data + interpreter** | The game design (README) is mostly tables. Tables should be data. Writers and balance passes shouldn't require code review of logic. |
| **Legacy stays until parity** | The prototype is the playable spec and the only demo. It keeps deploying from the repo root while `src/` grows; cutover is brief 13. |

## 5. Build order (dependency graph)

```
 01 engine-core ──┬── 02 dice-rolls ──┬── 04 combat ──┐
 (types glue,     │                   │               │
  reducer, rng ✅)│                   ├── 03 doom ────┤
                  │                   │               ├── 12 tutorial/narrative
                  ├── 05 map-gen ─────┤               │
                  │                   ├── 07 economy ─┤
                  ├── 06 encounters ──┘               │
                  │                                   │
                  ├── 08 save-load                    │
                  └── 09 multiplayer(+session) ── 10 main-screen UI ── 11 controller UI
                                                                            │
                                                        13 parity & cutover ┘
```

Briefs 02/03/05/06/08 are independent after 01 and can be built in
parallel. UI (10/11) needs 09's `Session` but can start against a mocked
session as soon as 01's types settle. Brief 13 is last and includes the
bug-ledger regression tests and the GitHub Pages cutover.

## 6. Testing strategy

- **Engine:** vitest in Node. Every system brief lists required tests.
  Pattern: build a state (test fixtures in `src/engine/testkit.ts`, created
  in brief 01), apply actions, assert on events + state. A
  "fuzz" test drives thousands of random-but-legal actions through
  `reduce()` with `assertInvariants()` after each — this is the cheapest
  way to catch state corruption.
- **Determinism gate (CI):** same seed + same action list ⇒ byte-identical
  final state JSON. This single test protects saves, multiplayer, and
  replays all at once.
- **Content:** schema-validation tests — every `textKey` resolves in
  `NARRATIVE`, every `encounterId` on every stage map resolves, face values
  in content are within [1,20], boss numbers match `balance.ts`.
- **UI:** keep it thin enough that engine tests carry the weight; Playwright
  smoke test (title → new run → first encounter → a roll) at cutover.

## 7. Conventions

See `docs/briefs/00-conventions-and-workflow.md` — code style, PR scope,
what "done" means, and the rules every brief inherits.
