/**
 * BitForge - Interactive Bit Grid Component
 */

const BitGrid = {
    container: null,
    bitWidth: 16,
    currentValue: 0n,
    onChangeCallback: null,

    /**
     * Initialize bit grid
     */
    init(containerId = 'bitgrid') {
        this.container = document.getElementById(containerId);
        if (!this.container) return false;

        this.setupEventListeners();
        this.render();
        this.updateInfo();
        return true;
    },

    /**
     * Set up event listeners
     */
    setupEventListeners() {
        // Bit width buttons
        const bitWidthBtns = document.querySelectorAll('.bit-width-btn');
        bitWidthBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const bits = parseInt(btn.dataset.bits);
                this.setBitWidth(bits);

                // Update active state
                bitWidthBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });

        // Clear button
        const clearBtn = document.getElementById('clear-bits');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => this.clear());
        }
    },

    /**
     * Set bit width
     */
    setBitWidth(width) {
        this.bitWidth = width;

        // Mask value to new bit width
        const mask = (1n << BigInt(width)) - 1n;
        this.currentValue = this.currentValue & mask;

        this.render();
        this.updateInfo();
        this.triggerChange();
    },

    /**
     * Set value
     */
    setValue(value) {
        this.currentValue = BigInt(value);
        this.render();
        this.updateInfo();
    },

    /**
     * Get value
     */
    getValue() {
        return this.currentValue;
    },

    /**
     * Render the bit grid
     */
    render() {
        if (!this.container) return;

        DOM.clear(this.container);

        const bytesCount = this.bitWidth / 8;

        for (let byteIndex = 0; byteIndex < bytesCount; byteIndex++) {
            const byteGroup = DOM.create('div', { class: 'byte-group' });

            // Create bits for this byte (8 bits each)
            for (let bitInByte = 7; bitInByte >= 0; bitInByte--) {
                const bitPosition = (bytesCount - 1 - byteIndex) * 8 + bitInByte;
                const bitValue = Number((this.currentValue >> BigInt(bitPosition)) & 1n);

                const bit = DOM.create('div', {
                    class: 'bit',
                    dataset: {
                        position: bitPosition,
                        value: bitValue
                    },
                    title: `Bit ${bitPosition}`
                }, [bitValue.toString()]);

                bit.addEventListener('click', () => this.toggleBit(bitPosition));

                byteGroup.appendChild(bit);
            }

            this.container.appendChild(byteGroup);
        }

        // Add bit indices
        const indicesRow = DOM.create('div', { class: 'bit-indices' });
        for (let i = this.bitWidth - 1; i >= 0; i--) {
            if (i % 8 === 7 || i % 8 === 0) {
                const indexLabel = DOM.create('span', { class: 'bit-index' }, [i.toString()]);
                indicesRow.appendChild(indexLabel);
            }
        }
    },

    /**
     * Toggle a specific bit
     */
    toggleBit(position) {
        const previousValue = this.currentValue;
        this.currentValue = Converter.toggleBit(this.currentValue, position);

        // Animate the bit
        this.animateBit(position, previousValue);

        this.render();
        this.updateInfo();
        this.triggerChange();
    },

    /**
     * Set a specific bit
     */
    setBit(position, value) {
        this.currentValue = Converter.setBit(this.currentValue, position, value);
        this.render();
        this.updateInfo();
        this.triggerChange();
    },

    /**
     * Clear all bits
     */
    clear() {
        this.currentValue = 0n;
        this.render();
        this.updateInfo();
        this.triggerChange();
    },

    /**
     * Animate bit change
     */
    animateBit(position, previousValue) {
        const previousBit = Number((previousValue >> BigInt(position)) & 1n);
        const currentBit = Number((this.currentValue >> BigInt(position)) & 1n);

        if (previousBit !== currentBit) {
            // Trigger particle effect via BitDance
            if (typeof BitDance !== 'undefined') {
                const bitElement = this.container.querySelector(`[data-position="${position}"]`);
                if (bitElement) {
                    const rect = bitElement.getBoundingClientRect();
                    const x = rect.left + rect.width / 2;
                    const y = rect.top + rect.height / 2;

                    if (currentBit === 1) {
                        BitDance.emitRise(x, y);
                    } else {
                        BitDance.emitFall(x, y);
                    }
                }
            }
        }
    },

    /**
     * Update info display
     */
    updateInfo() {
        const setBitsEl = document.getElementById('set-bits-count');
        const maxValueEl = document.getElementById('max-value');

        if (setBitsEl) {
            setBitsEl.textContent = Converter.countSetBits(this.currentValue);
        }

        if (maxValueEl) {
            const maxVal = Converter.getMaxValue(this.bitWidth);
            maxValueEl.textContent = maxVal.toLocaleString();
        }
    },

    /**
     * Set change callback
     */
    onChange(callback) {
        this.onChangeCallback = callback;
    },

    /**
     * Trigger change callback
     */
    triggerChange() {
        if (this.onChangeCallback) {
            this.onChangeCallback(this.currentValue, this.bitWidth);
        }
    },

    /**
     * Get bit width
     */
    getBitWidth() {
        return this.bitWidth;
    },

    /**
     * Highlight specific bits (for operations visualization)
     */
    highlightBits(positions, className = 'highlight') {
        positions.forEach(pos => {
            const bit = this.container.querySelector(`[data-position="${pos}"]`);
            if (bit) {
                bit.classList.add(className);
            }
        });
    },

    /**
     * Clear highlights
     */
    clearHighlights() {
        const highlighted = this.container.querySelectorAll('.highlight');
        highlighted.forEach(el => el.classList.remove('highlight'));
    }
};

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BitGrid;
}
