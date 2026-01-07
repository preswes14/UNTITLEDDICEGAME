<img width="785" height="335" alt="image" src="https://github.com/user-attachments/assets/8019b08b-e7c2-4cd8-a772-ac143b94b9e4" /># UNTITLED DICE GAME

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
| **Bandits** | Bad | Three thugs block your path | DOOM Rolls on misses | 5G each, DCs 5/10/15, Thresholds: P:2/V:2/Pr:1 |
| **Corrupt Guards** | Bad | Guards demand "peace tax" | DOOM Rolls on misses | 10G each, DCs 6/11/16, Thresholds: P:2/V:1/Pr:2 |
| **Miniboss (Thug)** | Bad | Massive bouncer blocks stairs | DOOM Rolls on misses | 25G, DCs 7/12/17, Thresholds: P:3/V:2/Pr:2 |
| **The Ferryman** | Neutral | Ancient boatman judges fate | Free: 27% die marked | Free: 47% +1 HOPE, 27% safe. Paid 5G: guaranteed +1 HOPE |
| **The Trapper** | Neutral | Hunter offers exotic dice trade | Trade based on die power | 3 exotic dice offered. Best→best, worst→worst. Paid 8G: pick any |
| **The Drunk Priest** | Neutral | Stumbling priest offers blessing | Free: 27% net DOOM | Free: 47% +3-4 HOPE. Paid 3G: guaranteed +3 HOPE |
| **The Cultist** | Neutral | Robed figure offers purple drink | Free: 27% bad swap + DOOM | Free: 47% swap + +5. Paid 5G: guaranteed good |

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
CLAUDE I want the DCs to work like this. Every enemy or encounter has a Easy/Medium/Hard set of DCs across the 3 types of moves. Sometimes it is set which is which (eg: physical is easy, preventive is medium, verbal is hard) but usually these will be randomly assigned. DCs should vary within a given range for a given enemy but generally an EASY should be in the 5-10 range, a Medium should be 11-15, and a Hard should be 16-20. Each enemy should have a "Total DC Sum" that is rigid and indicates the total number of points that can be allocated across the 3 DCs. If, for example, the most basic enemy (bandit?) has a Total DC of 35, and he has DCs of 7 on his Easy and 12 on his Medium, he should have a 16 on his Hard (7+12+16=35). If, instead, he rolled a super easy 5 and 11 on his Easy and Medium, he should have a much more difficult 19 for the Hard one. Each enemy should have their own Total DC Sum as well as their own ranges for where easy/medium/hard should fall.
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

This is not a true roguelike but has some minor roguelite elements. Generally it is a cohesive, cooperative campaign: heroes clear Stage 1, then play Stage 2 until beaten, then Stage 3. No returning to Stage 1 each time.

Various upgrades unlock based on how earlier stages were cleared (how much gold/FAVOR is accrued), plus base bonuses to FAVOR for starting higher-level stages. FAVOR can be unspent and respent at round start without penalty so that heroes can construct a viable build.

**Upgrade Types:**
- Permanent hero upgrades (granted through story progression)
- "Good" up-floor upgrades (usually free, weak effects. Often can enhance effect by spending Gold)
- "Neutral" up-floor upgrades (sometimes free, sometimes costly. Usually can guarantee success by spending Gold)

