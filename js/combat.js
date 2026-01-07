// ==================== COMBAT SYSTEMS ====================

// Start regular combat
function startCombat(option, node) {
    gameState.canRoll = true;
    gameState.allowedDiceTypes = ['physical', 'verbal', 'preventative'];

    // Generate DCs using Total DC Sum system
    const isBoss = node.type === 'boss';
    let approachDCs;
    let rewardPerSuccess = 5; // Default

    if (node.dcConfig && ENEMY_DC_CONFIG[node.dcConfig]) {
        // Use the new Total DC Sum system
        const config = ENEMY_DC_CONFIG[node.dcConfig];
        approachDCs = generateTotalDCSumDCs(config);
        rewardPerSuccess = config.rewardPerSuccess || 5;

        // Apply favor DC reduction for non-boss enemies
        const dcReduction = gameState.favorModifiers?.dcReduction || 0;
        if (dcReduction > 0) {
            Object.keys(approachDCs).forEach(key => {
                approachDCs[key] = Math.max(1, approachDCs[key] - dcReduction);
            });
        }
    } else {
        // Fallback to old system for backwards compatibility
        const dcOptions = [
            Math.floor(Math.random() * 4) + 5,
            Math.floor(Math.random() * 4) + 10,
            Math.floor(Math.random() * 4) + 14
        ];
        const shuffled = dcOptions.sort(() => Math.random() - 0.5);
        approachDCs = {
            physical: shuffled[0],
            verbal: shuffled[1],
            preventative: shuffled[2]
        };
    }

    const thresholds = node.successThresholds || { physical: 2, verbal: 2, preventative: 2 };
    const totalSuccessesNeeded = Object.values(thresholds).reduce((a, b) => Math.min(a, b), Infinity);

    gameState.encounterState = {
        type: 'combat',
        enemyName: node.name,
        rewardPerSuccess: rewardPerSuccess,
        successThresholds: { ...thresholds },
        successCounters: { physical: 0, verbal: 0, preventative: 0 },
        approachDCs: approachDCs,
        isBoss: isBoss
    };

    gameState.targetDC = Math.min(...Object.values(approachDCs));

    updateCombatUI(node);
    document.getElementById('encounterOptions').innerHTML = '';
    renderDiceTray();
}

// Update combat UI display
function updateCombatUI(node) {
    const state = gameState.encounterState;
    const thresholds = state.successThresholds;
    const counters = state.successCounters;
    const dcs = state.approachDCs || { physical: gameState.targetDC, verbal: gameState.targetDC, preventative: gameState.targetDC };

    const buildProgress = (type, color) => {
        const needed = thresholds[type];
        const current = counters[type];
        const dc = dcs[type];
        let dots = '';
        for (let i = 0; i < needed; i++) {
            dots += i < current ? '\u25CF' : '\u25CB';
        }
        const dcColor = dc < 10 ? '#4ade80' : dc < 14 ? '#ffd700' : '#f87171';
        return `<span style="color:${color};">${type.charAt(0).toUpperCase() + type.slice(1)} <span style="color:${dcColor}; font-size:0.85em;">(DC ${dc})</span>: ${dots}</span>`;
    };

    document.getElementById('encounterDescription').innerHTML = `
        <p>${node.description}</p>
        <div style="margin-top:20px; padding:15px; background:rgba(255,50,50,0.15); border-radius:10px; border-left:4px solid #f87171;">
            <h3 style="color:#f87171;">${node.name}</h3>
            <p style="color:#aaa; margin-bottom:10px;">Each approach has a different DC! Choose wisely.</p>
            <div id="combatProgress" style="font-size:1.1rem; display:flex; flex-direction:column; gap:8px;">
                ${buildProgress('physical', 'var(--physical-primary)')}
                ${buildProgress('verbal', 'var(--verbal-primary)')}
                ${buildProgress('preventative', 'var(--preventative-primary)')}
            </div>
        </div>
        <p style="margin-top:15px; color:#88ccff;">Roll any die to make progress! Fill a bar to win!</p>
    `;
}

