// ==================== SCREEN MANAGEMENT ====================

// Action assignment state
let actionAssignments = {
    physical: [null, null, null],
    verbal: [null, null, null],
    preventative: [null, null, null]
};

// ==================== GAME MODE MENUS ====================

// Show solo game menu
function showSoloMenu() {
    gameState.gameMode = 'solo';

    const modal = document.getElementById('upgradeModal');
    document.getElementById('upgradeTitle').textContent = 'Solo Game';

    const hasSave = hasAnySaveDataForMode('solo');
    const mostRecent = getMostRecentSaveForMode('solo');

    let savePreview = '';
    if (mostRecent) {
        savePreview = `
            <div class="save-preview-box">
                <span class="save-stage">Slot ${mostRecent.idx + 1}: ${mostRecent.info.stageName}</span>
                <span class="save-details">Progress: ${mostRecent.info.progressStr} | Dice: ${mostRecent.info.diceChanges}</span>
                <span class="save-time">${formatSaveTime(mostRecent.info.timestamp)}</span>
            </div>
        `;
    }

    document.getElementById('upgradeDescription').innerHTML = `
        <p>Control all 3 heroes yourself!</p>
        <p style="color:#888; font-size:0.85rem; margin-top:5px;">View all dice at once with the expanded dice tray.</p>
        ${savePreview}
    `;

    const options = document.getElementById('upgradeOptions');
    options.innerHTML = '';

    // Continue button (if save exists)
    if (hasSave) {
        const continueBtn = document.createElement('button');
        continueBtn.className = 'option-btn primary';
        continueBtn.textContent = '▶ Continue';
        continueBtn.onclick = () => {
            modal.classList.remove('show');
            showSoloSaveSlotScreen('load');
        };
        options.appendChild(continueBtn);
    }

    // New Game button
    const newBtn = document.createElement('button');
    newBtn.className = 'option-btn';
    newBtn.textContent = '+ New Solo Game';
    newBtn.onclick = () => {
        modal.classList.remove('show');
        if (hasSave) {
            showSoloSaveSlotScreen('new');
        } else {
            startSoloGame(0);
        }
    };
    options.appendChild(newBtn);

    // Back button
    const backBtn = document.createElement('button');
    backBtn.className = 'option-btn secondary';
    backBtn.style.marginTop = '10px';
    backBtn.textContent = 'Back';
    backBtn.onclick = () => modal.classList.remove('show');
    options.appendChild(backBtn);

    modal.classList.add('show');
}

// Show solo save slot selection
function showSoloSaveSlotScreen(mode = 'load') {
    gameState.gameMode = 'solo';

    const modal = document.getElementById('upgradeModal');
    document.getElementById('upgradeTitle').textContent = mode === 'load' ? 'Continue Solo Game' : 'New Solo Game';
    document.getElementById('upgradeDescription').textContent = 'Select a save slot:';

    const options = document.getElementById('upgradeOptions');
    options.innerHTML = '';

    const allSaveInfo = getAllSaveInfoForMode('solo');

    allSaveInfo.forEach((info, idx) => {
        const slotDiv = document.createElement('div');
        slotDiv.className = `save-slot-option ${info ? 'has-data' : 'empty'}`;

        if (info) {
            slotDiv.innerHTML = `
                <div class="slot-header">
                    <span class="slot-number">Slot ${idx + 1}</span>
                    <span class="slot-progress">${info.progressStr}</span>
                </div>
                <div class="slot-details">
                    <span class="slot-stage">${info.stageName}</span>
                    <span class="slot-stats">Dice: ${info.diceChanges}</span>
                    <span class="slot-time">${formatSaveTime(info.timestamp)}</span>
                </div>
            `;
            if (mode === 'load') {
                slotDiv.onclick = () => {
                    modal.classList.remove('show');
                    continueSoloGame(idx);
                };
            } else {
                slotDiv.onclick = () => {
                    if (confirm(`Overwrite save in Slot ${idx + 1}?`)) {
                        modal.classList.remove('show');
                        startSoloGame(idx);
                    }
                };
            }
        } else {
            slotDiv.innerHTML = `
                <div class="slot-header">
                    <span class="slot-number">Slot ${idx + 1}</span>
                    <span class="slot-empty">Empty</span>
                </div>
            `;
            slotDiv.onclick = () => {
                modal.classList.remove('show');
                startSoloGame(idx);
            };
        }

        options.appendChild(slotDiv);
    });

    // Back button
    const backBtn = document.createElement('button');
    backBtn.className = 'option-btn secondary';
    backBtn.style.marginTop = '15px';
    backBtn.textContent = 'Back';
    backBtn.onclick = () => {
        modal.classList.remove('show');
        showSoloMenu();
    };
    options.appendChild(backBtn);

    modal.classList.add('show');
}

// Start a new solo game
function startSoloGame(slot) {
    gameState.gameMode = 'solo';
    gameState.currentSaveSlot = slot;
    deleteSave(slot);
    startNewGame();
}

// Continue solo game from save
function continueSoloGame(slot) {
    gameState.gameMode = 'solo';
    continueGame(slot);
}

