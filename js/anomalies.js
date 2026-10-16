/**
 * POLARITY // Quantum Anomalies & Unpredictable Reality Engine
 * Introduces dynamic, unexpected procedural matrix events:
 *   - Anti-Gravity Flux (Micro-Gravity Pockets)
 *   - Heavy Gravitational Surge (High-G downward force)
 *   - Temporal Time Dilation (Matrix Bullet-Time)
 *   - Warp Velocity Surge (Hyper-speed runner sprint)
 *   - Quantum Ion Crosswinds (Lateral kinetic forces)
 *   - Mirrored Perception Warp (Inverted steering glitch with Dutch camera angle)
 *   - Platform Phase Instability (Unpredictable flickering bridges)
 *   - Roaming Glitch Sentinels (Autonomous 3D hazards)
 *   - Twin Sentinel Swarm (Dual flank patrolling hazard spheres)
 */
class AnomaliesSystem {
    constructor(gameEngine) {
        this.game = gameEngine;
        this.activeEvent = null;
        this.eventTimer = 0;
        this.eventDuration = 0;
        this.nextEventCountdown = this.getRandomInterval();

        // Anomaly modifiers
        this.gravityMultiplier = 1.0;
        this.speedMultiplier = 1.0;
        this.timeScale = 1.0;
        this.windForce = 0.0;
        this.steerInvert = false;
        this.cameraRoll = 0.0;
        this.cameraRollTarget = 0.0;
        this.isPhaseFlickering = false;

        // 3D Glitch Orbs in the scene
        this.glitchOrbs = [];
        this.orbsGroup = new THREE.Group();
        if (this.game && this.game.world && this.game.world.scene) {
            this.game.world.scene.add(this.orbsGroup);
        }
    }

    getRandomInterval() {
        const mode = (window.GameSettings && window.GameSettings.current) ? window.GameSettings.current.unpredictability : 'CHAOS';
        if (mode === 'CHILL') return 25 + Math.random() * 15; // 25-40s
        if (mode === 'CHAOS') return 7 + Math.random() * 7;    // 7-14s (Hyper-unpredictable matrix!)
        return 12 + Math.random() * 10;                       // 12-22s (Normal)
    }

    triggerRandomAnomaly() {
        const events = [
            'ANTI_GRAVITY',
            'GRAVITY_SURGE',
            'TIME_DILATION',
            'WARP_SURGE',
            'ION_WIND',
            'PERCEPTION_WARP',
            'PHASE_FLICKER',
            'GLITCH_SURGE',
            'TWIN_SENTINEL'
        ];
        // Pick an event different from current
        const available = events.filter(e => e !== this.activeEvent);
        const chosen = available[Math.floor(Math.random() * available.length)];
        this.startAnomaly(chosen);
    }

