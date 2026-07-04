// ============================================================================
// CONTENT REGISTRY — the one place the engine looks content up.
//
// STATUS: STUB. Populate per docs/briefs/06-encounters-and-content.md.
// Port definitions from the legacy prototype: js/config.js holds encounter
// data, enemy stats, exotic dice, and the favor store draft is in README.md
// ("FAVOR STORE FIRST DRAFT").
// ============================================================================

import type {
  EncounterDef, EnemyDef, ExoticDieDef, FavorUpgradeDef, StageDef,
} from './schema';

export { BALANCE } from './balance';

/** Every non-combat + combat encounter, keyed by id.
 *  TODO(brief-06): port Mathematician, Alchemist, Priest, Gambler, Bandits,
 *  Corrupt Guards, Thug, Ferryman, Trapper, Drunk Priest, Cultist, Merchant,
 *  and the Stage 5 warped-dimension set from js/config.js + README tables. */
export const ENCOUNTERS: Record<string, EncounterDef> = {};

/** TODO(brief-06): regular enemies, minibosses, 5 bosses (stats in
 *  content/balance.ts, structure in README "Boss Thresholds" table). */
export const ENEMIES: Record<string, EnemyDef> = {};

/** The 10 unique exotic dice (README "Exotic Dice").
 *  The four behavior-hooked dice are defined now because the roll resolver
 *  (engine/systems/rolls.ts) implements their hooks; TODO(brief-06): the
 *  remaining six are plain face lists (d6, Coin Flip, Cursed Hope,
 *  BlackJack Dealer, Low Roller, Odd Couple). */
export const EXOTIC_DICE: Record<string, ExoticDieDef> = {
  'lucky-sevens': {
    id: 'lucky-sevens',
    nameKey: 'exotic.lucky-sevens.name',
    rank: 2,
    faces: Array.from({ length: 20 }, (_, i) => ({
      kind: 'value', value: i + 1, provenance: 'trapper',
    })),
    behavior: 'lucky-sevens',
  },
  doubler: {
    id: 'doubler',
    nameKey: 'exotic.doubler.name',
    rank: 3,
    faces: Array.from({ length: 20 }, (_, i) => ({
      kind: 'value', value: (i % 10) + 1, provenance: 'trapper',
    })),
    behavior: 'doubler',
  },
  'six-nine': {
    id: 'six-nine',
    nameKey: 'exotic.six-nine.name',
    rank: 5,
    faces: Array.from({ length: 20 }, (_, i) => ({
      kind: 'value', value: i + 1, provenance: 'trapper',
    })),
    behavior: 'six-nine',
  },
  wildcard: {
    id: 'wildcard',
    nameKey: 'exotic.wildcard.name',
    rank: 10,
    faces: Array.from({ length: 20 }, () => ({
      kind: 'scratched', provenance: 'trapper',
    })),
    behavior: 'wildcard',
  },
};

/** TODO(brief-07): the FAVOR store (README "FAVOR STORE FIRST DRAFT"). */
export const FAVOR_STORE: Record<string, FavorUpgradeDef> = {};

/** TODO(brief-06): stage definitions 0-5 (README "Stage Breakdown"). */
export const STAGES: Record<number, StageDef> = {};

/** TODO(brief-12): narrative registry — every textKey used by content
 *  resolves here. Keep prose out of logic files. Structure:
 *  narrative/<area>.ts exporting Record<string, string>, merged here.
 *  Params use {name}-style templating. */
export const NARRATIVE: Record<string, string> = {};