// Show multiplayer game menu
function showMultiplayerGameMenu() {
    gameState.gameMode = 'multiplayer';

    const modal = document.getElementById('upgradeModal');
    document.getElementById('upgradeTitle').textContent = 'Multiplayer Game';

    const hasSave = hasAnySaveDataForMode('multiplayer');
    const mostRecent = getMostRecentSaveForMode('multiplayer');

    let savePreview = '';
    if (mostRecent) {
        savePreview = `
            <div class="save-preview-box">
                <span class="save-stage">Slot ${mostRecent.idx + 1}: ${mostRecent.info.stageName}</span>
                <span class="save-details">Progress: ${mostRecent.info.progressStr}</span>
                <span class="save-time">${formatSaveTime(mostRecent.info.timestamp)}</span>
            </div>
        `;
    }

    document.getElementById('upgradeDescription').innerHTML = `
        <p>Play with friends on separate devices!</p>
        <p style="color:#888; font-size:0.85rem; margin-top:5px;">Each player uses their phone to view their private dice.</p>
        ${savePreview}
    `;

    const options = document.getElementById('upgradeOptions');
    options.innerHTML = '';

    // Continue button (if save exists)
    if (hasSave) {
        const continueBtn = document.createElement('button');
        continueBtn.className = 'option-btn primary';
        continueBtn.textContent = '▶ Continue Multiplayer';
        continueBtn.onclick = () => {
            modal.classList.remove('show');
            showMultiplayerSaveSlotScreen('load');
        };
        options.appendChild(continueBtn);
    }

    // Host new game
    const hostBtn = document.createElement('button');
    hostBtn.className = 'option-btn';
    hostBtn.textContent = '🏠 Host New Game';
    hostBtn.onclick = () => {
        modal.classList.remove('show');
        if (hasSave) {
            showMultiplayerSaveSlotScreen('new');
        } else {
            startMultiplayerGame(0, true);
        }
    };
    options.appendChild(hostBtn);

    // Join game
    const joinBtn = document.createElement('button');
    joinBtn.className = 'option-btn';
    joinBtn.textContent = '🔗 Join Game';
    joinBtn.onclick = () => {
        modal.classList.remove('show');
        showJoinGameModal();
    };
    options.appendChild(joinBtn);

    // Back button
    const backBtn = document.createElement('button');
    backBtn.className = 'option-btn secondary';
    backBtn.style.marginTop = '10px';
    backBtn.textContent = 'Back';
    backBtn.onclick = () => modal.classList.remove('show');
    options.appendChild(backBtn);

    modal.classList.add('show');
}

// Show multiplayer save slot selection
function showMultiplayerSaveSlotScreen(mode = 'load') {
    gameState.gameMode = 'multiplayer';

    const modal = document.getElementById('upgradeModal');
    document.getElementById('upgradeTitle').textContent = mode === 'load' ? 'Continue Multiplayer' : 'New Multiplayer Game';
    document.getElementById('upgradeDescription').textContent = 'Select a save slot:';

    const options = document.getElementById('upgradeOptions');
    options.innerHTML = '';

    const allSaveInfo = getAllSaveInfoForMode('multiplayer');

    allSaveInfo.forEach((info, idx) => {
        const slotDiv = document.createElement('div');
        slotDiv.className = `save-slot-option ${info ? 'has-data' : 'empty'}`;

        if (info) {
            slotDiv.innerHTML = `
                <div class="slot-header">
                    <span class="slot-number">Slot ${idx + 1}</span>
                    <span class="slot-progress">${info.progressStr}</span>
                </div>
                <div class="slot-details">
                    <span class="slot-stage">${info.stageName}</span>
                    <span class="slot-time">${formatSaveTime(info.timestamp)}</span>
                </div>
            `;
            if (mode === 'load') {
                slotDiv.onclick = () => {
                    modal.classList.remove('show');
                    continueMultiplayerGame(idx);
                };
            } else {
                slotDiv.onclick = () => {
                    if (confirm(`Overwrite save in Slot ${idx + 1}?`)) {
                        modal.classList.remove('show');
                        startMultiplayerGame(idx, true);
                    }
                };
            }
        } else {
            slotDiv.innerHTML = `
                <div class="slot-header">
                    <span class="slot-number">Slot ${idx + 1}</span>
                    <span class="slot-empty">Empty</span>
                </div>
            `;
            slotDiv.onclick = () => {
                modal.classList.remove('show');
                startMultiplayerGame(idx, true);
            };
        }

        options.appendChild(slotDiv);
    });

    // Back button
    const backBtn = document.createElement('button');
    backBtn.className = 'option-btn secondary';
    backBtn.style.marginTop = '15px';
    backBtn.textContent = 'Back';
    backBtn.onclick = () => {
        modal.classList.remove('show');
        showMultiplayerGameMenu();
    };
    options.appendChild(backBtn);

    modal.classList.add('show');
}

// Start a new multiplayer game as host
function startMultiplayerGame(slot, isHost = true) {
    gameState.gameMode = 'multiplayer';
    gameState.currentSaveSlot = slot;

    if (isHost) {
        deleteSave(slot);
        // Create and host room, then start game
        showHostSetupModal();
    }
}

