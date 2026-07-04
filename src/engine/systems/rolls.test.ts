import { describe, it, expect } from 'vitest';
import { seedRng } from '../rng';
import type { DieRef, Face, RunState } from '../types';
import { makeTestRun, makeDie, allFaces } from '../testkit';
import { resolveRoll, MAX_CHAIN_DEPTH } from './rolls';
import { intertwineFace } from './faces';

const P0_PHYS: DieRef = { player: 0, approach: 'physical' };
const P1_PHYS: DieRef = { player: 1, approach: 'physical' };

/** Replace one die on a test run. */
function withDie(state: RunState, ref: DieRef, faces: (number | Face)[]): RunState {
  const heroes = state.heroes.map((h, i) =>
    i === ref.player
      ? { ...h, dice: { ...h.dice, [ref.approach]: makeDie(h.dice[ref.approach].talent, faces) } }
      : h,
  ) as RunState['heroes'];
  return { ...state, heroes };
}

function withExotic(state: RunState, ref: DieRef, exoticId: string): RunState {
  const heroes = state.heroes.map((h, i) =>
    i === ref.player
      ? { ...h, dice: { ...h.dice, [ref.approach]: { ...h.dice[ref.approach], exoticId } } }
      : h,
  ) as RunState['heroes'];
  return { ...state, heroes };
}

const iw = (target: DieRef, bonus = 0): Face => ({
  kind: 'intertwine', target, bonus, provenance: 'alchemist',
});

