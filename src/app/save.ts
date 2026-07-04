// ============================================================================
// SAVE / LOAD — localStorage persistence of RunState.
//
// STATUS: STUB. Implement per docs/briefs/08-save-load.md.
//
// Because RunState is plain data and includes its own rng state, a save is
// literally JSON.stringify(state) plus an envelope — no field-by-field
// serialization like the legacy state.js (which drifted out of sync with
// the state shape twice; REVIEW.md #8, #9).
//
// Envelope: { schemaVersion, savedAt, slot, state }
// 3 slots. Migration: on load, if schemaVersion < current, run migrations
// in order or (pre-1.0) refuse with a friendly "save from an older version"
// message. Legacy prototype saves (js/save.js format) are NOT migrated.
// ============================================================================

import type { RunState } from '@engine/types';

export interface SaveSlotMeta {
  slot: 0 | 1 | 2;
  savedAt: number;
  stage: number;
  heroNames: string[];
}

export function saveRun(slot: 0 | 1 | 2, state: RunState): void {
  void slot; void state;
  throw new Error('saveRun not implemented (brief-08)');
}

export function loadRun(slot: 0 | 1 | 2): RunState | null {
  void slot;
  throw new Error('loadRun not implemented (brief-08)');
}

export function listSaves(): SaveSlotMeta[] {
  throw new Error('listSaves not implemented (brief-08)');
}

export function deleteSave(slot: 0 | 1 | 2): void {
  void slot;
  throw new Error('deleteSave not implemented (brief-08)');
}

/** Debounced autosave: call as often as you like; writes at most every
 *  ~800ms via requestIdleCallback/setTimeout. */
export function autosave(slot: 0 | 1 | 2, state: RunState): void {
  void slot; void state;
  throw new Error('autosave not implemented (brief-08)');
}
