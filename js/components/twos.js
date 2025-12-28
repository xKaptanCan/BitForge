/**
 * BitForge - Two's Complement Calculator
 */

const TwosComplement = {
    bitWidth: 8,

    /**
     * Initialize component
     */
    init() {
        this.setupEventListeners();
        this.calculate(-42);
        return true;
    },

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        const input = document.getElementById('twos-input');
        if (input) {
            input.addEventListener('input', () => {
                const value = parseInt(input.value);
                if (!isNaN(value)) {
                    this.calculate(value);
                }
            });
        }

        // Bit width buttons
        const bitBtns = document.querySelectorAll('.twos-bit-btn');
        bitBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.bitWidth = parseInt(btn.dataset.bits);
                bitBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const input = document.getElementById('twos-input');
                if (input) {
                    this.calculate(parseInt(input.value) || 0);
                }
            });
        });
    },

    /**
     * Calculate two's complement
     */
    calculate(value) {
        const absValue = Math.abs(value);
        const isNegative = value < 0;

        // Original binary (absolute value)
        const originalBits = this.toBinary(absValue);

        // Inverted bits
        const invertedBits = this.invert(originalBits);

        // Add 1 (two's complement result for negative)
        const twosCompBits = isNegative ? this.addOne(invertedBits) : originalBits;

        // Update display
        this.updateDisplay(value, originalBits, invertedBits, twosCompBits);
        this.updateRangeMarker(value);
    },

    /**
     * Convert to binary with padding
     */
    toBinary(value) {
        const binary = (value >>> 0).toString(2);
        return binary.padStart(this.bitWidth, '0').slice(-this.bitWidth);
    },

    /**
     * Invert bits
     */
    invert(bits) {
        return bits.split('').map(b => b === '0' ? '1' : '0').join('');
    },

    /**
     * Add one to binary string
     */
    addOne(bits) {
        let result = bits.split('');
        let carry = 1;

        for (let i = result.length - 1; i >= 0 && carry; i--) {
            const sum = parseInt(result[i]) + carry;
            result[i] = (sum % 2).toString();
            carry = Math.floor(sum / 2);
        }

        return result.join('');
    },

    /**
     * Convert two's complement binary to decimal
     */
    twosToDecimal(bits) {
        // Check if negative (MSB is 1)
        if (bits[0] === '1') {
            // Invert and add 1, then negate
            const inverted = this.invert(bits);
            const added = this.addOne(inverted);
            return -parseInt(added, 2);
        }
        return parseInt(bits, 2);
    },

    /**
     * Update display
     */
    updateDisplay(value, original, inverted, result) {
        const originalEl = document.getElementById('twos-original');
        const invertedEl = document.getElementById('twos-inverted');
        const resultEl = document.getElementById('twos-result');
        const decimalEl = document.getElementById('twos-decimal');
        const hexEl = document.getElementById('twos-hex');
        const rangeEl = document.getElementById('twos-range');
        const rangeMin = document.getElementById('range-min');
        const rangeMax = document.getElementById('range-max');

        if (originalEl) originalEl.textContent = this.formatBinary(original);
        if (invertedEl) invertedEl.textContent = this.formatBinary(inverted);
        if (resultEl) resultEl.textContent = this.formatBinary(result);

        if (decimalEl) decimalEl.textContent = value;

        if (hexEl) {
            const hexValue = (value >>> 0).toString(16).toUpperCase().slice(-this.bitWidth / 4);
            hexEl.textContent = '0x' + hexValue.padStart(this.bitWidth / 4, '0');
        }

        const min = -(1 << (this.bitWidth - 1));
        const max = (1 << (this.bitWidth - 1)) - 1;

        if (rangeEl) rangeEl.textContent = `${min} to ${max}`;
        if (rangeMin) rangeMin.textContent = min;
        if (rangeMax) rangeMax.textContent = max;
    },

    /**
     * Format binary with spaces
     */
    formatBinary(bits) {
        const groups = [];
        for (let i = 0; i < bits.length; i += 4) {
            groups.push(bits.slice(i, i + 4));
        }
        return groups.join(' ');
    },

    /**
     * Update range marker position
     */
    updateRangeMarker(value) {
        const marker = document.getElementById('twos-marker');
        if (!marker) return;

        const min = -(1 << (this.bitWidth - 1));
        const max = (1 << (this.bitWidth - 1)) - 1;
        const range = max - min;

        // Clamp value to range
        const clampedValue = Math.max(min, Math.min(max, value));

        // Calculate percentage
        const percentage = ((clampedValue - min) / range) * 100;
        marker.style.left = `${percentage}%`;
    },

    /**
     * Check if value is in valid range
     */
    isInRange(value) {
        const min = -(1 << (this.bitWidth - 1));
        const max = (1 << (this.bitWidth - 1)) - 1;
        return value >= min && value <= max;
    }
};

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TwosComplement;
}
