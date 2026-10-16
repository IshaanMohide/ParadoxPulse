/**
 * POLARITY // Quantum Anomalies & Unpredictable Reality Engine
 * Introduces dynamic, unexpected procedural matrix events:
 *   - Anti-Gravity Flux (Micro-Gravity Pockets)
 *   - Temporal Time Dilation (Matrix Bullet-Time)
 *   - Quantum Ion Crosswinds (Lateral Kinetic Forces)
 *   - Platform Phase Instability (Unpredictable Flickering Bridges)
 *   - Roaming Glitch Orbs (Autonomous 3D Hazards)
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
        this.timeScale = 1.0;
        this.windForce = 0.0;
        this.isPhaseFlickering = false;

        // 3D Glitch Orbs in the scene
        this.glitchOrbs = [];
        this.orbsGroup = new THREE.Group();
        if (this.game && this.game.world && this.game.world.scene) {
            this.game.world.scene.add(this.orbsGroup);
        }
    }

    getRandomInterval() {
        const mode = (window.GameSettings && window.GameSettings.current) ? window.GameSettings.current.unpredictability : 'NORMAL';
        if (mode === 'CHILL') return 35 + Math.random() * 20; // 35-55s
        if (mode === 'CHAOS') return 9 + Math.random() * 8;   // 9-17s (High unpredictability!)
        return 18 + Math.random() * 14;                      // 18-32s (Normal)
    }

    triggerRandomAnomaly() {
        const events = [
            'ANTI_GRAVITY',
            'TIME_DILATION',
            'ION_WIND',
            'PHASE_FLICKER',
            'GLITCH_SURGE'
        ];
        const chosen = events[Math.floor(Math.random() * events.length)];
        this.startAnomaly(chosen);
    }

    startAnomaly(type) {
        this.activeEvent = type;
        const now = performance.now();

        switch (type) {
            case 'ANTI_GRAVITY':
                this.eventDuration = 6.0;
                this.eventTimer = 6.0;
                this.gravityMultiplier = 0.28; // Floaty microgravity!
                this.showHUDAlert('🌌', 'GRAVITATIONAL FLUX: MICROGRAVITY ACTIVE');
                if (this.game.audio) this.game.audio.playShift('CYAN');
                this.flashScreen('rgba(0, 240, 255, 0.25)');
                break;

            case 'TIME_DILATION':
                this.eventDuration = 4.5;
                this.eventTimer = 4.5;
                this.timeScale = 0.45; // Slow-mo matrix time
                this.showHUDAlert('⏱️', 'TEMPORAL FLUX: BULLET-TIME MATRIX');
                if (this.game.audio) this.game.audio.playShift('MAGENTA');
                this.flashScreen('rgba(255, 0, 127, 0.25)');
                break;

            case 'ION_WIND':
                this.eventDuration = 5.5;
                this.eventTimer = 5.5;
                const dir = Math.random() > 0.5 ? 1 : -1;
                this.windForce = dir * 6.5; // Pushes player laterally
                this.showHUDAlert('💨', `ION STORM: ${dir > 0 ? 'EASTWARD' : 'WESTWARD'} CROSSWIND`);
                this.flashScreen('rgba(255, 255, 255, 0.2)');
                break;

            case 'PHASE_FLICKER':
                this.eventDuration = 6.5;
                this.eventTimer = 6.5;
                this.isPhaseFlickering = true;
                this.showHUDAlert('⚡', 'REALITY UNSTABLE: PLATFORMS FLICKERING');
                if (this.game.audio) this.game.audio.playDeath();
                this.flashScreen('rgba(255, 170, 0, 0.25)');
                break;

            case 'GLITCH_SURGE':
                this.eventDuration = 5.0;
                this.eventTimer = 5.0;
                this.spawnGlitchOrb();
                this.showHUDAlert('👾', 'QUANTUM ANOMALY: ROAMING SENTINEL SPAWNED');
                this.flashScreen('rgba(168, 85, 247, 0.3)');
                break;
        }
    }

    stopAnomaly() {
        this.activeEvent = null;
        this.gravityMultiplier = 1.0;
        this.timeScale = 1.0;
        this.windForce = 0.0;
        this.isPhaseFlickering = false;
        this.showHUDAlert('✅', 'MATRIX STABILIZED');
        this.nextEventCountdown = this.getRandomInterval();
    }

    spawnGlitchOrb() {
        if (!this.game.world) return;
        const p = this.game.player;
        const spawnX = p.x + (Math.random() > 0.5 ? 6 : -6);
        const spawnY = p.y + 3.0;

        const orbGeo = new THREE.DodecahedronGeometry(0.45, 1);
        const orbMat = new THREE.MeshStandardMaterial({
            color: 0xa855f7,
            emissive: 0xa855f7,
            emissiveIntensity: 1.2,
            wireframe: true
        });
        const mesh = new THREE.Mesh(orbGeo, orbMat);
        mesh.position.set(spawnX, spawnY, 0);

        const light = new THREE.PointLight(0xa855f7, 2.0, 5.0);
        mesh.add(light);

        this.orbsGroup.add(mesh);
        this.glitchOrbs.push({
            mesh: mesh,
            x: spawnX,
            y: spawnY,
            vx: (Math.random() - 0.5) * 4.0,
            vy: (Math.random() - 0.5) * 2.0,
            life: 8.0
        });
    }

    update(dt) {
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
                if (Math.random() < 0.08) {
                    const randomPhase = Math.random() > 0.5 ? 'CYAN' : 'MAGENTA';
                    this.game.world.platformObjects.forEach(plat => {
                        if (plat.type !== 'NEUTRAL' && Math.random() < 0.3) {
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
            orb.mesh.rotation.x += dt * 3.0;
            orb.mesh.rotation.y += dt * 4.0;

            // Check collision with player
            if (this.game.player) {
                const dist = Math.hypot(this.game.player.x - orb.x, this.game.player.y - orb.y);
                if (dist < 1.1) {
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
