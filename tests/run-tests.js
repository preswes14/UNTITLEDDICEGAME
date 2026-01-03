#!/usr/bin/env node
/**
 * UNTITLED DICE GAME - Command Line Test Runner
 *
 * Validates core game logic and data structures without a browser.
 * Run with: node tests/run-tests.js
 */

const fs = require('fs');
const path = require('path');

// Colors for terminal output
const colors = {
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    cyan: '\x1b[36m',
    reset: '\x1b[0m',
    bold: '\x1b[1m'
};

let passed = 0;
let failed = 0;
const failures = [];

function test(name, fn) {
    try {
        fn();
        passed++;
        console.log(`${colors.green}✓${colors.reset} ${name}`);
    } catch (e) {
        failed++;
        console.log(`${colors.red}✗${colors.reset} ${name}`);
        console.log(`  ${colors.red}${e.message}${colors.reset}`);
        failures.push({ name, error: e.message });
    }
}

function assert(condition, message) {
    if (!condition) throw new Error(message || 'Assertion failed');
}

function assertEqual(actual, expected, message) {
    if (actual !== expected) {
        throw new Error(`${message || 'Assertion failed'}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
    }
}

function assertExists(value, message) {
    if (value === undefined || value === null) {
        throw new Error(message || 'Value does not exist');
    }
}

function assertType(value, type, message) {
    if (typeof value !== type) {
        throw new Error(`${message || 'Type mismatch'}: expected ${type}, got ${typeof value}`);
    }
}

// Load and parse the game's JavaScript
console.log(`\n${colors.cyan}${colors.bold}UNTITLED DICE GAME - Test Suite${colors.reset}\n`);
console.log('Loading game script...\n');

const indexPath = path.join(__dirname, '..', 'index.html');
const html = fs.readFileSync(indexPath, 'utf-8');

// Extract the script content
const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>\s*<\/body>/);
if (!scriptMatch) {
    console.error(`${colors.red}Failed to extract game script from index.html${colors.reset}`);
    process.exit(1);
}

const scriptContent = scriptMatch[1];

// Create mock DOM elements and functions for Node.js environment
const mockElements = {};
const createMockElement = () => ({
    textContent: '',
    innerHTML: '',
    className: '',
    style: { display: '', cssText: '' },
    classList: {
        add: () => {},
        remove: () => {},
        contains: () => false
    },
    appendChild: () => {},
    removeChild: () => {},
    children: [],
    scrollTop: 0,
    scrollHeight: 0,
    dataset: {},
    value: '',
    onclick: null
});

global.document = {
    getElementById: (id) => {
        if (!mockElements[id]) {
            mockElements[id] = createMockElement();
        }
        return mockElements[id];
    },
    querySelector: (selector) => {
        // Return mock radio inputs
        if (selector.includes('p1physical')) return { value: 'slash' };
        if (selector.includes('p1verbal')) return { value: 'threaten' };
        if (selector.includes('p1preventative')) return { value: 'bribe' };
        if (selector.includes('p2physical')) return { value: 'stab' };
        if (selector.includes('p2verbal')) return { value: 'deceive' };
        if (selector.includes('p2preventative')) return { value: 'hide' };
        if (selector.includes('p3physical')) return { value: 'bonk' };
        if (selector.includes('p3verbal')) return { value: 'persuade' };
        if (selector.includes('p3preventative')) return { value: 'grapple' };
        if (selector.includes('.floor-info')) return createMockElement();
        if (selector.includes('[data-player')) return createMockElement();
        return mockElements['_default'] || (mockElements['_default'] = createMockElement());
    },
    querySelectorAll: () => [],
    createElement: (tag) => createMockElement(),
    addEventListener: () => {},
    removeEventListener: () => {}
};

global.window = {
    addEventListener: () => {},
    removeEventListener: () => {},
    location: { reload: () => {} }
};

global.setTimeout = (fn, ms) => fn(); // Execute immediately for tests
global.clearTimeout = () => {};
global.location = { reload: () => {} };

// Execute the game script in this context
// Wrap in function to capture variables, then expose them globally
try {
    // Replace const/let with var to make them global in eval context
    let modifiedScript = scriptContent
        .replace(/^(\s*)const /gm, '$1var ')
        .replace(/^(\s*)let /gm, '$1var ');
    eval(modifiedScript);
} catch (e) {
    console.error(`${colors.red}Script execution error: ${e.message}${colors.reset}`);
    console.error(e.stack);
    process.exit(1);
}

console.log(`${colors.cyan}Running tests...${colors.reset}\n`);

// ==================== DATA STRUCTURE TESTS ====================
console.log(`${colors.bold}Data Structures${colors.reset}`);

test('gameState exists and has correct structure', () => {
    assertExists(gameState, 'gameState should exist');
    assertExists(gameState.doom, 'gameState.doom');
    assertExists(gameState.hope !== undefined, 'gameState.hope');
    assertExists(gameState.shields !== undefined, 'gameState.shields');
    assertExists(gameState.maxHope, 'gameState.maxHope');
    assertExists(gameState.maxShields, 'gameState.maxShields');
    assert(Array.isArray(gameState.players), 'gameState.players should be array');
});

test('CHARACTER_AVATARS defined for all 3 players', () => {
    assertExists(CHARACTER_AVATARS, 'CHARACTER_AVATARS');
    assertEqual(CHARACTER_AVATARS[1].color, 'Blue', 'Player 1 = Blue');
    assertEqual(CHARACTER_AVATARS[2].color, 'Red', 'Player 2 = Red');
    assertEqual(CHARACTER_AVATARS[3].color, 'Green', 'Player 3 = Green');
});

test('DICE_TYPES has all 9 dice types', () => {
    assertExists(DICE_TYPES, 'DICE_TYPES');
    const types = ['slash', 'stab', 'bonk', 'threaten', 'deceive', 'persuade', 'bribe', 'hide', 'grapple'];
    types.forEach(t => assertExists(DICE_TYPES[t], `DICE_TYPES.${t}`));
});

test('STAGE_INFO includes Stage 0 (tutorial)', () => {
    assertExists(STAGE_INFO, 'STAGE_INFO');
    assertExists(STAGE_INFO[0], 'Stage 0 (tutorial)');
    assertEqual(STAGE_INFO[0].name, 'The Awakening', 'Stage 0 name');
});

test('BOSSES defined for stages 1-5', () => {
    assertExists(BOSSES, 'BOSSES');
    for (let i = 1; i <= 5; i++) {
        assertExists(BOSSES[i], `BOSSES[${i}]`);
        assertExists(BOSSES[i].name, `BOSSES[${i}].name`);
        assertExists(BOSSES[i].dc, `BOSSES[${i}].dc`);
    }
});

test('TUTORIAL_ENCOUNTERS has required encounters', () => {
    assertExists(TUTORIAL_ENCOUNTERS, 'TUTORIAL_ENCOUNTERS');
    const required = ['pal_intro', 'tutorial_obstacle1', 'tutorial_obstacle2', 'tutorial_intertwine', 'tutorial_final_battle', 'pal_farewell'];
    required.forEach(e => assertExists(TUTORIAL_ENCOUNTERS[e], `TUTORIAL_ENCOUNTERS.${e}`));
});

test('PAL_DIALOGUE has required entries', () => {
    assertExists(PAL_DIALOGUE, 'PAL_DIALOGUE');
    assertExists(PAL_DIALOGUE.doom_appears, 'doom_appears');
    assertExists(PAL_DIALOGUE.hope_granted, 'hope_granted');
});

// ==================== FUNCTION TESTS ====================
console.log(`\n${colors.bold}Core Functions${colors.reset}`);

test('createDie creates valid die', () => {
    const die = createDie('slash');
    assertExists(die, 'die should exist');
    assertEqual(die.type, 'slash', 'die.type');
    assertEqual(die.faces.length, 20, 'die should have 20 faces');
    assert(Array.isArray(die.swaps), 'die.swaps should be array');
});

test('addDoom increases doom', () => {
    gameState.doom = 0;
    addDoom(3);
    assertEqual(gameState.doom, 3, 'doom should be 3');
});

test('reduceDoom decreases doom', () => {
    gameState.doom = 5;
    const reduced = reduceDoom(3);
    assertEqual(gameState.doom, 2, 'doom should be 2');
    assertEqual(reduced, 3, 'should return 3');
});

test('reduceDoom floors at 0', () => {
    gameState.doom = 2;
    const reduced = reduceDoom(10);
    assertEqual(gameState.doom, 0, 'doom should floor at 0');
    assertEqual(reduced, 2, 'should return actual amount reduced');
});

test('addHope caps at maxHope', () => {
    gameState.hope = 0;
    gameState.maxHope = 1;
    addHope(5);
    assertEqual(gameState.hope, 1, 'hope should cap at 1');
});

test('useHope returns true when available', () => {
    gameState.hope = 1;
    const result = useHope();
    assertEqual(result, true, 'should return true');
    assertEqual(gameState.hope, 0, 'hope should be 0');
});

test('useHope returns false when empty', () => {
    gameState.hope = 0;
    const result = useHope();
    assertEqual(result, false, 'should return false');
});

test('addShield caps at maxShields', () => {
    gameState.shields = 0;
    gameState.maxShields = 1;
    addShield(5);
    assertEqual(gameState.shields, 1, 'shields should cap at 1');
});

test('useShield returns true when available', () => {
    gameState.shields = 1;
    const result = useShield();
    assertEqual(result, true, 'should return true');
    assertEqual(gameState.shields, 0, 'shields should be 0');
});

test('getEffectiveRoll applies DOOM penalty', () => {
    gameState.doom = 5;
    assertEqual(getEffectiveRoll(10), 5, '10 - 5 DOOM = 5');
    assertEqual(getEffectiveRoll(20), 20, 'nat 20 ignores DOOM');
    assertEqual(getEffectiveRoll(3), 1, 'should floor at 1');
});

// ==================== TUTORIAL TESTS ====================
console.log(`\n${colors.bold}Tutorial System${colors.reset}`);

test('Tutorial encounters have valid structure', () => {
    for (const [key, enc] of Object.entries(TUTORIAL_ENCOUNTERS)) {
        assertExists(enc.type, `${key}.type`);
        assertExists(enc.name, `${key}.name`);
        assertExists(enc.description, `${key}.description`);
        assertExists(enc.icon, `${key}.icon`);
        assert(Array.isArray(enc.options), `${key}.options should be array`);
        assert(enc.options.length > 0, `${key}.options should not be empty`);
    }
});

test('Combat tutorial encounters have DC', () => {
    const combats = ['tutorial_obstacle1', 'tutorial_obstacle2', 'tutorial_final_battle'];
    combats.forEach(key => {
        const enc = TUTORIAL_ENCOUNTERS[key];
        assertExists(enc.dc, `${key}.dc`);
        assertExists(enc.successThresholds, `${key}.successThresholds`);
    });
});

// ==================== INTEGRATION TESTS ====================
console.log(`\n${colors.bold}Integration${colors.reset}`);

test('Can create 3 players with dice', () => {
    gameState.players = [];
    for (let p = 1; p <= 3; p++) {
        gameState.players.push({
            id: p,
            name: `Player ${p}`,
            dice: {
                physical: createDie('slash'),
                verbal: createDie('threaten'),
                preventative: createDie('bribe')
            }
        });
    }
    assertEqual(gameState.players.length, 3, 'should have 3 players');
    gameState.players.forEach((p, i) => {
        assertExists(p.dice.physical, `player ${i+1} physical die`);
        assertExists(p.dice.verbal, `player ${i+1} verbal die`);
        assertExists(p.dice.preventative, `player ${i+1} preventative die`);
    });
});

test('Avatar lookup works for all players', () => {
    gameState.players.forEach(p => {
        const avatar = CHARACTER_AVATARS[p.id];
        assertExists(avatar, `avatar for player ${p.id}`);
        assertExists(avatar.color, `color for player ${p.id}`);
        assertExists(avatar.image, `image for player ${p.id}`);
    });
});

test('startNewGame function exists', () => {
    assertType(startNewGame, 'function', 'startNewGame should be a function');
});

// ==================== SUMMARY ====================
console.log(`\n${colors.bold}${'='.repeat(50)}${colors.reset}`);
if (failed === 0) {
    console.log(`${colors.green}${colors.bold}All ${passed} tests passed!${colors.reset}\n`);
    process.exit(0);
} else {
    console.log(`${colors.red}${colors.bold}${failed} tests failed, ${passed} passed${colors.reset}`);
    console.log(`\n${colors.yellow}Failures:${colors.reset}`);
    failures.forEach(f => console.log(`  - ${f.name}: ${f.error}`));
    console.log('');
    process.exit(1);
}
