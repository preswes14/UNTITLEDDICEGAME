# UNTITLED DICE GAME

Brainstorming and initial coding for Untitled Dice Game

---

## Overview

This is a companion app / guide for collaborative TTRPG action. By default, the game is designed for 3 players.

---

## Core Mechanics

Each player has their own set of 3 d20 dice chosen from a pool of about 10. These dice represent talents or gambits that might be attempted in the game. Each of these dice can fall into one of 3 categories:

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

Players will encounter various obstacles or combats that they must proceed through. They will do so by taking turns choosing dice and rolling to see if they are successful.

---

## Progression & Rewards

Rewards, goals, and gameplay will be oriented around improving these dice. For example:
- Replace the 2 with a 1, but replace the 3 with a 20
- Add 5 to a number of your choosing

Players will permanently improve their dice, allowing them to progressively clear more difficult challenges.

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

## Roguelite Structure

This will not be a true roguelike but will have some roguelite elements.

Generally this is a progressive campaign: once heroes clear Stage 1, they will play Stage 2 until they beat it, then move on to Stage 3. They don't need to return to Stage 1 each time.

Various upgrades are unlocked based on how they cleared the earlier stages, as well as base bonuses for starting higher-level stages.

**Upgrade Types:**
- Permanent hero upgrades
- Base up-floor upgrades
- Varying up-floor upgrades
- Per-run temporary bumps

*This may be the most complicated part of the game.*

### Upgrade Examples

| Tier | Cost | Effect |
|------|------|--------|
| Easy | Cheap | Directly add to a number on a die (2→3 costs 1G, 3→4 costs 2G) |
| Medium | Moderate | Replace a segment with a fresh roll on a teammate's die, OR replace with a "Chaos" segment (roll all 3 dice, middle number happens) |
| Hard | Expensive | Choose 5 numbers to become Nat 1s and 5 numbers to become Nat 20s |

---

## Encounters & Map Structure

Encounters/levels will be set up similar to **Slay the Spire** or **Inscryption** - players advance through a basic overworld, following a generally linear path but making choices at forks to choose their route. Simple and recognizable icons will indicate encounter types.

### Encounter Types

**Good Encounters** - Little to no risk (gifts, upgrades, games, etc.)
- **The Mathematician** - Adds, subtracts, etc. to dice. Players have to take a negative to get a positive but they should usually come out on top (for example, halving 4 to 2 but doubling 8 to 16 is a good trade for the player.)
- **The Alchemist** - Weird stuff: replacing your segments with your friends' dice
- **The Gambler** - Offers various target ranges; players guess if they think they will HIT or MISS on their roll. Gambler will offer a smaller reward (like +2 to a random segment) for whichever outcome in a given range is more likely, and a larger reward (like +5 to a chosen segment) for whichever outcome in that given range is less likely. 
- **The Priest** - Offers to add HOPE to random segments (weighted towards lower rolls)

**Bad Encounters** - Fight or overcome obstacles to earn Gold
- Combat with bandits (can be killed, mugged, or persuaded)
- Evil people (best rewards for killing them)
- City guards (best rewards for winning/escaping but NOT killing them)
- Beasts, Monsters, Dragons, etc.. Stage 1 should have 1-2 enemy types, and each new stage should introduce 1-2 new ones and generally phase out the older ones.

**Neutral Encounters** - Can be approached multiple ways
- **The Ferryman** - Offers passage but you must roll a gambit; whatever you roll happens to him
- **The Trapper** - Has mismatched hodgepodge dice they can trade for (could be dice from previous sessions or pre-generated "funny" dice, maybe both at different prices - for example they have to trade their best die for her best, etc.)
- **The Shopkeep** - Buy the effect of a Good Encounter
- **Drunk Priest** - Lets you choose segments to add HOPE to, but messes up the blessing and adds DOOM to some segments too, or possibly just adds to the DOOM meter.
- **The "Tree"?** - Players come across what is clearly a man in a tree costume spying on someone and get to either expose him or let him be - the right thing to do is 50/50 and if they get it right they get a decent bonus
- **The Cultist** - Player gets to either drink the fruit punch for a negative + a positive effect, or avoid recruitment and risk the cultist's ire (likely a doom increase)
---

