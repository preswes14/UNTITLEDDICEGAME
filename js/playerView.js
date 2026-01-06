// ==================== PLAYER VIEW SYSTEM ====================
// Mobile-first player phone view for private dice viewing

// Player view state
const playerViewState = {
    active: false,
    selectedDie: null,
    currentPhase: 'waiting', // waiting, setup, talent, intertwine, game, combat, shop
    diceScene: null, // Three.js scene for dice
    diceRenderer: null,
    diceCamera: null,
    activeDie3D: null,
    isDragging: false,
    previousMousePosition: { x: 0, y: 0 }
};

// Check if we should show player view
function shouldShowPlayerView() {
    // Check URL params for direct player link
    const params = new URLSearchParams(window.location.search);
    const viewParam = params.get('view');
    const slotParam = params.get('slot');

    if (viewParam === 'player' && slotParam !== null) {
        return true;
    }

    // In multiplayer, non-host players get player view
    if (multiplayerState.enabled && !multiplayerState.isHost) {
        return true;
    }

    return false;
}

// Initialize player view
function initPlayerView() {
    if (!shouldShowPlayerView()) return;

    playerViewState.active = true;

    // Hide host screens, show player view
    document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));

    // Create player view container if it doesn't exist
    let playerViewScreen = document.getElementById('playerViewScreen');
    if (!playerViewScreen) {
        playerViewScreen = createPlayerViewScreen();
        document.body.appendChild(playerViewScreen);
    }

    playerViewScreen.classList.remove('hidden');
    renderPlayerView();
}

// Create the player view screen structure
function createPlayerViewScreen() {
    const screen = document.createElement('div');
    screen.id = 'playerViewScreen';
    screen.className = 'screen player-view-screen';

    screen.innerHTML = `
        <div class="player-view-container">
            <!-- Header -->
            <header class="pv-header">
                <div class="pv-connection-status">
                    <span class="status-dot connected"></span>
                    <span class="status-text">Connected</span>
                </div>
                <div class="pv-player-name">
                    <input type="text" id="pvPlayerName" class="pv-name-input"
                           placeholder="Enter your name..." maxlength="20">
                </div>
                <button class="pv-menu-btn" onclick="showPlayerMenu()">Menu</button>
            </header>

            <!-- Main Content Area -->
            <main class="pv-main">
                <!-- Phase indicator -->
                <div class="pv-phase-indicator">
                    <span class="phase-label">WAITING</span>
                    <span class="phase-desc">Waiting for host to start...</span>
                </div>

                <!-- Dice Display Area -->
                <div class="pv-dice-area">
                    <div id="pvDice3D" class="pv-dice-3d">
                        <!-- Three.js canvas goes here -->
                        <div class="dice-placeholder">
                            <span class="dice-emoji">🎲</span>
                            <p>Select a die below</p>
                        </div>
                    </div>
                    <button class="pv-view-faces-btn" onclick="showFaceListModal()">
                        📋 View All 20 Faces
                    </button>
                </div>

                <!-- Action Area -->
                <div id="pvActions" class="pv-actions">
                    <!-- Phase-specific actions rendered here -->
                </div>
            </main>

            <!-- Footer: Your Dice -->
            <footer class="pv-footer">
                <div class="pv-dice-bar">
                    <div id="pvDiceCards" class="pv-dice-cards">
                        <!-- Your 3 dice cards rendered here -->
                    </div>
                </div>
            </footer>
        </div>

        <!-- Face List Modal -->
        <div id="faceListModal" class="pv-modal">
            <div class="pv-modal-content face-list-content">
                <h2 id="faceListTitle">Die Faces</h2>
                <div id="faceListBody" class="face-list-body"></div>
                <button class="pv-modal-close" onclick="closeFaceListModal()">Close</button>
            </div>
        </div>

        <!-- Player Menu Modal -->
        <div id="playerMenuModal" class="pv-modal">
            <div class="pv-modal-content">
                <h2>Menu</h2>
                <div class="pv-menu-options">
                    <button class="pv-menu-option" onclick="requestSaveGame()">Save Game</button>
                    <button class="pv-menu-option" onclick="showHowToPlayPlayer()">How to Play</button>
                    <button class="pv-menu-option danger" onclick="leaveGame()">Leave Game</button>
                </div>
                <button class="pv-modal-close" onclick="closePlayerMenu()">Resume</button>
            </div>
        </div>
    `;

    // Add event listeners
    setTimeout(() => {
        const nameInput = document.getElementById('pvPlayerName');
        if (nameInput) {
            nameInput.addEventListener('change', handleNameChange);
            nameInput.addEventListener('blur', handleNameChange);
        }
    }, 100);

    return screen;
}

