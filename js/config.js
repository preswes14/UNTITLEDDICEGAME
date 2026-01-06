// ==================== GAME CONFIGURATION ====================
// Constants, definitions, and game data

const CHARACTER_AVATARS = {
    1: { color: 'Blue Wizard', features: 'Mystical robes, Staff', image: 'assets/blue-wizard.png' },
    2: { color: 'Red Ranger', features: 'Hooded cloak, Bow', image: 'assets/red-ranger.png' },
    3: { color: 'Green Pirate', features: 'Tricorn hat, Cutlass', image: 'assets/green-pirate.png' }
};

const DICE_TYPES = {
    slash: { name: 'Slash', category: 'physical', icon: 'SL' },
    stab: { name: 'Stab', category: 'physical', icon: 'ST' },
    bonk: { name: 'Bonk', category: 'physical', icon: 'BK' },
    threaten: { name: 'Threaten', category: 'verbal', icon: 'TH' },
    deceive: { name: 'Deceive', category: 'verbal', icon: 'DC' },
    persuade: { name: 'Persuade', category: 'verbal', icon: 'PS' },
    bribe: { name: 'Bribe', category: 'preventative', icon: 'BR' },
    hide: { name: 'Hide', category: 'preventative', icon: 'HD' },
    grapple: { name: 'Grapple', category: 'preventative', icon: 'GP' }
};

const STAGE_INFO = {
    0: { name: 'Stage 0: A Dream of Pal', location: 'The Dreamscape' },
    1: { name: 'The Crossroads Inn', location: 'The Inn' },
    2: { name: 'The Guarded City', location: 'The Gates' },
    3: { name: 'The War Camp', location: 'The Front Lines' },
    4: { name: 'The Royal Court', location: 'The Throne Room' },
    5: { name: 'The Warped Dimension', location: 'Beyond Reality' }
};

const BOSSES = {
    1: {
        name: 'The Dirty Innkeeper',
        description: 'The innkeeper blocks the exit, demanding payment for imaginary damages.',
        dc: 10,
        successThresholds: { physical: 4, verbal: 3, preventative: 2 },
        attacksPerRound: 1
    },
    2: {
        name: 'The Corrupt Guard Captain',
        description: 'The captain demands "taxes" while his men surround you.',
        dc: 12,
        successThresholds: { physical: 5, verbal: 4, preventative: 3 },
        attacksPerRound: 1
    },
    3: {
        name: 'General Heimer',
        description: 'The war general sees you as enemy spies.',
        dc: 14,
        successThresholds: { physical: 6, verbal: 6, preventative: 5 },
        attacksPerRound: 1
    },
    4: {
        name: 'King Robert the Paranoid',
        description: 'The mad king believes you are assassins sent by his own shadow.',
        dc: 15,
        successThresholds: { physical: 7, verbal: 7, preventative: 7 },
        attacksPerRound: 1
    },
    5: {
        name: 'B.O.M.B. - The Final Prophecy',
        description: 'The manifestation of all 19 failed prophecies. This is the 20th.',
        dc: 16,
        successThresholds: { physical: 8, verbal: 10, preventative: 9 },
        attacksPerRound: 2
    }
};

