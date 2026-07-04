# Brief 05 — Overworld map generation & voting

**Depends on:** 01. **Blocks:** 06 (nodes host encounters), 13.

## Goal

Slay-the-Spire-style stage maps with the README's specific shape rules, and
the party voting flow for choosing paths.

## You own

- `src/engine/systems/map.ts` — everything in the stub.
- Reducer arms: `CAST_VOTE`, `RESOLVE_VOTE`.
- Tests.

## Spec (README "Encounters & Map Structure")

Structure per stage (data from `STAGES[stage]`, brief 06 — until it exists,
code against the `StageDef` type with a test fixture):

- intro node → segment A (2-4 encounter rows) → MINIBOSS → segment B →
  BOSS → conclusion node.
- Forks offer ~3 choices; choosing a lane commits you for the 2-4 nodes of
  that segment before lanes re-fork. Add occasional "path drift" — a lane
  merging into a neighbor mid-segment — so lanes differ in length/richness.
- **Merchant guarantee:** EXACTLY ONE lane of segment B ends with a
  Merchant node immediately before the boss; other lanes may get merchants
  by chance earlier but never in that final slot (README Merchant section).
- Node encounter assignment: draw from the stage's pool honoring
  `EncounterDef.stagePool` and kind mix (good/bad/neutral roughly per the
  README encounter chart; exact mix is a `balance.ts` knob you add:
  `mapGen: { kindWeights, laneCount, segmentLengthRange }`).
- **Roll all randomness at generation time** into `MapNode.params`
  (combat DCs/thresholds/rewards via brief 04's `rollApproachDCs` when
  available — until then leave `params.dcs` unset and let combat roll at
  start; reconcile in whichever brief lands second).
- Voting: one vote per seat among `available` nodes; `RESOLVE_VOTE` on all
  three votes (host auto-dispatches; solo UI casts three votes directly —
  no special solo path in the engine, REVIEW #14 is a UI fix). Majority
  wins; ties break via `rng.pick`. Party moves; node's encounter starts;
  siblings lock.

## Required tests

1. 200 seeds × stages 1-5: every generated map passes a `validateMap`
   helper you write — connectivity start→boss on every lane, exactly one
   final-slot merchant, miniboss present, node ids unique, all
   connections resolve, encounter ids in stage pool.
2. Determinism: same seed ⇒ identical map JSON.
3. Voting: majority, tie-break determinism, double-vote rejected,
   vote for locked node rejected.
4. Fork commitment: after choosing a lane, `available` nodes are only that
   lane's until the next fork row.
