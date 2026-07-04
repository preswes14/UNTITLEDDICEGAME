# Brief 10 — Main-screen UI (the shared "TV")

**Depends on:** 09 (Session; mockable earlier), 08. **Blocks:** 13.

## Goal

The communal screen everyone watches: title/lobby, overworld map, encounter
scenes, combat with the 3D dice tray, and all the party-state chrome. Layout
and art direction should FEEL like the prototype (port `css/styles.css`
liberally); the code underneath follows `src/ui/README.md` laws.

## You own

- `src/app/main.ts` boot flow (host path; brief 11 adds the `?room=` path).
- `src/ui/main/**`: one screen module per `Phase.kind` —
  `title` (new/continue/save slots via brief 08, host-lobby with room code),
  `draft`, `favorShop`, `overworld`, `encounter`, `combat`,
  `stageTransition`, `victory`, `defeat` — plus components:
  DOOM meter, HOPE/shield/gold/favor HUD, the traffic light, approach
  progress bars, narration panel.
- `src/ui/main/animate.ts`: a serial animation queue consuming `GameEvent[]`.
- `src/ui/dice3d/`: port the three.js icosahedron renderer from
  `js/dice3d.js` (it works; modernize to module imports of `three` from
  npm instead of CDN global).
- A Playwright smoke test is brief 13's; you provide `data-testid`s.

## Spec highlights

- **Screen router:** `session.subscribe` → route on `phase.kind`, mount/
  unmount screen modules (`mount(el, session) => cleanup`). Clean up every
  interval/listener on unmount (legacy leaked them, REVIEW #23).
- **Animation queue:** events from one sync batch play in order (roll
  chain tumbles → meter changes → narration), state re-render happens
  after the queue drains (or immediately for snapshot-only changes). Roll
  animations happen HERE, on the main screen — phones only stage/confirm
  (README "rolling animation plays ON MAIN SCREEN").
- **Roll chain presentation:** `ROLL_RESOLVED.resolution.steps` is a
  ready-made storyboard — animate each hop (camera/emphasis moves to the
  ally's die on intertwine steps). The traffic light flips per seat;
  3 greens = flash + reset (README's "sideways street light").
- **DOOM roll moment:** `DOOM_ROLL_RESOLVED` gets a dramatic full-screen
  treatment; the survive-spend decision (brief 03) renders as a party
  prompt.
- **Overworld:** vertical scrolling map from `state.map` (rows, lanes,
  fork highlighting, vote tallies on nodes as votes arrive). Legacy look:
  `js/ui.js` renderMap + styles.
- **Face flourishes** while you're in there (README "Visual Flourishes"):
  nat-1 red glow, nat-20 gold glow, face-change before/after popover on
  `FACE_CHANGED`.
- **Solo controls:** when `session.localSeats()` is all seats, the main
  screen doubles as the input surface: seat-colored stage/confirm controls
  inline (this is where REVIEW #14's voting friction dies: solo voting is
  one click dispatching three `CAST_VOTE`s).
- **Text safety:** all dynamic strings via `textContent`. Zero
  string-built innerHTML with remote data (REVIEW #22).

## Acceptance

- With engine briefs 01-07 done: a full solo run is playable start to
  finish on this screen alone.
- With only 01: title → lobby → draft placeholder renders and dispatches
  (define fixtures/mocks as needed — don't block on other briefs to start).
- No timer/listener leaks across 100 screen transitions (test with a
  mount/unmount loop asserting document listener counts).
