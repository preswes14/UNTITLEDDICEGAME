// ==================== UI RENDERING FUNCTIONS ====================

// Render the map
function renderMap() {
    const container = document.getElementById('mapContainer');
    if (!container) return;
    container.innerHTML = '';

    const rows = {};
    gameState.map.forEach(node => {
        if (!rows[node.row]) rows[node.row] = [];
        rows[node.row].push(node);
    });

    const rowKeys = Object.keys(rows).sort((a, b) => b - a);

    rowKeys.forEach((rowKey, rowIndex) => {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'map-row';

        rows[rowKey].forEach(node => {
            const nodeDiv = document.createElement('div');
            nodeDiv.className = `map-node ${node.type} ${node.status}`;
            nodeDiv.innerHTML = node.icon;
            nodeDiv.title = node.name;

            if (node.status === 'available') {
                nodeDiv.onclick = () => selectNode(node.id);
            }

            rowDiv.appendChild(nodeDiv);
        });

        container.appendChild(rowDiv);

        if (rowIndex < rowKeys.length - 1) {
            const pathDiv = document.createElement('div');
            pathDiv.className = 'map-path';
            container.appendChild(pathDiv);
        }
    });
}

// Render players panel
function renderPlayers() {
    const container = document.getElementById('playersDisplay');
    if (!container) return;
    container.innerHTML = '';

    gameState.players.forEach((player, idx) => {
        const card = document.createElement('div');
        card.className = `player-card player-${player.id}`;
        const avatar = CHARACTER_AVATARS[player.id];

        card.innerHTML = `
            <div class="player-header">
                <img src="${avatar.image}" alt="${avatar.color}" class="character-avatar">
                <div class="player-info">
                    <h3>${player.name}</h3>
                    <div class="player-dice-mini">
                        ${Object.entries(player.dice).map(([type, die]) => {
                            const hasSwaps = die.swaps && die.swaps.length > 0;
                            const hasCrossed = die.crossedSegments && die.crossedSegments.length > 0;
                            return `
                                <div class="mini-die ${die.category}" title="${die.name}${hasSwaps ? ' (linked)' : ''}${hasCrossed ? ' (marked)' : ''}">
                                    ${die.icon}
                                    ${hasSwaps ? '<span class="swap-indicator">&#x27F7;</span>' : ''}
                                    ${hasCrossed ? '<span class="swap-indicator" style="background:#8b0000;">&#x2A02;</span>' : ''}
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

// Render dice tray
function renderDiceTray() {
    const tray = document.getElementById('diceTray');
    if (!tray) return;
    tray.innerHTML = '';

    gameState.players.forEach((player, pIdx) => {
        const group = document.createElement('div');
        group.className = `player-dice-group player-${player.id}`;
        group.innerHTML = `<h4>${player.name}</h4>`;

        const row = document.createElement('div');
        row.className = 'dice-row';

        Object.entries(player.dice).forEach(([type, die]) => {
            const dieEl = document.createElement('div');
            const hasSwaps = die.swaps && die.swaps.length > 0;
            const hasCrossed = die.crossedSegments && die.crossedSegments.length > 0;
            dieEl.className = `die ${die.category} player-${player.id}${hasSwaps ? ' has-swap' : ''}`;
            dieEl.dataset.player = pIdx;
            dieEl.dataset.type = type;

            // Check if this player already rolled this round in boss combat
            const state = gameState.encounterState;
            const alreadyRolled = state?.type === 'boss_combat' &&
                                  state.playersRolledThisRound?.includes(pIdx);

            const canUse = gameState.canRoll &&
                           gameState.allowedDiceTypes.includes(die.category) &&
                           player.hp > 0 &&
                           !alreadyRolled;

            if (!canUse) {
                dieEl.classList.add('disabled');
                if (alreadyRolled) {
                    dieEl.classList.add('already-rolled');
                }
            } else {
                dieEl.onclick = () => rollDie(pIdx, type);
            }

            dieEl.innerHTML = `
                <span class="die-name">${die.name}</span>
                <span class="die-value">${die.lastRoll || 'd20'}</span>
                ${hasSwaps ? `<span class="swap-badge">${die.swaps.length}</span>` : ''}
                ${hasCrossed ? `<span class="swap-badge" style="background:#8b0000;left:-8px;right:auto;">&#x2A02;</span>` : ''}
            `;

            row.appendChild(dieEl);
        });

        group.appendChild(row);
        tray.appendChild(group);
    });
}

// Update DOOM/HOPE/SHIELD display
function updateDoomHopeDisplay() {
    const doomEl = document.getElementById('doomDisplay');
    const goldEl = document.getElementById('goldDisplay');
    const hopeEl = document.getElementById('hopeDisplay');
    const shieldEl = document.getElementById('shieldDisplay');

    if (doomEl) doomEl.textContent = gameState.doom;
    if (goldEl) goldEl.textContent = `${gameState.gold}G`;

    // Render HOPE charges as pips
    if (hopeEl) {
        let hopePips = '';
        for (let i = 0; i < gameState.maxHope; i++) {
            hopePips += `<span class="charge-pip ${i < gameState.hope ? 'filled' : ''}"></span>`;
        }
        hopeEl.innerHTML = hopePips;
    }

    // Render SHIELD charges as pips
    if (shieldEl) {
        let shieldPips = '';
        for (let i = 0; i < gameState.maxShields; i++) {
            shieldPips += `<span class="charge-pip ${i < gameState.shields ? 'filled' : ''}"></span>`;
        }
        shieldEl.innerHTML = shieldPips;
    }
}

// Show pause menu
function showPauseMenu() {
    document.getElementById('pauseModal').classList.add('show');
}

// Close pause menu
function closePauseMenu() {
    document.getElementById('pauseModal').classList.remove('show');
}

// Quit to menu
function quitToMenu() {
    autoSave();
    document.getElementById('pauseModal').classList.remove('show');
    document.getElementById('gameScreen').classList.add('hidden');
    document.getElementById('titleScreen').classList.remove('hidden');
    updateTitleScreenWithSave();
}

// Show how to play screen
function showHowToPlay() {
    document.getElementById('titleScreen').classList.add('hidden');
    document.getElementById('howtoScreen').classList.remove('hidden');
}

// Close how to play screen
function closeHowToPlay() {
    document.getElementById('howtoScreen').classList.add('hidden');
    document.getElementById('titleScreen').classList.remove('hidden');
}

// Render voting UI
function renderVotingUI() {
    const optionsDiv = document.getElementById('encounterOptions');
    const v = gameState.voting;

    let voteStatus = `<div style="margin-bottom:15px; padding:10px; background:rgba(255,215,0,0.1); border-radius:8px; border:1px solid #ffd700;">
        <strong style="color:#ffd700;">VOTE (Round ${v.round}/2)</strong><br>
        <span style="color:#aaa;">Each player picks an option. Majority wins!</span>
    </div>`;

    gameState.players.forEach((player, pIdx) => {
        const voted = v.votes[pIdx] !== undefined;
        const votedFor = voted ? v.options[v.votes[pIdx]].text : 'Not voted';
        voteStatus += `<div style="margin:5px 0; color:${voted ? '#4ade80' : '#888'};">
            ${player.name}: ${voted ? votedFor : '...'}</div>`;
    });

    optionsDiv.innerHTML = voteStatus;

    gameState.players.forEach((player, pIdx) => {
        if (v.votes[pIdx] !== undefined) return;

        const playerVoteDiv = document.createElement('div');
        playerVoteDiv.style.cssText = 'margin-top:15px; padding:10px; background:rgba(255,255,255,0.05); border-radius:8px;';
        playerVoteDiv.innerHTML = `<strong style="color:#88ccff;">${player.name}'s Vote:</strong>`;

        const btnRow = document.createElement('div');
        btnRow.style.cssText = 'display:flex; gap:10px; margin-top:8px; flex-wrap:wrap;';

        v.options.forEach((opt, optIdx) => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.style.cssText = 'flex:1; min-width:120px;';
            btn.textContent = opt.text;

            if (opt.cost && gameState.gold < opt.cost) {
                btn.disabled = true;
                btn.title = 'Not enough gold';
            }

            btn.onclick = () => castVote(pIdx, optIdx);
            btnRow.appendChild(btn);
        });

        playerVoteDiv.appendChild(btnRow);
        optionsDiv.appendChild(playerVoteDiv);
    });
}

// Render shop players section
function renderShopPlayers() {
    const container = document.getElementById('shopPlayers');
    if (!container) return;
    container.innerHTML = '';

    const currentTier = Math.min(gameState.currentStage, 4);

    gameState.players.forEach((player, pIdx) => {
        const section = document.createElement('div');
        section.className = 'shop-player-section';

        const avatar = CHARACTER_AVATARS[player.id];
        section.innerHTML = `
            <h3>${player.name}</h3>
            <div class="shop-upgrades" id="shop-upgrades-${pIdx}"></div>
        `;

        container.appendChild(section);

        const upgradesDiv = section.querySelector(`#shop-upgrades-${pIdx}`);

        SHOP_UPGRADES.forEach(upgrade => {
            const btn = document.createElement('button');
            btn.className = 'shop-upgrade-btn';

            const isPurchased = gameState.purchasedUpgrades.some(
                p => p.playerId === player.id && p.upgradeId === upgrade.id
            );
            const tierLocked = upgrade.tier > currentTier;
            const canAfford = gameState.favor >= upgrade.cost;

            btn.innerHTML = `
                ${upgrade.name}
                <span class="cost">${upgrade.cost} Favor</span>
                ${tierLocked ? `<span class="tier-locked">Stage ${upgrade.tier + 1}+</span>` : ''}
            `;

            if (isPurchased) {
                btn.classList.add('purchased');
                btn.disabled = true;
            } else if (tierLocked || !canAfford) {
                btn.disabled = true;
            }

            btn.onclick = () => purchaseUpgrade(player, pIdx, upgrade);
            upgradesDiv.appendChild(btn);
        });
    });
}

// Show stage shop
function showStageShop() {
    document.getElementById('gameScreen').classList.add('hidden');
    document.getElementById('stageShopScreen').classList.remove('hidden');

    updateShopDisplay();
    renderShopPlayers();
}

// Update shop display
function updateShopDisplay() {
    const favorEl = document.getElementById('favorDisplay');
    if (favorEl) {
        favorEl.textContent = gameState.favor;
    }
}

// Continue from shop to next stage
function continueFromShop() {
    gameState.currentStage++;
    generateMap();

    document.getElementById('stageShopScreen').classList.add('hidden');
    document.getElementById('gameScreen').classList.remove('hidden');

    renderMap();
    renderPlayers();
    renderDiceTray();
    updateDoomHopeDisplay();
    updateFloorDisplay();

    gameState.map[0].status = 'available';
    renderMap();

    const stageInfo = STAGE_INFO[gameState.currentStage];
    log(`--- Stage ${gameState.currentStage}: ${stageInfo.name} ---`, 'info');
    log(`You arrive at ${stageInfo.location}...`, 'info');

    autoSave();
}

// Purchase upgrade in shop
function purchaseUpgrade(player, playerIdx, upgrade) {
    if (gameState.favor < upgrade.cost) return;

    gameState.favor -= upgrade.cost;
    gameState.purchasedUpgrades.push({ playerId: player.id, upgradeId: upgrade.id });

    // Apply upgrade effect
    const effect = upgrade.effect;
    switch (effect.type) {
        case 'upgrade_die': {
            // Upgrade lowest face of a random die
            const dieTypes = Object.keys(player.dice);
            const randomDie = player.dice[dieTypes[Math.floor(Math.random() * dieTypes.length)]];
            const minIdx = randomDie.faces.indexOf(Math.min(...randomDie.faces));
            randomDie.faces[minIdx] += effect.amount;
            log(`${player.name}'s ${randomDie.name} +${effect.amount}!`, 'success');
            break;
        }
        case 'upgrade_all': {
            Object.values(player.dice).forEach(die => {
                const minIdx = die.faces.indexOf(Math.min(...die.faces));
                die.faces[minIdx] += effect.amount;
            });
            log(`${player.name}'s all dice +${effect.amount}!`, 'success');
            break;
        }
        case 'upgrade_best': {
            const bestDie = Object.values(player.dice).reduce((best, die) => {
                const avg = die.faces.reduce((a, b) => a + b, 0) / die.faces.length;
                const bestAvg = best.faces.reduce((a, b) => a + b, 0) / best.faces.length;
                return avg > bestAvg ? die : best;
            });
            const maxIdx = bestDie.faces.indexOf(Math.max(...bestDie.faces));
            bestDie.faces[maxIdx] = Math.min(30, bestDie.faces[maxIdx] + effect.amount);
            log(`${player.name}'s ${bestDie.name} +${effect.amount}!`, 'crit');
            break;
        }
        case 'gold':
            addGold(effect.amount);
            break;
        case 'hope':
            addHope(effect.amount);
            break;
        case 'max_hope':
            gameState.maxHope += effect.amount;
            log(`Max HOPE increased to ${gameState.maxHope}!`, 'hope');
            break;
        case 'doom':
            if (effect.amount < 0) {
                reduceDoom(-effect.amount);
                log(`DOOM reduced by ${-effect.amount}!`, 'success');
            }
            break;
        case 'max_shield':
            gameState.maxShields += effect.amount;
            log(`Max SHIELD increased to ${gameState.maxShields}!`, 'info');
            break;
    }

    updateShopDisplay();
    renderShopPlayers();
    autoSave();
}

// Show upgrade modal
function showUpgradeModal(amount) {
    const modal = document.getElementById('upgradeModal');
    const options = document.getElementById('upgradeOptions');

    document.getElementById('upgradeTitle').textContent = `Add +${amount} to a Die`;
    document.getElementById('upgradeDescription').textContent = 'Choose which die to upgrade:';

    options.innerHTML = '';

    gameState.players.forEach((player, pIdx) => {
        Object.entries(player.dice).forEach(([type, die]) => {
            const opt = document.createElement('div');
            opt.className = 'upgrade-option';
            opt.innerHTML = `
                <h4>${player.name}'s ${die.name}</h4>
                <p>Lowest face: ${Math.min(...die.faces)}</p>
            `;
            opt.onclick = () => {
                const minIdx = die.faces.indexOf(Math.min(...die.faces));
                die.faces[minIdx] += amount;
                log(`Upgraded ${player.name}'s ${die.name}!`, 'success');
                modal.classList.remove('show');
                renderDiceTray();
                completeEncounter();
            };
            options.appendChild(opt);
        });
    });

    modal.classList.add('show');
}

// Apply random upgrade
function applyRandomUpgrade(amount) {
    const randomPlayer = gameState.players[Math.floor(Math.random() * 3)];
    const dieTypes = Object.keys(randomPlayer.dice);
    const randomDieType = dieTypes[Math.floor(Math.random() * dieTypes.length)];
    const die = randomPlayer.dice[randomDieType];

    const minIdx = die.faces.indexOf(Math.min(...die.faces));
    die.faces[minIdx] += amount;
    log(`${randomPlayer.name}'s ${die.name} gets +${amount}!`, 'success');
    renderDiceTray();
}
