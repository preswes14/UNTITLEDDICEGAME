# Code & Game Design Review: UNTITLED DICE GAME

**Reviewer perspective**: Senior game developer
**Codebase**: ~10,500 lines vanilla JS, Supabase multiplayer, localStorage persistence
**Version reviewed**: 0.5.0

---

## BUGS & ERRORS

### 1. Regular combat gold reward is `undefined` (CRITICAL)
**File**: `js/combat.js:481`

`startCombat` sets `state.rewardPerSuccess` but the victory path in `processRollResult` references `state.reward`, which doesn't exist. This makes `gameState.gold += undefined`, turning gold into `NaN` for the rest of the run.

```js
// combat.js:481 — uses state.reward (undefined)
addGold(state.reward);

// combat.js:47 — sets rewardPerSuccess, not reward
rewardPerSuccess: rewardPerSuccess,
```

### 2. Biased shuffle via `sort(() => Math.random() - 0.5)`
**Files**: `js/combat.js:33,143`, `js/encounters.js:665`

`Array.sort` with a random comparator is not a uniform shuffle. Different JS engines produce different biases. Use Fisher-Yates (which is already used correctly in `config.js:162`).

### 3. `generateTotalDCSumDCs` doesn't enforce its target sum
**File**: `js/config.js:140-172`

After clamping the hard DC, the code computes `diff = totalDCSum - actualSum` but never applies the correction. The comment says "adjust medium slightly" but no adjustment occurs. The Total DC Sum system is therefore approximate, not exact.

### 4. Dead variable: `totalSuccessesNeeded`
**File**: `js/combat.js:42`

Computed but never referenced. Appears to be leftover from a previous design iteration.

### 5. Double HOPE on natural 20 with hope segments
**File**: `js/dice.js:112-149`

`showRollResult` grants +1 HOPE for nat-20, then separately checks `die.hopeSegments.includes(result)`. If 20 is in the hope segments, the player gets +2 HOPE for a single roll. May be unintended.

### 6. `restore_die` has an off-by-one and nonsensical replacement value
**File**: `js/encounters.js:284-286`

```js
if (oneIdx > 0) {  // Skips index 0
    randomDie.faces[oneIdx] = oneIdx + 1;  // Value based on array position, not game logic
```

- Condition `> 0` skips index 0 (should be `>= 0` or `!== -1`)
- Replacement value is the array index + 1, not a meaningful game value. Face at index 19 becomes 20; face at index 1 becomes 2.

### 7. `resetGameState` doesn't reset `totalFavor` or `favorModifiers`
**File**: `js/state.js:64-108`

Starting a second run carries over favor modifiers from the previous game.

### 8. `getSerializableState` omits `totalFavor`, `favorModifiers`, `gameMode`
**File**: `js/state.js:112-168`

These fields exist on `gameState` but aren't serialized, so they're lost on save/load.

### 9. Shallow copy of nested encounter state in serialization
**File**: `js/state.js:165-166`

```js
encounterState: gameState.encounterState ? { ...gameState.encounterState } : null,
```

Nested objects like `successCounters`, `approachDCs`, `voting.votes` are shared references after spread. Mutating restored state corrupts the original save data in memory.

### 10. Gambler reward logic is inverted for "out" bets
**File**: `js/combat.js:503-511`

When the player bets OUT and wins (roll is out of range), the code gives `outRangeReward` (the consolation value of 2) instead of the winning value of 5. The reward mapping is keyed on the roll result rather than the bet outcome.

### 11. Sanctuary encounter text/code mismatch
**File**: `js/config.js:744` says "+2 HOPE", `js/encounters.js:295` calls `addHope(1)`.

---

## GAME DESIGN ISSUES

### 12. DOOM death spiral with no rubber-banding

Every combat miss triggers a team DOOM roll (3 players roll, any effective-1 = death unless HOPE). Probabilities:

| DOOM level | P(at least one effective-1 per roll) |
|-----------|--------------------------------------|
| 0         | 14.3%                                |
| 3         | 38.6%                                |
| 5         | 65.7%                                |
| 8         | 88.4%                                |

Once DOOM rises, misses become more likely (higher DCs in later stages), which triggers more DOOM rolls, which raise DOOM further. There's no comeback mechanic — the game becomes statistically unwinnable well before the actual game-over screen.

