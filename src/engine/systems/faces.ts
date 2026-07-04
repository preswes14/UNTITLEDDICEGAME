// ============================================================================
// FACE OPERATIONS — every way a die face can be created or modified.
//
// STATUS: IMPLEMENTED (brief 02).
//
// ALL face mutation in the entire codebase goes through these helpers so
// that clamping ([1,20] — REVIEW.md #24), provenance stamping, and
// eligibility are impossible to forget. Callers validate player-facing
// eligibility via selectors.isFaceEligible first; these helpers throw on
// engine-illegal operations (throwing here means an engine bug, not bad
// player input).
//
// Each helper returns a NEW RunState (structural sharing).
// ============================================================================

import type { DieRef, Face, FaceProvenance, RunState } from '../types';

export function clampFaceValue(v: number): number {
  return Math.max(1, Math.min(20, Math.round(v)));
}

/** Immutable single-face update. */
function withFace(state: RunState, ref: DieRef, slot: number, face: Face): RunState {
  if (slot < 0 || slot > 19 || !Number.isInteger(slot)) {
    throw new Error(`withFace: bad slot ${slot}`);
  }
  const heroes = state.heroes.map((hero, hi) => {
    if (hi !== ref.player) return hero;
    const die = hero.dice[ref.approach];
    const faces = die.faces.slice();
    faces[slot] = face;
    return { ...hero, dice: { ...hero.dice, [ref.approach]: { ...die, faces } } };
  }) as RunState['heroes'];
  return { ...state, heroes };
}

export function getFace(state: RunState, ref: DieRef, slot: number): Face {
  const face = state.heroes[ref.player].dice[ref.approach].faces[slot];
  if (!face) throw new Error(`getFace: bad slot ${slot}`);
  return face;
}

/** Set/replace a face outright (sculpting, exotic swaps, story effects). */
export function setFace(
  state: RunState, ref: DieRef, slot: number, face: Face,
): RunState {
  if (face.kind === 'value') {
    return withFace(state, ref, slot, { ...face, value: clampFaceValue(face.value) });
  }
  return withFace(state, ref, slot, face);
}

/** Add delta to a value face, clamped to [1, 20], stamping provenance. */
export function bumpFace(
  state: RunState, ref: DieRef, slot: number, delta: number,
  provenance: FaceProvenance,
): RunState {
  const face = getFace(state, ref, slot);
  if (face.kind !== 'value') {
    throw new Error(`bumpFace: slot ${slot} is ${face.kind}, not a value face`);
  }
  return withFace(state, ref, slot, {
    ...face,
    value: clampFaceValue(face.value + delta),
    provenance,
  });
}

/** Scratch out a face (blank = re-roll). Riders do not survive scratching. */
export function scratchFace(
  state: RunState, ref: DieRef, slot: number, provenance: FaceProvenance,
): RunState {
  getFace(state, ref, slot); // slot validation
  return withFace(state, ref, slot, { kind: 'scratched', provenance });
}

/** Turn a face into an intertwine link to an ally die. */
export function intertwineFace(
  state: RunState, ref: DieRef, slot: number, target: DieRef,
  provenance: FaceProvenance, bonus = 0,
): RunState {
  if (target.player === ref.player && target.approach === ref.approach) {
    throw new Error('intertwineFace: a die cannot intertwine to itself');
  }
  getFace(state, ref, slot); // slot validation
  return withFace(state, ref, slot, { kind: 'intertwine', target, bonus, provenance });
}

/** Attach hope/doom riders or the Ferryman's mark to a face. */
export function addFaceRider(
  state: RunState, ref: DieRef, slot: number,
  rider: { hope?: number; doom?: number; marked?: boolean },
  provenance: FaceProvenance,
): RunState {
  const face = getFace(state, ref, slot);
  const next: Face = {
    ...face,
    provenance,
    ...(rider.hope !== undefined ? { hope: (face.hope ?? 0) + rider.hope } : {}),
    ...(rider.doom !== undefined ? { doom: (face.doom ?? 0) + rider.doom } : {}),
    ...(rider.marked !== undefined ? { marked: rider.marked } : {}),
  };
  return withFace(state, ref, slot, next);
}
