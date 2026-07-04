// ============================================================================
// CONTENT SCHEMA — the shapes all game content must fit.
//
// FULLY SPECIFIED (extend Effect/StepInput as content demands, sparingly).
//
// Content is data: no functions, no imports from engine/systems. The
// encounter interpreter (engine/systems/encounters.ts) executes these
// definitions. Narrative text lives in content/narrative keyed by string
// ids so writers can iterate without touching logic.
// ============================================================================

import type { Approach, DieRef, StageNumber, TalentId } from '@engine/types';

// ---------------------------------------------------------------------------
// Declarative effects — everything an encounter outcome can do to the run.
// ---------------------------------------------------------------------------

export type Effect =
  | { kind: 'gold'; delta: number }
  | { kind: 'doom'; delta: number }
  | { kind: 'hope'; delta: number }
  | { kind: 'shields'; delta: number }
  | { kind: 'favor'; delta: number }
  // Face ops: `target` may be a concrete pick made earlier in the encounter
  // (referenced by pick id) or a rule like "lowest value face on chosen die".
  | { kind: 'bumpFace'; target: FaceTarget; delta: number }
  | { kind: 'setFaceValue'; target: FaceTarget; value: number }
  | { kind: 'scratchFace'; target: FaceTarget }
  | { kind: 'intertwine'; target: FaceTarget; linkTo: DieTarget; bonus?: number }
  | { kind: 'faceRider'; target: FaceTarget; hope?: number; doom?: number; marked?: boolean }
  | { kind: 'replaceWithExotic'; die: DieTarget; exoticId: string }
  | { kind: 'startCombat'; enemyId: string }
  | { kind: 'narrate'; key: string }
  | { kind: 'endEncounter'; outcome: string };

/** How an effect finds its face. 'pick:<id>' refers to a player pick made in
 *  a previous step of the same encounter; rules are resolved by the engine. */
export type FaceTarget =
  | { by: 'pick'; pickId: string }
  | { by: 'rule'; die: DieTarget; rule: 'lowest' | 'highest' | 'random' };

export type DieTarget =
  | { by: 'pick'; pickId: string }
  | { by: 'rule'; rule: 'random-die' | 'each-die-of-each-hero' };

// ---------------------------------------------------------------------------
// Encounters
// ---------------------------------------------------------------------------

export type EncounterKind = 'good' | 'bad' | 'neutral' | 'miniboss' | 'boss' | 'story' | 'merchant';

export interface EncounterDef {
  id: string;
  kind: EncounterKind;
  stagePool: StageNumber[];      // which stages this can appear in
  title: string;
  icon: string;
  /** Narrative key for the intro blurb. */
  introKey: string;
  steps: Record<string, EncounterStep>;
  /** Entry step id. */
  start: string;
}

export interface EncounterStep {
  /** Narrative key shown for this step. */
  textKey?: string;
  /** Player inputs this step collects before options unlock. */
  inputs?: StepInput[];
  options: EncounterOption[];
}

export interface StepInput {
  pickId: string;
  /** Mirrors engine/actions EncounterPick kinds. */
  kind: 'die' | 'face' | 'ally' | 'number' | 'named';
  /** Constraint hints validated by the interpreter, e.g. face eligibility
   *  source, value ranges, "not your own die". */
  constraint?: Record<string, unknown>;
  /** Which seat picks (default: the party leader / any). */
  who?: 'each' | 'any' | 'leader';
}

export interface EncounterOption {
  id: string;
  labelKey: string;
  goldCost?: number;
  /** Weighted outcomes; single-entry means deterministic. Weights follow the
   *  README's 47/27/27 convention for free neutral choices. */
  outcomes: { weight: number; effects: Effect[]; resultKey?: string }[];
  /** Jump to another step instead of / after applying effects. */
  next?: string;
}

// ---------------------------------------------------------------------------
// Enemies & bosses
// ---------------------------------------------------------------------------

export interface EnemyDef {
  id: string;
  nameKey: string;
  kind: 'regular' | 'miniboss' | 'boss';
  stage: StageNumber;
  totalDcSum: number;
  dcBands: { easy: [number, number]; medium: [number, number]; hard: [number, number] };
  totalThresholdSum: number;
  thresholdBands: { a: [number, number]; b: [number, number]; c: [number, number] };
  attacksPerRound: number;
  goldReward: number;
  /** BOMB-style immunity cycling. */
  immunityCycling?: boolean;
  /** Per-talent outcome flavor text keys: `${id}.win.${talent}` etc. are
   *  resolved from the narrative registry; this flags authored coverage. */
  talentOutcomes?: TalentId[];
}

// ---------------------------------------------------------------------------
// Exotic dice & FAVOR store
// ---------------------------------------------------------------------------

export interface ExoticDieDef {
  id: string;
  nameKey: string;
  /** Power ranking, 1 = strongest (Trapper trade-matching uses this). */
  rank: number;
  /** Face list expressed as engine faces (values pre-clamped by content
   *  tests; special behaviors like "double result" get their own rider —
   *  see brief-02 for how exotic behaviors hook the roll resolver). */
  faces: import('@engine/types').Face[];
  /** Behavior hook id for dice whose rules can't be expressed as faces
   *  (Doubler, Wild Card...). Implemented in engine/systems/rolls.ts. */
  behavior?: 'doubler' | 'wildcard' | 'lucky-sevens' | 'six-nine';
}

export interface FavorUpgradeDef {
  id: string;
  nameKey: string;
  descriptionKey: string;
  tier: 1 | 2 | 3 | 4 | 5;   // cost in favor == tier
  /** Needs a hero and/or die chosen at assignment time. */
  requiresTarget?: 'hero' | 'die';
  /** Prerequisite upgrade (e.g. SHIELD ADEPTS requires GEAR: SHIELD). */
  requires?: string;
  /** Modifier hook consumed by engine systems; one id per mechanic. */
  hook: string;
}

// ---------------------------------------------------------------------------
// Stages
// ---------------------------------------------------------------------------

export interface StageDef {
  stage: StageNumber;
  titleKey: string;
  bossId: string;
  minibossIds: string[];
  /** Encounter pool node counts: [before miniboss, after miniboss]. */
  segmentLengths: [[number, number], [number, number]];
  baseFavorGrant: number;   // 0, 0, 3, 6, 9, 12
  introKey: string;
  conclusionKey: string;
}
