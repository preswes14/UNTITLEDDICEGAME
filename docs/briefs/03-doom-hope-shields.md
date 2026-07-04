# Brief 03 — DOOM, HOPE, and shields

**Depends on:** 01. **Blocks:** 04.

## Goal

The party survival economy: DOOM accumulation, DOOM rolls on enemy hits,
HOPE as the anti-DOOM resource, shields as the favor-bought extra life —
including the mandated fix for the death-spiral (REVIEW #12).

## You own

- `src/engine/systems/doom.ts` — all three functions plus shield helpers
  you'll need (`spendHopeToSurvive`, `spendShieldToSurvive` reducer arms).
- Reducer arms: `ROLL_DOOM`, `SPEND_HOPE_TO_SURVIVE`, `SPEND_SHIELD_TO_SURVIVE`.
- Tests.

## Spec (README "DOOM & HOPE System")

- `addDoom`: no cap on the meter itself; emits `DOOM_CHANGED` with reason.
- `addHope`: capped at `maxHope`; overflow is *wasted* (event should still
  fire with the clamped delta so UI can show "HOPE full!"). Note the README
  line "HOPE cannot be banked when at 0 DOOM" was superseded by the
  maxHope/FAVOR design — cap by `maxHope` only.
- DOOM roll (`resolveDoomRoll`):
  - raw d20; natural 20 ⇒ outcome 'hope' (+1 HOPE), DOOM not subtracted.
  - effective = raw − min(doom, cap) where cap =
    `BALANCE.doom.doomRollSubtractionCap` (the rubber-band fix: with the
    raw design, P(party wipe per miss) hits 88% at DOOM 8 — see REVIEW #12
    math; the cap keeps late-stage tension without statistical certainty
    of death. Keep it a knob; null must behave as uncapped).
  - effective ≤ 1 ⇒ outcome 'stage-loss' — BUT the reducer first offers the
    save: if hope > 0 or shields > 0, phase gains a pending "survive?"
    decision (the `SPEND_*_TO_SURVIVE` actions); only if declined/absent
    does the run move to `phase: {kind:'defeat'}`. Spending HOPE to survive
    consumes 1 HOPE and converts the outcome to 'survive'.
  - otherwise 'survive' ⇒ +`BALANCE.doom.perSurvivedDoomRoll` DOOM.
- DOOM resets to `startingDoom` between stages (hook consumed by brief 07's
  `settleStage`).
- Emit `DOOM_ROLL_RESOLVED` with the full `DoomRollResolution` — the main
  screen makes a whole moment of this roll.

## Required tests

1. Natural 20: hope outcome, no subtraction, +1 HOPE (cap respected).
2. Subtraction: DOOM 3, raw 4 ⇒ effective 1 ⇒ stage-loss path.
3. Cap: DOOM 10 with cap 6 subtracts 6; cap null subtracts 10.
4. HOPE save: stage-loss with 1 HOPE ⇒ pending decision; SPEND_HOPE ⇒
   survive, hope 0; decline ⇒ defeat phase.
5. Survive: +1 DOOM, event reasons correct.
6. addHope overflow wasted; addDoom from natural-1 path (integration with
   brief 02's `doomGained`).
7. Statistical sanity: with cap 6, simulate 10k DOOM rolls at DOOM 8 —
   wipe probability strictly below the uncapped equivalent (documents the
   rubber-band actually engaging).
