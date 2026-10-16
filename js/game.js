/**
 * POLARITY // Core Game Engine & 3D Level Orchestrator (Updated with Anomalies & Settings)
 * Integrates:
 *   - Three.js 3D World (World3D)
 *   - Articulated 3D Player with Realism (Player3D)
 *   - Google MediaPipe Pose AI with Live Sensitivity (SmoothPoseTracker)
 *   - Procedural Web Audio API (CyberAudio)
 *   - Quantum Anomalies System (AnomaliesSystem)
 *   - Game Settings Manager (GameSettings)
 */

const POLARITY = {
    CYAN: 'CYAN',
    MAGENTA: 'MAGENTA'
};

// 5 Handcrafted 3D Sectors
const LEVELS_3D = [
    {
        name: "01 // QUANTUM AWAKENING",
        description: "Master inverted camera navigation & phase matching 3D light bridges.",
        spawn: { x: 2.0, y: 3.5 },
        exit: { x: 32.0, y: 7.5 },
        bounds: { width: 36.0, height: 16.0 },
        platforms: [
            { x: 3.0, y: 1.0, w: 7.0, h: 1.0, type: 'NEUTRAL' },
            { x: 9.0, y: 2.8, w: 4.5, h: 0.7, type: 'CYAN' },
            { x: 14.5, y: 4.2, w: 4.0, h: 0.8, type: 'NEUTRAL' },
            { x: 19.5, y: 5.5, w: 4.5, h: 0.7, type: 'MAGENTA' },
            { x: 25.0, y: 6.8, w: 4.0, h: 0.7, type: 'CYAN' },
            { x: 31.0, y: 6.5, w: 6.0, h: 1.0, type: 'NEUTRAL' }
        ],
        hazards: [
            { x: 15.0, y: -2.0, w: 35.0, h: 1.5, type: 'NEUTRAL' }
        ],
        shards: [
            { x: 9.0, y: 4.0 },
            { x: 19.5, y: 6.8 },
            { x: 25.0, y: 8.0 }
        ],
        pads: [
            { x: 14.5, y: 4.8, power: 15.5 }
        ]
    },
    {
        name: "02 // BINARY CHASM",
        description: "Shift reality mid-air to navigate moving 3D platforms & laser barriers.",
        spawn: { x: 2.0, y: 4.0 },
        exit: { x: 38.0, y: 6.5 },
        bounds: { width: 42.0, height: 18.0 },
        platforms: [
            { x: 3.0, y: 1.5, w: 5.0, h: 1.0, type: 'NEUTRAL' },
            { x: 8.0, y: 3.0, w: 3.5, h: 0.6, type: 'CYAN' },
            { x: 12.5, y: 4.5, w: 3.5, h: 0.6, type: 'MAGENTA' },
            { x: 17.0, y: 3.5, w: 4.0, h: 0.8, type: 'NEUTRAL' },
            { x: 22.0, y: 5.0, w: 3.2, h: 0.6, type: 'CYAN', moveX: 2.5, speed: 1.2 },
            { x: 27.5, y: 5.5, w: 3.2, h: 0.6, type: 'MAGENTA' },
            { x: 32.5, y: 4.8, w: 3.5, h: 0.6, type: 'CYAN' },
            { x: 37.0, y: 5.5, w: 5.5, h: 1.0, type: 'NEUTRAL' }
        ],
        hazards: [
            { x: 20.0, y: -2.0, w: 40.0, h: 1.5, type: 'NEUTRAL' },
            { x: 17.0, y: 4.2, w: 0.4, h: 5.0, type: 'CYAN_LASER' }
        ],
        shards: [
            { x: 12.5, y: 5.8 },
            { x: 22.0, y: 6.5 },
            { x: 32.5, y: 6.0 }
        ],
        pads: []
    },
    {
        name: "03 // VERTICAL MATRIX",
        description: "Scale quantum heights using 3D jump booster pads and laser columns.",
        spawn: { x: 2.0, y: 2.5 },
        exit: { x: 2.0, y: 15.0 },
        bounds: { width: 25.0, height: 22.0 },
        platforms: [
            { x: 3.0, y: 1.0, w: 6.0, h: 1.0, type: 'NEUTRAL' },
            { x: 8.0, y: 4.0, w: 3.5, h: 0.6, type: 'CYAN' },
            { x: 13.0, y: 6.5, w: 3.5, h: 0.6, type: 'MAGENTA' },
            { x: 18.0, y: 9.0, w: 4.0, h: 0.8, type: 'NEUTRAL' },
            { x: 13.0, y: 11.5, w: 3.5, h: 0.6, type: 'CYAN', moveX: 2.0, speed: 1.5 },
            { x: 8.0, y: 13.5, w: 3.5, h: 0.6, type: 'MAGENTA' },
            { x: 3.0, y: 14.0, w: 5.0, h: 1.0, type: 'NEUTRAL' }
        ],
        hazards: [
            { x: 10.0, y: -2.0, w: 25.0, h: 1.5, type: 'NEUTRAL' }
        ],
        shards: [
            { x: 8.0, y: 5.2 },
            { x: 18.0, y: 10.5 },
            { x: 8.0, y: 14.8 }
        ],
        pads: [
            { x: 3.0, y: 1.6, power: 17.0 }
        ]
    },
    {
        name: "04 // LASER GRID PURGE",
        description: "Harmonize polarity to pass harmlessly through matching 3D laser beams.",
        spawn: { x: 2.0, y: 3.0 },
        exit: { x: 38.0, y: 6.0 },
        bounds: { width: 42.0, height: 18.0 },
        platforms: [
            { x: 3.0, y: 1.0, w: 5.0, h: 1.0, type: 'NEUTRAL' },
            { x: 9.0, y: 2.5, w: 3.5, h: 0.6, type: 'CYAN' },
            { x: 14.0, y: 3.8, w: 3.5, h: 0.6, type: 'MAGENTA' },
            { x: 19.0, y: 3.0, w: 4.0, h: 0.8, type: 'NEUTRAL' },
            { x: 24.5, y: 4.5, w: 3.2, h: 0.6, type: 'CYAN', moveY: 1.8, speed: 1.4 },
            { x: 29.5, y: 4.5, w: 3.2, h: 0.6, type: 'MAGENTA', moveY: 1.8, speed: 1.4 },
            { x: 34.0, y: 4.8, w: 3.5, h: 0.6, type: 'CYAN' },
            { x: 38.0, y: 5.0, w: 5.0, h: 1.0, type: 'NEUTRAL' }
        ],
        hazards: [
            { x: 20.0, y: -2.0, w: 40.0, h: 1.5, type: 'NEUTRAL' },
            { x: 11.5, y: 1.0, w: 0.4, h: 7.0, type: 'CYAN_LASER' },
            { x: 16.5, y: 1.0, w: 0.4, h: 7.0, type: 'MAGENTA_LASER' },
            { x: 27.0, y: 1.0, w: 0.4, h: 7.0, type: 'CYAN_LASER' }
        ],
        shards: [
            { x: 11.5, y: 4.5 },
            { x: 16.5, y: 5.0 },
            { x: 34.0, y: 6.0 }
        ],
        pads: []
    },
    {
        name: "05 // SINGULARITY APEX",
        description: "The grand convergence of 3D spatial gestures, moving decks, and quantum rifts.",
        spawn: { x: 2.0, y: 3.5 },
        exit: { x: 42.0, y: 8.5 },
        bounds: { width: 46.0, height: 20.0 },
        platforms: [
            { x: 3.0, y: 1.0, w: 5.0, h: 1.0, type: 'NEUTRAL' },
            { x: 8.0, y: 2.8, w: 3.2, h: 0.6, type: 'CYAN' },
            { x: 12.5, y: 4.2, w: 3.2, h: 0.6, type: 'MAGENTA' },
            { x: 17.0, y: 3.5, w: 4.0, h: 0.8, type: 'NEUTRAL' },
            { x: 22.0, y: 5.0, w: 3.2, h: 0.6, type: 'CYAN', moveX: 2.5, speed: 1.6 },
            { x: 27.0, y: 5.5, w: 3.2, h: 0.6, type: 'MAGENTA', moveX: 2.5, speed: 1.6 },
            { x: 32.0, y: 6.2, w: 3.5, h: 0.6, type: 'NEUTRAL' },
            { x: 36.5, y: 7.2, w: 3.2, h: 0.6, type: 'CYAN' },
            { x: 41.0, y: 7.5, w: 5.5, h: 1.0, type: 'NEUTRAL' }
        ],
        hazards: [
            { x: 22.0, y: -2.0, w: 45.0, h: 1.5, type: 'NEUTRAL' },
            { x: 14.8, y: 1.0, w: 0.4, h: 8.0, type: 'CYAN_LASER' },
            { x: 19.5, y: 1.0, w: 0.4, h: 8.0, type: 'MAGENTA_LASER' },
            { x: 34.2, y: 2.0, w: 0.4, h: 8.0, type: 'CYAN_LASER' }
        ],
        shards: [
            { x: 12.5, y: 5.5 },
            { x: 27.0, y: 7.0 },
            { x: 36.5, y: 8.5 }
        ],
        pads: [
            { x: 17.0, y: 4.1, power: 16.5 }
        ]
    }
];

