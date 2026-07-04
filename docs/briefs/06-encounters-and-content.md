# Brief 06 — Encounter interpreter + porting all content

**Depends on:** 01, 02 (face ops for effects). **Blocks:** 12, 13.
This is the biggest brief; split the PR: (a) interpreter, (b) content port.

## Goal

The interpreter that executes data-driven encounters, then the entire
content catalog ported into `content/`: every NPC encounter, enemy, exotic
die, and stage definition.

## You own

- `src/engine/systems/encounters.ts` — interpreter (steps, inputs/picks,
  weighted outcomes, `applyEffect`).
- `src/content/index.ts` registries: `ENCOUNTERS`, `ENEMIES`, `EXOTIC_DICE`,
  `STAGES` (+ `BASE_DICE` coordination with brief 02). `FAVOR_STORE` is
  brief 07's. `NARRATIVE` structure is yours; prose bulk is brief 12's.
- Content validation tests.

## Interpreter spec

- `startEncounter` loads the def, sets `EncounterRuntime{step: def.start}`.
- A step with `inputs` collects `ENCOUNTER_PICK` actions (validated against
  `StepInput.kind`/`constraint`/`who`) into `runtime.data[pickId]` before
  options unlock; `CHOOSE_ENCOUNTER_OPTION` then:
  1. checks/charges `goldCost` (reject if unaffordable),
  2. draws an outcome via `rng.pickWeighted` (README's 47/27/27 for free
     neutral options; paid options are single-outcome — "gold buys
     certainty"),
  3. applies `effects` in order through `applyEffect`,
  4. emits `NARRATION(resultKey)`, then `next` step or `ENCOUNTER_ENDED`.
- `applyEffect` maps each `Effect` kind onto brief 02/03/07 primitives.
  `FaceTarget.by:'pick'` resolves from `runtime.data`; `by:'rule'` computes
  (lowest/highest/random value face). Unknown kind ⇒ engine bug, throw.
- Keep the interpreter ~200 lines. If an encounter seems to need code,
  it actually needs either a new `Effect` kind or a new `constraint` —
  extend the schema, don't special-case ids.

## Content port (README "Encounter Reference Chart" + `js/config.js`)

Encounters: Mathematician, Alchemist, Priest, Gambler, Bandits, Corrupt
Guards, Thug miniboss, Ferryman, Trapper, Drunk Priest, Cultist, plus the
Stage-5 set (Rift, Memory Fragment, Pocket of Reality, Reality Tear, Echo
of BOMB, Void Creatures, Shard of BOMB, 19 Darkened Lines — the README
flags these as unbalanced; port them at face value and leave a
`// BALANCE:` marker). Merchant encounter shell (logic in brief 07 — its
options dispatch `MERCHANT_*` actions rather than effects).

Known legacy content bugs to fix during the port, with regression tests:
- Gambler OUT-bet payout inversion (REVIEW #10): winning any bet pays the
  win reward.
- Sanctuary/Pocket-of-Reality +2 vs +1 HOPE mismatch (REVIEW #11): README
  value (+2) wins.
- `restore_die` off-by-one (REVIEW #6): "restore a damaged face" means
  revert to `base` provenance value — expressible as a new Effect kind
  `restoreFace` if needed.

Enemies: stats per README tables + `BALANCE.bosses`; BOMB gets
`immunityCycling: true`, `attacksPerRound: 2`. Exotic dice: all 10 from the
README list; express faces literally where possible, `behavior` hooks for
Doubler/Wild Card/Lucky 7s/6996; **clamp The Low Roller/any legacy face
values into [1,20]** (legacy Shifter had -1/22, REVIEW #24).

## Required tests

1. Interpreter: scripted mini-encounter fixture exercising inputs, gold
   gating, weighted outcomes (seeded), step jumps, every Effect kind.
2. Content validation suite (runs over ALL registries): every referenced
   narrative key exists (until brief 12: collect + emit TODO list, assert
   key *format*), stagePool non-empty, face values in [1,20], exotic ranks
   unique 1..10, boss stats match `BALANCE`, every `EncounterOption.next`
   resolves.
3. The three REVIEW regressions above.
