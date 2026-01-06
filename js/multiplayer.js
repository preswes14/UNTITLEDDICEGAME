// ==================== MULTIPLAYER SYSTEM ====================
// Uses Supabase Realtime for state synchronization

// Configuration - Supabase credentials
const SUPABASE_CONFIG = {
    url: 'https://dqsophptvtlweaiyqlco.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRxc29waHB0dnRsd2VhaXlxbGNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc2Njc3NDQsImV4cCI6MjA4MzI0Mzc0NH0.Ep4TYknEHpIa0cPyGnkk3qfiZkvh0woHCqMHDIPL0UQ'
};

// Multiplayer state
const multiplayerState = {
    enabled: false,
    isHost: false,
    roomCode: null,
    playerId: null,
    playerSlot: null, // 0, 1, or 2
    supabase: null,
    channel: null,
    connectedPlayers: [], // [{id, slot, name, lastPing, connected}]
    lastSyncTime: 0,
    // Connection management
    heartbeatInterval: null,
    lastPingTime: 0,
    connectionTimeout: 15000, // 15 seconds
    pingInterval: 5000, // 5 seconds
    isPaused: false,
    disconnectedPlayers: [], // Player IDs that are disconnected
    // Draft/claim system
    pendingClaims: {}, // { upgradeId: { playerId, timestamp } }
    claimedUpgrades: {} // { upgradeId: playerId }
};

// Generate a random 4-letter room code
function generateRoomCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ'; // No I or O to avoid confusion
    let code = '';
    for (let i = 0; i < 4; i++) {
        code += chars[Math.floor(Math.random() * chars.length)];
    }
    return code;
}

// Generate a unique player ID
function generatePlayerId() {
    return 'player_' + Math.random().toString(36).substr(2, 9);
}

// Initialize Supabase client
function initSupabase() {
    if (!SUPABASE_CONFIG.url || !SUPABASE_CONFIG.anonKey) {
        console.warn('Supabase not configured - multiplayer disabled');
        return false;
    }

    // Load Supabase from CDN if not already loaded
    if (typeof supabase === 'undefined') {
        console.error('Supabase client not loaded');
        return false;
    }

    multiplayerState.supabase = supabase.createClient(
        SUPABASE_CONFIG.url,
        SUPABASE_CONFIG.anonKey
    );
    multiplayerState.playerId = generatePlayerId();
    return true;
}

// Check if multiplayer is configured
function isMultiplayerConfigured() {
    return SUPABASE_CONFIG.url && SUPABASE_CONFIG.anonKey;
}

// Show multiplayer menu
function showMultiplayerMenu() {
    if (!isMultiplayerConfigured()) {
        alert('Multiplayer not configured!\n\nEdit js/multiplayer.js and add your Supabase URL and anon key.');
        return;
    }

    const modal = document.getElementById('upgradeModal');
    document.getElementById('upgradeTitle').textContent = 'Multiplayer';
    document.getElementById('upgradeDescription').innerHTML = `
        <p>Play with friends over the internet!</p>
        <p style="color:#888; margin-top:5px;">Share your room code with friends on Discord.</p>
    `;

    const options = document.getElementById('upgradeOptions');
    options.innerHTML = '';

    // Create Room option
    const createOpt = document.createElement('div');
    createOpt.className = 'upgrade-option';
    createOpt.innerHTML = `
        <h4>🏠 Create Room</h4>
        <p>Start a new game and invite friends</p>
    `;
    createOpt.onclick = () => {
        modal.classList.remove('show');
        createRoom();
    };
    options.appendChild(createOpt);

    // Join Room option
    const joinOpt = document.createElement('div');
    joinOpt.className = 'upgrade-option';
    joinOpt.innerHTML = `
        <h4>🚪 Join Room</h4>
        <p>Enter a room code to join friends</p>
    `;
    joinOpt.onclick = () => {
        modal.classList.remove('show');
        showJoinRoomPrompt();
    };
    options.appendChild(joinOpt);

    // Close button
    const closeBtn = document.createElement('button');
    closeBtn.className = 'option-btn';
    closeBtn.style.marginTop = '20px';
    closeBtn.textContent = 'Cancel';
    closeBtn.onclick = () => modal.classList.remove('show');
    options.appendChild(closeBtn);

    modal.classList.add('show');
}

// Create a new room
async function createRoom() {
    if (!initSupabase()) {
        alert('Failed to initialize Supabase');
        return;
    }

    const roomCode = generateRoomCode();
    multiplayerState.roomCode = roomCode;
    multiplayerState.isHost = true;
    multiplayerState.playerSlot = 0;
    multiplayerState.enabled = true;

    // Subscribe to the room channel
    await subscribeToRoom(roomCode);

    // Show waiting screen
    showHostWaitingScreen(roomCode);

    log(`Room created: ${roomCode}`, 'success');
}

