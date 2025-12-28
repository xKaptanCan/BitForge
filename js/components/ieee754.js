/**
 * BitForge - IEEE 754 Floating Point Analyzer
 */

const IEEE754 = {
    precision: 32, // 32 or 64

    /**
     * Initialize component
     */
    init() {
        this.setupEventListeners();
        this.analyze(3.14159);
        return true;
    },

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        const input = document.getElementById('ieee-input');
        if (input) {
            input.addEventListener('input', () => {
                const value = parseFloat(input.value);
                if (!isNaN(value) || input.value === 'NaN' || input.value === 'Infinity' || input.value === '-Infinity') {
                    this.analyze(input.value === 'NaN' ? NaN :
                        input.value === 'Infinity' ? Infinity :
                            input.value === '-Infinity' ? -Infinity : value);
                }
            });
        }

        // Precision toggle
        const precisionBtns = document.querySelectorAll('.precision-btn');
        precisionBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.precision = parseInt(btn.dataset.precision);
                precisionBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const input = document.getElementById('ieee-input');
                if (input) {
                    this.analyze(parseFloat(input.value) || 0);
                }
            });
        });

        // Special value buttons
        const specialBtns = document.querySelectorAll('.special-value-btn');
        specialBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const value = btn.dataset.value;
                const input = document.getElementById('ieee-input');
                if (input) {
                    input.value = value;
                    this.analyze(value === 'NaN' ? NaN :
                        value === 'Infinity' ? Infinity :
                            value === '-Infinity' ? -Infinity :
                                value === '-0' ? -0 : parseFloat(value));
                }
            });
        });
    },

    /**
     * Analyze a floating point number
     */
    analyze(value) {
        const is32Bit = this.precision === 32;
        const result = is32Bit ? this.float32ToBinary(value) : this.float64ToBinary(value);

        this.updateDisplay(result, value);
    },

    /**
     * Convert float32 to binary representation
     */
    float32ToBinary(value) {
        const buffer = new ArrayBuffer(4);
        const view = new DataView(buffer);
        view.setFloat32(0, value, false); // big-endian
        const bits = view.getUint32(0, false);

        const sign = (bits >> 31) & 1;
        const exponent = (bits >> 23) & 0xFF;
        const mantissa = bits & 0x7FFFFF;

        return {
            sign: sign,
            signBits: sign.toString(2),
            exponent: exponent,
            exponentBits: exponent.toString(2).padStart(8, '0'),
            mantissa: mantissa,
            mantissaBits: mantissa.toString(2).padStart(23, '0'),
            bias: 127,
            fullBits: bits.toString(2).padStart(32, '0')
        };
    },

    /**
     * Convert float64 to binary representation
     */
    float64ToBinary(value) {
        const buffer = new ArrayBuffer(8);
        const view = new DataView(buffer);
        view.setFloat64(0, value, false);

        const high = view.getUint32(0, false);
        const low = view.getUint32(4, false);

        const sign = (high >> 31) & 1;
        const exponent = (high >> 20) & 0x7FF;
        const mantissaHigh = high & 0xFFFFF;
        const mantissaLow = low;

        const mantissaBits = mantissaHigh.toString(2).padStart(20, '0') +
            mantissaLow.toString(2).padStart(32, '0');

        return {
            sign: sign,
            signBits: sign.toString(2),
            exponent: exponent,
            exponentBits: exponent.toString(2).padStart(11, '0'),
            mantissa: mantissaHigh * 0x100000000 + mantissaLow,
            mantissaBits: mantissaBits,
            bias: 1023,
            fullBits: high.toString(2).padStart(32, '0') + low.toString(2).padStart(32, '0')
        };
    },

    /**
     * Update display
     */
    updateDisplay(result, originalValue) {
        // Update bit segments
        const signEl = document.getElementById('ieee-sign');
        const expEl = document.getElementById('ieee-exponent');
        const mantEl = document.getElementById('ieee-mantissa');

        if (signEl) signEl.textContent = result.signBits;
        if (expEl) expEl.textContent = result.exponentBits;
        if (mantEl) mantEl.textContent = result.mantissaBits;

        // Update breakdown
        const signValue = document.getElementById('ieee-sign-value');
        const expValue = document.getElementById('ieee-exp-value');
        const mantValue = document.getElementById('ieee-mant-value');
        const formula = document.getElementById('ieee-formula');

        if (signValue) {
            signValue.textContent = `${result.sign} (${result.sign === 0 ? 'Positive' : 'Negative'})`;
        }

        // Determine special cases
        const isZero = result.exponent === 0 && result.mantissa === 0;
        const isDenormalized = result.exponent === 0 && result.mantissa !== 0;
        const isInfinity = result.exponent === (this.precision === 32 ? 255 : 2047) && result.mantissa === 0;
        const isNaN = result.exponent === (this.precision === 32 ? 255 : 2047) && result.mantissa !== 0;

        if (expValue) {
            if (isZero || isDenormalized) {
                expValue.textContent = `${result.exponent} (Denormalized)`;
            } else if (isInfinity || isNaN) {
                expValue.textContent = `${result.exponent} (Special)`;
            } else {
                const actualExp = result.exponent - result.bias;
                expValue.textContent = `${result.exponent} - ${result.bias} = ${actualExp}`;
            }
        }

        if (mantValue) {
            if (isZero) {
                mantValue.textContent = '0';
            } else if (isNaN) {
                mantValue.textContent = 'NaN (Not a Number)';
            } else if (isInfinity) {
                mantValue.textContent = 'Infinity';
            } else {
                // Calculate actual mantissa value
                let mantissaDecimal = 1;
                for (let i = 0; i < result.mantissaBits.length; i++) {
                    if (result.mantissaBits[i] === '1') {
                        mantissaDecimal += Math.pow(2, -(i + 1));
                    }
                }
                mantValue.textContent = mantissaDecimal.toFixed(6) + '...';
            }
        }

        if (formula) {
            if (isZero) {
                formula.textContent = result.sign === 0 ? '+0' : '-0';
            } else if (isNaN) {
                formula.textContent = 'NaN';
            } else if (isInfinity) {
                formula.textContent = result.sign === 0 ? '+∞' : '-∞';
            } else {
                const signStr = result.sign === 0 ? '' : '-';
                const actualExp = result.exponent - result.bias;
                formula.textContent = `(-1)^${result.sign} × 2^${actualExp} × 1.xxx... = ${signStr}${Math.abs(originalValue)}`;
            }
        }
    }
};

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = IEEE754;
}
