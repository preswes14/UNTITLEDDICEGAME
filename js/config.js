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

// Ability-specific flavor text for combat outcomes
const ABILITY_FLAVOR = {
    slash: {
        success: ['The blade finds its mark!', 'A clean cut!', 'Steel sings!'],
        fail: ['The slash goes wide.', 'Blade meets air.', 'Too slow!'],
        crit: ['A devastating strike!', 'Blood sprays!']
    },
    stab: {
        success: ['A precise thrust!', 'The point strikes true!', 'Right between the ribs!'],
        fail: ['The stab is deflected.', 'Too shallow.', 'Armor holds.'],
        crit: ['A fatal pierce!', 'Straight through!']
    },
    bonk: {
        success: ['BONK! Right on the head!', 'A solid thwack!', 'Stars appear in their eyes!'],
        fail: ['Swing and a miss.', 'The bonk bounces off.', 'Not enough force.'],
        crit: ['MEGA BONK! They see stars!', 'Concussive impact!']
    },
    threaten: {
        success: ['They cower before you!', 'Fear takes hold.', 'Intimidation works!'],
        fail: ['They laugh at your threats.', 'Not scary enough.', 'They call your bluff.'],
        crit: ['They flee in terror!', 'Absolute dominance!']
    },
    deceive: {
        success: ['They buy the lie!', 'Fooled completely.', 'Misdirection succeeds!'],
        fail: ['They see through you.', 'Not convincing.', 'Your poker face cracks.'],
        crit: ['A masterful deception!', 'They believe everything!']
    },
    persuade: {
        success: ['Your words ring true.', 'They see reason.', 'Hearts are swayed!'],
        fail: ['Your words fall flat.', 'Unconvincing.', 'They remain unmoved.'],
        crit: ['An inspiring speech!', 'They become allies!']
    },
    bribe: {
        success: ['Gold talks!', 'The coin convinces.', 'Everyone has a price.'],
        fail: ['They refuse the gold.', 'Not enough coin.', 'Insulted by the offer.'],
        crit: ['A fortune changes hands!', 'They work for you now!']
    },
    hide: {
        success: ['You slip into shadow.', 'Unseen, unheard.', 'They look right past you.'],
        fail: ['Spotted!', 'A twig snaps.', 'You cast a shadow.'],
        crit: ['Invisible!', 'A ghost in the night!']
    },
    grapple: {
        success: ['You have them pinned!', 'A solid hold!', 'They can\'t break free!'],
        fail: ['They slip away.', 'Too slippery.', 'Your grip fails.'],
        crit: ['An unbreakable hold!', 'Completely immobilized!']
    }
};

// Helper to get random flavor text
function getAbilityFlavor(dieType, outcome) {
    const flavors = ABILITY_FLAVOR[dieType]?.[outcome];
    if (flavors && flavors.length > 0) {
        return flavors[Math.floor(Math.random() * flavors.length)];
    }
    return '';
}

const STAGE_INFO = {
    0: { name: 'The Rite', location: 'The Hideout' },
    1: { name: 'The Crossroads Inn', location: 'The Inn' },
    2: { name: 'The Guarded City', location: 'The Gates' },
    3: { name: 'The War Camp', location: 'The Front Lines' },
    4: { name: 'The Royal Court', location: 'The Throne Room' },
    5: { name: 'The Warped Dimension', location: 'Beyond Reality' }
};

// Enemy DC configuration using Total DC Sum system
// Easy: 5-10, Medium: 11-15, Hard: 16-20
const ENEMY_DC_CONFIG = {
    bandits: {
        totalDCSum: 35,
        easyRange: [5, 10],
        mediumRange: [11, 15],
        hardRange: [16, 19],
        rewardPerSuccess: 5
    },
    guards: {
        totalDCSum: 37,
        easyRange: [6, 10],
        mediumRange: [11, 15],
        hardRange: [16, 19],
        rewardPerSuccess: 10
    },
    miniboss: {
        totalDCSum: 39,
        easyRange: [7, 11],
        mediumRange: [12, 15],
        hardRange: [16, 19],
        rewardPerSuccess: 25
    },
    // Stage 5 enemies
    echo: {
        totalDCSum: 40,
        easyRange: [8, 11],
        mediumRange: [12, 15],
        hardRange: [16, 19],
        rewardPerSuccess: 15
    },
    void: {
        totalDCSum: 41,
        easyRange: [8, 12],
        mediumRange: [13, 16],
        hardRange: [16, 19],
        rewardPerSuccess: 15
    }
};

