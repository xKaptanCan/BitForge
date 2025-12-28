/**
 * BitForge - Binary Music Generator
 */

const BinaryMusic = {
    isPlaying: false,
    isLooping: false,
    tempo: 120, // BPM
    volume: 0.7,
    waveType: 'sine',
    currentBit: 0,
    playInterval: null,
    binaryValue: 0n,
    bitWidth: 8,

    // Notes for each bit position (8-bit scale)
    scale: ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'],

    /**
     * Initialize music component
     */
    init() {
        this.setupEventListeners();
        return true;
    },

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Music toggle button
        const musicToggle = document.getElementById('music-toggle');
        if (musicToggle) {
            musicToggle.addEventListener('click', () => this.togglePanel());
        }

        // Close panel button
        const closeBtn = document.getElementById('close-music');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closePanel());
        }

        // Play button
        const playBtn = document.getElementById('music-play');
        if (playBtn) {
            playBtn.addEventListener('click', () => this.play());
        }

        // Stop button
        const stopBtn = document.getElementById('music-stop');
        if (stopBtn) {
            stopBtn.addEventListener('click', () => this.stop());
        }

        // Loop button
        const loopBtn = document.getElementById('music-loop');
        if (loopBtn) {
            loopBtn.addEventListener('click', () => this.toggleLoop());
        }

        // Tempo slider
        const tempoSlider = document.getElementById('music-tempo');
        if (tempoSlider) {
            tempoSlider.addEventListener('input', () => {
                this.tempo = parseInt(tempoSlider.value);
                const tempoValue = document.getElementById('music-tempo-value');
                if (tempoValue) tempoValue.textContent = `${this.tempo} BPM`;
            });
        }

        // Volume slider
        const volumeSlider = document.getElementById('music-volume');
        if (volumeSlider) {
            volumeSlider.addEventListener('input', () => {
                this.volume = parseInt(volumeSlider.value) / 100;
                AudioUtils.setVolume(this.volume);
                const volumeValue = document.getElementById('music-volume-value');
                if (volumeValue) volumeValue.textContent = `${Math.round(this.volume * 100)}%`;
            });
        }

        // Wave type buttons
        const waveBtns = document.querySelectorAll('.wave-btn');
        waveBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.waveType = btn.dataset.wave;
                waveBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
    },

    /**
     * Toggle panel visibility
     */
    togglePanel() {
        const panel = document.getElementById('music-panel');
        if (panel) {
            panel.classList.toggle('active');
        }
    },

    /**
     * Close panel
     */
    closePanel() {
        const panel = document.getElementById('music-panel');
        if (panel) {
            panel.classList.remove('active');
        }
    },

    /**
     * Set binary value to play
     */
    setValue(value, bitWidth = 8) {
        this.binaryValue = BigInt(value);
        this.bitWidth = bitWidth;

        // Update scale based on bit width
        this.updateScale();
    },

    /**
     * Update scale based on bit width
     */
    updateScale() {
        const baseNotes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
        this.scale = [];

        let noteIndex = 0;
        let octave = 4;

        for (let i = 0; i < this.bitWidth; i++) {
            this.scale.push(baseNotes[noteIndex] + octave);
            noteIndex++;
            if (noteIndex >= baseNotes.length) {
                noteIndex = 0;
                octave++;
            }
        }
    },

    /**
     * Start playing
     */
    play() {
        if (this.isPlaying) return;

        // Initialize audio if needed
        AudioUtils.init();
        AudioUtils.resume();
        AudioUtils.setVolume(this.volume);

        // Get current value from BitGrid if available
        if (typeof BitGrid !== 'undefined') {
            this.setValue(BitGrid.getValue(), BitGrid.getBitWidth());
        }

        this.isPlaying = true;
        this.currentBit = 0;

        // Calculate interval from tempo
        const msPerBeat = (60 / this.tempo) * 1000;

        this.playInterval = setInterval(() => this.playNextBit(), msPerBeat);

        // Update UI
        const playBtn = document.getElementById('music-play');
        if (playBtn) {
            playBtn.textContent = '▶ Playing...';
            playBtn.disabled = true;
        }

        this.updateCurrentNote('♪ Playing...');
    },

    /**
     * Play next bit
     */
    playNextBit() {
        if (this.currentBit >= this.bitWidth) {
            if (this.isLooping) {
                this.currentBit = 0;
            } else {
                this.stop();
                return;
            }
        }

        // Get bit value (from MSB to LSB)
        const bitPosition = this.bitWidth - 1 - this.currentBit;
        const bitValue = Number((this.binaryValue >> BigInt(bitPosition)) & 1n);

        // Highlight note
        this.highlightNote(this.currentBit, bitValue);

        // Play note if bit is 1
        if (bitValue === 1) {
            const note = this.scale[this.currentBit % this.scale.length];
            const duration = (60 / this.tempo) * 0.8; // 80% of beat duration
            AudioUtils.playNote(note, duration, this.waveType);
            this.updateCurrentNote(`♪ ${note}`);
        } else {
            this.updateCurrentNote('♪ Rest');
        }

        this.currentBit++;
    },

    /**
     * Highlight current note
     */
    highlightNote(index, isPlaying) {
        const notes = document.querySelectorAll('#music-notes .note');
        notes.forEach((note, i) => {
            note.classList.remove('active');
            if (i === (index % notes.length)) {
                note.classList.add('active');
                if (isPlaying) {
                    note.classList.add('note-playing');
                    setTimeout(() => note.classList.remove('note-playing'), 200);
                }
            }
        });
    },

    /**
     * Update current note display
     */
    updateCurrentNote(text) {
        const currentNote = document.getElementById('current-note');
        if (currentNote) {
            currentNote.textContent = text;
        }
    },

    /**
     * Stop playing
     */
    stop() {
        this.isPlaying = false;

        if (this.playInterval) {
            clearInterval(this.playInterval);
            this.playInterval = null;
        }

        this.currentBit = 0;

        // Clear highlights
        const notes = document.querySelectorAll('#music-notes .note');
        notes.forEach(note => note.classList.remove('active', 'note-playing'));

        // Update UI
        const playBtn = document.getElementById('music-play');
        if (playBtn) {
            playBtn.textContent = '▶ Play';
            playBtn.disabled = false;
        }

        this.updateCurrentNote('♪ Ready');
    },

    /**
     * Toggle loop mode
     */
    toggleLoop() {
        this.isLooping = !this.isLooping;

        const loopBtn = document.getElementById('music-loop');
        if (loopBtn) {
            loopBtn.classList.toggle('active', this.isLooping);
        }
    },

    /**
     * Get tempo in milliseconds
     */
    getTempoMs() {
        return (60 / this.tempo) * 1000;
    }
};

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BinaryMusic;
}