const ENCOUNTERS = {
    start: {
        type: 'start',
        name: 'The Journey Begins',
        description: 'You stand at a crossroads. Multiple paths stretch before you.',
        icon: '?',
        options: [
            { text: 'Continue', action: 'leave' }
        ]
    },
    mathematician: {
        type: 'good',
        name: 'The Mathematician',
        description: 'A scholarly figure with chalk-covered robes offers to analyze your dice. "Numbers are my domain. I can reshape probability itself."',
        icon: '?',
        options: [
            { text: 'Free Analysis (+2 to lowest)', action: 'math_free' },
            { text: 'Trade-off (-1 high, +4 low)', action: 'math_tradeoff' },
            { text: 'Sculpt 3 Faces (choose values)', action: 'math_sculpt' }
        ]
    },
    alchemist: {
        type: 'good',
        name: 'The Alchemist',
        description: 'Bubbling potions surround a wild-eyed alchemist. "I can splice your fates together... for a price in chaos."',
        icon: '?',
        options: [
            { text: 'Safe Link (link low roll)', action: 'swap_low_to_ally' },
            { text: 'Risky Splice (random + bonus)', action: 'alchemist_risky' },
            { text: 'Double Link (both allies)', action: 'alchemist_double' }
        ]
    },
    priest: {
        type: 'good',
        name: 'The Priest',
        description: 'A serene figure radiates calm. "HOPE is the light that keeps DOOM at bay."',
        icon: '?',
        options: [
            { text: 'Receive Blessing (+3 HOPE)', action: 'blessing_hope' },
            { text: 'Greater Blessing (+5 HOPE, risk mark)', action: 'blessing_greater' },
            { text: 'Bless a Segment (+1 HOPE on roll)', action: 'blessing_segment' }
        ]
    },
    gambler: {
        type: 'good',
        name: 'The Gambler',
        description: 'A flashy figure shuffles cards made of pure light. "Care to test your luck? The house always wins... but so might you."',
        icon: '?',
        options: [
            { text: 'Play the Range Game', action: 'gamble_range_choice' }
        ]
    },
    bandits: {
        type: 'bad',
        name: 'Bandits!',
        description: 'A group of masked thugs blocks your path. "Your gold or your lives!"',
        icon: '!',
        dc: 12,
        reward: 35,
        successThresholds: { physical: 2, verbal: 2, preventative: 2 },
        options: [
            { text: 'Fight!', types: ['physical'], action: 'combat' },
            { text: 'Negotiate', types: ['verbal'], action: 'combat' },
            { text: 'Evade', types: ['preventative'], action: 'combat' }
        ]
    },
    guards: {
        type: 'bad',
        name: 'Suspicious Guards',
        description: 'City guards eye you suspiciously. "Papers, travelers. And explain that suspicious bulge in your pack."',
        icon: '!',
        dc: 11,
        reward: 25,
        successThresholds: { physical: 2, verbal: 2, preventative: 2 },
        options: [
            { text: 'Resist!', types: ['physical'], action: 'combat' },
            { text: 'Talk our way out', types: ['verbal'], action: 'combat' },
            { text: 'Slip away', types: ['preventative'], action: 'combat' }
        ]
    },
    miniboss: {
        type: 'bad',
        name: 'The Lieutenant',
        description: 'A formidable warrior blocks your path. "You shall not pass without proving your worth!"',
        icon: '!',
        dc: 13,
        reward: 50,
        successThresholds: { physical: 3, verbal: 3, preventative: 3 },
        options: [
            { text: 'Duel!', types: ['physical'], action: 'combat' },
            { text: 'Challenge their honor', types: ['verbal'], action: 'combat' },
            { text: 'Find another way', types: ['preventative'], action: 'combat' }
        ]
    },
    ferryman: {
        type: 'neutral',
        name: 'The Ferryman',
        description: 'A hooded figure waits by a dark river. "Passage has a cost. Roll the dice... or pay in gold."',
        icon: '?',
        vote: true,
        options: [
            { text: 'Roll for Passage (random outcome)', action: 'ferryman_roll' },
            { text: 'Pay 5 Gold (+2 HOPE, safe)', cost: 5, action: 'ferryman_paid' },
            { text: 'Wade Through (+1 DOOM)', action: 'ferryman_wade' }
        ]
    },
    trapper: {
        type: 'neutral',
        name: 'The Trapper',
        description: 'A weathered hunter displays strange dice carved from bone. "Trade your mundane tools for something... exotic."',
        icon: '?',
        vote: true,
        options: [
            { text: 'Trade (mystery value)', action: 'trapper_trade' },
            { text: 'Exotic Dice (full replacement)', action: 'trapper_exotic' },
            { text: 'Pay 8 Gold (guaranteed +6 to +10)', cost: 8, action: 'trapper_paid' }
        ]
    },
    drunkPriest: {
        type: 'neutral',
        name: 'The Drunk Priest',
        description: 'A priest stumbles out of a tavern, blessing everything in sight. "Blessings! *hic* Blessings for all!"',
        icon: '?',
        vote: true,
        options: [
            { text: 'Accept Blessing (random outcome)', action: 'drunk_blessing' },
            { text: 'Pay 3 Gold (guaranteed +3 HOPE)', cost: 3, action: 'drunk_paid' }
        ]
    },
    cultist: {
        type: 'neutral',
        name: 'The Cultist',
        description: 'A robed figure offers a chalice of glowing liquid. "Drink, and your fates shall be bound..."',
        icon: '?',
        vote: true,
        options: [
            { text: 'Drink (random swap effect)', action: 'cultist_drink' },
            { text: 'Pay 10 Gold (guaranteed good)', cost: 10, action: 'cultist_paid' }
        ]
    }
};