// Boss DC configuration - also uses Total DC Sum
const BOSS_DC_CONFIG = {
    1: { totalDCSum: 36, easyRange: [7, 10], mediumRange: [11, 14], hardRange: [14, 17] },
    2: { totalDCSum: 38, easyRange: [8, 11], mediumRange: [12, 14], hardRange: [15, 17] },
    3: { totalDCSum: 40, easyRange: [9, 12], mediumRange: [13, 15], hardRange: [15, 18] },
    4: { totalDCSum: 42, easyRange: [10, 13], mediumRange: [13, 16], hardRange: [16, 18] },
    5: { totalDCSum: 45, easyRange: [12, 14], mediumRange: [13, 16], hardRange: [18, 20] } // BOMB has one Nat20 DC
};

// Generate DCs using Total DC Sum system
function generateTotalDCSumDCs(config) {
    const { totalDCSum, easyRange, mediumRange, hardRange } = config;

    // Roll easy and medium within their ranges
    const easyDC = Math.floor(Math.random() * (easyRange[1] - easyRange[0] + 1)) + easyRange[0];
    const mediumDC = Math.floor(Math.random() * (mediumRange[1] - mediumRange[0] + 1)) + mediumRange[0];

    // Calculate hard DC to meet total sum
    let hardDC = totalDCSum - easyDC - mediumDC;

    // Clamp hard DC within its range
    hardDC = Math.max(hardRange[0], Math.min(hardRange[1], hardDC));

    // If clamping changed the total, adjust medium slightly
    const actualSum = easyDC + mediumDC + hardDC;
    const diff = totalDCSum - actualSum;

    // Randomly assign to approaches
    const dcs = [easyDC, mediumDC, hardDC];
    const approaches = ['physical', 'verbal', 'preventative'];

    // Shuffle approaches for random assignment
    for (let i = approaches.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [approaches[i], approaches[j]] = [approaches[j], approaches[i]];
    }

    return {
        [approaches[0]]: dcs[0],
        [approaches[1]]: dcs[1],
        [approaches[2]]: dcs[2]
    };
}

const BOSSES = {
    1: {
        name: 'Seedy Sammy',
        description: 'The innkeeper blocks the exit, eyes wild with desperation. "I\'m sorry! I had no choice - ATOM owns my debts!"',
        dcConfig: BOSS_DC_CONFIG[1],
        successThresholds: { physical: 4, verbal: 3, preventative: 2 },
        attacksPerRound: 1
    },
    2: {
        name: 'Crooked Chester',
        description: 'The young guard captain sneers, ATOM\'s sigil glinting beneath his armor. "You\'re asking too many questions about that arrow."',
        dcConfig: BOSS_DC_CONFIG[2],
        successThresholds: { physical: 5, verbal: 4, preventative: 3 },
        attacksPerRound: 1
    },
    3: {
        name: 'General Heimer',
        description: 'The war general sees you as enemy spies.',
        dcConfig: BOSS_DC_CONFIG[3],
        successThresholds: { physical: 6, verbal: 6, preventative: 5 },
        attacksPerRound: 1
    },
    4: {
        name: 'King Robert the Paranoid',
        description: 'The mad king believes you are assassins sent by his own shadow.',
        dcConfig: BOSS_DC_CONFIG[4],
        successThresholds: { physical: 7, verbal: 7, preventative: 7 },
        attacksPerRound: 1
    },
    5: {
        name: 'B.O.M.B. - The Final Prophecy',
        description: 'The manifestation of all 19 failed prophecies. This is the 20th.',
        dcConfig: BOSS_DC_CONFIG[5],
        successThresholds: { physical: 8, verbal: 10, preventative: 9 },
        attacksPerRound: 2
    }
};