// Refresh combat progress display
function refreshCombatProgress() {
    const state = gameState.encounterState;
    if (!state || state.type !== 'combat') return;

    const thresholds = state.successThresholds;
    const counters = state.successCounters;
    const dcs = state.approachDCs || { physical: gameState.targetDC, verbal: gameState.targetDC, preventative: gameState.targetDC };

    const buildProgress = (type, color) => {
        const needed = thresholds[type];
        const current = counters[type];
        const dc = dcs[type];
        let dots = '';
        for (let i = 0; i < needed; i++) {
            dots += i < current ? '\u25CF' : '\u25CB';
        }
        const dcColor = dc < 10 ? '#4ade80' : dc < 14 ? '#ffd700' : '#f87171';
        return `<span style="color:${color};">${type.charAt(0).toUpperCase() + type.slice(1)} <span style="color:${dcColor}; font-size:0.85em;">(DC ${dc})</span>: ${dots}</span>`;
    };

    const progressDiv = document.getElementById('combatProgress');
    if (progressDiv) {
        progressDiv.innerHTML = `
            ${buildProgress('physical', 'var(--physical-primary)')}
            ${buildProgress('verbal', 'var(--verbal-primary)')}
            ${buildProgress('preventative', 'var(--preventative-primary)')}
        `;
    }
}

// Start boss combat
function startBossCombat(option, node) {
    const stage = gameState.currentStage || 1;
    const bossData = BOSSES[stage];

    // Generate DCs using Total DC Sum system
    let approachDCs;
    if (bossData.dcConfig) {
        approachDCs = generateTotalDCSumDCs(bossData.dcConfig);
    } else {
        // Fallback for backwards compatibility
        const baseMin = 8 + stage;
        const dcOptions = [
            Math.floor(Math.random() * 3) + baseMin,
            Math.floor(Math.random() * 3) + baseMin + 2,
            Math.floor(Math.random() * 3) + baseMin + 1
        ];
        const shuffled = dcOptions.sort(() => Math.random() - 0.5);
        approachDCs = { physical: shuffled[0], verbal: shuffled[1], preventative: shuffled[2] };
    }

    // Apply favor boss DC reduction
    const bossDcReduction = gameState.favorModifiers?.bossDcReduction || 0;
    if (bossDcReduction > 0) {
        Object.keys(approachDCs).forEach(key => {
            approachDCs[key] = Math.max(1, approachDCs[key] - bossDcReduction);
        });
    }

    // Apply favor boss threshold reduction
    const thresholdReduction = gameState.favorModifiers?.bossThresholdReduction || 0;
    const modifiedThresholds = { ...bossData.successThresholds };
    if (thresholdReduction > 0) {
        Object.keys(modifiedThresholds).forEach(key => {
            modifiedThresholds[key] = Math.max(1, modifiedThresholds[key] - thresholdReduction);
        });
    }

    gameState.canRoll = true;
    gameState.targetDC = Math.min(...Object.values(approachDCs));
    gameState.allowedDiceTypes = option.types;
    gameState.encounterState = {
        type: 'boss_combat',
        enemyName: bossData.name,
        reward: node.reward,
        successThresholds: modifiedThresholds,
        successCounters: { physical: 0, verbal: 0, preventative: 0 },
        approachDCs: approachDCs,
        attacksPerRound: bossData.attacksPerRound,
        chosenApproach: option.types[0],
        roundMisses: 0,
        rollsThisRound: 0,
        playersRolledThisRound: [],
        roundNumber: 1,
        // BOMB immunity cycling - only for Stage 5
        immuneApproach: stage === 5 ? getRandomApproach() : null,
        isBOMB: stage === 5
    };

    updateBossCombatUI();
    document.getElementById('encounterOptions').innerHTML = '';
    renderDiceTray();
}

// Get a random approach type
function getRandomApproach() {
    const approaches = ['physical', 'verbal', 'preventative'];
    return approaches[Math.floor(Math.random() * approaches.length)];
}

