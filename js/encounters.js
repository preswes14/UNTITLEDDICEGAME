// ==================== ENCOUNTER HANDLING ====================

// Select a node on the map
function selectNode(nodeId) {
    const node = gameState.map[nodeId];
    if (node.status !== 'available') return;

    const currentNode = gameState.map.find(n => n.status === 'current');
    if (currentNode) currentNode.status = 'completed';

    node.status = 'current';
    gameState.currentNode = nodeId;
    gameState.currentEncounter = node;

    // Track encounter number within the stage
    gameState.encounterNumber++;

    node.connections.forEach(connId => {
        if (gameState.map[connId].status === 'locked') {
            gameState.map[connId].status = 'available';
        }
    });

    renderMap();
    showEncounter(node);
    log(`Entered: ${node.name}`, 'info');
    debouncedAutoSave();
}

// Show encounter
function showEncounter(node) {
    document.getElementById('encounterTitle').textContent = node.name;
    document.getElementById('encounterDescription').innerHTML = `<p>${node.description}</p>`;

    const typeSpan = document.getElementById('encounterType');
    typeSpan.style.display = 'inline-block';
    typeSpan.className = `encounter-type ${node.type}`;
    typeSpan.textContent = node.type.toUpperCase();

    const optionsDiv = document.getElementById('encounterOptions');
    optionsDiv.innerHTML = '';

    // Check if this is a voting encounter
    if (node.vote && node.options) {
        startVoting(node);
        return;
    }

    if (node.options) {
        node.options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            if (opt.types) btn.classList.add(opt.types[0]);
            if (opt.action.includes('swap')) btn.classList.add('swap');
            btn.textContent = opt.text;

            if (opt.cost && gameState.gold < opt.cost) {
                btn.disabled = true;
                btn.title = 'Not enough gold';
            }

            btn.onclick = () => handleOption(opt, node);
            optionsDiv.appendChild(btn);
        });
    }

    gameState.encounterState = {};
    gameState.canRoll = false;
    gameState.allowedDiceTypes = ['physical', 'verbal', 'preventative'];
    renderDiceTray();
}

// Start voting for an encounter
function startVoting(node) {
    // In solo mode, skip voting — just show options directly
    if (gameState.gameMode === 'solo') {
        const optionsDiv = document.getElementById('encounterOptions');
        optionsDiv.innerHTML = '';
        node.options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            if (opt.types) btn.classList.add(opt.types[0]);
            btn.textContent = opt.text;
            if (opt.cost && gameState.gold < opt.cost) {
                btn.disabled = true;
                btn.title = 'Not enough gold';
            }
            btn.onclick = () => handleOption(opt, node);
            optionsDiv.appendChild(btn);
        });
        return;
    }

    gameState.voting = {
        active: true,
        options: node.options,
        votes: {},
        round: 1,
        node: node
    };
    renderVotingUI();
}

// Cast a vote
function castVote(playerIdx, optionIdx) {
    gameState.voting.votes[playerIdx] = optionIdx;
    log(`${gameState.players[playerIdx].name} voted!`, 'info');

    const voteCount = Object.keys(gameState.voting.votes).length;
    if (voteCount >= gameState.players.length) {
        resolveVote();
    } else {
        renderVotingUI();
    }
}

// Resolve voting
function resolveVote() {
    const v = gameState.voting;

    const counts = {};
    Object.values(v.votes).forEach(optIdx => {
        counts[optIdx] = (counts[optIdx] || 0) + 1;
    });

    const maxVotes = Math.max(...Object.values(counts));
    const winners = Object.keys(counts).filter(k => counts[k] === maxVotes);

    if (winners.length === 1) {
        const winningOption = v.options[parseInt(winners[0])];
        log(`Vote passed: "${winningOption.text}"`, 'success');
        gameState.voting.active = false;
        handleOption(winningOption, v.node);
    } else if (v.round === 1) {
        log('Tie! Vote again...', 'info');
        v.round = 2;
        v.votes = {};
        renderVotingUI();
    } else {
        const randomWinner = winners[Math.floor(Math.random() * winners.length)];
        const winningOption = v.options[parseInt(randomWinner)];
        log(`Tie broken randomly: "${winningOption.text}"`, 'info');
        gameState.voting.active = false;
        handleOption(winningOption, v.node);
    }
}

// Encounter option dispatch map — maps action strings to handler functions
const OPTION_HANDLERS = {
    leave: () => completeEncounter(),
    combat: (option, node) => startCombat(option, node),
    upgrade_plus1: () => showUpgradeModal(1),
    upgrade_plus2: () => showUpgradeModal(2),
    math_free: () => showUpgradeModal(2),
    upgrade_plus3: (option) => { if (spendGold(option.cost)) showUpgradeModal(3); },
    upgrade_plus5: (option) => { if (spendGold(option.cost)) showUpgradeModal(5); },
    swap_low_to_ally: () => showSwapModal('low'),
    swap_high_to_ally: (option) => { if (spendGold(option.cost)) showSwapModal('high'); },
    blessing_hope: () => {
        addHope(3);
        log('The priest\'s blessing fills you with HOPE!', 'hope');
        completeEncounter();
    },
    blessing_greater: () => {
        addHope(5);
        const randomP = gameState.players[Math.floor(Math.random() * 3)];
        const randomDie = Object.values(randomP.dice)[Math.floor(Math.random() * 3)];
        const markValue = Math.floor(Math.random() * 10) + 6;
        randomDie.crossedSegments.push(markValue);
        log(`Greater blessing! +5 HOPE, but ${randomP.name}'s ${randomDie.name} is marked.`, 'hope');
        completeEncounter();
    },
    math_tradeoff: () => showMathTradeoffModal(),
    math_sculpt: () => showSculptFacesModal(),
    alchemist_risky: () => showRiskySwapModal(),
    gamble_range: () => {
        const rangeStart = Math.floor(Math.random() * 8) + 5;
        const rangeEnd = rangeStart + Math.floor(Math.random() * 5) + 3;
        gameState.canRoll = true;
        gameState.encounterState = {
            type: 'gamble',
            rangeMin: rangeStart,
            rangeMax: Math.min(rangeEnd, 18),
            inRangeReward: 5,
            outRangeReward: 2
        };
        document.getElementById('encounterDescription').innerHTML = `
            <p>The Gambler spins the wheel...</p>
            <div style="margin-top:20px; padding:15px; background:rgba(255,215,0,0.15); border-radius:10px; border-left:4px solid #ffd700;">
                <h3 style="color:#ffd700;">Target Range: ${rangeStart} - ${Math.min(rangeEnd, 18)}</h3>
                <p><strong>IN RANGE:</strong> +5 to segment of choice!</p>
                <p><strong>OUT OF RANGE:</strong> +2 to random segment</p>
            </div>
            <p style="margin-top:15px; color:#88ccff;">Roll any die!</p>
        `;
        document.getElementById('encounterOptions').innerHTML = '';
        renderDiceTray();
    },
    ferryman_roll: () => handleFerrymanRoll(),
    ferryman_paid: () => {
        if (spendGold(5)) {
            addHope(1);
            log('The Ferryman takes your gold and nods. "The river blesses you." +1 HOPE', 'hope');
            completeEncounter();
        } else {
            log('Not enough gold! You need 5G.', 'fail');
        }
    },
    ferryman_wade: () => {
        addDoom(1, 'The cold waters chill your spirit');
        log('You wade through the shallows safely, though the cold seeps into your bones.', 'info');
        completeEncounter();
    },
    trapper_trade: () => showTrapperTrade(),
    trapper_exotic: () => showExoticDiceTrade(),
    trapper_paid: () => {
        if (spendGold(8)) {
            showTrapperPaidTrade();
        } else {
            log('Not enough gold! You need 8G.', 'fail');
        }
    },
    drunk_blessing: () => handleDrunkBlessing(),
    drunk_paid: () => {
        if (spendGold(5)) {
            addHope(2);
            log('The priest focuses intently. "BLESSINGS!" A powerful blessing lands. +2 HOPE!', 'hope');
            completeEncounter();
        } else {
            log('Not enough gold! You need 5G.', 'fail');
        }
    },
    cultist_drink: () => handleCultistDrink(),
    cultist_paid: () => {
        if (spendGold(10)) {
            handleCultistPaid();
        } else {
            log('Not enough gold! You need 10G.', 'fail');
        }
    },
    blessing_segment: () => showBlessSegmentModal(),
    alchemist_double: () => showDoubleLinkModal(),
    alchemist_potions: () => showAlchemistPotions(),
    math_draft: () => showMathematicianOptions(),
    gamble_range_choice: () => showGambleRangeChoice(),
    boss_combat: (option, node) => startBossCombat(option, node),
    restore_die: () => {
        const randomPlayer = gameState.players[Math.floor(Math.random() * 3)];
        const dieTypes = ['physical', 'verbal', 'preventative'];
        const randomDieType = dieTypes[Math.floor(Math.random() * 3)];
        const randomDie = randomPlayer.dice[randomDieType];
        const oneIdx = randomDie.faces.indexOf(1);
        if (oneIdx !== -1) {
            randomDie.faces[oneIdx] = clampFace(Math.floor(Math.random() * 6) + 5);
            log(`${randomPlayer.name}'s ${randomDie.name} is partially restored! 1 -> ${randomDie.faces[oneIdx]}`, 'success');
            trackDiceChange();
        } else {
            log('The fragment pulses but finds nothing to heal.', 'info');
        }
        completeEncounter();
    },
    sanctuary_rest: () => {
        addHope(1);
        log('A moment of peace in the chaos. The party gathers strength. +1 HOPE', 'success');
        completeEncounter();
    },
    accept_destiny: () => {
        addHope(2);
        log('You are the chosen ones. The 20th prophecy will succeed. +2 HOPE', 'crit');
        completeEncounter();
    },
    rift_touch: () => {
        addHope(1);
        log('Warmth flows through the tear. You feel hope. +1 HOPE', 'hope');
        completeEncounter();
    },
    merchant_browse: () => showMerchantBrowse(),
    merchant_wheel: () => {
        if (spendGold(5)) {
            showMerchantWheel();
        } else {
            log('Not enough gold! You need 5G.', 'fail');
        }
    }
};