// Show host setup modal (room creation)
function showHostSetupModal() {
    const modal = document.getElementById('upgradeModal');
    document.getElementById('upgradeTitle').textContent = 'Host Game';
    document.getElementById('upgradeDescription').innerHTML = `
        <p>Create a room for your friends to join.</p>
        <p style="color:#888; font-size:0.85rem;">Share the room code via Discord or text.</p>
    `;

    const options = document.getElementById('upgradeOptions');
    options.innerHTML = `
        <button class="option-btn primary" onclick="createAndHostRoom()">Create Room</button>
        <button class="option-btn secondary" onclick="showMultiplayerGameMenu()">Back</button>
    `;

    modal.classList.add('show');
}

// Create room and start as host
async function createAndHostRoom() {
    const modal = document.getElementById('upgradeModal');

    try {
        document.getElementById('upgradeDescription').innerHTML = '<p>Creating room...</p>';

        await createRoom();

        // Show room code
        document.getElementById('upgradeTitle').textContent = 'Room Created!';
        document.getElementById('upgradeDescription').innerHTML = `
            <p>Share this code with your friends:</p>
            <div class="room-code-display">${multiplayerState.roomCode}</div>
            <p style="color:#888; font-size:0.85rem; margin-top:10px;">
                Game URL: <span style="color:#ffd700;">${window.location.origin}${window.location.pathname}</span>
            </p>
            <p style="color:#888; font-size:0.85rem;">Waiting for players to join...</p>
        `;

        const options = document.getElementById('upgradeOptions');
        options.innerHTML = `
            <button class="option-btn primary" onclick="startGameFromLobby()">Start Game</button>
            <button class="option-btn secondary" onclick="leaveRoom(); showMultiplayerGameMenu();">Cancel</button>
        `;
    } catch (error) {
        document.getElementById('upgradeDescription').innerHTML = `
            <p style="color:#ff6666;">Failed to create room: ${error.message}</p>
        `;
    }
}

// Start game from lobby
function startGameFromLobby() {
    const modal = document.getElementById('upgradeModal');
    modal.classList.remove('show');
    startNewGame();
}

// Continue multiplayer game from save
function continueMultiplayerGame(slot) {
    gameState.gameMode = 'multiplayer';

    // For multiplayer continue, we need to create a room first
    const modal = document.getElementById('upgradeModal');
    document.getElementById('upgradeTitle').textContent = 'Continue Multiplayer';
    document.getElementById('upgradeDescription').innerHTML = `
        <p>Create a room to continue your saved game.</p>
        <p style="color:#888; font-size:0.85rem;">Players will need to rejoin with the new room code.</p>
    `;

    const options = document.getElementById('upgradeOptions');
    options.innerHTML = `
        <button class="option-btn primary" onclick="createRoomAndContinue(${slot})">Create Room</button>
        <button class="option-btn secondary" onclick="showMultiplayerGameMenu()">Back</button>
    `;

    modal.classList.add('show');
}

// Create room and continue from save
async function createRoomAndContinue(slot) {
    const modal = document.getElementById('upgradeModal');

    try {
        document.getElementById('upgradeDescription').innerHTML = '<p>Creating room...</p>';

        await createRoom();

        // Show room code
        document.getElementById('upgradeTitle').textContent = 'Room Created!';
        document.getElementById('upgradeDescription').innerHTML = `
            <p>Share this code with your friends:</p>
            <div class="room-code-display">${multiplayerState.roomCode}</div>
            <p style="color:#888; font-size:0.85rem; margin-top:10px;">Waiting for players to join...</p>
        `;

        const options = document.getElementById('upgradeOptions');
        options.innerHTML = `
            <button class="option-btn primary" onclick="continueGameFromLobby(${slot})">Continue Game</button>
            <button class="option-btn secondary" onclick="leaveRoom(); showMultiplayerGameMenu();">Cancel</button>
        `;
    } catch (error) {
        document.getElementById('upgradeDescription').innerHTML = `
            <p style="color:#ff6666;">Failed to create room: ${error.message}</p>
        `;
    }
}

// Continue game from lobby
function continueGameFromLobby(slot) {
    const modal = document.getElementById('upgradeModal');
    modal.classList.remove('show');
    continueGame(slot);
}

// Show join game modal
function showJoinGameModal() {
    const modal = document.getElementById('upgradeModal');
    document.getElementById('upgradeTitle').textContent = 'Join Game';
    document.getElementById('upgradeDescription').innerHTML = `
        <p>Enter the room code from your host:</p>
    `;

    const options = document.getElementById('upgradeOptions');
    options.innerHTML = `
        <input type="text" id="joinRoomCodeInput" class="room-code-input"
               placeholder="Room Code" maxlength="6" style="text-transform: uppercase;">
        <button class="option-btn primary" onclick="joinRoomFromInput()">Join</button>
        <button class="option-btn secondary" onclick="showMultiplayerGameMenu()">Back</button>
    `;

    modal.classList.add('show');

    // Focus input
    setTimeout(() => {
        document.getElementById('joinRoomCodeInput')?.focus();
    }, 100);
}