const TUTORIAL_ENCOUNTERS = {
    pal_intro: {
        type: 'tutorial',
        name: "Pal's Dream",
        description: "You awaken in a shimmering dreamscape. A floating figure made of rainbow light greets you. 'Hello, Chosen Ones. I am Pal. Soon I will leave this world... but first, I must prepare you for what comes next.'",
        icon: '?',
        options: [
            { text: '"Why are you leaving?"', action: 'pal_explain' },
            { text: '"What is the prophecy?"', action: 'pal_prophecy' },
            { text: '"Let\'s begin the training."', action: 'tutorial_obstacle1' }
        ]
    },
    tutorial_obstacle1: {
        type: 'tutorial',
        name: 'The First Trial',
        description: "A shadowy obstacle manifests before you. Pal's voice echoes: 'Show me your strongest skill. Roll the die you are BEST at.'",
        icon: '?',
        dc: 8,
        tutorialPhase: 'strong_die',
        options: [
            { text: 'Face the Trial', action: 'tutorial_combat1' }
        ]
    },
    tutorial_obstacle2: {
        type: 'tutorial',
        name: 'The Second Trial',
        description: "Another obstacle appears, darker than before. Pal speaks gravely: 'Now face your weakness. Roll the die you are WORST at.'",
        icon: '!',
        dc: 15,
        forceFailure: true,
        tutorialPhase: 'weak_die',
        options: [
            { text: 'Face the Trial', action: 'tutorial_combat2' }
        ]
    },
    tutorial_intertwine: {
        type: 'tutorial',
        name: 'The Intertwining',
        description: "Pal glows brighter. 'You see? Alone, you have weaknesses. But together... you can cover for each other. Let me show you the power of INTERTWINING your fates.'",
        icon: '?',
        options: [
            { text: 'Learn Intertwining', action: 'start_intertwine' }
        ]
    },
    tutorial_final_battle: {
        type: 'tutorial',
        name: 'Shadow of Pal',
        description: "A dark version of Pal materializes. 'One final test. Work together. Use your swaps. Show me you are ready for the real world.'",
        icon: '!',
        dc: 10,
        successThresholds: { physical: 3, verbal: 3, preventative: 3 },
        attacksPerRound: 1,
        options: [
            { text: 'Fight Together!', action: 'tutorial_combat_final' }
        ]
    },
    pal_farewell: {
        type: 'tutorial',
        name: "Pal's Farewell",
        description: "Pal's form begins to fade. 'You are ready. The 20 prophecies await. 19 have failed before you... but you... you are different. Farewell, my Chosen Ones. May HOPE light your path.'",
        icon: '?',
        options: [
            { text: 'Awaken to the Real World', action: 'end_tutorial' }
        ]
    }
};

