// ==================== GAME STATE MANAGEMENT ====================

// Main game state object
const gameState = {
    gold: 0,
    doom: 0,
    hope: 0,
    maxHope: 1,
    shields: 0,
    maxShields: 1,
    currentNode: 0,
    currentStage: 0,
    encounterNumber: 0, // Track which encounter we're on in current stage
    players: [],
    map: [],
    currentEncounter: null,
    encounterState: null,
    targetDC: 10,
    canRoll: false,
    allowedDiceTypes: [],
    pendingSwapResult: null,
    tutorial: { active: false, step: 0, currentEncounter: null },
    voting: { active: false, options: [], votes: {}, round: 1, node: null },
    favor: 0,
    purchasedUpgrades: [],
    diceChanges: 0, // Track total dice modifications made
    consumables: [], // Inventory of consumable items
    currentSaveSlot: 0 // Which save slot is active (0, 1, or 2)
};

// Talent ranking state
let talentState = {
    currentPlayer: 0,
    phase: 'best', // 'best', 'worst', 'intertwine'
    playerRankings: [
        { best: null, worst: null, middle: null },
        { best: null, worst: null, middle: null },
        { best: null, worst: null, middle: null }
    ]
};

// Intertwine state
let intertwineData = {
    number: null,
    allyIndex: null,
    allyDieType: null,
    round: 1,
    usedNumbers: []
};

// Reset game state to defaults
function resetGameState() {
    gameState.gold = 0;
    gameState.doom = 0;
    gameState.hope = 0;
    gameState.maxHope = 1;
    gameState.shields = 0;
    gameState.maxShields = 1;
    gameState.currentNode = 0;
    gameState.currentStage = 0;
    gameState.encounterNumber = 0;
    gameState.players = [];
    gameState.map = [];
    gameState.currentEncounter = null;
    gameState.encounterState = null;
    gameState.targetDC = 10;
    gameState.canRoll = false;
    gameState.allowedDiceTypes = [];
    gameState.pendingSwapResult = null;
    gameState.tutorial = { active: false, step: 0, currentEncounter: null };
    gameState.voting = { active: false, options: [], votes: {}, round: 1, node: null };
    gameState.favor = 0;
    gameState.purchasedUpgrades = [];
    gameState.diceChanges = 0;
    gameState.consumables = [];
    // Note: currentSaveSlot is NOT reset - it persists across games

    // Reset talent state
    talentState = {
        currentPlayer: 0,
        phase: 'best',
        playerRankings: [
            { best: null, worst: null, middle: null },
            { best: null, worst: null, middle: null },
            { best: null, worst: null, middle: null }
        ]
    };

    // Reset intertwine state
    intertwineData = {
        number: null,
        allyIndex: null,
        allyDieType: null,
        round: 1,
        usedNumbers: []
    };
}

// Get serializable state for saving
function getSerializableState() {
    return {
        version: SAVE_VERSION,
        timestamp: Date.now(),
        gold: gameState.gold,
        doom: gameState.doom,
        hope: gameState.hope,
        maxHope: gameState.maxHope,
        shields: gameState.shields,
        maxShields: gameState.maxShields,
        currentNode: gameState.currentNode,
        currentStage: gameState.currentStage,
        encounterNumber: gameState.encounterNumber,
        diceChanges: gameState.diceChanges,
        consumables: [...gameState.consumables],
        players: gameState.players.map(p => ({
            id: p.id,
            name: p.name,
            hp: p.hp,
            dice: Object.fromEntries(
                Object.entries(p.dice).map(([key, die]) => [key, {
                    type: die.type,
                    name: die.name,
                    category: die.category,
                    icon: die.icon,
                    faces: [...die.faces],
                    baseFaces: die.baseFaces ? [...die.baseFaces] : null,
                    swaps: [...(die.swaps || [])],
                    hopeSegments: [...(die.hopeSegments || [])],
                    crossedSegments: [...(die.crossedSegments || [])],
                    lastRoll: die.lastRoll
                }])
            )
        })),
        map: gameState.map.map(node => ({
            id: node.id,
            name: node.name,
            type: node.type,
            description: node.description,
            icon: node.icon,
            encounterKey: node.encounterKey,
            row: node.row,
            status: node.status,
            connections: [...node.connections],
            dc: node.dc,
            reward: node.reward,
            successThresholds: node.successThresholds,
            options: node.options
        })),
        favor: gameState.favor,
        purchasedUpgrades: [...gameState.purchasedUpgrades],
        tutorial: { ...gameState.tutorial },
        // Save encounter state for mid-encounter resumption
        encounterState: gameState.encounterState ? { ...gameState.encounterState } : null,
        voting: gameState.voting ? { ...gameState.voting } : null
    };
}

// Restore state from saved data
function restoreFromSave(savedData) {
    // Support both old (version 1) and new (version 2) saves
    if (!savedData || (savedData.version !== SAVE_VERSION && savedData.version !== 1)) {
        console.warn('Invalid or outdated save data');
        return false;
    }

    gameState.gold = savedData.gold;
    gameState.doom = savedData.doom;
    gameState.hope = savedData.hope;
    gameState.maxHope = savedData.maxHope;
    gameState.shields = savedData.shields;
    gameState.maxShields = savedData.maxShields;
    gameState.currentNode = savedData.currentNode;
    gameState.currentStage = savedData.currentStage;
    gameState.encounterNumber = savedData.encounterNumber || 0;
    gameState.diceChanges = savedData.diceChanges || 0;
    gameState.consumables = savedData.consumables || [];
    gameState.favor = savedData.favor;
    gameState.purchasedUpgrades = savedData.purchasedUpgrades || [];
    gameState.tutorial = savedData.tutorial || { active: false, step: 0, currentEncounter: null };

    // Restore encounter state for mid-encounter resumption
    gameState.encounterState = savedData.encounterState || null;
    gameState.voting = savedData.voting || { active: false, options: [], votes: {}, round: 1, node: null };

    // Restore players
    gameState.players = savedData.players.map(p => ({
        id: p.id,
        name: p.name,
        hp: p.hp,
        dice: Object.fromEntries(
            Object.entries(p.dice).map(([key, die]) => [key, {
                type: die.type,
                name: die.name,
                category: die.category,
                icon: die.icon,
                faces: [...die.faces],
                baseFaces: die.baseFaces ? [...die.baseFaces] : null,
                swaps: [...(die.swaps || [])],
                hopeSegments: [...(die.hopeSegments || [])],
                crossedSegments: [...(die.crossedSegments || [])],
                lastRoll: die.lastRoll
            }])
        )
    }));

    // Restore map
    gameState.map = savedData.map;

    return true;
}
