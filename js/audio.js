/**
 * POLARITY // Procedural Web Audio API Engine
 * 100% Procedural Synthesis - Zero External Audio Files
 */
class CyberAudio {
    constructor() {
        this.ctx = null;
        this.muted = false;
        this.bgmPlaying = false;
        this.bgmTimer = null;
        this.noteIndex = 0;
    }

    init() {
        if (!this.ctx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioContext();
        }
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
        if (!this.bgmPlaying && !this.muted) {
            this.startAmbientMusic();
        }
    }

    toggleMute() {
        this.muted = !this.muted;
        if (this.muted) {
            this.stopAmbientMusic();
        } else {
            this.init();
            this.startAmbientMusic();
        }
        return this.muted;
    }

    playJump() {
        if (this.muted || !this.ctx) return;
        try {
            const t = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(140, t);
            osc.frequency.exponentialRampToValueAtTime(640, t + 0.16);
            gain.gain.setValueAtTime(0.22, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(t);
            osc.stop(t + 0.18);
        } catch (e) { }
    }

    playLand() {
        if (this.muted || !this.ctx) return;
        try {
            const t = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(130, t);
            osc.frequency.exponentialRampToValueAtTime(40, t + 0.14);
            gain.gain.setValueAtTime(0.2, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.14);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(t);
            osc.stop(t + 0.14);
        } catch (e) { }
    }

    playShift(polarity) {
        if (this.muted || !this.ctx) return;
        try {
            const t = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const filter = this.ctx.createBiquadFilter();
            const gain = this.ctx.createGain();

            osc.type = 'sawtooth';
            filter.type = 'bandpass';
            filter.Q.value = 4.5;

            if (polarity === 'CYAN') {
                osc.frequency.setValueAtTime(220, t);
                osc.frequency.exponentialRampToValueAtTime(880, t + 0.22);
                filter.frequency.setValueAtTime(440, t);
                filter.frequency.exponentialRampToValueAtTime(2400, t + 0.22);
            } else {
                osc.frequency.setValueAtTime(880, t);
                osc.frequency.exponentialRampToValueAtTime(220, t + 0.22);
                filter.frequency.setValueAtTime(2400, t);
                filter.frequency.exponentialRampToValueAtTime(440, t + 0.22);
            }

            gain.gain.setValueAtTime(0.22, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.24);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(t);
            osc.stop(t + 0.24);
        } catch (e) { }
    }

    playShard() {
        if (this.muted || !this.ctx) return;
        try {
            const t = this.ctx.currentTime;
            const freqs = [523.25, 659.25, 783.99, 1046.50];
            freqs.forEach((freq, idx) => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, t + idx * 0.04);
                gain.gain.setValueAtTime(0.15, t + idx * 0.04);
                gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.04 + 0.22);
                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.start(t + idx * 0.04);
                osc.stop(t + idx * 0.04 + 0.24);
            });
        } catch (e) { }
    }

    playDeath() {
        if (this.muted || !this.ctx) return;
        try {
            const t = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(280, t);
            osc.frequency.linearRampToValueAtTime(40, t + 0.35);
            gain.gain.setValueAtTime(0.25, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.38);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(t);
            osc.stop(t + 0.38);
        } catch (e) { }
    }

    playFootstep() {
        if (this.muted || !this.ctx) return;
        try {
            const t = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(85, t);
            gain.gain.setValueAtTime(0.045, t);
            gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.04);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(t);
            osc.stop(t + 0.04);
        } catch (e) { }
    }

    playVictory() {
        if (this.muted || !this.ctx) return;
        try {
            const t = this.ctx.currentTime;
            const notes = [440, 554.37, 659.25, 880, 1108.73];
            notes.forEach((f, i) => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(f, t + i * 0.08);
                gain.gain.setValueAtTime(0.18, t + i * 0.08);
                gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.08 + 0.35);
                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.start(t + i * 0.08);
                osc.stop(t + i * 0.08 + 0.36);
            });
        } catch (e) { }
    }

    startAmbientMusic() {
        if (this.bgmPlaying || !this.ctx) return;
        this.bgmPlaying = true;
        const scaleCyan = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25];
        const scaleMag = [220.00, 246.94, 277.18, 329.63, 369.99, 440.00];
        const stepTime = 160;

        const playArp = () => {
            if (!this.bgmPlaying || this.muted) return;
            try {
                const isCyan = (window.game && window.game.polarity === 'CYAN');
                const scale = isCyan ? scaleCyan : scaleMag;
                const freq = scale[this.noteIndex % scale.length];

                const t = this.ctx.currentTime;
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                const filter = this.ctx.createBiquadFilter();

                osc.type = isCyan ? 'sine' : 'sawtooth';
                osc.frequency.setValueAtTime(freq, t);

                filter.type = 'lowpass';
                filter.frequency.setValueAtTime(isCyan ? 950 : 700, t);

                gain.gain.setValueAtTime(0.04, t);
                gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);

                osc.connect(filter);
                filter.connect(gain);
                gain.connect(this.ctx.destination);

                osc.start(t);
                osc.stop(t + 0.19);
                this.noteIndex++;
            } catch (e) { }
            this.bgmTimer = setTimeout(playArp, stepTime);
        };
        playArp();
    }

    stopAmbientMusic() {
        this.bgmPlaying = false;
        if (this.bgmTimer) {
            clearTimeout(this.bgmTimer);
            this.bgmTimer = null;
        }
    }
}
window.CyberAudio = CyberAudio;