// Render the player view based on current state
function renderPlayerView() {
    if (!playerViewState.active) return;

    const player = getMyPlayer();
    if (!player) {
        renderWaitingState();
        return;
    }

    // Update name input
    const nameInput = document.getElementById('pvPlayerName');
    if (nameInput && !nameInput.matches(':focus')) {
        nameInput.value = player.name || '';
    }

    // Render dice cards
    renderPlayerDiceCards(player);

    // Render phase-specific content
    renderPhaseContent();

    // Update connection status
    updateConnectionStatus();
}

// Get the current player's data
function getMyPlayer() {
    if (!multiplayerState.enabled) return null;

    const playerIndex = multiplayerState.playerSlot;
    if (playerIndex === null || playerIndex === undefined) return null;

    return gameState.players[playerIndex] || null;
}

// Render waiting state (before game starts)
function renderWaitingState() {
    updatePhaseIndicator('WAITING', 'Waiting for host to start the game...');

    const actionsDiv = document.getElementById('pvActions');
    if (actionsDiv) {
        actionsDiv.innerHTML = `
            <div class="pv-waiting-message">
                <div class="waiting-spinner"></div>
                <p>Room Code: <strong>${multiplayerState.roomCode || '----'}</strong></p>
                <p>You are Player ${(multiplayerState.playerSlot || 0) + 1}</p>
            </div>
        `;
    }
}

// Render the player's 3 dice as cards
function renderPlayerDiceCards(player) {
    const container = document.getElementById('pvDiceCards');
    if (!container || !player || !player.dice) return;

    const categories = ['physical', 'verbal', 'preventative'];

    container.innerHTML = categories.map(cat => {
        const die = player.dice[cat];
        if (!die) return '';

        const isSelected = playerViewState.selectedDie === cat;
        const swapCount = die.swaps ? die.swaps.length : 0;
        const hopeCount = die.hopeSegments ? die.hopeSegments.length : 0;
        const markCount = die.crossedSegments ? die.crossedSegments.length : 0;

        return `
            <div class="pv-dice-card ${cat} ${isSelected ? 'selected' : ''}"
                 onclick="selectDieForViewing('${cat}')">
                <div class="dice-card-header">
                    <span class="dice-card-icon">${die.icon || '🎲'}</span>
                    <span class="dice-card-name">${die.name}</span>
                </div>
                <div class="dice-card-category">${cat}</div>
                <div class="dice-card-badges">
                    ${swapCount > 0 ? `<span class="badge swap-badge" title="${swapCount} swaps">🔗${swapCount}</span>` : ''}
                    ${hopeCount > 0 ? `<span class="badge hope-badge" title="${hopeCount} hope faces">✨${hopeCount}</span>` : ''}
                    ${markCount > 0 ? `<span class="badge mark-badge" title="${markCount} ferryman marks">☠️${markCount}</span>` : ''}
                </div>
                ${die.lastRoll ? `<div class="dice-card-last-roll">Last: ${die.lastRoll}</div>` : ''}
            </div>
        `;
    }).join('');
}

// Select a die to view in 3D
function selectDieForViewing(category) {
    const player = getMyPlayer();
    if (!player || !player.dice[category]) return;

    playerViewState.selectedDie = category;

    // Update card selection
    document.querySelectorAll('.pv-dice-card').forEach(card => {
        card.classList.remove('selected');
    });
    document.querySelector(`.pv-dice-card.${category}`)?.classList.add('selected');

    // Update 3D view
    const die = player.dice[category];
    render3DDie(die);
}

// Update phase indicator
function updatePhaseIndicator(label, description) {
    const labelEl = document.querySelector('.pv-phase-indicator .phase-label');
    const descEl = document.querySelector('.pv-phase-indicator .phase-desc');

    if (labelEl) labelEl.textContent = label;
    if (descEl) descEl.textContent = description;
}