// Join room from input
async function joinRoomFromInput() {
    const input = document.getElementById('joinRoomCodeInput');
    const code = input?.value?.toUpperCase()?.trim();

    if (!code || code.length < 4) {
        alert('Please enter a valid room code');
        return;
    }

    try {
        document.getElementById('upgradeDescription').innerHTML = '<p>Joining room...</p>';

        await joinRoom(code);

        document.getElementById('upgradeTitle').textContent = 'Joined!';
        document.getElementById('upgradeDescription').innerHTML = `
            <p>Connected to room <strong>${code}</strong></p>
            <p style="color:#888;">Waiting for host to start the game...</p>
        `;

        const options = document.getElementById('upgradeOptions');
        options.innerHTML = `
            <button class="option-btn secondary" onclick="leaveRoom(); showMultiplayerGameMenu();">Leave</button>
        `;
    } catch (error) {
        document.getElementById('upgradeDescription').innerHTML = `
            <p style="color:#ff6666;">Failed to join: ${error.message}</p>
            <input type="text" id="joinRoomCodeInput" class="room-code-input"
                   placeholder="Room Code" maxlength="6" value="${code}" style="text-transform: uppercase;">
        `;
    }
}

// ==================== LEGACY FUNCTIONS ====================

// Start new game (internal - used by both modes)
function startNewGame() {
    resetGameState();
    deleteSave(); // Clear any existing save

    gameState.currentStage = 0; // Start with tutorial
    gameState.tutorial = { active: true, step: 0, currentEncounter: null };

    document.getElementById('titleScreen').classList.add('hidden');
    document.getElementById('actionAssignScreen').classList.remove('hidden');

    initActionAssignment();
}

// Initialize action assignment drag-and-drop
function initActionAssignment() {
    actionAssignments = {
        physical: [null, null, null],
        verbal: [null, null, null],
        preventative: [null, null, null]
    };

    // Set up draggable tokens
    document.querySelectorAll('.color-token').forEach(token => {
        token.setAttribute('draggable', 'true');
        token.addEventListener('dragstart', handleDragStart);
        token.addEventListener('dragend', handleDragEnd);
    });

    // Set up drop zones
    document.querySelectorAll('.slot-dropzone').forEach(zone => {
        zone.addEventListener('dragover', handleDragOver);
        zone.addEventListener('dragleave', handleDragLeave);
        zone.addEventListener('drop', handleDrop);
    });

    updateAssignStatus();
}

function handleDragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.dataset.player);
    e.target.classList.add('dragging');
}

function handleDragEnd(e) {
    e.target.classList.remove('dragging');
}

function handleDragOver(e) {
    e.preventDefault();
    e.currentTarget.classList.add('drag-over');
}

function handleDragLeave(e) {
    e.currentTarget.classList.remove('drag-over');
}

function handleDrop(e) {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');

    const playerNum = parseInt(e.dataTransfer.getData('text/plain'));
    const slot = e.currentTarget.closest('.action-slot');
    const category = slot.dataset.category;
    const action = slot.dataset.action;
    const slotIndex = parseInt(slot.dataset.slot);

    // Check if this player is already assigned to this category
    const existingSlotIndex = actionAssignments[category].indexOf(playerNum);
    if (existingSlotIndex !== -1) {
        // Remove from existing slot
        actionAssignments[category][existingSlotIndex] = null;
    }

    // Check if this slot already has someone
    const existingPlayer = actionAssignments[category][slotIndex];
    if (existingPlayer !== null && existingPlayer !== playerNum) {
        // Swap - remove the existing player
        actionAssignments[category][slotIndex] = null;
    }

    // Assign player to this slot
    actionAssignments[category][slotIndex] = playerNum;

    updateActionSlots();
    updateAssignStatus();
}

function updateActionSlots() {
    // Clear all dropzones first
    document.querySelectorAll('.slot-dropzone').forEach(zone => {
        zone.innerHTML = '';
        zone.classList.remove('has-token');
    });

    // Render assigned tokens
    ['physical', 'verbal', 'preventative'].forEach(category => {
        actionAssignments[category].forEach((playerNum, slotIndex) => {
            if (playerNum !== null) {
                const slot = document.querySelector(`.action-slot[data-category="${category}"][data-slot="${slotIndex}"]`);
                const dropzone = slot.querySelector('.slot-dropzone');
                const avatar = CHARACTER_AVATARS[playerNum];

                dropzone.innerHTML = `
                    <div class="color-token player-${playerNum}" data-player="${playerNum}" draggable="true">
                        <span class="token-icon"><img src="${avatar.image}" alt="${avatar.color}" style="width:40px;height:40px;border-radius:8px;"></span>
                        <span class="token-name">${avatar.color.split(' ')[0]}</span>
                    </div>
                `;
                dropzone.classList.add('has-token');

                // Re-add drag handlers
                const token = dropzone.querySelector('.color-token');
                token.addEventListener('dragstart', handleDragStart);
                token.addEventListener('dragend', handleDragEnd);
            }
        });
    });
}

function updateAssignStatus() {
    const statusDiv = document.getElementById('assignStatus');
    const confirmBtn = document.getElementById('confirmAssignBtn');

    // Count assignments
    const physicalCount = actionAssignments.physical.filter(p => p !== null).length;
    const verbalCount = actionAssignments.verbal.filter(p => p !== null).length;
    const preventativeCount = actionAssignments.preventative.filter(p => p !== null).length;

    // Check if each player has exactly one of each category
    const allAssigned = physicalCount === 3 && verbalCount === 3 && preventativeCount === 3;

    // Check for duplicates (player in same category twice)
    const physicalUnique = new Set(actionAssignments.physical.filter(p => p !== null)).size === physicalCount;
    const verbalUnique = new Set(actionAssignments.verbal.filter(p => p !== null)).size === verbalCount;
    const preventativeUnique = new Set(actionAssignments.preventative.filter(p => p !== null)).size === preventativeCount;
    const noDuplicates = physicalUnique && verbalUnique && preventativeUnique;

    if (allAssigned && noDuplicates) {
        statusDiv.classList.add('complete');
        statusDiv.innerHTML = '<p>All actions assigned! Ready to continue.</p>';
        confirmBtn.disabled = false;
    } else {
        statusDiv.classList.remove('complete');
        statusDiv.innerHTML = `<p>Drag each color to one action per category. (${physicalCount + verbalCount + preventativeCount}/9 assigned)</p>`;
        confirmBtn.disabled = true;
    }
}

