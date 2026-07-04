// ============================================================================
// ENCOUNTER INTERPRETER — runs data-driven encounter definitions.
//
// STATUS: STUB. Implement per docs/briefs/06-encounters-and-content.md.
//
// Encounters are DATA (content/encounters/*), not code. This system is the
// small interpreter that walks an EncounterDef's steps, validates player
// picks against the step's declared inputs, rolls weighted outcomes
// (47/27/27 via rng.pickWeighted), and applies declarative Effects.
//
// Adding a new NPC encounter must require ZERO engine changes — only a new
// content file. If a new encounter needs a new Effect kind, add it to
// content/schema.ts and one case to applyEffect below.
// ============================================================================

import type { GameAction } from '../actions';
import type { GameEvent } from '../events';
import type { ReduceResult } from '../reducer';
import type { RunState } from '../types';
import type { Effect } from '@content/schema';

export function startEncounter(state: RunState, encounterId: string): ReduceResult {
  void state; void encounterId;
  throw new Error('startEncounter not implemented (brief-06)');
}

export function chooseOption(
  state: RunState,
  action: Extract<GameAction, { type: 'CHOOSE_ENCOUNTER_OPTION' }>,
): ReduceResult {
  void state; void action;
  throw new Error('chooseOption not implemented (brief-06)');
}

export function encounterPick(
  state: RunState,
  action: Extract<GameAction, { type: 'ENCOUNTER_PICK' }>,
): ReduceResult {
  void state; void action;
  throw new Error('encounterPick not implemented (brief-06)');
}

/** Apply one declarative effect. The ONLY switch over Effect kinds. */
export function applyEffect(state: RunState, effect: Effect): [RunState, GameEvent[]] {
  void state; void effect;
  throw new Error('applyEffect not implemented (brief-06)');
}
