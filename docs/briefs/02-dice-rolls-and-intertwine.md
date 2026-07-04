# Brief 02 — Dice, roll resolution, and the intertwine chain

**Depends on:** 01. **Blocks:** 04 (combat), 06 (encounters), 07 (economy).

## Goal

Implement the game's signature mechanic: rolling a die whose faces can be
values, scratches, intertwines to ally dice, or chaos — resolved as a pure,
animatable chain. Plus the face-operation helpers every upgrade in the game
funnels through.

## You own

- `src/engine/systems/rolls.ts` — `resolveRoll` per the header comment.
- `src/engine/systems/faces.ts` — all five helpers.
- The starter-dice/draft data model: replace brief 01's placeholder with
  real base dice for the 9 talents (`content/` addition: `BASE_DICE` or
  similar — plain 1..20 faces is correct per README; talent identity
  matters for combat approach and narrative, not face values).
- Exotic die *behaviors* hook: `ExoticDieDef.behavior` (`doubler`,
  `wildcard`, `lucky-sevens`, `six-nine`) applied inside `resolveRoll`
  (content data itself is brief 06).
- Tests.

## Spec (README "The Core Innovation" + "Progression & Rewards")

Chain resolution, per step:
- **value face:** final. Total = raw value + accumulated intertwine bonuses.
- **scratched:** re-roll the same die; append a `scratch-reroll` step.
- **intertwine:** immediately roll the *target* die; append an `intertwine`
  step; the face's `bonus` joins the accumulator. Chains may hop dice
  repeatedly.
- **chaos:** roll all 3 of the hero's dice (three sub-draws), take the
  middle value; the chain ends there (riders on the chaos face itself
  still apply).
- **Cycle safety:** cap at `BALANCE.rollChain.maxDepth`; on hitting the cap,
  resolve as one forced re-roll of the ORIGINAL die's value faces only
  (guaranteed termination). Emit nothing special — it just resolves.
- **Naturalness:** natural 1 / natural 20 judged on the final step's RAW
  face value (pre-bonus). Natural 1 ⇒ `doomGained += BALANCE.doom.perNatural1`.
  Riders (`hope`/`doom` fields) on EVERY face in the chain accumulate.
  A `marked` face rolled triggers the Ferryman curse rider (its `doom`).
- **Clamping (REVIEW #24):** `bumpFace` clamps to [1,20]; totals for DC
  comparison may exceed 20 via intertwine bonuses (by design), but a raw
  face value may never leave [1,20]. `faces.ts` is the single enforcement
  point.
- **Provenance:** every helper stamps its `FaceProvenance`; helpers reject
  (throw — these are engine-internal, callers validate first via
  `selectors.isFaceEligible`) modification of faces the source may not touch.

## Legacy reference

`js/dice.js` (roll + double-HOPE bug, REVIEW #5 — natural 20 with a hope
rider must grant exactly the rider + the natural bonus once, decide and
test the rule), `js/config.js` dice definitions, README Easy/Medium/Hard
swap examples (Medium is marked NO LONGER VALID — do not implement
segment-range swaps).

## Required tests

1. Value roll: known seed ⇒ known steps/total; determinism.
2. Intertwine chain A→B: two steps, bonus applied, naturalness from B's face.
3. Cycle A→B→A→…: terminates within maxDepth, resolves to a value.
4. Chaos: middle of three; seed-stable.
5. Scratch: re-roll same die, step recorded.
6. Riders: hope/doom accumulate across chain; marked face triggers doom.
7. Natural 20 with hope rider: exactly the specified total hope (regression
   for REVIEW #5).
8. `bumpFace` clamps; provenance stamped; merchant-source modification of an
   alchemist-touched face throws.
9. Fuzz: 10k random rolls on randomly-mutated dice — never throws, total
   always ≥ 1, resolution always ≤ maxDepth steps.