    startAnomaly(type) {
        this.activeEvent = type;

        switch (type) {
            case 'ANTI_GRAVITY':
                this.eventDuration = 5.5;
                this.eventTimer = 5.5;
                this.gravityMultiplier = 0.24; // Floaty microgravity
                this.speedMultiplier = 1.0;
                this.windForce = 0.0;
                this.steerInvert = false;
                this.cameraRollTarget = -0.04;
                this.showHUDAlert('🌌', 'GRAVITATIONAL FLUX: MICROGRAVITY DETECTED');
                if (this.game.audio) this.game.audio.playShift('CYAN');
                this.flashScreen('rgba(0, 240, 255, 0.25)');
                break;

            case 'GRAVITY_SURGE':
                this.eventDuration = 4.8;
                this.eventTimer = 4.8;
                this.gravityMultiplier = 1.75; // Heavy gravity pull!
                this.speedMultiplier = 0.9;
                this.windForce = 0.0;
                this.steerInvert = false;
                this.cameraRollTarget = 0.04;
                this.showHUDAlert('⚓', 'GRAVITY SURGE: HIGH-G SINK ACTIVE');
                if (this.game.audio) this.game.audio.playDeath();
                this.flashScreen('rgba(255, 60, 60, 0.25)');
                break;

            case 'TIME_DILATION':
                this.eventDuration = 4.5;
                this.eventTimer = 4.5;
                this.timeScale = 0.42; // Slow-mo matrix bullet time
                this.gravityMultiplier = 1.0;
                this.speedMultiplier = 1.0;
                this.windForce = 0.0;
                this.steerInvert = false;
                this.cameraRollTarget = 0.0;
                this.showHUDAlert('⏱️', 'TEMPORAL FLUX: BULLET-TIME MATRIX');
                if (this.game.audio) this.game.audio.playShift('MAGENTA');
                this.flashScreen('rgba(255, 0, 127, 0.25)');
                break;

            case 'WARP_SURGE':
                this.eventDuration = 4.2;
                this.eventTimer = 4.2;
                this.speedMultiplier = 1.55; // Hyper velocity runner burst!
                this.gravityMultiplier = 0.95;
                this.windForce = 0.0;
                this.steerInvert = false;
                this.cameraRollTarget = 0.02;
                this.showHUDAlert('⚡', 'WARP SURGE: VELOCITY DISRUPTION (155%)');
                if (this.game.audio) this.game.audio.playJump();
                this.flashScreen('rgba(255, 230, 0, 0.25)');
                break;

            case 'ION_WIND':
                this.eventDuration = 5.2;
                this.eventTimer = 5.2;
                const dir = Math.random() > 0.5 ? 1 : -1;
                this.windForce = dir * 7.2; // Powerful lateral gale
                this.gravityMultiplier = 1.0;
                this.speedMultiplier = 1.0;
                this.steerInvert = false;
                this.cameraRollTarget = dir * 0.06;
                this.showHUDAlert('💨', `ION STORM: ${dir > 0 ? 'EASTWARD' : 'WESTWARD'} CROSSWIND`);
                this.flashScreen('rgba(200, 240, 255, 0.2)');
                break;

            case 'PERCEPTION_WARP':
                this.eventDuration = 4.5;
                this.eventTimer = 4.5;
                this.steerInvert = true; // Inverted perception!
                this.gravityMultiplier = 1.0;
                this.speedMultiplier = 1.0;
                this.windForce = 0.0;
                this.cameraRollTarget = 0.09; // Tilted Dutch angle
                this.showHUDAlert('🪞', 'PERCEPTION WARP: VECTOR INVERSION FLIP');
                if (this.game.audio) this.game.audio.playDeath();
                this.flashScreen('rgba(168, 85, 247, 0.35)');
                break;

            case 'PHASE_FLICKER':
                this.eventDuration = 6.0;
                this.eventTimer = 6.0;
                this.isPhaseFlickering = true;
                this.gravityMultiplier = 1.0;
                this.speedMultiplier = 1.0;
                this.windForce = 0.0;
                this.steerInvert = false;
                this.cameraRollTarget = 0.0;
                this.showHUDAlert('⚡', 'REALITY UNSTABLE: PLATFORMS PHASE-SHIFTING');
                if (this.game.audio) this.game.audio.playDeath();
                this.flashScreen('rgba(255, 170, 0, 0.25)');
                break;

            case 'GLITCH_SURGE':
                this.eventDuration = 5.0;
                this.eventTimer = 5.0;
                this.gravityMultiplier = 1.0;
                this.speedMultiplier = 1.0;
                this.windForce = 0.0;
                this.steerInvert = false;
                this.cameraRollTarget = -0.03;
                this.spawnGlitchOrb();
                this.showHUDAlert('👾', 'QUANTUM ANOMALY: ROAMING SENTINEL SPAWNED');
                this.flashScreen('rgba(168, 85, 247, 0.3)');
                break;

            case 'TWIN_SENTINEL':
                this.eventDuration = 5.5;
                this.eventTimer = 5.5;
                this.gravityMultiplier = 1.0;
                this.speedMultiplier = 1.0;
                this.windForce = 0.0;
                this.steerInvert = false;
                this.cameraRollTarget = 0.04;
                this.spawnGlitchOrb(6.0, 3.0, -3.2, 0.5);
                this.spawnGlitchOrb(-6.0, 3.5, 3.2, -0.5);
                this.showHUDAlert('⚠️', 'HAZARD SWARM: DUAL SENTINELS INCOMING');
                if (this.game.audio) this.game.audio.playDeath();
                this.flashScreen('rgba(255, 0, 80, 0.3)');
                break;
        }
    }

    stopAnomaly() {
        this.activeEvent = null;
        this.gravityMultiplier = 1.0;
        this.speedMultiplier = 1.0;
        this.timeScale = 1.0;
        this.windForce = 0.0;
        this.steerInvert = false;
        this.cameraRollTarget = 0.0;
        this.isPhaseFlickering = false;
        this.showHUDAlert('✅', 'MATRIX STABILIZED');
        this.nextEventCountdown = this.getRandomInterval();
    }

