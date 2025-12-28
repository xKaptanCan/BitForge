/**
 * BitForge - Audio Utilities (Web Audio API)
 */

const AudioUtils = {
    context: null,
    masterGain: null,
    isInitialized: false,

    // Note frequencies (Hz)
    notes: {
        'C4': 261.63,
        'D4': 293.66,
        'E4': 329.63,
        'F4': 349.23,
        'G4': 392.00,
        'A4': 440.00,
        'B4': 493.88,
        'C5': 523.25,
        'D5': 587.33,
        'E5': 659.25,
        'F5': 698.46,
        'G5': 783.99,
        'A5': 880.00,
        'B5': 987.77,
        'C6': 1046.50
    },

    /**
     * Initialize audio context
     */
    init() {
        if (this.isInitialized) return true;

        try {
            this.context = new (window.AudioContext || window.webkitAudioContext)();
            this.masterGain = this.context.createGain();
            this.masterGain.connect(this.context.destination);
            this.masterGain.gain.value = 0.7;
            this.isInitialized = true;
            return true;
        } catch (e) {
            console.warn('Web Audio API not supported:', e);
            return false;
        }
    },

    /**
     * Resume audio context (required after user interaction)
     */
    async resume() {
        if (this.context && this.context.state === 'suspended') {
            await this.context.resume();
        }
    },

    /**
     * Set master volume (0-1)
     */
    setVolume(value) {
        if (this.masterGain) {
            this.masterGain.gain.value = Math.max(0, Math.min(1, value));
        }
    },

    /**
     * Play a note
     * @param {string} note - Note name (e.g., 'C4', 'A4')
     * @param {number} duration - Duration in seconds
     * @param {string} waveType - Oscillator wave type
     */
    playNote(note, duration = 0.2, waveType = 'sine') {
        if (!this.isInitialized) this.init();
        if (!this.context) return;

        const frequency = this.notes[note];
        if (!frequency) return;

        const oscillator = this.context.createOscillator();
        const gainNode = this.context.createGain();

        oscillator.type = waveType;
        oscillator.frequency.setValueAtTime(frequency, this.context.currentTime);

        // ADSR envelope
        const now = this.context.currentTime;
        const attack = 0.02;
        const decay = 0.1;
        const sustain = 0.3;
        const release = duration * 0.3;

        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.8, now + attack);
        gainNode.gain.linearRampToValueAtTime(sustain, now + attack + decay);
        gainNode.gain.linearRampToValueAtTime(0, now + duration);

        oscillator.connect(gainNode);
        gainNode.connect(this.masterGain);

        oscillator.start(now);
        oscillator.stop(now + duration + release);
    },

    /**
     * Play a frequency directly
     * @param {number} frequency - Frequency in Hz
     * @param {number} duration - Duration in seconds
     * @param {string} waveType - Oscillator wave type
     */
    playFrequency(frequency, duration = 0.2, waveType = 'sine') {
        if (!this.isInitialized) this.init();
        if (!this.context) return;

        const oscillator = this.context.createOscillator();
        const gainNode = this.context.createGain();

        oscillator.type = waveType;
        oscillator.frequency.setValueAtTime(frequency, this.context.currentTime);

        const now = this.context.currentTime;
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.5, now + 0.01);
        gainNode.gain.linearRampToValueAtTime(0, now + duration);

        oscillator.connect(gainNode);
        gainNode.connect(this.masterGain);

        oscillator.start(now);
        oscillator.stop(now + duration);
    },

    /**
     * Play a click sound
     */
    playClick() {
        this.playFrequency(800, 0.05, 'square');
    },

    /**
     * Play success sound
     */
    playSuccess() {
        if (!this.isInitialized) this.init();
        if (!this.context) return;

        const now = this.context.currentTime;
        const notes = ['C5', 'E5', 'G5'];
        notes.forEach((note, i) => {
            setTimeout(() => this.playNote(note, 0.15, 'sine'), i * 100);
        });
    },

    /**
     * Play error sound
     */
    playError() {
        this.playFrequency(200, 0.2, 'sawtooth');
    },

    /**
     * Get available notes
     */
    getNotes() {
        return Object.keys(this.notes);
    }
};

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AudioUtils;
}