## Boss Encounters & Narrative

Each Stage has a designated Boss, and those Stages will shape the narrative of the game. This is a 5-stage campaign with  each Stage consisting of [an introduction, several random encounters, a miniboss, several more random encounters, a boss, and a conclusion].. - Boss encounters change minimally over each playthrough. Other encounters are randomly generated (with balance caveats)
- Each of the 5 levels features a "miniboss" where players can set themselves up for an easier final boss, or possibly screw up and give themselves a harder one. Various approaches can be employed in these - it does not always have to be combat.
  
Main Narrative: One prophecy can be hard enough to unravel. So when 20 prophecies appeared overnight, in the hands of soldiers and shepards and princes, purple lettering emblazoned on thick vellum - chaos ensued. That was 20 years ago; hoping to make it rich, all manner of bandits and charlatans have chased these prophecies, and as with so many of their names and deeds, the prophecies themselves were lost to history. in the hands of various adventuring groups. Some speak of kings, some speak of stars, but all lead to the same end - total global annihilation.
Our heroes are some of the few noble-hearted individuals who still hold one of these prophecies, and its cryptic clues have brought them here, to the Dirtbag Inn, where our story begins. The party learns of a growing movement to Assemble The Others Movement (ATOM), which is effectively a doomsday cult that seeks to bestow our world unto the evil gods of the universe to attain transcendence or something. Through increasingly obvious hints and decreasingly safe situations, the party has to follow the threads and thwart this plot in order to comply with the prophecy and save the world!

| Stage | Boss |
|-------|------|
| 1 | Dirty Innkeeper |
  ARC PLOT - The party arrives at the doorway to an inn and are allowed inside for board. They awaken to find all their gear missing, the Innkeeper nowhere to be found! They must explore the town for clues to the Innkeeper's disappearance. Miniboss - Town Gossip.  Party fights innkeeper for their stuff but learn that he only stole it to pay off debts to ATOM, of which he is a former member. As the party defeats/corners the innkeep and finally gets him to talk, an arrow is loosed from atop the city gates, silencing the man and introducing a new opponent.
| 2 | Corrupt Guard |
  ARC PLOT - After the Innkeep's assassination, the party investigates the city guard to try to learn which guard killed the would-be informant. (Miniboss - Drawbridge and/or drawbridge operator). After breaching the walls of the Castle they encounter the guard and dispose of him; in doing so, they match the sigil on the pommel of his sword (or issue of his uniform, sigil on his shield, etc) to a certain General Heimer located in an adjacent, larger city.
| 3 | Subhuman General Heimer|
  ARC PLOT - The heroes arrive at the Capitol ready to find General Heimer but are met with his army just outside, providing robust defense to the city. They must figure out their way through to Heimer so they can put an end to his use of the troops for these foul delights. (Maybe 2 different possible Minibosses here and the player can pick or maybe be randomly assigned - A, The Daytime where they have to take out a bunch of soldiers, or B, The Nighttime where they have to infiltrate more sneakily). Upon successfully making it, the players have a gritty encounter with Heimer who ultimately declares he was doing it all on the King's Orders.
| 4 | Chthonic King Robert |
  ARC PLOT - Having battled through the army outside, only the streets of the capital and the Royal Guard stand between our heroes and their charge. The King has 3 different Royal Guard (The Jester, who likes games of chance; The Chef, who is cooking DOOM for dinner; and The Counselor, who will try to persuade the player out of their mission). Upon making it to The King, should the players survive that encounter, they will be treated to a fake-out "you did it!" screen before noticing the pentagram inscribed on the floor. 
