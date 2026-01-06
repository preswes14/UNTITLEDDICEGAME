// ==================== SAVE/LOAD SYSTEM ====================
// localStorage persistence with multiple save slots

// Get the save key for a specific slot
function getSaveKey(slot) {
    return `${SAVE_KEY_PREFIX}_${slot}`;
}

// Save the current game state to the active slot
function saveGame(slot = gameState.currentSaveSlot) {
    try {
        const saveData = getSerializableState();
        localStorage.setItem(getSaveKey(slot), JSON.stringify(saveData));
        console.log(`Game saved to slot ${slot + 1}`);
        return true;
    } catch (error) {
        console.error('Failed to save game:', error);
        return false;
    }
}

// Load game from a specific slot
function loadGame(slot = gameState.currentSaveSlot) {
    try {
        const savedJson = localStorage.getItem(getSaveKey(slot));
        if (!savedJson) {
            console.log(`No save data found in slot ${slot + 1}`);
            return null;
        }

        const savedData = JSON.parse(savedJson);
        console.log(`Save data loaded from slot ${slot + 1}:`, savedData);
        return savedData;
    } catch (error) {
        console.error('Failed to load game:', error);
        return null;
    }
}

// Check if a save exists in a specific slot
function hasSaveData(slot) {
    try {
        const savedJson = localStorage.getItem(getSaveKey(slot));
        if (!savedJson) return false;

        const savedData = JSON.parse(savedJson);
        return savedData && (savedData.version === SAVE_VERSION || savedData.version === 1);
    } catch (error) {
        return false;
    }
}

// Check if any save slots have data
function hasAnySaveData() {
    for (let i = 0; i < MAX_SAVE_SLOTS; i++) {
        if (hasSaveData(i)) return true;
    }
    return false;
}

// Delete save data from a specific slot
function deleteSave(slot = gameState.currentSaveSlot) {
    try {
        localStorage.removeItem(getSaveKey(slot));
        console.log(`Save data deleted from slot ${slot + 1}`);
        return true;
    } catch (error) {
        console.error('Failed to delete save:', error);
        return false;
    }
}

// Get save info for a specific slot without loading full state
function getSaveInfo(slot) {
    try {
        const savedJson = localStorage.getItem(getSaveKey(slot));
        if (!savedJson) return null;

        const savedData = JSON.parse(savedJson);
        if (!savedData || (savedData.version !== SAVE_VERSION && savedData.version !== 1)) return null;

        // Calculate progress string like "3-6" for stage 3, encounter 6
        const progressStr = `${savedData.currentStage}-${savedData.encounterNumber || savedData.currentNode}`;

        return {
            timestamp: savedData.timestamp,
            stage: savedData.currentStage,
            stageName: STAGE_INFO[savedData.currentStage]?.name || 'Unknown',
            gold: savedData.gold,
            doom: savedData.doom,
            hope: savedData.hope,
            players: savedData.players.map(p => p.name),
            encounterNumber: savedData.encounterNumber || savedData.currentNode,
            diceChanges: savedData.diceChanges || 0,
            progressStr: progressStr
        };
    } catch (error) {
        return null;
    }
}

// Get info for all save slots
function getAllSaveInfo() {
    const slots = [];
    for (let i = 0; i < MAX_SAVE_SLOTS; i++) {
        slots.push(getSaveInfo(i));
    }
    return slots;
}

// Auto-save after key game events
function autoSave() {
    // Only auto-save if we're past the tutorial setup
    if (gameState.players.length > 0 && gameState.currentStage >= 0) {
        saveGame();
    }
}

// Format timestamp for display
function formatSaveTime(timestamp) {
    if (!timestamp) return 'Unknown';
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) {
        return 'Just now';
    } else if (diffHours < 24) {
        return `${diffHours}h ago`;
    } else if (diffDays < 7) {
        return `${diffDays}d ago`;
    } else {
        return date.toLocaleDateString();
    }
}

// Continue from save in a specific slot
function continueGame(slot = 0) {
    const savedData = loadGame(slot);
    if (!savedData) {
        console.log('No valid save data to continue from');
        return false;
    }

    gameState.currentSaveSlot = slot;

    if (!restoreFromSave(savedData)) {
        console.log('Failed to restore save data');
        return false;
    }

    // Hide title screen, show game screen
    document.getElementById('titleScreen').classList.add('hidden');
    document.getElementById('saveSlotScreen')?.classList.add('hidden');
    document.getElementById('gameScreen').classList.remove('hidden');

    // Restore UI
    renderMap();
    renderPlayers();
    renderDiceTray();
    updateDoomHopeDisplay();
    updateFloorDisplay();

    // Check if we were mid-encounter
    if (gameState.encounterState && gameState.currentEncounter) {
        // Resume the encounter
        log(`--- Resumed mid-encounter ---`, 'info');
        showEncounter(gameState.currentEncounter);
    } else {
        // Reset encounter state
        gameState.canRoll = false;
        gameState.encounterState = null;
        gameState.currentEncounter = null;

        // Log the continuation
        const stageInfo = STAGE_INFO[gameState.currentStage];
        log(`--- Resumed: ${stageInfo.name} ---`, 'info');
        log('Select a location on the map to continue.', 'info');
    }

    return true;
}

// Start a new game in a specific slot
function startNewGameInSlot(slot) {
    gameState.currentSaveSlot = slot;
    deleteSave(slot); // Clear any existing save in this slot
    startNewGame();
}