const ENCOUNTERS = {
    start: {
        type: 'start',
        name: 'The Journey Begins',
        description: 'The smoke from the explosion still stings your eyes. Pal is gone. The hideout is rubble. But his last words echo: "Find the inn at the crossroads." You dust off the prophecy scroll and press forward.',
        icon: '?',
        options: [
            { text: 'Honor Pal\'s memory. Find the inn.', action: 'leave' }
        ]
    },
    mathematician: {
        type: 'good',
        name: 'The Mathematician',
        description: 'A middle-aged scholar with chalk-dusted robes adjusts his spectacles excitedly. "Astounding! According to my calculations, your dice are RIPE for optimization! Numbers are my domain - I can reshape probability itself!"',
        icon: '📐',
        options: [
            { text: 'Free Analysis (+2 to lowest)', action: 'math_free' },
            { text: 'Trade-off (-1 high, +4 low)', action: 'math_tradeoff' },
            { text: 'Sculpt 3 Faces (choose values)', action: 'math_sculpt' },
            { text: '📊 Calculation Draft (grab fast!)', action: 'math_draft' }
        ]
    },
    alchemist: {
        type: 'good',
        name: 'The Alchemist',
        description: 'A wild-eyed woman cackles over bubbling cauldrons, her fingers stained with strange chemicals. "Ohoho! Fresh dice! Fresh subjects! I can SPLICE your fates together... the bonds will be BEAUTIFUL!"',
        icon: '🧪',
        options: [
            { text: 'Safe Link (link low roll)', action: 'swap_low_to_ally' },
            { text: 'Risky Splice (random + bonus)', action: 'alchemist_risky' },
            { text: 'Double Link (both allies)', action: 'alchemist_double' },
            { text: '🧪 Potion Draft (call dibs!)', action: 'alchemist_potions' }
        ]
    },
    priest: {
        type: 'good',
        name: 'The Priest',
        description: 'A serene figure in humble robes radiates calm despite having nothing to offer but faith. "Weary travelers... I sense DOOM weighing upon you. I have little but HOPE to share - and sometimes, that is everything."',
        icon: '✨',
        options: [
            { text: 'Receive Blessing (+3 HOPE)', action: 'blessing_hope' },
            { text: 'Greater Blessing (+5 HOPE, risk mark)', action: 'blessing_greater' },
            { text: 'Bless a Segment (+1 HOPE on roll)', action: 'blessing_segment' }
        ]
    },
    gambler: {
        type: 'good',
        name: 'The Gambler',
        description: 'A flashy figure in a garish vest shuffles cards made of pure light, talking a mile a minute. "Step right up, step right up! Care to test your luck? Big bucks, no whammies! The house always wins... but maybe not TODAY, eh?"',
        icon: '🎰',
        options: [
            { text: 'Play the Range Game', action: 'gamble_range_choice' }
        ]
    },
    bandits: {
        type: 'bad',
        name: 'Bandits!',
        description: 'A group of masked thugs blocks your path. "Your gold or your lives!"',
        icon: '!',
        dcConfig: 'bandits',
        successThresholds: { physical: 2, verbal: 2, preventative: 1 },
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
        dcConfig: 'guards',
        successThresholds: { physical: 2, verbal: 1, preventative: 2 },
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
        dcConfig: 'miniboss',
        successThresholds: { physical: 3, verbal: 2, preventative: 2 },
        options: [
            { text: 'Duel!', types: ['physical'], action: 'combat' },
            { text: 'Challenge their honor', types: ['verbal'], action: 'combat' },
            { text: 'Find another way', types: ['preventative'], action: 'combat' }
        ]
    },
    ferryman: {
        type: 'neutral',
        name: 'The Ferryman',
        description: 'A towering, hooded figure waits by a dark river. Skeletal fingers extend from tattered robes. No words - only an expectant silence and the faint sound of oars on water. He will be paid. One way or another.',
        icon: '⚰️',
        vote: true,
        options: [
            { text: 'Roll for Passage (random outcome)', action: 'ferryman_roll' },
            { text: 'Pay 5 Gold (+1 HOPE, safe)', cost: 5, action: 'ferryman_paid' },
            { text: 'Wade Through (+1 DOOM)', action: 'ferryman_wade' }
        ]
    },
    trapper: {
        type: 'neutral',
        name: 'The Trapper',
        description: 'A weathered hunter with scars tells tales of impossible odds displays strange dice carved from bone and stranger things. "These ain\'t your ordinary dice. Caught \'em myself in the wild. Trade me yours, and see what fate has in store."',
        icon: '🪤',
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
        description: 'A priest stumbles out of a tavern, holy symbol askew, blessing everything in sight including a confused cat. "Blessssings! *hic* Blessings for ALL! The light *urp* shines upon... upon EVERYONE tonight!"',
        icon: '🍺',
        vote: true,
        options: [
            { text: 'Accept Blessing (random outcome)', action: 'drunk_blessing' },
            { text: 'Pay 5 Gold (guaranteed +2 HOPE)', cost: 5, action: 'drunk_paid' }
        ]
    },
    cultist: {
        type: 'neutral',
        name: 'The Cultist',
        description: 'A robed figure emerges from shadow, offering a chalice of swirling purple liquid. The ATOM sigil glints on their sleeve. "Drink, travelers... and your fates shall be BOUND together. Forever. Join us."',
        icon: '🔮',
        vote: true,
        options: [
            { text: 'Drink (random swap effect)', action: 'cultist_drink' },
            { text: 'Pay 10 Gold (guaranteed good)', cost: 10, action: 'cultist_paid' }
        ]
    },
    merchant: {
        type: 'good',
        name: 'The Merchant',
        description: 'A weathered trader with a cart full of curious wares strokes his beard thoughtfully. "Ah, adventurers! Aftermarket upgrades void the warranty, friend. But for VIRGIN dice? Untouched by magic? I can work wonders. Pay one gold per point. Simple as that."',
        icon: '💰',
        options: [
            { text: 'Browse Upgrades', action: 'merchant_browse' },
            { text: 'Spin the Wheel (5G)', action: 'merchant_wheel', cost: 5 },
            { text: 'Leave', action: 'leave' }
        ]
    }
};