// Show join room prompt
function showJoinRoomPrompt() {
    const modal = document.getElementById('upgradeModal');
    document.getElementById('upgradeTitle').textContent = 'Join Room';
    document.getElementById('upgradeDescription').innerHTML = `
        <p>Enter the 4-letter room code:</p>
        <input type="text" id="roomCodeInput" maxlength="4"
               style="font-size:2rem; text-align:center; width:150px; padding:10px;
                      text-transform:uppercase; background:#222; color:#fff; border:2px solid #ffd700;
                      border-radius:8px; margin:20px auto; display:block; font-family:monospace;">
    `;

    const options = document.getElementById('upgradeOptions');
    options.innerHTML = '';

    const joinBtn = document.createElement('button');
    joinBtn.className = 'option-btn';
    joinBtn.textContent = 'Join Game';
    joinBtn.onclick = () => {
        const code = document.getElementById('roomCodeInput').value.toUpperCase().trim();
        if (code.length === 4) {
            modal.classList.remove('show');
            joinRoom(code);
        } else {
            alert('Please enter a 4-letter code');
        }
    };
    options.appendChild(joinBtn);

    const cancelBtn = document.createElement('button');
    cancelBtn.className = 'option-btn';
    cancelBtn.style.marginTop = '10px';
    cancelBtn.textContent = 'Cancel';
    cancelBtn.onclick = () => modal.classList.remove('show');
    options.appendChild(cancelBtn);

    modal.classList.add('show');

    // Focus the input
    setTimeout(() => document.getElementById('roomCodeInput')?.focus(), 100);
}

// Join an existing room
async function joinRoom(roomCode) {
    if (!initSupabase()) {
        alert('Failed to initialize Supabase');
        return;
    }

    multiplayerState.roomCode = roomCode;
    multiplayerState.isHost = false;
    multiplayerState.enabled = true;

    // Subscribe to the room channel
    await subscribeToRoom(roomCode);

    // Request to join
    multiplayerState.channel.send({
        type: 'broadcast',
        event: 'player_join_request',
        payload: { playerId: multiplayerState.playerId }
    });

    showJoinWaitingScreen(roomCode);
    log(`Joining room: ${roomCode}...`, 'info');
}

// Subscribe to a room's realtime channel
async function subscribeToRoom(roomCode) {
    const channelName = `room:${roomCode}`;

    multiplayerState.channel = multiplayerState.supabase
        .channel(channelName, {
            config: {
                broadcast: { self: false }
            }
        })
        .on('broadcast', { event: 'player_join_request' }, handlePlayerJoinRequest)
        .on('broadcast', { event: 'player_accepted' }, handlePlayerAccepted)
        .on('broadcast', { event: 'player_list_update' }, handlePlayerListUpdate)
        .on('broadcast', { event: 'game_start' }, handleGameStart)
        .on('broadcast', { event: 'state_sync' }, handleStateSync)
        .on('broadcast', { event: 'player_action' }, handlePlayerAction)
        .on('broadcast', { event: 'action_result' }, handleActionResult)
        .on('broadcast', { event: 'chat_message' }, handleChatMessage)
        .on('broadcast', { event: 'phase_change' }, handlePhaseChange)
        .on('broadcast', { event: 'ping' }, handlePing)
        .on('broadcast', { event: 'pong' }, handlePong)
        .on('broadcast', { event: 'claim_request' }, handleClaimRequest)
        .on('broadcast', { event: 'claim_result' }, handleClaimResult)
        .on('broadcast', { event: 'player_disconnected' }, handlePlayerDisconnected)
        .on('broadcast', { event: 'player_reconnected' }, handlePlayerReconnected)
        .on('broadcast', { event: 'game_paused' }, handleGamePaused)
        .on('presence', { event: 'sync' }, handlePresenceSync)
        .on('presence', { event: 'leave' }, handlePlayerLeave);

    await multiplayerState.channel.subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
            // Track presence
            await multiplayerState.channel.track({
                playerId: multiplayerState.playerId,
                slot: multiplayerState.playerSlot,
                online_at: new Date().toISOString()
            });

            if (multiplayerState.isHost) {
                multiplayerState.connectedPlayers = [{
                    id: multiplayerState.playerId,
                    slot: 0,
                    name: 'Host'
                }];
            }
        }
    });
}

// Host: Handle join request
function handlePlayerJoinRequest({ payload }) {
    if (!multiplayerState.isHost) return;

    const { playerId } = payload;

    // Find next available slot
    const usedSlots = multiplayerState.connectedPlayers.map(p => p.slot);
    let nextSlot = null;
    for (let i = 1; i <= 2; i++) {
        if (!usedSlots.includes(i)) {
            nextSlot = i;
            break;
        }
    }

    if (nextSlot === null) {
        // Room full
        return;
    }

    // Accept the player
    multiplayerState.connectedPlayers.push({
        id: playerId,
        slot: nextSlot,
        name: `Player ${nextSlot + 1}`
    });

    // Send acceptance
    multiplayerState.channel.send({
        type: 'broadcast',
        event: 'player_accepted',
        payload: { playerId, slot: nextSlot }
    });

    // Update everyone's player list
    broadcastPlayerList();
    updateWaitingScreen();
}

