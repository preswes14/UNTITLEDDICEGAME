// ==================== DRAFT MODE SYSTEM ====================
// Supports multiple draft modes for different reward scenarios

// Draft mode types
const DRAFT_MODES = {
    FCFS: 'first-come-first-served',  // Anyone can claim, first click wins
    SNAKE: 'snake',                    // Rotating priority (1,2,3,3,2,1...)
    DIBS: 'dibs-countdown'             // Call dibs, countdown, can be bumped
};

// Draft state
const draftState = {
    active: false,
    mode: null,
    sessionId: null,
    items: [],           // Available items: [{id, name, description, claimed: false, claimedBy: null}]
    claims: {},          // { itemId: { playerId, playerName, slot, timestamp } }
    // Snake draft specific
    snakeOrder: [],      // Current pick order
    snakeIndex: 0,       // Who's picking now
    snakeRound: 1,       // Which round of snake
    // Dibs specific
    dibsTimers: {},      // { itemId: { playerId, playerName, timeLeft, timer } }
    dibsCountdown: 5,    // Seconds before dibs is confirmed
    // Callbacks
    onItemClaimed: null,
    onDraftComplete: null,
    onDibsUpdate: null
};

// ==================== INITIALIZATION ====================

// Start a new draft session
function startDraft(options) {
    const {
        mode = DRAFT_MODES.FCFS,
        items = [],
        onItemClaimed = null,
        onDraftComplete = null,
        onDibsUpdate = null
    } = options;

    draftState.active = true;
    draftState.mode = mode;
    draftState.sessionId = 'draft_' + Date.now();
    draftState.items = items.map((item, idx) => ({
        id: item.id || `item_${idx}`,
        name: item.name,
        description: item.description,
        effect: item.effect,
        data: item.data,
        claimed: false,
        claimedBy: null,
        claimedBySlot: null
    }));
    draftState.claims = {};
    draftState.onItemClaimed = onItemClaimed;
    draftState.onDraftComplete = onDraftComplete;
    draftState.onDibsUpdate = onDibsUpdate;

    // Mode-specific initialization
    if (mode === DRAFT_MODES.SNAKE) {
        initSnakeDraft();
    } else if (mode === DRAFT_MODES.DIBS) {
        draftState.dibsTimers = {};
    }

    // Broadcast draft start if in multiplayer
    if (multiplayerState.enabled && multiplayerState.isHost) {
        broadcastDraftStart();
    }

    log(`Draft started: ${mode}`, 'info');
    return draftState.sessionId;
}

// End the draft session
function endDraft() {
    // Clear any dibs timers
    Object.values(draftState.dibsTimers).forEach(dibs => {
        if (dibs.timer) clearInterval(dibs.timer);
    });

    const claimedItems = draftState.items.filter(item => item.claimed);

    if (draftState.onDraftComplete) {
        draftState.onDraftComplete(claimedItems);
    }

    // Broadcast draft end
    if (multiplayerState.enabled && multiplayerState.isHost) {
        broadcastDraftEnd();
    }

    // Reset state
    draftState.active = false;
    draftState.mode = null;
    draftState.items = [];
    draftState.claims = {};
    draftState.dibsTimers = {};
    draftState.snakeOrder = [];
    draftState.snakeIndex = 0;

    log('Draft ended', 'info');
}

// ==================== FIRST-COME-FIRST-SERVED ====================

// Claim an item (FCFS mode)
function claimItemFCFS(itemId, playerId, playerSlot, playerName) {
    const item = draftState.items.find(i => i.id === itemId);
    if (!item) return { success: false, reason: 'Item not found' };
    if (item.claimed) return { success: false, reason: 'Already claimed' };

    // In multiplayer, host decides
    if (multiplayerState.enabled) {
        if (multiplayerState.isHost) {
            // Check for race condition
            if (draftState.claims[itemId]) {
                return { success: false, reason: 'Someone was faster!' };
            }

            // Grant the claim
            draftState.claims[itemId] = { playerId, playerName, slot: playerSlot, timestamp: Date.now() };
            item.claimed = true;
            item.claimedBy = playerName;
            item.claimedBySlot = playerSlot;

            if (draftState.onItemClaimed) {
                draftState.onItemClaimed(item, playerSlot, playerName);
            }

            broadcastClaimResult(itemId, true, playerId, playerSlot, playerName);
            checkDraftComplete();
            return { success: true, item };
        } else {
            // Non-host sends claim request
            requestClaimFromHost(itemId);
            return { success: 'pending', message: 'Claim request sent' };
        }
    } else {
        // Single player - just claim it
        item.claimed = true;
        item.claimedBy = playerName;
        item.claimedBySlot = playerSlot;

        if (draftState.onItemClaimed) {
            draftState.onItemClaimed(item, playerSlot, playerName);
        }

        checkDraftComplete();
        return { success: true, item };
    }
}

