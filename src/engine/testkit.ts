// ============================================================================
// TESTKIT — fixtures shared by every engine test suite. Not shipped to the
// app bundle (import only from *.test.ts and sim harnesses).
// ============================================================================

import type { GameAction } from './actions';
import type { GameEvent } from './events';
import { assertInvariants } from './invariants';
import { makeBaseDie, startRun } from './lifecycle';
import { reduce } from './reducer';
import type { Die, Face, RunState, TalentId } from './types';

/** A fresh run in the default (README example) loadout. */
export function makeTestRun(seed = 'test-seed', overrides: Partial<RunState> = {}): RunState {
  const state = startRun({
    type: 'START_RUN',
    seed,
    heroNames: ['Blue', 'Red', 'Green'],
  });
  return { ...state, ...overrides };
}

/** A die with custom faces: numbers become value faces (provenance 'base');
 *  full Face objects pass through. Pads/truncates to exactly 20. */
export function makeDie(talent: TalentId, faces?: (number | Face)[]): Die {
  const die = makeBaseDie(talent);
  if (!faces) return die;
  const built: Face[] = faces.map((f) =>
    typeof f === 'number' ? { kind: 'value', value: f, provenance: 'base' } : f,
  );
  while (built.length < 20) {
    built.push({ kind: 'value', value: (built.length % 20) + 1, provenance: 'base' });
  }
  return { ...die, faces: built.slice(0, 20) };
}

/** Uniform face lists for makeDie. */
export function allFaces(face: Face): Face[] {
  return Array.from({ length: 20 }, () => ({ ...face }));
}

/** Apply a sequence of actions, running invariants after each accepted one.
 *  Returns the final state plus every event emitted along the way. */
export function applyAll(
  state: RunState, actions: GameAction[],
): { state: RunState; events: GameEvent[] } {
  let s = state;
  const events: GameEvent[] = [];
  for (const action of actions) {
    const result = reduce(s, action);
    s = result.state;
    events.push(...result.events);
    assertInvariants(s);
  }
  return { state: s, events };
}