// Guest: Handle being accepted
function handlePlayerAccepted({ payload }) {
    if (payload.playerId !== multiplayerState.playerId) return;

    multiplayerState.playerSlot = payload.slot;
    log(`Joined as Player ${payload.slot + 1}!`, 'success');
    updateJoinWaitingScreen();
}

// Everyone: Handle player list update
function handlePlayerListUpdate({ payload }) {
    multiplayerState.connectedPlayers = payload.players;
    updateWaitingScreen();
    updateJoinWaitingScreen();
}

// Everyone: Handle game start
function handleGameStart({ payload }) {
    multiplayerState.enabled = true;
    hideMultiplayerWaitingScreen();

    if (!multiplayerState.isHost) {
        // Guests receive full initial state
        restoreFromSave(payload.initialState);
    }

    // Start heartbeat for connection monitoring
    startHeartbeat();

    // Check if this client should show player view
    if (shouldShowPlayerView()) {
        // Initialize player view instead of host view
        initPlayerView();
        return;
    }

    // Start the game (host view)
    document.getElementById('titleScreen').classList.add('hidden');
    document.getElementById('gameScreen').classList.remove('hidden');
    renderMap();
    renderPlayers();
    renderDiceTray();
    updateDoomHopeDisplay();

    showRoomIndicator();
    log('Game started!', 'success');
}

// Everyone: Handle state sync from host
function handleStateSync({ payload }) {
    if (multiplayerState.isHost) return; // Host doesn't receive syncs

    const { state, timestamp } = payload;

    // Only apply if newer than our last sync
    if (timestamp > multiplayerState.lastSyncTime) {
        multiplayerState.lastSyncTime = timestamp;
        applyStateDelta(state);
    }
}

// Apply state changes (for guests)
function applyStateDelta(state) {
    // Update game state
    if (state.gold !== undefined) gameState.gold = state.gold;
    if (state.doom !== undefined) gameState.doom = state.doom;
    if (state.hope !== undefined) gameState.hope = state.hope;
    if (state.shields !== undefined) gameState.shields = state.shields;
    if (state.currentNode !== undefined) gameState.currentNode = state.currentNode;
    if (state.currentStage !== undefined) gameState.currentStage = state.currentStage;
    if (state.encounterNumber !== undefined) gameState.encounterNumber = state.encounterNumber;
    if (state.favor !== undefined) gameState.favor = state.favor;
    if (state.consumables !== undefined) gameState.consumables = state.consumables;
    if (state.canRoll !== undefined) gameState.canRoll = state.canRoll;
    if (state.allowedDiceTypes !== undefined) gameState.allowedDiceTypes = state.allowedDiceTypes;
    if (state.players !== undefined) {
        // Deep restore players
        restoreFromSave({ ...getSerializableState(), players: state.players, version: SAVE_VERSION });
    }
    if (state.map !== undefined) gameState.map = state.map;
    if (state.encounterState !== undefined) gameState.encounterState = state.encounterState;
    if (state.voting !== undefined) gameState.voting = state.voting;

    // Update UI based on view type
    if (typeof playerViewState !== 'undefined' && playerViewState.active) {
        // Update player view
        if (typeof onStateSync === 'function') {
            onStateSync();
        }
    } else {
        // Update host view
        renderMap();
        renderPlayers();
        renderDiceTray();
        updateDoomHopeDisplay();
    }
}

