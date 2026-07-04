# Brief 13 — Parity, cutover, and the bug ledger

**Depends on:** everything. The finish line.

## Goal

Prove the new app matches (and where REVIEW.md says so, deliberately
exceeds) the prototype, switch deployment to it, and retire the legacy
code.

## Parity checklist (play both, side by side)

- [ ] Solo run: title → tutorial → stages 1-5 → BOMB → victory screen.
- [ ] Multiplayer: 3 devices join, draft, full stage, disconnect+rejoin
      mid-combat, save on host, continue next day.
- [ ] Every encounter in the catalog reachable and completable.
- [ ] All 10 exotic dice obtainable and behaving per README.
- [ ] FAVOR store: every upgrade purchasable, its effect observable.
- [ ] Merchant + Wheel with warranty rules.
- [ ] Save slots ×3, mid-combat resume.
- [ ] Feel: dice animation, DOOM-roll drama, traffic light, Pal's death
      lands like the prototype. (Subjective — get the designer to play it.)

## Bug ledger — every REVIEW.md finding needs a linked regression test

| # | Finding | Where covered |
|---|---------|---------------|
| 1 | NaN gold reward | brief 04 test 2 |
| 2 | biased shuffle | rng.ts `shuffled` + brief 04 test 1 |
| 3 | DC sum not enforced | brief 04 test 1 |
| 4 | dead code | n/a (rewrite) |
| 5 | double HOPE nat-20 | brief 02 test 7 |
| 6 | restore_die off-by-one | brief 06 regression |
| 7/8/9 | state reset/serialize/shallow-copy | briefs 01 & 08 (round-trip + invariants) |
| 10 | Gambler payout inversion | brief 06 regression |
| 11 | +2/+1 HOPE mismatch | brief 06 regression |
| 12 | DOOM death spiral | brief 03 (subtraction cap + statistical test) |
| 13 | BOMB unwinnable | **open — this brief**, see below |
| 14 | solo voting friction | brief 10 (one-click solo vote) |
| 15 | gold sinks | briefs 05+07 (guaranteed pre-boss merchant) |
| 16 | approach lock | brief 04 test 6 |
| 17 | Ferryman mark range | content knob — widen to [5,18] in the port, flag for designer |
| 18-23 | architecture/XSS/timers/saves | the architecture itself + UI briefs |
| 24 | face clamping | brief 02 test 8 + content validation |

Audit that each listed test actually exists and references the REVIEW
number in its name; write any that fell through the cracks.

## Balance work owned here (simulation, not vibes)

The engine is headless — exploit it. Write `src/engine/sim/` harness:
scripted "competent player" policy, N-thousand runs per stage, report wipe
rates and DOOM distributions. Use it to:
- Tune `doomRollSubtractionCap` (brief 03 knob).
- Fix BOMB (REVIEW #13): candidate levers = threshold sums, immunity
  timing, attacksPerRound, stage-5 HOPE availability. Target: a party that
  cleared stage 4 wins 40-60% of BOMB attempts. Present findings + chosen
  numbers in the PR for designer sign-off.
- Sanity-check the Stage-5 encounter set the README flags as "way off
  balance".

## Cutover steps

1. Playwright smoke suite (title → run → encounter → roll → save → reload
   → resume) green in CI.
2. Update `.github/workflows/deploy.yml`: `npm ci && npm run build`,
   publish `dist/` (plus `vite.config.ts` `base` for project pages).
   Add a CI workflow running typecheck + vitest on PRs if not already
   done by an earlier brief.
3. Move `index.html js/ css/ tests/ PLAN-private-dice-viewing.md` →
   `legacy/` with a README note (delete after one release of soak).
4. Point README's implementation-status section at the new app;
   REVIEW.md gets a "resolved in rewrite" header.