// Handle encounter option via dispatch map
function handleOption(option, node) {
    const handler = OPTION_HANDLERS[option.action];
    if (handler) {
        handler(option, node);
    } else {
        console.warn('Unknown encounter action:', option.action);
    }
}

// Handle Ferryman roll
function handleFerrymanRoll() {
    const outcome = getNeutralOutcome();

    const modal = document.getElementById('upgradeModal');
    document.getElementById('upgradeTitle').textContent = 'The Ferryman\'s Judgment';

    if (outcome === 'good') {
        document.getElementById('upgradeDescription').textContent =
            'The waters glow with approval! The Ferryman smiles. "The river blesses you."';
        addHope(1);
        log('The Ferryman grants safe passage with the river\'s blessing! +1 HOPE', 'hope');
    } else if (outcome === 'neutral') {
        document.getElementById('upgradeDescription').textContent =
            'The Ferryman nods. "The river accepts. You may pass." Nothing more, nothing less.';
        log('Safe passage granted. The river remains indifferent.', 'info');
    } else {
        document.getElementById('upgradeDescription').textContent =
            'The river churns darkly. "A toll must be paid..." One of your dice bears the Ferryman\'s mark.';

        const randomPlayer = gameState.players[Math.floor(Math.random() * 3)];
        const dieTypes = ['physical', 'verbal', 'preventative'];
        const randomDieType = dieTypes[Math.floor(Math.random() * 3)];
        const die = randomPlayer.dice[randomDieType];

        const crossedFace = Math.floor(Math.random() * 14) + 5; // Range 5-18
        die.crossedSegments = die.crossedSegments || [];
        die.crossedSegments.push(crossedFace);

        log(`${randomPlayer.name}'s ${die.name} is marked! Rolling ${crossedFace} triggers +2 DOOM (once).`, 'fail');
    }

    const options = document.getElementById('upgradeOptions');
    options.innerHTML = '<div class="upgrade-option" onclick="document.getElementById(\'upgradeModal\').classList.remove(\'show\'); completeEncounter();"><h4>Continue</h4></div>';
    modal.classList.add('show');
}

// Handle Drunk Priest blessing
function handleDrunkBlessing() {
    const outcome = getNeutralOutcome();

    if (outcome === 'good') {
        const hopeGain = Math.floor(Math.random() * 2) + 1; // 1-2 HOPE
        addHope(hopeGain);
        log(`The blessing lands true! +${hopeGain} HOPE! The drunk priest winks.`, 'hope');

        const randomPlayer = gameState.players[Math.floor(Math.random() * gameState.players.length)];
        const dieTypes = ['physical', 'verbal', 'preventative'];
        const randomDieType = dieTypes[Math.floor(Math.random() * dieTypes.length)];
        const die = randomPlayer.dice[randomDieType];
        const segmentToHope = Math.floor(Math.random() * 10) + 6;
        die.hopeSegments = die.hopeSegments || [];
        die.hopeSegments.push(segmentToHope);
        log(`${die.name} blessed! Rolling ${segmentToHope} grants +1 HOPE`, 'hope');

    } else if (outcome === 'neutral') {
        const amount = Math.floor(Math.random() * 2) + 1; // 1-2 each
        addHope(amount);
        addDoom(amount, 'Blessing side effect');
        log(`Mixed blessing... +${amount} HOPE but also +${amount} DOOM. It balances out.`, 'info');

    } else {
        const doomGain = Math.floor(Math.random() * 2) + 2; // 2-3 DOOM, no HOPE
        addDoom(doomGain, 'Sloppy blessing went wrong');
        log(`The blessing goes awry! +${doomGain} DOOM... the priest hiccups apologetically.`, 'fail');
    }

    completeEncounter();
}

// Handle Cultist drink
function handleCultistDrink() {
    const outcome = getNeutralOutcome();

    const randomPlayer = gameState.players[Math.floor(Math.random() * gameState.players.length)];
    const dieTypes = ['physical', 'verbal', 'preventative'];
    const randomDieType = dieTypes[Math.floor(Math.random() * dieTypes.length)];
    const die = randomPlayer.dice[randomDieType];

    if (outcome === 'good') {
        createRandomSwap(randomPlayer, die);

        const minVal = Math.min(...die.faces);
        const minIdx = die.faces.indexOf(minVal);
        die.faces[minIdx] = clampFace(minVal + 5);

        log(`The cosmic bond empowers you! ${die.name} lowest face ${minVal} -> ${die.faces[minIdx]}`, 'crit');
        log('Your fates are intertwined with your allies!', 'success');

    } else if (outcome === 'neutral') {
        createRandomSwap(randomPlayer, die);
        log(`The drink takes hold... ${randomPlayer.name}'s ${die.name} is now linked to an ally.`, 'info');

    } else {
        const highFace = Math.floor(Math.random() * 5) + 15;
        const allyIdx = (gameState.players.indexOf(randomPlayer) + 1) % 3;
        const ally = gameState.players[allyIdx];
        const allyDieType = dieTypes[Math.floor(Math.random() * dieTypes.length)];

        die.swaps = die.swaps || [];
        die.swaps.push({
            faceValue: highFace,
            targetPlayer: allyIdx,
            targetDieType: allyDieType
        });

        addDoom(1, 'Cosmic backlash');
        log(`The drink sours... Rolling ${highFace} on ${die.name} now triggers ${ally.name}'s ${ally.dice[allyDieType].name}!`, 'fail');
        log('+1 DOOM from cosmic backlash.', 'fail');
    }

    renderDiceTray();
    completeEncounter();
}

// Handle Cultist paid option
function handleCultistPaid() {
    const randomPlayer = gameState.players[Math.floor(Math.random() * gameState.players.length)];
    const dieTypes = ['physical', 'verbal', 'preventative'];
    const randomDieType = dieTypes[Math.floor(Math.random() * dieTypes.length)];
    const die = randomPlayer.dice[randomDieType];

    createRandomSwap(randomPlayer, die);

    const minVal = Math.min(...die.faces);
    const minIdx = die.faces.indexOf(minVal);
    die.faces[minIdx] += 5;

    log(`The sacred herb reveals pure visions! ${die.name} lowest face ${minVal} -> ${minVal + 5}`, 'crit');
    log('Your fates are intertwined with your allies!', 'success');

    renderDiceTray();
    completeEncounter();
}