// Handle player actions (dice rolls, choices, etc.)
function handlePlayerAction({ payload }) {
    const { action, data, fromSlot, playerId } = payload;

    // Only host processes player actions
    if (!multiplayerState.isHost) return;

    switch (action) {
        case 'roll_die':
            // Player wants to roll a die
            if (gameState.canRoll && data.playerIndex === fromSlot) {
                rollDie(data.playerIndex, data.dieType);
                broadcastStateSync();
            }
            break;

        case 'update_name':
            // Player changed their name
            if (fromSlot !== null && gameState.players[fromSlot]) {
                gameState.players[fromSlot].name = data.name;
                const connectedPlayer = multiplayerState.connectedPlayers.find(p => p.slot === fromSlot);
                if (connectedPlayer) connectedPlayer.name = data.name;
                broadcastPlayerList();
                broadcastStateSync();
            }
            break;

        case 'talent_select':
            // Player selected best/worst die
            handleTalentSelection(fromSlot, data.type, data.category);
            break;

        case 'intertwine_select':
            // Player made intertwine selection
            handleIntertwineSelection(fromSlot, data);
            break;

        case 'request_save':
            // Player requested save
            saveGame();
            sendActionResult(playerId, true, 'Game saved!');
            break;

        case 'select_node':
            // Node selection
            if (data.nodeId !== undefined) {
                selectNode(data.nodeId);
                broadcastStateSync();
            }
            break;

        case 'make_choice':
            // Encounter choice made
            if (data.choiceIndex !== undefined) {
                // Handle choice
                broadcastStateSync();
            }
            break;

        case 'use_item':
            // Player wants to use a consumable
            handleItemUse(fromSlot, data.itemId);
            break;

        case 'spend_hope':
            // Player wants to spend HOPE
            if (gameState.hope > 0) {
                // Process HOPE spend based on context
                sendActionResult(playerId, true, 'HOPE spent!');
                broadcastStateSync();
            } else {
                sendActionResult(playerId, false, 'No HOPE available');
            }
            break;

        case 'spend_shield':
            // Player wants to use SHIELD
            if (gameState.shields > 0) {
                sendActionResult(playerId, true, 'SHIELD used!');
                broadcastStateSync();
            } else {
                sendActionResult(playerId, false, 'No SHIELD available');
            }
            break;
    }
}

// Handle action result (for players)
function handleActionResult({ payload }) {
    if (multiplayerState.isHost) return;

    const { success, message, playerId } = payload;
    if (playerId !== multiplayerState.playerId) return;

    if (message) {
        log(message, success ? 'success' : 'fail');
    }
}

// Handle phase change
function handlePhaseChange({ payload }) {
    const { phase, data } = payload;

    if (typeof playerViewState !== 'undefined') {
        playerViewState.currentPhase = phase;
        if (typeof renderPhaseContent === 'function') {
            renderPhaseContent();
        }
    }

    log(`Phase changed to: ${phase}`, 'info');
}

// Send action result to a specific player
function sendActionResult(playerId, success, message) {
    if (!multiplayerState.enabled || !multiplayerState.isHost) return;

    multiplayerState.channel.send({
        type: 'broadcast',
        event: 'action_result',
        payload: { playerId, success, message }
    });
}

// Broadcast phase change to all players
function broadcastPhaseChange(phase, data = {}) {
    if (!multiplayerState.enabled || !multiplayerState.isHost) return;

    multiplayerState.channel.send({
        type: 'broadcast',
        event: 'phase_change',
        payload: { phase, data }
    });
}

// Handle chat messages
function handleChatMessage({ payload }) {
    const { message, fromSlot } = payload;
    log(`[P${fromSlot + 1}] ${message}`, 'info');
}

// Handle presence sync
function handlePresenceSync() {
    const state = multiplayerState.channel.presenceState();
    // Update connected players based on presence
}

// Handle player leaving
function handlePlayerLeave({ payload }) {
    log('A player disconnected', 'fail');
}

// Broadcast player list (host only)
function broadcastPlayerList() {
    if (!multiplayerState.isHost) return;

    multiplayerState.channel.send({
        type: 'broadcast',
        event: 'player_list_update',
        payload: { players: multiplayerState.connectedPlayers }
    });
}

// Broadcast state sync (host only)
function broadcastStateSync() {
    if (!multiplayerState.enabled || !multiplayerState.isHost) return;

    const timestamp = Date.now();
    multiplayerState.lastSyncTime = timestamp;

    multiplayerState.channel.send({
        type: 'broadcast',
        event: 'state_sync',
        payload: {
            state: getSerializableState(),
            timestamp
        }
    });
}

// Broadcast a player action
function broadcastPlayerAction(action, data) {
    if (!multiplayerState.enabled) return;

    multiplayerState.channel.send({
        type: 'broadcast',
        event: 'player_action',
        payload: {
            action,
            data,
            fromSlot: multiplayerState.playerSlot
        }
    });
}

// Send a chat message
function sendChatMessage(message) {
    if (!multiplayerState.enabled) return;

    multiplayerState.channel.send({
        type: 'broadcast',
        event: 'chat_message',
        payload: {
            message,
            fromSlot: multiplayerState.playerSlot
        }
    });
}

// Host: Start the multiplayer game
function startMultiplayerGame() {
    if (!multiplayerState.isHost) return;
    if (multiplayerState.connectedPlayers.length < 2) {
        alert('Need at least 2 players to start!');
        return;
    }

    // Initialize game state
    resetGameState();
    initPlayers();
    generateMap();

    // Send game start with initial state
    multiplayerState.channel.send({
        type: 'broadcast',
        event: 'game_start',
        payload: {
            initialState: getSerializableState()
        }
    });

    // Start locally
    hideMultiplayerWaitingScreen();
    document.getElementById('titleScreen').classList.add('hidden');
    document.getElementById('gameScreen').classList.remove('hidden');

    renderMap();
    renderPlayers();
    renderDiceTray();
    updateDoomHopeDisplay();

    showRoomIndicator();
    log('Game started!', 'success');
}

