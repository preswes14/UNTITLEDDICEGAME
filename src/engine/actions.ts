// ============================================================================
// ACTIONS — every way a player (or the host on the party's behalf) can poke
// the game. Actions are the ONLY input to the engine and the ONLY thing
// clients send over the wire in multiplayer.
//
// Rules:
//  - Plain serializable data.
//  - Carry the acting player where relevant so the reducer can validate
//    "is it actually your turn?" (in solo mode, one human plays all seats).
//  - No RNG results inside actions. "CONFIRM_ROLL" carries intent; the
//    reducer draws the roll from RunState.rng. This is what makes replays
//    and host-authoritative multiplayer work.
// ============================================================================

import type { Approach, DieRef, FavorUpgradeId, PlayerId } from './types';

export type GameAction =
  // -- run lifecycle ---------------------------------------------------------
  | { type: 'START_RUN'; seed: string; heroNames: [string, string, string] }
  | { type: 'ABANDON_RUN' }

  // -- draft (stage 0) -------------------------------------------------------
  /** Draft flow is content-driven; steps advance via generic option picks. */
  | { type: 'DRAFT_CHOOSE'; player: PlayerId; choiceId: string }

  // -- overworld -------------------------------------------------------------
  | { type: 'CAST_VOTE'; player: PlayerId; nodeId: string }
  /** Host resolves voting (auto after all votes in, or solo shortcut). */
  | { type: 'RESOLVE_VOTE' }

  // -- encounters (data-driven; option ids come from content defs) -----------
  | { type: 'CHOOSE_ENCOUNTER_OPTION'; player: PlayerId; optionId: string }
  /** Generic parameterized pick within an encounter step, e.g. "which face",
   *  "which die", "which ally" — payload validated against the step schema. */
  | { type: 'ENCOUNTER_PICK'; player: PlayerId; pick: EncounterPick }

  // -- rolling (combat and skill checks) --------------------------------------
  /** Stage a die (drag to center on the player's device). */
  | { type: 'STAGE_DIE'; player: PlayerId; approach: Approach }
  | { type: 'UNSTAGE_DIE'; player: PlayerId }
  /** Tap to confirm: the reducer draws from rng and resolves the full chain. */
  | { type: 'CONFIRM_ROLL'; player: PlayerId }

  // -- DOOM / HOPE / shields ---------------------------------------------------
  /** Resolve the next pending DOOM roll (enemy landed a hit). */
  | { type: 'ROLL_DOOM'; player: PlayerId }
  /** Spend 1 HOPE to cancel a failed DOOM roll before it ends the stage. */
  | { type: 'SPEND_HOPE_TO_SURVIVE' }
  | { type: 'SPEND_SHIELD_TO_SURVIVE' }

  // -- economy -----------------------------------------------------------------
  | { type: 'MERCHANT_BUMP'; die: DieRef; slot: number }
  | { type: 'MERCHANT_SPIN_WHEEL'; die: DieRef; slot: number }
  | { type: 'FAVOR_PURCHASE'; upgradeId: FavorUpgradeId; target?: FavorTarget }
  | { type: 'FAVOR_ASSIGN'; upgradeId: FavorUpgradeId; target?: FavorTarget }
  | { type: 'FAVOR_UNASSIGN'; upgradeId: FavorUpgradeId }
  | { type: 'LEAVE_SHOP' }

  // -- stage flow ---------------------------------------------------------------
  | { type: 'CONTINUE' };  // advance past transitions / narration screens

/** Targets for hero- or die-scoped FAVOR upgrades. */
export interface FavorTarget {
  player?: PlayerId;
  die?: DieRef;
}

/**
 * A single parameterized selection inside an encounter step.
 * Encounter content declares which picks a step expects; the encounters
 * system validates shape + legality (e.g. Merchant provenance rule).
 */
export type EncounterPick =
  | { kind: 'die'; die: DieRef }
  | { kind: 'face'; die: DieRef; slot: number }
  | { kind: 'ally'; player: PlayerId }
  | { kind: 'number'; value: number }
  | { kind: 'named'; id: string };
