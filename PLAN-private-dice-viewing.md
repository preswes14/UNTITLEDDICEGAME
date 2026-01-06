# Private Dice Viewing - Implementation Plan

## Overview
Transform the multiplayer experience so each player uses their personal device (phone) to view their private dice, make decisions, and interact with the game, while a shared "host" screen displays the communal game state.

---

## Phase 1: Player View Foundation

### 1.1 Create Player-Specific View Detection
- Detect if current client is host vs player based on `multiplayerState.playerSlot`
- Add URL parameter support: `?view=player&slot=1` for direct player links
- Create view switcher: `renderHostView()` vs `renderPlayerView()`

### 1.2 Player Phone Screen Structure
```
┌─────────────────────────────────┐
│  Header: Name + Connection      │
├─────────────────────────────────┤
│  Main: Current Phase Content    │
│  (dice view, action buttons)    │
├─────────────────────────────────┤
│  Footer: Your 3 Dice Summary    │
└─────────────────────────────────┘
```

**New file:** `js/playerView.js`
- `renderPlayerView()` - Main player UI
- `renderPlayerHeader()` - Name editor, connection status
- `renderPlayerDice()` - The 3 dice cards
- `renderPlayerActions()` - Phase-specific action buttons
- `showFaceListModal(die)` - 20-face breakdown

**New CSS:** `css/player-view.css`
- Mobile-first responsive design
- Touch-friendly button sizes (min 44px)
- Swipe/drag support for dice rotation

---

## Phase 2: Interactive Dice Display

### 2.1 Dice Visualization
**Option A: CSS 3D Transforms** (simpler, recommended for MVP)
- Create a d20 approximation using CSS transforms
- Touch drag to rotate X/Y axes
- Show current "up" face prominently

**Option B: Three.js** (more polished, future enhancement)
- Full 3D icosahedron with face textures
- Smooth rotation physics
- Can defer to Phase 2 polish

### 2.2 Face List Modal
When player taps "📋 View All Faces":
```
Face 1:  1  (original)
Face 2:  ██ SCRATCHED → now shows 1
Face 3:  19 [+17 upgraded]
Face 4:  4  (original)
Face 5:  5  🔗→ Red's Verbal
Face 6:  6  ✨ HOPE trigger
Face 7:  7  ☠️ Ferryman mark
...
Face 20: 20 (original)
```

Show:
- Original value vs current value
- Swap links (who it connects to)
- Hope segments (which faces grant hope)
- Crossed/Ferryman marks
- Upgrade history if available

---

## Phase 3: Bidirectional Communication

### 3.1 New Message Types
```javascript
// Player → Host
'player_action': {
  type: 'roll' | 'select' | 'claim' | 'confirm' | 'vote',
  playerId: string,
  payload: { ... }
}

// Host → Player
'action_result': {
  success: boolean,
  playerId: string,
  message: string
}

// Host → All
'phase_change': {
  phase: string,
  data: { ... }
}

// Claiming system
'claim_request': { playerId, upgradeId }
'claim_granted': { playerId, upgradeId }
'claim_denied': { playerId, reason }
```

### 3.2 Update multiplayer.js
- Add `sendPlayerAction(type, payload)` for guests
- Add `handlePlayerAction(data)` on host
- Add `broadcastToPlayer(playerId, event, data)` for targeted messages

---

## Phase 4: Phase-Specific Player Actions

### 4.1 Setup Phase
- Player enters/edits their character name
- Player taps "Ready" when done
- Host sees ready status for all players

### 4.2 Action Assignment Phase
- Each player drags ONLY their hero token
- Player sees their assigned die type after placement
- Host sees all assignments in real-time

### 4.3 Talent Ranking Phase
- Player sees their 3 dice
- Player selects "Best" die (tap)
- Player selects "Worst" die (tap)
- Middle die auto-assigned
- **Confirmation:** "Set [Slash] as your BEST die? This will upgrade one face to 20."

### 4.4 Intertwining Phase
- Player sees their "middle" die
- Player picks face number (6-10)
- Player picks target ally + die type
- Repeat for second ally
- **Confirmation:** "Link face 7 to Red's Verbal die?"

### 4.5 Map Navigation
- Players vote on next node (if voting enabled)
- Or host makes selection visible to all

