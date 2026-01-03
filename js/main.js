// ==================== MAIN INITIALIZATION ====================

// Initialize game when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Check for existing save and update title screen
    updateTitleScreenWithSave();

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

// Global error handler
window.onerror = function(msg, url, lineNo, columnNo, error) {
    console.error('Game Error:', msg, 'at', url, lineNo, columnNo);
    return false;
};