const TUTORIAL_ENCOUNTERS = {
    pal_intro: {
        type: 'tutorial',
        name: "The Rite Begins",
        description: "The hideout is quiet this morning. Dusty light filters through cracks in the wooden walls. Pal shuffles in, his greying surface catching the light. He looks... tired. Worried. But when he sees you three, his face softens.",
        icon: '?',
        image: 'assets/pal.png',
        options: [
            { text: '"Good morning, Pal!"', action: 'pal_greeting' },
            { text: '"You look troubled..."', action: 'pal_troubled' },
            { text: '"What\'s happening today?"', action: 'pal_rite_explain' }
        ]
    },
    pal_greeting: {
        type: 'tutorial',
        name: "The Rite Begins",
        description: "Pal chuckles softly. 'Good morning, my little pipsqueaks. My dicelings.' He pauses, his expression flickering. 'Today is... today is the day. The Rite. If you pass, you'll be ready for real adventure.' His voice drops. 'And I fear you'll need to be.'",
        icon: '?',
        image: 'assets/pal.png',
        options: [
            { text: '"We\'re ready!"', action: 'tutorial_obstacle1' },
            { text: '"What do you mean, need to be?"', action: 'pal_atom_warning' }
        ]
    },
    pal_troubled: {
        type: 'tutorial',
        name: "The Rite Begins",
        description: "Pal sighs heavily. 'You notice too much, little ones. Yes... I've heard troubling things. ATOM stirs again. The cult that seeks to end everything.' He shakes his head. 'But that's not for today. Today is YOUR day. The Rite of Passage.'",
        icon: '?',
        image: 'assets/pal.png',
        options: [
            { text: '"What is ATOM?"', action: 'pal_atom_warning' },
            { text: '"Let\'s begin the Rite!"', action: 'tutorial_obstacle1' }
        ]
    },
    pal_rite_explain: {
        type: 'tutorial',
        name: "The Rite Begins",
        description: "'The Rite of Passage, pips! The day you prove you're ready for the world beyond these walls.' Pal straightens proudly. 'I've taught you everything I know. Now show me what you've learned.' His eyes dart to the window nervously. 'We should... we should begin quickly.'",
        icon: '?',
        image: 'assets/pal.png',
        options: [
            { text: '"Why quickly?"', action: 'pal_atom_warning' },
            { text: '"Let\'s do this!"', action: 'tutorial_obstacle1' }
        ]
    },
    pal_atom_warning: {
        type: 'tutorial',
        name: "A Warning",
        description: "Pal's voice drops to barely a whisper. 'ATOM. The Assemble The Others Movement. A doomsday cult that worships something called BOMB - a force that would unmake our world.' He grips his staff tightly. 'I've spent my life opposing them. And lately... I think they've noticed.'",
        icon: '?',
        image: 'assets/pal.png',
        options: [
            { text: '"Are we in danger?"', action: 'pal_danger_response' },
            { text: '"We\'ll protect you, Pal!"', action: 'pal_protect_response' }
        ]
    },
    pal_danger_response: {
        type: 'tutorial',
        name: "A Warning",
        description: "Pal forces a smile. 'You three? Never. I won't allow it.' He pulls something from his robes - an ancient scroll. 'But if anything happens to me... there's something you need to know. A prophecy. YOUR prophecy.' He tucks it away. 'But first - the Rite. Prove yourselves, dicelings.'",
        icon: '?',
        image: 'assets/pal.png',
        options: [
            { text: 'Begin the Rite', action: 'tutorial_obstacle1' }
        ]
    },
    pal_protect_response: {
        type: 'tutorial',
        name: "A Warning",
        description: "Pal laughs - a genuine, warm laugh. 'Protect ME? Oh, my brave little dice.' He wipes something from his eye. 'That's... that's exactly why I know you're ready. But first, you must prove it. The Rite awaits.'",
        icon: '?',
        image: 'assets/pal.png',
        options: [
            { text: 'Begin the Rite', action: 'tutorial_obstacle1' }
        ]
    },
    tutorial_obstacle1: {
        type: 'tutorial',
        name: 'Trial of Strength',
        description: "Pal conjures a shimmering training dummy. 'First trial, pipsqueaks! Show me your greatest talent. Roll the die you're BEST at - the skill you've honed above all others!'",
        icon: '?',
        image: 'assets/pal.png',
        dc: 8,
        tutorialPhase: 'strong_die',
        options: [
            { text: 'Face the Trial', action: 'tutorial_combat1' }
        ]
    },
    tutorial_obstacle2: {
        type: 'tutorial',
        name: 'Trial of Weakness',
        description: "The dummy reforms, darker and more menacing. Pal's voice grows serious. 'Now the hard part. Face your weakness. Roll the die you're WORST at. Sometimes in life, you won't have a choice.'",
        icon: '!',
        image: 'assets/pal.png',
        dc: 15,
        forceFailure: true,
        tutorialPhase: 'weak_die',
        options: [
            { text: 'Face the Trial', action: 'tutorial_combat2' }
        ]
    },
    tutorial_intertwine: {
        type: 'tutorial',
        name: 'The Secret of Intertwining',
        description: "Pal watches you struggle with approval. 'You felt it, didn't you? That creeping darkness when you fail - that's DOOM.' He gestures to all three of you. 'Alone, you have weaknesses. But TOGETHER... you can cover for each other. This is my greatest teaching: INTERTWINING your fates.'",
        icon: '?',
        image: 'assets/pal.png',
        options: [
            { text: 'Learn Intertwining', action: 'start_intertwine' }
        ]
    },
    tutorial_final_battle: {
        type: 'tutorial',
        name: 'The Final Test',
        description: "Pal raises his staff. A shadowy duplicate of himself materializes - younger, fiercer. 'One final test, dicelings. Face the echo of who I once was. Work together. Use your intertwined fates. Show me the Colors are ready!'",
        icon: '!',
        image: 'assets/pal.png',
        dc: 10,
        successThresholds: { physical: 3, verbal: 3, preventative: 3 },
        attacksPerRound: 1,
        options: [
            { text: 'Fight Together!', action: 'tutorial_combat_final' }
        ]
    },
    pal_farewell: {
        type: 'tutorial',
        name: "The Prophecy",
        description: "Pal beams with pride as the shadow fades. 'You did it. My little dice... no. My COLORS. You're ready.' He pulls out the ancient scroll, hands trembling. 'This prophecy found me 20 years ago. I spent my life trying to fulfill it... but I understand now. It was never about me.'",
        icon: '?',
        image: 'assets/pal.png',
        options: [
            { text: 'Read the Prophecy', action: 'show_prophecy' }
        ]
    },
    prophecy_reveal: {
        type: 'tutorial',
        name: "The Prophecy",
        description: "",  // Will be filled dynamically with prophecy text
        icon: '?',
        image: 'assets/pal.png',
        options: [
            { text: 'Continue...', action: 'pal_handoff' }
        ]
    },
    pal_handoff: {
        type: 'tutorial',
        name: "The Handoff",
        description: "Pal presses the scroll into your hands. 'It speaks of Colors - Red, Green, Blue. Of a Pal forgotten. Of defeating ATOM.' Tears stream down his weathered face. 'I was never meant to finish this journey. But YOU three... you ARE the prophecy.'",
        icon: '?',
        image: 'assets/pal.png',
        options: [
            { text: '"We won\'t let you down."', action: 'pal_final_moment' }
        ]
    },
    pal_final_moment: {
        type: 'tutorial',
        name: "The End of the Beginning",
        description: "Pal pulls you all into an embrace. 'I know you won't, dicelings. Now go - out the back. Start your adventure. I'll—' He freezes. Outside, footsteps. Many footsteps. 'No... not yet. NOT YET!' He shoves you toward the back door. 'RUN! Find the inn at the crossroads! GO!'",
        icon: '!',
        image: 'assets/pal.png',
        options: [
            { text: '"Pal, come with us!"', action: 'pal_sacrifice' }
        ]
    },
    pal_sacrifice: {
        type: 'tutorial',
        name: "Goodbye",
        description: "Pal stands at the door, staff raised, facing the entrance. 'This is MY part to play, Colors. The prophecy said a Pal forgotten... this is how I protect you. One last time.' He looks back, smiling through tears. 'I am... and forever shall be... your Pal.'",
        icon: '?',
        image: 'assets/pal.png',
        options: [
            { text: '...', action: 'explosion' }
        ]
    },
    explosion: {
        type: 'tutorial',
        name: "...",
        description: "The door EXPLODES inward. Through the smoke, dark figures bearing the sigil of ATOM. Pal shouts something - a curse, a prayer - and then LIGHT. Blinding, terrible light. The shockwave throws you backward through the rear exit. When you look back... the hideout is gone. Pal is gone. Only rubble and flame remain.",
        icon: '💥',
        options: [
            { text: '...', action: 'end_tutorial' }
        ]
    }
};

