# Brief 04 — Combat: regular enemies, minibosses, bosses, BOMB

**Depends on:** 01, 02, 03. **Blocks:** 12, 13.

## Goal

The full combat loop for all enemy kinds: staged rolls, per-approach DCs and
success thresholds under the Total-DC-Sum system, the traffic-light round
structure, enemy attacks queueing DOOM rolls, and BOMB's immunity cycling.

## You own

- `src/engine/systems/combat.ts` — everything in the stub.
- Reducer arms: `STAGE_DIE`, `UNSTAGE_DIE`, `CONFIRM_ROLL` (in combat phase).
- `selectors.stageableApproaches`.
- Tests.

## Spec (README "Boss Combat Mechanics", "Variable DCs", REVIEW #1/#2/#3/#16)

- **Setup:** `startCombat` reads the node's `EncounterParams` (already
  rolled at map-gen, brief 05) or, for encounters that start combat
  directly, rolls DCs/thresholds itself from the `EnemyDef`.
  `rollApproachDCs` must (a) keep each approach's DC inside its band,
  (b) make the three DCs sum EXACTLY to `totalDcSum` (legacy silently
  failed this — REVIEW #3), and (c) assign bands to approaches uniformly
  via `rng.shuffled` (never sort-by-random — REVIEW #2). Same machinery
  for thresholds.
- **Round:** heroes act in seat order 0→1→2 every round; each stages any
  one of their own dice (`stageableApproaches` excludes only the
  immune approach — approach choice is NEVER locked round-to-round,
  REVIEW #16) then `CONFIRM_ROLL` resolves via brief 02.
  - Success = resolution.total ≥ that approach's DC ⇒ counter +1, light
    green. Failure ⇒ light red.
  - `doomGained`/`hopeGained` from the resolution apply immediately (03).
- **Round end (after seat 2):**
  - Any approach counter ≥ threshold ⇒ `COMBAT_WON`, award
    `state.phase.combat.goldReward` exactly once via `economy.addGold`
    (the legacy NaN bug, REVIEW #1 — regression-test it), return to
    overworld (or stage flow if boss/miniboss).
  - All three lights green ⇒ `ROUND_ENDED {allGreens:true}`, NO enemy turn,
    lights reset. (Main screen: the sideways street light flashes.)
  - Otherwise the enemy attacks `attacksPerRound` times: each attack picks
    a hit hero (uniform via rng) and queues a DOOM roll in
    `pendingDoomRolls`; combat pauses until all pending DOOM rolls resolve
    (brief 03). Then, if the enemy has `immunityCycling`, cycle immunity
    to a uniformly-random DIFFERENT approach (`IMMUNITY_CYCLED`).
- **Victory check timing:** check thresholds when a counter increments, but
  only END combat at that instant — mid-round win skips remaining seats
  (design intent: reaching the threshold finishes the fight).
- **Defeat:** exclusively via DOOM-roll stage-loss (03). Combat has no
  other loss condition.

## Legacy reference

`js/combat.js` (round flow, boss bars, all four REVIEW bugs), `js/config.js`
(DC generation).

## Required tests

1. `rollApproachDCs`: 500 seeds × every boss in `BALANCE.bosses` — sums
   exact, bands respected, all 6 band-to-approach assignments occur.
2. Full scripted fight to victory: gold awarded once, is a finite number
   (REVIEW #1 regression), phase returns correctly.
3. All-greens round: no DOOM rolls queued, lights reset.
4. Miss round: exactly `attacksPerRound` DOOM rolls queued; combat rejects
   `STAGE_DIE` while DOOM rolls pending.
5. Immunity: staging the immune approach rejected; cycling always lands on
   a different approach; only after enemy attacks.
6. Approach freedom: hero uses a different approach each round without
   rejection (REVIEW #16 regression).
7. Mid-round threshold win ends combat before seat 2 acts.
