# Brief 00 — Conventions & workflow (read before any other brief)

Every brief inherits these rules.

## Ground rules

1. **Read first:** `ARCHITECTURE.md`, then `src/engine/types.ts` end to end,
   then your brief. The README section(s) your brief cites are the design
   spec; where README and legacy code disagree, README wins unless the brief
   says otherwise (the README contains the designer's own corrections).
2. **Don't touch the legacy game.** `index.html`, `js/`, `css/`, `tests/`
   at the repo root stay frozen until brief 13. Legacy files are *reference
   material* — port logic out of them, never import them.
3. **One brief = one PR** (or a small stack). Don't drift into a neighboring
   brief's files; if you need something from an unbuilt dependency, write
   the smallest honest stub and flag it in the PR description.
4. **The stubs are contracts.** Function signatures, type shapes, and the
   laws in file headers are settled. If you genuinely must change a
   signature, change every caller and say so loudly in the PR — types.ts
   changes ripple into saves and the wire format.
5. **Engine purity is non-negotiable.** In `src/engine/`: no DOM, no
   `Math.random`, no `Date.now`, no I/O, no mutation of inputs. All
   randomness via `rng.ts` (`[value, nextState]` threading). All face
   mutation via `systems/faces.ts`.
6. **Numbers live in `content/balance.ts`.** If you find yourself typing a
   gameplay constant in engine code, move it.
7. **Events are facts** ("DOOM_CHANGED +1 reason:natural-1"), never
   presentation instructions. If the UI needs to know something happened,
   emit an event; never let UI diff snapshots.

## Definition of done

- `npm run typecheck` and `npm test` pass.
- New logic has tests (each brief lists the required ones; add more).
- Stub `throw new Error('... not implemented')` lines you were assigned are
  gone; ones you weren't assigned are untouched.
- No `any`, no `@ts-ignore`, no `eslint-disable`-style escape hatches.
- Every REVIEW.md bug listed in your brief has a regression test proving
  the new code doesn't have it.

## Style

- Vanilla TS, functions over classes (exception: nothing in engine;
  sessions/transports may use closures or classes, pick one per file).
- Structural sharing for state updates (`{ ...state, gold: ... }`);
  deep-clone nothing unless leaving the engine.
- Comments explain *constraints and why*, not what the next line does.
- Narrative prose goes in `content/` NARRATIVE keys, never inline in logic.

## Porting from legacy

The prototype encodes a lot of correct-by-playtesting behavior. The
workflow is: read the legacy function, extract the *rule* it implements,
re-express the rule against the new types, and write a test for it. Do not
transliterate legacy code — its bugs (REVIEW.md) came along last time.