const PAL_DIALOGUE = {
    doom_appears: "You felt that, didn't you? That creeping darkness. That is DOOM. It grows with every failure, every stumble. When DOOM consumes you... the prophecy fails.",
    hope_granted: "But there is a counter to DOOM. HOPE. *Pal's light intensifies* When all seems lost, HOPE can save you from the final darkness. I grant you your first spark.",
    intertwine_explain: "Your dice are now LINKED. When one of you rolls a connected number, your ally's die activates instead. Cover each other's weaknesses. This is how you will survive."
};

// NPC Voice Lines - personality-driven dialogue
const NPC_VOICE_LINES = {
    mathematician: {
        greeting: [
            "Astounding! According to my calculations, you've arrived at EXACTLY the right time!",
            "Ah, fellow probability enthusiasts! Let me show you something Completely OP!",
            "The numbers don't lie - and they're telling me you need an upgrade!"
        ],
        working: [
            "Carry the one... factor in the variance...",
            "If we adjust the standard deviation HERE...",
            "Fascinating! The math checks out perfectly!"
        ],
        farewell: [
            "May your dice always roll above the median!",
            "Remember: probability is on your side! Usually!",
            "Statistically speaking, you're going to do great!"
        ]
    },
    alchemist: {
        greeting: [
            "*cackle* Fresh dice! Fresh subjects for my experiments!",
            "Ohoho! You want to SPLICE your fates together? Delicious!",
            "The bubbling grows stronger when you're near... the dice WANT this!"
        ],
        working: [
            "*mad cackling* It's WORKING! The fates are MERGING!",
            "A little chaos here... a drop of destiny there...",
            "Soon you'll be ONE! Well, not literally. That would be messy."
        ],
        farewell: [
            "Go! Go and roll your tangled fates! *maniacal laughter*",
            "When you see the links trigger, think of me! *cackle*",
            "Your dice are forever changed... and so are YOU!"
        ]
    },
    priest: {
        greeting: [
            "Weary travelers... I sense the weight of DOOM upon you.",
            "The light of HOPE shines in the darkness. Let me share it.",
            "I have little to offer but faith... and sometimes, that is everything."
        ],
        blessing: [
            "May HOPE shield you from the darkness ahead.",
            "The forces of light smile upon your journey.",
            "This blessing carries my prayers with it."
        ],
        farewell: [
            "Walk in HOPE, friends. It is your greatest weapon.",
            "Remember: even in the deepest DOOM, light persists.",
            "May your rolls be blessed and your failures few."
        ]
    },
    ferryman: {
        greeting: [
            "...",
            "*extends weathered palm*",
            "*silent stare*"
        ],
        payment: [
            "*nods slowly*",
            "*coins disappear into robes*",
            "*gestures toward boat*"
        ],
        impressed: [
            "*eyebrow raises almost imperceptibly*",
            "...Impressive.",
            "*the faintest hint of respect*"
        ],
        displeased: [
            "*cold stare intensifies*",
            "*marks something in ancient ledger*",
            "...You will regret this."
        ]
    }
};

