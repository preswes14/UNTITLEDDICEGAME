// ==================== UTILITY FUNCTIONS ====================

// Add gold to player's inventory
function addGold(amount) {
    gameState.gold += amount;
    updateDoomHopeDisplay();
    log(`+${amount} Gold!`, 'crit');
    autoSave();
}

// Spend gold (returns true if successful)
function spendGold(amount) {
    if (gameState.gold >= amount) {
        gameState.gold -= amount;
        updateDoomHopeDisplay();
        autoSave();
        return true;
    }
    return false;
}

// Add DOOM to the meter
function addDoom(amount, reason = '') {
    gameState.doom += amount;
    updateDoomHopeDisplay();
    if (reason) {
        log(`+${amount} DOOM: ${reason}`, 'doom');
    }
    autoSave();
}

// Reduce DOOM
function reduceDoom(amount) {
    const reduced = Math.min(gameState.doom, amount);
    gameState.doom -= reduced;
    updateDoomHopeDisplay();
    autoSave();
    return reduced;
}

// Add HOPE (bankable charges)
function addHope(amount = 1) {
    const added = Math.min(amount, gameState.maxHope - gameState.hope);
    if (added > 0) {
        gameState.hope += added;
        log(`+${added} HOPE charge!`, 'hope');
        updateDoomHopeDisplay();
        autoSave();
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
        autoSave();
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
        autoSave();
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
        autoSave();
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
    palMsg.innerHTML = `<strong>Pal:</strong> "${text}"`;
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
    document.getElementById('encounterDescription').innerHTML = `
        <p style="font-size: 2rem; margin-bottom: 15px;">${icon}</p>
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
