import { describe, it, expect } from 'vitest';
import { startRun } from './lifecycle';
import { reduce } from './reducer';
import { assertInvariants } from './invariants';
import { makeTestRun } from './testkit';
import type { CombatState, RunState } from './types';

const START = {
  type: 'START_RUN' as const,
  seed: 'ci-keystone',
  heroNames: ['Blue', 'Red', 'Green'] as [string, string, string],
};

function combatFixture(state: RunState): RunState {
  const combat: CombatState = {
    kind: 'regular',
    enemyId: 'bandits',
    approaches: {
      physical: { dc: 8, threshold: 2, successes: 0 },
      verbal: { dc: 11, threshold: 2, successes: 0 },
      preventative: { dc: 14, threshold: 1, successes: 0 },
    },
    round: 1,
    activeHero: 1,
    lights: ['pending', 'pending', 'pending'],
    immuneApproach: null,
    attacksPerRound: 1,
    goldReward: 15,
    stagedDie: null,
  };
  return { ...state, phase: { kind: 'combat', combat, pendingDoomRolls: [] } };
}

describe('run lifecycle & reducer core', () => {
  it('DETERMINISM KEYSTONE: same seed + same actions => identical state JSON', () => {
    const runA = startRun(START);
    const runB = startRun(START);
    expect(JSON.stringify(runA)).toBe(JSON.stringify(runB));

    const actions = [{ type: 'ABANDON_RUN' as const }];
    const a = actions.reduce((s, act) => reduce(s, act).state, runA);
    const b = actions.reduce((s, act) => reduce(s, act).state, runB);
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
  });

  it('a fresh run passes invariants and survives a JSON round trip', () => {
    const state = startRun(START);
    assertInvariants(state);
    const revived = JSON.parse(JSON.stringify(state)) as RunState;
    expect(revived).toEqual(state);
    assertInvariants(revived);
  });

  it('rejections leave state identity-unchanged with one ACTION_REJECTED', () => {
    const state = makeTestRun();
    for (const action of [
      { type: 'START_RUN', seed: 'x', heroNames: ['a', 'b', 'c'] },
      { type: 'NOT_A_REAL_ACTION' },
      null,
      { player: 7, type: 'CAST_VOTE', nodeId: 'n1' },
    ]) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = reduce(state, action as any);
      expect(result.state).toBe(state);
      expect(result.events).toHaveLength(1);
      expect(result.events[0]!.type).toBe('ACTION_REJECTED');
    }
  });

  it('turn gating: acting out of turn is rejected', () => {
    const state = combatFixture(makeTestRun());
    const wrongSeat = reduce(state, { type: 'STAGE_DIE', player: 0, approach: 'physical' });
    expect(wrongSeat.state).toBe(state);
    expect(wrongSeat.events[0]).toMatchObject({ type: 'ACTION_REJECTED', player: 0, reason: 'not your turn' });

    // The right seat gets past the gate (and hits the brief-04 stub message).
    const rightSeat = reduce(state, { type: 'STAGE_DIE', player: 1, approach: 'physical' });
    expect(rightSeat.events[0]).toMatchObject({ type: 'ACTION_REJECTED' });
    expect((rightSeat.events[0] as { reason: string }).reason).toMatch(/brief 04/);
  });

  it('ABANDON_RUN ends the run and advances the tick', () => {
    const state = makeTestRun();
    const { state: next, events } = reduce(state, { type: 'ABANDON_RUN' });
    expect(next.phase).toEqual({ kind: 'defeat', reason: 'abandoned' });
    expect(next.tick).toBe(state.tick + 1);
    expect(events[0]).toMatchObject({ type: 'RUN_ENDED', result: 'defeat' });
  });

  it('invariants catch corrupted states', () => {
    const base = makeTestRun();
    expect(() => assertInvariants({ ...base, gold: NaN })).toThrow(/gold/);
    expect(() => assertInvariants({ ...base, hope: 5 })).toThrow(/maxHope/);

    const badDie = JSON.parse(JSON.stringify(base)) as RunState;
    badDie.heroes[0].dice.physical.faces.pop();
    expect(() => assertInvariants(badDie)).toThrow(/19 faces/);

    const badFace = JSON.parse(JSON.stringify(base)) as RunState;
    badFace.heroes[1].dice.verbal.faces[3] = { kind: 'value', value: 42, provenance: 'base' };
    expect(() => assertInvariants(badFace)).toThrow(/outside \[1,20\]/);

    const selfLink = JSON.parse(JSON.stringify(base)) as RunState;
    selfLink.heroes[2].dice.preventative.faces[0] = {
      kind: 'intertwine', target: { player: 2, approach: 'preventative' }, bonus: 0, provenance: 'alchemist',
    };
    expect(() => assertInvariants(selfLink)).toThrow(/its own die/);
  });
});