**Suggestions**: DOOM cap, diminishing DOOM gains, DOOM decay between encounters, or weighted DOOM rolls instead of flat subtraction.

### 13. Boss Stage 5 (B.O.M.B.) requires ~27 successes

Physical: 8, Verbal: 10, Preventative: 9 with DCs of 12-20 and immunity cycling. Even at optimistic hit rates, this fight takes 15+ rounds. Each miss triggers DOOM rolls with 2 attacks per round. The probability of surviving this many DOOM rolls approaches zero at any significant DOOM level.

### 14. Voting system adds friction in solo mode

Solo players control all 3 votes for neutral encounters. The voting UI still renders, requiring extra clicks with no meaningful choice. Solo mode should auto-resolve or present a single-choice interface.

### 15. Gold economy lacks early sinks

The Merchant isn't in `COMMON_MAP_STRUCTURE`. Gold accumulates from combat but can only be spent at neutral encounters with specific paid options. Players can end stages with unspent gold and no way to use it.

### 16. Boss combat approach lock

`startBossCombat` sets `allowedDiceTypes` to `option.types` (one approach), but `startNewBossRound` never resets it. Players may be locked to a single approach type for the entire fight.

### 17. Ferryman mark range is narrow (11-18)

Marks only land on high-value faces. A mark on a face you rarely roll is meaningless; a mark on your best face is devastating. A wider range (e.g., 5-18) would create more strategic variation.

---

## ARCHITECTURE & CODE QUALITY

### 18. No module system — global scope

All ~10,500 lines share a single global scope. Every function and constant is global. This makes namespace collisions likely and makes the codebase fragile. ES modules (`import`/`export`) would provide encapsulation.

### 19. Monolithic `handleOption` switch (190 lines)

`encounters.js:130-320` handles every encounter action in one switch. A dispatch map pattern would be more maintainable:
```js
const handlers = { leave: completeEncounter, combat: startCombat, ... };
handlers[option.action]?.(option, node);
```

### 20. Duplicated `buildProgress` function

`combat.js:68-78` and `combat.js:104-114` define identical inner functions. Extract to a shared helper.

### 21. Aggressive auto-saving blocks main thread

`autoSave()` is called from `addGold`, `spendGold`, `addDoom`, `reduceDoom`, `addHope`, `useHope`, `addShield`, `useShield`, and `selectNode`. A single combat miss can trigger 3+ synchronous localStorage writes. Consider debouncing (e.g., `requestIdleCallback` or a 500ms throttle).

### 22. `innerHTML` with multiplayer player names

Multiple UI functions inject player names via `innerHTML` template literals. In multiplayer, player names are external input. A name containing `<img src=x onerror=...>` would execute. Use `textContent` for data or sanitize.

### 23. Timer/interval leaks

`initLoadingTips` creates a `setInterval` that's never cleared. Revisiting the title screen stacks intervals. Multiplayer heartbeat intervals should also be verified as cleaned up on disconnect.

### 24. No die face value clamping

Upgrades can push face values beyond 20 or below 1. The Shifter exotic die has faces of -1 and 22. Regular rolls don't clamp, so a value of 22 always beats any DC. The Cultist/Trapper/Mathematician upgrades can also push values past 20 unchecked.

---

## WHAT WORKS WELL

- **Core dice-swapping mechanic** is genuinely novel — intertwining creates meaningful cooperative decisions
- **DOOM/HOPE tension** provides satisfying risk management (when balanced)
- **NPC personality** — voice lines for the Gambler, Ferryman, Alchemist bring encounters to life
- **Tutorial narrative** with Pal is well-paced and emotionally effective
- **Encounter variety** — 11+ types with distinct mechanics prevents repetition
- **Draft modes** (FCFS, Snake, Dibs) add meaningful multiplayer dynamics
- **Save system** with 3 slots per mode and mid-encounter resumption is thorough
- **Exotic dice** add late-game variety and risk/reward decisions

---

## PRIORITY FIX ORDER

1. **Combat reward bug** — gold becomes NaN (game-breaking)
2. **DOOM balance** — death spiral makes game unwinnable
3. **Save/load data integrity** — shallow copies, missing fields
4. **DC sum enforcement** — Total DC Sum doesn't guarantee its sum
5. **Boss approach lock** — players stuck on one approach type
6. **Gambler reward inversion** — wrong payouts
7. **Stage 5 balance** — B.O.M.B. is statistically impossible