In most situations where an upgrade is granted, all heroes receive it (e.g. Mathematician's Offer). In some situations, the group determines who gets the upgrade (like in spending FAVOR, or at the merchant)

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
3. **The Doubler** - Faces 1-10; double your result (except on nat 1)
4. **The Coin Flip** - 10 faces of 20, 10 faces of 1 (high risk/reward)
5. **The 6996** - All 6s become 9s (including on modified dice)
6. **The Cursed Hope** - +1DOOM on Nat20, +1HOPE on Nat1
7. **The BlackJack Dealer** - 2-9 are normal, 10, 11, 12, 13 become 10. 13, 14, 15, and 16 become scratched out.
8. **The Low Roller** - Remove DOOM from 1; 11-20 become 10.
9. **The Odd Couple** - All odd numbers +3, all even numbers -3
10. **The Wild Card** - Roll triggers a random ally's die instead (everything is scratched out)

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
Here's what I'm thinking. Gold should be used for the spot-level upgrades and then any leftover gold after the Stage is over gets converted into Favor (I'm currently thinking 10G->1F, rounded down). In addition to gaining 1 Favor per hero (collective pool) to spend at the start of the next stage, having gold can up Favor gained. Unlike gold which is spent on upgrades and consumed, Favor is more like Skill Points which aren't quite "spent" but can be unequipped and re-equipped to make for a specific build. The team will share this currency and there will be more options than they could possibly spend their favor on, allowing for tough choices and interesting build attempts. Stage 2 would grant 3 favor by default, Stage 3 grants 6, 4 grants 9, and 5 grants 12 - in addition to whatever gold the party accrued and successfully cashed in over the course of the run.
**
FAVOR STORE FIRST DRAFT- 
1 FAVOR:
STILL PRETTY GOOD Choose a hero. When this hero rolls a failure on [best dice] , instead count it as a success on [worst dice]
PRACTICED INTERTWINER - Intertwined rolls granted BY this hero gain +5
PRACTICED INTERTWINEE - Intertwined rolls granted TO this hero gain +5
HOPEFUL NOVICES The party gains +1 Max Hope (from 1 to 2)
GEAR: SHIELD The party starts with 1 Shield
GEAR: CASH The party starts with 5 Gold
GOOD NIGHT OF SLEEP The party starts with 0 Doom instead of 1.
BUNCH OF CHUMPS Non-boss enemies in this Stage have their DCs reduced by 2


2 FAVOR:
SHIELD NOVICES The party gains +1 Max Shield (from 1 to 2, requires previous SHIELD unlock)
HOPEFUL ADEPTS The Party gains +1 Max HOPE (from 2 to 3, requires previous HOPE unlock)
EXPERT INTERTWINER Choose a hero. Intertwined rolls granted BY this hero negate any DOOM rolled
EXPERT INTERTWINEE Choose a hero. Intertwined rolls granted TO this hero negate any DOOM rolled
ONE BIG CHUMP The boss of this Stage has its DCs reduced by 2.
EARLY ALCHEMIST The Alchemist appears immediately after FAVOR shop

3 FAVOR:
GETTING BETTER Choose a hero. When this hero rolls a failure on [worst dice] , instead count it as a success on [best dice]
SHIELD ADEPTS The party gains +1 Max Shield (from 2 to 3, requires previous SHIELD unlock)
MASTERS OF HOPING Party gains +1 Max HOPE (from 3 to 4, requires previous HOPE unlock)
WEAK POINT The boss of this Stage requires 1 less success of each type to win

4 FAVOR:
DOOMLESS Choose a hero. Remove DOOM from this hero's dice
HOPEFUL INTERTWINING Choose a hero. All intertwined rolls TO or FROM this hero have a 50% chance to grant +1 HOPE.
DOOM BUFFER Each hero rerolls the first +1 DOOM they would have otherwise rolled.
MASTERS OF SHIELDING  The party gains +1 Max Shield (from 3 to 4, requires previous SHIELD unlock)

5 FAVOR:
DOOMVANTAGE The Party gains advantage on all DOOM checks
CHAOTIC FAVOR Gain 4-9 (3+1d6) FAVOR and randomly assign it to Favor upgrades (heroes and dice chosen randomly)
**
And then after they had cleared the game we would add CLOUT, which is a free-add-difficulty mechanic like Skulls in Halo or Path of Pain in Hades.
Questions to resolve: MIGHT HAVE ALREADY ANSWERED THE BELOW BUT WILL ANSWER EXPLICITLY AS A DOUBLE-CHECK EXERCISE WITH YOU

- What currency? Gold carried over? New "Favor" currency?
  Gold is indirectly carried over between stages in the form of FAVOR. Bosses award gold (technically?) but this is added to the wallet which is then converted into Favor. gold spent on dice upgrades will usually persist between rounds though, making that a good use of gold.
- What upgrades are available? Tier-locked by stage?
  -For the favor upgrades, I think that assigning 3 favor should open up the 2-favor options. Assigning 5 favor opens up the 3-favor options. Assigning 8 favor opens up the 4-favor options. And assigning 12 Favor opens up the 5-favor options.
  -For the gold upgrades, specifically at the Merchant, all the options are unlocked from the beginning (but possibly prohibitively expensive). I would like to guarantee that EXACTLY ONE avenue on the overworld map always has a merchant immediately before the Boss. There may be other merchants by chance on the other avenues but they won't be right before the boss. If players want to plan on spending gold right before the boss they should always have that option.
  - How does this interact with the existing post-boss shop?
- Should this replace post-boss shop or supplement it?
- - This should entirely replace whatever currently exists for a post-boss shop.
**Merchant**
The merchant is guaranteed to appear as an option on every Stage at least once, at the very end (before the boss) as well as potentially earlier in the overworld trudge. Merchant operates around the most basic of principles: Pay 1 gold to raise 1 number on 1 die by 1. This first number increases by 1 each time the upgrade is bought (so after the first purchase, pay 2 gold to raise 1 number on 1 die by 1) But each trip to the merchant, this resets again to 1. So the party entering with 10 gold would be able to get 4 numbers bumped by 1, or 1 number bumped by 4, for all 10 G (1+2+3+4), or just get 2 upgrades for 3 Gold and "save up" til the next Merchant.
Important - Merchant can ONLY affect segment faces that have received no changes other than from the merchant - so 1 (DOOM) and 20 (HOPE) are immediately always excluded from availability for Merchanting, and the Merchant can't turn a 19 into a 20 (caps at 19). Any segment that has been manipulated by any other force (starting upgrades, alchemist, mathemetician, etc) is INELIGIBLE to be upgraded at the Merchant (he can mutter something about aftermarket upgrades voiding the die's warranty). Merchant CAN repeatedly upgrade segments that have only previously been upgraded by the Merchant.
The merchant should also offer a Spin On The Wheel for 5 Gold (5 gold each time, repeatable as many times as the player can pay) that has a fair and visible range of outcomes (picturing 5 wheel outcomes- Double segment (caps at 19), Half segment (minimum 2), Add +1 Hope, Add +1 Doom, and Intertwine.) Player will choose to use the wheel and then choose the segment they are "gambling" and the wheel will spin and the requested effect will apply. *AS WITH MOST UPGRADES IN THIS GAME A SEGMENT THAT HAS BEEN UPGRADED BY THE WHEEL CANNOT BE UPGRADED AGAIN EXCEPT BY THE WHEEL*
#### Ability-Specific Outcomes
**[NEEDS CONTENT]** Each die type (Slash, Stab, Bonk, Threaten, Deceive, Persuade, Bribe, Hide, Grapple) should have unique narrative text for each encounter situation. What does it LOOK like when you Stab a bandit vs Deceive them vs Bribe them?
You're right this is necessary but it is uninteresting to write. In general it should be the basic, expected outcome you would anticipate - the difference between:
STAB - Hands covering deep wounds, the bandits retreat to find makeshift bandages
BONK - A well-placed bonk to the noggin knocks the last bandit out cold
SLASH - Wounded and bloody, the bandits collapse to the ground 
THREATEN - You looked smaller from farther away. The bandits quickly realize they are outmatched, and retreat.
DECEIVE - Despite looking behind them right when you pointed, the bandits did not see the dragon you promised was totally right there a second ago.
PERSUADE - Perhaps a life of crime isn't the answer. The bandit sets down his sword and immediately begins work on his resume.
BRIBE - Heads swimming with promises of gold, the bandits don't realize you've absconded until you're long out of sight.
HIDE - These guys must not have played enough hide-and-seek as kids. They stumble past you, completely unaware you're there.
GRAPPLE - A simple Full Nelson was enough to make these lowlife ruffians throw down their knives and scamper away
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
> "Write the full intro sequence for Stage [X], including: opening narration, first NPC dialogue, and the hook that pulls players into the stage's conflict." I AM GOING TO WRITE THE SHELLS OF THESE AND WE CAN FLESH THEM OUT LATER.
> STAGE 0 and it is primarily there so that Pal can teach the Colors/players the basics of the game and the universe. 
It starts at the "hideout" the 4 of them call home, and Pal shows up and tells them that the real adventure starts today if they can prove themselves! He seems sort of distant and melancholy, he mentions ATOM (bad guys). This framework - demonstrate your skills - allows Pal to train the player on how to operate the controls while also letting the Colors pick their good/med/bad dice with some narrative thrust. Throughout the process Pal is increasingly worried and paranoid leading all the way to him revealing the prophecy to them and handing it off, bidding them follow it in his name. He beckons them out of the hideout where there they can just barely make out a muffled conversation where Pal curses ATOM, before the whole thing EXPLODES. Bits of home and hero rain down on our protagonists and we see the Title Screen (pre-stage 1).
> STAGE 1 - The heroes explore the area around their old hideout searching for clues or people who Pal might have given any information to. This leads them to the Dirtbag Inn run by Seedy Sammy, who was an old friend of Pal's from way way back. He offers to help them more after a good night of sleep but they awaken to find nearly all of their gear missing, leaving them just the numbers on their backs! Scampering around the city on his trail they ultimately find him near the capitol castle. They triumph over him and he is immensely remorseful, Pal meant the world to him back in the day and he can't believe he's done this. He offers to do whatever he can to help them and reveals that he was in debt to ATOM and the person he owed was ---" and that's when the arrow silences him and Stage 1 ends.
> STAGE 2-5: These are basically written shells already, with the details of the stage boss, their motivations, etc. Can you write up descriptions just like in my style for Stage 0 and Stage 1 for what 2-5 should be like? Use mostly my ideas and tone, just fill in the blanks where I didn't write anything explicitly.
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
0 to 1, we have to figure out this prophecy! Let's explore the city!
> 1 to 2, oh no Seedy Sammy was murdered! Who could have done this? Let's track down where that arrow came from!
> 2 to 3, we avenged Seedy Sammy but how deep does this conspiracy go?? We have to infiltrate the miltary!
> 3 to 4, gulp! We'll have to take on the actual KING himself to stop all this! To the Castle we go!
> 4 to 5, WAIT, the king was just a puppet who summoned BOMB? Wait, that must be what killed Pax! Let's kill it!!!
> 
### Polish & Feel
> "Write 10 unique Gambler voice lines for different roll outcomes." INSTEAD, WRITING 5-10 STUBS FOR THE BEGINNING AND 5-10 STUBS FOR RESULT THAT YOU CAN MIX/MATCH
Beginning Stubs:
> Step right up step right up.... 
> Swing batter batter swing... OOF. Rough.
> Big Bucks...No whammies... 
> Gotta play to win!....
> Shuffle shuffle shuffle...
> Round and round the gambling die goes...
> Result Stubs:
> oof sorry better luck next time!
> Woof. That's rough.
> > You are the weakest link, goodbye.
> Yeehaw! Congrats!
> Oh, we got a lucky guy over here, huh?
> > Wow! You're on a roll! Get it! Haha!
> "Create loading screen tips that teach mechanics while staying in-character for the game's tone."
Intertwining is powerful. Use it.
> There's nothing wrong with being a sidekick.
> > High floor or high ceiling? Porque no los dos?
> >

> "Design the 'fake victory' screen for Stage 4. What does it say? How long before the twist?"
Not too long, players will "win" against the king and he will give dialogue about how he is slain but that the forces of ATOM will persist... and then he plunges a knife(?) into his heart(?) and that summons BOMB.