// Update boss combat UI
function updateBossCombatUI() {
    const state = gameState.encounterState;
    if (!state || state.type !== 'boss_combat') return;

    const stage = gameState.currentStage || 1;
    const bossData = BOSSES[stage];
    const dcs = state.approachDCs || { physical: bossData.dc, verbal: bossData.dc, preventative: bossData.dc };

    const needToRoll = gameState.players
        .filter((p, idx) => !state.playersRolledThisRound.includes(idx) && p.hp > 0)
        .map(p => p.name);

    const waitingText = needToRoll.length > 0
        ? `<strong>${needToRoll.join(', ')}</strong> - your turn to roll!`
        : 'Round complete!';

    // Build progress display for all approaches
    const buildProgress = (type, color) => {
        const needed = state.successThresholds[type];
        const current = state.successCounters[type];
        const dc = dcs[type];
        const isImmune = state.immuneApproach === type;
        let dots = '';
        for (let i = 0; i < needed; i++) {
            dots += i < current ? '\u25CF' : '\u25CB';
        }
        const dcColor = dc < 12 ? '#4ade80' : dc < 15 ? '#ffd700' : '#f87171';
        const immuneStyle = isImmune ? 'text-decoration: line-through; opacity: 0.5;' : '';
        const immuneLabel = isImmune ? ' <span style="color:#f87171; font-size:0.8em;">[IMMUNE]</span>' : '';
        return `<span style="color:${color}; ${immuneStyle}">${type.charAt(0).toUpperCase() + type.slice(1)} <span style="color:${dcColor}; font-size:0.85em;">(DC ${dc})</span>: ${dots}${immuneLabel}</span>`;
    };

    // BOMB immunity warning
    const immuneWarning = state.isBOMB && state.immuneApproach
        ? `<div style="background:rgba(248,113,113,0.2); padding:8px; border-radius:5px; margin:10px 0; border-left:3px solid #f87171;">
             <p style="color:#f87171; margin:0; font-size:0.9rem;">
               <strong>BOMB is IMMUNE to ${state.immuneApproach.toUpperCase()}</strong> this round!
             </p>
           </div>`
        : '';

    document.getElementById('encounterDescription').innerHTML = `
        <p>${bossData.description}</p>
        <div style="margin-top:20px; padding:15px; background:rgba(139,0,139,0.2); border-radius:10px; border-left:4px solid #9333ea;">
            <h3 style="color:#c084fc;">BOSS: ${bossData.name}</h3>
            ${immuneWarning}
            <div id="bossSuccessDisplay" style="margin:15px 0; display:flex; flex-direction:column; gap:8px;">
                ${buildProgress('physical', 'var(--physical-primary, #f87171)')}
                ${buildProgress('verbal', 'var(--verbal-primary, #60a5fa)')}
                ${buildProgress('preventative', 'var(--preventative-primary, #4ade80)')}
            </div>
            <div style="background:rgba(0,0,0,0.3); padding:10px; border-radius:5px; margin:10px 0;">
                <p style="color:#ffd700; margin:0;">Round ${state.roundNumber} | Roll ${state.rollsThisRound + 1}/3</p>
                <p style="color:#88ccff; margin:5px 0 0 0; font-size:0.95rem;">${waitingText}</p>
            </div>
        </div>
    `;
}

// Process end of boss round
function processBossRoundEnd(state) {
    let numAttacks = state.attacksPerRound;
    if (Array.isArray(numAttacks)) {
        numAttacks = Math.floor(Math.random() * (numAttacks[1] - numAttacks[0] + 1)) + numAttacks[0];
    }

    const attacksToMake = Math.min(state.roundMisses, numAttacks);

    if (attacksToMake > 0) {
        log(`${state.enemyName} strikes ${attacksToMake} time(s)!`, 'doom');
        gameState.canRoll = false;

        let attackIndex = 0;
        function executeNextAttack() {
            if (attackIndex >= attacksToMake) {
                // BOMB cycles immunity after attacking
                if (state.isBOMB) {
                    cycleBombImmunity(state);
                }
                startNewBossRound(state);
                return;
            }

            const alivePlayers = gameState.players.filter(p => p.hp > 0);
            if (alivePlayers.length === 0) return;

            const targetPlayer = alivePlayers[Math.floor(Math.random() * alivePlayers.length)];

            triggerDoomRollForBoss(targetPlayer, state.enemyName, () => {
                attackIndex++;
                setTimeout(executeNextAttack, 500);
            });
        }

        setTimeout(executeNextAttack, 1000);
    } else {
        log('All attacks landed! The boss staggers!', 'success');
        // BOMB still cycles immunity even when staggered
        if (state.isBOMB) {
            cycleBombImmunity(state);
        }
        startNewBossRound(state);
    }
}

