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
The party has a shared DOOM meter that fills as they fail actions or take hits:
- Normal fail or hit: 1 notch
- Critical hit, massive flub, or Nat 1: 2-3 notches

The DOOM meter indicates that the heroes are unable to overcome the forces of darkness and avoid the prophesied danger.

### The DOOM Die
- Every point of DOOM subtracts 1 from each number on the die (except 20)
- When a 1 (natural or DOOM-modified) is rolled, the journey ends
- When a 20 is rolled, it removes HALF of the current DOOM
- DOOM resets between Stages

### HOPE
HOPE offsets accumulated DOOM:
- Players can accrue HOPE to offset existing DOOM
- HOPE cannot be "banked" - any HOPE gained when at 0 DOOM is wasted
- Some dice upgrades add HOPE to specific rolls
- Example upgrade: "Choose 2 segments between 7 and 15. Reduce both by 5 and add +1 HOPE to both segments"

---

## Encounters & Map Structure

Encounters are set up similar to **Slay the Spire** or **Inscryption** - players advance through a basic overworld, following a generally linear path but making choices at forks. Simple icons indicate encounter types.

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
*Can be approached multiple ways - dice swapping often occurs as reward OR punishment*

- **The Ferryman** - Offers passage but you must roll a gambit; whatever you roll happens to him. *May force a temporary swap as "payment" - your Persuade die links to your friend's Stab for this crossing. Hope you don't need to talk your way out of anything on the other side.*
- **The Trapper** - Has mismatched hodgepodge dice for trade (dice from previous sessions or pre-generated "funny" dice). *Can also offer to "splice" segments between party members' dice for a price - high risk, potentially high reward.*
- **The Shopkeep** - Buy the effect of a Good Encounter
- **Drunk Priest** - Lets you choose segments to add HOPE to, but messes up and adds DOOM to some segments too
- **The "Tree"** - Clearly a man in a tree costume spying on someone. Expose him or let him be - right answer is 50/50; correct choice grants a decent bonus
- **The Cultist** - Drink the fruit punch for a negative + positive effect, or refuse and risk the cultist's ire (likely DOOM increase). *Drinking may randomly swap a segment with a teammate - you're both in this now, for better or worse.*

**Note on Neutral Encounters:** A botched neutral encounter can *force* an unfavorable swap - suddenly your nat 20 triggers your teammate's worst die. This creates real consequences while reinforcing cooperation: even punishments tie you closer together.

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