// Show math tradeoff modal
function showMathTradeoffModal() {
    const modal = document.getElementById('upgradeModal');
    document.getElementById('upgradeTitle').textContent = 'Advanced Mathematics';
    document.getElementById('upgradeDescription').textContent = 'Sacrifice -1 from highest face to gain +4 on lowest:';

    const options = document.getElementById('upgradeOptions');
    options.innerHTML = '';

    gameState.players.forEach((player, pIdx) => {
        Object.entries(player.dice).forEach(([type, die]) => {
            const minVal = Math.min(...die.faces);
            const maxVal = Math.max(...die.faces);
            const opt = document.createElement('div');
            opt.className = 'upgrade-option';
            opt.innerHTML = `
                <h4>${player.name}'s ${die.name}</h4>
                <p>High: ${maxVal} -> ${maxVal - 1}</p>
                <p>Low: ${minVal} -> ${minVal + 4}</p>
            `;
            opt.onclick = () => {
                const maxIdx = die.faces.indexOf(maxVal);
                const minIdx = die.faces.indexOf(minVal);
                die.faces[maxIdx] = clampFace(maxVal - 1);
                die.faces[minIdx] = clampFace(minVal + 4);
                log(`${player.name}'s ${die.name}: ${maxVal}->${die.faces[maxIdx]}, ${minVal}->${die.faces[minIdx]}!`, 'success');
                modal.classList.remove('show');
                renderDiceTray();
                completeEncounter();
            };
            options.appendChild(opt);
        });
    });

    modal.classList.add('show');
}

// Show sculpt faces modal
function showSculptFacesModal() {
    const modal = document.getElementById('upgradeModal');
    document.getElementById('upgradeTitle').textContent = 'Sculpt Die Faces';
    document.getElementById('upgradeDescription').innerHTML = `
        <p>The Mathematician can reshape 3 faces of a die to specific values.</p>
        <p style="color:#ffd700; margin-top:5px;">Choose a die, then pick 3 new face values!</p>
    `;

    const options = document.getElementById('upgradeOptions');
    options.innerHTML = '';

    gameState.players.forEach((player, pIdx) => {
        Object.entries(player.dice).forEach(([type, die]) => {
            const opt = document.createElement('div');
            opt.className = 'upgrade-option';
            opt.innerHTML = `
                <h4>${player.name}'s ${die.name}</h4>
                <p>Current range: ${Math.min(...die.faces)} - ${Math.max(...die.faces)}</p>
            `;
            opt.onclick = () => showSculptValuePicker(player, die, modal);
            options.appendChild(opt);
        });
    });

    modal.classList.add('show');
}

// Show sculpt value picker
function showSculptValuePicker(player, die, modal) {
    document.getElementById('upgradeTitle').textContent = `Sculpting ${player.name}'s ${die.name}`;
    document.getElementById('upgradeDescription').innerHTML = `
        <p>Choose 3 values. The 3 lowest faces will be replaced with these values.</p>
        <p style="color:#aaa; font-size:0.9em;">Current lowest 3: ${die.faces.slice().sort((a,b)=>a-b).slice(0,3).join(', ')}</p>
    `;

    const options = document.getElementById('upgradeOptions');
    options.innerHTML = '';

    const presets = [
        { name: 'The Climber', values: [5, 10, 15], desc: 'Consistent stepping stones' },
        { name: 'The Gambit', values: [1, 10, 20], desc: 'High risk, high reward' },
        { name: 'The Safe Bet', values: [8, 9, 10], desc: 'Reliably hit DC 10' },
        { name: 'The Crit Fisher', values: [17, 18, 19], desc: 'Chase those crits!' },
        { name: 'The d6 Special', values: [6, 12, 19], desc: 'Like the exotic d6' }
    ];

    presets.forEach(preset => {
        const btn = document.createElement('div');
        btn.className = 'upgrade-option';
        btn.innerHTML = `
            <h4>${preset.name}</h4>
            <p>${preset.values.join(', ')}</p>
            <p style="font-size:0.85em; color:#888;">${preset.desc}</p>
        `;
        btn.onclick = () => applySculpting(die, preset.values, player.name, modal);
        options.appendChild(btn);
    });
}

// Apply sculpting to die
function applySculpting(die, newValues, playerName, modal) {
    const sortedWithIdx = die.faces.map((v, i) => ({ v, i })).sort((a, b) => a.v - b.v);
    const lowestThreeIdx = sortedWithIdx.slice(0, 3).map(x => x.i);

    lowestThreeIdx.forEach((faceIdx, i) => {
        die.faces[faceIdx] = newValues[i];
    });

    log(`${die.name} sculpted! New faces: ${newValues.join(', ')}`, 'success');
    trackDiceChange(3); // 3 faces modified
    modal.classList.remove('show');
    renderDiceTray();
    completeEncounter();
}

// Show risky swap modal
function showRiskySwapModal() {
    const modal = document.getElementById('upgradeModal');
    document.getElementById('upgradeTitle').textContent = 'Risky Alchemy';
    document.getElementById('upgradeDescription').textContent = 'Link a random segment to an ally, but get +2 bonus:';

    const options = document.getElementById('upgradeOptions');
    options.innerHTML = '';

    gameState.players.forEach((player, pIdx) => {
        Object.entries(player.dice).forEach(([type, die]) => {
            const opt = document.createElement('div');
            opt.className = 'upgrade-option';
            opt.innerHTML = `
                <h4>${player.name}'s ${die.name}</h4>
                <p>Random swap + immediate +2</p>
            `;
            opt.onclick = () => {
                const swapValue = Math.floor(Math.random() * 15) + 3;
                const otherPlayers = gameState.players.filter((_, i) => i !== pIdx);
                const targetPlayer = otherPlayers[Math.floor(Math.random() * otherPlayers.length)];
                const targetDieTypes = Object.keys(targetPlayer.dice);
                const targetDieType = targetDieTypes[Math.floor(Math.random() * targetDieTypes.length)];

                die.swaps.push({
                    faceValue: swapValue,
                    targetPlayer: gameState.players.indexOf(targetPlayer),
                    targetDieType: targetDieType
                });

                const minIdx = die.faces.indexOf(Math.min(...die.faces));
                die.faces[minIdx] = clampFace(die.faces[minIdx] + 2);

                log(`Risky splice! ${swapValue} on ${die.name} -> ${targetPlayer.name}'s ${targetPlayer.dice[targetDieType].name}, plus +2!`, 'success');
                modal.classList.remove('show');
                renderDiceTray();
                completeEncounter();
            };
            options.appendChild(opt);
        });
    });

    modal.classList.add('show');
}

// Show Trapper trade
function showTrapperTrade() {
    const modal = document.getElementById('upgradeModal');
    document.getElementById('upgradeTitle').textContent = 'The Trapper\'s Trade';
    document.getElementById('upgradeDescription').textContent = 'Choose a die to trade its lowest face for a mystery value:';

    const options = document.getElementById('upgradeOptions');
    options.innerHTML = '';

    gameState.players.forEach((player, pIdx) => {
        Object.entries(player.dice).forEach(([type, die]) => {
            const minVal = Math.min(...die.faces);
            const opt = document.createElement('div');
            opt.className = 'upgrade-option';
            opt.innerHTML = `
                <h4>${player.name}'s ${die.name}</h4>
                <p>Trade away: ${minVal}</p>
            `;
            opt.onclick = () => {
                const minIdx = die.faces.indexOf(minVal);
                const outcome = getNeutralOutcome();
                let newVal;

                if (outcome === 'good') {
                    newVal = Math.min(20, minVal + 5 + Math.floor(Math.random() * (16 - minVal)));
                    log(`Great trade! ${die.name}: ${minVal} -> ${newVal}`, 'crit');
                } else if (outcome === 'neutral') {
                    newVal = Math.max(1, Math.min(20, minVal + Math.floor(Math.random() * 6) - 2));
                    log(`Fair trade. ${die.name}: ${minVal} -> ${newVal}`, 'info');
                } else {
                    newVal = minVal > 1 ? Math.floor(Math.random() * (minVal - 1)) + 1 : 1;
                    log(`Bad trade... ${die.name}: ${minVal} -> ${newVal}`, 'fail');
                }

                die.faces[minIdx] = newVal;
                trackDiceChange();
                modal.classList.remove('show');
                renderDiceTray();
                completeEncounter();
            };
            options.appendChild(opt);
        });
    });

    modal.classList.add('show');
}