// ==================== SNAKE DRAFT ====================

// Initialize snake draft order
function initSnakeDraft() {
    // Randomize initial order
    const slots = [0, 1, 2];
    for (let i = slots.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [slots[i], slots[j]] = [slots[j], slots[i]];
    }

    // Snake pattern: 1,2,3,3,2,1,1,2,3...
    draftState.snakeOrder = [...slots];
    draftState.snakeIndex = 0;
    draftState.snakeRound = 1;

    log(`Snake draft order: ${slots.map(s => gameState.players[s]?.name || `P${s+1}`).join(' → ')}`, 'info');
}

// Get current picker in snake draft
function getSnakeCurrentPicker() {
    if (draftState.mode !== DRAFT_MODES.SNAKE) return null;
    if (draftState.snakeIndex >= draftState.snakeOrder.length) return null;
    return draftState.snakeOrder[draftState.snakeIndex];
}

// Check if it's a player's turn in snake draft
function isSnakeTurn(playerSlot) {
    return getSnakeCurrentPicker() === playerSlot;
}

// Claim an item (Snake mode)
function claimItemSnake(itemId, playerId, playerSlot, playerName) {
    const item = draftState.items.find(i => i.id === itemId);
    if (!item) return { success: false, reason: 'Item not found' };
    if (item.claimed) return { success: false, reason: 'Already claimed' };

    // Check if it's this player's turn
    if (!isSnakeTurn(playerSlot)) {
        const currentPicker = getSnakeCurrentPicker();
        const currentName = gameState.players[currentPicker]?.name || `Player ${currentPicker + 1}`;
        return { success: false, reason: `Not your turn! ${currentName} is picking.` };
    }

    // Grant the claim
    draftState.claims[itemId] = { playerId, playerName, slot: playerSlot, timestamp: Date.now() };
    item.claimed = true;
    item.claimedBy = playerName;
    item.claimedBySlot = playerSlot;

    if (draftState.onItemClaimed) {
        draftState.onItemClaimed(item, playerSlot, playerName);
    }

    // Advance snake
    advanceSnake();

    if (multiplayerState.enabled && multiplayerState.isHost) {
        broadcastClaimResult(itemId, true, playerId, playerSlot, playerName);
        broadcastSnakeUpdate();
    }

    checkDraftComplete();
    return { success: true, item };
}

// Advance to next picker in snake draft
function advanceSnake() {
    draftState.snakeIndex++;

    // Check if round complete
    if (draftState.snakeIndex >= draftState.snakeOrder.length) {
        draftState.snakeRound++;

        // Reverse order for snake pattern
        draftState.snakeOrder.reverse();
        draftState.snakeIndex = 0;

        log(`Snake round ${draftState.snakeRound}: ${draftState.snakeOrder.map(s =>
            gameState.players[s]?.name || `P${s+1}`).join(' → ')}`, 'info');
    }

    // Notify next picker
    const nextPicker = getSnakeCurrentPicker();
    if (nextPicker !== null) {
        const nextName = gameState.players[nextPicker]?.name || `Player ${nextPicker + 1}`;
        log(`${nextName}'s turn to pick!`, 'info');
    }
}

// ==================== DIBS + COUNTDOWN ====================