// Cycle BOMB's immunity to a different approach
function cycleBombImmunity(state) {
    const approaches = ['physical', 'verbal', 'preventative'];
    const currentImmune = state.immuneApproach;

    // Get a different approach
    const otherApproaches = approaches.filter(a => a !== currentImmune);
    state.immuneApproach = otherApproaches[Math.floor(Math.random() * otherApproaches.length)];

    log(`BOMB shifts! Now IMMUNE to ${state.immuneApproach.toUpperCase()}!`, 'doom');
}

// Start new boss round
function startNewBossRound(state) {
    state.rollsThisRound = 0;
    state.roundMisses = 0;
    state.playersRolledThisRound = [];
    state.roundNumber++;
    gameState.canRoll = true;
    updateBossCombatUI();
    renderDiceTray();
    log(`--- Round ${state.roundNumber} ---`, 'info');
}

// Trigger DOOM roll for boss attack
function triggerDoomRollForBoss(player, enemyName, callback) {
    triggerTeamDoomRoll(enemyName, callback);
}

// Trigger regular DOOM roll (non-boss)
function triggerDoomRoll(player, enemyName) {
    triggerTeamDoomRoll(enemyName, () => {
        gameState.canRoll = true;
        renderDiceTray();
    });
}

// Team DOOM roll: ALL 3 players roll, if ANY roll a 1, it's fatal (unless HOPE saves)
function triggerTeamDoomRoll(enemyName, callback) {
    // Check if SHIELD can prevent this
    if (useShield()) {
        const doomRollResult = document.getElementById('rollResult');
        doomRollResult.classList.add('show');
        document.getElementById('rollOutcome').innerHTML = `SHIELD ACTIVATED!\n\nThe attack is deflected!`;
        document.getElementById('rollOutcome').className = 'doom-saved';
        setTimeout(() => {
            if (callback) callback();
        }, 1500);
        return;
    }

    gameState.canRoll = false;
    const doomRollResult = document.getElementById('rollResult');
    doomRollResult.classList.add('show');

    // All 3 players roll
    const rolls = gameState.players.map(p => ({
        player: p,
        natural: Math.floor(Math.random() * 20) + 1,
    }));
    rolls.forEach(r => r.effective = getEffectiveRoll(r.natural));

    const hasOne = rolls.some(r => r.effective === 1);
    const hasNat20 = rolls.some(r => r.natural === 20);

    let outcomeText = `TEAM DOOM ROLL vs ${enemyName}!\n\n`;
    rolls.forEach(r => {
        const avatar = CHARACTER_AVATARS[r.player.id];
        outcomeText += `${avatar.color}: ${r.natural}${r.natural !== r.effective ? ` (->${r.effective})` : ''}\n`;
    });
    outcomeText += '\n';

    let outcomeClass = '';

    if (hasOne) {
        if (gameState.hope > 0) {
            useHope();
            outcomeText += `A 1 was rolled... but HOPE saves the day!\n`;
            outcomeText += `The party narrowly escapes doom.`;
            outcomeClass = 'doom-close';
            addDoom(1, 'Narrow escape from doom');
            log(`Team survived DOOM roll by using HOPE!`, 'hope');
        } else {
            outcomeText += `THE DARKNESS CLAIMS YOU...\n`;
            outcomeText += `The prophecy has failed.`;
            outcomeClass = 'doom-death';
            document.getElementById('rollOutcome').innerHTML = outcomeText;
            document.getElementById('rollOutcome').className = outcomeClass;

            setTimeout(() => {
                document.getElementById('defeatReason').textContent = `The team succumbed to DOOM. The prophecy failed.`;
                document.getElementById('defeatScreen').classList.remove('hidden');
            }, 2000);
            return;
        }
    } else if (hasNat20) {
        addHope(1);
        outcomeText += `A natural 20! HOPE restored!`;
        outcomeClass = 'doom-saved';
        log(`Team rolled a NAT 20 on DOOM Roll! +1 HOPE!`, 'crit');
    } else {
        addDoom(1, 'Survived doom roll (injury)');
        outcomeText += `The team endures... but DOOM grows.`;
        outcomeClass = 'doom-safe';
        log(`Team survived DOOM roll, +1 DOOM`, 'warn');
    }

    document.getElementById('rollOutcome').innerHTML = outcomeText;
    document.getElementById('rollOutcome').className = outcomeClass;

    setTimeout(() => {
        gameState.canRoll = true;
        renderPlayers();
        renderDiceTray();
        if (callback) callback();
    }, 1500);
}