// Show exotic dice trade
function showExoticDiceTrade() {
    const shuffled = [...EXOTIC_DICE];
    shuffleArray(shuffled);
    const offered = shuffled.slice(0, 3).sort((a, b) => a.power - b.power);

    const modal = document.getElementById('upgradeModal');
    document.getElementById('upgradeTitle').textContent = 'The Trapper\'s Exotic Dice';
    document.getElementById('upgradeDescription').innerHTML = `
        <p>Trade one of your dice for an exotic one. The more powerful the exotic die, the stronger YOUR die must be to trade.</p>
        <p style="color:#ffd700; margin-top:10px;">Best die = Most powerful exotic | Middle die = Medium exotic | Worst die = Weak exotic</p>
    `;

    const options = document.getElementById('upgradeOptions');
    options.innerHTML = '';

    const diceRow = document.createElement('div');
    diceRow.style.cssText = 'display:flex; gap:15px; margin:20px 0; justify-content:center; flex-wrap:wrap;';

    offered.forEach((exotic, idx) => {
        const tier = idx === 0 ? 'WEAK (trade worst die)' : idx === 1 ? 'MEDIUM (trade middle die)' : 'POWERFUL (trade best die)';
        const tierColor = idx === 0 ? '#888' : idx === 1 ? '#88ccff' : '#ffd700';

        const card = document.createElement('div');
        card.style.cssText = `padding:15px; background:rgba(255,255,255,0.08); border-radius:10px; text-align:center; min-width:150px; border:2px solid ${tierColor};`;
        card.innerHTML = `
            <h4 style="color:${tierColor};">${exotic.name}</h4>
            <p style="font-size:0.9em; color:#aaa;">${exotic.description}</p>
            <p style="font-size:0.8em; color:${tierColor}; margin-top:8px;">${tier}</p>
        `;
        diceRow.appendChild(card);
    });
    options.appendChild(diceRow);

    gameState.players.forEach((player, pIdx) => {
        const playerDiv = document.createElement('div');
        playerDiv.style.cssText = 'margin-top:15px; padding:10px; background:rgba(255,255,255,0.05); border-radius:8px;';
        playerDiv.innerHTML = `<strong style="color:#88ccff;">${player.name}'s Dice:</strong>`;

        const diceRanked = Object.entries(player.dice).map(([type, die]) => ({
            type, die,
            avgValue: die.faces.reduce((a,b) => a+b, 0) / die.faces.length
        })).sort((a, b) => a.avgValue - b.avgValue);

        const btnRow = document.createElement('div');
        btnRow.style.cssText = 'display:flex; gap:10px; margin-top:8px; flex-wrap:wrap;';

        diceRanked.forEach((ranked, rankIdx) => {
            const exoticToGet = offered[rankIdx];
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.style.cssText = 'flex:1; min-width:120px;';
            btn.innerHTML = `Trade ${ranked.die.name}<br><small>-> ${exoticToGet.name}</small>`;
            btn.onclick = () => {
                ranked.die.faces = [...exoticToGet.faces];
                if (exoticToGet.isWildcard) {
                    // Clear existing swaps before adding wildcard swaps
                    ranked.die.swaps = [];
                    for (let i = 1; i <= 20; i++) {
                        ranked.die.swaps.push({
                            faceValue: i,
                            targetPlayer: (pIdx + 1 + Math.floor(Math.random() * 2)) % 3,
                            targetDieType: ['physical','verbal','preventative'][Math.floor(Math.random() * 3)]
                        });
                    }
                }
                log(`${player.name} trades ${ranked.die.name} for ${exoticToGet.name}!`, 'success');
                trackDiceChange(20); // Complete die replacement
                modal.classList.remove('show');
                renderDiceTray();
                completeEncounter();
            };
            btnRow.appendChild(btn);
        });

        playerDiv.appendChild(btnRow);
        options.appendChild(playerDiv);
    });

    const leaveBtn = document.createElement('button');
    leaveBtn.className = 'option-btn';
    leaveBtn.style.marginTop = '20px';
    leaveBtn.textContent = 'Leave without trading';
    leaveBtn.onclick = () => {
        modal.classList.remove('show');
        completeEncounter();
    };
    options.appendChild(leaveBtn);

    modal.classList.add('show');
}

// Show Trapper paid trade
function showTrapperPaidTrade() {
    const modal = document.getElementById('upgradeModal');
    document.getElementById('upgradeTitle').textContent = 'The Trapper\'s Premium Collection';
    document.getElementById('upgradeDescription').textContent = 'Choose a die - its lowest face gets +6 to +10:';

    const options = document.getElementById('upgradeOptions');
    options.innerHTML = '';

    gameState.players.forEach((player, pIdx) => {
        Object.entries(player.dice).forEach(([type, die]) => {
            const minVal = Math.min(...die.faces);
            const opt = document.createElement('div');
            opt.className = 'upgrade-option';
            opt.innerHTML = `
                <h4>${player.name}'s ${die.name}</h4>
                <p>Upgrade: ${minVal}</p>
            `;
            opt.onclick = () => {
                const minIdx = die.faces.indexOf(minVal);
                const bonus = Math.floor(Math.random() * 5) + 6;
                const newVal = Math.min(20, minVal + bonus);
                die.faces[minIdx] = newVal;
                log(`Premium trade! ${die.name}: ${minVal} -> ${newVal} (+${bonus})`, 'crit');
                trackDiceChange();
                modal.classList.remove('show');
                renderDiceTray();
                completeEncounter();
            };
            options.appendChild(opt);
        });
    });

    modal.classList.add('show');
}

// Show bless segment modal
function showBlessSegmentModal() {
    const modal = document.getElementById('upgradeModal');
    document.getElementById('upgradeTitle').textContent = 'Bless a Segment';
    document.getElementById('upgradeDescription').textContent = 'Choose a die segment. When that number is rolled, you gain +1 HOPE!';

    const options = document.getElementById('upgradeOptions');
    options.innerHTML = '';

    gameState.players.forEach((player, pIdx) => {
        Object.entries(player.dice).forEach(([type, die]) => {
            const opt = document.createElement('div');
            opt.className = 'upgrade-option';
            opt.innerHTML = `
                <h4>${player.name}'s ${die.name}</h4>
                <p>Add HOPE to a segment</p>
            `;
            opt.onclick = () => showSegmentPicker(player, die, modal);
            options.appendChild(opt);
        });
    });

    modal.classList.add('show');
}

// Show segment picker
function showSegmentPicker(player, die, modal) {
    document.getElementById('upgradeDescription').textContent = `Choose a number (6-15) on ${player.name}'s ${die.name} to bless:`;
    const options = document.getElementById('upgradeOptions');
    options.innerHTML = '';

    const numRow = document.createElement('div');
    numRow.style.cssText = 'display:flex; gap:8px; flex-wrap:wrap; justify-content:center;';

    for (let i = 6; i <= 15; i++) {
        const btn = document.createElement('button');
        btn.className = 'number-btn';
        btn.textContent = i;
        btn.onclick = () => {
            die.hopeSegments = die.hopeSegments || [];
            die.hopeSegments.push(i);
            log(`${die.name} blessed! Rolling ${i} grants +1 HOPE`, 'hope');
            modal.classList.remove('show');
            completeEncounter();
        };
        numRow.appendChild(btn);
    }
    options.appendChild(numRow);
}