| 5 | Destroyer of Worlds, Big Obvious Malicious Boss (BOMB) |
  ARC PLOT - Stepping through the portal created by the pentagram pulls the player into a strange dimension with warped versions of the encounters they've grown used to, both harder and stranger than before. Miniboss here should be an early encounter with the BOMB (picture like an amoeba/neural-network looking creature) where he brutally changes the players dice, leaving them only ~3 neutral encounters to restore them to some kind of functionality before their final encounter with him. The design of this Stage should have 19 "darkened" lines, and then the heroes on the single lit one, indicating this is the one remaining possible prophecy that has not been circumvented, and this is the last and best chance to save the world. They fight BOMB and either lose, resulting in the world's destruction; or win, finally fulfilling their prophecy and saving the world from annihilation! 





---

## Visual Design

- **Overworld:** Vertical exploration map that takes up the whole screen
- **Encounters:** Map rolls up; 3D dice-roller-catcher on bottom, text/art explaining the encounter on top

---

## Multiplayer Interface

*Not 100% decided, but ideally:*

Players interface with the game on their own devices (à la **Jackbox** or **Sunderfolk**). This allows fine-tuned decisions for each die without slowing down the game.

- In most situations where an upgrade is granted, all heroes receive it
- In some situations, the group determines who gets the upgrade
- Only one player needs to purchase the game (stream or couch co-op)

**Player Interface:**
- Three dice displayed in 3D that you can rotate and zoom in on
- Clicking one zooms in and brings up the "confirm" option to roll in the dice tray on the big screen

NEW THOUGHTS AS OF 12-23-2025 (CONTENT FLESHED OUT ABOVE, AS WELL)
Good upgrade option for first upgrade: each hero gets to add 10 to a number between 2 and 9, or add 5 to any 2 numbers between 9 and 14. Picturing a very simple interface presenting their options, with eligible 'segments' or faces enumerated in smaller font underneath the upgrade choice.
Another good upgrade option early - Choose 1 number on your die between 5 and 9 to scratch out, or 2 between 10 and 14. (Scratch out is a blank, so a re-roll on that same die).
Fun later complex upgrades: Middle Out - all numbers between 5 and 15 (inclusive) are scratched out. Bottoms Up - your 1 becomes a 20. Subtract 1 from all other faces (could be big if player has already buffed 2-5, eg). Tops Down - Remove your Nat 20. 14, 15, 16, 17, and 18 become 19.
THIS GAME USES A UNIQUE DAMAGE MECHANIC INSTEAD OF HEALTH. when a player takes a "hit", they should have one or more numbers on their die reduced (for that battle, possibly for longer in some instances)
The party has a "DOOM meter" that fills up as they fail various actions or take hits. In theory, a normal fail or hit is 1 "notch" on the DOOM meter; a critical hit, a massive flub, or a Nat 1 would be 2 or 3 notches. The Danger Meter would indicate that the heroes were unable to overcome the forces of darkness and avoid the danger of which the prophecies speak.
Whenever there is a Ping or Notch on the damage meter, it is associated with a unique die roll on the DOOM Die. Every point of doom subtracts 1 from each number on the die (except 20), and whenever a 1 (natural or DOOM-modified) is rolled, the journey ends. When a 20 is rolled, it removes HALF of the current DOOM. DOOM resets between Stages.
The opposite of DOOM is HOPE. Players can accure HOPE to offset DOOM they have accrued, but they cannot accrue HOPE - any HOPE that would be accrued (like if players have 0 DOOM) is wasted. Some dice upgrades will allow a player to add HOPE to rolls; for example, this could be a standard upgrade. Or a more complex version, something like "choose 2 segments betweeen 7 and 15. Reduce both by 5 and add +1 HOPE to both segments".

Other Minor thoughts I don't want to forget:
Should the players have gotten their prophecy from a beloved figure who has left them notes?
Why were there 20 prophecies? This needs to tie in better.
Keep the whole Oppenheimer thing?
