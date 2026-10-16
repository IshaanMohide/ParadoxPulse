/**
 * POLARITY // Settings & Camera Sensitivity Manager
 * Features:
 *   - Live Hand Sensitivity Slider
 *   - Live Squat Depth Sensitivity Slider
 *   - Live Steering Responsiveness Slider
 *   - Unpredictability / Matrix Chaos Level Selector (Chill, Normal, Chaos)
 *   - Persistent LocalStorage Saving & Event Dispatching
 */
class GameSettings {
    constructor() {
        this.STORAGE_KEY = 'polarity_game_settings_v3';
        
        // Calibrated Sensitivity & Gameplay Parameters (Less twitchy, more deliberate & smooth)
        this.defaults = {
            squatSensitivity: 0.115,  // Less sensitive: requires clear, deliberate squat
            handSensitivity: 0.070,   // Less sensitive: requires clear hand raise above shoulder
            steeringSmoothness: 0.16, // Smoother, calmer analog steering
            unpredictability: 'CHAOS', // Dynamic high-unpredictability quantum matrix!
            variableJump: true,
            cameraMirror: true,
            audioVolume: 0.8
        };

        this.current = Object.assign({}, this.defaults);
        this.loadSettings();
    }

    loadSettings() {
        try {
            const raw = localStorage.getItem(this.STORAGE_KEY);
            if (raw) {
                const parsed = JSON.parse(raw);
                this.current = Object.assign({}, this.defaults, parsed);
            }
        } catch (e) {
            console.warn("Could not load stored settings:", e);
        }
    }

    saveSettings() {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.current));
        } catch (e) { }
    }

    setSquatSensitivity(val) {
        this.current.squatSensitivity = parseFloat(val);
        this.saveSettings();
        window.dispatchEvent(new CustomEvent('polarity_settings_changed', { detail: this.current }));
    }

    setHandSensitivity(val) {
        this.current.handSensitivity = parseFloat(val);
        this.saveSettings();
        window.dispatchEvent(new CustomEvent('polarity_settings_changed', { detail: this.current }));
    }

    setSteeringSmoothness(val) {
        this.current.steeringSmoothness = parseFloat(val);
        this.saveSettings();
        window.dispatchEvent(new CustomEvent('polarity_settings_changed', { detail: this.current }));
    }

    setUnpredictability(mode) {
        this.current.unpredictability = mode;
        this.saveSettings();
        window.dispatchEvent(new CustomEvent('polarity_settings_changed', { detail: this.current }));
    }

    resetDefaults() {
        this.current = Object.assign({}, this.defaults);
        this.saveSettings();
        window.dispatchEvent(new CustomEvent('polarity_settings_changed', { detail: this.current }));
    }
}

window.GameSettings = new GameSettings();
