import { describe, it, expect } from 'vitest';
import { createLocalTransportHub } from '@net/localTransport';
import { createClientSession, createHostSession, sanitizeName, type Session } from './session';
import type { GameAction } from '@engine/actions';

const START: GameAction = {
  type: 'START_RUN',
  seed: 'net-seed',
  heroNames: ['Blue', 'Red', 'Green'],
};

/** Let queued microtask deliveries drain. */
const flush = () => new Promise<void>((r) => setTimeout(r, 0));

async function threePlayerRoom() {
  const hub = createLocalTransportHub();
  const host = createHostSession({
    transport: hub.hostEndpoint,
    localSeats: [0],
    initialState: null,
  });
  const clients: Session[] = [];
  for (const name of ['Red', 'Green']) {
    clients.push(
      await createClientSession({
        transport: hub.createClientEndpoint(),
        roomCode: 'LOCL',
        playerName: name,
      }),
    );
  }
  return { hub, host, clients };
}

describe('multiplayer sessions over local transport', () => {
  it('assigns seats in join order and refuses a 4th player', async () => {
    const { hub, host, clients } = await threePlayerRoom();
    expect(host.localSeats()).toEqual([0]);
    expect(clients[0]!.localSeats()).toEqual([1]);
    expect(clients[1]!.localSeats()).toEqual([2]);

    await expect(
      createClientSession({
        transport: hub.createClientEndpoint(),
        roomCode: 'LOCL',
        playerName: 'Extra',
      }),
    ).rejects.toThrow(/full/);
  });

  it('round-trips actions: client dispatch -> host reduce -> everyone syncs', async () => {
    const { host, clients } = await threePlayerRoom();
    host.dispatch(START);
    await flush();
    expect(host.getState()?.seed).toBe('net-seed');
    expect(clients[0]!.getState()?.seed).toBe('net-seed');
    expect(clients[1]!.getState()?.seed).toBe('net-seed');

    clients[1]!.dispatch({ type: 'ABANDON_RUN' });
    await flush();
    for (const s of [host, ...clients]) {
      expect(s.getState()?.phase).toEqual({ kind: 'defeat', reason: 'abandoned' });
      expect(s.getState()?.tick).toBe(1);
    }
  });

  it('applies actions serially: N dispatches => tick N everywhere', async () => {
    const { host, clients } = await threePlayerRoom();
    host.dispatch(START);
    await flush();
    for (let i = 0; i < 25; i++) {
      const sender = [host, clients[0]!, clients[1]!][i % 3]!;
      sender.dispatch({ type: 'ABANDON_RUN' });
    }
    await flush();
    for (const s of [host, ...clients]) {
      expect(s.getState()?.tick).toBe(25);
    }
    // Determinism across the wire: all replicas byte-identical.
    expect(JSON.stringify(clients[0]!.getState())).toBe(JSON.stringify(host.getState()));
  });

  it('rejected actions do not advance state but do notify', async () => {
    const { host, clients } = await threePlayerRoom();
    host.dispatch(START);
    await flush();
    const seen: string[] = [];
    clients[0]!.subscribe((_s, events) => {
      for (const e of events) seen.push(e.type);
    });
    clients[0]!.dispatch({ type: 'CAST_VOTE', player: 1, nodeId: 'nope' });
    await flush();
    expect(host.getState()?.tick).toBe(0);
    expect(seen).toContain('ACTION_REJECTED');
  });

  it('spoofed seats are dropped at the session layer', async () => {
    const { hub, host } = await threePlayerRoom();
    host.dispatch(START);
    await flush();
    // A raw endpoint that never said hello, claiming seat 1:
    const rogue = hub.createClientEndpoint();
    await rogue.join('LOCL');
    rogue.send({ t: 'action', from: 1, action: { type: 'ABANDON_RUN' } });
    await flush();
    expect(host.getState()?.tick).toBe(0);
    expect(host.getState()?.phase.kind).not.toBe('defeat');
  });

  it('disconnect pauses the game and blocks input; rejoin reclaims the seat and resumes', async () => {
    const hub = createLocalTransportHub();
    const host = createHostSession({
      transport: hub.hostEndpoint, localSeats: [0], initialState: null,
    });
    const redEndpoint = hub.createClientEndpoint();
    const red = await createClientSession({
      transport: redEndpoint, roomCode: 'LOCL', playerName: 'Red',
    });
    const green = await createClientSession({
      transport: hub.createClientEndpoint(), roomCode: 'LOCL', playerName: 'Green',
    });
    host.dispatch(START);
    await flush();

    await red.close();
    await flush();

    // Paused: green's input is dropped.
    green.dispatch({ type: 'ABANDON_RUN' });
    await flush();
    expect(host.getState()?.tick).toBe(0);

    // Rejoin by name reclaims seat 1 with the current snapshot.
    const red2 = await createClientSession({
      transport: hub.createClientEndpoint(), roomCode: 'LOCL', playerName: 'Red',
    });
    expect(red2.localSeats()).toEqual([1]);
    expect(red2.getState()?.seed).toBe('net-seed');

    // Resumed: input flows again.
    green.dispatch({ type: 'ABANDON_RUN' });
    await flush();
    expect(host.getState()?.tick).toBe(1);
  });

  it('solo mode is the same code path with all seats local', async () => {
    const hub = createLocalTransportHub();
    const solo = createHostSession({
      transport: hub.hostEndpoint, localSeats: [0, 1, 2], initialState: null,
    });
    let notified = 0;
    solo.subscribe(() => { notified++; });
    solo.dispatch(START);
    solo.dispatch({ type: 'ABANDON_RUN' });
    expect(solo.getState()?.phase.kind).toBe('defeat');
    expect(solo.localSeats()).toEqual([0, 1, 2]);
    expect(notified).toBe(2);
  });
});

describe('sanitizeName', () => {
  it('trims, strips control characters, caps length, defaults empties', () => {
    expect(sanitizeName('  Red  ')).toBe('Red');
    expect(sanitizeName('a\u0007bc')).toBe('abc');
    expect(sanitizeName('x'.repeat(100))).toHaveLength(24);
    expect(sanitizeName('   ')).toBe('Anon');
  });
});