// Call dibs on an item
function callDibs(itemId, playerId, playerSlot, playerName) {
    const item = draftState.items.find(i => i.id === itemId);
    if (!item) return { success: false, reason: 'Item not found' };
    if (item.claimed) return { success: false, reason: 'Already claimed' };

    // Check if someone else has dibs
    if (draftState.dibsTimers[itemId]) {
        const existingDibs = draftState.dibsTimers[itemId];

        // Can bump if we're a different player
        if (existingDibs.playerId !== playerId) {
            // Clear existing timer
            if (existingDibs.timer) clearInterval(existingDibs.timer);

            log(`${playerName} bumped ${existingDibs.playerName} off ${item.name}!`, 'info');

            // Notify bumped player
            if (multiplayerState.enabled && multiplayerState.isHost) {
                sendActionResult(existingDibs.playerId, false, `${playerName} bumped you off ${item.name}!`);
            }
        } else {
            // Same player, refresh timer
            return { success: true, message: 'Dibs refreshed', timeLeft: existingDibs.timeLeft };
        }
    }

    // Set up dibs
    draftState.dibsTimers[itemId] = {
        playerId,
        playerSlot,
        playerName,
        timeLeft: draftState.dibsCountdown,
        timer: null
    };

    // Start countdown
    startDibsCountdown(itemId);

    log(`${playerName} called dibs on ${item.name}! (${draftState.dibsCountdown}s)`, 'info');

    if (multiplayerState.enabled && multiplayerState.isHost) {
        broadcastDibsUpdate(itemId, playerSlot, playerName, draftState.dibsCountdown);
    }

    return { success: true, message: 'Dibs called!', timeLeft: draftState.dibsCountdown };
}

// Start dibs countdown
function startDibsCountdown(itemId) {
    const dibs = draftState.dibsTimers[itemId];
    if (!dibs) return;

    dibs.timer = setInterval(() => {
        dibs.timeLeft--;

        if (draftState.onDibsUpdate) {
            draftState.onDibsUpdate(itemId, dibs.playerSlot, dibs.playerName, dibs.timeLeft);
        }

        if (multiplayerState.enabled && multiplayerState.isHost) {
            broadcastDibsUpdate(itemId, dibs.playerSlot, dibs.playerName, dibs.timeLeft);
        }

        if (dibs.timeLeft <= 0) {
            // Dibs confirmed - grant the item
            clearInterval(dibs.timer);
            confirmDibs(itemId);
        }
    }, 1000);
}

// Confirm dibs and grant item
function confirmDibs(itemId) {
    const dibs = draftState.dibsTimers[itemId];
    if (!dibs) return;

    const item = draftState.items.find(i => i.id === itemId);
    if (!item || item.claimed) return;

    // Grant the item
    draftState.claims[itemId] = {
        playerId: dibs.playerId,
        playerName: dibs.playerName,
        slot: dibs.playerSlot,
        timestamp: Date.now()
    };
    item.claimed = true;
    item.claimedBy = dibs.playerName;
    item.claimedBySlot = dibs.playerSlot;

    log(`${dibs.playerName} claimed ${item.name}!`, 'success');

    if (draftState.onItemClaimed) {
        draftState.onItemClaimed(item, dibs.playerSlot, dibs.playerName);
    }

    // Clean up
    delete draftState.dibsTimers[itemId];

    if (multiplayerState.enabled && multiplayerState.isHost) {
        broadcastClaimResult(itemId, true, dibs.playerId, dibs.playerSlot, dibs.playerName);
    }

    checkDraftComplete();
}

// Cancel dibs (player backing out)
function cancelDibs(itemId, playerId) {
    const dibs = draftState.dibsTimers[itemId];
    if (!dibs || dibs.playerId !== playerId) return false;

    clearInterval(dibs.timer);
    delete draftState.dibsTimers[itemId];

    log('Dibs cancelled', 'info');

    if (multiplayerState.enabled && multiplayerState.isHost) {
        broadcastDibsUpdate(itemId, null, null, 0);
    }

    return true;
}

// ==================== UNIFIED CLAIM FUNCTION ====================

