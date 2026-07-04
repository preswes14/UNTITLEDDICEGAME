# Implementation briefs

Fourteen self-contained work packages. Read `../../ARCHITECTURE.md` and
`00-conventions-and-workflow.md` first — every brief assumes both.

| # | Brief | Depends on | Status |
|---|-------|------------|--------|
| 00 | Conventions & workflow | — | (read-only) |
| 01 | Engine core | — | ✅ DONE (CONTINUE stage-flow arms land with 05/07/12) |
| 02 | Dice, rolls, intertwine | 01 | ✅ DONE (draft/BASE_DICE content moved to 12; 6 plain exotic dice to 06) |
| 03 | DOOM / HOPE / shields | 01 | open |
| 04 | Combat | 01, 02, 03 | open |
| 05 | Map generation & voting | 01 | open |
| 06 | Encounters & content port | 01, 02 | open |
| 07 | Economy & shops | 01, 02 | open (isFaceEligible already done) |
| 08 | Save / load | 01 | open |
| 09 | Sessions & multiplayer | 01 | ✅ DONE except live-Supabase verification + heartbeat timers |
| 10 | Main-screen UI | 08, 09 | open |
| 11 | Player controller UI | 09, 10 | open |
| 12 | Tutorial & narrative | 04, 06, 07 | open |
| 13 | Parity, cutover, bug ledger | all | open (do last) |

Parallel-safe grouping is unchanged: with 01/02/09 done, briefs
**03, 05, 06, 07, 08** can all proceed in parallel today.

Suggested waves: **01** → **02+03+05+08+09** → **04+06+07+10** →
**11+12** → **13**.