const PAL_DIALOGUE = {
    doom_appears: "You felt that, didn't you? That creeping darkness. That is DOOM. It grows with every failure, every stumble. When DOOM consumes you... the prophecy fails.",
    hope_granted: "But there is a counter to DOOM. HOPE. *Pal's light intensifies* When all seems lost, HOPE can save you from the final darkness. I grant you your first spark.",
    intertwine_explain: "Your dice are now LINKED. When one of you rolls a connected number, your ally's die activates instead. Cover each other's weaknesses. This is how you will survive."
};

const STAGE_5_ENCOUNTERS = {
    start: {
        type: 'start',
        name: 'The Rift Opens',
        description: 'Reality tears apart. You step into a dimension where the laws of probability themselves are broken.',
        icon: '?',
        options: [{ text: 'Enter the Void', action: 'leave' }]
    },
    fragment: {
        type: 'good',
        name: 'Memory Fragment',
        description: 'A shard of pure memory floats before you, containing echoes of past adventures.',
        icon: '?',
        options: [
            { text: 'Touch the Fragment', action: 'restore_die' }
        ]
    },
    echo: {
        type: 'bad',
        name: 'Echo of Failure',
        description: 'A twisted shadow of a previous prophecy champion attacks!',
        icon: '!',
        dc: 14,
        reward: 40,
        successThresholds: { physical: 2, verbal: 2, preventative: 2 },
        options: [
            { text: 'Fight the Echo', types: ['physical'], action: 'combat' },
            { text: 'Reason with It', types: ['verbal'], action: 'combat' },
            { text: 'Banish It', types: ['preventative'], action: 'combat' }
        ]
    },
    sanctuary: {
        type: 'good',
        name: 'Sanctuary Pocket',
        description: 'A bubble of calm in the chaos. Here, HOPE still exists.',
        icon: '?',
        options: [
            { text: 'Rest (+2 HOPE)', action: 'sanctuary_rest' }
        ]
    },
    void: {
        type: 'bad',
        name: 'Void Manifestation',
        description: 'Pure entropy given form. It exists only to unmake.',
        icon: '!',
        dc: 15,
        reward: 45,
        successThresholds: { physical: 3, verbal: 2, preventative: 3 },
        options: [
            { text: 'Resist!', types: ['physical'], action: 'combat' },
            { text: 'Confuse It', types: ['verbal'], action: 'combat' },
            { text: 'Shield and Endure', types: ['preventative'], action: 'combat' }
        ]
    },
    prophecy: {
        type: 'neutral',
        name: 'The 19 Darkened Lines',
        description: 'A monument showing 19 crossed-out prophecies. Yours is the 20th, still glowing.',
        icon: '?',
        options: [
            { text: 'Accept Your Destiny', action: 'accept_destiny' }
        ]
    },
    rift2: {
        type: 'good',
        name: 'Reality Tear',
        description: 'A crack in the void shows glimpses of the world you left behind.',
        icon: '?',
        options: [
            { text: 'Draw Strength (+1 HOPE)', action: 'rift_touch' }
        ]
    },
    miniboss: {
        type: 'bad',
        name: 'The 19th Champion',
        description: 'The last hero to attempt the prophecy. Now a puppet of the void.',
        icon: '!',
        dc: 15,
        reward: 60,
        successThresholds: { physical: 4, verbal: 4, preventative: 4 },
        options: [
            { text: 'Break the Chains', types: ['physical'], action: 'combat' },
            { text: 'Reach Their Soul', types: ['verbal'], action: 'combat' },
            { text: 'Free Them Gently', types: ['preventative'], action: 'combat' }
        ]
    }
};

const STAGE_FAVOR = {
    1: 0,
    2: 4,
    3: 6,
    4: 8,
    5: 10
};

