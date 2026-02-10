// ==================== MAIN INITIALIZATION ====================

// Initialize game when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Check for existing save and update title screen
    updateTitleScreenWithSave();

    // Initialize loading tip rotation
    initLoadingTips();

    // Setup keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (document.getElementById('pauseModal').classList.contains('show')) {
                closePauseMenu();
            } else if (document.getElementById('upgradeModal').classList.contains('show')) {
                document.getElementById('upgradeModal').classList.remove('show');
            } else if (!document.getElementById('gameScreen').classList.contains('hidden')) {
                showPauseMenu();
            }
        }
    });

    // Setup window unload handler for auto-save
    window.addEventListener('beforeunload', () => {
        if (gameState.players.length > 0) {
            saveGame();
        }
    });

    console.log('UNTITLED DICE GAME initialized');
});

// Track interval ID to prevent stacking
let _loadingTipInterval = null;

// Initialize and rotate loading tips on title screen
function initLoadingTips() {
    const tipText = document.getElementById('tipText');
    if (!tipText) return;

    // Clear any previous interval to prevent stacking
    if (_loadingTipInterval) {
        clearInterval(_loadingTipInterval);
        _loadingTipInterval = null;
    }

    // Set initial random tip
    tipText.textContent = getRandomLoadingTip();

    // Rotate tips every 8 seconds
    _loadingTipInterval = setInterval(() => {
        tipText.style.opacity = '0';
        setTimeout(() => {
            tipText.textContent = getRandomLoadingTip();
            tipText.style.opacity = '1';
        }, 500);
    }, 8000);
}

// Global error handler
window.onerror = function(msg, url, lineNo, columnNo, error) {
    console.error('Game Error:', msg, 'at', url, lineNo, columnNo);
    return false;
};