    spawnGlitchOrb(offsetX, offsetY, customVx, customVy) {
        if (!this.game || !this.game.world || !this.game.player) return;
        const p = this.game.player;
        const spawnX = p.x + (offsetX !== undefined ? offsetX : (Math.random() > 0.5 ? 7 : -7));
        const spawnY = p.y + (offsetY !== undefined ? offsetY : 3.0);

        const orbGeo = new THREE.DodecahedronGeometry(0.48, 1);
        const orbMat = new THREE.MeshStandardMaterial({
            color: 0xa855f7,
            emissive: 0xa855f7,
            emissiveIntensity: 1.4,
            wireframe: true
        });
        const mesh = new THREE.Mesh(orbGeo, orbMat);
        mesh.position.set(spawnX, spawnY, 0);

        const light = new THREE.PointLight(0xa855f7, 2.2, 5.5);
        mesh.add(light);

        this.orbsGroup.add(mesh);
        this.glitchOrbs.push({
            mesh: mesh,
            x: spawnX,
            y: spawnY,
            vx: customVx !== undefined ? customVx : ((Math.random() - 0.5) * 4.5),
            vy: customVy !== undefined ? customVy : ((Math.random() - 0.5) * 2.2),
            life: 8.0
        });
    }

    update(dt) {
        // Smooth camera roll interpolation
        this.cameraRoll += (this.cameraRollTarget - this.cameraRoll) * Math.min(1.0, dt * 5.0);

        // Countdown to next unpredictable event
        if (!this.activeEvent) {
            this.nextEventCountdown -= dt;
            if (this.nextEventCountdown <= 0) {
                this.triggerRandomAnomaly();
            }
        } else {
            // Count down active event
            this.eventTimer -= dt;
            if (this.eventTimer <= 0) {
                this.stopAnomaly();
            }

            // Phase flicker logic
            if (this.isPhaseFlickering && this.game.world) {
                if (Math.random() < 0.10) {
                    const randomPhase = Math.random() > 0.5 ? 'CYAN' : 'MAGENTA';
                    this.game.world.platformObjects.forEach(plat => {
                        if (plat.type !== 'NEUTRAL' && Math.random() < 0.35) {
                            plat.updatePolarity(randomPhase);
                        }
                    });
                }
            }
        }

        // Update roaming glitch orbs
        for (let i = this.glitchOrbs.length - 1; i >= 0; i--) {
            const orb = this.glitchOrbs[i];
            orb.life -= dt;
            orb.x += orb.vx * dt;
            orb.y += orb.vy * dt;
            orb.mesh.position.set(orb.x, orb.y, 0);
            orb.mesh.rotation.x += dt * 3.5;
            orb.mesh.rotation.y += dt * 4.5;

            // Check collision with player
            if (this.game.player) {
                const dist = Math.hypot(this.game.player.x - orb.x, this.game.player.y - orb.y);
                if (dist < 1.15) {
                    this.game.respawnPlayer(true);
                }
            }

            if (orb.life <= 0) {
                this.orbsGroup.remove(orb.mesh);
                this.glitchOrbs.splice(i, 1);
            }
        }
    }

    showHUDAlert(icon, text) {
        const banner = document.getElementById('gesture-alert-banner');
        const iSpan = document.getElementById('gesture-alert-icon');
        const tSpan = document.getElementById('gesture-alert-text');
        if (!banner) return;

        iSpan.textContent = icon;
        tSpan.textContent = text;
        banner.classList.add('show');

        if (this.alertTimer) clearTimeout(this.alertTimer);
        this.alertTimer = setTimeout(() => {
            banner.classList.remove('show');
        }, 2200);
    }

    flashScreen(color) {
        const flash = document.getElementById('realityFlash');
        if (!flash) return;
        flash.style.background = color;
        flash.style.opacity = '1';
        setTimeout(() => { flash.style.opacity = '0'; }, 160);
    }

    clear() {
        this.stopAnomaly();
        while (this.orbsGroup.children.length > 0) {
            this.orbsGroup.remove(this.orbsGroup.children[0]);
        }
        this.glitchOrbs = [];
    }
}

window.AnomaliesSystem = AnomaliesSystem;
