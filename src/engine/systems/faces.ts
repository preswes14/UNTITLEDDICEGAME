// ============================================================================
// FACE OPERATIONS — every way a die face can be created or modified.
//
// STATUS: STUB. Implement per docs/briefs/02-dice-rolls-and-intertwine.md.
//
// ALL face mutation in the entire codebase goes through these helpers so
// that clamping ([1,20] — REVIEW.md #24), provenance stamping, and
// FACE_CHANGED events are impossible to forget. Systems and encounter
// effects call these; nothing else writes die.faces.
//
// Each helper returns a NEW RunState (structural sharing is fine).
// ============================================================================

import type { DieRef, Face, FaceProvenance, RunState } from '../types';

/** Set/replace a face outright (sculpting, exotic swaps, story effects). */
export function setFace(
  state: RunState, ref: DieRef, slot: number, face: Face,
): RunState {
  void state; void ref; void slot; void face;
  throw new Error('setFace not implemented (brief-02)');
}

/** Add delta to a value face, clamped to [1, 20], stamping provenance. */
export function bumpFace(
  state: RunState, ref: DieRef, slot: number, delta: number,
  provenance: FaceProvenance,
): RunState {
  void state; void ref; void slot; void delta; void provenance;
  throw new Error('bumpFace not implemented (brief-02)');
}

/** Scratch out a face (blank = re-roll). */
export function scratchFace(
  state: RunState, ref: DieRef, slot: number, provenance: FaceProvenance,
): RunState {
  void state; void ref; void slot; void provenance;
  throw new Error('scratchFace not implemented (brief-02)');
}

/** Turn a face into an intertwine link to an ally die. */
export function intertwineFace(
  state: RunState, ref: DieRef, slot: number, target: DieRef,
  provenance: FaceProvenance,
): RunState {
  void state; void ref; void slot; void target; void provenance;
  throw new Error('intertwineFace not implemented (brief-02)');
}

/** Attach hope/doom riders or the Ferryman's mark to a face. */
export function addFaceRider(
  state: RunState, ref: DieRef, slot: number,
  rider: { hope?: number; doom?: number; marked?: boolean },
  provenance: FaceProvenance,
): RunState {
  void state; void ref; void slot; void rider; void provenance;
  throw new Error('addFaceRider not implemented (brief-02)');
}
