// ============================================================================
// LOCAL TRANSPORT — in-process loopback.
//
// STATUS: STUB. Implement per docs/briefs/09-multiplayer.md (do this FIRST —
// solo mode and every session test runs through it, so the session layer
// never special-cases "offline").
// ============================================================================

import type { Transport } from './transport';

/** Creates a pair of endpoints wired to each other, or a hub supporting
 *  multiple joiners for 3-tabs-on-one-machine testing. */
export function createLocalTransportHub(): {
  hostEndpoint: Transport;
  createClientEndpoint: () => Transport;
} {
  throw new Error('createLocalTransportHub not implemented (brief-09)');
}