function confirmActionAssignment() {
    // Create players with their assigned dice
    const actionMap = {
        physical: { 0: 'slash', 1: 'stab', 2: 'bonk' },
        verbal: { 0: 'threaten', 1: 'deceive', 2: 'persuade' },
        preventative: { 0: 'bribe', 1: 'hide', 2: 'grapple' }
    };

    // Build player data
    for (let p = 1; p <= 3; p++) {
        const avatar = CHARACTER_AVATARS[p];
        const playerDice = {};

        ['physical', 'verbal', 'preventative'].forEach(category => {
            const slotIndex = actionAssignments[category].indexOf(p);
            if (slotIndex !== -1) {
                const dieType = actionMap[category][slotIndex];
                playerDice[category] = createDie(dieType);
            }
        });

        gameState.players.push({
            id: p,
            name: avatar.color,
            hp: 1, // Not used but kept for compatibility
            dice: playerDice
        });
    }

    // Move to talent ranking
    document.getElementById('actionAssignScreen').classList.add('hidden');
    document.getElementById('talentScreen').classList.remove('hidden');
    startTalentRanking();
}

// Talent ranking functions
function startTalentRanking() {
    talentState = {
        currentPlayer: 0,
        phase: 'best',
        playerRankings: [
            { best: null, worst: null, middle: null },
            { best: null, worst: null, middle: null },
            { best: null, worst: null, middle: null }
        ]
    };
    showTalentBestScreen();
}

function showTalentBestScreen() {
    const player = gameState.players[talentState.currentPlayer];
    const avatar = CHARACTER_AVATARS[player.id];

    document.getElementById('talentPlayerName').textContent = player.name;
    document.getElementById('talentInstruction').textContent = 'Choose your BEST talent (this die gets a bonus):';

    const optionsDiv = document.getElementById('talentDiceOptions');
    optionsDiv.innerHTML = '';

    ['physical', 'verbal', 'preventative'].forEach(cat => {
        const die = player.dice[cat];
        const btn = document.createElement('button');
        btn.className = `talent-btn ${cat}`;
        btn.innerHTML = `
            <span class="die-icon">${die.icon}</span>
            <span class="die-name">${die.name}</span>
            <span class="category-label">${cat}</span>
        `;
        btn.onclick = () => selectBestTalent(cat);
        optionsDiv.appendChild(btn);
    });

    document.getElementById('talentHint').textContent = 'Your best die will have one face upgraded to 20!';
}

function selectBestTalent(category) {
    const ranking = talentState.playerRankings[talentState.currentPlayer];
    ranking.best = category;

    // Show worst selection
    talentState.phase = 'worst';
    showTalentWorstScreen();
}

function showTalentWorstScreen() {
    const player = gameState.players[talentState.currentPlayer];
    const ranking = talentState.playerRankings[talentState.currentPlayer];

    document.getElementById('talentInstruction').textContent = 'Choose your WORST talent (this die gets a penalty):';

    const optionsDiv = document.getElementById('talentDiceOptions');
    optionsDiv.innerHTML = '';

    ['physical', 'verbal', 'preventative'].forEach(cat => {
        if (cat === ranking.best) return;

        const die = player.dice[cat];
        const btn = document.createElement('button');
        btn.className = `talent-btn ${cat}`;
        btn.innerHTML = `
            <span class="die-icon">${die.icon}</span>
            <span class="die-name">${die.name}</span>
            <span class="category-label">${cat}</span>
        `;
        btn.onclick = () => selectWorstTalent(cat);
        optionsDiv.appendChild(btn);
    });

    document.getElementById('talentHint').textContent = 'Your worst die will have one face downgraded to 1...';
}

function selectWorstTalent(category) {
    const ranking = talentState.playerRankings[talentState.currentPlayer];
    ranking.worst = category;

    const categories = ['physical', 'verbal', 'preventative'];
    ranking.middle = categories.find(c => c !== ranking.best && c !== ranking.worst);

    talentState.currentPlayer++;

    if (talentState.currentPlayer >= 3) {
        applyBestAndWorstUpgrades();
        talentState.currentPlayer = 0;
        talentState.phase = 'intertwine';
        showIntertwineScreen();
    } else {
        talentState.phase = 'best';
        showTalentBestScreen();
    }
}

