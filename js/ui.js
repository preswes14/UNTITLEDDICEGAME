// ==================== UI RENDERING FUNCTIONS ====================

// Solo dice panel state
let soloDicePanelOpen = false;
let soloDiceCollapsedPlayers = {};

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
            const hasHope = die.hopeSegments && die.hopeSegments.length > 0;
            dieEl.className = `die ${die.category} player-${player.id}${hasSwaps ? ' has-swap' : ''}${hasHope ? ' has-hope-segment' : ''}`;
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

            // Build tooltip showing special segments
            let tooltip = die.name;
            if (hasSwaps) tooltip += `\nSwaps: ${die.swaps.map(s => s.faceValue).join(', ')}`;
            if (hasHope) tooltip += `\nHope on: ${die.hopeSegments.join(', ')}`;
            if (hasCrossed) tooltip += `\nMarked: ${die.crossedSegments.join(', ')} (DOOM trigger)`;

            dieEl.title = tooltip;
            dieEl.innerHTML = `
                <span class="die-name">${die.name}</span>
                <span class="die-value">${die.lastRoll || 'd20'}</span>
                ${hasSwaps ? `<span class="swap-badge">${die.swaps.length}</span>` : ''}
                ${hasHope ? `<span class="hope-badge" title="Hope segments: ${die.hopeSegments.join(', ')}">&#x2661;</span>` : ''}
                ${hasCrossed ? `<span class="mark-badge" title="Ferryman marks: ${die.crossedSegments.join(', ')}">&#x2620;</span>` : ''}
            `;

            row.appendChild(dieEl);
        });

        group.appendChild(row);
        tray.appendChild(group);
    });

    // Update solo dice panel if open
    refreshSoloDicePanel();
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
    gameState.encounterNumber = 0; // Reset encounter counter for new stage
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
            trackDiceChange();
            break;
        }
        case 'upgrade_all': {
            Object.values(player.dice).forEach(die => {
                const minIdx = die.faces.indexOf(Math.min(...die.faces));
                die.faces[minIdx] += effect.amount;
            });
            log(`${player.name}'s all dice +${effect.amount}!`, 'success');
            trackDiceChange(3); // 3 dice modified
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
            trackDiceChange();
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

// Apply random upgrade
function applyRandomUpgrade(amount) {
    const randomPlayer = gameState.players[Math.floor(Math.random() * 3)];
    const dieTypes = Object.keys(randomPlayer.dice);
    const randomDieType = dieTypes[Math.floor(Math.random() * dieTypes.length)];
    const die = randomPlayer.dice[randomDieType];

    const minIdx = die.faces.indexOf(Math.min(...die.faces));
    die.faces[minIdx] += amount;
    log(`${randomPlayer.name}'s ${die.name} gets +${amount}!`, 'success');
    trackDiceChange();
    renderDiceTray();
}

// ==================== CONSUMABLES SYSTEM ====================