// Render phase-specific content
function renderPhaseContent() {
    const phase = playerViewState.currentPhase;

    switch (phase) {
        case 'waiting':
            renderWaitingState();
            break;
        case 'talent_best':
            renderTalentBestPhase();
            break;
        case 'talent_worst':
            renderTalentWorstPhase();
            break;
        case 'intertwine':
            renderIntertwinePhase();
            break;
        case 'game':
            renderGamePhase();
            break;
        case 'combat':
            renderCombatPhase();
            break;
        case 'shop':
            renderShopPhase();
            break;
        default:
            renderWaitingState();
    }
}

// Talent Ranking - Best selection
function renderTalentBestPhase() {
    updatePhaseIndicator('TALENT RANKING', 'Select your BEST die (gets a bonus!)');

    const player = getMyPlayer();
    if (!player) return;

    const actionsDiv = document.getElementById('pvActions');
    if (!actionsDiv) return;

    actionsDiv.innerHTML = `
        <p class="pv-instruction">Tap the die you're BEST at:</p>
        <div class="pv-talent-options">
            ${['physical', 'verbal', 'preventative'].map(cat => {
                const die = player.dice[cat];
                if (!die) return '';
                return `
                    <button class="pv-talent-btn ${cat}" onclick="selectTalentBest('${cat}')">
                        <span class="talent-icon">${die.icon}</span>
                        <span class="talent-name">${die.name}</span>
                    </button>
                `;
            }).join('')}
        </div>
        <p class="pv-hint">Your best die will have one face upgraded to 20!</p>
    `;
}

// Talent Ranking - Worst selection
function renderTalentWorstPhase() {
    updatePhaseIndicator('TALENT RANKING', 'Select your WORST die (gets a penalty)');

    const player = getMyPlayer();
    const ranking = playerViewState.talentRanking || {};

    if (!player) return;

    const actionsDiv = document.getElementById('pvActions');
    if (!actionsDiv) return;

    actionsDiv.innerHTML = `
        <p class="pv-instruction">Tap the die you're WORST at:</p>
        <div class="pv-talent-options">
            ${['physical', 'verbal', 'preventative'].map(cat => {
                if (cat === ranking.best) return ''; // Can't pick same as best
                const die = player.dice[cat];
                if (!die) return '';
                return `
                    <button class="pv-talent-btn ${cat}" onclick="selectTalentWorst('${cat}')">
                        <span class="talent-icon">${die.icon}</span>
                        <span class="talent-name">${die.name}</span>
                    </button>
                `;
            }).join('')}
        </div>
        <p class="pv-hint">Your worst die will have one face downgraded to 1...</p>
    `;
}

// Intertwine phase
function renderIntertwinePhase() {
    updatePhaseIndicator('INTERTWINE', 'Link your dice to your allies!');

    const actionsDiv = document.getElementById('pvActions');
    if (!actionsDiv) return;

    // This will be populated by the host's state sync
    actionsDiv.innerHTML = `
        <div class="pv-intertwine-content">
            <p>Choose a number (6-10) and an ally's die to link to.</p>
            <div id="pvIntertwineOptions"></div>
        </div>
    `;
}

// Game phase (exploring map, encounters)
function renderGamePhase() {
    updatePhaseIndicator('ADVENTURE', 'Explore and overcome challenges!');

    const actionsDiv = document.getElementById('pvActions');
    if (!actionsDiv) return;

    actionsDiv.innerHTML = `
        <div class="pv-game-status">
            <p>Watch the shared screen for the current encounter.</p>
            <p>Your dice are ready when you need them!</p>
        </div>
    `;
}

// Combat phase
function renderCombatPhase() {
    updatePhaseIndicator('COMBAT', 'Roll your dice to overcome the challenge!');

    const player = getMyPlayer();
    if (!player) return;

    const actionsDiv = document.getElementById('pvActions');
    if (!actionsDiv) return;

    const canRoll = gameState.canRoll;
    const allowedTypes = gameState.allowedDiceTypes || [];

    actionsDiv.innerHTML = `
        <div class="pv-combat-actions">
            <p class="pv-instruction">${canRoll ? 'Tap a die to roll!' : 'Waiting...'}</p>
            <div class="pv-roll-buttons">
                ${['physical', 'verbal', 'preventative'].map(cat => {
                    const die = player.dice[cat];
                    if (!die) return '';
                    const allowed = allowedTypes.includes(cat);
                    return `
                        <button class="pv-roll-btn ${cat} ${allowed ? '' : 'disabled'}"
                                onclick="playerRollDie('${cat}')"
                                ${!canRoll || !allowed ? 'disabled' : ''}>
                            <span class="roll-icon">${die.icon}</span>
                            <span class="roll-name">${die.name}</span>
                        </button>
                    `;
                }).join('')}
            </div>
        </div>
    `;
}