### 4.6 Encounter Phase
**Standard Encounters:**
- Show encounter description
- Player sees available actions
- Actions execute immediately or queue for host

**Draft/Claim Encounters (new):**
- Multiple upgrade options shown
- Player taps to claim
- First tap wins (server-side timestamp)
- **Confirmation:** "Claim '+2 to lowest face'? (2 others are eyeing this!)"
- Claimed items gray out for others
- Shows "Claimed by [Name]" badge

### 4.7 Combat Phase
- Player sees their die ready to roll
- Tap to roll when it's their turn
- See result with success/fail feedback
- **Confirmation on HOPE spend:** "Spend 1 HOPE to reroll?"

### 4.8 Shop/Upgrade Phase
- Player sees available upgrades
- Player selects which of THEIR dice to upgrade
- **Confirmation:** "Apply +2 to your Slash die's face 3 (currently 3 → 5)?"

---

## Phase 5: Confirmation System

### 5.1 Confirmation Modal Component
```javascript
function showConfirmation(options) {
  // options: { title, message, onConfirm, onCancel, danger: boolean }
  // Returns promise resolving to true/false
}
```

### 5.2 Apply to All Upgrade Actions
- Talent ranking (best/worst selection)
- Intertwining setup
- Claiming draft bonuses
- Shop purchases
- Using consumables
- Spending HOPE/SHIELD

### 5.3 Visual Danger Indicators
- Normal actions: Blue confirm button
- Risky actions: Orange confirm button
- Irreversible: Red confirm button with "Are you sure?"

---

## Phase 6: Host Display Mode

### 6.1 Transform Host View
When multiplayer active, host screen becomes "TV mode":
- Larger text for viewing from distance
- No interactive elements (display only)
- Shows overall game state
- Shows player action feed ("Blue selected Slash as Best")
- Shows current phase + waiting status

### 6.2 Host Controls (minimal)
- Pause game
- Kick player (with confirmation)
- Override stuck actions (timeout helper)

---

## Phase 7: Connection Management

### 7.1 Heartbeat System
```javascript
const PING_INTERVAL = 5000;  // 5 seconds
const TIMEOUT_THRESHOLD = 15000;  // 15 seconds

// Player sends ping every 5s
// Host tracks last ping per player
// If no ping for 15s, mark as "disconnected"
```

### 7.2 Disconnection Handling
- Show "⚠️ [Name] disconnected" on host
- Show "Reconnecting..." on player device
- Game pauses if critical action needed from disconnected player

### 7.3 Reconnection Flow
- Player rejoins same room code
- Host recognizes player ID
- Host sends current game state
- Player resumes at current phase
- Show "✓ [Name] reconnected" on host

### 7.4 Timeout Resolution
After 60 seconds of disconnection:
- Host gets prompt: "Blue has been disconnected for 60s"
  - [Wait longer]
  - [Continue without] (skip their actions)
  - [End game]

---

## File Changes Summary

### New Files
- `js/playerView.js` - Player phone view rendering
- `css/player-view.css` - Mobile-first player styles
- `js/confirmation.js` - Confirmation modal system

### Modified Files
- `js/multiplayer.js` - Add bidirectional messaging, heartbeat
- `js/screens.js` - Add view detection, route to player view
- `js/ui.js` - Add host display mode
- `js/encounters.js` - Add claim system for drafts
- `index.html` - Add player view container, new script/css includes

---

## Implementation Order

1. **Player view foundation** - Separate views, basic phone layout
2. **Face list modal** - Simple list of 20 faces with states
3. **Bidirectional messaging** - Player actions to host
4. **Confirmation modals** - "Are you sure?" system
5. **Phase-specific actions** - Each game phase on phone
6. **Draft/claim system** - First-come-first-served locking
7. **Interactive dice** - CSS 3D rotation (polish)
8. **Connection management** - Heartbeat, reconnection

---

## Questions for User Before Starting

1. **Dice rotation style:** Simple CSS 3D cube-ish or fancy icosahedron? (Recommend: start simple)

2. **Confirmation strictness:** Every single upgrade action, or just "dangerous" ones?

3. **Disconnection behavior:** Pause game entirely, or let others continue?

4. **Player names:** Free text entry, or pick from preset list?

5. **Host override:** Should host be able to make moves for disconnected players?