// Gambler Voice Lines - beginning and result stubs for mix/match
const GAMBLER_LINES = {
    beginning: [
        "Step right up, step right up!",
        "Swing batter batter swing...",
        "Big bucks... no whammies...",
        "Gotta play to win, friend!",
        "Shuffle shuffle shuffle...",
        "Round and round the gambling die goes...",
        "Lady Luck's in a good mood today, I can feel it!",
        "Place your bets, place your bets!"
    ],
    result_good: [
        "YEEHAW! Congrats, bigshot!",
        "Oh, we got a lucky one over here, huh?",
        "Wow! You're on a ROLL! Get it? Haha!",
        "Winner winner chicken dinner!",
        "The house USUALLY wins, but not today!"
    ],
    result_bad: [
        "Oof, sorry pal, better luck next time!",
        "Woof. That's rough, buddy.",
        "You are the weakest link. Goodbye!",
        "The house always wins... eventually.",
        "Ouch! The dice have spoken!"
    ],
    result_neutral: [
        "Well, you didn't LOSE...",
        "Could be worse, could be better!",
        "Not bad, not bad at all!",
        "Hey, a win's a win in my book!"
    ]
};

// Loading Screen Tips - in-character advice
const LOADING_TIPS = [
    "Intertwining is powerful. Use it.",
    "There's nothing wrong with being a sidekick.",
    "High floor or high ceiling? Porque no los dos?",
    "When in doubt, roll the die you're best at.",
    "DOOM only affects DOOM rolls. Your skills remain sharp.",
    "A Natural 20 on a DOOM roll grants HOPE. Silver linings!",
    "The Ferryman remembers. Always.",
    "Three successes in a row means the enemy doesn't get to attack.",
    "Cover your allies' weaknesses with intertwined dice.",
    "HOPE can save you from a failed DOOM roll. Cherish it.",
    "The Mathematician's upgrades are always free. Math is its own reward.",
    "Some say the Alchemist used to be three people. Nobody asks anymore.",
    "Natural 1s always add DOOM. Plan accordingly.",
    "The prophecy chose you. Don't let it down.",
    "Pal believed in you. Prove him right.",
    "Gold can buy certainty at neutral encounters.",
    "Every boss has a different weakness. Adapt your approach.",
    "BOMB cycles its immunities. Stay flexible.",
    "Sometimes the preventative approach is the bravest choice.",
    "Your dice are your identity. Upgrade them wisely."
];