// Process roll result for combat
function processRollResult(playerIndex, player, die, result, doomDelta) {
    const state = gameState.encounterState;

    if (state.type === 'combat') {
        const approach = die.category;
        const threshold = state.successThresholds[approach];
        const approachDC = state.approachDCs ? state.approachDCs[approach] : gameState.targetDC;

        if (result >= approachDC || result === 20) {
            state.successCounters[approach]++;
            const current = state.successCounters[approach];

            log(`${player.name}'s ${die.name} hits DC ${approachDC}! (${current}/${threshold} ${approach})`, result === 20 ? 'crit' : 'success');

            refreshCombatProgress();

            if (current >= threshold) {
                gameState.canRoll = false;
                document.getElementById('rollOutcome').textContent += ' VICTORY!';
                addGold(state.reward);
                log(`${state.enemyName} defeated! +${state.reward} gold`, 'crit');

                if (state.isBoss) {
                    setTimeout(showBossVictory, 1500);
                } else {
                    setTimeout(completeEncounter, 1500);
                }
            }
        } else {
            log(`${result} misses DC ${approachDC}! ${state.enemyName} retaliates!`, 'fail');
            triggerDoomRoll(player, state.enemyName);
        }
    } else if (state.type === 'gamble') {
        const inRange = result >= state.rangeMin && result <= state.rangeMax;
        const betIn = state.bet === 'in';
        const won = (inRange && betIn) || (!inRange && !betIn);

        if (won) {
            const reward = inRange ? state.inRangeReward : state.outRangeReward;
            log(`YOU WIN! +${reward} to a segment of your choice!`, 'crit');
            showUpgradeModal(reward);
        } else {
            const reward = inRange ? state.inRangeReward : state.outRangeReward;
            log(`Close! You still get +${reward} to a random segment.`, 'success');
            applyRandomUpgrade(reward);
            setTimeout(completeEncounter, 1500);
        }
        gameState.canRoll = false;
    } else if (state.type === 'boss_combat') {
        state.rollsThisRound++;
        state.playersRolledThisRound.push(playerIndex);

        const approach = die.category;
        const threshold = state.successThresholds[approach];
        const approachDC = state.approachDCs ? state.approachDCs[approach] : gameState.targetDC;

        // Check if this approach is immune (BOMB only)
        if (state.immuneApproach === approach) {
            log(`${player.name}'s ${die.name} is BLOCKED! BOMB is immune to ${approach}!`, 'fail');
            state.roundMisses++;
        } else if (result >= approachDC || result === 20) {
            state.successCounters[approach]++;
            const current = state.successCounters[approach];

            log(`${player.name}'s ${die.name} hits DC ${approachDC}! (${current}/${threshold} ${approach})`, result === 20 ? 'crit' : 'success');

            if (current >= threshold) {
                gameState.canRoll = false;
                document.getElementById('rollOutcome').textContent += ' VICTORY!';
                log(`The party defeats ${state.enemyName}!`, 'crit');
                addGold(state.reward);

                setTimeout(showBossVictory, 1500);
                return;
            }
        } else {
            state.roundMisses++;
            log(`${player.name}'s ${result} misses DC ${approachDC}! (${state.roundMisses} miss this round)`, 'fail');
        }

        updateBossCombatUI();
        renderDiceTray();

        if (state.rollsThisRound >= 3) {
            processBossRoundEnd(state);
        }

        // Check if this is a tutorial boss victory
        if (state.isTutorial && state.successCounters &&
            Object.values(state.successCounters).some((v, i) => v >= Object.values(state.successThresholds)[i])) {
            setTimeout(() => {
                showPalDialogue("Excellent! You've proven yourselves worthy. The Chosen Ones are ready.");
                setTimeout(() => showTutorialEncounter('pal_farewell'), 2000);
            }, 1500);
            return;
        }
    } else if (state.type === 'tutorial_combat') {
        if (result >= state.dc || result === 20) {
            gameState.canRoll = false;
            log(`Success! The ${state.encounter.name} is overcome!`, 'success');

            setTimeout(() => {
                if (state.encounterId === 'tutorial_obstacle1') {
                    showPalDialogue("Well done! Your strength shines bright. But now...");
                    setTimeout(() => showTutorialEncounter('tutorial_obstacle2'), 2000);
                } else if (state.encounterId === 'tutorial_obstacle2') {
                    showPalDialogue("Impressive! Even your weakness couldn't hold you back!");
                    setTimeout(() => showTutorialEncounter('tutorial_intertwine'), 2000);
                }
            }, 1500);
        } else {
            if (state.forceFailure || state.tutorialPhase === 'weak_die') {
                addDoom(1, 'Tutorial failure - DOOM meter introduced');
                log(`The attempt fails! The DOOM meter rises...`, 'doom');
                showPalDialogue(PAL_DIALOGUE.doom_appears);
                gameState.canRoll = false;

                setTimeout(() => {
                    showTutorialEncounter('tutorial_intertwine');
                }, 3000);
            } else {
                log(`Not quite! Try again!`, 'info');
            }
        }
    } else if (state.type === 'ferryman') {
        let narrative = '';
        if (result >= 15) {
            narrative = 'The Ferryman grins as luck favors him. Swift passage!';
            addGold(10);
        } else if (result >= 10) {
            narrative = 'The Ferryman nods. A fair crossing.';
        } else if (result >= 5) {
            narrative = 'The Ferryman winces. The boat rocks dangerously...';
            addDoom(1, 'Rough crossing');
        } else {
            narrative = 'The Ferryman howls! He barely survives the crossing.';
            addDoom(2, 'Terrible crossing');
        }

        createRandomSwap(player, die);
        log(narrative, result >= 10 ? 'success' : 'fail');
        document.getElementById('rollOutcome').textContent = narrative;
        gameState.canRoll = false;
        setTimeout(completeEncounter, 2000);
    }

    renderDiceTray();
}