class GameEngine {
    constructor() {
        this.canvas = document.getElementById('webgl-canvas');
        this.audio = new CyberAudio();
        this.world = new World3D(this.canvas);
        this.player = new Player3D(this.world.scene);
        this.tracker = new SmoothPoseTracker(this);
        this.anomalies = new AnomaliesSystem(this);

        this.state = 'START';
        this.currentLevelIdx = 0;
        this.polarity = POLARITY.CYAN;
        this.levelStartTime = 0;
        this.elapsedTime = 0;
        this.deaths = 0;
        this.totalDeaths = 0;
        this.totalTime = 0;
        this.collectedShards = 0;

        // Inverted Keyboard
        this.keys = {
            left: false,
            right: false,
            jump: false
        };

        this.lastTime = performance.now();
        this.setupKeyboard();
        this.setupUI();
        this.loadLevel(0);

        requestAnimationFrame(this.loop.bind(this));
    }

    setupKeyboard() {
        window.addEventListener('keydown', (e) => {
            if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
                e.preventDefault();
            }

            if (this.state === 'START') {
                if (e.code === 'Space' || e.code === 'Enter') this.startGame(true);
                return;
            }

            if (e.code === 'Escape' || e.code === 'KeyP') {
                this.togglePause();
                return;
            }

            if (e.code === 'KeyR') {
                this.respawnPlayer(true);
                return;
            }

            // Inverted Keyboard Mappings:
            // A or Left -> Move RIGHT
            // D or Right -> Move LEFT
            if (e.code === 'KeyA' || e.code === 'ArrowLeft') this.keys.right = true;
            if (e.code === 'KeyD' || e.code === 'ArrowRight') this.keys.left = true;
            if (e.code === 'KeyW' || e.code === 'ArrowUp' || e.code === 'Space') {
                this.triggerJump(1.0);
            }
            if (e.code === 'ShiftLeft' || e.code === 'ShiftRight' || e.code === 'KeyE') {
                this.triggerPolarityShift();
            }
            if (e.code === 'KeyC' || e.code === 'KeyJ') {
                this.triggerDash();
            }
        });

