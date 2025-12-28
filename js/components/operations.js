/**
 * BitForge - Operations Visualizer Component
 */

const Operations = {
    inputA: null,
    inputB: null,
    bitsA: null,
    bitsB: null,
    currentOp: 'and',
    bitWidth: 8,
    isAnimating: false,

    /**
     * Initialize operations component
     */
    init() {
        this.inputA = document.getElementById('op-input-a');
        this.inputB = document.getElementById('op-input-b');
        this.bitsA = document.getElementById('op-bits-a');
        this.bitsB = document.getElementById('op-bits-b');

        this.setupEventListeners();
        this.update();
        return true;
    },

    /**
     * Set up event listeners
     */
    setupEventListeners() {
        // Input changes
        if (this.inputA) {
            this.inputA.addEventListener('input', () => this.update());
        }
        if (this.inputB) {
            this.inputB.addEventListener('input', () => this.update());
        }

        // Operation buttons
        const opBtns = document.querySelectorAll('.op-btn');
        opBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.setOperation(btn.dataset.op);
                opBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });

        // Animate button
        const animateBtn = document.getElementById('animate-operation');
        if (animateBtn) {
            animateBtn.addEventListener('click', () => this.animate());
        }
    },

    /**
     * Set current operation
     */
    setOperation(op) {
        this.currentOp = op;

        // Show/hide second input based on operation
        const inputBGroup = document.getElementById('op-input-b-group');
        if (inputBGroup) {
            if (BitOps.needsSecondOperand(op)) {
                inputBGroup.style.display = '';
            } else {
                inputBGroup.style.display = 'none';
            }
        }

        // Update symbol
        const symbolEl = document.getElementById('op-symbol');
        if (symbolEl) {
            symbolEl.textContent = BitOps.getSymbol(op);
        }

        this.update();
    },

    /**
     * Update visualization
     */
    update() {
        const valueA = parseInt(this.inputA?.value) || 0;
        const valueB = parseInt(this.inputB?.value) || 0;

        // Update binary displays
        if (this.bitsA) {
            this.bitsA.textContent = Converter.padBinary(Converter.decToBin(valueA), this.bitWidth);
        }
        if (this.bitsB) {
            this.bitsB.textContent = Converter.padBinary(Converter.decToBin(valueB), this.bitWidth);
        }

        // Calculate result
        let result;
        if (BitOps.isShiftOperation(this.currentOp)) {
            result = BitOps.operate(this.currentOp, valueA, valueB, this.bitWidth, 1);
        } else {
            result = BitOps.operate(this.currentOp, valueA, valueB, this.bitWidth);
        }

        // Update result display
        const resultDec = document.getElementById('op-result-dec');
        const resultHex = document.getElementById('op-result-hex');
        if (resultDec) resultDec.textContent = result.toString();
        if (resultHex) resultHex.textContent = '0x' + Converter.decToHex(result);

        // Update visualizer
        this.renderVisualizer(valueA, valueB, result);
    },

    /**
     * Render the visualizer grid
     */
    renderVisualizer(valueA, valueB, result) {
        const rowA = document.getElementById('vis-row-a');
        const rowB = document.getElementById('vis-row-b');
        const rowResult = document.getElementById('vis-row-result');

        if (!rowA || !rowB || !rowResult) return;

        const bitsA = BitOps.toBitArray(valueA, this.bitWidth);
        const bitsB = BitOps.toBitArray(valueB, this.bitWidth);
        const bitsResult = BitOps.toBitArray(result, this.bitWidth);

        // Render row A
        DOM.clear(rowA);
        bitsA.forEach((bit, i) => {
            const bitEl = DOM.create('div', {
                class: 'vis-bit',
                dataset: { value: bit, position: this.bitWidth - 1 - i }
            }, [bit.toString()]);
            rowA.appendChild(bitEl);
        });

        // Render row B (if needed)
        DOM.clear(rowB);
        if (BitOps.needsSecondOperand(this.currentOp)) {
            rowB.style.display = '';
            bitsB.forEach((bit, i) => {
                const bitEl = DOM.create('div', {
                    class: 'vis-bit',
                    dataset: { value: bit, position: this.bitWidth - 1 - i }
                }, [bit.toString()]);
                rowB.appendChild(bitEl);
            });
        } else {
            rowB.style.display = 'none';
        }

        // Render result row
        DOM.clear(rowResult);
        bitsResult.forEach((bit, i) => {
            const bitEl = DOM.create('div', {
                class: 'vis-bit',
                dataset: { value: bit, position: this.bitWidth - 1 - i }
            }, [bit.toString()]);
            rowResult.appendChild(bitEl);
        });
    },

    /**
     * Animate the operation step by step
     */
    async animate() {
        if (this.isAnimating) return;
        this.isAnimating = true;

        const valueA = parseInt(this.inputA?.value) || 0;
        const valueB = parseInt(this.inputB?.value) || 0;

        const vis = BitOps.visualizeOperation(this.currentOp, valueA, valueB, this.bitWidth);

        const rowA = document.getElementById('vis-row-a');
        const rowB = document.getElementById('vis-row-b');
        const rowResult = document.getElementById('vis-row-result');

        // Clear result first
        const resultBits = rowResult.querySelectorAll('.vis-bit');
        resultBits.forEach(bit => {
            bit.textContent = '?';
            bit.dataset.value = '?';
            bit.classList.remove('op-result-animate');
        });

        // Animate each bit
        for (let i = 0; i < this.bitWidth; i++) {
            await this.delay(100);

            // Highlight current column
            const bitA = rowA.children[i];
            const bitB = rowB.children[i];
            const bitResult = rowResult.children[i];

            if (bitA) bitA.classList.add('op-animate');
            if (bitB && BitOps.needsSecondOperand(this.currentOp)) {
                bitB.classList.add('op-animate');
            }

            await this.delay(150);

            // Show result for this bit
            if (bitResult) {
                bitResult.textContent = vis.result[i].toString();
                bitResult.dataset.value = vis.result[i];
                bitResult.classList.add('op-result-animate');
            }

            // Remove highlight
            if (bitA) bitA.classList.remove('op-animate');
            if (bitB) bitB.classList.remove('op-animate');
        }

        // Play completion sound
        if (typeof AudioUtils !== 'undefined' && AudioUtils.playSuccess) {
            AudioUtils.playSuccess();
        }

        this.isAnimating = false;
    },

    /**
     * Delay helper
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },

    /**
     * Set bit width
     */
    setBitWidth(width) {
        this.bitWidth = width;
        this.update();
    }
};

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Operations;
}
