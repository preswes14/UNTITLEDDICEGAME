# UNTITLED DICE GAME

A companion app for collaborative TTRPG action. Designed for 3 players.

---

## Table of Contents

1. [Core Mechanics](#core-mechanics)
2. [The Core Innovation: Dice Swapping](#the-core-innovation-dice-swapping)
3. [Progression & Rewards](#progression--rewards)
4. [DOOM & HOPE System](#doom--hope-system)
5. [Encounters & Map Structure](#encounters--map-structure)
6. [Boss Encounters & Narrative](#boss-encounters--narrative)
7. [Roguelite Structure](#roguelite-structure)
8. [Visual & Multiplayer Design](#visual--multiplayer-design)
9. [Design Notes](#design-notes)

---

## Core Mechanics

Each player has their own set of 3 d20 dice chosen from a pool of about 10. These dice represent talents or gambits that might be attempted in the game. Each die falls into one of 3 categories:

| Physical | Verbal | Preventative |
|----------|--------|--------------|
| Slash | Threaten | Bribe |
| Stab | Deceive | Hide |
| Bonk | Persuade | Grapple |

A player will have one die from each category.

**Example party composition:**
- Player 1: Persuade, Bonk, Hide
- Player 2: Threaten, Bribe, Stab
- Player 3: Slash, Deceive, Grapple

Players encounter various obstacles or combats that they must proceed through by taking turns choosing dice and rolling to see if they are successful.

### Starting Talent Ranking (Tutorial)

After picking their 3 dice, each player goes through a **Talent Ranking** that teaches them the upgrade system:

1. **"Which are you BEST at?"** - Pick one die
   - This die gets an upgrade: **One of 2, 3, 4, or 5 becomes a 20!**

2. **"Which are you WORST at?"** - Pick from the remaining two
   - This die gets a downgrade: **One of 2, 3, 4, or 5 becomes a 1...**

3. **The middle die** - The one not picked
   - This die gets **double-intertwined with BOTH allies**!
   - Pick a number (6-10) for Ally 1, then a different number for Ally 2
   - Each number triggers that ally's chosen die when rolled
   - Players walk through the full process, learning the core swap mechanic

This tutorial accomplishes several things:
- Teaches upgrading, downgrading, and dice swapping before the adventure begins
- Creates immediate asymmetry between players (someone's Persuade is godlike, another's is cursed)
- Establishes the cooperative bond through double-intertwining: every player is connected to every other player, creating an irrevocable team

---

## The Core Innovation: Dice Swapping

**The true unique flavor of this game comes from substituting segments of your own dice with rolls or segments on another player's dice.**

### Easy Example
I replace a 2 on my Punch die with a roll on my teammate's Stab die. So if I try to punch and would have rolled a 2, I instead get the result of my teammate immediately rolling their own Stab die. *(Narratively, rather than letting you fail, they step in to help)*

### Medium Example
You swap segments 2, 3, 4, and 5 on your die with segments 12, 13, 14, and 15 on your ally's die; they do the same. So instead of getting a terrible roll on your own die, you instead get a middling roll on a teammate's - but at the risk of stabbing someone you were hoping to punch, or knocking out someone you were hoping to persuade.

### Hard Example
I swap out any fail (1-9) on my die with the WORSE of my teammate's rolls on their own dice. So I try to stab but miss, and trying to save me, my friends both stumble in front - one kinda poorly lies to the enemy and the other grapples them even worse - so THAT is the thing that actually happens.

### Other Examples
- I replace a 19 on my die with a 20 on my teammate's die
- I scratch out a number on my die, and when it's rolled, I get to pick any other die to be rolled instead
- I accept getting 2 more Nat 1s added to my die in exchange for getting 3 more Nat 20s (replacing other numbers)

### Strategic Possibilities
Teammates could strategize around specific builds:
- *"Let's soup up Player 1's persuade ability die, then scratch out as many of our other dice numbers as we can, and replace as many segments on our dice with that one supercharged Persuade die!"*
- *"Let's stack all of our bad numbers onto Stab, Slash, and Bash - we're trying to play pacifist and want to resolve things, even combat, nonviolently if possible."*

---

## Progression & Rewards

Rewards, goals, and gameplay are oriented around improving dice. For example:
- Replace the 2 with a 1, but replace the 3 with a 20
- Add 5 to a number of your choosing

Players permanently improve their dice, allowing them to progressively clear more difficult challenges.

### Upgrade Tiers

| Tier | Cost | Effect |
|------|------|--------|
| Easy | Cheap | Directly add to a number on a die (2→3 costs 1G, 3→4 costs 2G) |
| Medium | Moderate | Replace a segment with a fresh roll on a teammate's die, OR replace with a "Chaos" segment (roll all 3 dice, middle number happens) |
| Hard | Expensive | Choose 5 numbers to become Nat 1s and 5 numbers to become Nat 20s |

### Early Game Upgrades
- Each hero gets to add 10 to a number between 2 and 9, OR add 5 to any 2 numbers between 9 and 14
- Choose 1 number on your die between 5 and 9 to scratch out, OR 2 between 10 and 14 (scratch out = blank = re-roll)

### Late Game Complex Upgrades
- **Middle Out** - All numbers between 5 and 15 (inclusive) are scratched out
- **Bottoms Up** - Your 1 becomes a 20. Subtract 1 from all other faces (powerful if player has already buffed 2-5)
- **Tops Down** - Remove your Nat 20. 14, 15, 16, 17, and 18 become 19

---

## DOOM & HOPE System

### Damage Mechanic
Instead of traditional health, hits work differently based on the situation:
- **Single-target hits** (smaller enemies, individual effects): Often just add +1 DOOM to the meter
- **Party-wide hits** (big attacks, boss abilities): Trigger DOOM Rolls for affected players
- **Rare permanent damage**: Some effects reduce die faces for the battle or longer (special enemy abilities only) 

### The DOOM Meter
The party has a shared DOOM meter that fills as bad things happen:
- Any time a 1 is rolled: +1 DOOM
- Bad encounter choices: +1-2 DOOM
- Ferryman's crossed marks triggering: +2 DOOM
- Other misfortunes and curses

The DOOM meter indicates that the heroes are unable to overcome the forces of darkness and avoid the prophesied danger. **The DOOM meter affects all DOOM rolls but NOT ANY standard rolls** - every point of DOOM subtracts 1 from each roll result (except natural 20s).

### The DOOM Roll (Enemy Attacks)
When an **enemy lands a hit** on a player, they will sometimes be required to make a **DOOM Roll** - a special d20 roll that determines their fate:

- Roll a d20, subtract current DOOM from the result (except natural 20)
- **Roll a 1** (natural or DOOM-modified): **The journey ends.** The prophecy has failed.
- **Roll a 20** (natural): Remove HALF of the current DOOM - a moment of divine favor!
- Any other result: You survive the hit but feel the weight of DOOM

This is where the tension lies, especially in boss battles. A boss with multiple attacks means multiple DOOM Rolls per turn - each hit is a brush with oblivion. With high DOOM, even rolling a 5 or 6 becomes deadly.

**Note:** DOOM Rolls are reserved specifically for enemy attacks. Other bad outcomes simply add to the DOOM meter, making future DOOM Rolls more dangerous.

### DOOM Resets
- DOOM resets between Stages
- Players can strategically reduce DOOM through natural 20s on DOOM Rolls

### HOPE
HOPE offsets accumulated DOOM:
- Players can accrue HOPE to offset existing DOOM
- HOPE cannot be "banked" - any HOPE gained when at 0 DOOM is wasted
- Some dice upgrades add HOPE to specific rolls
- Example upgrade: "Choose 2 segments between 7 and 15. Reduce both by 5, and add +1 HOPE to both segments"

---

## Encounters & Map Structure

Encounters are set up similar to **Slay the Spire** or **Inscryption** - players advance through a basic overworld, following a generally linear path but making choices at forks. Simple icons indicate encounter types.

### Encounter Reference Chart

| Encounter | Type | Situation | Risks | Rewards | Stage 5 Modification |
|-----------|------|-----------|-------|---------|---------------------|
| **The Mathematician** | Good | Old man offers dice adjustments | None (all free) | FREE: +2 to lowest, -1 high/+4 low, or SCULPT 3 faces | *Replaced by Memory Fragment* |
| **The Alchemist** | Good | Wild-eyed woman splices dice | None (all free) | Basic: Link low roll. Risky: Random link +2. Double: Link to BOTH allies! | *Replaced by Pocket of Reality* |
| **The Priest** | Good | Serene figure offers blessing | None | +3 HOPE, or +5 HOPE (mark die), or bless a segment | *N/A in Stage 5* |
| **The Gambler** | Good | Craps-style range betting | None | Pick IN/OUT of range, roll. Win = +5 choice, Lose = +3 random | *N/A in Stage 5* |
| **Bandits** | Bad | Three thugs block your path | DOOM Rolls on misses | 30G, DC 12, Thresholds: P:2/V:2/Pr:1 | *Replaced by Echo of BOMB* |
| **Corrupt Guards** | Bad | Guards demand "peace tax" | DOOM Rolls on misses | 25G, DC 13, Thresholds: P:2/V:1/Pr:2 | *Replaced by Void Creatures* |
| **Miniboss (Thug)** | Bad | Massive bouncer blocks stairs | DOOM Rolls on misses | 40G, DC 14, Thresholds: P:3/V:2/Pr:2 | *N/A in Stage 5* |
| **The Ferryman** | Neutral | Ancient boatman judges fate | Free: 27% die marked. Paid 5G: guaranteed +2 HOPE | Free: 47% +2 HOPE, 27% safe | *Replaced by The 19 Darkened Lines* |
| **The Trapper** | Neutral | Hunter offers exotic dice trade | Trade based on die power | 3 exotic dice offered. Best→best, worst→worst. Paid 8G: pick any | *N/A in Stage 5* |
| **The Drunk Priest** | Neutral | Stumbling priest offers blessing | Free: 27% net DOOM | Free: 47% +3-4 HOPE. Paid 3G: guaranteed +3 HOPE | *N/A in Stage 5* |
| **The Cultist** | Neutral | Robed figure offers purple drink | Free: 27% bad swap + DOOM | Free: 47% swap + +5. Paid 10G: guaranteed good | *N/A in Stage 5* |

### Stage 5 Unique Encounters (Warped Dimension)

| Encounter | Type | Situation | Risks | Rewards |
|-----------|------|-----------|-------|---------|
| **The Rift** | Start | Reality tears apart, falling into somewhere else | None | Continue |
| **Memory Fragment** | Good | Shard of your past pulses with warmth | None | Restore a damaged die face |
| **Pocket of Reality** | Good | Bubble of normal space, a moment to breathe | None | +2 HOPE |
| **Reality Tear** | Good | Another tear in reality, warmth seeps through | None | +1 HOPE |
| **Echo of BOMB** | Bad | Shadow of the final boss | DOOM Rolls on misses | 40G, DC 15, Thresholds: P:3/V:3/Pr:2 |
| **Void Creatures** | Bad | Shapeless horrors attack | DOOM Rolls on misses | 45G, DC 15, Thresholds: P:3/V:2/Pr:3 |
| **The Shard of BOMB** | Miniboss | Fragment of cosmic horror blocks path | DOOM Rolls on misses | 50G, DC 15, Thresholds: P:4/V:4/Pr:3 |
| **The 19 Darkened Lines** | Neutral | See 19 failed prophecies, yours remains lit | None | Accept destiny: +3 HOPE |

### Good Encounters
*Little to no risk (gifts, upgrades, games, etc.)*

- **The Mathematician** - Adds, subtracts, etc. to dice. Players must take a negative to get a positive but usually come out ahead (e.g., halving 4 to 2 but doubling 8 to 16)
- **The Alchemist** - Weird dice-splicing: replacing your segments with your friends' dice
- **The Gambler** - Offers target ranges; players guess HIT or MISS. Smaller reward for likely outcomes, larger reward for unlikely ones
- **The Priest** - Offers to add HOPE to random segments (weighted towards lower rolls)

### Bad Encounters
*Fight or overcome obstacles to earn Gold*

**Variable DCs:** Each combat encounter has **different DCs for each approach** (Physical, Verbal, Preventative). DCs are randomized within ranges:
- **Regular enemies:** DC 5-8 (easy), DC 10-13 (medium), DC 14-17 (hard) - randomly assigned to approaches
- **Bosses:** DC 10-12, DC 13-15, DC 15-18 - always challenging but still varied

This encourages strategic die selection: a low DC 5 for Physical might make your weak Stab die worth using!

- **Bandits** - Can be killed, mugged, or persuaded
- **Evil People** - Best rewards for killing them
- **City Guards** - Best rewards for winning/escaping but NOT killing them
- **Beasts, Monsters, Dragons** - Stage 1 has 1-2 enemy types; each new stage introduces 1-2 new ones and phases out older ones

### Neutral Encounters
*Risk vs reward - outcomes weighted toward good but with real consequences. Gold spending removes risk.*

**Probability Distribution:** ~47% good outcome, ~27% neutral outcome, ~27% bad outcome

- **The Ferryman** - Pay the toll and let the river judge your fate. Free: 47% good (+2 HOPE), 27% neutral (safe), 27% bad (die marked). *Pay 15G for guaranteed good outcome. Wade for +1 DOOM.*
- **The Trapper** - Trade your worst die face for a mystery value. Free: 47% good (+5+), 27% neutral (similar), 27% bad (worse). *Pay 20G for guaranteed +6 to +10 upgrade.*
- **The Drunk Priest** - Accept a sloppy blessing. Free: 47% good (+3-4 HOPE), 27% neutral (wash), 27% bad (more DOOM). *Pay 10G for guaranteed +3 HOPE, no DOOM.*
- **The Cultist** - Drink the cosmic goblet. Free: 47% good (swap + +5), 27% neutral (just swap), 27% bad (bad swap + DOOM). *Pay 25G for guaranteed good outcome.*

**Design Philosophy:** Neutral encounters offer genuine choice with weighted randomness. Players *usually* come out ahead (~74% non-negative), but bad outcomes create memorable moments. **Gold spending option** lets combat rewards translate into guaranteed safety - defeating bandits earns gold that can buy certainty at later neutrals.

---

## Boss Encounters & Narrative

Each Stage has a designated Boss shaping the narrative. This is a 5-stage campaign with each Stage consisting of:
- An introduction
- Several random encounters
- A miniboss
- Several more random encounters
- A boss
- A conclusion

Boss encounters change minimally over each playthrough. Other encounters are randomly generated (with balance caveats). Each stage features a "miniboss" where players can set themselves up for an easier or harder final boss.

### Main Narrative

One prophecy can be hard enough to unravel. So when 20 prophecies appeared overnight - in the hands of soldiers and shepherds and princes, purple lettering emblazoned on thick vellum - chaos ensued. That was 20 years ago; hoping to make it rich, all manner of bandits and charlatans have chased these prophecies, and as with so many of their names and deeds, the prophecies themselves were lost to history.

Our heroes are some of the few noble-hearted individuals who still hold one of these prophecies, and its cryptic clues have brought them here, to the Dirtbag Inn, where our story begins.

The party learns of ATOM (Assemble The Others Movement) - a doomsday cult seeking to bestow our world unto the evil gods of the universe. Through increasingly obvious hints and decreasingly safe situations, the party must follow the threads and thwart this plot to fulfill the prophecy and save the world.

### Stage Breakdown

| Stage | Boss | Arc |
|-------|------|-----|
| 1 | **Dirty Innkeeper** | The party arrives at the inn. They awaken to find all gear missing, the Innkeeper gone. They explore the town for clues. *Miniboss: Town Gossip.* Party fights innkeeper for their stuff but learns he only stole it to pay off debts to ATOM. As they corner him, an arrow from atop the city gates silences him. |
| 2 | **Corrupt Guard** | After the assassination, the party investigates which guard killed the informant. *Miniboss: Drawbridge/Operator.* They breach the castle, dispose of the guard, and match his sigil to General Heimer in an adjacent city. |
| 3 | **General Heimer** | Heroes arrive at the Capitol but face Heimer's army outside. They must fight through to confront him. *Miniboss: The Daytime (soldiers) OR The Nighttime (infiltration).* Heimer declares he was following the King's orders. |
| 4 | **Chthonic King Robert** | Only the capital streets and Royal Guard remain. *Royal Guard: The Jester (games of chance), The Chef (cooking DOOM), The Counselor (persuasion).* Upon defeating the King, a fake "you did it!" screen appears - then the pentagram on the floor activates. |
| 5 | **BOMB (Big Obvious Malicious Boss)** | The portal pulls players into a warped dimension. *Miniboss: Early BOMB encounter that brutally changes player dice.* ~3 neutral encounters to restore functionality before the final fight. The stage shows 19 "darkened" prophecy lines and heroes on the single lit one - this is the last chance to save the world. |

### Boss Combat Mechanics

Bosses use a **success counter system** instead of HP. Players must accumulate enough successful rolls in a chosen approach to defeat the boss:

**The Three Approaches:**
- **Physical** (Slash, Stab, Bonk) - Direct combat. Harder early on, becomes more efficient against cosmic horrors.
- **Verbal** (Threaten, Deceive, Persuade) - Diplomatic resolution. Easiest early when dealing with humans, nearly impossible against BOMB.
- **Preventative** (Bribe, Hide, Grapple) - Tactical approach. Consistent middle ground throughout.

**Combat Round Flow:**
1. Each hero chooses a die and rolls (3 rolls per round)
2. Successful rolls add to the approach's success counter
3. If any hero **misses**, the boss attacks and that hero must make a **DOOM Roll**
4. Repeat until one approach reaches its threshold

**Boss Thresholds (by Stage):**

| Boss | DC | Physical | Verbal | Preventative | Attacks/Round |
|------|:--:|:--------:|:------:|:------------:|:-------------:|
| **1. Dirty Innkeeper** | 10 | 4 | 3 | 2 | 1 |
| **2. Corrupt Guard** | 12 | 5 | 4 | 3 | 1 |
| **3. General Heimer** | 14 | 6 | 6 | 5 | 1 |
| **4. King Robert** | 15 | 7 | 7 | 7 | 1 |
| **5. BOMB** | 16 | 8 | 10 | 9 | 2 |

*Design philosophy: Early bosses reward peaceful resolution (Verbal/Preventative). By King Robert, all approaches are equal - he's beyond reason. BOMB is a cosmic horror where combat becomes most efficient; you can't talk down an eldritch abomination.*

**Mathematical Balance Notes:**
- Innkeeper: Preventative needs only 2 successes (~1-2 rounds). Physical needs 4 (~3-4 rounds).
- BOMB: Physical needs 8 successes, but Verbal needs 10. Combat is actually the "smart" choice against cosmic evil.
- BOMB's 2 attacks mean roughly 1-2 DOOM Rolls per round at end game.

---

## Roguelite Structure

This is not a true roguelike but has roguelite elements.

Generally a progressive campaign: once heroes clear Stage 1, they play Stage 2 until beaten, then Stage 3. No returning to Stage 1 each time.

Various upgrades unlock based on how earlier stages were cleared, plus base bonuses for starting higher-level stages.

**Upgrade Types:**
- Permanent hero upgrades
- Base up-floor upgrades
- Varying up-floor upgrades
- Per-run temporary bumps

*This may be the most complicated part of the game.*

---

## Visual & Multiplayer Design

### Visual Design
- **Overworld:** Vertical exploration map taking up the whole screen
- **Encounters:** Map rolls up; 3D dice-roller-catcher on bottom, text/art explaining the encounter on top

### Multiplayer Interface
*Ideally:*

Players interface on their own devices (à la **Jackbox** or **Sunderfolk**). This allows fine-tuned decisions for each die without slowing the game.

- In most situations where an upgrade is granted, all heroes receive it
- In some situations, the group determines who gets the upgrade
- Only one player needs to purchase the game (stream or couch co-op)

**Player Interface:**
- Three dice displayed in 3D that can be rotated and zoomed
- Clicking one zooms in and brings up the "confirm" option to roll in the dice tray on the big screen

---

## Design Notes

### Core Design Principles

**Inscryption-Style Progression:** Every non-combat encounter is an opportunity for upgrades. The map lets players choose their path - targeting specific upgrade types or engaging in combat for gold rewards.

**Risk Lives in Combat:** DOOM accumulates and DOOM Rolls occur primarily through combat. Good encounters are safe upgrade opportunities. Neutral encounters have weighted randomness but are usually beneficial.

**Intertwined Fates:** The dice-swapping mechanic creates deep cooperation. Players should constantly be linking their dice together, creating a web of dependencies that makes every roll exciting.

### DOOM System Details

The DOOM die is **separate** from the 9 hero dice. Key clarifications:

1. **DOOM Rolls are forced** - Only triggered when enemies attack (combat misses) or specific narrative events
2. **DOOM does NOT affect regular rolls** - Hero dice roll normally; DOOM only subtracts from DOOM Rolls
3. **All Natural 1s add +1 DOOM** - Displayed in RED on the die
4. **All Natural 20s add +1 HOPE** - Displayed in GOLD on the die
5. **DOOM Rolls at 0 DOOM** = only 5% chance of failure (rolling a natural 1)

### Encounter Design Philosophy

**Good Encounters (Green):**
- Always free, always beneficial
- At most: trade a small negative for a larger positive
- Examples:
  - The Gambler: Craps-style betting. Pick "in range" or "out of range", roll any die. Hitting the less likely option = +5 to chosen segment; more likely = +3 to random segment. No cost, no punishment.
  - The Priest: Free HOPE added to dice segments
  - The Mathematician: Free +2 to lowest face, or trade -1 high for +4 low

**Bad Encounters (Red):**
- Combat - earns Gold but risks DOOM Rolls
- Primary source of Gold (incentivizes engaging)
- DOOM accumulates on misses

**Neutral Encounters (Yellow):**
- Weighted probability: 47% good / 27% neutral / 27% bad (~7/15, 4/15, 4/15)
- Gold spending removes risk entirely
- Examples:
  - The Trapper: Offers 3 exotic dice to trade for. Ranked by power - best requires trading your strongest die, worst trades your weakest.

### Economy

**Gold Costs (Lower Tier First):**
- Basic upgrades: 1-2 Gold
- Standard upgrades: 3-5 Gold
- Powerful upgrades: 8-15 Gold
- Legendary upgrades: 20+ Gold

Combat rewards scale: 5-15G (early), 20-40G (mid), 40-100G (late/boss)

### Exotic Dice (for The Trapper)

Ranked from most to least powerful:

1. **The d6** - Faces: 1, 2, 6, 12, 19, 20 (great for manipulation)
2. **Lucky 7s** - All 7s become 17s, all 17s become 20s
3. **The Doubler** - Faces 1-10; double your result
4. **The Coin Flip** - 10 faces of 20, 10 faces of 1 (high risk/reward)
5. **The 6996** - All 6s and 9s are flipped (weak, needs work)
6. **The Cursed** - One 1 becomes a 20, but one 20 becomes a 1
7. **The Weighted** - Faces 8-15 only (consistent but capped)
8. **The Low Roller** - Faces 1-10 only, but lowest becomes 15
9. **The Shifter** - All odd numbers +3, all even -3
10. **The Wild Card** - Roll triggers a random ally's die instead

### TODO: Features Needing Development

- [ ] Start-of-Stage Upgrade Shop - balanced economy for early identity building
- [ ] Dice Draft pageantry - make it exciting and dramatic
- [ ] Ability-specific outcomes - text/consequences for each die type in each situation
- [x] Variable DCs per approach - encourages using all dice strategically
- [x] Dice Sculpting - set specific face values (d6-style customization)
- [x] More intertwine rewards (Double Link, Exotic Dice trades)
- [ ] Visual flourishes for 1s (red) and 20s (gold) on dice display

### Open Questions

- Should the players have gotten their prophecy from a beloved figure who left them notes?
- Why were there 20 prophecies? This needs to tie in better with the narrative
- Explore the Oppenheimer thematic parallels further?
