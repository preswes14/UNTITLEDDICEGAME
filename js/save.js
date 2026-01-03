// ==================== SAVE/LOAD SYSTEM ====================
// localStorage persistence for game state

// Save the current game state
function saveGame() {
    try {
        const saveData = getSerializableState();
        localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
        console.log('Game saved successfully');
        return true;
    } catch (error) {
        console.error('Failed to save game:', error);
        return false;
    }
}

// Load game from localStorage
function loadGame() {
    try {
        const savedJson = localStorage.getItem(SAVE_KEY);
        if (!savedJson) {
            console.log('No save data found');
            return null;
        }

        const savedData = JSON.parse(savedJson);
        console.log('Save data loaded:', savedData);
        return savedData;
    } catch (error) {
        console.error('Failed to load game:', error);
        return null;
    }
}

// Check if a save exists
function hasSaveData() {
    try {
        const savedJson = localStorage.getItem(SAVE_KEY);
        if (!savedJson) return false;

        const savedData = JSON.parse(savedJson);
        return savedData && savedData.version === SAVE_VERSION;
    } catch (error) {
        return false;
    }
}

// Delete save data
function deleteSave() {
    try {
        localStorage.removeItem(SAVE_KEY);
        console.log('Save data deleted');
        return true;
    } catch (error) {
        console.error('Failed to delete save:', error);
        return false;
    }
}

// Get save info without loading full state
function getSaveInfo() {
    try {
        const savedJson = localStorage.getItem(SAVE_KEY);
        if (!savedJson) return null;

        const savedData = JSON.parse(savedJson);
        if (!savedData || savedData.version !== SAVE_VERSION) return null;

        return {
            timestamp: savedData.timestamp,
            stage: savedData.currentStage,
            stageName: STAGE_INFO[savedData.currentStage]?.name || 'Unknown',
            gold: savedData.gold,
            doom: savedData.doom,
            hope: savedData.hope,
            players: savedData.players.map(p => p.name)
        };
    } catch (error) {
        return null;
    }
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
    return date.toLocaleString();
}

// Continue from save
function continueGame() {
    const savedData = loadGame();
    if (!savedData) {
        console.log('No valid save data to continue from');
        return false;
    }

    if (!restoreFromSave(savedData)) {
        console.log('Failed to restore save data');
        return false;
    }

    // Hide title screen, show game screen
    document.getElementById('titleScreen').classList.add('hidden');
    document.getElementById('gameScreen').classList.remove('hidden');

    // Restore UI
    renderMap();
    renderPlayers();
    renderDiceTray();
    updateDoomHopeDisplay();
    updateFloorDisplay();

    // Reset encounter state
    gameState.canRoll = false;
    gameState.encounterState = null;
    gameState.currentEncounter = null;

    // Log the continuation
    const stageInfo = STAGE_INFO[gameState.currentStage];
    log(`--- Resumed: ${stageInfo.name} ---`, 'info');
    log('Select a location on the map to continue.', 'info');

    return true;
}

// Update title screen to show continue option
function updateTitleScreenWithSave() {
    const saveInfo = getSaveInfo();
    const continueBtn = document.getElementById('continueBtn');
    const saveInfoDiv = document.getElementById('saveInfo');

    if (saveInfo && continueBtn) {
        continueBtn.style.display = 'block';
        continueBtn.disabled = false;

        if (saveInfoDiv) {
            saveInfoDiv.innerHTML = `
                <div class="save-preview">
                    <span class="save-stage">${saveInfo.stageName}</span>
                    <span class="save-details">
                        Gold: ${saveInfo.gold} | DOOM: ${saveInfo.doom} | HOPE: ${saveInfo.hope}
                    </span>
                    <span class="save-time">Saved: ${formatSaveTime(saveInfo.timestamp)}</span>
                </div>
            `;
            saveInfoDiv.style.display = 'block';
        }
    } else if (continueBtn) {
        continueBtn.style.display = 'none';
        if (saveInfoDiv) {
            saveInfoDiv.style.display = 'none';
        }
    }
}