// Shop phase
function renderShopPhase() {
    updatePhaseIndicator('SHOP', 'Upgrade your dice!');

    const actionsDiv = document.getElementById('pvActions');
    if (!actionsDiv) return;

    actionsDiv.innerHTML = `
        <div class="pv-shop-info">
            <p>Upgrades available on the shared screen.</p>
            <p>Claim upgrades for your dice!</p>
        </div>
    `;
}

// Handle name change
function handleNameChange(e) {
    const newName = e.target.value.trim();
    if (!newName) return;

    // Send name update to host
    sendPlayerAction('update_name', { name: newName });
}

// Player initiates a die roll
function playerRollDie(category) {
    if (!gameState.canRoll) return;

    const playerIndex = multiplayerState.playerSlot;

    // Send roll action to host
    sendPlayerAction('roll_die', {
        playerIndex: playerIndex,
        dieType: category
    });
}

// Select talent best
function selectTalentBest(category) {
    playerViewState.talentRanking = playerViewState.talentRanking || {};
    playerViewState.talentRanking.best = category;

    // Show confirmation
    showConfirmation({
        title: 'Confirm Best Die',
        message: `Set your ${category.toUpperCase()} die as your BEST?\n\nThis will upgrade one face to 20!`,
        confirmText: 'Confirm',
        onConfirm: () => {
            sendPlayerAction('talent_select', {
                type: 'best',
                category: category
            });
            playerViewState.currentPhase = 'talent_worst';
            renderPhaseContent();
        }
    });
}

// Select talent worst
function selectTalentWorst(category) {
    playerViewState.talentRanking = playerViewState.talentRanking || {};
    playerViewState.talentRanking.worst = category;

    // Show confirmation
    showConfirmation({
        title: 'Confirm Worst Die',
        message: `Set your ${category.toUpperCase()} die as your WORST?\n\nThis will downgrade one face to 1...`,
        confirmText: 'Confirm',
        danger: true,
        onConfirm: () => {
            sendPlayerAction('talent_select', {
                type: 'worst',
                category: category
            });
            // Move to intertwine or wait
            playerViewState.currentPhase = 'intertwine';
            renderPhaseContent();
        }
    });
}

// Update connection status indicator
function updateConnectionStatus() {
    const dot = document.querySelector('.pv-connection-status .status-dot');
    const text = document.querySelector('.pv-connection-status .status-text');

    if (!dot || !text) return;

    if (multiplayerState.enabled && multiplayerState.channel) {
        dot.className = 'status-dot connected';
        text.textContent = 'Connected';
    } else {
        dot.className = 'status-dot disconnected';
        text.textContent = 'Disconnected';
    }
}

// Show face list modal
function showFaceListModal() {
    const player = getMyPlayer();
    const category = playerViewState.selectedDie;

    if (!player || !category) {
        alert('Select a die first!');
        return;
    }

    const die = player.dice[category];
    if (!die) return;

    const modal = document.getElementById('faceListModal');
    const title = document.getElementById('faceListTitle');
    const body = document.getElementById('faceListBody');

    if (!modal || !title || !body) return;

    title.textContent = `${die.name} - All 20 Faces`;

    // Build face list
    const baseFaces = die.baseFaces || Array.from({length: 20}, (_, i) => i + 1);
    const currentFaces = die.faces;

    body.innerHTML = currentFaces.map((value, index) => {
        const originalValue = index + 1;
        const baseValue = baseFaces[index];
        const isModified = value !== originalValue;
        const isUpgraded = value > baseValue;
        const isDowngraded = value < baseValue;

        // Check for swaps on this face value
        const swap = die.swaps?.find(s => s.faceValue === value);
        const hasHope = die.hopeSegments?.includes(value);
        const hasMark = die.crossedSegments?.includes(value);

        let statusClass = '';
        let statusText = '';

        if (isUpgraded) {
            statusClass = 'upgraded';
            statusText = `+${value - baseValue}`;
        } else if (isDowngraded) {
            statusClass = 'downgraded';
            statusText = `${value - baseValue}`;
        }

        return `
            <div class="face-list-item ${statusClass}">
                <span class="face-index">${originalValue}:</span>
                <span class="face-value">${value}</span>
                ${statusText ? `<span class="face-change">(${statusText})</span>` : ''}
                <span class="face-badges">
                    ${swap ? `<span class="face-badge swap" title="Links to ${gameState.players[swap.targetPlayer]?.name}'s ${swap.targetDieType}">🔗</span>` : ''}
                    ${hasHope ? `<span class="face-badge hope" title="Grants HOPE when rolled">✨</span>` : ''}
                    ${hasMark ? `<span class="face-badge mark" title="Ferryman's mark - triggers DOOM">☠️</span>` : ''}
                </span>
            </div>
        `;
    }).join('');

    modal.classList.add('show');
}

