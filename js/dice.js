// ==================== DICE MECHANICS ====================

// Create a new die of specified type
function createDie(type) {
    return {
        type: type,
        ...DICE_TYPES[type],
        faces: Array.from({length: 20}, (_, i) => i + 1),
        swaps: [], // Array of {faceValue, targetPlayer, targetDieType}
        hopeSegments: [], // Face values that grant HOPE when rolled
        crossedSegments: [], // Face values marked by Ferryman (one-time, triggers penalty)
        lastRoll: null
    };
}

// Roll a die
function rollDie(playerIndex, dieType) {
    if (!gameState.canRoll) return;

    const player = gameState.players[playerIndex];
    const die = player.dice[dieType];

    if (!gameState.allowedDiceTypes.includes(die.category)) {
        log(`Can't use ${die.name} here!`, 'fail');
        return;
    }

    const dieElement = document.querySelector(`[data-player="${playerIndex}"][data-type="${dieType}"]`);
    if (dieElement) {
        dieElement.classList.add('rolling');
    }

    setTimeout(() => {
        if (dieElement) {
            dieElement.classList.remove('rolling');
        }

        const faceIndex = Math.floor(Math.random() * 20);
        let result = die.faces[faceIndex];

        // Check for swaps
        const swap = die.swaps.find(s => s.faceValue === result);
        let swapInfo = null;

        if (swap) {
            // Trigger the swapped die!
            const targetPlayer = gameState.players[swap.targetPlayer];
            const targetDie = targetPlayer.dice[swap.targetDieType];
            const swapRoll = targetDie.faces[Math.floor(Math.random() * 20)];

            swapInfo = {
                originalRoll: result,
                swappedTo: targetPlayer.name,
                swappedDie: targetDie.name,
                newRoll: swapRoll
            };

            result = swapRoll;
            log(`SWAP! ${swapInfo.originalRoll} triggered ${targetPlayer.name}'s ${targetDie.name}!`, 'swap');
        }

        // Check for Ferryman's crossed segments (one-time penalty)
        let crossedTriggered = false;
        const crossedIdx = die.crossedSegments.indexOf(result);
        if (crossedIdx !== -1) {
            crossedTriggered = true;
            // Remove it (one-time only)
            die.crossedSegments.splice(crossedIdx, 1);
            log(`CROSSED! The Ferryman's mark activates on ${result}!`, 'doom');
        }

        die.lastRoll = result;
        showRollResult(playerIndex, player, die, result, swapInfo, crossedTriggered);
    }, 600);
}

// Display roll result modal
function showRollResult(playerIndex, player, die, result, swapInfo = null, crossedTriggered = false) {
    const modal = document.getElementById('rollResult');
    const valueEl = document.getElementById('rollValue');
    const outcomeEl = document.getElementById('rollOutcome');
    const swapEl = document.getElementById('swapTriggered');
    const doomChangeEl = document.getElementById('doomChange');

    document.getElementById('rollDieName').textContent = `${player.name}'s ${die.name}`;

    // Show swap info if applicable
    if (swapInfo) {
        swapEl.style.display = 'block';
        swapEl.innerHTML = `Rolled ${swapInfo.originalRoll} -> Linked to ${swapInfo.swappedTo}'s ${swapInfo.swappedDie}!`;
    } else if (crossedTriggered) {
        swapEl.style.display = 'block';
        swapEl.innerHTML = `<span style="color:#ff6b6b;">FERRYMAN'S MARK! The crossed face triggered!</span>`;
    } else {
        swapEl.style.display = 'none';
    }

    // DOOM does NOT affect regular player rolls - only DOOM rolls!
    valueEl.textContent = result;
    doomChangeEl.style.display = 'none';

    // Handle crossed segment penalty
    if (crossedTriggered) {
        addDoom(2, 'Ferryman\'s mark triggered');
    }

    valueEl.className = 'result-value';

    if (result === 20) {
        valueEl.classList.add('crit');
        outcomeEl.textContent = 'NATURAL 20!';
        addHope(1);
        doomChangeEl.style.display = 'block';
        doomChangeEl.className = 'doom-change hope-up';
        doomChangeEl.textContent = '+1 HOPE from Natural 20!';
        doomChangeEl.style.color = '#ffd700';
    } else if (result === 1) {
        valueEl.classList.add('fail');
        outcomeEl.textContent = 'CRITICAL FAIL!';
        addDoom(1, 'Natural 1');
        doomChangeEl.style.display = 'block';
        doomChangeEl.className = 'doom-change doom-up';
        doomChangeEl.textContent = '+1 DOOM from Natural 1!';
        doomChangeEl.style.color = '#ff6b6b';
    } else if (result >= gameState.targetDC) {
        valueEl.classList.add('success');
        outcomeEl.textContent = 'Success!';
    } else {
        valueEl.classList.add('fail');
        outcomeEl.textContent = 'Failed...';
    }

    // Check for HOPE on this segment
    if (die.hopeSegments && die.hopeSegments.includes(result)) {
        addHope(1);
    }

    modal.classList.add('show');
    processRollResult(playerIndex, player, die, result, 0);
}

