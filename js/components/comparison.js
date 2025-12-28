/**
 * BitForge - Comparison Mode Component
 */

const Comparison = {
    bitWidth: 8,

    /**
     * Initialize component
     */
    init() {
        this.setupEventListeners();
        this.compare(170, 85);
        return true;
    },

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        const inputA = document.getElementById('comp-input-a');
        const inputB = document.getElementById('comp-input-b');

        if (inputA) {
            inputA.addEventListener('input', () => this.update());
        }
        if (inputB) {
            inputB.addEventListener('input', () => this.update());
        }
    },

    /**
     * Update from inputs
     */
    update() {
        const inputA = document.getElementById('comp-input-a');
        const inputB = document.getElementById('comp-input-b');

        const valueA = parseInt(inputA?.value) || 0;
        const valueB = parseInt(inputB?.value) || 0;

        this.compare(valueA, valueB);
    },

    /**
     * Compare two values
     */
    compare(valueA, valueB) {
        // Determine bit width based on larger value
        const maxVal = Math.max(Math.abs(valueA), Math.abs(valueB));
        if (maxVal > 0xFFFFFFFF) {
            this.bitWidth = 64;
        } else if (maxVal > 0xFFFF) {
            this.bitWidth = 32;
        } else if (maxVal > 0xFF) {
            this.bitWidth = 16;
        } else {
            this.bitWidth = 8;
        }

        // Update panel info
        this.updatePanelInfo('a', valueA);
        this.updatePanelInfo('b', valueB);

        // Render comparison grid
        this.renderGrid(valueA, valueB);

        // Calculate and display stats
        this.updateStats(valueA, valueB);
    },

    /**
     * Update panel info
     */
    updatePanelInfo(panel, value) {
        const decEl = document.getElementById(`comp-dec-${panel}`);
        const hexEl = document.getElementById(`comp-hex-${panel}`);
        const binEl = document.getElementById(`comp-bin-${panel}`);

        if (decEl) decEl.textContent = value;
        if (hexEl) hexEl.textContent = Converter.decToHex(value);
        if (binEl) binEl.textContent = Converter.padBinary(Converter.decToBin(value), this.bitWidth);
    },

    /**
     * Render comparison grid
     */
    renderGrid(valueA, valueB) {
        const bitsAEl = document.getElementById('comp-bits-a');
        const bitsBEl = document.getElementById('comp-bits-b');
        const bitsDiffEl = document.getElementById('comp-bits-diff');

        if (!bitsAEl || !bitsBEl || !bitsDiffEl) return;

        const bitsA = BitOps.toBitArray(valueA, this.bitWidth);
        const bitsB = BitOps.toBitArray(valueB, this.bitWidth);
        const xorResult = BitOps.xor(valueA, valueB);
        const bitsDiff = BitOps.toBitArray(xorResult, this.bitWidth);

        // Clear containers
        DOM.clear(bitsAEl);
        DOM.clear(bitsBEl);
        DOM.clear(bitsDiffEl);

        // Render bits
        for (let i = 0; i < this.bitWidth; i++) {
            const isSame = bitsA[i] === bitsB[i];

            // Bit A
            const bitAEl = DOM.create('div', {
                class: `comp-bit ${isSame ? 'same' : 'diff'}`,
                dataset: { value: bitsA[i] }
            }, [bitsA[i].toString()]);
            bitsAEl.appendChild(bitAEl);

            // Diff indicator
            const diffEl = DOM.create('div', {
                class: `comp-bit ${isSame ? '' : 'diff'}`,
                dataset: { value: bitsDiff[i] }
            }, [isSame ? '=' : '≠']);
            bitsDiffEl.appendChild(diffEl);

            // Bit B
            const bitBEl = DOM.create('div', {
                class: `comp-bit ${isSame ? 'same' : 'diff'}`,
                dataset: { value: bitsB[i] }
            }, [bitsB[i].toString()]);
            bitsBEl.appendChild(bitBEl);
        }
    },

    /**
     * Update statistics
     */
    updateStats(valueA, valueB) {
        const xorResult = BitOps.xor(valueA, valueB);
        const hammingDistance = BitOps.hammingDistance(valueA, valueB);
        const similarity = ((this.bitWidth - hammingDistance) / this.bitWidth) * 100;

        const xorDecEl = document.getElementById('comp-xor-dec');
        const xorHexEl = document.getElementById('comp-xor-hex');
        const hammingEl = document.getElementById('comp-hamming');
        const similarityEl = document.getElementById('comp-similarity');

        if (xorDecEl) xorDecEl.textContent = xorResult.toString();
        if (xorHexEl) xorHexEl.textContent = '0x' + Converter.decToHex(xorResult);
        if (hammingEl) hammingEl.textContent = hammingDistance;
        if (similarityEl) similarityEl.textContent = similarity.toFixed(1) + '%';
    },

    /**
     * Set values programmatically
     */
    setValues(valueA, valueB) {
        const inputA = document.getElementById('comp-input-a');
        const inputB = document.getElementById('comp-input-b');

        if (inputA) inputA.value = valueA;
        if (inputB) inputB.value = valueB;

        this.compare(valueA, valueB);
    },

    /**
     * Get comparison result
     */
    getResult() {
        const inputA = document.getElementById('comp-input-a');
        const inputB = document.getElementById('comp-input-b');

        const valueA = parseInt(inputA?.value) || 0;
        const valueB = parseInt(inputB?.value) || 0;

        return {
            valueA,
            valueB,
            xor: Number(BitOps.xor(valueA, valueB)),
            hammingDistance: BitOps.hammingDistance(valueA, valueB),
            similarity: ((this.bitWidth - BitOps.hammingDistance(valueA, valueB)) / this.bitWidth) * 100,
            bitWidth: this.bitWidth
        };
    }
};

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Comparison;
}
