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

**Good Encounters** - Little to no risk (shopkeep, upgrading, etc.)
- **The Mathematician** - Adds, subtracts, etc. to dice
- **The Alchemist** - Weird stuff: replacing your segments with your friends' dice
- **The Gambler** - Luck-based structure and luck-based segment changes

**Bad Encounters** - Fight or overcome obstacles to earn Gold
- Combat with bandits (can be killed, mugged, or persuaded)
- Evil people (best rewards for killing them)
- City guards (best rewards for winning/escaping but NOT killing them)

**Neutral Encounters** - Can be approached multiple ways
- **The Ferryman** - Offers passage but you must roll a gambit; whatever you roll happens to him
- **The Trapper** - Has mismatched hodgepodge dice they can trade for
- **The Shopkeep** - Buy the effect of a Good Encounter

---

## Boss Encounters & Narrative

Boss encounters will shape the narrative of the game. This is a 5-stage campaign with each stage having its own narrative and boss.

| Stage | Boss |
|-------|------|
| 1 | Dirty Innkeeper |
| 2 | Corrupt Guard |
| 3 | Subhuman General |
| 4 | Chthonic King |
| 5 | Destroyer of Worlds |

These bosses weave the narrative of players growing from dealing with a rat innkeeper to saving the world from destruction.

- Boss encounters change minimally over each playthrough
- Other encounters are randomly generated (with balance caveats)
- Each of the 5 levels features a "miniboss" where players can set themselves up for an easier final boss

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
