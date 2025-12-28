/**
 * BitForge - Number Converter Core
 */

const Converter = {
    /**
     * Convert decimal to binary string
     */
    decToBin(decimal) {
        if (decimal === 0n || decimal === 0) return '0';

        const num = BigInt(decimal);
        if (num < 0n) {
            // For negative numbers, return two's complement representation
            return num.toString(2);
        }
        return num.toString(2);
    },

    /**
     * Convert decimal to hexadecimal string
     */
    decToHex(decimal) {
        const num = BigInt(decimal);
        if (num < 0n) {
            return num.toString(16).toUpperCase();
        }
        return num.toString(16).toUpperCase();
    },

    /**
     * Convert decimal to octal string
     */
    decToOct(decimal) {
        const num = BigInt(decimal);
        return num.toString(8);
    },

    /**
     * Convert binary string to decimal
     */
    binToDec(binary) {
        if (!binary || binary === '') return 0n;
        const cleaned = binary.replace(/\s/g, '');
        if (!/^[01]+$/.test(cleaned)) return null;
        return BigInt('0b' + cleaned);
    },

    /**
     * Convert hexadecimal string to decimal
     */
    hexToDec(hex) {
        if (!hex || hex === '') return 0n;
        const cleaned = hex.replace(/^0x/i, '').replace(/\s/g, '');
        if (!/^[0-9A-Fa-f]+$/.test(cleaned)) return null;
        return BigInt('0x' + cleaned);
    },

    /**
     * Convert octal string to decimal
     */
    octToDec(octal) {
        if (!octal || octal === '') return 0n;
        const cleaned = octal.replace(/^0o/i, '').replace(/\s/g, '');
        if (!/^[0-7]+$/.test(cleaned)) return null;
        return BigInt('0o' + cleaned);
    },

    /**
     * Universal conversion function
     * @param {string} value - The value to convert
     * @param {number} fromBase - Source base (2, 8, 10, 16)
     * @param {number} toBase - Target base (2, 8, 10, 16)
     * @returns {string} Converted value
     */
    convert(value, fromBase, toBase) {
        let decimal;

        // Convert to decimal first
        switch (fromBase) {
            case 2:
                decimal = this.binToDec(value);
                break;
            case 8:
                decimal = this.octToDec(value);
                break;
            case 10:
                decimal = this.parseDec(value);
                break;
            case 16:
                decimal = this.hexToDec(value);
                break;
            default:
                return null;
        }

        if (decimal === null) return null;

        // Convert from decimal to target base
        switch (toBase) {
            case 2:
                return this.decToBin(decimal);
            case 8:
                return this.decToOct(decimal);
            case 10:
                return decimal.toString();
            case 16:
                return this.decToHex(decimal);
            default:
                return null;
        }
    },

    /**
     * Parse decimal string to BigInt
     */
    parseDec(value) {
        if (!value || value === '') return 0n;
        const cleaned = value.replace(/\s/g, '').replace(/,/g, '');
        if (!/^-?[0-9]+$/.test(cleaned)) return null;
        try {
            return BigInt(cleaned);
        } catch {
            return null;
        }
    },

    /**
     * Format binary with spaces every 4 or 8 bits
     */
    formatBinary(binary, groupSize = 4) {
        if (!binary) return '0';
        const reversed = binary.split('').reverse();
        const groups = [];

        for (let i = 0; i < reversed.length; i += groupSize) {
            groups.push(reversed.slice(i, i + groupSize).reverse().join(''));
        }

        return groups.reverse().join(' ');
    },

    /**
     * Pad binary to specific bit width
     */
    padBinary(binary, bitWidth) {
        if (!binary) binary = '0';
        if (binary.length >= bitWidth) {
            return binary.slice(-bitWidth);
        }
        return binary.padStart(bitWidth, '0');
    },

    /**
     * Get bit at specific position (0 = rightmost/LSB)
     */
    getBit(decimal, position) {
        const num = BigInt(decimal);
        return (num >> BigInt(position)) & 1n;
    },

    /**
     * Set bit at specific position
     */
    setBit(decimal, position, value) {
        const num = BigInt(decimal);
        const pos = BigInt(position);
        if (value) {
            return num | (1n << pos);
        } else {
            return num & ~(1n << pos);
        }
    },

    /**
     * Toggle bit at specific position
     */
    toggleBit(decimal, position) {
        const num = BigInt(decimal);
        const pos = BigInt(position);
        return num ^ (1n << pos);
    },

    /**
     * Count set bits (popcount)
     */
    countSetBits(decimal) {
        let num = BigInt(decimal);
        if (num < 0n) num = -num; // Handle negative
        let count = 0;
        while (num > 0n) {
            count += Number(num & 1n);
            num >>= 1n;
        }
        return count;
    },

    /**
     * Get bit length
     */
    bitLength(decimal) {
        const num = BigInt(decimal);
        if (num === 0n) return 1;
        if (num < 0n) return this.decToBin(num).length;
        return this.decToBin(num).length;
    },

    /**
     * Validate input for specific base
     */
    isValidForBase(value, base) {
        if (!value || value === '') return true;
        const cleaned = value.replace(/\s/g, '');

        switch (base) {
            case 2:
                return /^[01]+$/.test(cleaned);
            case 8:
                return /^[0-7]+$/.test(cleaned);
            case 10:
                return /^-?[0-9]+$/.test(cleaned);
            case 16:
                return /^[0-9A-Fa-f]+$/i.test(cleaned);
            default:
                return false;
        }
    },

    /**
     * Get max value for bit width
     */
    getMaxValue(bitWidth, signed = false) {
        if (signed) {
            return (1n << BigInt(bitWidth - 1)) - 1n;
        }
        return (1n << BigInt(bitWidth)) - 1n;
    },

    /**
     * Get min value for bit width (signed)
     */
    getMinValue(bitWidth) {
        return -(1n << BigInt(bitWidth - 1));
    }
};

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Converter;
}
