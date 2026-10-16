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
        this.STORAGE_KEY = 'polarity_game_settings_v2';
        
        // Default Sensitivity & Gameplay Parameters
        this.defaults = {
            squatSensitivity: 0.085, // Lower = shallow squat jumps; Higher = deep squat needed
            handSensitivity: 0.045,  // Hand raise distance from shoulder
            steeringSmoothness: 0.22, // 0.08 = ultra-smooth cinematic, 0.45 = snappy esports
            unpredictability: 'NORMAL', // 'CHILL', 'NORMAL', 'CHAOS'
            variableJump: true,      // Deeper squat = higher jump
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
        // Val in range 0.04 to 0.16 (inverted in UI: higher slider = more sensitive)
        this.current.squatSensitivity = parseFloat(val);
        this.saveSettings();
        window.dispatchEvent(new CustomEvent('polarity_settings_changed', { detail: this.current }));
    }

    setHandSensitivity(val) {
        // Val in range 0.02 to 0.10
        this.current.handSensitivity = parseFloat(val);
        this.saveSettings();
        window.dispatchEvent(new CustomEvent('polarity_settings_changed', { detail: this.current }));
    }

    setSteeringSmoothness(val) {
        // Val in range 0.08 to 0.40
        this.current.steeringSmoothness = parseFloat(val);
        this.saveSettings();
        window.dispatchEvent(new CustomEvent('polarity_settings_changed', { detail: this.current }));
    }

    setUnpredictability(mode) {
        // 'CHILL', 'NORMAL', 'CHAOS'
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