// Show host waiting screen
function showHostWaitingScreen(roomCode) {
    const modal = document.getElementById('upgradeModal');
    const gameUrl = window.location.origin + window.location.pathname;
    document.getElementById('upgradeTitle').textContent = 'Room Created!';
    document.getElementById('upgradeDescription').innerHTML = `
        <p style="margin-bottom:15px;">Tell your friends to go to:</p>
        <div style="font-size:0.9rem; font-family:monospace; color:#60a5fa;
             background:#1a2a3a; padding:10px 15px; border-radius:6px; margin-bottom:20px;
             word-break:break-all; border:1px solid #3a5a7a;">${gameUrl}</div>
        <p>Then enter this code:</p>
        <div id="roomCodeDisplay" style="font-size:3rem; font-family:monospace; color:#ffd700;
             background:#222; padding:20px 40px; border-radius:10px; margin:15px auto;
             border:3px solid #ffd700; letter-spacing:10px;">${roomCode}</div>
        <p id="waitingPlayerCount">Waiting for players... (1/3)</p>
    `;

    const options = document.getElementById('upgradeOptions');
    options.innerHTML = '';

    const startBtn = document.createElement('button');
    startBtn.className = 'option-btn';
    startBtn.id = 'mpStartBtn';
    startBtn.textContent = 'Start Game';
    startBtn.disabled = true;
    startBtn.style.opacity = '0.5';
    startBtn.onclick = startMultiplayerGame;
    options.appendChild(startBtn);

    const cancelBtn = document.createElement('button');
    cancelBtn.className = 'option-btn';
    cancelBtn.style.marginTop = '10px';
    cancelBtn.textContent = 'Cancel';
    cancelBtn.onclick = () => {
        leaveRoom();
        modal.classList.remove('show');
    };
    options.appendChild(cancelBtn);

    modal.classList.add('show');
}

// Update waiting screen
function updateWaitingScreen() {
    const countEl = document.getElementById('waitingPlayerCount');
    if (countEl) {
        const count = multiplayerState.connectedPlayers.length;
        countEl.textContent = `Players connected: ${count}/3`;

        const startBtn = document.getElementById('mpStartBtn');
        if (startBtn) {
            startBtn.disabled = count < 2;
            startBtn.style.opacity = count >= 2 ? '1' : '0.5';
        }
    }
}

// Show join waiting screen
function showJoinWaitingScreen(roomCode) {
    const modal = document.getElementById('upgradeModal');
    document.getElementById('upgradeTitle').textContent = 'Joining...';
    document.getElementById('upgradeDescription').innerHTML = `
        <p>Connecting to room:</p>
        <div style="font-size:2rem; font-family:monospace; color:#ffd700; margin:20px;">
            ${roomCode}
        </div>
        <p id="joinStatus">Waiting for host to accept...</p>
    `;

    const options = document.getElementById('upgradeOptions');
    options.innerHTML = '';

    const cancelBtn = document.createElement('button');
    cancelBtn.className = 'option-btn';
    cancelBtn.textContent = 'Cancel';
    cancelBtn.onclick = () => {
        leaveRoom();
        modal.classList.remove('show');
    };
    options.appendChild(cancelBtn);

    modal.classList.add('show');
}

// Update join waiting screen
function updateJoinWaitingScreen() {
    const statusEl = document.getElementById('joinStatus');
    if (statusEl && multiplayerState.playerSlot !== null) {
        statusEl.innerHTML = `
            Joined as <span style="color:#ffd700;">Player ${multiplayerState.playerSlot + 1}</span>!<br>
            <small>Waiting for host to start...</small>
        `;
    }
}

// Hide multiplayer waiting screen
function hideMultiplayerWaitingScreen() {
    document.getElementById('upgradeModal').classList.remove('show');
}

// Show room indicator in game header
function showRoomIndicator() {
    if (!multiplayerState.enabled) return;

    let indicator = document.getElementById('roomIndicator');
    if (!indicator) {
        indicator = document.createElement('div');
        indicator.id = 'roomIndicator';
        indicator.style.cssText = `
            position:fixed; top:10px; right:10px; z-index:100;
            background:rgba(0,0,0,0.8); border:2px solid #ffd700;
            padding:8px 15px; border-radius:8px; font-family:monospace;
            color:#ffd700; font-size:0.9rem;
        `;
        document.body.appendChild(indicator);
    }

    indicator.innerHTML = `
        Room: <strong>${multiplayerState.roomCode}</strong>
        | P${multiplayerState.playerSlot + 1}
        ${multiplayerState.isHost ? '(Host)' : ''}
    `;
}

