# Implementation briefs

Fourteen self-contained work packages. Read `../../ARCHITECTURE.md` and
`00-conventions-and-workflow.md` first — every brief assumes both.

| # | Brief | Depends on | Parallel-safe with |
|---|-------|------------|--------------------|
| 00 | Conventions & workflow | — | (read-only) |
| 01 | Engine core | — | — (do first) |
| 02 | Dice, rolls, intertwine | 01 | 03, 05, 08, 09 |
| 03 | DOOM / HOPE / shields | 01 | 02, 05, 08, 09 |
| 04 | Combat | 01, 02, 03 | 06, 07, 08, 09 |
| 05 | Map generation & voting | 01 | 02, 03, 08, 09 |
| 06 | Encounters & content port | 01, 02 | 04, 05, 07 |
| 07 | Economy & shops | 01, 02 | 04, 05, 06 |
| 08 | Save / load | 01 | almost everything |
| 09 | Sessions & multiplayer | 01 | 02-08 |
| 10 | Main-screen UI | 08, 09 | 11 (after shared theme lands) |
| 11 | Player controller UI | 09, 10 | — |
| 12 | Tutorial & narrative | 04, 06, 07 | 10, 11 |
| 13 | Parity, cutover, bug ledger | all | — (do last) |

Suggested waves: **01** → **02+03+05+08+09** → **04+06+07+10** →
**11+12** → **13**.
