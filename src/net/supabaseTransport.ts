// ============================================================================
// SUPABASE TRANSPORT — Transport over Supabase Realtime broadcast channels.
//
// STATUS: STUB. Implement per docs/briefs/09-multiplayer.md.
// Port connection handling from the legacy js/multiplayer.js (room codes,
// heartbeat, disconnect-pause) but keep ALL game logic out — this file only
// moves NetMessages. Credentials come from env (import.meta.env), not
// hard-coded source (legacy had them inline).
// ============================================================================

import type { Transport } from './transport';

export function createSupabaseTransport(config: {
  url: string;
  anonKey: string;
}): Transport {
  void config;
  throw new Error('createSupabaseTransport not implemented (brief-09)');
}