// Leave the current room
function leaveRoom() {
    if (multiplayerState.channel) {
        multiplayerState.channel.unsubscribe();
    }

    multiplayerState.enabled = false;
    multiplayerState.isHost = false;
    multiplayerState.roomCode = null;
    multiplayerState.playerSlot = null;
    multiplayerState.channel = null;
    multiplayerState.connectedPlayers = [];

    const indicator = document.getElementById('roomIndicator');
    if (indicator) indicator.remove();
}

// Hook into game state changes to broadcast sync
function setupMultiplayerHooks() {
    // Override autoSave to also broadcast
    const originalAutoSave = window.autoSave;
    window.autoSave = function() {
        if (originalAutoSave) originalAutoSave();
        broadcastStateSync();
    };
}

// Initialize multiplayer system
function initMultiplayer() {
    if (!isMultiplayerConfigured()) {
        console.log('Multiplayer: Not configured (add Supabase credentials to enable)');
        return;
    }

    setupMultiplayerHooks();
    console.log('Multiplayer: Ready');
}

// ==================== CONNECTION MANAGEMENT ====================

// Start heartbeat system
function startHeartbeat() {
    if (multiplayerState.heartbeatInterval) {
        clearInterval(multiplayerState.heartbeatInterval);
    }

    multiplayerState.heartbeatInterval = setInterval(() => {
        sendPing();
        checkConnectionTimeouts();
    }, multiplayerState.pingInterval);
}

// Stop heartbeat
function stopHeartbeat() {
    if (multiplayerState.heartbeatInterval) {
        clearInterval(multiplayerState.heartbeatInterval);
        multiplayerState.heartbeatInterval = null;
    }
}

// Send ping
function sendPing() {
    if (!multiplayerState.enabled || !multiplayerState.channel) return;

    multiplayerState.lastPingTime = Date.now();
    multiplayerState.channel.send({
        type: 'broadcast',
        event: 'ping',
        payload: {
            playerId: multiplayerState.playerId,
            timestamp: multiplayerState.lastPingTime
        }
    });
}

// Handle ping (respond with pong)
function handlePing({ payload }) {
    if (!multiplayerState.enabled) return;

    // Respond with pong
    multiplayerState.channel.send({
        type: 'broadcast',
        event: 'pong',
        payload: {
            playerId: multiplayerState.playerId,
            originalTimestamp: payload.timestamp
        }
    });
}

// Handle pong (update player connection status)
function handlePong({ payload }) {
    if (!multiplayerState.isHost) return;

    const { playerId, originalTimestamp } = payload;
    const player = multiplayerState.connectedPlayers.find(p => p.id === playerId);

    if (player) {
        player.lastPing = Date.now();
        player.connected = true;

        // Remove from disconnected list if reconnected
        const disconnectedIdx = multiplayerState.disconnectedPlayers.indexOf(playerId);
        if (disconnectedIdx !== -1) {
            multiplayerState.disconnectedPlayers.splice(disconnectedIdx, 1);
            handlePlayerReconnection(player);
        }
    }
}

// Check for connection timeouts (host only)
function checkConnectionTimeouts() {
    if (!multiplayerState.isHost) return;

    const now = Date.now();

    multiplayerState.connectedPlayers.forEach(player => {
        if (player.slot === 0) return; // Skip host

        const timeSinceLastPing = now - (player.lastPing || 0);

        if (timeSinceLastPing > multiplayerState.connectionTimeout && player.connected !== false) {
            // Player disconnected
            player.connected = false;
            if (!multiplayerState.disconnectedPlayers.includes(player.id)) {
                multiplayerState.disconnectedPlayers.push(player.id);
                handlePlayerDisconnection(player);
            }
        }
    });
}

// Handle player disconnection
function handlePlayerDisconnection(player) {
    log(`${player.name} disconnected!`, 'fail');

    // Broadcast disconnection to all players
    multiplayerState.channel.send({
        type: 'broadcast',
        event: 'player_disconnected',
        payload: { playerId: player.id, playerName: player.name, slot: player.slot }
    });

    // Pause the game
    pauseGameForDisconnect(player);
}

// Handle player reconnection
function handlePlayerReconnection(player) {
    log(`${player.name} reconnected!`, 'success');

    // Broadcast reconnection
    multiplayerState.channel.send({
        type: 'broadcast',
        event: 'player_reconnected',
        payload: { playerId: player.id, playerName: player.name, slot: player.slot }
    });

    // Resume game if all players connected
    if (multiplayerState.disconnectedPlayers.length === 0) {
        resumeGameFromDisconnect();
    }
}

// Handle player disconnected event (for players)
function handlePlayerDisconnected({ payload }) {
    const { playerName, slot } = payload;
    log(`${playerName} disconnected. Game paused.`, 'fail');

    if (typeof showDisconnectionOverlay === 'function') {
        showDisconnectionOverlay(playerName);
    }
}