// Show consumables shop modal
function showConsumablesShop() {
    const modal = document.getElementById('upgradeModal');
    document.getElementById('upgradeTitle').textContent = 'Item Shop';
    document.getElementById('upgradeDescription').innerHTML = `
        <p>Purchase items with Gold. Items are stored in your inventory for later use.</p>
        <p style="color:#ffd700; margin-top:5px;">Current Gold: ${gameState.gold}G | Inventory: ${gameState.consumables.length} items</p>
    `;

    const options = document.getElementById('upgradeOptions');
    options.innerHTML = '';

    // Show available consumables
    Object.values(CONSUMABLES).forEach(item => {
        const canAfford = gameState.gold >= item.cost;
        const opt = document.createElement('div');
        opt.className = `upgrade-option ${canAfford ? '' : 'disabled'}`;
        opt.style.opacity = canAfford ? '1' : '0.5';
        opt.innerHTML = `
            <h4>${item.icon} ${item.name} <span style="color:#ffd700;">(${item.cost}G)</span></h4>
            <p>${item.description}</p>
        `;
        if (canAfford) {
            opt.onclick = () => purchaseConsumable(item.id);
        }
        options.appendChild(opt);
    });

    // Show current inventory
    if (gameState.consumables.length > 0) {
        const invHeader = document.createElement('h4');
        invHeader.style.cssText = 'color:#88ccff; margin-top:20px; margin-bottom:10px;';
        invHeader.textContent = 'Your Inventory:';
        options.appendChild(invHeader);

        const invCounts = {};
        gameState.consumables.forEach(id => {
            invCounts[id] = (invCounts[id] || 0) + 1;
        });

        const invDiv = document.createElement('div');
        invDiv.style.cssText = 'display:flex; gap:10px; flex-wrap:wrap; justify-content:center;';
        Object.entries(invCounts).forEach(([id, count]) => {
            const item = CONSUMABLES[id];
            if (item) {
                const badge = document.createElement('span');
                badge.style.cssText = 'background:rgba(255,255,255,0.1); padding:5px 10px; border-radius:5px;';
                badge.textContent = `${item.icon} ${item.name} x${count}`;
                invDiv.appendChild(badge);
            }
        });
        options.appendChild(invDiv);
    }

    // Close button
    const closeBtn = document.createElement('button');
    closeBtn.className = 'option-btn';
    closeBtn.style.marginTop = '20px';
    closeBtn.textContent = 'Close Shop';
    closeBtn.onclick = () => modal.classList.remove('show');
    options.appendChild(closeBtn);

    modal.classList.add('show');
}

// Purchase a consumable
function purchaseConsumable(itemId) {
    const item = CONSUMABLES[itemId];
    if (!item || gameState.gold < item.cost) return;

    spendGold(item.cost);
    gameState.consumables.push(itemId);
    log(`Purchased ${item.icon} ${item.name}!`, 'success');

    // Refresh the shop
    showConsumablesShop();
    autoSave();
}

// Show inventory and use items
function showInventory() {
    if (gameState.consumables.length === 0) {
        log('Your inventory is empty!', 'info');
        return;
    }

    const modal = document.getElementById('upgradeModal');
    document.getElementById('upgradeTitle').textContent = 'Use Item';
    document.getElementById('upgradeDescription').textContent = 'Select an item to use:';

    const options = document.getElementById('upgradeOptions');
    options.innerHTML = '';

    const invCounts = {};
    gameState.consumables.forEach(id => {
        invCounts[id] = (invCounts[id] || 0) + 1;
    });

    Object.entries(invCounts).forEach(([id, count]) => {
        const item = CONSUMABLES[id];
        if (item) {
            const opt = document.createElement('div');
            opt.className = 'upgrade-option';
            opt.innerHTML = `
                <h4>${item.icon} ${item.name} <span style="color:#888;">x${count}</span></h4>
                <p>${item.description}</p>
            `;
            opt.onclick = () => useConsumable(id);
            options.appendChild(opt);
        }
    });

    // Close button
    const closeBtn = document.createElement('button');
    closeBtn.className = 'option-btn';
    closeBtn.style.marginTop = '20px';
    closeBtn.textContent = 'Cancel';
    closeBtn.onclick = () => modal.classList.remove('show');
    options.appendChild(closeBtn);

    modal.classList.add('show');
}