describe('resolveRoll', () => {
  it('resolves a plain value roll deterministically', () => {
    const state = makeTestRun();
    const rng = seedRng('roll-1');
    const [a] = resolveRoll(state, P0_PHYS, rng);
    const [b] = resolveRoll(state, P0_PHYS, rng);
    expect(a).toEqual(b);
    expect(a.steps).toHaveLength(1);
    expect(a.steps[0]!.via).toBe('initial');
    expect(a.total).toBeGreaterThanOrEqual(1);
    expect(a.total).toBeLessThanOrEqual(20);
  });

  it('follows an intertwine to the ally die and applies the bonus', () => {
    let state = makeTestRun();
    state = withDie(state, P0_PHYS, allFaces(iw(P1_PHYS, 3)));
    const [res] = resolveRoll(state, P0_PHYS, seedRng('roll-iw'));
    expect(res.steps).toHaveLength(2);
    expect(res.steps[0]!.face.kind).toBe('intertwine');
    expect(res.steps[1]!.via).toBe('intertwine');
    expect(res.steps[1]!.die).toEqual(P1_PHYS);
    const raw = (res.steps[1]!.face as Extract<Face, { kind: 'value' }>).value;
    expect(res.total).toBe(raw + 3);
    // naturalness judged on the ally's raw face, pre-bonus
    expect(res.natural20).toBe(raw === 20);
  });

  it('terminates intertwine cycles at MAX_CHAIN_DEPTH with a forced resolution', () => {
    let state = makeTestRun();
    state = withDie(state, P0_PHYS, allFaces(iw(P1_PHYS)));
    state = withDie(state, P1_PHYS, allFaces(iw(P0_PHYS)));
    const [res] = resolveRoll(state, P0_PHYS, seedRng('roll-cycle'));
    expect(res.steps.length).toBeLessThanOrEqual(MAX_CHAIN_DEPTH);
    // neither die has value faces -> neutral fallback
    expect(res.total).toBe(10);
  });

  it('re-rolls the same die on scratched faces', () => {
    let state = makeTestRun();
    // Half scratched, half 15s: rolls eventually land on a value.
    const faces: (number | Face)[] = [];
    for (let i = 0; i < 20; i++) {
      faces.push(i % 2 === 0 ? { kind: 'scratched', provenance: 'base' } : 15);
    }
    state = withDie(state, P0_PHYS, faces);
    let rng = seedRng('roll-scratch');
    let sawReroll = false;
    for (let i = 0; i < 50; i++) {
      const [res, rng2] = resolveRoll(state, P0_PHYS, rng);
      rng = rng2;
      const last = res.steps[res.steps.length - 1]!;
      if (res.steps.length > 1 && last.face.kind === 'value') {
        expect(res.steps.every((s) => s.die.player === 0)).toBe(true);
        expect(res.steps[1]!.via).toBe('scratch-reroll');
        sawReroll = true;
      }
      if (last.face.kind === 'value') expect(res.total).toBe(15);
    }
    expect(sawReroll).toBe(true);
  });

  it('chaos takes the middle of three sub-rolls', () => {
    let state = makeTestRun();
    state = withDie(state, P0_PHYS, allFaces({ kind: 'chaos', provenance: 'cultist' }));
    // Make verbal and preventative dice constant so the middle is known:
    state = withDie(state, { player: 0, approach: 'verbal' }, Array(20).fill(5));
    state = withDie(state, { player: 0, approach: 'preventative' }, Array(20).fill(12));
    const [res] = resolveRoll(state, P0_PHYS, seedRng('roll-chaos'));
    // physical die is all chaos -> its sub-roll falls back to 10; middle of
    // {10, 5, 12} = 10.
    expect(res.total).toBe(10);
    expect(res.steps.some((s) => s.via === 'chaos')).toBe(true);
  });

  it('accumulates hope/doom riders along the chain', () => {
    let state = makeTestRun();
    state = withDie(state, P0_PHYS, allFaces({
      kind: 'value', value: 5, hope: 1, doom: 2, provenance: 'ferryman', marked: true,
    }));
    const [res] = resolveRoll(state, P0_PHYS, seedRng('roll-riders'));
    expect(res.total).toBe(5);
    expect(res.hopeGained).toBe(1);
    expect(res.doomGained).toBe(2);
  });

  it('natural 20 with a hope rider grants exactly 1 + rider (REVIEW #5)', () => {
    let state = makeTestRun();
    state = withDie(state, P0_PHYS, allFaces({
      kind: 'value', value: 20, hope: 1, provenance: 'priest',
    }));
    const [res] = resolveRoll(state, P0_PHYS, seedRng('roll-nat20'));
    expect(res.natural20).toBe(true);
    expect(res.hopeGained).toBe(2);
  });

  it('natural 1 adds DOOM', () => {
    let state = makeTestRun();
    state = withDie(state, P0_PHYS, Array(20).fill(1));
    const [res] = resolveRoll(state, P0_PHYS, seedRng('roll-nat1'));
    expect(res.natural1).toBe(true);
    expect(res.doomGained).toBe(1);
    expect(res.total).toBe(1);
  });

  describe('exotic behaviors', () => {
    it('lucky-sevens: 7 -> 17, 17 -> 20 (naturalness post-transform)', () => {
      let state = makeTestRun();
      state = withDie(state, P0_PHYS, Array(20).fill(17));
      state = withExotic(state, P0_PHYS, 'lucky-sevens');
      const [res] = resolveRoll(state, P0_PHYS, seedRng('roll-77'));
      expect(res.total).toBe(20);
      expect(res.natural20).toBe(true);
    });

    it('doubler: doubles the total except on a raw 1; not a natural 20', () => {
      let state = makeTestRun();
      state = withDie(state, P0_PHYS, Array(20).fill(10));
      state = withExotic(state, P0_PHYS, 'doubler');
      const [res] = resolveRoll(state, P0_PHYS, seedRng('roll-x2'));
      expect(res.total).toBe(20);
      expect(res.natural20).toBe(false);

      let s1 = withDie(makeTestRun(), P0_PHYS, Array(20).fill(1));
      s1 = withExotic(s1, P0_PHYS, 'doubler');
      const [res1] = resolveRoll(s1, P0_PHYS, seedRng('roll-x2-nat1'));
      expect(res1.total).toBe(1);
      expect(res1.natural1).toBe(true);
    });

    it('wildcard: redirects to another die', () => {
      let state = makeTestRun();
      state = withExotic(state, P0_PHYS, 'wildcard');
      const [res] = resolveRoll(state, P0_PHYS, seedRng('roll-wild'));
      const first = res.steps[0]!;
      expect(first.die).not.toEqual(P0_PHYS);
      expect(first.via).toBe('intertwine');
      expect(res.total).toBeGreaterThanOrEqual(1);
    });
  });

  it('fuzz: never throws, always terminates, total >= 1', () => {
    let state = makeTestRun();
    // A hostile board: cycles, scratches, chaos, riders all mixed in.
    state = withDie(state, P0_PHYS, [
      iw(P1_PHYS, 2), { kind: 'scratched', provenance: 'base' },
      { kind: 'chaos', provenance: 'cultist' }, 1, 20,
      iw({ player: 2, approach: 'verbal' }), 7,
      { kind: 'value', value: 13, doom: 1, provenance: 'ferryman', marked: true },
    ]);
    state = withDie(state, P1_PHYS, [iw(P0_PHYS), { kind: 'scratched', provenance: 'base' }, 4]);
    let rng = seedRng('fuzz');
    for (let i = 0; i < 2000; i++) {
      const [res, rng2] = resolveRoll(state, P0_PHYS, rng);
      rng = rng2;
      expect(res.total).toBeGreaterThanOrEqual(1);
      expect(res.steps.length).toBeLessThanOrEqual(MAX_CHAIN_DEPTH + 3 * MAX_CHAIN_DEPTH);
      expect(res.hopeGained).toBeGreaterThanOrEqual(0);
      expect(res.doomGained).toBeGreaterThanOrEqual(0);
    }
  });
});

describe('face op guards', () => {
  it('intertwineFace refuses self-links', () => {
    const state = makeTestRun();
    expect(() => intertwineFace(state, P0_PHYS, 3, P0_PHYS, 'alchemist')).toThrow(/itself/);
  });
});
