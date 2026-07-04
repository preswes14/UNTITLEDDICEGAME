// ============================================================================
// RUN LIFECYCLE — creating a run, abandoning it, and generic CONTINUE.
//
// STATUS: startRun implemented (with placeholder stage-0 draft phase and an
// empty stage map until briefs 05/12 land). CONTINUE currently only backs
// out of terminal screens; stage-flow transitions arrive with briefs 05/07.
// ============================================================================

import { BALANCE } from '@content/balance';
import type { GameAction } from './actions';
import { seedRng } from './rng';
import type {
  Approach, Die, Face, Hero, HeroColor, PlayerId, RunState, TalentId,
} from './types';
import { APPROACH_OF_TALENT } from './types';

export const SCHEMA_VERSION = 1;

/** README example party composition — the default/quick-start loadout.
 *  The stage-0 draft (brief 12) lets players choose their own. */
const DEFAULT_TALENTS: Record<PlayerId, TalentId[]> = {
  0: ['persuade', 'bonk', 'hide'],
  1: ['threaten', 'bribe', 'stab'],
  2: ['slash', 'deceive', 'grapple'],
};

const HERO_COLORS: [HeroColor, HeroColor, HeroColor] = ['blue', 'red', 'green'];

/** A fresh base die: faces 1..20, all provenance 'base'. */
export function makeBaseDie(talent: TalentId): Die {
  const faces: Face[] = [];
  for (let v = 1; v <= 20; v++) {
    faces.push({ kind: 'value', value: v, provenance: 'base' });
  }
  return { talent, approach: APPROACH_OF_TALENT[talent], faces };
}

function makeHero(id: PlayerId, name: string): Hero {
  const dice = {} as Record<Approach, Die>;
  for (const talent of DEFAULT_TALENTS[id]) {
    const die = makeBaseDie(talent);
    dice[die.approach] = die;
  }
  return { id, name, color: HERO_COLORS[id], dice };
}

export function startRun(action: Extract<GameAction, { type: 'START_RUN' }>): RunState {
  return {
    schemaVersion: SCHEMA_VERSION,
    seed: action.seed,
    rng: seedRng(action.seed),
    stage: 0,
    phase: { kind: 'draft', step: 'start', data: {} },
    heroes: [
      makeHero(0, action.heroNames[0]),
      makeHero(1, action.heroNames[1]),
      makeHero(2, action.heroNames[2]),
    ],
    map: { stage: 0, nodes: [], currentNodeId: null },
    gold: 0,
    doom: BALANCE.doom.startingDoom,
    hope: 0,
    maxHope: BALANCE.hope.baseMax,
    shields: 0,
    maxShields: 1,
    favor: { total: 0, assigned: [], purchased: [] },
    merchant: { nextBumpCost: BALANCE.merchant.bumpStartCost },
    exoticDiceTaken: [],
    tick: 0,
  };
}