// Show save slot selection screen
function showSaveSlotScreen(mode = 'load') {
    const screen = document.getElementById('saveSlotScreen');
    const title = document.getElementById('saveSlotTitle');
    const slots = document.getElementById('saveSlots');

    if (!screen) return;

    title.textContent = mode === 'load' ? 'Select Save Slot' : 'Choose a Slot for New Game';

    const allSaveInfo = getAllSaveInfo();
    slots.innerHTML = '';

    allSaveInfo.forEach((info, idx) => {
        const slotDiv = document.createElement('div');
        slotDiv.className = `save-slot ${info ? 'has-data' : 'empty'}`;

        if (info) {
            slotDiv.innerHTML = `
                <div class="slot-header">
                    <span class="slot-number">Slot ${idx + 1}</span>
                    <span class="slot-progress">${info.progressStr}</span>
                </div>
                <div class="slot-details">
                    <span class="slot-stage">${info.stageName}</span>
                    <div class="slot-stats">
                        <span>Gold: ${info.gold}</span>
                        <span>DOOM: ${info.doom}</span>
                        <span>Dice Changes: ${info.diceChanges}</span>
                    </div>
                    <span class="slot-time">${formatSaveTime(info.timestamp)}</span>
                </div>
                <div class="slot-actions">
                    ${mode === 'load' ? `<button class="slot-btn continue" onclick="continueGame(${idx})">Continue</button>` : ''}
                    <button class="slot-btn new" onclick="confirmNewGame(${idx})">New Game</button>
                    <button class="slot-btn delete" onclick="confirmDeleteSlot(${idx})">Delete</button>
                </div>
            `;
        } else {
            slotDiv.innerHTML = `
                <div class="slot-header">
                    <span class="slot-number">Slot ${idx + 1}</span>
                    <span class="slot-empty">Empty</span>
                </div>
                <div class="slot-actions">
                    <button class="slot-btn new" onclick="startNewGameInSlot(${idx})">New Game</button>
                </div>
            `;
        }

        slots.appendChild(slotDiv);
    });

    // Add back button
    const backBtn = document.createElement('button');
    backBtn.className = 'option-btn';
    backBtn.style.marginTop = '20px';
    backBtn.textContent = 'Back';
    backBtn.onclick = () => {
        screen.classList.add('hidden');
        document.getElementById('titleScreen').classList.remove('hidden');
    };
    slots.appendChild(backBtn);

    document.getElementById('titleScreen').classList.add('hidden');
    screen.classList.remove('hidden');
}

// Confirm starting new game (overwriting existing save)
function confirmNewGame(slot) {
    const info = getSaveInfo(slot);
    if (info) {
        if (confirm(`This will overwrite your save in Slot ${slot + 1} (${info.stageName}, ${info.progressStr}). Continue?`)) {
            startNewGameInSlot(slot);
        }
    } else {
        startNewGameInSlot(slot);
    }
}

// Confirm deleting a save slot
function confirmDeleteSlot(slot) {
    const info = getSaveInfo(slot);
    if (info && confirm(`Delete save in Slot ${slot + 1}? This cannot be undone!`)) {
        deleteSave(slot);
        showSaveSlotScreen('load');
    }
}

// Update title screen to show continue/load options
function updateTitleScreenWithSave() {
    const loadBtn = document.getElementById('continueBtn');
    const saveInfoDiv = document.getElementById('saveInfo');

    if (hasAnySaveData() && loadBtn) {
        loadBtn.style.display = 'block';
        loadBtn.disabled = false;
        loadBtn.textContent = 'Continue / Load';
        loadBtn.onclick = () => showSaveSlotScreen('load');

        // Show preview of most recent save
        const allInfo = getAllSaveInfo();
        const mostRecent = allInfo
            .map((info, idx) => ({ info, idx }))
            .filter(s => s.info)
            .sort((a, b) => (b.info.timestamp || 0) - (a.info.timestamp || 0))[0];

        if (saveInfoDiv && mostRecent) {
            saveInfoDiv.innerHTML = `
                <div class="save-preview">
                    <span class="save-stage">Slot ${mostRecent.idx + 1}: ${mostRecent.info.stageName}</span>
                    <span class="save-details">
                        Progress: ${mostRecent.info.progressStr} | Dice Changes: ${mostRecent.info.diceChanges}
                    </span>
                    <span class="save-time">${formatSaveTime(mostRecent.info.timestamp)}</span>
                </div>
            `;
            saveInfoDiv.style.display = 'block';
        }
    } else if (loadBtn) {
        loadBtn.style.display = 'none';
        if (saveInfoDiv) {
            saveInfoDiv.style.display = 'none';
        }
    }
}

// Migrate legacy save to slot 0
function migrateLegacySave() {
    try {
        const legacyJson = localStorage.getItem(LEGACY_SAVE_KEY);
        if (legacyJson && !hasSaveData(0)) {
            const legacyData = JSON.parse(legacyJson);
            if (legacyData && legacyData.version === 1) {
                localStorage.setItem(getSaveKey(0), legacyJson);
                localStorage.removeItem(LEGACY_SAVE_KEY);
                console.log('Migrated legacy save to slot 1');
            }
        }
    } catch (error) {
        console.error('Failed to migrate legacy save:', error);
    }
}

// Track dice changes - call this whenever dice are modified
function trackDiceChange(amount = 1) {
    gameState.diceChanges += amount;
}

// Initialize save system on load
document.addEventListener('DOMContentLoaded', () => {
    migrateLegacySave();
});