// Helper functions for voice lines and tips
function getRandomVoiceLine(npc, context) {
    const lines = NPC_VOICE_LINES[npc]?.[context];
    if (lines && lines.length > 0) {
        return lines[Math.floor(Math.random() * lines.length)];
    }
    return '';
}

function getRandomGamblerLine(type) {
    const lines = GAMBLER_LINES[type];
    if (lines && lines.length > 0) {
        return lines[Math.floor(Math.random() * lines.length)];
    }
    return '';
}

function getRandomLoadingTip() {
    return LOADING_TIPS[Math.floor(Math.random() * LOADING_TIPS.length)];
}

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
        dcConfig: 'echo',
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
        dcConfig: 'void',
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

// Base favor granted per stage (before gold conversion bonus)
const STAGE_FAVOR = {
    1: 0,  // Tutorial stage, no favor
    2: 3,  // Stage 2 grants 3 base favor
    3: 6,  // Stage 3 grants 6 base favor
    4: 9,  // Stage 4 grants 9 base favor
    5: 12  // Stage 5 grants 12 base favor
};

// Favor tier unlock thresholds (how much assigned favor unlocks next tier)
const FAVOR_TIER_UNLOCKS = {
    2: 3,   // Assign 3 favor to unlock 2-cost upgrades
    3: 5,   // Assign 5 favor to unlock 3-cost upgrades
    4: 8,   // Assign 8 favor to unlock 4-cost upgrades
    5: 12   // Assign 12 favor to unlock 5-cost upgrades
};

