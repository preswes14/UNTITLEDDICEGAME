// ============================================================================
// ENTRY POINT — composition root.
//
// STATUS: STUB. Wire up per docs/briefs/10-main-screen-ui.md and
// 11-player-controller-ui.md.
//
// Boot flow:
//   1. Read URL: plain load -> title screen (host path);
//      ?room=CODE -> player-controller join flow (client path).
//   2. Host path: title -> new game (createHostSession over local or
//      supabase transport) or continue (loadRun).
//   3. Render loop: session.subscribe -> route Phase.kind to a screen,
//      play events through the animation queue, re-render.
// ============================================================================

console.log('UNTITLED DICE GAME — new architecture scaffold. See ARCHITECTURE.md.');

// TODO(brief-10): bootstrapping as described above.