// Show boss victory and proceed to shop
function showBossVictory() {
    const stage = gameState.currentStage;

    if (stage >= 5) {
        // Game complete!
        document.getElementById('victoryScreen').classList.remove('hidden');
        document.getElementById('gameScreen').classList.add('hidden');
        deleteSave(); // Clear save on victory
    } else {
        // Show stage complete
        const nextStage = stage + 1;
        gameState.favor = STAGE_FAVOR[nextStage] || 0;

        log(`Stage ${stage} Complete!`, 'crit');

        // In multiplayer, show boss rewards with snake draft
        if (multiplayerState.enabled) {
            log('Choose your rewards!', 'success');
            setTimeout(() => {
                showBossRewards();
                // showStageShop will be called after draft completes
            }, 1500);
        } else {
            // Single player - go straight to shop
            log('Proceeding to upgrade shop...', 'info');
            setTimeout(() => {
                showStageShop();
            }, 1500);
        }
    }
}

// Complete encounter and return to map
function completeEncounter() {
    document.getElementById('encounterTitle').textContent = 'Choose your path';
    document.getElementById('encounterType').style.display = 'none';
    document.getElementById('encounterDescription').innerHTML = '<p>Select an available location on the map.</p>';
    document.getElementById('encounterOptions').innerHTML = '';
    gameState.canRoll = false;
    gameState.currentEncounter = null;
    renderDiceTray();
    autoSave();
}
