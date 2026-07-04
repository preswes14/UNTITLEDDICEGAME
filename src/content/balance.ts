// ============================================================================
// BALANCE KNOBS — every tunable number in one place.
//
// FULLY SPECIFIED from README.md (the design doc). Designers tune here;
// engine code imports constants and never hard-codes gameplay numbers.
// Values flagged REVIEW carry known balance problems (see REVIEW.md and
// docs/briefs/03 & 04) — keep them as knobs precisely so they can be tuned.
// ============================================================================

export const BALANCE = {
  doom: {
    perNatural1: 1,
    perSurvivedDoomRoll: 1,
    startingDoom: 1,             // GOOD NIGHT OF SLEEP favor sets this to 0
    resetBetweenStages: true,
    /** REVIEW #12: rubber-banding knob. Max DOOM subtracted from a DOOM
     *  roll regardless of meter (null = uncapped, the raw README design). */
    doomRollSubtractionCap: 6 as number | null,
  },
  hope: {
    baseMax: 1,
    perNatural20OnDoomRoll: 1,
  },
  favor: {
    goldToFavorRate: 10,          // 10G -> 1F, floored
    baseGrantByStage: [0, 0, 3, 6, 9, 12] as const,
    tierUnlockAssigned: { 2: 3, 3: 5, 4: 8, 5: 12 } as const,
  },
  merchant: {
    bumpStartCost: 1,
    bumpCostIncrement: 1,          // resets each visit
    bumpValueCap: 19,              // merchant can never create a 20
    wheelSpinCost: 3,
    wheelDoubleCap: 19,
    wheelHalfMin: 2,
  },
  regularEnemyDcBands: {
    easy: [5, 8], medium: [10, 13], hard: [14, 17],
  } as const,
  /** README boss table. REVIEW #13: BOMB's 27 thresholds are likely
   *  unwinnable — expect these to move during playtesting. */
  bosses: {
    innkeeper: { totalDcSum: 36, totalThresholdSum: 9, attacksPerRound: 1 },
    corruptGuard: { totalDcSum: 38, totalThresholdSum: 12, attacksPerRound: 1 },
    heimer: { totalDcSum: 40, totalThresholdSum: 17, attacksPerRound: 1 },
    kingRobert: { totalDcSum: 42, totalThresholdSum: 21, attacksPerRound: 1 },
    bomb: { totalDcSum: 45, totalThresholdSum: 27, attacksPerRound: 2 },
  },
  neutralOutcomeWeights: { good: 47, neutral: 27, bad: 27 },
  rollChain: { maxDepth: 8 },
} as const;
