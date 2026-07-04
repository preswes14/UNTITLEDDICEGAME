// ============================================================================
// SUPABASE TRANSPORT — Transport over Supabase Realtime broadcast channels.
//
// STATUS: IMPLEMENTED, needs live verification (brief 09: run the session
// test scenarios against a real Supabase project — this file cannot be
// exercised in CI without one). All game logic stays out: this file only
// moves NetMessages. Credentials come from the environment
// (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY via import.meta.env at the
// composition root), never hard-coded (the legacy prototype inlined them).
//
// Wire format: every message goes as a broadcast event 'msg' with payload
// { senderId, msg }. Presence tracking uses Supabase's presence keys =
// endpointId. Rooms are channels named `room:{CODE}`.
// ============================================================================

import { createClient, type RealtimeChannel, type SupabaseClient } from '@supabase/supabase-js';
import type { NetMessage, Transport } from './transport';

const ROOM_CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ'; // no I/O (legacy convention)

function randomRoomCode(): string {
  let code = '';
  const bytes = new Uint32Array(4);
  crypto.getRandomValues(bytes);
  for (const b of bytes) code += ROOM_CODE_ALPHABET[b % ROOM_CODE_ALPHABET.length];
  return code;
}

export function createSupabaseTransport(config: {
  url: string;
  anonKey: string;
}): Transport {
  const endpointId = crypto.randomUUID();
  let client: SupabaseClient | null = null;
  let channel: RealtimeChannel | null = null;
  const messageHandlers = new Set<(msg: NetMessage, senderId: string) => void>();
  const presenceHandlers = new Set<(present: string[]) => void>();

  function connect(code: string): Promise<void> {
    client = createClient(config.url, config.anonKey, {
      realtime: { params: { eventsPerSecond: 20 } },
    });
    channel = client.channel(`room:${code}`, {
      config: {
        broadcast: { self: false },
        presence: { key: endpointId },
      },
    });

    channel.on('broadcast', { event: 'msg' }, ({ payload }) => {
      const { senderId, msg } = payload as { senderId: string; msg: NetMessage };
      if (typeof senderId !== 'string' || !msg || typeof msg.t !== 'string') return;
      for (const cb of messageHandlers) cb(msg, senderId);
    });

    channel.on('presence', { event: 'sync' }, () => {
      const present = Object.keys(channel?.presenceState() ?? {})
        .filter((id) => id !== endpointId);
      for (const cb of presenceHandlers) cb(present);
    });

    return new Promise<void>((resolve, reject) => {
      channel!.subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel!.track({ online: true });
          resolve();
        } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          reject(new Error(`Supabase channel ${status}`));
        }
      });
    });
  }

  return {
    endpointId,

    async host(): Promise<string> {
      const code = randomRoomCode();
      await connect(code);
      return code;
    },

    async join(code: string): Promise<void> {
      await connect(code.toUpperCase());
    },

    send(msg: NetMessage): void {
      if (!channel) return;
      void channel.send({
        type: 'broadcast',
        event: 'msg',
        payload: { senderId: endpointId, msg },
      });
    },

    onMessage(cb) {
      messageHandlers.add(cb);
      return () => messageHandlers.delete(cb);
    },

    onPresence(cb) {
      presenceHandlers.add(cb);
      return () => presenceHandlers.delete(cb);
    },

    async close(): Promise<void> {
      messageHandlers.clear();
      presenceHandlers.clear();
      if (channel) await channel.unsubscribe();
      if (client) await client.removeAllChannels();
      channel = null;
      client = null;
    },
  };
}