// Close face list modal
function closeFaceListModal() {
    const modal = document.getElementById('faceListModal');
    if (modal) modal.classList.remove('show');
}

// Show player menu
function showPlayerMenu() {
    const modal = document.getElementById('playerMenuModal');
    if (modal) modal.classList.add('show');
}

// Close player menu
function closePlayerMenu() {
    const modal = document.getElementById('playerMenuModal');
    if (modal) modal.classList.remove('show');
}

// Request save game from host
function requestSaveGame() {
    sendPlayerAction('request_save', {});
    closePlayerMenu();
    alert('Save request sent to host.');
}

// Leave game
function leaveGame() {
    showConfirmation({
        title: 'Leave Game?',
        message: 'Are you sure you want to leave? You can rejoin with the same room code.',
        confirmText: 'Leave',
        danger: true,
        onConfirm: () => {
            leaveRoom();
            window.location.reload();
        }
    });
}

// Update player view when state syncs from host
function onStateSync() {
    if (!playerViewState.active) return;

    // Determine current phase based on game state
    if (gameState.encounterState?.type === 'combat' || gameState.encounterState?.type === 'boss_combat') {
        playerViewState.currentPhase = 'combat';
    } else if (gameState.encounterState?.type === 'shop') {
        playerViewState.currentPhase = 'shop';
    } else if (gameState.players.length > 0) {
        playerViewState.currentPhase = 'game';
    } else {
        playerViewState.currentPhase = 'waiting';
    }

    renderPlayerView();
}

// ==================== DRAFT UI SYSTEM ====================

// Render draft UI for player view
function renderDraftUI() {
    if (!draftState.active) return;

    const actionsDiv = document.getElementById('pvActions');
    if (!actionsDiv) return;

    const status = getDraftStatus();
    if (!status) return;

    let modeLabel = '';
    let modeDesc = '';

    switch (status.mode) {
        case DRAFT_MODES.FCFS:
            modeLabel = 'FIRST COME, FIRST SERVED';
            modeDesc = 'Tap to claim - fastest wins!';
            break;
        case DRAFT_MODES.SNAKE:
            const currentPicker = status.snakeCurrentPicker;
            const isMyTurn = currentPicker === multiplayerState.playerSlot;
            const pickerName = currentPicker !== null ?
                (gameState.players[currentPicker]?.name || `Player ${currentPicker + 1}`) : 'Unknown';
            modeLabel = 'SNAKE DRAFT';
            modeDesc = isMyTurn ? "It's YOUR turn to pick!" : `Waiting for ${pickerName}...`;
            break;
        case DRAFT_MODES.DIBS:
            modeLabel = 'CALL DIBS';
            modeDesc = 'Call dibs and hold for 5 seconds!';
            break;
    }

    updatePhaseIndicator(modeLabel, modeDesc);

    actionsDiv.innerHTML = `
        <div class="pv-draft-container">
            <div class="pv-draft-items" id="pvDraftItems">
                ${renderDraftItems(status)}
            </div>
        </div>
    `;
}