const SHOP_UPGRADES = [
    // Tier 1 (Stage 2+)
    { id: 'plus2', name: '+2 to Lowest Face', tier: 1, cost: 1, effect: { type: 'upgrade_die', amount: 2 } },
    { id: 'gold25', name: '+25 Gold', tier: 1, cost: 1, effect: { type: 'gold', amount: 25 } },
    { id: 'hope1', name: '+1 Max HOPE', tier: 1, cost: 2, effect: { type: 'max_hope', amount: 1 } },
    // Tier 2 (Stage 3+)
    { id: 'plus5', name: '+5 to Lowest Face', tier: 2, cost: 2, effect: { type: 'upgrade_die', amount: 5 } },
    { id: 'hope2', name: '+2 HOPE', tier: 2, cost: 2, effect: { type: 'hope', amount: 2 } },
    { id: 'doom_minus2', name: '-2 DOOM', tier: 2, cost: 2, effect: { type: 'doom', amount: -2 } },
    // Tier 3 (Stage 4+)
    { id: 'plus3_all', name: '+3 to All Dice', tier: 3, cost: 3, effect: { type: 'upgrade_all', amount: 3 } },
    { id: 'hope3', name: '+3 HOPE', tier: 3, cost: 3, effect: { type: 'hope', amount: 3 } },
    { id: 'gold50', name: '+50 Gold', tier: 3, cost: 2, effect: { type: 'gold', amount: 50 } },
    // Tier 4 (Stage 5+)
    { id: 'plus10_best', name: '+10 to Best Die', tier: 4, cost: 4, effect: { type: 'upgrade_best', amount: 10 } },
    { id: 'hope5', name: '+5 HOPE', tier: 4, cost: 4, effect: { type: 'hope', amount: 5 } },
    { id: 'doom_minus5', name: '-5 DOOM', tier: 4, cost: 3, effect: { type: 'doom', amount: -5 } },
    { id: 'shield1', name: '+1 Max SHIELD', tier: 4, cost: 3, effect: { type: 'max_shield', amount: 1 } }
];

// Consumable items that can be purchased with gold and used during encounters
const CONSUMABLES = {
    // Defensive items
    lucky_charm: {
        id: 'lucky_charm',
        name: 'Lucky Charm',
        description: 'Reroll your last die once',
        cost: 15,
        icon: '🍀',
        effect: 'reroll'
    },
    hope_potion: {
        id: 'hope_potion',
        name: 'Hope Potion',
        description: 'Instantly gain +1 HOPE',
        cost: 20,
        icon: '🧪',
        effect: 'hope',
        amount: 1
    },
    doom_ward: {
        id: 'doom_ward',
        name: 'Doom Ward',
        description: 'Reduce DOOM by 2',
        cost: 25,
        icon: '🛡️',
        effect: 'doom_reduce',
        amount: 2
    },
    // Offensive items
    precision_oil: {
        id: 'precision_oil',
        name: 'Precision Oil',
        description: '+3 to your next roll',
        cost: 12,
        icon: '⚗️',
        effect: 'roll_bonus',
        amount: 3
    },
    fate_coin: {
        id: 'fate_coin',
        name: 'Fate Coin',
        description: 'Flip: 50% chance of +5 or -2 to next roll',
        cost: 8,
        icon: '🪙',
        effect: 'fate_flip'
    },
    // Utility items
    swap_scroll: {
        id: 'swap_scroll',
        name: 'Swap Scroll',
        description: 'Create a random swap link on any die',
        cost: 18,
        icon: '📜',
        effect: 'create_swap'
    },
    cleansing_salt: {
        id: 'cleansing_salt',
        name: 'Cleansing Salt',
        description: 'Remove one Ferryman mark from a die',
        cost: 22,
        icon: '🧂',
        effect: 'remove_mark'
    },
    merchants_blessing: {
        id: 'merchants_blessing',
        name: "Merchant's Blessing",
        description: '+15 Gold',
        cost: 10,
        icon: '💰',
        effect: 'gold',
        amount: 15
    }
};

