// ============================================
// Audio UI Manager (Web Audio API)
// Synthesizes sounds programmatically
// ============================================

class AudioManager {
    constructor() {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.value = 0.3; // Keep it subtle
        this.masterGain.connect(this.ctx.destination);
        this.enabled = true;
    }

    // Resume context on user interaction (browser policy)
    resume() {
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    // High-frequency "blip" for hover
    playHover() {
        if (!this.enabled) return;
        this.resume();

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(600, this.ctx.currentTime + 0.05);

        gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.05);
    }

    // Mechanical "click"
    playClick() {
        if (!this.enabled) return;
        this.resume();

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(150, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(50, this.ctx.currentTime + 0.1);

        gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.1);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.1);
    }

    // Success chime (e.g., for form submit or special actions)
    playSuccess() {
        if (!this.enabled) return;
        this.resume();

        const now = this.ctx.currentTime;

        // Chord: C5, E5, G5
        [523.25, 659.25, 783.99].forEach((freq, i) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.connect(gain);
            gain.connect(this.masterGain);

            osc.type = 'sine';
            osc.frequency.value = freq;

            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(0.1, now + 0.1 + (i * 0.05));
            gain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);

            osc.start(now);
            osc.stop(now + 1.5);
        });
    }
}

// Initialize and export
const audioManager = new AudioManager();

// Attach to global scope for easy access
window.audioManager = audioManager;

// Auto-attach listeners to interactive elements
document.addEventListener('DOMContentLoaded', () => {
    const interactiveSelectors = 'a, button, .btn, .step-card, .feature-card, .partner-card, input, textarea, .faq-question';

    document.body.addEventListener('mouseover', (e) => {
        if (e.target.closest(interactiveSelectors)) {
            audioManager.playHover();
        }
    });

    document.body.addEventListener('mousedown', () => {
        audioManager.playClick();
    });
});