// Handle player reconnected event (for players)
function handlePlayerReconnected({ payload }) {
    const { playerName } = payload;
    log(`${playerName} reconnected!`, 'success');

    if (typeof hideDisconnectionOverlay === 'function') {
        hideDisconnectionOverlay();
    }
}

// Pause game for disconnection
function pauseGameForDisconnect(disconnectedPlayer) {
    multiplayerState.isPaused = true;
    gameState.canRoll = false;

    // Broadcast pause
    multiplayerState.channel.send({
        type: 'broadcast',
        event: 'game_paused',
        payload: {
            reason: 'disconnect',
            playerName: disconnectedPlayer.name,
            message: `Waiting for ${disconnectedPlayer.name} to reconnect...`
        }
    });

    // Show pause overlay on host
    showHostDisconnectModal(disconnectedPlayer);
}

// Resume game from disconnect
function resumeGameFromDisconnect() {
    multiplayerState.isPaused = false;
    gameState.canRoll = true;

    // Hide overlays
    hideHostDisconnectModal();

    // Broadcast resume
    multiplayerState.channel.send({
        type: 'broadcast',
        event: 'game_paused',
        payload: { reason: 'resume' }
    });

    // Sync state to ensure everyone is up to date
    broadcastStateSync();
}

// Handle game paused event
function handleGamePaused({ payload }) {
    const { reason, playerName, message } = payload;

    if (reason === 'disconnect') {
        multiplayerState.isPaused = true;
        log(message || `Game paused - ${playerName} disconnected`, 'info');
    } else if (reason === 'resume') {
        multiplayerState.isPaused = false;
        log('Game resumed!', 'success');
    }
}

// Show disconnect modal on host screen
function showHostDisconnectModal(player) {
    let modal = document.getElementById('hostDisconnectModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'hostDisconnectModal';
        modal.className = 'modal';
        document.body.appendChild(modal);
    }

    modal.innerHTML = `
        <div class="modal-content" style="text-align:center;">
            <h2 style="color:#f87171;">Player Disconnected</h2>
            <p style="margin:20px 0;">${player.name} has disconnected.</p>
            <div class="waiting-spinner" style="margin:20px auto;"></div>
            <p style="color:#888;">Waiting for them to reconnect...</p>
            <div style="margin-top:30px; display:flex; gap:10px; justify-content:center;">
                <button class="menu-btn" onclick="continueWaitingForPlayer()">Keep Waiting</button>
                <button class="menu-btn" onclick="showPauseMenu()">Save & Menu</button>
            </div>
        </div>
    `;

    modal.classList.add('show');
}

// Hide disconnect modal
function hideHostDisconnectModal() {
    const modal = document.getElementById('hostDisconnectModal');
    if (modal) modal.classList.remove('show');
}

// Continue waiting for player
function continueWaitingForPlayer() {
    // Just keep the modal open, waiting continues
    log('Continuing to wait for disconnected player...', 'info');
}

// ==================== DRAFT/CLAIM SYSTEM ====================

// Request to claim an upgrade (player -> host)
function requestClaim(upgradeId) {
    if (!multiplayerState.enabled) return;

    multiplayerState.channel.send({
        type: 'broadcast',
        event: 'claim_request',
        payload: {
            playerId: multiplayerState.playerId,
            upgradeId: upgradeId,
            timestamp: Date.now()
        }
    });
}

// Handle claim request (host only)
function handleClaimRequest({ payload }) {
    if (!multiplayerState.isHost) return;

    const { playerId, upgradeId, timestamp } = payload;

    // Check if already claimed
    if (multiplayerState.claimedUpgrades[upgradeId]) {
        // Already claimed by someone else
        multiplayerState.channel.send({
            type: 'broadcast',
            event: 'claim_result',
            payload: {
                upgradeId: upgradeId,
                success: false,
                playerId: playerId,
                claimedBy: multiplayerState.claimedUpgrades[upgradeId]
            }
        });
        return;
    }

    // Check pending claims - first come first served
    if (multiplayerState.pendingClaims[upgradeId]) {
        const existing = multiplayerState.pendingClaims[upgradeId];
        if (existing.timestamp < timestamp) {
            // Someone else was first
            multiplayerState.channel.send({
                type: 'broadcast',
                event: 'claim_result',
                payload: {
                    upgradeId: upgradeId,
                    success: false,
                    playerId: playerId,
                    reason: 'Someone was faster!'
                }
            });
            return;
        }
    }

    // Grant the claim
    multiplayerState.pendingClaims[upgradeId] = { playerId, timestamp };
    multiplayerState.claimedUpgrades[upgradeId] = playerId;

    // Find player slot
    const player = multiplayerState.connectedPlayers.find(p => p.id === playerId);
    const slot = player ? player.slot : null;

    // Broadcast success
    multiplayerState.channel.send({
        type: 'broadcast',
        event: 'claim_result',
        payload: {
            upgradeId: upgradeId,
            success: true,
            playerId: playerId,
            slot: slot,
            playerName: player ? player.name : 'Unknown'
        }
    });

    // Apply the upgrade
    applyClaimedUpgrade(slot, upgradeId);
}