// Show double link modal
function showDoubleLinkModal() {
    const modal = document.getElementById('upgradeModal');
    document.getElementById('upgradeTitle').textContent = 'Double Link';
    document.getElementById('upgradeDescription').textContent = 'Choose a die to link to BOTH allies! Pick a low number for each ally.';

    const options = document.getElementById('upgradeOptions');
    options.innerHTML = '';

    gameState.players.forEach((player, pIdx) => {
        Object.entries(player.dice).forEach(([type, die]) => {
            const opt = document.createElement('div');
            opt.className = 'upgrade-option';
            opt.innerHTML = `
                <h4>${player.name}'s ${die.name}</h4>
                <p>Create double link</p>
            `;
            opt.onclick = () => {
                const otherPlayers = gameState.players.filter((_, i) => i !== pIdx);
                const lowNumbers = [2, 3, 4, 5];

                otherPlayers.forEach((ally, i) => {
                    const faceValue = lowNumbers[i * 2] || lowNumbers[0];
                    const allyDieType = ['physical', 'verbal', 'preventative'][Math.floor(Math.random() * 3)];
                    die.swaps.push({
                        faceValue: faceValue,
                        targetPlayer: gameState.players.indexOf(ally),
                        targetDieType: allyDieType
                    });
                    log(`${die.name}: ${faceValue} -> ${ally.name}'s ${ally.dice[allyDieType].name}`, 'swap');
                });

                log('Double link created! Your fates are deeply intertwined!', 'success');
                modal.classList.remove('show');
                renderDiceTray();
                completeEncounter();
            };
            options.appendChild(opt);
        });
    });

    modal.classList.add('show');
}

// Show gamble range choice
function showGambleRangeChoice() {
    const rangeStart = Math.floor(Math.random() * 8) + 5;
    const rangeEnd = Math.min(rangeStart + Math.floor(Math.random() * 5) + 3, 18);

    const modal = document.getElementById('upgradeModal');
    document.getElementById('upgradeTitle').textContent = 'The Range Game';

    const rangeSize = rangeEnd - rangeStart + 1;
    const inRangeChance = Math.round((rangeSize / 20) * 100);
    const outRangeChance = 100 - inRangeChance;

    // Get a random gambler voice line
    const gamblerQuote = getRandomGamblerLine('beginning');

    document.getElementById('upgradeDescription').innerHTML = `
        <p style="color:#ffd700; font-style:italic; margin-bottom:15px;">"${gamblerQuote}"</p>
        <div style="padding:15px; background:rgba(255,215,0,0.15); border-radius:10px; border-left:4px solid #ffd700; margin:10px 0;">
            <h3 style="color:#ffd700;">Range: ${rangeStart} - ${rangeEnd}</h3>
            <p style="margin-top:10px;"><strong>IN RANGE</strong> (${inRangeChance}% chance): <span style="color:#4ade80;">+5 to segment of your choice!</span></p>
            <p><strong>OUT OF RANGE</strong> (${outRangeChance}% chance): <span style="color:#88ccff;">+3 to random segment</span></p>
        </div>
        <p>Choose your bet, then roll any die!</p>
    `;

    const options = document.getElementById('upgradeOptions');
    options.innerHTML = '';

    const betIn = document.createElement('button');
    betIn.className = 'option-btn';
    betIn.innerHTML = `<strong>Bet IN RANGE</strong><br>Win big if ${rangeStart}-${rangeEnd}`;
    betIn.onclick = () => {
        gameState.canRoll = true;
        gameState.encounterState = {
            type: 'gamble',
            rangeMin: rangeStart,
            rangeMax: rangeEnd,
            bet: 'in',
            inRangeReward: 5,
            outRangeReward: 3
        };
        modal.classList.remove('show');
        document.getElementById('encounterDescription').innerHTML = `
            <p>You bet <strong>IN RANGE (${rangeStart}-${rangeEnd})</strong>!</p>
            <p style="margin-top:15px; color:#88ccff;">Roll any die!</p>
        `;
        document.getElementById('encounterOptions').innerHTML = '';
        renderDiceTray();
    };
    options.appendChild(betIn);

    const betOut = document.createElement('button');
    betOut.className = 'option-btn';
    betOut.innerHTML = `<strong>Bet OUT OF RANGE</strong><br>Win if 1-${rangeStart-1} or ${rangeEnd+1}-20`;
    betOut.onclick = () => {
        gameState.canRoll = true;
        gameState.encounterState = {
            type: 'gamble',
            rangeMin: rangeStart,
            rangeMax: rangeEnd,
            bet: 'out',
            inRangeReward: 3,
            outRangeReward: 5
        };
        modal.classList.remove('show');
        document.getElementById('encounterDescription').innerHTML = `
            <p>You bet <strong>OUT OF RANGE</strong> (1-${rangeStart-1} or ${rangeEnd+1}-20)!</p>
            <p style="margin-top:15px; color:#88ccff;">Roll any die!</p>
        `;
        document.getElementById('encounterOptions').innerHTML = '';
        renderDiceTray();
    };
    options.appendChild(betOut);

    modal.classList.add('show');
}

// ==================== DRAFT MODE ENCOUNTERS ====================

// Show draft-enabled upgrade selection (FCFS mode for shared upgrades)
function showDraftUpgradeModal(upgrades, mode = DRAFT_MODES.FCFS, onComplete = null) {
    const modal = document.getElementById('upgradeModal');

    // Determine title based on mode
    let modeTitle = 'Choose Upgrades';
    let modeDesc = 'Select an upgrade for your dice:';

    switch (mode) {
        case DRAFT_MODES.FCFS:
            modeTitle = 'First Come, First Served!';
            modeDesc = 'Claim an upgrade before others grab it!';
            break;
        case DRAFT_MODES.SNAKE:
            modeTitle = 'Snake Draft';
            modeDesc = 'Take turns selecting upgrades.';
            break;
        case DRAFT_MODES.DIBS:
            modeTitle = 'Call Your Dibs!';
            modeDesc = 'Call dibs and hold for 5 seconds to claim!';
            break;
    }

    document.getElementById('upgradeTitle').textContent = modeTitle;
    document.getElementById('upgradeDescription').textContent = modeDesc;

    // Start draft session
    startDraft({
        mode: mode,
        items: upgrades,
        onItemClaimed: (item, slot, playerName) => {
            applyDraftUpgrade(item, slot);
            updateDraftModalUI();
        },
        onDraftComplete: (claimedItems) => {
            modal.classList.remove('show');
            if (onComplete) onComplete(claimedItems);
            completeEncounter();
        }
    });

    // Render initial UI
    renderDraftModalUI(modal, upgrades, mode);
    modal.classList.add('show');
}

// Render draft modal UI on host screen
function renderDraftModalUI(modal, upgrades, mode) {
    const options = document.getElementById('upgradeOptions');
    options.innerHTML = '';

    const status = getDraftStatus();
    if (!status) return;

    // Add snake turn indicator if needed
    if (mode === DRAFT_MODES.SNAKE) {
        const currentPicker = getSnakeCurrentPicker();
        const pickerName = gameState.players[currentPicker]?.name || `Player ${currentPicker + 1}`;
        const turnDiv = document.createElement('div');
        turnDiv.className = 'draft-turn-indicator';
        turnDiv.innerHTML = `<strong>${pickerName}'s turn to pick!</strong>`;
        turnDiv.style.cssText = 'text-align:center; padding:10px; margin-bottom:15px; background:rgba(255,215,0,0.1); border-radius:8px; color:#ffd700;';
        options.appendChild(turnDiv);
    }

    status.items.forEach(item => {
        const opt = document.createElement('div');
        opt.className = 'upgrade-option';
        opt.setAttribute('data-upgrade-id', item.id);

        if (item.claimed) {
            opt.classList.add('claimed');
            opt.innerHTML = `
                <h4>${item.name}</h4>
                <p>${item.description || ''}</p>
                <span class="claimed-badge">Claimed by ${item.claimedBy}</span>
            `;
        } else {
            const dibs = status.dibsTimers?.[item.id];
            if (dibs && dibs.timeLeft > 0) {
                opt.classList.add('has-dibs');
                opt.innerHTML = `
                    <h4>${item.name}</h4>
                    <p>${item.description || ''}</p>
                    <span class="dibs-indicator">${dibs.playerName} holding... (${dibs.timeLeft}s)</span>
                `;
            } else {
                opt.innerHTML = `
                    <h4>${item.name}</h4>
                    <p>${item.description || ''}</p>
                `;

                // Only clickable if mode allows (host view is for display mostly)
                if (!multiplayerState.enabled) {
                    opt.onclick = () => {
                        // Single player mode - just claim immediately
                        const slot = 0; // Default to player 0 in single player
                        claimDraftItem(item.id, 'local', slot, gameState.players[slot].name);
                    };
                }
            }
        }

        options.appendChild(opt);
    });

    // Add close button if no items claimed or for leaving early
    const skipBtn = document.createElement('button');
    skipBtn.className = 'option-btn';
    skipBtn.style.marginTop = '20px';
    skipBtn.textContent = 'Skip / Continue';
    skipBtn.onclick = () => {
        endDraft();
        modal.classList.remove('show');
        completeEncounter();
    };
    options.appendChild(skipBtn);
}