// Use a consumable
function useConsumable(itemId) {
    const idx = gameState.consumables.indexOf(itemId);
    if (idx === -1) return;

    const item = CONSUMABLES[itemId];
    if (!item) return;

    // Remove from inventory
    gameState.consumables.splice(idx, 1);

    // Apply effect
    switch (item.effect) {
        case 'hope':
            addHope(item.amount);
            log(`Used ${item.icon} ${item.name}! +${item.amount} HOPE`, 'hope');
            break;
        case 'doom_reduce':
            reduceDoom(item.amount);
            log(`Used ${item.icon} ${item.name}! -${item.amount} DOOM`, 'success');
            break;
        case 'gold':
            addGold(item.amount);
            log(`Used ${item.icon} ${item.name}! +${item.amount}G`, 'success');
            break;
        case 'roll_bonus':
            gameState.nextRollBonus = (gameState.nextRollBonus || 0) + item.amount;
            log(`Used ${item.icon} ${item.name}! Next roll +${item.amount}`, 'success');
            break;
        case 'fate_flip':
            const flip = Math.random() < 0.5;
            gameState.nextRollBonus = (gameState.nextRollBonus || 0) + (flip ? 5 : -2);
            log(`Used ${item.icon} ${item.name}! ${flip ? 'Lucky! +5' : 'Unlucky... -2'} to next roll`, flip ? 'crit' : 'fail');
            break;
        case 'reroll':
            gameState.canReroll = true;
            log(`Used ${item.icon} ${item.name}! You can reroll once`, 'success');
            break;
        case 'create_swap':
            // Create a random swap on a random die
            const randomPlayer = gameState.players[Math.floor(Math.random() * 3)];
            const dieTypes = Object.keys(randomPlayer.dice);
            const randomDie = randomPlayer.dice[dieTypes[Math.floor(Math.random() * 3)]];
            const faceValue = Math.floor(Math.random() * 10) + 6;
            const otherPlayers = gameState.players.filter(p => p !== randomPlayer);
            const targetPlayer = otherPlayers[Math.floor(Math.random() * otherPlayers.length)];
            const targetDieType = dieTypes[Math.floor(Math.random() * 3)];
            randomDie.swaps.push({
                faceValue: faceValue,
                targetPlayer: gameState.players.indexOf(targetPlayer),
                targetDieType: targetDieType
            });
            log(`Used ${item.icon} ${item.name}! ${randomPlayer.name}'s ${randomDie.name}: ${faceValue} -> ${targetPlayer.name}`, 'swap');
            trackDiceChange();
            renderDiceTray();
            break;
        case 'remove_mark':
            // Remove a random ferryman mark
            let removed = false;
            for (const player of gameState.players) {
                for (const die of Object.values(player.dice)) {
                    if (die.crossedSegments && die.crossedSegments.length > 0) {
                        die.crossedSegments.pop();
                        log(`Used ${item.icon} ${item.name}! Removed a Ferryman mark from ${player.name}'s ${die.name}`, 'success');
                        removed = true;
                        trackDiceChange();
                        renderDiceTray();
                        break;
                    }
                }
                if (removed) break;
            }
            if (!removed) {
                log(`Used ${item.icon} ${item.name}... but no marks to remove!`, 'info');
                // Refund the item
                gameState.consumables.push(itemId);
            }
            break;
    }

    document.getElementById('upgradeModal').classList.remove('show');
    updateDoomHopeDisplay();
    autoSave();
}

// ==================== SOLO MODE DICE PANEL ====================

// Toggle solo dice panel visibility
function toggleSoloDicePanel() {
    const panel = document.getElementById('soloDicePanel');
    if (!panel) return;

    soloDicePanelOpen = !soloDicePanelOpen;

    if (soloDicePanelOpen) {
        panel.classList.remove('hidden');
        renderSoloDicePanel();
    } else {
        panel.classList.add('hidden');
    }
}

// Show/hide the solo dice toggle button based on game mode
function updateSoloDiceToggle() {
    const toggle = document.getElementById('soloDiceToggle');
    if (!toggle) return;

    if (gameState.gameMode === 'solo') {
        toggle.style.display = 'inline-block';
    } else {
        toggle.style.display = 'none';
        // Also hide the panel if switching modes
        const panel = document.getElementById('soloDicePanel');
        if (panel) panel.classList.add('hidden');
        soloDicePanelOpen = false;
    }
}

