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
9. [Characters & Lore](#characters--lore)
10. [Implementation Status](#implementation-status)

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

This tutorial creates immediate asymmetry between players and establishes the cooperative bond through double-intertwining.

---

## The Core Innovation: Dice Swapping

**The true unique flavor of this game comes from substituting segments of your own dice with rolls or segments on another player's dice.**

### Easy Example
I replace a 2 on my Punch die with a roll on my teammate's Stab die. So if I try to punch and would have rolled a 2, I instead get the result of my teammate immediately rolling their own Stab die.

### Medium Example
You swap segments 2, 3, 4, and 5 on your die with segments 12, 13, 14, and 15 on your ally's die; they do the same. So instead of getting a terrible roll on your own die, you instead get a middling roll on a teammate's - but at the risk of stabbing someone you were hoping to punch.

### Hard Example
I swap out any fail (1-9) on my die with the WORSE of my teammate's rolls on their own dice. So I try to stab but miss, and trying to save me, my friends both stumble in front - one poorly lies to the enemy and the other grapples them even worse - so THAT is the thing that actually happens.

### Strategic Possibilities
Teammates could strategize around specific builds:
- *"Let's soup up Player 1's persuade ability die, then replace as many segments on our dice with that one supercharged Persuade die!"*
- *"Let's stack all of our bad numbers onto Stab, Slash, and Bash - we're trying to play pacifist!"*

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
- **Bottoms Up** - Your 1 becomes a 20. Subtract 1 from all other faces
- **Tops Down** - Remove your Nat 20. 14, 15, 16, 17, and 18 become 19

---

## DOOM & HOPE System

### The DOOM Meter
The party has a shared DOOM meter that fills as bad things happen:
- Any time a 1 is rolled: +1 DOOM
- Bad encounter choices: +1-2 DOOM
- Ferryman's crossed marks triggering: +2 DOOM
- Other misfortunes and curses

**DOOM affects only DOOM rolls, not standard rolls** - every point of DOOM subtracts 1 from each DOOM roll result (except natural 20s).

### The DOOM Roll (Enemy Attacks)
When an **enemy lands a hit** on a player, they make a **DOOM Roll** - a special d20 roll:

- Roll a d20, subtract current DOOM from the result (except natural 20)
- **Roll a 1** (natural or DOOM-modified): **The journey ends.** The prophecy has failed.
- **Roll a 20** (natural): +1 HOPE - a moment of divine favor!
- Any other result: You survive but +1 DOOM

DOOM Rolls are reserved specifically for enemy attacks. Other bad outcomes simply add to the DOOM meter.

### DOOM Resets
- DOOM resets between Stages
- Natural 20s on DOOM Rolls grant HOPE

### HOPE
HOPE offsets accumulated DOOM:
- Players can accrue HOPE to offset existing DOOM
- HOPE cannot be "banked" - any HOPE gained when at 0 DOOM is wasted
- Some dice upgrades add HOPE to specific rolls
- Example upgrade: "Choose 2 segments between 7 and 15. Reduce both by 5, and add +1 HOPE to both segments"

---

## Encounters & Map Structure

Encounters are set up similar to **Slay the Spire** or **Inscryption** - players advance through a basic overworld, following a generally linear path but making choices at forks.

### Encounter Reference Chart

| Encounter | Type | Situation | Risks | Rewards |
|-----------|------|-----------|-------|---------|
| **The Mathematician** | Good | Old man offers dice adjustments | None | FREE: +2 to lowest, -1 high/+4 low, or SCULPT 3 faces |
| **The Alchemist** | Good | Wild-eyed woman splices dice | None | Basic: Link low roll. Risky: Random link +2. Double: Link to BOTH allies! |
| **The Priest** | Good | Serene figure offers blessing | None | +3 HOPE, or +5 HOPE (mark die), or bless a segment |
| **The Gambler** | Good | Craps-style range betting | None | Pick IN/OUT of range, roll. Win = +5 choice, Lose = +3 random |
| **Bandits** | Bad | Three thugs block your path | DOOM Rolls on misses | 30G, DC 12, Thresholds: P:2/V:2/Pr:1 |
| **Corrupt Guards** | Bad | Guards demand "peace tax" | DOOM Rolls on misses | 25G, DC 13, Thresholds: P:2/V:1/Pr:2 |
| **Miniboss (Thug)** | Bad | Massive bouncer blocks stairs | DOOM Rolls on misses | 40G, DC 14, Thresholds: P:3/V:2/Pr:2 |
| **The Ferryman** | Neutral | Ancient boatman judges fate | Free: 27% die marked | Free: 47% +2 HOPE, 27% safe. Paid 5G: guaranteed +2 HOPE |
| **The Trapper** | Neutral | Hunter offers exotic dice trade | Trade based on die power | 3 exotic dice offered. Best→best, worst→worst. Paid 8G: pick any |
| **The Drunk Priest** | Neutral | Stumbling priest offers blessing | Free: 27% net DOOM | Free: 47% +3-4 HOPE. Paid 3G: guaranteed +3 HOPE |
| **The Cultist** | Neutral | Robed figure offers purple drink | Free: 27% bad swap + DOOM | Free: 47% swap + +5. Paid 10G: guaranteed good |

### Stage 5 Unique Encounters (Warped Dimension)

| Encounter | Type | Situation | Rewards |
|-----------|------|-----------|---------|
| **The Rift** | Start | Reality tears apart | Continue |
| **Memory Fragment** | Good | Shard of your past pulses with warmth | Restore a damaged die face |
| **Pocket of Reality** | Good | Bubble of normal space | +2 HOPE |
| **Reality Tear** | Good | Another tear, warmth seeps through | +1 HOPE |
| **Echo of BOMB** | Bad | Shadow of the final boss | 40G, DC 15, Thresholds: P:3/V:3/Pr:2 |
| **Void Creatures** | Bad | Shapeless horrors attack | 45G, DC 15, Thresholds: P:3/V:2/Pr:3 |
| **The Shard of BOMB** | Miniboss | Fragment of cosmic horror | 50G, DC 15, Thresholds: P:4/V:4/Pr:3 |
| **The 19 Darkened Lines** | Neutral | See 19 failed prophecies | Accept destiny: +3 HOPE |

### Variable DCs
Each combat encounter has **different DCs for each approach** (Physical, Verbal, Preventative). DCs are randomized within ranges:
- **Regular enemies:** DC 5-8 (easy), DC 10-13 (medium), DC 14-17 (hard) - randomly assigned
- **Bosses:** Variable by stage, always challenging but varied

This encourages strategic die selection: a low DC 5 for Physical might make your weak Stab die worth using!

### Neutral Encounter Probability
**Probability Distribution:** ~47% good outcome, ~27% neutral outcome, ~27% bad outcome

Gold spending removes risk entirely - defeating bandits earns gold that can buy certainty at later neutrals.

---

## Boss Encounters & Narrative

Each Stage has a designated Boss. This is a 5-stage campaign with each Stage consisting of:
- An introduction
- Several random encounters
- A miniboss
- Several more random encounters
- A boss
- A conclusion

### Main Narrative

One prophecy can be hard enough to unravel. So when 20 prophecies appeared overnight - in the hands of soldiers and shepherds and princes, purple lettering emblazoned on thick vellum - chaos ensued. That was 20 years ago; hoping to make it rich, all manner of bandits and charlatans have chased these prophecies, and as with so many of their names and deeds, the prophecies themselves were lost to history.

Our heroes are some of the few noble-hearted individuals who still hold one of these prophecies, and its cryptic clues have brought them here, to the Dirtbag Inn, where our story begins.

The party learns of ATOM ('Assemble The Others' Movement) - a doomsday cult seeking to bestow our world unto the evil gods of the universe. Through increasingly obvious hints and decreasingly safe situations, the party must follow the threads and thwart this plot.

### Stage Breakdown

| Stage | Boss | Arc |
|-------|------|-----|
| 1 | **Dirty Innkeeper** | The party arrives at the inn. They awaken to find all gear missing, the Innkeeper gone. They explore the town for clues. *Miniboss: Town Gossip.* Party fights innkeeper for their stuff but learns he only stole it to pay off debts to ATOM. As they corner him, an arrow from atop the city gates silences him. |
| 2 | **Corrupt Guard** | After the assassination, the party investigates which guard killed the informant. *Miniboss: Drawbridge/Operator.* They breach the castle, dispose of the guard, and match his sigil to General Heimer in an adjacent city. |
| 3 | **General Heimer** | Heroes arrive at the Capitol but face Heimer's army outside. They must fight through to confront him. *Miniboss: The Daytime (soldiers) OR The Nighttime (infiltration).* Heimer declares he was following the King's orders. |
| 4 | **Chthonic King Robert** | Only the capital streets and Royal Guard remain. *Royal Guard: The Jester (games of chance), The Chef (cooking DOOM), The Counselor (persuasion).* Upon defeating the King, a fake "you did it!" screen appears - then the pentagram on the floor activates. |
| 5 | **BOMB (Big Obviously Malicious Boss)** | The portal pulls players into a warped dimension. *Miniboss: Early BOMB encounter that brutally changes player dice.* ~3 neutral encounters to restore functionality before the final fight. The stage shows 19 "darkened" prophecy lines and heroes on the single lit one. |

### Boss Combat Mechanics

Bosses use a **success counter system** instead of HP. Players must accumulate enough successful rolls in ANY approach to defeat the boss.

**The Three Approaches:**
- **Physical** (Slash, Stab, Bonk) - Direct combat. Harder early on, becomes more efficient against cosmic horrors.
- **Verbal** (Threaten, Deceive, Persuade) - Diplomatic resolution. Easiest early when dealing with humans, nearly impossible against BOMB.
- **Preventative** (Bribe, Hide, Grapple) - Tactical approach. Consistent middle ground throughout.

**Combat Round Flow:**
1. Each hero chooses a die and rolls (3 rolls per round)
2. Successful rolls add to the approach's success counter
3. If any hero **misses**, the enemy attacks and forces DOOM Rolls. If all 3 players succeed, they skip the enemy turn.
4. Repeat until one approach reaches its threshold or party wipe.

**Boss Thresholds (by Stage):**

| Boss | DC Range | Physical | Verbal | Preventative | Attacks/Round |
|------|:--------:|:--------:|:------:|:------------:|:-------------:|
| **1. Dirty Innkeeper** | 9-12 | 4 | 3 | 2 | 1 |
| **2. Corrupt Guard** | 10-14 | 5 | 4 | 3 | 1 |
| **3. General Heimer** | 12-15 | 6 | 6 | 5 | 1 |
| **4. King Robert** | 13-16 | 7 | 7 | 7 | 1 |
| **5. BOMB** | 15-17 | 8 | 10 | 9 | 2 |

### BOMB's Immunity Cycling
BOMB is a cosmic horror who **turns OFF one type of vulnerability each round** (like Magus in Chrono Trigger or Bowyer in Super Mario RPG). When BOMB attacks, the immunity randomly cycles to a different approach. Players must adapt their strategy each round based on which approach is currently blocked.

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

In most situations where an upgrade is granted, all heroes receive it (e.g. Mathematician's Offer). In some situations, the group determines who gets the upgrade.

---

## Visual & Multiplayer Design

### Visual Design
- **Overworld:** Vertical exploration map taking up the whole screen
- **Encounters:** Map rolls up; 3D dice-roller-catcher on bottom, text/art explaining the encounter on top

### Multiplayer Interface
Only one player needs to purchase the game (making it perfect for Discord or couch co-op). Players interface on their own devices (à la **Jackbox** or **Sunderfolk**).

**Player Interface:**
- Three dice displayed in 3D in one segment of the player UI that can be rotated and zoomed
- Clicking one zooms in and brings up the list modal describing each segment/possibility on that die
- Rolling requires dragging a die into the middle of the screen, then tap to confirm (rolling animation plays ON MAIN SCREEN)

---

## Characters & Lore

### The Colors (Playable Heroes)

The three playable characters are humanoid d20 dice, each with a distinctive style:

| Character | Color | Style | Default Name |
|-----------|-------|-------|--------------|
| Player 1 | Blue | Wizard (mystical robes, staff) | Blue |
| Player 2 | Red | Ranger (hooded cloak, bow) | Red |
| Player 3 | Green | Pirate (tricorn hat, cutlass) | Green |

### Pal (Ally-Mentor)

Pal is the emotional core of the tutorial - a greying d20 with a beard and staff, decrepit and soft-edged. He found the Colors as orphaned street dice and raised them. He's 1 part Gandalf, 1 part Robin Hood, 1 part Guildmaster, and 2 parts Dad.

**Key Traits:**
- Pet names for heroes: "Dicelings", "Pips", "Little Dice", "Pipsqueaks"
- The prophecy foretold his failure would allow the Colors to succeed
- At tutorial's end, he's struck down and passes the prophecy to the Colors
- Final words: *"I am... And forever shall be... Your Pal..."*

### The Prophecy

*The colors of momentous day—*
*Red and blue and green and grey,*
*Less but one, a Pal forgotten,*
*Walk fate's rope and feel it tauten*
*Botch and crit and fail and roll*
*The mentor's death, inciting toll*
*Then dielines blur and Colors sort,*
*Thus, Fate's Intertwined Cohort;*
*Together, Lucky Trio, shall,*
*Behold The Future Sought by Pal.*
*DOOM be damned, HOPE unforesaken,*
*The Colors' Powers shall awaken.*
*To save the very planet's soul*
*Defeat the BOMB, achieve your goal.*

**Lore Notes:**
- 20 prophecies appeared overnight, 20 years ago
- The other 19 groups either went corrupt, died, or lost the prophecy
- BOMB is a galaxy-black d20 with a fuse who has been forcing luck in his favor
- Something Pal taught the Colors will help them break BOMB's streak

### NPC Personalities

| NPC | Personality | Voice/Quirks |
|-----|-------------|--------------|
| **The Mathematician** | Middle-school nerd | "Astounding! According to my calculations, this upgrade is Completely OP!" |
| **The Alchemist** | Mad scientist, euphoric about dice-splicing | Cackles when asked why she does this; mutters about remaking bodies |
| **The Priest** | Poor priest with nothing to offer but HOPE | Serves the forces of HOPE, opposes DOOM |
| **The Gambler** | Carnival barker meets 3-card Monty dealer | "Eyy wouldja lookithat bigwinner bigwinner wannagoagain?" |
| **The Ferryman** | Tall, menacing, silent (like Charon from Hades) | Wants payment one way or another; visibly impressed by nat 20s |

### Boss Details

| Boss | Name | Personality | Key Info |
|------|------|-------------|----------|
| **Stage 1** | Seedy Sammy (Innkeeper) | Remorseful thief | Stole to pay gambling debts to ATOM; silenced by arrow mid-confession |
| **Stage 2** | Crooked Chester (Guard) | Confused young zealot | ATOM operative monitoring ground-level; reveals General Heimer |
| **Stage 3** | General Heimer | Bloodthirsty true believer | Persuaded King Robert into ATOM; may have known Pal |
| **Stage 4** | King Robert | Evil, confused, corrupted | Consumed summoning BOMB; fake victory before portal opens |
| **Stage 5** | B.O.M.B. | Cold robotic cosmic entity | "Threat detected. Prophecy-following suspected." Realizes the futility of his mission upon defeat |

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

---

## Implementation Status

### Completed Features
- [x] Variable DCs per approach (regular combat and boss combat)
- [x] Dice Sculpting (set specific face values)
- [x] Intertwine rewards (Double Link, Exotic Dice trades)
- [x] BOMB immunity cycling (blocks one approach per round, cycles after attacks)
- [x] Boss combat shows all three approach progress bars
- [x] Tutorial system with Pal
- [x] Multiplayer support (Jackbox-style)
- [x] Save/load system

### Needs Implementation

#### Start-of-Stage Upgrade Shop
**[NEEDS DESIGN]** Before each stage begins, players should have access to an upgrade shop where they can spend gold/favor on permanent improvements. This establishes early identity and allows for strategic planning.

Questions to resolve:
- What currency? Gold carried over? New "Favor" currency?
- What upgrades are available? Tier-locked by stage?
- How does this interact with the existing post-boss shop?
- Should this replace post-boss shop or supplement it?

#### Ability-Specific Outcomes
**[NEEDS CONTENT]** Each die type (Slash, Stab, Bonk, Threaten, Deceive, Persuade, Bribe, Hide, Grapple) should have unique narrative text for each encounter situation. What does it LOOK like when you Stab a bandit vs Deceive them vs Bribe them?

#### Visual Flourishes (Low Priority)
- [ ] Red glow/styling for Natural 1s on dice display
- [ ] Gold glow/styling for Natural 20s on dice display
- [ ] Dice face preview showing swaps and modifications

---

## Future Content Ideas

**"EGGS" Game Mode**
- Players use d12s instead of d20s
- Core mechanic: Often need to hit EXACTLY 12 to succeed
- Flips the usual "high = good" dice psychology

---

## Prompts to Continue Development

Use these prompts to continue developing narrative, plot, and game substance:

### Narrative & Story
> "Write the full intro sequence for Stage [X], including: opening narration, first NPC dialogue, and the hook that pulls players into the stage's conflict."

> "Develop the confrontation dialogue for [Boss Name]. Include: their motivation reveal, mid-fight taunts, and defeat speech. Make them sympathetic/complex where appropriate."

> "Write Pal's tutorial dialogue for teaching [mechanic]. He should explain it simply, use his pet names for the heroes, and foreshadow his eventual fate."

### Encounter Content
> "Create ability-specific outcome text for the [Encounter Name] encounter. For each of the 9 dice types (Slash, Stab, Bonk, Threaten, Deceive, Persuade, Bribe, Hide, Grapple), write: attempt text, success text, and failure text."

> "Design a new Neutral encounter for Stage [X]. Include: NPC description, the choice offered, probability outcomes (47/27/27 split), gold cost for guaranteed outcome, and narrative flavor."

### Systems & Balance
> "Design the Start-of-Stage Upgrade Shop for Stage [X]. Include: available upgrades, costs, restrictions, and how it fits the narrative moment."

> "Create a new Exotic Die for The Trapper. Include: name, face values (20 faces), power ranking, and strategic use case."

> "Balance check: Review the DC ranges and success thresholds for Stage [X] boss. Consider: average party power at this point, expected DOOM accumulation, and dramatic tension."

### Stage-Specific Development
> "Flesh out Stage [X] completely: all unique encounters, miniboss mechanics, environmental flavor, and how the stage's theme affects dice/upgrades."

> "Write the transition scene between Stage [X] and Stage [X+1]. How do players get from one location to the next? What narrative beats need to land?"

### Polish & Feel
> "Write 10 unique Gambler voice lines for different roll outcomes."

> "Create loading screen tips that teach mechanics while staying in-character for the game's tone."

> "Design the 'fake victory' screen for Stage 4. What does it say? How long before the twist?"
