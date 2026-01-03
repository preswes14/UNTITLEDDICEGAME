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

    node.connections.forEach(connId => {
        if (gameState.map[connId].status === 'locked') {
            gameState.map[connId].status = 'available';
        }
    });

    renderMap();
    showEncounter(node);
    log(`Entered: ${node.name}`, 'info');
    autoSave();
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

// Handle encounter option
function handleOption(option, node) {
    switch(option.action) {
        case 'leave':
            completeEncounter();
            break;
        case 'combat':
            startCombat(option, node);
            break;
        case 'upgrade_plus1':
            showUpgradeModal(1);
            break;
        case 'upgrade_plus2':
            showUpgradeModal(2);
            break;
        case 'math_free':
            showUpgradeModal(2);
            break;
        case 'upgrade_plus3':
            if (spendGold(option.cost)) showUpgradeModal(3);
            break;
        case 'upgrade_plus5':
            if (spendGold(option.cost)) showUpgradeModal(5);
            break;
        case 'swap_low_to_ally':
            showSwapModal('low');
            break;
        case 'swap_high_to_ally':
            if (spendGold(option.cost)) showSwapModal('high');
            break;
        case 'blessing_hope':
            addHope(3);
            log('The priest\'s blessing fills you with HOPE!', 'hope');
            completeEncounter();
            break;
        case 'blessing_greater': {
            addHope(5);
            const randomP = gameState.players[Math.floor(Math.random() * 3)];
            const randomDie = Object.values(randomP.dice)[Math.floor(Math.random() * 3)];
            const markValue = Math.floor(Math.random() * 10) + 6;
            randomDie.crossedSegments.push(markValue);
            log(`Greater blessing! +5 HOPE, but ${randomP.name}'s ${randomDie.name} is marked.`, 'hope');
            completeEncounter();
            break;
        }
        case 'math_tradeoff':
            showMathTradeoffModal();
            break;
        case 'math_sculpt':
            showSculptFacesModal();
            break;
        case 'alchemist_risky':
            showRiskySwapModal();
            break;
        case 'gamble_range': {
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
            break;
        }
        case 'ferryman_roll':
            handleFerrymanRoll();
            break;
        case 'ferryman_paid':
            if (spendGold(5)) {
                addHope(2);
                log('The Ferryman takes your gold and nods. "The river blesses you." +2 HOPE', 'hope');
                completeEncounter();
            } else {
                log('Not enough gold! You need 5G.', 'fail');
            }
            break;
        case 'ferryman_wade':
            addDoom(1, 'The cold waters chill your spirit');
            log('You wade through the shallows safely, though the cold seeps into your bones.', 'info');
            completeEncounter();
            break;
        case 'trapper_trade':
            showTrapperTrade();
            break;
        case 'trapper_exotic':
            showExoticDiceTrade();
            break;
        case 'trapper_paid':
            if (spendGold(8)) {
                showTrapperPaidTrade();
            } else {
                log('Not enough gold! You need 8G.', 'fail');
            }
            break;
        case 'drunk_blessing':
            handleDrunkBlessing();
            break;
        case 'drunk_paid':
            if (spendGold(3)) {
                addHope(3);
                log('The priest focuses intently. "BLESSINGS!" A perfect blessing lands. +3 HOPE!', 'hope');
                completeEncounter();
            } else {
                log('Not enough gold! You need 3G.', 'fail');
            }
            break;
        case 'cultist_drink':
            handleCultistDrink();
            break;
        case 'cultist_paid':
            if (spendGold(10)) {
                handleCultistPaid();
            } else {
                log('Not enough gold! You need 10G.', 'fail');
            }
            break;
        case 'blessing_segment':
            showBlessSegmentModal();
            break;
        case 'alchemist_double':
            showDoubleLinkModal();
            break;
        case 'gamble_range_choice':
            showGambleRangeChoice();
            break;
        case 'boss_combat':
            startBossCombat(option, node);
            break;
        // Stage 5 warped encounter actions
        case 'restore_die': {
            const randomPlayer = gameState.players[Math.floor(Math.random() * 3)];
            const dieTypes = ['physical', 'verbal', 'preventative'];
            const randomDieType = dieTypes[Math.floor(Math.random() * 3)];
            const randomDie = randomPlayer.dice[randomDieType];
            const oneIdx = randomDie.faces.indexOf(1);
            if (oneIdx > 0) {
                randomDie.faces[oneIdx] = oneIdx + 1;
                log(`${randomPlayer.name}'s ${randomDie.name} is partially restored!`, 'success');
            } else {
                log('The fragment pulses but finds nothing to heal.', 'info');
            }
            completeEncounter();
            break;
        }
        case 'sanctuary_rest':
            addHope(2);
            log('A moment of peace in the chaos. The party gathers strength. +2 HOPE', 'success');
            completeEncounter();
            break;
        case 'accept_destiny':
            addHope(3);
            log('You are the chosen ones. The 20th prophecy will succeed.', 'crit');
            completeEncounter();
            break;
        case 'rift_touch':
            addHope(1);
            log('Warmth flows through the tear. You feel hope. +1 HOPE', 'hope');
            completeEncounter();
            break;
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
        addHope(2);
        log('The Ferryman grants safe passage with the river\'s blessing! +2 HOPE', 'hope');
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

        const crossedFace = Math.floor(Math.random() * 8) + 11;
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
        const hopeGain = Math.floor(Math.random() * 2) + 3;
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
        const amount = Math.floor(Math.random() * 2) + 2;
        addHope(amount);
        addDoom(amount, 'Blessing side effect');
        log(`Mixed blessing... +${amount} HOPE but also +${amount} DOOM. It balances out.`, 'info');

    } else {
        const hopeGain = 1;
        const doomGain = Math.floor(Math.random() * 2) + 2;
        addHope(hopeGain);
        addDoom(doomGain, 'Sloppy blessing went wrong');
        log(`The blessing goes awry! +${hopeGain} HOPE but +${doomGain} DOOM...`, 'fail');
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
        die.faces[minIdx] += 5;

        log(`The cosmic bond empowers you! ${die.name} lowest face ${minVal} -> ${minVal + 5}`, 'crit');
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
                die.faces[maxIdx] -= 1;
                die.faces[minIdx] += 4;
                log(`${player.name}'s ${die.name}: ${maxVal}->${maxVal-1}, ${minVal}->${minVal+4}!`, 'success');
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
                die.faces[minIdx] += 2;

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
    const shuffled = [...EXOTIC_DICE].sort(() => Math.random() - 0.5);
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
                    for (let i = 1; i <= 20; i++) {
                        ranked.die.swaps.push({
                            faceValue: i,
                            targetPlayer: (pIdx + 1 + Math.floor(Math.random() * 2)) % 3,
                            targetDieType: ['physical','verbal','preventative'][Math.floor(Math.random() * 3)]
                        });
                    }
                }
                log(`${player.name} trades ${ranked.die.name} for ${exoticToGet.name}!`, 'success');
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

    document.getElementById('upgradeDescription').innerHTML = `
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