// Close roll result modal
function closeRollResult() {
    document.getElementById('rollResult').classList.remove('show');
}

// Create a random swap on a die
function createRandomSwap(player, die) {
    // Pick a random low face (1-5) to swap
    const lowFaces = die.faces.filter(f => f <= 5);
    if (lowFaces.length === 0) return;

    const faceToSwap = lowFaces[Math.floor(Math.random() * lowFaces.length)];

    // Pick a random other player and die
    const otherPlayers = gameState.players.filter(p => p.id !== player.id);
    const targetPlayer = otherPlayers[Math.floor(Math.random() * otherPlayers.length)];
    const dieTypes = ['physical', 'verbal', 'preventative'];
    const targetDieType = dieTypes[Math.floor(Math.random() * dieTypes.length)];

    die.swaps.push({
        faceValue: faceToSwap,
        targetPlayer: gameState.players.indexOf(targetPlayer),
        targetDieType: targetDieType
    });

    log(`${die.name} now linked: ${faceToSwap} -> ${targetPlayer.name}'s ${targetPlayer.dice[targetDieType].name}`, 'swap');
    renderPlayers();
    renderDiceTray();
}

// Show swap modal for player choice
function showSwapModal(type) {
    const modal = document.getElementById('upgradeModal');
    const options = document.getElementById('upgradeOptions');

    const isLow = type === 'low';
    document.getElementById('upgradeTitle').textContent = isLow ?
        'Link a Low Roll to Ally' : 'Link a High Roll to Ally';
    document.getElementById('upgradeDescription').textContent = isLow ?
        'Choose a die, then pick a low number (1-5) to link to a teammate\'s die:' :
        'Choose a die, then pick a high number (16-19) to link to a teammate\'s die:';

    options.innerHTML = '';

    gameState.players.forEach((player, pIdx) => {
        Object.entries(player.dice).forEach(([dieType, die]) => {
            const opt = document.createElement('div');
            opt.className = 'upgrade-option swap-option';
            opt.innerHTML = `
                <h4>${player.name}'s ${die.name}</h4>
                <p>Click to add a swap link</p>
            `;
            opt.onclick = () => showSwapTargetPicker(pIdx, dieType, isLow);
            options.appendChild(opt);
        });
    });

    modal.classList.add('show');
}

// Show swap target picker
function showSwapTargetPicker(sourcePlayerIdx, sourceDieType, isLow) {
    const modal = document.getElementById('upgradeModal');
    const options = document.getElementById('upgradeOptions');
    const sourcePlayer = gameState.players[sourcePlayerIdx];
    const sourceDie = sourcePlayer.dice[sourceDieType];

    const range = isLow ? [1,2,3,4,5] : [16,17,18,19];

    document.getElementById('upgradeTitle').textContent = 'Choose Face & Target';
    document.getElementById('upgradeDescription').textContent =
        `Select which face of ${sourcePlayer.name}'s ${sourceDie.name} to link:`;

    options.innerHTML = '';

    range.forEach(faceValue => {
        gameState.players.forEach((targetPlayer, tpIdx) => {
            if (tpIdx === sourcePlayerIdx) return;

            Object.entries(targetPlayer.dice).forEach(([targetDieType, targetDie]) => {
                const opt = document.createElement('div');
                opt.className = 'upgrade-option swap-option';
                opt.innerHTML = `
                    <h4>Roll ${faceValue} -> ${targetPlayer.name}'s ${targetDie.name}</h4>
                    <p>When you roll ${faceValue}, ${targetPlayer.name}'s ${targetDie.name} activates instead</p>
                `;
                opt.onclick = () => {
                    sourceDie.swaps.push({
                        faceValue: faceValue,
                        targetPlayer: tpIdx,
                        targetDieType: targetDieType
                    });
                    log(`Linked! ${sourceDie.name} ${faceValue} -> ${targetPlayer.name}'s ${targetDie.name}`, 'swap');
                    modal.classList.remove('show');
                    renderPlayers();
                    renderDiceTray();
                    completeEncounter();
                };
                options.appendChild(opt);
            });
        });
    });
}