// Render the solo dice panel content
function renderSoloDicePanel() {
    const content = document.getElementById('soloDiceContent');
    if (!content || gameState.players.length === 0) return;

    content.innerHTML = '';

    gameState.players.forEach((player, pIdx) => {
        const avatar = CHARACTER_AVATARS[player.id];
        const isCollapsed = soloDiceCollapsedPlayers[pIdx] === true;

        const section = document.createElement('div');
        section.className = 'solo-player-section';

        // Player toggle header
        const toggle = document.createElement('button');
        toggle.className = 'solo-player-toggle player-' + player.id + (isCollapsed ? ' collapsed' : '');
        toggle.innerHTML = '<img src="' + avatar.image + '" alt="' + avatar.color + '" class="player-avatar" style="width:20px;height:20px;border-radius:3px;">' +
            '<span>' + player.name + '</span>' +
            '<span class="toggle-arrow" style="margin-left:auto;">▼</span>';
        toggle.onclick = function() { toggleSoloPlayerSection(pIdx); };
        section.appendChild(toggle);

        // Player dice container
        const diceContainer = document.createElement('div');
        diceContainer.className = 'solo-player-dice' + (isCollapsed ? ' collapsed' : '');
        diceContainer.id = 'solo-player-dice-' + pIdx;

        // Render each die
        Object.entries(player.dice).forEach(function(entry) {
            var type = entry[0];
            var die = entry[1];
            var dieCard = createSoloDieCard(player, type, die);
            diceContainer.appendChild(dieCard);
        });

        section.appendChild(diceContainer);
        content.appendChild(section);
    });
}

// Create a die card for the solo panel
function createSoloDieCard(player, type, die) {
    const card = document.createElement('div');
    card.className = 'solo-die-card';

    // Die info header
    const info = document.createElement('div');
    info.className = 'solo-die-info';
    info.innerHTML = '<span class="solo-die-icon">' + die.icon + '</span>' +
        '<span class="solo-die-name ' + die.category + '">' + die.name + '</span>';
    card.appendChild(info);

    // Die faces
    const facesDiv = document.createElement('div');
    facesDiv.className = 'solo-die-faces';

    // Get swap values, hope segments, and marked segments for highlighting
    const swapValues = (die.swaps || []).map(function(s) { return s.faceValue; });
    const hopeSegments = die.hopeSegments || [];
    const markedSegments = die.crossedSegments || [];

    // Sort faces for display
    const sortedFaces = die.faces.slice().sort(function(a, b) { return a - b; });

    sortedFaces.forEach(function(face) {
        const faceEl = document.createElement('span');
        faceEl.className = 'solo-face';
        faceEl.textContent = face;

        // Add classes based on face value and special status
        if (face === 20) {
            faceEl.classList.add('crit');
        } else if (face >= 15) {
            faceEl.classList.add('high');
        } else if (face <= 3) {
            faceEl.classList.add('low');
        }

        if (swapValues.indexOf(face) !== -1) {
            faceEl.classList.add('swap');
        }

        if (hopeSegments.indexOf(face) !== -1) {
            faceEl.classList.add('hope');
        }

        if (markedSegments.indexOf(face) !== -1) {
            faceEl.classList.add('marked');
        }

        facesDiv.appendChild(faceEl);
    });

    card.appendChild(facesDiv);

    // Meta info (swaps, hope segments, marks)
    const meta = document.createElement('div');
    meta.className = 'solo-die-meta';

    if (swapValues.length > 0) {
        meta.innerHTML += '<span class="swap-count">⇄ ' + swapValues.join(', ') + '</span>';
    }

    if (hopeSegments.length > 0) {
        meta.innerHTML += '<span class="hope-count">♡ ' + hopeSegments.join(', ') + '</span>';
    }

    if (markedSegments.length > 0) {
        meta.innerHTML += '<span class="mark-count">☠ ' + markedSegments.join(', ') + '</span>';
    }

    if (meta.innerHTML) {
        card.appendChild(meta);
    }

    return card;
}

// Toggle a player's section in the solo panel
function toggleSoloPlayerSection(playerIdx) {
    soloDiceCollapsedPlayers[playerIdx] = !soloDiceCollapsedPlayers[playerIdx];

    const toggle = document.querySelector('.solo-player-section:nth-child(' + (playerIdx + 1) + ') .solo-player-toggle');
    const container = document.getElementById('solo-player-dice-' + playerIdx);

    if (toggle && container) {
        if (soloDiceCollapsedPlayers[playerIdx]) {
            toggle.classList.add('collapsed');
            container.classList.add('collapsed');
        } else {
            toggle.classList.remove('collapsed');
            container.classList.remove('collapsed');
        }
    }
}

// Update solo panel when dice change (called after rolls, upgrades, etc.)
function refreshSoloDicePanel() {
    if (soloDicePanelOpen && gameState.gameMode === 'solo') {
        renderSoloDicePanel();
    }
}