// Main claim function - routes to correct mode
function claimDraftItem(itemId, playerId, playerSlot, playerName) {
    if (!draftState.active) {
        return { success: false, reason: 'No active draft' };
    }

    switch (draftState.mode) {
        case DRAFT_MODES.FCFS:
            return claimItemFCFS(itemId, playerId, playerSlot, playerName);
        case DRAFT_MODES.SNAKE:
            return claimItemSnake(itemId, playerId, playerSlot, playerName);
        case DRAFT_MODES.DIBS:
            return callDibs(itemId, playerId, playerSlot, playerName);
        default:
            return { success: false, reason: 'Unknown draft mode' };
    }
}

// ==================== COMPLETION CHECK ====================

// Check if draft is complete
function checkDraftComplete() {
    const unclaimedCount = draftState.items.filter(i => !i.claimed).length;

    // Draft is complete when all items claimed or all players have picked (for snake)
    if (unclaimedCount === 0) {
        endDraft();
        return true;
    }

    // For snake, also check if everyone has had their turns
    if (draftState.mode === DRAFT_MODES.SNAKE) {
        const totalPicks = draftState.items.filter(i => i.claimed).length;
        const playersCount = gameState.players.length;

        // If we've gone through enough rounds
        if (totalPicks >= draftState.items.length || totalPicks >= playersCount * 2) {
            endDraft();
            return true;
        }
    }

    return false;
}

// ==================== MULTIPLAYER BROADCASTS ====================

// Broadcast draft start
function broadcastDraftStart() {
    if (!multiplayerState.channel) return;

    multiplayerState.channel.send({
        type: 'broadcast',
        event: 'draft_start',
        payload: {
            sessionId: draftState.sessionId,
            mode: draftState.mode,
            items: draftState.items,
            snakeOrder: draftState.snakeOrder,
            snakeIndex: draftState.snakeIndex
        }
    });
}

// Broadcast draft end
function broadcastDraftEnd() {
    if (!multiplayerState.channel) return;

    multiplayerState.channel.send({
        type: 'broadcast',
        event: 'draft_end',
        payload: {
            sessionId: draftState.sessionId,
            claims: draftState.claims
        }
    });
}

// Broadcast claim result
function broadcastClaimResult(itemId, success, playerId, playerSlot, playerName) {
    if (!multiplayerState.channel) return;

    multiplayerState.channel.send({
        type: 'broadcast',
        event: 'draft_claim',
        payload: {
            itemId,
            success,
            playerId,
            playerSlot,
            playerName
        }
    });
}

// Broadcast snake update
function broadcastSnakeUpdate() {
    if (!multiplayerState.channel) return;

    multiplayerState.channel.send({
        type: 'broadcast',
        event: 'draft_snake_update',
        payload: {
            snakeOrder: draftState.snakeOrder,
            snakeIndex: draftState.snakeIndex,
            snakeRound: draftState.snakeRound,
            currentPicker: getSnakeCurrentPicker()
        }
    });
}

// Broadcast dibs update
function broadcastDibsUpdate(itemId, playerSlot, playerName, timeLeft) {
    if (!multiplayerState.channel) return;

    multiplayerState.channel.send({
        type: 'broadcast',
        event: 'draft_dibs',
        payload: {
            itemId,
            playerSlot,
            playerName,
            timeLeft
        }
    });
}

// Request claim from host (for non-host players)
function requestClaimFromHost(itemId) {
    if (!multiplayerState.channel) return;

    multiplayerState.channel.send({
        type: 'broadcast',
        event: 'draft_claim_request',
        payload: {
            itemId,
            playerId: multiplayerState.playerId,
            playerSlot: multiplayerState.playerSlot,
            timestamp: Date.now()
        }
    });
}

// ==================== MULTIPLAYER EVENT HANDLERS ====================

// Handle draft start (for non-host)
function handleDraftStart({ payload }) {
    if (multiplayerState.isHost) return;

    draftState.active = true;
    draftState.mode = payload.mode;
    draftState.sessionId = payload.sessionId;
    draftState.items = payload.items;
    draftState.snakeOrder = payload.snakeOrder || [];
    draftState.snakeIndex = payload.snakeIndex || 0;

    log(`Draft started: ${payload.mode}`, 'info');

    // Update UI if player view is active
    if (typeof renderDraftUI === 'function') {
        renderDraftUI();
    }
}

