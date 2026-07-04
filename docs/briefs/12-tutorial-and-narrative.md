# Brief 12 — Tutorial (Stage 0), narrative content, and the draft

**Depends on:** 04, 06, 07 (mechanics the tutorial teaches must exist).

## Goal

Stage 0 — Pal's tutorial — as content-plus-light-engine-support, the dice
draft it wraps, and the narrative registry filled for stages 0-5. This is
where the game's heart lives; the legacy tutorial "lands" emotionally
(REVIEW "What works well") — preserve its beats and prose wholesale.

## You own

- `phase.kind === 'draft'` engine support: a scripted-sequence system
  (`src/engine/systems/draft.ts`, reducer arm `DRAFT_CHOOSE`) generic
  enough to drive both the tutorial script and a skip-tutorial quick
  draft. Steps: narration → guided pick → constrained roll → repeat.
  The tutorial script itself is CONTENT (`content/tutorial.ts`).
- Draft outcome: each hero ends with one die per approach (README example
  party compositions are presets for quick-start).
- `NARRATIVE` registry bulk: port every string from legacy `js/config.js`
  (Pal's dialogue, pet names, NPC voice lines — Gambler stubs, Ferryman
  silence beats, loading tips) and README's authored text (the prophecy,
  stage intros/outros for 0-5 per "Stage Breakdown" + the "Prompts to
  Continue Development" answers, boss confrontation/defeat beats, the
  Stage-4 fake-victory → knife → BOMB summoning sequence).
- Ability-specific outcome text: the 9-talent × encounter grid (README
  gives the Bandits row as the style guide — "basic, expected outcome",
  one line each). Wire as `${enemyId}.win.${talent}` keys; combat emits
  the key (small brief-04 touch-up if needed).
- Tutorial beats to preserve (legacy + README Stage 0): hideout opening,
  Pal teaching rolls/DOOM/intertwining with pet names, rising paranoia,
  prophecy handoff, the explosion, title-screen reveal, "I am... And
  forever shall be... Your Pal...".

## Spec notes

- Tutorial rolls must be *teachable* — the script can constrain but NOT
  predetermine outcomes (engine stays honest; the script branches its
  coaching text on the event that actually happened: nat-1 gets Pal's
  DOOM lesson early, etc.). Write coaching variants for
  success/fail/nat1/nat20 on each teaching roll.
- Skip-tutorial path: `DRAFT_CHOOSE` a preset ⇒ straight to Stage 1 with
  the README example composition.
- Content-validation test from brief 06 must now pass with zero missing
  narrative keys (this brief deletes that suite's TODO allowance).

## Required tests

1. Scripted full tutorial run via `applyAll` (forced seeds for each branch:
   at minimum one all-success and one nat-1 path) ends in Stage 1 overworld
   with 3 fully-drafted heroes.
2. Quick-draft preset path.
3. Narrative completeness: every key referenced anywhere resolves; no
   orphan keys (warn-level).
4. Talent-outcome grid completeness for every enemy with
   `talentOutcomes` declared.
