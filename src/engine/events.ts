// ============================================================================
// EVENTS — what happened. The reducer returns events alongside the new state.
//
// Consumers:
//  - UI: plays animations (dice tumble on the MAIN screen, DOOM meter pulses,
//    traffic light flips, intertwine camera-hop) and narration text.
//  - Net: host broadcasts events with each snapshot so client UIs animate
//    the same things.
//  - Tests: assert on events instead of digging through state diffs.
//
// Events are facts, not instructions: "DOOM_CHANGED +1 because natural-1",
// not "shake the screen". Presentation decisions live in the UI layer.
// ============================================================================

import type {
  Approach, DoomRollResolution, PlayerId, RollResolution, StageNumber,
} from './types';

export type GameEvent =
  // -- rolls -------------------------------------------------------------------
  | { type: 'ROLL_RESOLVED'; player: PlayerId; resolution: RollResolution;
      dc?: number; success?: boolean }
  | { type: 'DOOM_ROLL_RESOLVED'; resolution: DoomRollResolution }

  // -- meters ------------------------------------------------------------------
  | { type: 'DOOM_CHANGED'; delta: number; total: number; reason: string }
  | { type: 'HOPE_CHANGED'; delta: number; total: number; reason: string }
  | { type: 'GOLD_CHANGED'; delta: number; total: number; reason: string }
  | { type: 'SHIELDS_CHANGED'; delta: number; total: number; reason: string }
  | { type: 'FAVOR_CHANGED'; delta: number; total: number; reason: string }

  // -- dice --------------------------------------------------------------------
  /** A face was modified (upgrade, curse, intertwine, scratch...). UI shows
   *  the before/after on the owner's device. */
  | { type: 'FACE_CHANGED'; player: PlayerId; approach: Approach; slot: number;
      reason: string }
  | { type: 'DIE_REPLACED'; player: PlayerId; approach: Approach;
      exoticId: string }

  // -- combat ------------------------------------------------------------------
  | { type: 'COMBAT_STARTED'; enemyId: string }
  | { type: 'APPROACH_PROGRESS'; approach: Approach; successes: number;
      threshold: number }
  | { type: 'ROUND_ENDED'; allGreens: boolean }
  | { type: 'ENEMY_ATTACKED'; pendingDoomRolls: PlayerId[] }
  | { type: 'IMMUNITY_CYCLED'; nowImmune: Approach }
  | { type: 'COMBAT_WON'; enemyId: string; goldAwarded: number }

  // -- narrative / flow ----------------------------------------------------------
  /** Key into content/narrative registry; UI renders the text/scene. */
  | { type: 'NARRATION'; key: string; params?: Record<string, string | number> }
  | { type: 'ENCOUNTER_STARTED'; encounterId: string }
  | { type: 'ENCOUNTER_ENDED'; encounterId: string; outcome: string }
  | { type: 'STAGE_CLEARED'; stage: StageNumber; goldConverted: number;
      favorGained: number }
  | { type: 'RUN_ENDED'; result: 'victory' | 'defeat'; reason: string }

  // -- validation ---------------------------------------------------------------
  /** An action was rejected (not your turn, can't afford, illegal target).
   *  Never mutates state; UI shows a toast on the offending device only. */
  | { type: 'ACTION_REJECTED'; player: PlayerId | null; reason: string };
