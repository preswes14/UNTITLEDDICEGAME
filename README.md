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
- 
NOTES FOR CLAUDE 1/2/26 -I have showed this game to several people and come up with some changes that need to happen for the game to make sense to an incoming human.
- LITTLE THING 1: Graphics - Each character should be loosely represented as a humanoid die (sort of similar to Dicey Dungeons but with a d20 not a D6), each with a distinctive feature (off the top I am thinking hat, tail, and bow. I will upload my basic art for Blue, Red, and Green (who are styled after wizard, ranger, and pirate, but no need to call them that in game - use the Color names for each character as default names, and allow the players to rename them.)) I may sometimes call The Players "The Colors" below cause that's how my brain works.
- MEDIUM THING 2 - I want to change how HOPE works to instead BANK (1 max as a team to start) the ability to PREVENT a doom roll that would otherwise end the game. However, that means that when they succeed on a DOOM roll *without* spending their HOPE charge, the DOOM meter also increases by 1 (to indicate a light injury, a brush with death, etc). Similarly I want to require all 3 players to roll a DOOM die on a doom check, and if ANY 1s are rolled, it's a fail. But HOPE can prevent this and later a mechanic called SHIELD will help ease this pressure by preventing a certain number of DOOM rolls.
- BIG THING 3: STAGE 0 This is going to be a "Stage 0" or tutorial stage that gradually introduces the mechanics that will be used throughout the actual stages.
- -- The game should start with a rudimentary character select screen prompting each player to choose a name, their "feature (which will match that player number's color)" and select something they are good at. This gives them one move that is their "core move", and lets them do the existing power-up for the good die.  
- --The players should then come across an obstacle that allows them to roll their core moves to try to beat it (like a boulder with a face in the middle of the path). One success of any kind should clear this (with some funny dialogue I'll write)
- --The player should then get to pick something they are bad at (you have more than one skill of course, you are a great adventurer!). The next obstacle will be rigged or scripted to go poorly somehow (maybe even just forcing them to use their bad die and requiring 2 successes of any kind, forcing at least 1 nat 1 on the players. This will make the DOOM meter appear, which we will mention but lampshade (oh. that's.. bad. The DOOM meter just increased. Oh well, problem for later!)
- --Finally, in picking the medium die, the players will get to intertwine their dice. This should be presented as a super-powerful game-breaking power, that only THESE characters in the world get due to them being the protagonists.. cough cough i mean the CHOSEN ONES!!! Prompt them to replace the 2 and the 3 on each of their dice with rolls on another hero's specific dice - this must be chosen NOW! (This serves to make sure the players are talking and remember each other's abilities and strengths).
- A final combat (possibly the end of a reverie or a memory or a training sequence) ensues, allowing the players to use their mid die on turn 1 then their mid OR strong on turn 2, and finally all 3 dice (or all 9 total) on Round 3. More importantly, this is the first combat, so this *officially* introduces the DOOM meter - this is the first time they have been capable of actually taking damage, and therefore rolling on the DOOM meter.
- -- The battle is semi-scripted to ensure the players roll twice on the doom meter - the first roll, at the end of Turn 1, will be a close call that increases the doom meter, but would not end the game.
- The ally-mentor who gave them their prophecy bestows HOPE upon them at the start of TURN 2 this battle and explains how to use it. At the end of Turn 2 they do another DOOM roll which is scripted to have at least one 1 (maybe even all 1s would be funny) so that they have to burn their charge of HOPE. At the start of Turn 3, ally-mentor should imbue their GOOD dice with HOPE on the D20s (they did not have it before this point in the tutorial), and then ensure that the third person who takes their turn rolls a 20 to get a charge of HOPE back. The battle should conclude shortly after, around turn 4 or 5, fair and square as the heroes triumph.
- We see a short little scene where the Colors lose their ally-mentor (Pallete, like color palette (not sure about spelling), call him Pal?) and this sets up the narrative of them following the prophecy where it leads to Stage 1.
- -END OF BIG THING 3
- MEDIUM THING 4 - SHIELDS
Haven't worked out all the details but players will earn a rare resource called SHIELDS which will prevent DOOM rolls before they happen (at the cost of 1 shield per TEAM roll). Perhaps the heroes ace the miniboss (whatever that means), that means they would be awarded 1 shield which persists through until the final combat. Then the first DOOM roll they'd have to make is canceled and the battle continues as normally. Like HOPE this will initially cap at 1 stack.
  Other thoughts
  There need to be legendary relics/garments that the Colors can choose from upon conquering bosses or clearing specific challenges. I'm thinking powerful game-changers like:
  This Color no longer has to roll a die on Doom checks
  This color removes doom from 1 of their nat 1 dice
  The party gains an extra max charge of HOPE (repeatable up to 3x? 5x?)
  The party gains an extra max charge of SHIELD (repeatable up to 3x? 5x?)
  When this color's grants an intertwined roll, that roll cannot result in a natural 1 (reroll).
  When this color is granted an intertwined roll, that roll cannot result in a natural 1.
  Start each stage with 0 doom instead of 1
  This character replaces all HOPE on their dice with SHIELD
  If this color rolls a 20 on a doom die, the doom meter is reduced by 5 (minimum 1). (Triggers before other doom rolls)
  Choose another player's weak die to duplicate. Destroy your weak die, but keep the action name.
  I am envisioning these as permanent, stage-end upgrades sort of like Slay the Spire's Boss Relics. In my mind we should balance test these and figure out the most broken ones, and then give players either the choice of 1 LEGENDARY or 2 EPIC upgrades.

### Future Content Ideas

**"EGGS" Game Mode (Brainstorm 1/3/26)**
- Players use d12s instead of d20s
- Core mechanic: Often need to hit EXACTLY 12 to succeed
- Creates interesting tension where low numbers still suck, but players sometimes need to prioritize getting low numbers to fill out their "dozen"
- Filling a complete dozen (hitting all 12 values?) grants bonuses
- Flips the usual "high = good" dice psychology on its head
- Could be an alternate campaign, challenge mode, or unlockable difficulty

---

## BRAINSTORMING ZONE: The Heart of the Game

*Last updated: 1/6/26 - Claude's prompts for fleshing out the narrative, dialogue, and humanity*

The mechanics are scaffolding. The HEART is what makes players care. This section is for you to work through - write, sketch, muse, rant. I'll incorporate your answers into the game.

---

### PAL (Your Ally-Mentor)

Pal is the emotional core of the tutorial. He's the one who gives the heroes their prophecy, teaches them to fight, and then... leaves. This needs to hit hard.

**Character Questions:**
| Question | Your Notes |
|----------|------------|
| What does Pal look like? (Old wizard? Tired knight? Former adventurer with a limp?) | He should be a greying D20 with a beard and a staff, decrepit, derelict, crumbling and soft-edged. |
| Why did Pal give up being an adventurer himself? What's his regret? | He was a fervent adventurer to the very end but he was too old and weak and lost to the enemy (at the end of Stage 0). |
| What's Pal's relationship to the prophecy? Did he try and fail? Did he pass it down to someone he loves? | The prophecy was that he ultimately would fail but the circumstances of his failure would allow for The Colors to assume stewardship of the prophecy and bring about its portent. |
| What pet name or catchphrase does Pal use for the heroes? ("my little dice", "Chosen Ones", "you colorful idiots") | Little Dice is cute as hell. Dicelings. Pips. Things like that. |
| How does Pal die/disappear? Sacrifice? Illness? Called away? Simply too old to continue? | At the end of Stage 0 Pal is struck down/consumed by a curse/poisoned, and passes on the ancient scroll to The Colors. |
| What's the LAST thing Pal says to them? (This is the line they'll remember at the end of Stage 5) | "I am... And forever shall be... Your Pal..." and he goes still. |

**Pal's Key Dialogue Moments (write 2-3 lines each):**

1. **When the heroes first meet Pal:**
   - *What does Pal say when he hands them the prophecy? THIS IS WRONG BUT YOU WILL KNOW THAT, ANSWERING FIRST QUESTION ANYWAY*
   -This is unlikely to ever be explicit but they were all sort of orphaned dice, street thief ragamuffin Oliver Twist types, before Pal found them and took them in. He is 1 part Aragorn, 1 Robin Hood, 1 part Guildmaster, and 2 parts Dad. His first line would be something along the lines of  "Bad luck, eh? I know a thing or two about changing luck. Interested?" This scene is distinct but may be used as a refrain at the middle/end of Stage 0, when he introduces intertwining.

2. **When teaching them about their "BEST" die:**
   - *How does Pal frame this as finding their true talent?*
   -"You've all been training for months, by now you must know what you're best at! What's your gut-instinct, go-to approach?

3. **When teaching them about their "WORST" die:**
   - *How does Pal make this feel like wisdom, not failure? ("Even the sharpest sword has a dull edge...")*
   -"There's only so much time in a day.. Which of these did you not get a chance to practice as much as you liked?"

4. **When teaching them about Intertwining:**
   - *How does Pal explain this cosmic gift? Why are the heroes special?*
   - "Now remember, Dicelings, the number one thing you have going for you is the other two Dice watching your back. After months of training, I think you are finally ready to learn the Secret Art... The one I devoted my life to studying, as the prophecy bade I do, all so I could pass the knowledge along to you... IN....TER.....TWINE! (When dice really trust each other, they can sometimes entangle their fates! Choose a segment on this die (2 or 3) to replace with a _new roll_ on your ally's die!__

5. **When DOOM is first introduced:**
   - *How does Pal react to seeing the DOOM meter? Fear? Resignation? Determination?*
   -Oh. Oh, no. That's bad. I was hoping you wouldn't have to worry about this... The DOOM meter. We'll talk about it in a minute - focus on the task at hand, Pipsqueaks!"

6. **When bestowing HOPE:**
   - *What does Pal say about HOPE? Is it faith? Love? Spite? Refusal to die?*
   -"If there's one thing I taught you, it's this - even in the darkest situations, there is HOPE. Even the surest DOOM can be staved off with just a little... HOPE!" (Flickering animation, "HOPE" added to all 20s!).

7. **Pal's final words:**
   - *What does Pal say as he passes the torch? What wisdom does he leave behind?*
   -"Gah, bad luck.... Well, this might be it for me... I failed my DOOM roll... Before I go - Stay together. Trust each other. Roll for each other. I am, and forever shall be, your Pal.."

---

### THE PROPHECY

The prophecy is what drives everything. What does it actually SAY?
DRAFT 1:
The colors of momentous day-
Red and blue and green and grey,
Less but one, a Pal forgotten,
Walk fate's rope and feel it tauten
Botch and crit and fail and roll
The mentor's death, inciting toll
Then dielines blur and Colors sort,
Thus, Fate's Intertwined Cohort;
Together, Lucky Trio, shall,
Behold The Future Sought by Pal.
DOOM be damned, HOPE unforesaken,
The Colors Powers shall awaken.
To save the very planet's soul
Defeat the BOMB, achieve your goal.
```

**Prophecy Questions:**
| Question | Your Notes |
|----------|------------|
| Why were there 20 prophecies? What happened to the other 19 groups? | They all went corrupt or died or the prophecy got lost or forgotten. |
| Is the prophecy literal or metaphorical? | It's a little of both but mostly literal. |
| Does the prophecy reference the heroes directly, or are they just interpreting it? | It definitely references them, though indirectly |
| Is there a twist? (The heroes ARE the prophecy? BOMB wrote it? Pal was one of the failed 19?) | Ooh, interesting. Perhaps all 19 actually did succeed and Pal assumed that none of them did because "the bad things" still existed. All of the previous attempts made it to BOMB but he was I like the idea that the BOMB is a galaxy-black d20 with a fuse, and he has been sort of forcing luck in his favor, like he rolls intimidation and it's an automatic 20. Something that Pal told them or taught them will help THEM snap this streak. |
| How does the prophecy connect to DOOM thematically? | DOOM is the prophecy failing, or its users failing, and its directly referenced in the prophecy. |

---

### ENCOUNTER PERSONALITY

Each encounter NPC needs a voice. Currently they're mechanical - let's give them HEART.

**THE MATHEMATICIAN**
| Prompt | Your Notes |
|--------|------------|
| Personality: Absent-minded professor? Obsessive number-lover? Weary scholar? | Just like a middle-school nerd |
| Catchphrase or verbal tic when doing math on dice: | Astounding! According to my calculations, this upgrade is Completely OP! |
| What does he say when you leave WITHOUT taking his offer? | Whoa, looks like someone's not a mathlete! |
| Does he have a tragic backstory? (Used to be an adventurer? Lost someone to bad probability?) | No, he just a big ol nerd |

**THE ALCHEMIST**
| Prompt | Your Notes |
|--------|------------|
| Personality: Mad scientist? Gentle healer? Creepy experimentalist? | Mad scientist vibe for sure, wants to do weird experiments on peoples bodies and those bodies just happen to be dice |
| How does she describe the feeling of dice-splicing? (Painful? Euphoric? Strange?) | Euphoric, damn near orgasmic, let's really push what we can do with her language |
| What does she mutter while working? | In ecstatic fervor about remaking bodies and what's inside of a die and pontificating about loaded dice |
| What happens if players ask why she does this? | She just cackles |

**THE PRIEST**
| Prompt | Your Notes |
|--------|------------|
| Personality: Serene monk? Zealous preacher? Quietly faithful? | I think he should be a poor priest who seems to have nothing to offer |
| What god or force does the Priest serve? | Serves the forces of HOPE and opposes DOOM |
| How does the Priest describe HOPE? | All that is good, and noble! Love, friendship, trust! |
| What does the Priest think about DOOM? | We must be diligent to prevent DOOM from creeping into our hearts! |

**THE GAMBLER**
| Prompt | Your Notes |
|--------|------------|
| Personality: Flashy showman? Quiet shark? Addicted and broken? | Something between a carnival barker and a shady 3-card Monty dealer |
| What does the Gambler say when you WIN big? | Eyy wouldja lookithat bigwinner bigwinner wannagoagain? |
| What does the Gambler say when you LOSE? | Tough luck, but you gotta play to win, let's play again! |
| Does the Gambler have stakes in ATOM, the heroes, or neither? | |

**THE FERRYMAN**
| Prompt | Your Notes |
|--------|------------|
| Personality: Ancient and bored? Cryptic and wise? Menacing? | Yeah tall and menacing and quiet, like Charon from Hades |
| What does the Ferryman know about the prophecy? | Nothing, he is quiet, he just wants his payment one way or another. |
| Why does the Ferryman mark dice? What do the marks mean? | He uses maybe a fishhook or something to scratch away segments and replace them with other segments (maybe?) |
| What does the Ferryman say when someone rolls a natural 20 in his presence? | Nothing but you can tell he's impressed. |

---

### BOSS FLAVOR

Each boss needs more than combat stats - they need PRESENCE.

**STAGE 1: THE DIRTY INNKEEPER**
| Prompt | Your Notes |
|--------|------------|
| Name (if you want one): | Seedy Sammy |
| Why did he steal from the heroes specifically? | No reason, he had been stealing from non-regulars with regularity |
| What does he say when caught? (Remorseful? Defiant? Terrified?) | He is remorseful and guilty and feels bad and insists (honestly) he just stole to pay off his own debts |
| What does ATOM have on him? Debt? Family? Threat? | Debt, just gambling debt or something like that |
| What are his last words before the arrow silences him? | "Fine, I'll tell you. But you have to promise to help keep me safe. The people I owe money to, they're called --" and then the arrow silences him |

**STAGE 2: THE CORRUPT GUARD**
| Prompt | Your Notes |
|--------|------------|
| Name (if you want one): | Crooked Chester |
| Why did he shoot the Innkeeper? Orders? Panic? Cruelty? | He is a mid-level ATOM operative stationed as a low-level guard as to monitor ground-level situations and intervene where necessary to guarantee the secrecy of the organization. |
| What does he say when cornered? | He divulges that it goes all the way to the top (General Heimer) |
| Does he believe in ATOM's cause, or is he just following orders? | He's a confused young zealot who believes in ATOMs cause without knowing what it was, he really just wanted the glory and the position and they gave him all that. |
| What information does defeating him reveal? | The next link in the chain, General Heimer, as well as a reference to the BOMB or to the ultimate goals of ATOM. |

**STAGE 3: GENERAL HEIMER**
| Prompt | Your Notes |
|--------|------------|
| Full name and title: | Heimer |
| Is Heimer a true believer, or a pawn? | One of the key lieutenants of the BOMB operation, he is smart as a whip and has been promised a position of immense honor and power once ATOM wins |
| What does Heimer's army look like? (Human? Corrupted? Mixed?) | Lots of good people who are just normal soldiers (ACAB or whatever but they are generally chill) but then he has his various plants at different levels where they are super loyal to him or incredibly evil or whatever. |
| What does Heimer say about the King? Loyalty? Fear? Disgust? | Heimer thinks that the King is noble and worth of respect but that he lacks ambition, that it was Heimer who had to persuade King Robert into seeing the benefits of ATOM and ultimatley throwing the weight of the monarchy behind the movement |
| Does Heimer have any redeemable qualities? | Not really, he is a bloodthirsty evil cultist enabler. Maybe he knew Pal back in the day and, in his dying breaths, he regrets that things went so wrong to be fighting Pal's own disciples? |

**STAGE 4: KING ROBERT**
| Prompt | Your Notes |
|--------|------------|
| What title does Robert prefer? | Your Highness? Your Diceliness (if he's a die)? |
| How long has Robert been working with ATOM? | Since Heimer talked him into it 20 years ago |
| What does Robert say in the fake "victory" moment? | "So... You've struck me down... And defeated ATOM.... Heh. That's what you're thinking right now, I'd bet. Oh, how little you understand... See what TRUE power looks like! RISE! RISE AND ENTER THIS REALM!" |
| What happens to Robert when the portal opens? (Consumed? Transformed? Abandoned?) | I think he is consumed or obliterated into dust in the process of summoning |
| Is Robert AWARE of what BOMB is, or did he think he was summoning something else? | He knew it was bad but he was evil and confused and corrupted. |

**STAGE 5: B.O.M.B.**
| Prompt | Your Notes |
|--------|------------|
| What does BOMB look like? (Eldritch horror? Cosmic entity? Beautiful and terrifying?) | I think this should be a cold/robotic cosmic entity, sort of like if there was a computer program that was devoted to entropy. "Like Threat detected. Prophecy-following suspected. Initiating intimidation roll". |
| Does BOMB speak? If so, what's his/its voice like? | Cool... Beepy. Measured and robotic and certain, cold methodical death. |
| What does BOMB want? (Destruction? Consumption? To exist? To unmake?) | Entropy must win. BOMB must survive. Without BOMB there is no limit on the universe. BOMB must limit the universe. BOMB has an evolutionary imperative to stop prophecies and nip coincidence in the bud. (THIS NEEDS WORK BECAUSE ITS BORING ASS MOTIVATION) |
| What is the connection between BOMB and the prophecy? | Maybe bomb originally wrote all 20 prophecies, when he was created he rolled 20 times and each side printed a prophecy. |
| What happens in the final moment of victory? (BOMB screams? Fades? Thanks the heroes?) | BOMB realizes as he dies that what he had been doing is unneccessary. He encourages the players to push past entropy and achieve the impossible, now that's he's gone it should be a lot easier. The end! |

---
NOT YET COMPLETED AT ALL, CLAUDE: 
### DIE-SPECIFIC FLAVOR

Each die type should have personality in how it's described during rolls. Write a SUCCESS and FAILURE line for each:

| Die | Success Flavor | Failure Flavor |
|-----|----------------|----------------|
| **Slash** | | |
| **Stab** | | |
| **Bonk** | | |
| **Threaten** | | |
| **Deceive** | | |
| **Persuade** | | |
| **Bribe** | | |
| **Hide** | | |
| **Grapple** | | |

---

### EMOTIONAL BEATS

What are the BIG moments in this game? Write the feeling you want players to have:

| Moment | Desired Emotion | How to Achieve It |
|--------|-----------------|-------------------|
| Pal's farewell | | |
| First DOOM roll that could end the game | | |
| Using HOPE to save a friend | | |
| Realizing King Robert was the puppet, not the puppeteer | | |
| The fake victory screen before the portal opens | | |
| Seeing the 19 darkened prophecy lines | | |
| The final hit that destroys BOMB | | |

---

### DIALOGUE SNIPPETS TO WRITE

Quick dialogue lines that would make the game feel alive:

**Player Idles (when someone takes too long):**
-
-
-

**Natural 1 Reactions:**
-
-
-

**Natural 20 Reactions:**
-
-
-

**Low DOOM (everything's fine):**
-
-

**High DOOM (getting scary):**
-
-

**HOPE Spent:**
-
-

---

### WORLDBUILDING QUESTIONS

| Question | Your Notes |
|----------|------------|
| What's the world called? | |
| What's ATOM's full name and philosophy? | |
| Are there other adventurers in this world? If so, what happened to them? | |
| What's the relationship between the 20 prophecies and BOMB? | |
| Is there magic in this world beyond dice and intertwining? | |
| What year is it? What era? | |
| What do common people think about the prophecies? (Legend? Joke? Forgotten?) | |

---

### ITEMS I (CLAUDE) CREATED THAT NEED YOUR TOUCH

These are things I implemented mechanically but need your creative input:

**Draft Mode Options (Alchemist Potions):**
Currently generic names like "Potion of Boosting", "Elixir of Balance", etc.
- What should these actually be called?
- What do they look like?
- What does the Alchemist say when offering them?

**Boss Rewards (Snake Draft):**
Currently: "+3 to Lowest Face", "+3 HOPE", etc.
- Should these be narrative artifacts? ("The Innkeeper's Lucky Coin", "A Shard of Pal's Wisdom")
- What do they look like when claimed?

**Mathematician Options:**
Currently: "Sculpt: The Safe Bet", "Sculpt: The Climber", etc.
- How does the Mathematician describe these choices?
- Are these formulas? Philosophies? Diagrams he draws?

---

### PLACEHOLDER TEXT THAT NEEDS REPLACEMENT

Search the codebase for these and replace with real content:

- [ ] All encounter descriptions in `config.js` (currently functional but bland)
- [ ] Tutorial dialogue (Pal's lines)
- [ ] Boss defeat messages
- [ ] Natural 1 and Natural 20 flavor text
- [ ] DOOM roll survival/failure messages
- [ ] Stage transition text
- [ ] Victory screen text
- [ ] Game over text

---

### YOUR ADDITIONS

*Add your own brainstorming notes below:*