// Update draft modal UI when claims happen
function updateDraftModalUI() {
    const modal = document.getElementById('upgradeModal');
    if (!modal.classList.contains('show')) return;

    const status = getDraftStatus();
    if (!status) return;

    renderDraftModalUI(modal, status.items, status.mode);
}

// Apply a draft upgrade to a player
function applyDraftUpgrade(item, slot) {
    const player = gameState.players[slot];
    if (!player) return;

    const effect = item.effect || item.data;
    if (!effect) return;

    switch (effect.type) {
        case 'upgrade_lowest':
            // Upgrade lowest face of a random die
            const dieTypes = Object.keys(player.dice);
            const randomDie = player.dice[dieTypes[Math.floor(Math.random() * dieTypes.length)]];
            const minIdx = randomDie.faces.indexOf(Math.min(...randomDie.faces));
            randomDie.faces[minIdx] = clampFace(randomDie.faces[minIdx] + (effect.amount || 2));
            log(`${player.name}'s ${randomDie.name} +${effect.amount || 2}!`, 'success');
            trackDiceChange();
            break;

        case 'upgrade_all':
            Object.values(player.dice).forEach(die => {
                const minIdx = die.faces.indexOf(Math.min(...die.faces));
                die.faces[minIdx] = clampFace(die.faces[minIdx] + (effect.amount || 1));
            });
            log(`${player.name}'s all dice +${effect.amount || 1}!`, 'success');
            trackDiceChange(3);
            break;

        case 'hope':
            addHope(effect.amount || 1);
            log(`+${effect.amount || 1} HOPE!`, 'hope');
            break;

        case 'gold':
            addGold(effect.amount || 10);
            break;

        case 'reduce_doom':
            reduceDoom(effect.amount || 1);
            log(`-${effect.amount || 1} DOOM!`, 'success');
            break;

        default:
            console.log('Unknown upgrade effect type:', effect.type);
    }

    renderDiceTray();
    broadcastStateSync();
}

// ==================== POST-BOSS REWARDS (Snake Draft) ====================

// Show post-boss reward selection with snake draft
function showBossRewards() {
    const stage = gameState.currentStage;

    // Generate rewards based on stage
    const rewards = generateBossRewards(stage);

    log('Boss defeated! Time to claim your rewards!', 'crit');

    // Custom completion handler to skip the completeEncounter call
    const modal = document.getElementById('upgradeModal');

    startDraft({
        mode: DRAFT_MODES.SNAKE,
        items: rewards,
        onItemClaimed: (item, slot, playerName) => {
            applyDraftUpgrade(item, slot);
            updateDraftModalUI();
        },
        onDraftComplete: (claimedItems) => {
            modal.classList.remove('show');
            log(`${claimedItems.length} rewards claimed!`, 'success');
            // Proceed to shop after boss rewards
            setTimeout(() => {
                showStageShop();
            }, 500);
        }
    });

    // Set up modal
    document.getElementById('upgradeTitle').textContent = 'Boss Rewards - Snake Draft!';
    document.getElementById('upgradeDescription').textContent = 'Take turns claiming your rewards!';
    renderDraftModalUI(modal, rewards, DRAFT_MODES.SNAKE);
    modal.classList.add('show');
}

// Generate boss rewards based on stage
function generateBossRewards(stage) {
    const baseRewards = [
        { id: 'boss_plus3', name: '+3 to Lowest Face', description: 'Upgrade your weakest die face', effect: { type: 'upgrade_lowest', amount: 3 } },
        { id: 'boss_plus2_all', name: '+2 to All Dice', description: 'Small upgrade to every die', effect: { type: 'upgrade_all', amount: 2 } },
        { id: 'boss_hope3', name: '+3 HOPE', description: 'Build your safety net', effect: { type: 'hope', amount: 3 } },
        { id: 'boss_doom_minus2', name: '-2 DOOM', description: 'Reduce the encroaching darkness', effect: { type: 'reduce_doom', amount: 2 } },
        { id: 'boss_gold20', name: '+20 Gold', description: 'A pile of treasure', effect: { type: 'gold', amount: 20 } }
    ];

    // Add more powerful rewards for later stages
    if (stage >= 3) {
        baseRewards.push(
            { id: 'boss_plus5', name: '+5 to Lowest Face', description: 'Major die upgrade', effect: { type: 'upgrade_lowest', amount: 5 } },
            { id: 'boss_hope5', name: '+5 HOPE', description: 'A surge of hope!', effect: { type: 'hope', amount: 5 } }
        );
    }

    // Shuffle and return subset
    shuffleArray(baseRewards);
    return baseRewards.slice(0, Math.min(5, 3 + Math.floor(stage / 2)));
}

// ==================== ALCHEMIST POTIONS (Dibs Mode) ====================

// Show alchemist potion selection with dibs mode
function showAlchemistPotions() {
    const potions = [
        {
            id: 'potion_boost',
            name: 'Potion of Boosting',
            description: '+4 to your lowest face, but adds a random ally swap',
            effect: { type: 'boost', amount: 4 }
        },
        {
            id: 'potion_balance',
            name: 'Elixir of Balance',
            description: '+2 to ALL your dice faces',
            effect: { type: 'upgrade_all', amount: 2 }
        },
        {
            id: 'potion_fate',
            name: 'Brew of Fate',
            description: '+6 to one face, but -2 to another',
            effect: { type: 'fate', amount: 6 }
        },
        {
            id: 'potion_clarity',
            name: 'Draught of Clarity',
            description: '+3 HOPE and reduce DOOM by 1',
            effect: { type: 'clarity' }
        }
    ];

    log('The Alchemist presents their potions...', 'info');
    log('Call dibs quickly!', 'info');

    showDraftUpgradeModal(potions, DRAFT_MODES.DIBS, (claimed) => {
        claimed.forEach(item => {
            applyAlchemistPotion(item);
        });
    });
}

// Apply alchemist potion effect
function applyAlchemistPotion(item) {
    const slot = item.claimedBySlot;
    const player = gameState.players[slot];
    if (!player) return;

    const effect = item.effect;

    switch (effect.type) {
        case 'boost':
            // +4 to lowest, add random swap
            const dieTypes = Object.keys(player.dice);
            const die = player.dice[dieTypes[Math.floor(Math.random() * dieTypes.length)]];
            const minIdx = die.faces.indexOf(Math.min(...die.faces));
            die.faces[minIdx] = clampFace(die.faces[minIdx] + effect.amount);

            // Add random swap
            const otherPlayers = gameState.players.filter((_, i) => i !== slot);
            const targetPlayer = otherPlayers[Math.floor(Math.random() * otherPlayers.length)];
            const targetSlot = gameState.players.indexOf(targetPlayer);
            const swapValue = Math.floor(Math.random() * 10) + 5;
            die.swaps = die.swaps || [];
            die.swaps.push({
                faceValue: swapValue,
                targetPlayer: targetSlot,
                targetDieType: dieTypes[Math.floor(Math.random() * dieTypes.length)]
            });

            log(`${player.name}'s ${die.name} boosted! Rolling ${swapValue} now links to ${targetPlayer.name}!`, 'success');
            trackDiceChange();
            break;

        case 'upgrade_all':
            Object.values(player.dice).forEach(die => {
                const minIdx = die.faces.indexOf(Math.min(...die.faces));
                die.faces[minIdx] += effect.amount;
            });
            log(`${player.name}'s all dice +${effect.amount}!`, 'success');
            trackDiceChange(3);
            break;

        case 'fate':
            // +6 to one face, -2 to another
            const dType = Object.keys(player.dice)[Math.floor(Math.random() * 3)];
            const dieToMod = player.dice[dType];
            const lowIdx = dieToMod.faces.indexOf(Math.min(...dieToMod.faces));
            const highIdx = dieToMod.faces.indexOf(Math.max(...dieToMod.faces));
            dieToMod.faces[lowIdx] = clampFace(dieToMod.faces[lowIdx] + 6);
            dieToMod.faces[highIdx] = clampFace(dieToMod.faces[highIdx] - 2);
            log(`${player.name}'s ${dieToMod.name}: lowest +6, highest -2!`, 'info');
            trackDiceChange(2);
            break;

        case 'clarity':
            addHope(3);
            reduceDoom(1);
            log(`${player.name} gains clarity! +3 HOPE, -1 DOOM!`, 'hope');
            break;
    }

    renderDiceTray();
}

