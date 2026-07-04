// ============================================================================
// ENGINE TYPES — the single source of truth for the game's domain model.
//
// Every system (dice, combat, map, economy, encounters) codes against these
// types. Every brief in docs/briefs/ references them. Change them carefully:
// they are also the save-file format (RunState is serialized verbatim) and
// the multiplayer wire format (snapshots are RunState).
//
// Design rules:
//  1. Everything here is plain data — JSON-serializable, no classes, no
//     functions, no Dates, no Maps/Sets. `JSON.parse(JSON.stringify(s))`
//     must round-trip losslessly.
//  2. The engine is pure and deterministic. All randomness flows through
//     RngState (see rng.ts) which lives inside RunState.
//  3. Prefer discriminated unions over parallel arrays + boolean flags.
//     (The legacy prototype tracked die modifications in four parallel
//     arrays — faces/swaps/hopeSegments/crossedSegments — which caused an
//     entire class of desync bugs. Face is now one tagged union.)
// ============================================================================

import type { RngState } from './rng';

// ---------------------------------------------------------------------------
// Identity & core enums
// ---------------------------------------------------------------------------

/** Seat at the table. The game is always exactly 3 heroes. */
export type PlayerId = 0 | 1 | 2;

/** The three approach categories. Every die belongs to exactly one. */
export type Approach = 'physical' | 'verbal' | 'preventative';

/** The nine base talents, three per approach. */
export type TalentId =
  | 'slash' | 'stab' | 'bonk'                // physical
  | 'threaten' | 'deceive' | 'persuade'      // verbal
  | 'bribe' | 'hide' | 'grapple';            // preventative

export const APPROACH_OF_TALENT: Record<TalentId, Approach> = {
  slash: 'physical', stab: 'physical', bonk: 'physical',
  threaten: 'verbal', deceive: 'verbal', persuade: 'verbal',
  bribe: 'preventative', hide: 'preventative', grapple: 'preventative',
};

/** Stages 0 (tutorial) through 5 (BOMB's warped dimension). */
export type StageNumber = 0 | 1 | 2 | 3 | 4 | 5;

/** Addresses one die on one hero's board. */
export interface DieRef {
  player: PlayerId;
  approach: Approach;
}

// ---------------------------------------------------------------------------
// Dice & faces
// ---------------------------------------------------------------------------

/**
 * Who last touched a face. Drives the Merchant eligibility rule:
 * the Merchant may only upgrade faces whose provenance is 'base' or
 * 'merchant'; the Wheel may only re-touch faces it touched itself.
 * (README: "aftermarket upgrades void the die's warranty".)
 */
export type FaceProvenance =
  | 'base'            // untouched since the die was created
  | 'starting-upgrade'
  | 'merchant'
  | 'wheel'
  | 'mathematician'
  | 'alchemist'
  | 'priest'
  | 'cultist'
  | 'gambler'
  | 'trapper'
  | 'ferryman'
  | 'favor'
  | 'story';

interface FaceBase {
  provenance: FaceProvenance;
  /** Extra HOPE granted when this face is rolled (upgrade-granted). */
  hope?: number;
  /** Extra DOOM inflicted when this face is rolled (curses, Cursed Hope). */
  doom?: number;
  /** Ferryman's mark. Rolling a marked face triggers its curse. */
  marked?: boolean;
}

/** A normal numeric face. value is clamped to [1, 20] by face-op helpers. */
export interface ValueFace extends FaceBase {
  kind: 'value';
  value: number;
}

/** Scratched-out (blank) face: re-roll this die. */
export interface ScratchedFace extends FaceBase {
  kind: 'scratched';
}

/**
 * Intertwined face — THE core mechanic. Rolling this face immediately
 * rolls the target ally die and uses that resolution instead.
 * `bonus` supports FAVOR upgrades like PRACTICED INTERTWINER (+3).
 */
export interface IntertwineFace extends FaceBase {
  kind: 'intertwine';
  target: DieRef;
  bonus: number;
}

/** Chaos face: roll all 3 of this hero's dice, take the middle result. */
export interface ChaosFace extends FaceBase {
  kind: 'chaos';
}

export type Face = ValueFace | ScratchedFace | IntertwineFace | ChaosFace;

/** Exotic dice are content-defined; see content/exoticDice.ts. */
export type ExoticDieId = string;

export interface Die {
  talent: TalentId;
  approach: Approach;
  /**
   * Exactly 20 faces. Index = physical position on the die (slot), which is
   * stable across modifications; a slot that started as "7" stays slot 6
   * forever even if its value is now 12 or it is scratched out.
   */
  faces: Face[];
  /** Set when this die was traded in for an exotic die at The Trapper. */
  exoticId?: ExoticDieId;
}

// ---------------------------------------------------------------------------
// Heroes
// ---------------------------------------------------------------------------

export type HeroColor = 'blue' | 'red' | 'green';

export interface Hero {
  id: PlayerId;
  name: string;
  color: HeroColor;
  dice: Record<Approach, Die>;
}

// ---------------------------------------------------------------------------
// Roll resolution
// ---------------------------------------------------------------------------

/** One link in a roll chain (intertwines and scratches can chain). */
export interface RollStep {
  die: DieRef;
  /** Slot index (0-19) that came up. */
  slot: number;
  /** Snapshot of the face at that slot when it was rolled. */
  face: Face;
  /** Why this step happened. */
  via: 'initial' | 'intertwine' | 'scratch-reroll' | 'chaos';
}

/**
 * The full, animatable record of one roll. The engine computes this in one
 * pure step; the UI plays the chain back (die tumbles, camera hops to the
 * ally's die on intertwine, etc.).
 */