        window.addEventListener('keyup', (e) => {
            if (e.code === 'KeyA' || e.code === 'ArrowLeft') this.keys.right = false;
            if (e.code === 'KeyD' || e.code === 'ArrowRight') this.keys.left = false;
        });
    }

    setupUI() {
        document.getElementById('btn-start-game').addEventListener('click', () => {
            this.startGame(true);
        });
        document.getElementById('btn-start-nocam').addEventListener('click', () => {
            this.startGame(false);
        });
        document.getElementById('btn-audio').addEventListener('click', () => {
            const isMuted = this.audio.toggleMute();
            document.getElementById('audio-icon').textContent = isMuted ? '🔇' : '🔊';
        });
        document.getElementById('btn-pause').addEventListener('click', () => {
            this.togglePause();
        });
        document.getElementById('btn-resume').addEventListener('click', () => {
            this.togglePause();
        });
        document.getElementById('btn-restart-level').addEventListener('click', () => {
            this.togglePause();
            this.respawnPlayer(true);
        });
        document.getElementById('btn-next-level').addEventListener('click', () => {
            this.nextLevel();
        });
        document.getElementById('btn-retry-victory').addEventListener('click', () => {
            this.loadLevel(this.currentLevelIdx);
            this.hideModals();
            this.state = 'PLAYING';
        });
        document.getElementById('btn-play-again').addEventListener('click', () => {
            this.currentLevelIdx = 0;
            this.totalDeaths = 0;
            this.totalTime = 0;
            this.loadLevel(0);
            this.hideModals();
            this.state = 'PLAYING';
        });

        // Settings Modal Open / Close
        const btnSettings = document.getElementById('btn-settings');
        const modalSettings = document.getElementById('modal-settings');
        const btnCloseSettings = document.getElementById('btn-close-settings');
        if (btnSettings && modalSettings) {
            btnSettings.addEventListener('click', () => {
                modalSettings.classList.toggle('hidden');
            });
        }
        if (btnCloseSettings && modalSettings) {
            btnCloseSettings.addEventListener('click', () => {
                modalSettings.classList.add('hidden');
            });
        }

        // Unpredictability Mode Selector (Chill / Normal / Chaos)
        const btnChill = document.getElementById('mode-chill');
        const btnNormal = document.getElementById('mode-normal');
        const btnChaos = document.getElementById('mode-chaos');
        const updateModeBtns = (mode) => {
            [btnChill, btnNormal, btnChaos].forEach(b => { if (b) b.classList.remove('active'); });
            if (mode === 'CHILL' && btnChill) btnChill.classList.add('active');
            if (mode === 'NORMAL' && btnNormal) btnNormal.classList.add('active');
            if (mode === 'CHAOS' && btnChaos) btnChaos.classList.add('active');
        };

        if (btnChill) btnChill.addEventListener('click', () => {
            window.GameSettings.setUnpredictability('CHILL');
            updateModeBtns('CHILL');
        });
        if (btnNormal) btnNormal.addEventListener('click', () => {
            window.GameSettings.setUnpredictability('NORMAL');
            updateModeBtns('NORMAL');
        });
        if (btnChaos) btnChaos.addEventListener('click', () => {
            window.GameSettings.setUnpredictability('CHAOS');
            updateModeBtns('CHAOS');
        });

        if (window.GameSettings && window.GameSettings.current) {
            updateModeBtns(window.GameSettings.current.unpredictability);
        }
    }

    startGame(withCamera = true) {
        this.audio.init();
        this.hideModals();
        this.state = 'PLAYING';
        this.levelStartTime = performance.now();
        if (withCamera) {
            this.tracker.startCamera();
        }
    }

    togglePause() {
        if (this.state === 'PLAYING') {
            this.state = 'PAUSED';
            document.getElementById('modal-pause').classList.remove('hidden');
        } else if (this.state === 'PAUSED') {
            this.state = 'PLAYING';
            document.getElementById('modal-pause').classList.add('hidden');
        }
    }

    hideModals() {
        document.querySelectorAll('.modal-screen').forEach(m => m.classList.add('hidden'));
    }

    loadLevel(idx) {
        this.currentLevelIdx = idx;
        const lvl = LEVELS_3D[idx];

        this.world.buildLevel(lvl, this.polarity);
        this.collectedShards = 0;
        this.levelStartTime = performance.now();
        this.anomalies.clear();

        this.respawnPlayer(false);
        this.updateHUD();
    }

    respawnPlayer(countDeath = true) {
        const lvl = LEVELS_3D[this.currentLevelIdx];
        this.player.x = lvl.spawn.x;
        this.player.y = lvl.spawn.y;
        this.player.vx = 0;
        this.player.vy = 0;
        this.player.squashX = 1;
        this.player.squashY = 1;

        if (countDeath) {
            this.deaths++;
            this.totalDeaths++;
            this.audio.playDeath();
        }
    }

    triggerJump(powerMultiplier = 1.0) {
        this.audio.init();
        if (this.state !== 'PLAYING') return;

        const jumped = this.player.jump(powerMultiplier);
        if (jumped) {
            this.audio.playJump();
        }
    }

    triggerPolarityShift() {
        this.polarity = (this.polarity === POLARITY.CYAN) ? POLARITY.MAGENTA : POLARITY.CYAN;
        this.audio.playShift(this.polarity);

        this.player.setTheme(this.polarity);
        this.world.setTheme(this.polarity);
        this.applyPolarityTheme();

        const flash = document.getElementById('realityFlash');
        flash.style.background = (this.polarity === POLARITY.CYAN) ? 'rgba(0, 240, 255, 0.22)' : 'rgba(255, 0, 127, 0.22)';
        flash.style.opacity = '1';
        setTimeout(() => { flash.style.opacity = '0'; }, 100);

        this.updateHUD();
    }

    triggerDash() {
        this.player.vx = this.player.facing * 16.5;
        this.player.vy = 0;
        this.player.squashX = 1.45;
        this.player.squashY = 0.7;
        this.audio.playJump();
    }

    applyPolarityTheme() {
        const isCyan = (this.polarity === POLARITY.CYAN);
        document.body.className = isCyan ? 'polarity-cyan' : 'polarity-magenta';

        const badge = document.getElementById('hud-polarity-badge');
        const badgeText = document.getElementById('polarity-text');
        if (badge) {
            badge.className = isCyan ? 'badge-cyan' : 'badge-magenta';
            badgeText.textContent = isCyan ? 'CYAN REALITY' : 'MAGENTA REALITY';
        }
    }

    update(dt) {
        if (this.state !== 'PLAYING') return;

        // Apply Time Dilation from Anomaly System
        const scaledDt = dt * this.anomalies.timeScale;
        this.elapsedTime = performance.now() - this.levelStartTime;
        const lvl = LEVELS_3D[this.currentLevelIdx];

        // Combine Keyboard & Smoothed Pose Steering
        let steer = this.tracker.getSteering();
        if (this.keys.left) steer = -1.0;
        if (this.keys.right) steer = 1.0;

        // Pass nearby shards to player for autonomous 3D head tracking
        const nearbyShards = this.world.shardObjects.map(s => ({ x: s.x, y: s.y, collected: s.collected }));

        // Update 3D Player Physics with Anomalies & Head Tracking
        this.player.update(scaledDt, steer, this.world.platformObjects, this.polarity, this.anomalies, nearbyShards);

        // Update Anomalies System
        this.anomalies.update(scaledDt);

        // Check Jump Booster Pads
        this.world.padObjects.forEach(pad => {
            const dx = Math.abs(this.player.x - pad.x);
            const dy = (this.player.y - pad.y);
            if (dx < 0.9 && dy > -0.2 && dy < 0.8 && this.player.vy <= 0) {
                this.player.vy = pad.power;
                this.player.grounded = false;
                this.player.squashX = 0.65;
                this.player.squashY = 1.45;
                this.audio.playJump();
                this.player.spawnDust(pad.x, pad.y, 8, 0xffaa00);
            }
        });

        // Check Quantum Shards Collection
        this.world.shardObjects.forEach(s => {
            if (s.collected) return;
            const dist = Math.hypot(this.player.x - s.x, this.player.y - s.y);
            if (dist < 1.25) {
                s.collected = true;
                this.collectedShards++;
                this.audio.playShard();
                this.player.spawnDust(s.x, s.y, 14, 0x00f0ff);
                this.updateHUD();
            }
        });

        // Check Hazards Collision
        lvl.hazards.forEach(h => {
            let isDeadly = true;
            if (h.type === 'CYAN_LASER' && this.polarity === POLARITY.CYAN) isDeadly = false;
            if (h.type === 'MAGENTA_LASER' && this.polarity === POLARITY.MAGENTA) isDeadly = false;

            if (isDeadly) {
                if (h.type === 'NEUTRAL') {
                    if (this.player.y < h.y + h.h) {
                        this.respawnPlayer(true);
                    }
                } else {
                    const dx = Math.abs(this.player.x - h.x);
                    const dy = this.player.y - h.y;
                    if (dx < 0.6 && dy > 0 && dy < h.h) {
                        this.respawnPlayer(true);
                    }
                }
            }
        });

        // Out of Bounds
        if (this.player.y < -5.0) {
            this.respawnPlayer(true);
        }

        // Exit Portal
        const exit = lvl.exit;
        const exitDist = Math.hypot(this.player.x - exit.x, this.player.y - exit.y);
        if (exitDist < 1.6) {
            this.sectorVictory();
        }

        // Update 3D World & Camera
        this.world.update(scaledDt, this.player, this.polarity);
        this.updateHUD();
    }

    sectorVictory() {
        this.state = 'VICTORY';
        this.audio.playVictory();
        this.totalTime += this.elapsedTime;

        document.getElementById('stat-time').textContent = this.formatTime(this.elapsedTime);
        document.getElementById('stat-shards').textContent = `${this.collectedShards} / ${this.world.shardObjects.length}`;
        document.getElementById('stat-deaths').textContent = this.deaths;
        document.getElementById('modal-victory').classList.remove('hidden');
    }

    nextLevel() {
        this.hideModals();
        if (this.currentLevelIdx + 1 < LEVELS_3D.length) {
            this.loadLevel(this.currentLevelIdx + 1);
            this.state = 'PLAYING';
        } else {
            this.gameComplete();
        }
    }

    gameComplete() {
        this.state = 'GAMEOVER';
        document.getElementById('stat-total-time').textContent = this.formatTime(this.totalTime);
        document.getElementById('stat-total-shards').textContent = `15 / 15`;
        document.getElementById('modal-gameover').classList.remove('hidden');
    }

    formatTime(ms) {
        const totalSec = Math.floor(ms / 1000);
        const min = Math.floor(totalSec / 60);
        const sec = totalSec % 60;
        const tenths = Math.floor((ms % 1000) / 100);
        return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}.${tenths}`;
    }

    updateHUD() {
        const lvl = LEVELS_3D[this.currentLevelIdx];
        const hudLevel = document.getElementById('hud-level');
        const hudShards = document.getElementById('hud-shards');
        const hudTimer = document.getElementById('hud-timer');

        if (hudLevel) hudLevel.textContent = lvl.name;
        if (hudShards) hudShards.textContent = `${this.collectedShards} / ${this.world.shardObjects.length}`;
        if (hudTimer) hudTimer.textContent = this.formatTime(this.elapsedTime);
    }

    loop(timestamp) {
        const dt = Math.min((timestamp - this.lastTime) / 1000, 0.05);
        this.lastTime = timestamp;

        this.update(dt);

        requestAnimationFrame(this.loop.bind(this));
    }
}

window.addEventListener('DOMContentLoaded', () => {
    window.game = new GameEngine();
});