// ==================== MATHEMATICIAN (FCFS Mode) ====================

// Show mathematician upgrades with FCFS mode
function showMathematicianOptions() {
    const options = [
        {
            id: 'math_sculpt_safe',
            name: 'Sculpt: The Safe Bet',
            description: 'Replace 3 lowest faces with 8, 9, 10',
            effect: { type: 'sculpt', values: [8, 9, 10] }
        },
        {
            id: 'math_sculpt_climb',
            name: 'Sculpt: The Climber',
            description: 'Replace 3 lowest faces with 5, 10, 15',
            effect: { type: 'sculpt', values: [5, 10, 15] }
        },
        {
            id: 'math_sculpt_crit',
            name: 'Sculpt: Crit Fisher',
            description: 'Replace 3 lowest faces with 17, 18, 19',
            effect: { type: 'sculpt', values: [17, 18, 19] }
        },
        {
            id: 'math_trade',
            name: 'Mathematical Trade',
            description: '-1 to highest face, +4 to lowest face',
            effect: { type: 'trade' }
        }
    ];

    log('The Mathematician offers their calculations...', 'info');

    showDraftUpgradeModal(options, DRAFT_MODES.FCFS, (claimed) => {
        claimed.forEach(item => {
            applyMathematicianUpgrade(item);
        });
    });
}

// Apply mathematician upgrade
function applyMathematicianUpgrade(item) {
    const slot = item.claimedBySlot;
    const player = gameState.players[slot];
    if (!player) return;

    const effect = item.effect;
    const dieTypes = Object.keys(player.dice);
    const die = player.dice[dieTypes[Math.floor(Math.random() * dieTypes.length)]];

    switch (effect.type) {
        case 'sculpt':
            const sortedWithIdx = die.faces.map((v, i) => ({ v, i })).sort((a, b) => a.v - b.v);
            const lowestThreeIdx = sortedWithIdx.slice(0, 3).map(x => x.i);
            lowestThreeIdx.forEach((faceIdx, i) => {
                die.faces[faceIdx] = effect.values[i];
            });
            log(`${player.name}'s ${die.name} sculpted: ${effect.values.join(', ')}!`, 'success');
            trackDiceChange(3);
            break;

        case 'trade':
            const maxVal = Math.max(...die.faces);
            const minVal = Math.min(...die.faces);
            const maxIdx = die.faces.indexOf(maxVal);
            const minIdx = die.faces.indexOf(minVal);
            die.faces[maxIdx] = clampFace(maxVal - 1);
            die.faces[minIdx] = clampFace(minVal + 4);
            log(`${player.name}'s ${die.name}: ${maxVal}->${die.faces[maxIdx]}, ${minVal}->${die.faces[minIdx]}!`, 'success');
            trackDiceChange(2);
            break;
    }

    renderDiceTray();
}

// ==================== MERCHANT ENCOUNTER ====================

// Track merchant upgrade cost (escalates each purchase, resets each visit)
let merchantUpgradeCost = 1;

// Show merchant browse interface
function showMerchantBrowse() {
    merchantUpgradeCost = 1; // Reset cost on new visit

    const modal = document.getElementById('upgradeModal');
    document.getElementById('upgradeTitle').textContent = 'The Merchant';

    renderMerchantBrowse();
    modal.classList.add('show');
}

// Check if a die face is "virgin" (unmodified except by merchant)
function isDieFaceVirgin(die, faceIndex) {
    const faceValue = die.faces[faceIndex];

    // 1 and 20 are never eligible
    if (faceValue === 1 || faceValue === 20) return false;

    // Can't go above 19
    if (faceValue >= 19) return false;

    // Check if face is in baseFaces at same position (unmodified)
    if (die.baseFaces && die.baseFaces[faceIndex] !== die.faces[faceIndex]) {
        // Face was modified - check if only by merchant
        if (!die.merchantUpgrades || !die.merchantUpgrades.includes(faceIndex)) {
            return false; // Modified by something other than merchant
        }
    }

    // Check swaps - swapped segments are not virgin
    if (die.swaps && die.swaps.some(s => s.myValue === faceValue)) {
        return false;
    }

    // Check hope segments
    if (die.hopeSegments && die.hopeSegments.includes(faceValue)) {
        return false;
    }

    // Check crossed/marked segments
    if (die.crossedSegments && die.crossedSegments.includes(faceValue)) {
        return false;
    }

    return true;
}

// Render merchant browse content
function renderMerchantBrowse() {
    const nextCost = merchantUpgradeCost;
    const canAfford = gameState.gold >= nextCost;

    document.getElementById('upgradeDescription').innerHTML = `
        <div style="display:flex; justify-content:space-between; margin-bottom:15px;">
            <div style="text-align:center;">
                <div style="color:#ffd700; font-size:1.5rem; font-weight:bold;">${gameState.gold}G</div>
                <div style="color:#888; font-size:0.8rem;">Your Gold</div>
            </div>
            <div style="text-align:center;">
                <div style="color:#4ade80; font-size:1.5rem; font-weight:bold;">${nextCost}G</div>
                <div style="color:#888; font-size:0.8rem;">Next Upgrade Cost</div>
            </div>
        </div>
        <p style="color:#aaa; font-size:0.85rem;">Select an unmodified die face to increase by 1. Cost increases each purchase.</p>
        <p style="color:#888; font-size:0.75rem;">Only "virgin" faces can be upgraded (no prior modifications, not 1, 20, or 19+).</p>
    `;

    const options = document.getElementById('upgradeOptions');
    options.innerHTML = '';

    // List all players and their dice faces
    gameState.players.forEach((player, pIdx) => {
        Object.entries(player.dice).forEach(([dieType, die]) => {
            const virginFaces = [];

            die.faces.forEach((faceValue, faceIndex) => {
                if (isDieFaceVirgin(die, faceIndex)) {
                    virginFaces.push({ value: faceValue, index: faceIndex });
                }
            });

            if (virginFaces.length > 0) {
                const dieSection = document.createElement('div');
                dieSection.style.cssText = 'margin-bottom:15px; padding:10px; background:rgba(0,0,0,0.2); border-radius:8px;';

                dieSection.innerHTML = `
                    <h4 style="color:var(--${die.category}-primary); margin-bottom:8px;">${player.name}'s ${die.name}</h4>
                    <div style="display:flex; flex-wrap:wrap; gap:8px;"></div>
                `;

                const facesContainer = dieSection.querySelector('div');

                virginFaces.forEach(face => {
                    const faceBtn = document.createElement('button');
                    faceBtn.className = 'option-btn';
                    faceBtn.style.cssText = `
                        padding: 8px 16px;
                        min-width: 50px;
                        opacity: ${canAfford ? '1' : '0.5'};
                        cursor: ${canAfford ? 'pointer' : 'not-allowed'};
                    `;
                    faceBtn.textContent = `${face.value} -> ${face.value + 1}`;

                    if (canAfford) {
                        faceBtn.onclick = () => purchaseMerchantUpgrade(player, die, face.index);
                    }

                    facesContainer.appendChild(faceBtn);
                });

                options.appendChild(dieSection);
            }
        });
    });

    // Check if any faces are available
    if (options.children.length === 0) {
        const noFaces = document.createElement('p');
        noFaces.style.cssText = 'color:#888; text-align:center; padding:20px;';
        noFaces.textContent = 'No eligible die faces available. All faces have been modified by other upgrades.';
        options.appendChild(noFaces);
    }

    // Done button
    const doneBtn = document.createElement('button');
    doneBtn.className = 'option-btn secondary';
    doneBtn.style.marginTop = '15px';
    doneBtn.textContent = 'Done Shopping';
    doneBtn.onclick = () => {
        document.getElementById('upgradeModal').classList.remove('show');
        completeEncounter();
    };
    options.appendChild(doneBtn);
}