export interface RollResolution {
  steps: RollStep[];
  /** Final numeric value after bonuses, clamped to [1, 20]... except that
   *  intertwine bonuses may push above 20 for DC purposes; naturalness is
   *  judged on the raw face value, not the bonused total. */
  total: number;
  natural1: boolean;
  natural20: boolean;
  hopeGained: number;
  doomGained: number;
}

/** Outcome of a DOOM roll (rolled when an enemy lands a hit). */
export interface DoomRollResolution {
  player: PlayerId;
  raw: number;               // the d20
  doomAtRoll: number;        // DOOM subtracted (not applied to natural 20)
  effective: number;
  outcome: 'stage-loss' | 'hope' | 'survive';
  hopeSpentToSurvive: boolean;
  shieldSpentToSurvive: boolean;
}

// ---------------------------------------------------------------------------
// Map / overworld
// ---------------------------------------------------------------------------

export type NodeStatus = 'locked' | 'available' | 'current' | 'completed';

export interface MapNode {
  id: string;
  /** Key into content encounter registry (content/encounters). */
  encounterId: string;
  /** Row 0 = stage start; higher rows are further along. */
  row: number;
  /** Ids of nodes reachable from this one. */
  connections: string[];
  status: NodeStatus;
  /** Encounter parameters rolled at map-generation time (DCs, rewards),
   *  so the map screen can show them and saves reproduce them. */
  params?: EncounterParams;
}

export interface StageMap {
  stage: StageNumber;
  nodes: MapNode[];
  currentNodeId: string | null;
}

/** Per-node randomized numbers, fixed at map generation. */
export interface EncounterParams {
  /** Per-approach DCs for combat encounters (Total DC Sum system). */
  dcs?: Record<Approach, number>;
  /** Per-approach success thresholds. */
  thresholds?: Record<Approach, number>;
  goldReward?: number;
}

// ---------------------------------------------------------------------------
// Combat
// ---------------------------------------------------------------------------

export interface ApproachTrack {
  dc: number;
  threshold: number;
  successes: number;
}

/** Traffic-light per-hero result for the current round (README: sideways
 *  street light; 3 greens = skip the enemy turn). */
export type RoundLight = 'pending' | 'green' | 'red';

export interface CombatState {
  kind: 'regular' | 'miniboss' | 'boss';
  enemyId: string;
  approaches: Record<Approach, ApproachTrack>;
  round: number;
  /** Whose turn within the round; heroes act 0 -> 1 -> 2. */
  activeHero: PlayerId;
  lights: [RoundLight, RoundLight, RoundLight];
  /** BOMB's immunity cycling: approach currently blocked, if any. */
  immuneApproach: Approach | null;
  attacksPerRound: number;
  goldReward: number;
  /** Die the active hero has staged but not yet confirmed. */
  stagedDie: Approach | null;
}

// ---------------------------------------------------------------------------
// Non-combat encounters
// ---------------------------------------------------------------------------

/**
 * Interactive state for a data-driven encounter (see content/schema.ts for
 * the *definitions*; this is the *runtime* state while one is open).
 * `step` and `data` are interpreted by the encounter's own logic —
 * the engine treats them as an opaque, serializable scratchpad.
 */
export interface EncounterRuntime {
  encounterId: string;
  step: string;
  data: Record<string, unknown>;
}

// ---------------------------------------------------------------------------
// Economy
// ---------------------------------------------------------------------------

export type FavorUpgradeId = string;

export interface FavorState {
  /** Favor available to assign (base grant per stage + converted gold). */
  total: number;
  /** Single-purchase upgrades currently equipped. Unequip/re-equip is free
   *  at stage start. Tier gating is derived from assigned count. */
  assigned: FavorUpgradeId[];
  /** Upgrades ever purchased (purchase is permanent; assignment is not). */
  purchased: FavorUpgradeId[];
}

export interface MerchantState {
  /** Price of the next +1 bump this visit (resets to 1 each visit). */
  nextBumpCost: number;
}

// ---------------------------------------------------------------------------
// Phase machine
// ---------------------------------------------------------------------------

/**
 * What the party is currently doing. Exactly one phase at a time; each
 * carries its own sub-state. UI screens map 1:1 onto phases.
 */
export type Phase =
  | { kind: 'draft'; step: string; data: Record<string, unknown> }   // dice selection / tutorial stage 0
  | { kind: 'favor-shop' }                                           // start-of-stage FAVOR assignment
  | { kind: 'overworld'; voting: VotingState | null }
  | { kind: 'encounter'; runtime: EncounterRuntime }
  | { kind: 'combat'; combat: CombatState; pendingDoomRolls: PlayerId[] }
  | { kind: 'stage-transition'; clearedStage: StageNumber }
  | { kind: 'victory' }
  | { kind: 'defeat'; reason: string };

export interface VotingState {
  /** Node ids being voted between. */
  options: string[];
  /** playerId -> nodeId */
  votes: Partial<Record<PlayerId, string>>;
}

// ---------------------------------------------------------------------------
// The run
// ---------------------------------------------------------------------------

export interface RunState {
  /** Bump on breaking changes; save migration keys off this. */
  schemaVersion: number;
  /** Seed the run was created with (for bug reports / replays). */
  seed: string;
  rng: RngState;

  stage: StageNumber;
  phase: Phase;

  heroes: [Hero, Hero, Hero];
  map: StageMap;

  gold: number;
  doom: number;
  hope: number;
  maxHope: number;
  shields: number;
  maxShields: number;
  favor: FavorState;
  merchant: MerchantState;

  /** Exotic dice already traded away (each is unique; see README). */
  exoticDiceTaken: ExoticDieId[];

  /** Monotonic count of applied actions; used for net sync ordering. */
  tick: number;
}
