import { describe, it, expect } from 'vitest';
import {
  seedRng, nextU32, nextInt, d20, pick, pickWeighted, shuffled,
  type RngState,
} from './rng';

describe('rng', () => {
  it('is deterministic for the same seed', () => {
    const a = seedRng('hello');
    const b = seedRng('hello');
    expect(a).toEqual(b);
    expect(nextU32(a)[0]).toBe(nextU32(b)[0]);
  });

  it('differs across seeds', () => {
    expect(seedRng('hello')).not.toEqual(seedRng('world'));
  });

  it('is pure — drawing does not mutate the input state', () => {
    const s = seedRng('pure');
    const snapshot = [...s];
    nextU32(s);
    d20(s);
    expect([...s]).toEqual(snapshot);
  });

  it('round-trips through JSON (save/load safety)', () => {
    let s = seedRng('save-me');
    for (let i = 0; i < 100; i++) s = nextU32(s)[1];
    const revived = JSON.parse(JSON.stringify(s)) as RngState;
    expect(nextU32(revived)[0]).toBe(nextU32(s)[0]);
  });

  it('d20 stays in [1,20] and hits both extremes', () => {
    let s = seedRng('d20');
    const seen = new Set<number>();
    for (let i = 0; i < 5000; i++) {
      const [v, s2] = d20(s);
      s = s2;
      expect(v).toBeGreaterThanOrEqual(1);
      expect(v).toBeLessThanOrEqual(20);
      seen.add(v);
    }
    expect(seen.size).toBe(20);
  });

  it('nextInt is roughly uniform (no modulo bias smell)', () => {
    let s = seedRng('uniform');
    const counts = [0, 0, 0];
    for (let i = 0; i < 30000; i++) {
      const [v, s2] = nextInt(s, 0, 2);
      s = s2;
      counts[v]!++;
    }
    for (const c of counts) {
      expect(c).toBeGreaterThan(9000);
      expect(c).toBeLessThan(11000);
    }
  });

  it('pickWeighted respects weights approximately (47/27/27 split)', () => {
    let s = seedRng('weighted');
    const tally = { good: 0, neutral: 0, bad: 0 };
    for (let i = 0; i < 30000; i++) {
      const [v, s2] = pickWeighted(s, [
        { weight: 47, value: 'good' as const },
        { weight: 27, value: 'neutral' as const },
        { weight: 27, value: 'bad' as const },
      ]);
      s = s2;
      tally[v]++;
    }
    expect(tally.good / 30000).toBeCloseTo(0.465, 1);
    expect(tally.neutral / 30000).toBeCloseTo(0.267, 1);
    expect(tally.bad / 30000).toBeCloseTo(0.267, 1);
  });

  it('shuffled returns a permutation and does not mutate input', () => {
    const input = [1, 2, 3, 4, 5, 6, 7, 8];
    const s = seedRng('shuffle');
    const [out] = shuffled(s, input);
    expect(out).not.toBe(input);
    expect([...out].sort((a, b) => a - b)).toEqual(input);
    expect(input).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
  });

  it('pick draws every element eventually', () => {
    let s = seedRng('pick');
    const seen = new Set<string>();
    for (let i = 0; i < 200; i++) {
      const [v, s2] = pick(s, ['a', 'b', 'c'] as const);
      s = s2;
      seen.add(v);
    }
    expect(seen.size).toBe(3);
  });
});