// Handle draft end (for non-host)
function handleDraftEnd({ payload }) {
    if (multiplayerState.isHost) return;

    draftState.active = false;
    draftState.claims = payload.claims;

    log('Draft ended', 'info');

    if (typeof hideDraftUI === 'function') {
        hideDraftUI();
    }
}

// Handle claim result (for everyone)
function handleDraftClaim({ payload }) {
    const { itemId, success, playerId, playerSlot, playerName } = payload;

    if (success) {
        const item = draftState.items.find(i => i.id === itemId);
        if (item) {
            item.claimed = true;
            item.claimedBy = playerName;
            item.claimedBySlot = playerSlot;
        }

        // Update UI
        if (typeof updateDraftItemUI === 'function') {
            updateDraftItemUI(itemId, playerName);
        }

        // Notify if it was us
        if (playerId === multiplayerState.playerId) {
            log(`You claimed ${item?.name || 'an item'}!`, 'success');
        } else {
            log(`${playerName} claimed ${item?.name || 'an item'}`, 'info');
        }
    }
}

// Handle snake update
function handleDraftSnakeUpdate({ payload }) {
    draftState.snakeOrder = payload.snakeOrder;
    draftState.snakeIndex = payload.snakeIndex;
    draftState.snakeRound = payload.snakeRound;

    const currentPicker = payload.currentPicker;
    if (currentPicker === multiplayerState.playerSlot) {
        log("It's your turn to pick!", 'success');
    }

    if (typeof updateSnakeUI === 'function') {
        updateSnakeUI(currentPicker);
    }
}

// Handle dibs update
function handleDraftDibs({ payload }) {
    const { itemId, playerSlot, playerName, timeLeft } = payload;

    if (timeLeft > 0) {
        draftState.dibsTimers[itemId] = { playerSlot, playerName, timeLeft };
    } else {
        delete draftState.dibsTimers[itemId];
    }

    if (typeof updateDibsUI === 'function') {
        updateDibsUI(itemId, playerSlot, playerName, timeLeft);
    }
}

// Handle claim request (host only)
function handleDraftClaimRequest({ payload }) {
    if (!multiplayerState.isHost) return;

    const { itemId, playerId, playerSlot, timestamp } = payload;
    const player = multiplayerState.connectedPlayers.find(p => p.id === playerId);
    const playerName = player?.name || `Player ${playerSlot + 1}`;

    const result = claimDraftItem(itemId, playerId, playerSlot, playerName);

    if (result.success === false) {
        sendActionResult(playerId, false, result.reason);
    }
}

// ==================== UI HELPERS ====================

// Get draft status for UI
function getDraftStatus() {
    if (!draftState.active) return null;

    return {
        mode: draftState.mode,
        items: draftState.items,
        claims: draftState.claims,
        snakeCurrentPicker: getSnakeCurrentPicker(),
        snakeRound: draftState.snakeRound,
        dibsTimers: draftState.dibsTimers
    };
}

// Check if player can claim
function canPlayerClaim(playerSlot, itemId) {
    if (!draftState.active) return false;

    const item = draftState.items.find(i => i.id === itemId);
    if (!item || item.claimed) return false;

    if (draftState.mode === DRAFT_MODES.SNAKE) {
        return isSnakeTurn(playerSlot);
    }

    return true;
}

// Get available items for a player
function getAvailableItems(playerSlot) {
    if (!draftState.active) return [];

    return draftState.items.filter(item => {
        if (item.claimed) return false;
        if (draftState.mode === DRAFT_MODES.SNAKE && !isSnakeTurn(playerSlot)) return false;
        return true;
    });
}

// ==================== REGISTER HANDLERS ====================

// Register multiplayer handlers (called when channel is set up)
function registerDraftHandlers(channel) {
    if (!channel) return;

    channel
        .on('broadcast', { event: 'draft_start' }, handleDraftStart)
        .on('broadcast', { event: 'draft_end' }, handleDraftEnd)
        .on('broadcast', { event: 'draft_claim' }, handleDraftClaim)
        .on('broadcast', { event: 'draft_snake_update' }, handleDraftSnakeUpdate)
        .on('broadcast', { event: 'draft_dibs' }, handleDraftDibs)
        .on('broadcast', { event: 'draft_claim_request' }, handleDraftClaimRequest);
}
