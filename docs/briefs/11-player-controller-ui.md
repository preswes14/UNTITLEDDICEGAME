# Brief 11 — Player controller UI (phones)

**Depends on:** 09, 10 (dice3d + theme shared). **Blocks:** 13.

## Goal

The Jackbox-style per-player surface: join a room, see YOUR three dice
privately in 3D, inspect faces, stage & confirm rolls, make encounter
picks, and vote — mobile-first. The prototype's `js/playerView.js`,
`js/confirmation.js`, and `css/player-view.css` got this UX largely right;
port the feel, not the plumbing (`PLAN-private-dice-viewing.md` documents
the original design decisions — three.js dice, confirmations only for
dangerous actions, disconnect pauses, free-text names).

## You own

- Client boot path in `src/app/main.ts` (`?room=CODE` → join form →
  `createClientSession`).
- `src/ui/controller/**`: screens — `join` (code + name), `lobby`,
  `myDice` (default: rotatable/zoomable 3D trio), `staging`
  (drag-to-center + tap-to-confirm per README), `encounterPicks`
  (renders the current step's `StepInput`s: die/face/ally/number pickers),
  `vote`, `favorShop` (assign/unassign; purchases confirm), `waiting`
  (someone else's turn: show whose via `selectors.waitingOn`).
- Components: `dieInspector` (tap a die → face-list modal showing values,
  scratches, intertwine links "→ Red's Stab", riders, provenance-locked
  badge), `confirmSheet` (only for dangerous/irreversible actions:
  confirming a roll, buying, gambling a face on the Wheel).
- Tests: component-level where valuable; the flow test is brief 13's.

## Spec highlights

- **Privacy is the point:** the controller shows only
  `state.heroes[mySeat]` detail. Other heroes appear as summaries. (It's
  social privacy — data is in the snapshot; do NOT invent a redaction
  layer, the design explicitly wants shared state with private *viewing*.)
- **Turn awareness:** big obvious "YOUR TURN" vs "waiting on Blue" states
  driven by `waitingOn(state)`; controls render disabled-with-reason when
  it's not your turn (dispatching anyway is harmless — the reducer rejects
  and your toast shows `ACTION_REJECTED.reason`).
- **Staging UX:** drag die to center = `STAGE_DIE` (shows on the TV),
  drag back = `UNSTAGE_DIE`, tap = `CONFIRM_ROLL`. The roll animates on
  the TV; the phone shows a compact result echo.
- **Encounter picks** must enforce eligibility client-side for good UX
  (grey out merchant-ineligible faces with the "warranty voided" tooltip
  via `selectors.isFaceEligible`) while relying on the reducer as the
  actual gate.
- **Reconnect:** the join screen remembers room+name in sessionStorage and
  auto-rejoins on reload (session layer already reclaims the seat).
- Mobile-first CSS; touch targets ≥ 44px; test in a 375×667 viewport.

## Acceptance

- Three tabs + one TV tab over localTransport hub: full combat round where
  each tab stages, confirms, and sees results, with turn gating correct.
- Face inspector correctly renders every `Face` kind from a fixture die
  containing all four kinds + riders.
- No innerHTML with names/free text (REVIEW #22).
