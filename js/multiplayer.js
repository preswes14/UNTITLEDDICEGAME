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
    connectedPlayers: [], // [{id, slot, name}]
    lastSyncTime: 0
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
        .on('broadcast', { event: 'chat_message' }, handleChatMessage)
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

    // Start the game
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
    if (state.players !== undefined) {
        // Deep restore players
        restoreFromSave({ ...getSerializableState(), players: state.players, version: SAVE_VERSION });
    }
    if (state.map !== undefined) gameState.map = state.map;
    if (state.encounterState !== undefined) gameState.encounterState = state.encounterState;
    if (state.voting !== undefined) gameState.voting = state.voting;

    // Update UI
    renderMap();
    renderPlayers();
    renderDiceTray();
    updateDoomHopeDisplay();
}

// Handle player actions (dice rolls, choices, etc.)
function handlePlayerAction({ payload }) {
    const { action, data, fromSlot } = payload;

    switch (action) {
        case 'roll_die':
            // Another player rolled - animate and apply
            if (fromSlot !== multiplayerState.playerSlot) {
                log(`Player ${fromSlot + 1} rolled!`, 'info');
            }
            break;
        case 'select_node':
            // Node selection
            break;
        case 'make_choice':
            // Encounter choice made
            break;
    }
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

// Call on page load
document.addEventListener('DOMContentLoaded', initMultiplayer);
