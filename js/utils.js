// ==================== UTILITY FUNCTIONS ====================

// Fisher-Yates shuffle (uniform, unbiased)
function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

// Sanitize a string for safe insertion into innerHTML
function sanitizeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// Clamp a die face value to valid range [1, 20]
function clampFace(value) {
    return Math.max(1, Math.min(20, Math.round(value)));
}

// Debounced auto-save — collapses rapid successive calls into one
let _autoSaveTimer = null;
function debouncedAutoSave() {
    if (_autoSaveTimer) clearTimeout(_autoSaveTimer);
    _autoSaveTimer = setTimeout(() => {
        _autoSaveTimer = null;
        if (gameState.players.length > 0 && gameState.currentStage >= 0) {
            saveGame();
        }
    }, 500);
}

// Add gold to player's inventory
function addGold(amount) {
    gameState.gold += amount;
    updateDoomHopeDisplay();
    log(`+${amount} Gold!`, 'crit');
    debouncedAutoSave();
}

// Spend gold (returns true if successful)
function spendGold(amount) {
    if (gameState.gold >= amount) {
        gameState.gold -= amount;
        updateDoomHopeDisplay();
        debouncedAutoSave();
        return true;
    }
    return false;
}

// Add DOOM to the meter
function addDoom(amount, reason = '') {
    // DOOM rubber-banding: diminishing gains at high DOOM levels
    // At DOOM 10+, each point of DOOM added is halved (rounded up)
    let actualAmount = amount;
    if (gameState.doom >= 10) {
        actualAmount = Math.ceil(amount / 2);
    }
    // Cap DOOM at 15 to prevent unwinnable death spirals
    const maxDoom = 15;
    actualAmount = Math.min(actualAmount, maxDoom - gameState.doom);
    if (actualAmount <= 0) {
        if (reason) log(`DOOM at maximum!`, 'doom');
        return;
    }
    gameState.doom += actualAmount;
    updateDoomHopeDisplay();
    if (reason) {
        log(`+${actualAmount} DOOM: ${reason}`, 'doom');
    }
    debouncedAutoSave();
}

// Reduce DOOM
function reduceDoom(amount) {
    const reduced = Math.min(gameState.doom, amount);
    gameState.doom -= reduced;
    updateDoomHopeDisplay();
    debouncedAutoSave();
    return reduced;
}

// Add HOPE (bankable charges)
function addHope(amount = 1) {
    const added = Math.min(amount, gameState.maxHope - gameState.hope);
    if (added > 0) {
        gameState.hope += added;
        log(`+${added} HOPE charge!`, 'hope');
        updateDoomHopeDisplay();
        debouncedAutoSave();
    } else {
        log(`HOPE at max capacity`, 'info');
    }
}

// Use HOPE charge
function useHope() {
    if (gameState.hope > 0) {
        gameState.hope--;
        log(`HOPE charge used to prevent doom!`, 'hope');
        updateDoomHopeDisplay();
        debouncedAutoSave();
        return true;
    }
    return false;
}

// Add SHIELD charge
function addShield(amount = 1) {
    const added = Math.min(amount, gameState.maxShields - gameState.shields);
    if (added > 0) {
        gameState.shields += added;
        log(`+${added} SHIELD charge!`, 'info');
        updateDoomHopeDisplay();
        debouncedAutoSave();
    } else {
        log(`SHIELD at max capacity`, 'info');
    }
}

// Use SHIELD charge
function useShield() {
    if (gameState.shields > 0) {
        gameState.shields--;
        log(`SHIELD charge used - DOOM roll prevented!`, 'info');
        updateDoomHopeDisplay();
        debouncedAutoSave();
        return true;
    }
    return false;
}

// Get effective roll after DOOM penalty (only for DOOM rolls, not regular rolls)
function getEffectiveRoll(baseRoll) {
    // DOOM reduces all non-20 rolls
    if (baseRoll === 20) return 20;
    const effective = Math.max(1, baseRoll - gameState.doom);
    return effective;
}

// Log message to game log
function log(message, type = '') {
    const logDiv = document.getElementById('gameLog');
    if (!logDiv) return;

    const entry = document.createElement('div');
    entry.className = `log-entry ${type}`;
    entry.textContent = message;
    logDiv.appendChild(entry);
    logDiv.scrollTop = logDiv.scrollHeight;
}

// Show Pal's dialogue (tutorial)
function showPalDialogue(text) {
    const logDiv = document.getElementById('gameLog');
    if (!logDiv) return;

    const palMsg = document.createElement('div');
    palMsg.className = 'log-entry pal-dialogue';
    const safeText = sanitizeHTML(text);
    palMsg.innerHTML = `
        <div style="display: flex; align-items: flex-start; gap: 10px;">
            <img src="assets/pal.png" alt="Pal" style="width: 40px; height: 40px; border-radius: 8px; object-fit: contain; background: rgba(0,0,0,0.3);">
            <div><strong>Pal:</strong> "${safeText}"</div>
        </div>
    `;
    palMsg.style.cssText = 'background: rgba(147, 51, 234, 0.2); border-left: 3px solid #a855f7; padding: 8px; margin: 5px 0; border-radius: 5px;';
    logDiv.appendChild(palMsg);
    logDiv.scrollTop = logDiv.scrollHeight;
}

// Neutral encounters use weighted randomness: ~7/15 good, ~4/15 neutral, ~4/15 bad
function getNeutralOutcome() {
    const roll = Math.random() * 15;
    if (roll < 7) return 'good';      // ~47% - good outcome
    if (roll < 11) return 'neutral';  // ~27% - neutral outcome
    return 'bad';                      // ~27% - bad outcome
}

// Update encounter description dynamically
function updateEncounterDescription(title, icon, description, options) {
    document.getElementById('encounterTitle').textContent = title;

    // If icon is 'PAL', show PAL's image instead
    const imageHtml = icon === 'PAL'
        ? `<img src="assets/pal.png" alt="Pal" style="width: 80px; height: 80px; border-radius: 12px; object-fit: contain; background: rgba(147, 51, 234, 0.2); border: 2px solid #a855f7; margin-bottom: 15px;">`
        : `<p style="font-size: 2rem; margin-bottom: 15px;">${icon}</p>`;

    document.getElementById('encounterDescription').innerHTML = `
        ${imageHtml}
        <p>${description}</p>
    `;

    const optionsHtml = options.map(opt =>
        `<button class="option-btn" onclick="handleTutorialAction('${opt.action}')">${opt.text}</button>`
    ).join('');
    document.getElementById('encounterOptions').innerHTML = optionsHtml;
}

// Update floor/stage display in header
function updateFloorDisplay() {
    const stageInfo = STAGE_INFO[gameState.currentStage];
    const floorEl = document.getElementById('currentFloor');
    if (floorEl && stageInfo) {
        floorEl.textContent = stageInfo.name;
    }
}
