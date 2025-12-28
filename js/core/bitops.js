/**
 * BitForge - Bitwise Operations
 */

const BitOps = {
    /**
     * AND operation
     */
    and(a, b) {
        return BigInt(a) & BigInt(b);
    },

    /**
     * OR operation
     */
    or(a, b) {
        return BigInt(a) | BigInt(b);
    },

    /**
     * XOR operation
     */
    xor(a, b) {
        return BigInt(a) ^ BigInt(b);
    },

    /**
     * NOT operation (with bit width consideration)
     */
    not(a, bitWidth = 8) {
        const num = BigInt(a);
        const mask = (1n << BigInt(bitWidth)) - 1n;
        return (~num) & mask;
    },

    /**
     * NAND operation
     */
    nand(a, b, bitWidth = 8) {
        return this.not(this.and(a, b), bitWidth);
    },

    /**
     * NOR operation
     */
    nor(a, b, bitWidth = 8) {
        return this.not(this.or(a, b), bitWidth);
    },

    /**
     * XNOR operation
     */
    xnor(a, b, bitWidth = 8) {
        return this.not(this.xor(a, b), bitWidth);
    },

    /**
     * Left shift
     */
    shl(a, amount) {
        return BigInt(a) << BigInt(amount);
    },

    /**
     * Right shift (arithmetic)
     */
    shr(a, amount) {
        return BigInt(a) >> BigInt(amount);
    },

    /**
     * Right shift (logical/unsigned)
     */
    ushr(a, amount, bitWidth = 32) {
        const num = BigInt(a);
        const amt = BigInt(amount);
        const mask = (1n << BigInt(bitWidth)) - 1n;
        return (num & mask) >> amt;
    },

    /**
     * Rotate left
     */
    rol(a, amount, bitWidth = 8) {
        const num = BigInt(a);
        const bits = BigInt(bitWidth);
        const amt = BigInt(amount) % bits;
        const mask = (1n << bits) - 1n;
        const masked = num & mask;
        return ((masked << amt) | (masked >> (bits - amt))) & mask;
    },

    /**
     * Rotate right
     */
    ror(a, amount, bitWidth = 8) {
        const num = BigInt(a);
        const bits = BigInt(bitWidth);
        const amt = BigInt(amount) % bits;
        const mask = (1n << bits) - 1n;
        const masked = num & mask;
        return ((masked >> amt) | (masked << (bits - amt))) & mask;
    },

    /**
     * Perform operation by name
     */
    operate(opName, a, b = 0, bitWidth = 8, shiftAmount = 1) {
        const numA = BigInt(a);
        const numB = BigInt(b);

        switch (opName.toLowerCase()) {
            case 'and':
                return this.and(numA, numB);
            case 'or':
                return this.or(numA, numB);
            case 'xor':
                return this.xor(numA, numB);
            case 'not':
                return this.not(numA, bitWidth);
            case 'nand':
                return this.nand(numA, numB, bitWidth);
            case 'nor':
                return this.nor(numA, numB, bitWidth);
            case 'xnor':
                return this.xnor(numA, numB, bitWidth);
            case 'shl':
            case '<<':
                return this.shl(numA, shiftAmount);
            case 'shr':
            case '>>':
                return this.shr(numA, shiftAmount);
            case 'ushr':
            case '>>>':
                return this.ushr(numA, shiftAmount, bitWidth);
            case 'rol':
                return this.rol(numA, shiftAmount, bitWidth);
            case 'ror':
                return this.ror(numA, shiftAmount, bitWidth);
            default:
                throw new Error(`Unknown operation: ${opName}`);
        }
    },

    /**
     * Get operation symbol
     */
    getSymbol(opName) {
        const symbols = {
            'and': '&',
            'or': '|',
            'xor': '^',
            'not': '~',
            'nand': '⊼',
            'nor': '⊽',
            'xnor': '⊙',
            'shl': '<<',
            'shr': '>>',
            'ushr': '>>>',
            'rol': '↻',
            'ror': '↺'
        };
        return symbols[opName.toLowerCase()] || opName;
    },

    /**
     * Check if operation needs second operand
     */
    needsSecondOperand(opName) {
        const unaryOps = ['not', 'shl', 'shr', 'ushr', 'rol', 'ror'];
        return !unaryOps.includes(opName.toLowerCase());
    },

    /**
     * Check if operation is a shift/rotate operation
     */
    isShiftOperation(opName) {
        const shiftOps = ['shl', 'shr', 'ushr', 'rol', 'ror', '<<', '>>', '>>>'];
        return shiftOps.includes(opName.toLowerCase());
    },

    /**
     * Calculate Hamming distance (number of differing bits)
     */
    hammingDistance(a, b) {
        const xorResult = this.xor(a, b);
        return Converter.countSetBits(xorResult);
    },

    /**
     * Get bit array from number
     */
    toBitArray(num, bitWidth = 8) {
        const n = BigInt(num);
        const bits = [];
        for (let i = bitWidth - 1; i >= 0; i--) {
            bits.push(Number((n >> BigInt(i)) & 1n));
        }
        return bits;
    },

    /**
     * Create number from bit array
     */
    fromBitArray(bits) {
        let num = 0n;
        for (let i = 0; i < bits.length; i++) {
            if (bits[i]) {
                num |= (1n << BigInt(bits.length - 1 - i));
            }
        }
        return num;
    },

    /**
     * Visualize operation step by step
     * Returns array of intermediate states
     */
    visualizeOperation(opName, a, b, bitWidth = 8) {
        const bitsA = this.toBitArray(a, bitWidth);
        const bitsB = this.toBitArray(b, bitWidth);
        const result = this.operate(opName, a, b, bitWidth);
        const bitsResult = this.toBitArray(result, bitWidth);

        const steps = [];

        // For each bit position
        for (let i = 0; i < bitWidth; i++) {
            const step = {
                position: bitWidth - 1 - i,
                bitA: bitsA[i],
                bitB: bitsB[i],
                result: bitsResult[i],
                intermediateResult: this.toBitArray(result, bitWidth).slice(0, i + 1)
            };
            steps.push(step);
        }

        return {
            a: bitsA,
            b: bitsB,
            result: bitsResult,
            resultNum: result,
            steps: steps
        };
    }
};

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BitOps;
}