// Handle claim result (everyone)
function handleClaimResult({ payload }) {
    const { upgradeId, success, playerId, playerName, slot, reason } = payload;

    if (success) {
        log(`${playerName} claimed the upgrade!`, playerId === multiplayerState.playerId ? 'success' : 'info');

        // Update UI to show claimed status
        markUpgradeAsClaimed(upgradeId, playerName);
    } else if (playerId === multiplayerState.playerId) {
        log(reason || 'Claim failed - someone else got it first!', 'fail');
    }
}

// Mark an upgrade as claimed in the UI
function markUpgradeAsClaimed(upgradeId, playerName) {
    const upgradeEl = document.querySelector(`[data-upgrade-id="${upgradeId}"]`);
    if (upgradeEl) {
        upgradeEl.classList.add('claimed');
        upgradeEl.disabled = true;

        const badge = document.createElement('span');
        badge.className = 'claimed-badge';
        badge.textContent = `Claimed by ${playerName}`;
        upgradeEl.appendChild(badge);
    }
}

// Apply a claimed upgrade (host only)
function applyClaimedUpgrade(slot, upgradeId) {
    // This would integrate with the shop/upgrade system
    // Implementation depends on upgrade type
    console.log(`Applying upgrade ${upgradeId} to player slot ${slot}`);
    broadcastStateSync();
}

// Reset claims for new round
function resetClaims() {
    multiplayerState.pendingClaims = {};
    multiplayerState.claimedUpgrades = {};
}

// ==================== PLAYER ACTION SENDER ====================

// Send a player action to the host
function sendPlayerAction(action, data) {
    if (!multiplayerState.enabled || !multiplayerState.channel) return;

    multiplayerState.channel.send({
        type: 'broadcast',
        event: 'player_action',
        payload: {
            action: action,
            data: data,
            playerId: multiplayerState.playerId,
            fromSlot: multiplayerState.playerSlot
        }
    });
}

// ==================== DISCONNECTION OVERLAYS ====================

// Show disconnection overlay (player view)
function showDisconnectionOverlay(playerName) {
    let overlay = document.getElementById('pvDisconnectedOverlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'pvDisconnectedOverlay';
        overlay.className = 'pv-disconnected-overlay';
        document.body.appendChild(overlay);
    }

    overlay.innerHTML = `
        <h2>Game Paused</h2>
        <div class="reconnect-spinner"></div>
        <p>${playerName} has disconnected.</p>
        <p>Waiting for them to reconnect...</p>
        <button class="menu-btn" onclick="showPlayerMenu()" style="margin-top:20px;">Menu</button>
    `;

    overlay.style.display = 'flex';
}

// Hide disconnection overlay
function hideDisconnectionOverlay() {
    const overlay = document.getElementById('pvDisconnectedOverlay');
    if (overlay) overlay.style.display = 'none';
}

// ==================== HELPER FUNCTIONS ====================

// Handle talent selection from player
function handleTalentSelection(slot, type, category) {
    // Store selection and check if all players have made their choice
    if (!gameState.talentSelections) gameState.talentSelections = {};
    if (!gameState.talentSelections[slot]) gameState.talentSelections[slot] = {};

    gameState.talentSelections[slot][type] = category;

    // Check if all players have selected
    const allSelected = [0, 1, 2].every(s =>
        gameState.talentSelections[s] && gameState.talentSelections[s][type]
    );

    if (allSelected && type === 'worst') {
        // All players done with talent ranking, move to intertwine
        broadcastPhaseChange('intertwine');
    }

    broadcastStateSync();
}

// Handle intertwine selection from player
function handleIntertwineSelection(slot, data) {
    // Apply intertwine to player's die
    const player = gameState.players[slot];
    if (!player) return;

    // Find middle die category (the one not best or worst)
    const ranking = gameState.talentSelections?.[slot];
    if (!ranking) return;

    const categories = ['physical', 'verbal', 'preventative'];
    const middleCategory = categories.find(c => c !== ranking.best && c !== ranking.worst);
    const middleDie = player.dice[middleCategory];

    if (middleDie) {
        middleDie.swaps.push({
            faceValue: data.faceValue,
            targetPlayer: data.targetSlot,
            targetDieType: data.targetDieType
        });
    }

    broadcastStateSync();
}

// Handle item use from player
function handleItemUse(slot, itemId) {
    // Use consumable item
    // Implementation depends on item system
    broadcastStateSync();
}

// Call on page load
document.addEventListener('DOMContentLoaded', initMultiplayer);
