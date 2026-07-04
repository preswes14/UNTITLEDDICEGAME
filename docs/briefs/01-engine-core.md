# Brief 01 — Engine core: reducer, invariants, testkit, run lifecycle

**Depends on:** nothing (rng.ts is already implemented).
**Blocks:** every other engine brief. Build this first.

> **STATUS: DONE.** reducer dispatch, invariants, lifecycle.startRun,
> testkit, waitingOn, and all required tests are implemented and green
> (`src/engine/reducer.test.ts`). Still open from this brief: the
> `CONTINUE` stage-flow arms (they belong to briefs 05/07/12 as those
> phases come alive). This document remains the spec of record.

## Goal

Make the engine skeleton stand up: a working `reduce()` dispatcher, run
creation, the phase machine's plumbing, invariant checks, and the test
fixtures every later brief will use. After this brief, `reduce()` handles
`START_RUN`, `ABANDON_RUN`, and `CONTINUE`, rejects everything else
gracefully, and a determinism test passes in CI.

## You own

- `src/engine/reducer.ts` — implement dispatch (keep it thin; unimplemented
  systems keep throwing their brief-tagged errors for now, but *unknown*
  actions and *wrong-phase* actions must `reject()` instead of throwing).
- `src/engine/invariants.ts` — implement the checklist in the file header.
- `src/engine/selectors.ts` — implement `waitingOn` for the phases that
  exist so far; leave the brief-tagged ones.
- **New:** `src/engine/lifecycle.ts` — `startRun(action)`: build the initial
  `RunState` (seed → rng, 3 heroes with placeholder starter dice until
  brief 02 defines the draft, stage 0, `phase: {kind:'draft',...}`,
  meters from `BALANCE`). `ABANDON_RUN`, `CONTINUE` transitions.
- **New:** `src/engine/testkit.ts` — fixtures: `makeTestRun(seed, overrides?)`,
  `makeDie(talent, faces?)`, `applyAll(state, actions)` helper that runs
  invariants after each step.
- Tests for all of the above.

## Spec notes

- `RunState.tick` increments by exactly 1 per *accepted* action; rejected
  actions leave state unchanged (same object identity is fine and ideal).
- `reduce()` must be total over arbitrary `GameAction` values from the
  network — malformed enough to defeat the type system should still land in
  `reject()`, not a crash. Validate actor: an action carrying `player` is
  rejected if the phase says it isn't that seat's turn (`waitingOn`).
- Starter dice until brief 02: each hero gets one die per approach, faces
  1..20, provenance 'base'. Hero colors fixed blue/red/green (README
  "The Colors"); names from the action.
- Legacy reference: `js/state.js` (state shape + reset bugs, REVIEW #7),
  `js/main.js` (boot flow).

## Required tests

1. Determinism: same seed + same action list ⇒ `JSON.stringify` -identical
   states, twice over. **This test is the CI keystone — name it clearly.**
2. Rejection: unknown action type, wrong-phase action, wrong-seat action ⇒
   state unchanged (`toBe` identity), single `ACTION_REJECTED` event.
3. Invariants: hand-corrupt a state (gold = NaN, 19-face die, intertwine
   pointing at itself) and assert `assertInvariants` throws with a message
   naming the problem.
4. START_RUN: initial state passes invariants; meters match `BALANCE`
   (doom starts at `BALANCE.doom.startingDoom`); JSON round-trip is lossless.

## Acceptance

`npm test` green; `applyAll` used by at least one test; no system stubs
implemented beyond lifecycle (stay in scope).