// Purchase merchant upgrade
function purchaseMerchantUpgrade(player, die, faceIndex) {
    if (gameState.gold < merchantUpgradeCost) return;

    // Spend gold
    gameState.gold -= merchantUpgradeCost;
    updateGoldDisplay();

    // Upgrade the face
    const oldValue = die.faces[faceIndex];
    die.faces[faceIndex] = clampFace(oldValue + 1);

    // Track that merchant upgraded this face
    if (!die.merchantUpgrades) die.merchantUpgrades = [];
    if (!die.merchantUpgrades.includes(faceIndex)) {
        die.merchantUpgrades.push(faceIndex);
    }

    log(`${player.name}'s ${die.name}: ${oldValue} -> ${die.faces[faceIndex]} (${merchantUpgradeCost}G)`, 'success');
    trackDiceChange();

    // Increase cost for next purchase
    merchantUpgradeCost++;

    // Re-render
    renderMerchantBrowse();
    renderDiceTray();
}

// Show merchant wheel
function showMerchantWheel() {
    const modal = document.getElementById('upgradeModal');
    document.getElementById('upgradeTitle').textContent = "Merchant's Wheel of Fortune";

    document.getElementById('upgradeDescription').innerHTML = `
        <p>Choose a die face to gamble on the wheel!</p>
        <div style="margin:15px 0; padding:15px; background:rgba(255,215,0,0.1); border-radius:10px; border-left:3px solid #ffd700;">
            <p style="margin:0; color:#ffd700;"><strong>Wheel Outcomes (20% each):</strong></p>
            <ul style="margin:10px 0 0 20px; color:#aaa;">
                <li>Double the face value (caps at 19)</li>
                <li>Halve the face value (minimum 2)</li>
                <li>Add +1 HOPE to this segment</li>
                <li>Add DOOM mark to this segment</li>
                <li>Create an Intertwine link</li>
            </ul>
        </div>
        <p style="color:#f87171; font-size:0.85rem;">Warning: Wheel-modified faces can only be modified by the wheel again!</p>
    `;

    const options = document.getElementById('upgradeOptions');
    options.innerHTML = '';

    // List all die faces (not just virgin ones for wheel)
    gameState.players.forEach((player, pIdx) => {
        Object.entries(player.dice).forEach(([dieType, die]) => {
            const eligibleFaces = [];

            die.faces.forEach((faceValue, faceIndex) => {
                // Can't wheel 1 or 20
                if (faceValue === 1 || faceValue === 20) return;

                // Check if already wheeled and can be wheeled again
                const wasWheeled = die.wheelUpgrades && die.wheelUpgrades.includes(faceIndex);
                const wasModifiedOtherwise = die.baseFaces &&
                    die.baseFaces[faceIndex] !== faceValue &&
                    !wasWheeled &&
                    (!die.merchantUpgrades || !die.merchantUpgrades.includes(faceIndex));

                // Can wheel if: virgin, or previously wheeled
                if (!wasModifiedOtherwise || wasWheeled) {
                    eligibleFaces.push({ value: faceValue, index: faceIndex });
                }
            });

            if (eligibleFaces.length > 0) {
                const dieSection = document.createElement('div');
                dieSection.style.cssText = 'margin-bottom:15px; padding:10px; background:rgba(0,0,0,0.2); border-radius:8px;';

                dieSection.innerHTML = `
                    <h4 style="color:var(--${die.category}-primary); margin-bottom:8px;">${player.name}'s ${die.name}</h4>
                    <div style="display:flex; flex-wrap:wrap; gap:8px;"></div>
                `;

                const facesContainer = dieSection.querySelector('div');

                eligibleFaces.forEach(face => {
                    const faceBtn = document.createElement('button');
                    faceBtn.className = 'option-btn';
                    faceBtn.style.cssText = 'padding: 8px 16px; min-width: 50px;';
                    faceBtn.textContent = face.value;
                    faceBtn.onclick = () => spinMerchantWheel(player, die, face.index);
                    facesContainer.appendChild(faceBtn);
                });

                options.appendChild(dieSection);
            }
        });
    });

    // Cancel button
    const cancelBtn = document.createElement('button');
    cancelBtn.className = 'option-btn secondary';
    cancelBtn.style.marginTop = '15px';
    cancelBtn.textContent = 'Cancel (Keep Gold)';
    cancelBtn.onclick = () => {
        // Refund the gold
        gameState.gold += 5;
        updateGoldDisplay();
        document.getElementById('upgradeModal').classList.remove('show');
    };
    options.appendChild(cancelBtn);
}

// Spin the merchant wheel
function spinMerchantWheel(player, die, faceIndex) {
    const outcomes = ['double', 'half', 'hope', 'doom', 'intertwine'];
    const outcome = outcomes[Math.floor(Math.random() * outcomes.length)];
    const oldValue = die.faces[faceIndex];

    // Track wheel upgrade
    if (!die.wheelUpgrades) die.wheelUpgrades = [];
    if (!die.wheelUpgrades.includes(faceIndex)) {
        die.wheelUpgrades.push(faceIndex);
    }

    let resultText = '';

    switch (outcome) {
        case 'double':
            die.faces[faceIndex] = Math.min(19, oldValue * 2);
            resultText = `DOUBLED! ${oldValue} -> ${die.faces[faceIndex]}`;
            log(`Wheel: ${player.name}'s ${die.name} face ${resultText}!`, 'success');
            break;

        case 'half':
            die.faces[faceIndex] = Math.max(2, Math.floor(oldValue / 2));
            resultText = `HALVED! ${oldValue} -> ${die.faces[faceIndex]}`;
            log(`Wheel: ${player.name}'s ${die.name} face ${resultText}!`, 'fail');
            break;

        case 'hope':
            if (!die.hopeSegments) die.hopeSegments = [];
            if (!die.hopeSegments.includes(oldValue)) {
                die.hopeSegments.push(oldValue);
            }
            resultText = `+1 HOPE added to face ${oldValue}!`;
            log(`Wheel: ${player.name}'s ${die.name} ${resultText}`, 'hope');
            break;

        case 'doom':
            if (!die.crossedSegments) die.crossedSegments = [];
            if (!die.crossedSegments.includes(oldValue)) {
                die.crossedSegments.push(oldValue);
            }
            resultText = `DOOM mark added to face ${oldValue}!`;
            log(`Wheel: ${player.name}'s ${die.name} ${resultText}`, 'doom');
            break;

        case 'intertwine':
            // Pick a random ally and create an intertwine
            const allies = gameState.players.filter((p, i) => p.id !== player.id);
            if (allies.length > 0) {
                const ally = allies[Math.floor(Math.random() * allies.length)];
                const allyDieTypes = Object.keys(ally.dice);
                const allyDieType = allyDieTypes[Math.floor(Math.random() * allyDieTypes.length)];

                if (!die.swaps) die.swaps = [];
                die.swaps.push({
                    myValue: oldValue,
                    allyIndex: gameState.players.indexOf(ally),
                    allyDieType: allyDieType
                });

                resultText = `INTERTWINED! Face ${oldValue} now triggers ${ally.name}'s ${ally.dice[allyDieType].name}!`;
                log(`Wheel: ${player.name}'s ${die.name} ${resultText}`, 'success');
            }
            break;
    }

    trackDiceChange();
    renderDiceTray();

    // Show result and close
    document.getElementById('upgradeDescription').innerHTML = `
        <div style="text-align:center; padding:30px;">
            <h2 style="color:#ffd700; margin-bottom:15px;">WHEEL RESULT</h2>
            <p style="font-size:1.2rem; color:#fff;">${resultText}</p>
        </div>
    `;

    document.getElementById('upgradeOptions').innerHTML = '';

    const continueBtn = document.createElement('button');
    continueBtn.className = 'option-btn primary';
    continueBtn.textContent = 'Continue';
    continueBtn.onclick = () => {
        document.getElementById('upgradeModal').classList.remove('show');
        // Return to merchant or complete encounter
        showEncounter(gameState.currentEncounter);
    };
    document.getElementById('upgradeOptions').appendChild(continueBtn);
}