// FAVOR Shop upgrades
const FAVOR_UPGRADES = {
    // === 1 FAVOR TIER ===
    still_pretty_good: {
        id: 'still_pretty_good',
        name: 'Still Pretty Good',
        description: 'When this hero rolls a failure on their BEST die, count it as a success on their WORST die instead.',
        cost: 1,
        tier: 1,
        requiresHeroSelection: true,
        effect: { type: 'convert_best_to_worst' }
    },
    practiced_intertwiner: {
        id: 'practiced_intertwiner',
        name: 'Practiced Intertwiner',
        description: 'Intertwined rolls granted BY this hero gain +5.',
        cost: 1,
        tier: 1,
        requiresHeroSelection: true,
        effect: { type: 'intertwine_bonus_from', amount: 5 }
    },
    practiced_intertwinee: {
        id: 'practiced_intertwinee',
        name: 'Practiced Intertwinee',
        description: 'Intertwined rolls granted TO this hero gain +5.',
        cost: 1,
        tier: 1,
        requiresHeroSelection: true,
        effect: { type: 'intertwine_bonus_to', amount: 5 }
    },
    hopeful_novices: {
        id: 'hopeful_novices',
        name: 'Hopeful Novices',
        description: 'The party gains +1 Max HOPE (from 1 to 2).',
        cost: 1,
        tier: 1,
        effect: { type: 'max_hope', amount: 1 }
    },
    gear_shield: {
        id: 'gear_shield',
        name: 'Gear: Shield',
        description: 'The party starts with 1 Shield.',
        cost: 1,
        tier: 1,
        effect: { type: 'starting_shields', amount: 1 }
    },
    gear_cash: {
        id: 'gear_cash',
        name: 'Gear: Cash',
        description: 'The party starts with 5 Gold.',
        cost: 1,
        tier: 1,
        effect: { type: 'starting_gold', amount: 5 }
    },
    good_night_of_sleep: {
        id: 'good_night_of_sleep',
        name: 'Good Night of Sleep',
        description: 'The party starts with 0 DOOM instead of 1.',
        cost: 1,
        tier: 1,
        effect: { type: 'starting_doom', amount: 0 }
    },
    bunch_of_chumps: {
        id: 'bunch_of_chumps',
        name: 'Bunch of Chumps',
        description: 'Non-boss enemies in this Stage have their DCs reduced by 2.',
        cost: 1,
        tier: 1,
        effect: { type: 'dc_reduction', amount: 2 }
    },

    // === 2 FAVOR TIER ===
    shield_novices: {
        id: 'shield_novices',
        name: 'Shield Novices',
        description: 'The party gains +1 Max Shield (from 1 to 2).',
        cost: 2,
        tier: 2,
        requires: ['gear_shield'],
        effect: { type: 'max_shield', amount: 1 }
    },
    hopeful_adepts: {
        id: 'hopeful_adepts',
        name: 'Hopeful Adepts',
        description: 'The party gains +1 Max HOPE (from 2 to 3).',
        cost: 2,
        tier: 2,
        requires: ['hopeful_novices'],
        effect: { type: 'max_hope', amount: 1 }
    },
    expert_intertwiner: {
        id: 'expert_intertwiner',
        name: 'Expert Intertwiner',
        description: 'Intertwined rolls granted BY this hero negate any DOOM rolled.',
        cost: 2,
        tier: 2,
        requiresHeroSelection: true,
        effect: { type: 'intertwine_negate_doom_from' }
    },
    expert_intertwinee: {
        id: 'expert_intertwinee',
        name: 'Expert Intertwinee',
        description: 'Intertwined rolls granted TO this hero negate any DOOM rolled.',
        cost: 2,
        tier: 2,
        requiresHeroSelection: true,
        effect: { type: 'intertwine_negate_doom_to' }
    },
    one_big_chump: {
        id: 'one_big_chump',
        name: 'One Big Chump',
        description: 'The boss of this Stage has its DCs reduced by 2.',
        cost: 2,
        tier: 2,
        effect: { type: 'boss_dc_reduction', amount: 2 }
    },
    early_alchemist: {
        id: 'early_alchemist',
        name: 'Early Alchemist',
        description: 'The Alchemist appears immediately after the FAVOR shop.',
        cost: 2,
        tier: 2,
        effect: { type: 'early_encounter', encounter: 'alchemist' }
    },

    // === 3 FAVOR TIER ===
    getting_better: {
        id: 'getting_better',
        name: 'Getting Better',
        description: 'When this hero rolls a failure on their WORST die, count it as a success on their BEST die instead.',
        cost: 3,
        tier: 3,
        requiresHeroSelection: true,
        effect: { type: 'convert_worst_to_best' }
    },
    shield_adepts: {
        id: 'shield_adepts',
        name: 'Shield Adepts',
        description: 'The party gains +1 Max Shield (from 2 to 3).',
        cost: 3,
        tier: 3,
        requires: ['shield_novices'],
        effect: { type: 'max_shield', amount: 1 }
    },
    masters_of_hoping: {
        id: 'masters_of_hoping',
        name: 'Masters of Hoping',
        description: 'The party gains +1 Max HOPE (from 3 to 4).',
        cost: 3,
        tier: 3,
        requires: ['hopeful_adepts'],
        effect: { type: 'max_hope', amount: 1 }
    },
    weak_point: {
        id: 'weak_point',
        name: 'Weak Point',
        description: 'The boss of this Stage requires 1 less success of each type to win.',
        cost: 3,
        tier: 3,
        effect: { type: 'boss_threshold_reduction', amount: 1 }
    },

    // === 4 FAVOR TIER ===
    doomless: {
        id: 'doomless',
        name: 'Doomless',
        description: 'Remove DOOM from this hero\'s dice (1s no longer add DOOM).',
        cost: 4,
        tier: 4,
        requiresHeroSelection: true,
        effect: { type: 'remove_doom_from_dice' }
    },
    hopeful_intertwining: {
        id: 'hopeful_intertwining',
        name: 'Hopeful Intertwining',
        description: 'All intertwined rolls TO or FROM this hero have a 50% chance to grant +1 HOPE.',
        cost: 4,
        tier: 4,
        requiresHeroSelection: true,
        effect: { type: 'intertwine_hope_chance', chance: 0.5 }
    },
    doom_buffer: {
        id: 'doom_buffer',
        name: 'DOOM Buffer',
        description: 'Each hero rerolls the first +1 DOOM they would have otherwise rolled.',
        cost: 4,
        tier: 4,
        effect: { type: 'doom_buffer' }
    },
    masters_of_shielding: {
        id: 'masters_of_shielding',
        name: 'Masters of Shielding',
        description: 'The party gains +1 Max Shield (from 3 to 4).',
        cost: 4,
        tier: 4,
        requires: ['shield_adepts'],
        effect: { type: 'max_shield', amount: 1 }
    },

    // === 5 FAVOR TIER ===
    doomvantage: {
        id: 'doomvantage',
        name: 'DOOMvantage',
        description: 'The party gains advantage on all DOOM checks (roll twice, take better).',
        cost: 5,
        tier: 5,
        effect: { type: 'doom_advantage' }
    },
    chaotic_favor: {
        id: 'chaotic_favor',
        name: 'Chaotic Favor',
        description: 'Gain 4-9 (3+1d6) FAVOR and randomly assign it to available upgrades.',
        cost: 5,
        tier: 5,
        effect: { type: 'chaotic_favor' }
    }
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

// Save key for localStorage - separate for solo and multiplayer
const SAVE_KEY_SOLO = 'untitledDiceGame_solo';
const SAVE_KEY_MULTI = 'untitledDiceGame_multi';
const SAVE_KEY_PREFIX = 'untitledDiceGame_slot'; // Legacy, keep for migration
const SAVE_VERSION = 2;
const MAX_SAVE_SLOTS = 3;

// Game modes
const GAME_MODES = {
    SOLO: 'solo',
    MULTIPLAYER: 'multiplayer'
};

// Legacy save key for migration
const LEGACY_SAVE_KEY = 'untitledDiceGame_save';
