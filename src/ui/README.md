# UI layer

**STATUS: to be built** — briefs 10 (main screen) and 11 (player controller).

Two distinct surfaces share this directory:

```
ui/
  main/          # the shared "TV" screen (host device / stream)
    screens/     # one module per engine Phase.kind: title, draft, favorShop,
                 # overworld, encounter, combat, stageTransition, victory, defeat
    components/  # doomMeter, hopeTracker, trafficLight, approachBars, goldFavorHud
    animate.ts   # event -> animation queue (rolls play here, not on phones)
  controller/    # the per-player phone view (joins via ?room=CODE)
    screens/     # lobby, myDice, staging, encounterPicks, favorShop
    components/  # dieInspector (face list modal), dragToRoll, confirmSheet
  dice3d/        # three.js icosahedron renderer, used by both surfaces
  theme.css
```

Hard rules:

1. **UI never touches engine internals.** Read state via selectors, change
   state only by `session.dispatch(action)`. If a screen needs a derived
   fact, add a selector to `engine/selectors.ts`.
2. **Events drive animation; state drives layout.** Render the current
   snapshot statelessly, then play the events that arrived with it. Never
   infer "what just happened" by diffing snapshots.
3. **Escape XSS by default.** Player names are remote input. Use
   `textContent`/attribute assignment, never string-concatenated
   `innerHTML` (legacy bug — REVIEW.md #22).
4. Vanilla TS + DOM is fine (matches the legacy codebase's spirit); no
   framework unless a brief says otherwise. Keep each screen a
   `mount(container, session): () => void` function.

Port the good parts of the prototype rather than rediscovering them: layout
and styling from `css/styles.css` / `css/player-view.css`, the 3D dice from
`js/dice3d.js`, drag-to-roll and confirmation UX from `js/playerView.js` /
`js/confirmation.js`, and screen flow from `js/screens.js` / `js/ui.js`.
