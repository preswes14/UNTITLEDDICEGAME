// ==================== CONFIRMATION MODAL SYSTEM ====================
// "Are you sure?" dialogs for important actions

// Show a confirmation dialog
function showConfirmation(options) {
    const {
        title = 'Confirm',
        message = 'Are you sure?',
        confirmText = 'Confirm',
        cancelText = 'Cancel',
        danger = false,
        onConfirm = () => {},
        onCancel = () => {}
    } = options;

    // Create or get modal
    let modal = document.getElementById('confirmationModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'confirmationModal';
        modal.className = 'pv-modal';
        document.body.appendChild(modal);
    }

    modal.innerHTML = `
        <div class="pv-modal-content confirm-modal-content">
            <h2>${escapeHtml(title)}</h2>
            <p class="confirm-message">${escapeHtml(message)}</p>
            <div class="confirm-buttons">
                <button class="confirm-btn-no" id="confirmNo">${escapeHtml(cancelText)}</button>
                <button class="confirm-btn-yes ${danger ? 'danger' : ''}" id="confirmYes">${escapeHtml(confirmText)}</button>
            </div>
        </div>
    `;

    // Add event listeners
    document.getElementById('confirmYes').onclick = () => {
        modal.classList.remove('show');
        onConfirm();
    };

    document.getElementById('confirmNo').onclick = () => {
        modal.classList.remove('show');
        onCancel();
    };

    // Show modal
    modal.classList.add('show');
}

// Promise-based confirmation
function confirm(options) {
    return new Promise((resolve) => {
        showConfirmation({
            ...options,
            onConfirm: () => resolve(true),
            onCancel: () => resolve(false)
        });
    });
}

// Utility function to escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Pre-built confirmation dialogs for common actions

// Confirm spending HOPE
function confirmHopeSpend(amount = 1) {
    return confirm({
        title: 'Spend HOPE?',
        message: `Spend ${amount} HOPE to reroll?\n\nYou have ${gameState.hope} HOPE remaining.`,
        confirmText: 'Spend HOPE',
        danger: gameState.hope <= amount
    });
}

// Confirm spending SHIELD
function confirmShieldSpend() {
    return confirm({
        title: 'Use SHIELD?',
        message: `Use 1 SHIELD to prevent this DOOM roll?\n\nYou have ${gameState.shields} SHIELD remaining.`,
        confirmText: 'Use SHIELD',
        danger: gameState.shields <= 1
    });
}

// Confirm upgrade purchase
function confirmUpgrade(upgradeName, cost, currency = 'Favor') {
    return confirm({
        title: 'Apply Upgrade?',
        message: `Apply "${upgradeName}"?\n\nCost: ${cost} ${currency}`,
        confirmText: 'Apply'
    });
}

// Confirm claiming a draft bonus
function confirmClaim(bonusName, playersWaiting = 0) {
    let message = `Claim "${bonusName}"?`;
    if (playersWaiting > 0) {
        message += `\n\n${playersWaiting} other player${playersWaiting > 1 ? 's are' : ' is'} also considering this!`;
    }
    return confirm({
        title: 'Claim Bonus?',
        message: message,
        confirmText: 'Claim It!'
    });
}

// Confirm intertwine link
function confirmIntertwine(faceValue, targetPlayerName, targetDieName) {
    return confirm({
        title: 'Confirm Link',
        message: `Link face ${faceValue} to ${targetPlayerName}'s ${targetDieName} die?\n\nWhen you roll ${faceValue}, their die will roll instead!`,
        confirmText: 'Link'
    });
}

// Confirm using a consumable item
function confirmUseItem(itemName, effect) {
    return confirm({
        title: 'Use Item?',
        message: `Use ${itemName}?\n\n${effect}`,
        confirmText: 'Use'
    });
}

// Warning for destructive actions
function confirmDangerous(title, message) {
    return confirm({
        title: title,
        message: message,
        confirmText: 'I understand',
        cancelText: 'Go back',
        danger: true
    });
}
