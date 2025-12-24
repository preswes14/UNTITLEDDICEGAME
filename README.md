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
- *"Let's soup up the Paladin's persuade ability, then replace as many segments on our dice with that one supercharged Persuade die!"*
- *"Let's stack all of our bad numbers onto Stab - we're trying to play pacifist."*

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
Instead of traditional health, when a player takes a "hit", one or more numbers on their die are reduced (for that battle, or longer in some instances).

### The DOOM Meter
The party has a shared DOOM meter that fills as bad things happen:
- Failed non-combat rolls: +1 DOOM
- Bad encounter choices: +1-2 DOOM
- Ferryman's crossed marks triggering: +2 DOOM
- Other misfortunes and curses

The DOOM meter indicates that the heroes are unable to overcome the forces of darkness and avoid the prophesied danger. **The DOOM meter affects all rolls** - every point of DOOM subtracts 1 from each roll result (except natural 20s).

### The DOOM Roll (Enemy Attacks)
When an **enemy lands a hit** on a player, they must make a **DOOM Roll** - a special d20 roll that determines their fate:

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
- Example upgrade: "Choose 2 segments between 7 and 15. Reduce both by 5 and add +1 HOPE to both segments"

---

## Encounters & Map Structure

Encounters are set up similar to **Slay the Spire** or **Inscryption** - players advance through a basic overworld, following a generally linear path but making choices at forks. Simple icons indicate encounter types.

### Encounter Reference Chart

| Encounter | Type | Situation | Risks | Rewards | Stage 5 Modification |
|-----------|------|-----------|-------|---------|---------------------|
| **The Mathematician** | Good | Old man offers to adjust dice numbers | None (free) or 20G cost | FREE: +1 to lowest face, PAID: +3 to lowest | *Replaced by Memory Fragment* |
| **The Alchemist** | Good | Wild-eyed woman offers to splice dice together | None (free) or 25G cost | FREE: Link a low roll to ally, PAID: Link a high roll | *Replaced by Pocket of Reality* |
| **The Priest** | Good | Serene figure offers blessing | None | +3 HOPE | *N/A in Stage 5* |
| **The Gambler** | Good | Shifty woman offers a wager | Lose 20G + 1 DOOM on fail | Roll ≥15: Double your 20G wager | *N/A in Stage 5* |
| **Bandits** | Bad | Three thugs block your path | DOOM Rolls on misses | 30G, DC 12, Thresholds: P:2/V:2/Pr:1 | *Replaced by Echo of BOMB* |
| **Corrupt Guards** | Bad | Guards demand "peace tax" | DOOM Rolls on misses | 25G, DC 13, Thresholds: P:2/V:1/Pr:2 | *Replaced by Void Creatures* |
| **Miniboss (Thug)** | Bad | Massive bouncer blocks stairs | DOOM Rolls on misses | 40G, DC 14, Thresholds: P:3/V:2/Pr:2 | *N/A in Stage 5* |
| **The Ferryman** | Neutral | Ancient boatman judges your fate | Free: 27% bad (die marked). Paid 15G: guaranteed good | Free: 47% +2 HOPE, 27% safe. Paid: +2 HOPE | *Replaced by The 19 Darkened Lines* |
| **The Trapper** | Neutral | Hunter offers mystery dice trade | Free: 27% worse value. Paid 20G: guaranteed +6-10 | Free: 47% +5+ value. Paid: +6 to +10 | *N/A in Stage 5* |
| **The Drunk Priest** | Neutral | Stumbling priest offers blessing | Free: 27% more DOOM. Paid 10G: guaranteed +3 HOPE | Free: 47% +3-4 HOPE. Paid: +3 HOPE, no DOOM | *N/A in Stage 5* |
| **The Cultist** | Neutral | Robed figure offers purple drink | Free: 27% bad swap + DOOM. Paid 25G: guaranteed good | Free: 47% swap + upgrade. Paid: swap + +5 upgrade | *N/A in Stage 5* |

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

*Open questions and future considerations:*