function applyBestAndWorstUpgrades() {
    for (let i = 0; i < 3; i++) {
        const player = gameState.players[i];
        const ranking = talentState.playerRankings[i];

        // BEST die: replace a random 2-5 with 20
        const bestDie = player.dice[ranking.best];
        const lowFaces = [2, 3, 4, 5];
        const faceToUpgrade = lowFaces[Math.floor(Math.random() * lowFaces.length)];
        const faceIndex = bestDie.faces.indexOf(faceToUpgrade);
        if (faceIndex !== -1) {
            bestDie.faces[faceIndex] = 20;
        }

        // WORST die: replace a random 2-5 with 1
        const worstDie = player.dice[ranking.worst];
        const remainingLowFaces = lowFaces.filter(f => worstDie.faces.includes(f));
        if (remainingLowFaces.length > 0) {
            const faceToDowngrade = remainingLowFaces[Math.floor(Math.random() * remainingLowFaces.length)];
            const downgradeIndex = worstDie.faces.indexOf(faceToDowngrade);
            if (downgradeIndex !== -1) {
                worstDie.faces[downgradeIndex] = 1;
            }
        }
    }
}

function showIntertwineScreen() {
    const player = gameState.players[talentState.currentPlayer];
    const ranking = talentState.playerRankings[talentState.currentPlayer];
    const middleDie = player.dice[ranking.middle];

    document.getElementById('talentScreen').classList.add('hidden');
    document.getElementById('intertwineScreen').classList.remove('hidden');

    const allies = gameState.players
        .map((p, idx) => ({ player: p, index: idx }))
        .filter(a => a.index !== talentState.currentPlayer);

    const currentAlly = allies[intertwineData.round - 1];
    const isFirstRound = intertwineData.round === 1;

    document.getElementById('intertwineSubtitle').textContent =
        `${player.name}, your ${middleDie.name} die will be intertwined with BOTH allies!`;

    let html = `
        <div class="intertwine-progress">
            <span class="${isFirstRound ? 'active' : 'done'}">Link 1: ${isFirstRound ? currentAlly.player.name : allies[0].player.name}</span>
            <span class="arrow">-></span>
            <span class="${!isFirstRound ? 'active' : ''}">Link 2: ${allies[1].player.name}</span>
        </div>
        <div class="intertwine-step" id="intertwineStep1">
            <h3>Choose a number between 6 and 10 for ${currentAlly.player.name}</h3>
            <p>When you roll this number on your ${middleDie.name} die, it will trigger ${currentAlly.player.name}'s die instead!</p>
            <div class="number-options">
    `;

    for (let n = 6; n <= 10; n++) {
        const used = intertwineData.usedNumbers.includes(n);
        html += `<button class="number-btn ${used ? 'disabled' : ''}" ${used ? 'disabled' : ''} onclick="selectIntertwineNumber(${n}, event)">${n}</button>`;
    }

    html += `
            </div>
        </div>
        <div class="intertwine-step hidden" id="intertwineStep2">
            <h3>Choose which of ${currentAlly.player.name}'s dice</h3>
            <div class="ally-dice-options" id="allyDiceOptions"></div>
        </div>
    `;

    document.getElementById('intertwineContent').innerHTML = html;
}

function selectIntertwineNumber(num, e) {
    intertwineData.number = num;

    document.querySelectorAll('.number-btn').forEach(btn => btn.classList.remove('selected'));
    if (e && e.target) e.target.classList.add('selected');

    document.getElementById('intertwineStep2').classList.remove('hidden');

    const allies = gameState.players
        .map((p, idx) => ({ player: p, index: idx }))
        .filter(a => a.index !== talentState.currentPlayer);
    const currentAlly = allies[intertwineData.round - 1];
    intertwineData.allyIndex = currentAlly.index;

    let html = '';
    ['physical', 'verbal', 'preventative'].forEach(cat => {
        const die = currentAlly.player.dice[cat];
        html += `
            <button class="talent-btn ${cat}" onclick="selectIntertwineAllyDie('${cat}', event)">
                <span class="die-icon">${die.icon}</span>
                <span class="die-name">${die.name}</span>
            </button>
        `;
    });

    html += `<button class="confirm-btn" id="confirmIntertwine" onclick="confirmIntertwine()" style="display:none;">Lock It In!</button>`;
    document.getElementById('allyDiceOptions').innerHTML = html;
}

function selectIntertwineAllyDie(dieType, e) {
    intertwineData.allyDieType = dieType;

    document.querySelectorAll('#allyDiceOptions .talent-btn').forEach(btn => btn.classList.remove('selected'));
    if (e && e.target) e.target.closest('.talent-btn').classList.add('selected');

    document.getElementById('confirmIntertwine').style.display = 'block';
}

function confirmIntertwine() {
    const player = gameState.players[talentState.currentPlayer];
    const ranking = talentState.playerRankings[talentState.currentPlayer];
    const middleDie = player.dice[ranking.middle];

    middleDie.swaps.push({
        faceValue: intertwineData.number,
        targetPlayer: intertwineData.allyIndex,
        targetDieType: intertwineData.allyDieType
    });

    intertwineData.usedNumbers.push(intertwineData.number);

    if (intertwineData.round === 1) {
        intertwineData.round = 2;
        intertwineData.number = null;
        intertwineData.allyDieType = null;
        showIntertwineScreen();
    } else {
        talentState.currentPlayer++;
        intertwineData = { number: null, allyIndex: null, allyDieType: null, round: 1, usedNumbers: [] };

        if (talentState.currentPlayer >= 3) {
            finishTalentRanking();
        } else {
            showIntertwineScreen();
        }
    }
}

