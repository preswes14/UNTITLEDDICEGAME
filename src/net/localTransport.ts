// ============================================================================
// LOCAL TRANSPORT — in-process loopback. STATUS: IMPLEMENTED (brief 09).
//
// Solo mode and every session test run through this, so the session layer
// never special-cases "offline". Delivery is async (microtask) to mirror
// real-network ordering semantics and avoid reentrancy.
// ============================================================================

import type { NetMessage, Transport } from './transport';

type MessageHandler = (msg: NetMessage, senderId: string) => void;
type PresenceHandler = (present: string[]) => void;

interface EndpointHooks {
  messages: Set<MessageHandler>;
  presence: Set<PresenceHandler>;
  connected: boolean;
}

export function createLocalTransportHub(): {
  hostEndpoint: Transport;
  createClientEndpoint: () => Transport;
} {
  let nextId = 0;
  const host: EndpointHooks = { messages: new Set(), presence: new Set(), connected: true };
  const clients = new Map<string, EndpointHooks>();

  function deliver(hooks: EndpointHooks, msg: NetMessage, senderId: string): void {
    queueMicrotask(() => {
      if (!hooks.connected) return;
      // Structured-clone through JSON: enforces the wire-format contract
      // (no shared references between "machines") even in-process.
      const copy = JSON.parse(JSON.stringify(msg)) as NetMessage;
      for (const cb of hooks.messages) cb(copy, senderId);
    });
  }

  function presentIds(): string[] {
    return [...clients.entries()].filter(([, h]) => h.connected).map(([id]) => id);
  }

  function firePresence(): void {
    const present = presentIds();
    queueMicrotask(() => {
      for (const cb of host.presence) cb([...present]);
      for (const [, hooks] of clients) {
        if (hooks.connected) for (const cb of hooks.presence) cb([...present]);
      }
    });
  }

  const hostEndpoint: Transport = {
    endpointId: 'host',
    host: () => Promise.resolve('LOCL'),
    join: () => Promise.reject(new Error('host endpoint cannot join')),
    send: (msg) => {
      for (const [id, hooks] of clients) {
        void id;
        deliver(hooks, msg, 'host');
      }
    },
    onMessage: (cb) => {
      host.messages.add(cb);
      return () => host.messages.delete(cb);
    },
    onPresence: (cb) => {
      host.presence.add(cb);
      return () => host.presence.delete(cb);
    },
    close: () => {
      host.connected = false;
      host.messages.clear();
      return Promise.resolve();
    },
  };

  function createClientEndpoint(): Transport {
    const id = `local-${nextId++}`;
    const hooks: EndpointHooks = { messages: new Set(), presence: new Set(), connected: false };
    clients.set(id, hooks);

    return {
      endpointId: id,
      host: () => Promise.reject(new Error('client endpoint cannot host')),
      join: () => {
        hooks.connected = true;
        firePresence();
        return Promise.resolve();
      },
      send: (msg) => {
        if (!hooks.connected) return;
        deliver(host, msg, id);
      },
      onMessage: (cb) => {
        hooks.messages.add(cb);
        return () => hooks.messages.delete(cb);
      },
      onPresence: (cb) => {
        hooks.presence.add(cb);
        return () => hooks.presence.delete(cb);
      },
      close: () => {
        hooks.connected = false;
        hooks.messages.clear();
        firePresence();
        return Promise.resolve();
      },
    };
  }

  return { hostEndpoint, createClientEndpoint };
}