- Should the players have gotten their prophecy from a beloved figure who left them notes?
- Why were there 20 prophecies? This needs to tie in better with the narrative
- Explore the Oppenheimer thematic parallels further?
- 
NOTES FOR CLAUDE 12/24/25 ROUND 1
I'm going to fix a fundamental misunderstanding about the DOOM system by outlining a few truths about the system. The DOOM die is distinct from the other 9 dice that the heroes have and use "freely". DOOM rolls are forced upon them by situations that would actually cause them potentially mortal peril. In general, failing in an encounter would result in the DOOM meter increasing, making it more likely that future DOOM rolls cause the end of the game. The DOOM meter does NOT affect rolls outside of DOOM rolls. Player rolls on their standard 9 dice do not take blanket minuses like you describe - the game is more elegant than that.
Of similar but lesser importance is a misunderstanding of what these encounters should be like. Inscryption is a great example - nearly every spot you come across is a free upgrade of some kind to your deck, and the sporadic combats test what you have built. The forking path overworld allows the player to choose which upgrades they want to target, and also lets them choose to engage in combats. Most of the Gold rewards come from combat, which incentivizes the player to do them, but they also are a common way that both DOOM is applied and that DOOM rolls occer (or DOOM checks). Right now you are having, for example, The Gambler cost 20 gold and trigger a doom on fail. At WORST a good encounter should offer a negative tradeoff for a more significant positive benefit - but usually it is just an opportunity to add a positive, or a better positive, or fail to add a positive.
(It is sort of like Craps odds. Here is an example: The randomly generated range is 8 to 14. Players get to choose "in range" or "out of range" before choosing a die and rolling. The display makees it clear (AGAIN THIS IS AN EXAMPLE) that a HIT IN RANGE (which is less likely) is worth a +5 to a segment of their choosing, and a HIT OUT OF RANGE (1 through 7 plus 15 through 20 is more common) rewards a lesser +3 to a random segment.)
All the GOOD encounters should be like this, generally - free upgrades with a chance at a better upgrade, or a choice at a negative that is offset by a double-positive, or just a straight-up freebie.
NEUTRALS should be more like how you have goods - some will be good, some will be bad, most should offer a chance at a benefit but usually with a risk or a downside. I would say that players should have a neutral outcome approximately 4/15 times, a good one 7/15 times, and a bad one 4/15 times
NOTES FOR CLAUDE 12/24 ROUND 2
It's time for us to take a step back and look at the game holistically. What is already pretty developed and what have we not even started to apply our energies towards? For example I know that the Start-Of-Stage Upgrade Buying will be a critical piece and I have discussed it but not fleshed out any beyond the initial upgrade pattern. There needs to be a whole economy here and that economy needs to be balanced against the other ways to gain upgrades, while also providing enough of a boost for the early game that players can establish an identity with their character and start to develop a strategy early on.
I want the economy starting lower - the earliest, cheapest upgrades should cost 1 and 2 G, not 10 and 15. This will allow us to scale as we add godly powers onto the dice for a high G cost.
Another example of something that needs a ton of work is the opening draft of dice, right now it is just a mess of options and buttons and is lacking any of the pageantry and excitement of a draft. Similarly the other upgrades should be exciting and encourage the player to keep playing to get the next upgrade or buold up a really stacked set of dice.
We need more "intertwine" mechanics - perhaps adjust some of the current possible reward options to grant more die swaps.
We also don't have any of the logic ready for the myriad of outcomes that could occur for using all 9 of the different abilities in any of the settings. Sometimes that will be treated more like a skills check, just like in the Gambler one where the actual EFFECT of the die doesn't matter, just the NUMBER... but that will not be ubiquitous. In situations where the player is trying to persuade but accidentally uses the wrong die and grapples, there needs to be text ready to go for those situations as well as corresponding consequences (good, bad, or otherwise).
All 1s should come with a DOOM (let's have this inscribe the number in RED) and all 20s should come with HOPE (this should inscribe the number in GOLD). 
Example Stage 1 Runthrough - the players draft their dice and get their initial upgrades/downgrades/intertwines. They choose the path that goes Good-Combat-Neutral-Combat-Miniboss, rather than Combat-Neutral-Good-Neutral-Miniboss, hoping to get some extra Gold to spend later in the run. On the Good encounter, they get the Priest and each adds HOPE to a die. They easily trounce the combat, earning 5 G and taking no DOOM, but having to do 1 roll on the DOOM die (with 0 DOOM accrued, they have just a 5% chance of failure). The next encounter is Neutral, the Trapper. Trapper offers 3 dice; First one is 6996, where all 6es and 9s are flipped. Second one is The Coin Flip, which is 10 20s and 10 1s. And the 3rd one is a d6 (faces 1, 2, 6, 12, 19, 20). Each die has pros and cons; the Most advantageous of these is probably the d6 because it could be manipulated into success more easily. So a player would have to trade away the die they are BEST at to get that one. Conversely, the player could trade the die they were worst with the get 6996, which is a weak effect and requires a lot of tweaking to make successful, or their middle die to get the Coin Flip. (there's a chance Coin Flip is super powerful.. we should come up with like 10 different dice, rank them, then randomly draw 3 each time Trapper encounter occurs). Anyway, 2 of the players take the trade (1 takes Coin Flip and one takes d6), and 1 doesn't. Then, the players proceed, and the next combat happens; due to these new dice, the players roll 2 1s! Oh no! This bumps the DOOM meter up to 2.. And gives them a 15% chance of losing the run on their next doom roll! Fortunately the third player rolls a 20, getting 1 HOPE (which removes 1 DOOM) and when the enemy strikes, the DOOM die doesn't roll a 1 (thankfully!). The heroes clear the combat on turn 2 and make it to the miniboss!
Pausing my example here for now... There is a lot layered in there as far as UI, player experience, logic, etc. 