function finishTalentRanking() {
    document.getElementById('intertwineScreen').classList.add('hidden');

    // Save base faces for each die
    gameState.players.forEach(player => {
        Object.values(player.dice).forEach(die => {
            die.baseFaces = [...die.faces];
        });
    });

    // Check if we're in tutorial (Stage 0)
    if (gameState.currentStage === 0 && gameState.tutorial.active) {
        document.getElementById('actionAssignScreen').classList.add('hidden');
        document.getElementById('talentScreen').classList.add('hidden');
        document.getElementById('gameScreen').classList.remove('hidden');

        generateMap();
        renderMap();
        renderPlayers();
        renderDiceTray();
        updateDoomHopeDisplay();
        updateFloorDisplay();

        const stageInfo = STAGE_INFO[0];
        document.getElementById('gameLog').innerHTML = '<h4>Log</h4>';
        log(`${stageInfo.name}`, 'info');
        log('A final lesson begins...', 'info');

        showPalDialogue(PAL_DIALOGUE.intertwine_explain);
        setTimeout(() => {
            showTutorialEncounter('tutorial_final_battle');
        }, 2000);
    } else {
        startGame();
    }
}

function startGame() {
    if (gameState.players.length === 0) {
        gameState.gold = 0;
        gameState.doom = 0;
        gameState.hope = 0;
        gameState.shields = 0;
        gameState.map = [];
    }

    generateMap();

    document.getElementById('setupScreen').classList.add('hidden');
    document.getElementById('actionAssignScreen').classList.add('hidden');
    document.getElementById('talentScreen').classList.add('hidden');
    document.getElementById('intertwineScreen').classList.add('hidden');
    document.getElementById('gameScreen').classList.remove('hidden');

    renderMap();
    renderPlayers();
    renderDiceTray();
    updateDoomHopeDisplay();
    updateFloorDisplay();

    gameState.map[0].status = 'available';
    renderMap();

    const stageInfo = STAGE_INFO[gameState.currentStage];
    document.getElementById('gameLog').innerHTML = '<h4>Log</h4>';

    if (gameState.currentStage === 0) {
        log(`${stageInfo.name}`, 'info');
        log('A dream begins...', 'info');
        setTimeout(() => showTutorialEncounter('pal_intro'), 500);
    } else {
        log(`Stage ${gameState.currentStage}: ${stageInfo.name}`, 'info');
        log('Click to begin your journey...', 'info');
    }

    autoSave();
}

// Tutorial functions
function showTutorialEncounter(encounterId) {
    const encounter = TUTORIAL_ENCOUNTERS[encounterId];
    if (!encounter) return;

    gameState.tutorial.active = true;
    gameState.tutorial.currentEncounter = encounterId;

    document.getElementById('encounterTitle').textContent = encounter.name;
    document.getElementById('encounterDescription').innerHTML = `
        <p style="font-size: 2rem; margin-bottom: 15px;">${encounter.icon}</p>
        <p>${encounter.description}</p>
    `;

    const optionsHtml = encounter.options.map(opt =>
        `<button class="option-btn" onclick="handleTutorialAction('${opt.action}')">${opt.text}</button>`
    ).join('');
    document.getElementById('encounterOptions').innerHTML = optionsHtml;

    document.getElementById('encounterContent').style.display = 'block';
}

function handleTutorialAction(action) {
    switch(action) {
        case 'pal_explain':
            updateEncounterDescription(
                "Pal's Words",
                "PAL",
                "*Pal's colors dim momentarily* \"I know, little ones. I can feel myself fading. But do not weep for me - I have lived long enough to see the prophecy choose its true champions. You three... you are my legacy. My greatest work.\"",
                [{ text: 'Continue...', action: 'pal_return' }]
            );
            break;
        case 'pal_prophecy':
            updateEncounterDescription(
                "Pal's Words",
                "PAL",
                "*Pal reaches out, his translucent hand brushing your face* \"And I am not ready to leave you. But the universe does not ask permission. What matters is that I prepared you well. The years we spent together... they were not wasted.\"",
                [{ text: 'Continue...', action: 'pal_return' }]
            );
            break;
        case 'pal_return':
            showTutorialEncounter('pal_intro');
            break;
        case 'tutorial_obstacle1':
            showTutorialEncounter('tutorial_obstacle1');
            break;
        case 'tutorial_combat1':
            startTutorialCombat('tutorial_obstacle1');
            break;
        case 'tutorial_combat2':
            startTutorialCombat('tutorial_obstacle2');
            break;
        case 'start_intertwine':
            gameState.tutorial.active = false;
            talentState.currentPlayer = 0;
            talentState.phase = 'intertwine';
            showIntertwineScreen();
            break;
        case 'tutorial_combat_final':
            startTutorialFinalCombat();
            break;
        case 'end_tutorial':
            endTutorial();
            break;
        default:
            log(`Unknown tutorial action: ${action}`, 'warn');
    }
}