// Exotic Dice definitions for The Trapper
const EXOTIC_DICE = [
    { id: 'd6', name: 'The d6', description: 'Faces: 1, 2, 6, 12, 19, 20',
      faces: [1,1,1,2,2,2,6,6,6,6,12,12,12,12,19,19,19,20,20,20], power: 1 },
    { id: 'lucky7', name: 'Lucky 7s', description: 'All 7s become 17s, 17s become 20s',
      faces: [1,2,3,4,5,6,17,8,9,10,11,12,13,14,15,16,20,18,19,20], power: 2 },
    { id: 'coin', name: 'The Coin Flip', description: '10 faces of 20, 10 faces of 1',
      faces: [1,1,1,1,1,1,1,1,1,1,20,20,20,20,20,20,20,20,20,20], power: 3 },
    { id: '6996', name: 'The 6996', description: 'All 6s and 9s are flipped',
      faces: [1,2,3,4,5,9,7,8,6,10,11,12,13,14,15,9,17,18,6,20], power: 7 },
    { id: 'cursed', name: 'The Cursed', description: 'One 1 becomes 20, one 20 becomes 1',
      faces: [20,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,1], power: 5 },
    { id: 'weighted', name: 'The Weighted', description: 'Only 8-15 (consistent but capped)',
      faces: [8,8,9,9,10,10,11,11,12,12,13,13,14,14,15,15,10,11,12,13], power: 6 },
    { id: 'shifter', name: 'The Shifter', description: 'Odd +3, Even -3',
      faces: [4,-1,6,1,8,3,10,5,12,7,14,9,16,11,18,13,20,15,22,17], power: 8 },
    { id: 'wildcard', name: 'The Wild Card', description: 'Every roll triggers random ally die',
      faces: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20], isWildcard: true, power: 4 }
];

// Map structure templates
const COMMON_MAP_STRUCTURE = [
    { encounter: 'start', row: 0 },
    { encounter: 'mathematician', row: 1 },
    { encounter: 'bandits', row: 1 },
    { encounter: 'alchemist', row: 2 },
    { encounter: 'ferryman', row: 2 },
    { encounter: 'priest', row: 3 },
    { encounter: 'guards', row: 3 },
    { encounter: 'miniboss', row: 4 },
    { encounter: 'trapper', row: 5 },
    { encounter: 'gambler', row: 5 },
    { encounter: 'drunkPriest', row: 6 },
    { encounter: 'cultist', row: 6 },
    { encounter: 'bandits', row: 7 },
    { encounter: 'guards', row: 7 },
    { encounter: 'boss', row: 8 }
];

const TUTORIAL_MAP_STRUCTURE = [
    { encounter: 'pal_intro', row: 0 },
    { encounter: 'tutorial_obstacle1', row: 1 },
    { encounter: 'tutorial_obstacle2', row: 2 },
    { encounter: 'tutorial_intertwine', row: 3 },
    { encounter: 'tutorial_final_battle', row: 4 },
    { encounter: 'pal_farewell', row: 5 }
];

const STAGE_5_MAP_STRUCTURE = [
    { encounter: 'start', row: 0 },
    { encounter: 'fragment', row: 1 },
    { encounter: 'echo', row: 1 },
    { encounter: 'sanctuary', row: 2 },
    { encounter: 'void', row: 2 },
    { encounter: 'prophecy', row: 3 },
    { encounter: 'miniboss', row: 4 },
    { encounter: 'rift2', row: 5 },
    { encounter: 'echo', row: 5 },
    { encounter: 'sanctuary', row: 6 },
    { encounter: 'void', row: 6 },
    { encounter: 'fragment', row: 7 },
    { encounter: 'boss', row: 8 }
];

// Save key for localStorage
const SAVE_KEY_PREFIX = 'untitledDiceGame_slot';
const SAVE_VERSION = 2;
const MAX_SAVE_SLOTS = 3;

// Legacy save key for migration
const LEGACY_SAVE_KEY = 'untitledDiceGame_save';
