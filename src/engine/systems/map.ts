// ============================================================================
// MAP GENERATION & OVERWORLD PROGRESSION.
//
// STATUS: STUB. Implement per docs/briefs/05-map-generation.md.
//
// Shape requirements (README "Encounters & Map Structure"):
//  - Generally linear with ~3-way forks; a fork commits you to a lane for
//    2-4 encounters before re-forking.
//  - "Path drift": lanes occasionally merge/split so avenues differ in
//    richness.
//  - Stage skeleton: intro -> encounters -> MINIBOSS -> encounters ->
//    (merchant guaranteed on EXACTLY ONE lane immediately before boss)
//    -> BOSS -> conclusion.
//  - Encounter randomization (which encounter sits on which node, its DCs
//    and rewards) is rolled HERE at generation time and stored in
//    MapNode.params so saves/multiplayer reproduce identically.
// ============================================================================

import type { RngState } from '../rng';
import type { GameAction } from '../actions';
import type { ReduceResult } from '../reducer';
import type { RunState, StageMap, StageNumber } from '../types';

export function generateStageMap(
  stage: StageNumber, rng: RngState,
): [StageMap, RngState] {
  void stage; void rng;
  throw new Error('generateStageMap not implemented (brief-05)');
}

/** Voting: record a vote; solo mode may cast all three at once. */
export function castVote(state: RunState, action: Extract<GameAction, { type: 'CAST_VOTE' }>): ReduceResult {
  void state; void action;
  throw new Error('castVote not implemented (brief-05)');
}

/** Resolve votes (majority; ties broken by rng), move the party, and open
 *  the chosen node's encounter. */
export function resolveVote(state: RunState): ReduceResult {
  void state;
  throw new Error('resolveVote not implemented (brief-05)');
}
