# Brief 07 — Economy: gold, FAVOR store, Merchant, the Wheel

**Depends on:** 01, 02. **Blocks:** 13.

## Goal

All currency flows: gold in/out, stage-end gold→FAVOR conversion, the
single-purchase equip/unequip FAVOR store with tier gating, the Merchant's
escalating bumps with the provenance "warranty" rule, and the Wheel.

## You own

- `src/engine/systems/economy.ts` — everything in the stub.
- `selectors.isFaceEligible`, `selectors.unlockedFavorTier`.
- `content/index.ts` `FAVOR_STORE` — port README "FAVOR STORE FIRST DRAFT"
  (all 5 tiers, ids/hooks; prereq chains for SHIELD/HOPE lines).
- The favor *hook* plumbing: a `getModifiers(state)` selector that systems
  query (e.g. combat asks for `dcReduction`; rolls ask for intertwine
  bonuses). Implement the hooks consumed by already-built systems
  (intertwiner/intertwinee bonuses, max-hope/max-shield raises, starting
  doom/gold/shield, DC reductions); leave clearly-marked TODO hooks for
  systems that don't exist yet.
- Reducer arms: `MERCHANT_BUMP`, `MERCHANT_SPIN_WHEEL`, `FAVOR_PURCHASE`,
  `FAVOR_ASSIGN`, `FAVOR_UNASSIGN`, `LEAVE_SHOP`; `settleStage`.
- Tests.

## Spec (README "Start-of-Stage Upgrade Shop" + "Merchant")

- `settleStage(cleared)`: favor += floor(gold / 10) + base grant for the
  UPCOMING stage (`BALANCE.favor.baseGrantByStage[cleared+1]`); gold → 0;
  DOOM reset (call brief 03's hook); phase → favor-shop (stages 2+) or
  straight to next stage map.
- FAVOR: purchase spends `tier` favor permanently (single-purchase, README);
  assign/unassign is free while `phase.kind === 'favor-shop'`, rejected
  elsewhere. Tier N+1 visible/buyable when ASSIGNED favor ≥
  `BALANCE.favor.tierUnlockAssigned[N+1]`. Targeted upgrades store their
  `FavorTarget` with the assignment. CHAOTIC FAVOR (tier 5) draws
  3+1d6 favor and random-assigns — express via rng, and cap iterations.
- Merchant: `nextBumpCost` starts 1, +1 per bump, **resets on each visit**
  (reset in `startEncounter` for merchant kind). Bump = `faces.bumpFace`
  +1, cap 19, eligibility via `isFaceEligible(source:'merchant')`:
  provenance must be 'base' or 'merchant', and value faces only — a 20
  (or hope/doom-ridered face) is ineligible.
- Wheel: 3G/spin, player pre-picks the gambled face (eligibility source
  'wheel': provenance 'base' or 'wheel'), 5 equal outcomes: double
  (cap 19) / half (floor, min 2) / +1 hope rider / +1 doom rider /
  intertwine (a follow-up `ENCOUNTER_PICK` chooses the link target).
- `addGold`: integer, ≥ 0 after spend checks; `spendGold` path rejects
  rather than going negative. `GOLD_CHANGED` on every change (REVIEW #1
  class of bug dies here).

## Required tests

1. settleStage: 37G ⇒ +3F + base grant, gold 0, doom reset.
2. Tier gating walkthrough to tier 5; purchase-once; unassign frees
   assignment count (and can re-lock higher tiers — decide: already-assigned
   higher-tier upgrades stay assigned; test documents the rule).
3. Prereq chains (SHIELD ADEPTS without GEAR: SHIELD rejected).
4. Merchant: 10G buys bumps costing 1+2+3+4; cost resets next visit; 19
   cap; merchant-after-alchemist face rejected; merchant-after-merchant OK.
5. Wheel: all 5 outcomes reachable (seed sweep); wheel-touched face
   ineligible for merchant and vice versa.
6. Modifier hooks: PRACTICED INTERTWINER +3 shows up in a resolved
   intertwine roll's total (integration with brief 02).
