import { describe, it, expect } from 'vitest';
import { makeTestRun } from '../testkit';
import { isFaceEligible } from '../selectors';
import { addFaceRider, bumpFace, getFace, scratchFace, setFace } from './faces';
import type { DieRef } from '../types';

const REF: DieRef = { player: 0, approach: 'physical' };

describe('face operations', () => {
  it('bumpFace clamps to [1,20] and stamps provenance', () => {
    let state = makeTestRun();
    state = bumpFace(state, REF, 18, 10, 'mathematician'); // slot 18 = value 19
    const face = getFace(state, REF, 18);
    expect(face).toMatchObject({ kind: 'value', value: 20, provenance: 'mathematician' });

    state = bumpFace(state, REF, 0, -10, 'cultist'); // slot 0 = value 1
    expect(getFace(state, REF, 0)).toMatchObject({ kind: 'value', value: 1 });
  });

  it('bumpFace refuses non-value faces', () => {
    let state = makeTestRun();
    state = scratchFace(state, REF, 5, 'base');
    expect(() => bumpFace(state, REF, 5, 1, 'merchant')).toThrow(/not a value face/);
  });

  it('does not mutate the input state', () => {
    const state = makeTestRun();
    const before = JSON.stringify(state);
    bumpFace(state, REF, 4, 3, 'merchant');
    scratchFace(state, REF, 4, 'base');
    addFaceRider(state, REF, 4, { hope: 1 }, 'priest');
    expect(JSON.stringify(state)).toBe(before);
  });

  it('setFace clamps incoming value faces (REVIEW #24)', () => {
    let state = makeTestRun();
    state = setFace(state, REF, 2, { kind: 'value', value: 22, provenance: 'trapper' });
    expect(getFace(state, REF, 2)).toMatchObject({ value: 20 });
    state = setFace(state, REF, 3, { kind: 'value', value: -1, provenance: 'trapper' });
    expect(getFace(state, REF, 3)).toMatchObject({ value: 1 });
  });

  it('addFaceRider stacks riders', () => {
    let state = makeTestRun();
    state = addFaceRider(state, REF, 7, { hope: 1 }, 'priest');
    state = addFaceRider(state, REF, 7, { hope: 1, marked: true }, 'ferryman');
    expect(getFace(state, REF, 7)).toMatchObject({ hope: 2, marked: true });
  });
});

describe('isFaceEligible (the Merchant warranty rule)', () => {
  it('merchant may touch base and merchant-touched value faces below 20', () => {
    let state = makeTestRun();
    expect(isFaceEligible(state, REF, 10, 'merchant')).toBe(true); // base 11
    state = bumpFace(state, REF, 10, 1, 'merchant');
    expect(isFaceEligible(state, REF, 10, 'merchant')).toBe(true); // merchant-touched
  });

  it('merchant refuses 20s, riders, and aftermarket-touched faces', () => {
    let state = makeTestRun();
    expect(isFaceEligible(state, REF, 19, 'merchant')).toBe(false); // the 20
    state = bumpFace(state, REF, 4, 2, 'alchemist');
    expect(isFaceEligible(state, REF, 4, 'merchant')).toBe(false); // warranty voided
    state = addFaceRider(state, REF, 6, { hope: 1 }, 'priest');
    expect(isFaceEligible(state, REF, 6, 'merchant')).toBe(false); // rider
    state = scratchFace(state, REF, 8, 'base');
    expect(isFaceEligible(state, REF, 8, 'merchant')).toBe(false); // not a value
  });

  it('wheel only re-touches base or wheel faces; merchant and wheel exclude each other', () => {
    let state = makeTestRun();
    state = bumpFace(state, REF, 3, 1, 'wheel');
    expect(isFaceEligible(state, REF, 3, 'wheel')).toBe(true);
    expect(isFaceEligible(state, REF, 3, 'merchant')).toBe(false);
    state = bumpFace(state, REF, 5, 1, 'merchant');
    expect(isFaceEligible(state, REF, 5, 'wheel')).toBe(false);
  });
});