// Render individual draft items
function renderDraftItems(status) {
    return status.items.map(item => {
        const isClaimed = item.claimed;
        const claimedByMe = item.claimedBySlot === multiplayerState.playerSlot;
        const canClaim = !isClaimed && canPlayerClaim(multiplayerState.playerSlot, item.id);

        // Check for dibs on this item
        const dibs = status.dibsTimers?.[item.id];
        const hasDibs = dibs && dibs.timeLeft > 0;
        const myDibs = hasDibs && dibs.playerSlot === multiplayerState.playerSlot;

        let statusClass = '';
        let statusBadge = '';

        if (isClaimed) {
            statusClass = claimedByMe ? 'claimed-mine' : 'claimed-other';
            statusBadge = `<span class="claim-badge">${claimedByMe ? 'YOURS!' : `${item.claimedBy}`}</span>`;
        } else if (hasDibs) {
            statusClass = myDibs ? 'my-dibs' : 'other-dibs';
            statusBadge = `<span class="dibs-badge">${myDibs ? `HOLDING (${dibs.timeLeft}s)` : `${dibs.playerName} (${dibs.timeLeft}s)`}</span>`;
        }

        const clickHandler = isClaimed ? '' :
            (status.mode === DRAFT_MODES.DIBS && myDibs ?
                `onclick="cancelPlayerDibs('${item.id}')"` :
                `onclick="claimDraftItemFromUI('${item.id}')"`);

        return `
            <div class="pv-draft-item ${statusClass} ${canClaim ? 'can-claim' : ''}" ${clickHandler}>
                <div class="draft-item-name">${item.name}</div>
                <div class="draft-item-desc">${item.description || ''}</div>
                ${statusBadge}
                ${!isClaimed && canClaim && !hasDibs ? '<div class="draft-item-action">TAP TO CLAIM</div>' : ''}
                ${hasDibs && myDibs ? '<div class="draft-item-action">TAP TO CANCEL</div>' : ''}
            </div>
        `;
    }).join('');
}

// Claim a draft item from UI
function claimDraftItemFromUI(itemId) {
    const playerSlot = multiplayerState.playerSlot;
    const playerId = multiplayerState.playerId;
    const player = getMyPlayer();
    const playerName = player?.name || `Player ${playerSlot + 1}`;

    // Show confirmation for important claims
    const item = draftState.items.find(i => i.id === itemId);
    if (item) {
        showConfirmation({
            title: 'Claim Upgrade?',
            message: `Claim "${item.name}"?\n\n${item.description || ''}`,
            confirmText: 'Claim!',
            onConfirm: () => {
                const result = claimDraftItem(itemId, playerId, playerSlot, playerName);
                if (result.success === false) {
                    log(result.reason, 'fail');
                }
            }
        });
    }
}

// Cancel dibs from UI
function cancelPlayerDibs(itemId) {
    cancelDibs(itemId, multiplayerState.playerId);
}

// Update draft item UI when claim happens
function updateDraftItemUI(itemId, playerName) {
    const item = draftState.items.find(i => i.id === itemId);
    const itemEl = document.querySelector(`[data-item-id="${itemId}"]`);

    if (itemEl && item) {
        itemEl.classList.add('claimed');
        itemEl.classList.remove('can-claim');

        const badge = document.createElement('span');
        badge.className = 'claim-badge';
        badge.textContent = `${playerName}`;
        itemEl.appendChild(badge);
    }

    // Re-render if still active
    if (draftState.active) {
        renderDraftUI();
    }
}

// Update dibs UI countdown
function updateDibsUI(itemId, playerSlot, playerName, timeLeft) {
    if (!draftState.active) return;

    // Re-render the draft UI to show updated countdown
    renderDraftUI();
}

// Update snake UI when turn changes
function updateSnakeUI(currentPicker) {
    if (!draftState.active) return;

    const isMyTurn = currentPicker === multiplayerState.playerSlot;
    const pickerName = currentPicker !== null ?
        (gameState.players[currentPicker]?.name || `Player ${currentPicker + 1}`) : 'Unknown';

    const desc = isMyTurn ? "It's YOUR turn to pick!" : `Waiting for ${pickerName}...`;
    updatePhaseIndicator('SNAKE DRAFT', desc);

    // Show notification if it's my turn
    if (isMyTurn) {
        log("Your turn! Pick an upgrade!", 'success');
    }

    renderDraftUI();
}

// Hide draft UI
function hideDraftUI() {
    // Return to normal game phase
    playerViewState.currentPhase = 'game';
    renderPhaseContent();
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Check URL for player view mode
    const params = new URLSearchParams(window.location.search);
    if (params.get('view') === 'player') {
        // Will init after multiplayer connects
        console.log('Player view mode detected');
    }
});