function startTutorialCombat(encounterId) {
    const encounter = TUTORIAL_ENCOUNTERS[encounterId];

    if (encounter.tutorialPhase === 'strong_die') {
        gameState.allowedDiceTypes = ['physical', 'verbal', 'preventative'];
        showPalDialogue("Show me your strongest skill! Roll the die you're BEST at!");
    } else if (encounter.tutorialPhase === 'weak_die') {
        gameState.allowedDiceTypes = ['physical', 'verbal', 'preventative'];
        showPalDialogue("Now face your weakness. Sometimes we must struggle to learn...");
    }

    gameState.encounterState = {
        type: 'tutorial_combat',
        encounter: encounter,
        encounterId: encounterId,
        successes: { physical: 0, verbal: 0, preventative: 0 },
        dc: encounter.dc,
        tutorialPhase: encounter.tutorialPhase,
        forceFailure: encounter.forceFailure
    };

    gameState.targetDC = encounter.dc;
    gameState.canRoll = true;
    renderDiceTray();

    document.getElementById('encounterOptions').innerHTML = `
        <div class="combat-status">
            <p>DC: ${encounter.dc} | Goal: 1 success of any type</p>
            <p>Select a die to roll!</p>
        </div>
    `;
}

function startTutorialFinalCombat() {
    const encounter = TUTORIAL_ENCOUNTERS['tutorial_final_battle'];

    showPalDialogue(PAL_DIALOGUE.hope_granted);
    gameState.hope = 1;
    updateDoomHopeDisplay();

    gameState.encounterState = {
        type: 'boss_combat',
        encounter: encounter,
        enemyName: 'Shadow Pal',
        successes: { physical: 0, verbal: 0, preventative: 0 },
        dc: encounter.dc,
        successThresholds: encounter.successThresholds,
        attacksPerRound: encounter.attacksPerRound,
        rollsThisRound: 0,
        roundMisses: 0,
        playersRolledThisRound: [],
        roundNumber: 1,
        isTutorial: true
    };

    gameState.targetDC = encounter.dc;
    gameState.canRoll = true;
    gameState.allowedDiceTypes = ['physical', 'verbal', 'preventative'];
    renderDiceTray();
    updateBossCombatUI();
}

function endTutorial() {
    gameState.currentStage = 1;
    gameState.tutorial.active = false;
    gameState.doom = 0;

    showPalDialogue("Farewell, Chosen Ones. May HOPE light your path...");

    setTimeout(() => {
        generateMap();
        renderMap();
        updateFloorDisplay();

        const stageInfo = STAGE_INFO[gameState.currentStage];
        log(`--- STAGE 1: ${stageInfo.name} ---`, 'info');
        log(`You awaken at ${stageInfo.location}...`, 'info');

        gameState.map[0].status = 'available';
        renderMap();

        selectNode(0);
        autoSave();
    }, 2000);
}

// Map generation
function generateMap() {
    const stage = gameState.currentStage;

    const MAP_STRUCTURES = {
        0: TUTORIAL_MAP_STRUCTURE,
        1: COMMON_MAP_STRUCTURE,
        2: COMMON_MAP_STRUCTURE,
        3: COMMON_MAP_STRUCTURE,
        4: COMMON_MAP_STRUCTURE,
        5: STAGE_5_MAP_STRUCTURE
    };

    const structure = MAP_STRUCTURES[stage] || MAP_STRUCTURES[1];

    const encounterSource = stage === 0 ? TUTORIAL_ENCOUNTERS :
                            stage === 5 ? STAGE_5_ENCOUNTERS : ENCOUNTERS;

    const bossData = BOSSES[stage];
    const stageBoss = bossData ? {
        type: 'boss',
        name: bossData.name,
        description: bossData.description,
        icon: 'BOSS',
        dc: bossData.dc,
        reward: 50 + (stage * 25),
        successThresholds: bossData.successThresholds,
        attacksPerRound: bossData.attacksPerRound,
        options: [
            { text: 'Attack! (Physical)', types: ['physical'], action: 'boss_combat' },
            { text: 'Negotiate (Verbal)', types: ['verbal'], action: 'boss_combat' },
            { text: 'Outmaneuver (Preventative)', types: ['preventative'], action: 'boss_combat' }
        ]
    } : null;

    gameState.map = structure.map((node, index) => {
        let encounterData;
        if (node.encounter === 'boss') {
            encounterData = stageBoss;
        } else {
            encounterData = encounterSource[node.encounter] || ENCOUNTERS[node.encounter] || ENCOUNTERS.start;
        }

        return {
            id: index,
            ...encounterData,
            encounterKey: node.encounter,
            row: node.row,
            status: index === 0 ? 'current' : 'locked',
            connections: []
        };
    });

    buildMapConnections(structure);
}

function buildMapConnections(structure) {
    const rowGroups = {};
    structure.forEach((node, idx) => {
        if (!rowGroups[node.row]) rowGroups[node.row] = [];
        rowGroups[node.row].push(idx);
    });

    const rows = Object.keys(rowGroups).sort((a, b) => a - b);

    for (let i = 0; i < rows.length - 1; i++) {
        const currentRow = rowGroups[rows[i]];
        const nextRow = rowGroups[rows[i + 1]];

        currentRow.forEach(nodeIdx => {
            gameState.map[nodeIdx].connections = [...nextRow];
        });
    }
}

// Restart functions
function restartGame() {
    deleteSave();
    document.getElementById('defeatScreen').classList.add('hidden');
    document.getElementById('victoryScreen').classList.add('hidden');
    document.getElementById('titleScreen').classList.remove('hidden');
    updateTitleScreenWithSave();
}
