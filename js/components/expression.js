/**
 * BitForge - Bitwise Expression Evaluator
 */

const Expression = {
    variables: { A: 170, B: 85, C: 15, D: 240 },

    /**
     * Initialize component
     */
    init() {
        this.setupEventListeners();
        this.updateVariableBinaries();
        this.evaluate();
        return true;
    },

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Variable inputs
        const varInputs = document.querySelectorAll('.variable-input');
        varInputs.forEach(input => {
            input.addEventListener('input', () => {
                const varName = input.dataset.var;
                const value = parseInt(input.value) || 0;
                this.variables[varName] = value;
                this.updateVariableBinary(input);
                this.evaluate();
            });
        });

        // Expression input
        const exprInput = document.getElementById('expression-input');
        if (exprInput) {
            exprInput.addEventListener('input', () => this.evaluate());
        }

        // Add variable button
        const addBtn = document.getElementById('add-variable');
        if (addBtn) {
            addBtn.addEventListener('click', () => this.addVariable());
        }
    },

    /**
     * Update individual variable binary display
     */
    updateVariableBinary(input) {
        const binaryEl = input.parentElement.querySelector('.variable-binary');
        if (binaryEl) {
            const value = parseInt(input.value) || 0;
            binaryEl.textContent = Converter.padBinary(Converter.decToBin(value), 8);
        }
    },

    /**
     * Update all variable binary displays
     */
    updateVariableBinaries() {
        const varInputs = document.querySelectorAll('.variable-input');
        varInputs.forEach(input => this.updateVariableBinary(input));
    },

    /**
     * Add new variable
     */
    addVariable() {
        const varList = document.getElementById('variable-list');
        if (!varList) return;

        // Find next available letter
        const existingVars = Object.keys(this.variables);
        const letters = 'EFGHIJKLMNOPQRSTUVWXYZ'.split('');
        const nextVar = letters.find(l => !existingVars.includes(l));

        if (!nextVar) return; // Max variables reached

        this.variables[nextVar] = 0;

        const varItem = DOM.create('div', { class: 'variable-item' }, [
            DOM.create('label', {}, [`${nextVar} =`]),
            DOM.create('input', {
                type: 'text',
                class: 'variable-input',
                dataset: { var: nextVar },
                value: '0'
            }),
            DOM.create('span', { class: 'variable-binary' }, ['00000000'])
        ]);

        // Add event listener
        const input = varItem.querySelector('.variable-input');
        input.addEventListener('input', () => {
            this.variables[nextVar] = parseInt(input.value) || 0;
            this.updateVariableBinary(input);
            this.evaluate();
        });

        varList.appendChild(varItem);
    },

    /**
     * Evaluate expression
     */
    evaluate() {
        const exprInput = document.getElementById('expression-input');
        if (!exprInput) return;

        const expr = exprInput.value;

        try {
            const result = this.parseAndEvaluate(expr);
            this.updateResult(result);
        } catch (e) {
            this.showError(e.message);
        }
    },

    /**
     * Parse and evaluate expression
     */
    parseAndEvaluate(expr) {
        // Replace variable names with values
        let processed = expr;

        // Sort by length descending to avoid partial replacements
        const varNames = Object.keys(this.variables).sort((a, b) => b.length - a.length);

        for (const varName of varNames) {
            const regex = new RegExp(`\\b${varName}\\b`, 'g');
            processed = processed.replace(regex, `(${this.variables[varName]})`);
        }

        // Replace operators
        processed = processed
            .replace(/\bAND\b/gi, '&')
            .replace(/\bOR\b/gi, '|')
            .replace(/\bXOR\b/gi, '^')
            .replace(/\bNOT\b/gi, '~')
            .replace(/\bSHL\b/gi, '<<')
            .replace(/\bSHR\b/gi, '>>');

        // Validate - only allow safe characters (including hex literals with 0x)
        if (!/^[\d\s\(\)\&\|\^\~\<\>xXaAbBcCdDeEfF]+$/.test(processed)) {
            throw new Error('Invalid expression');
        }

        // Evaluate using Function (safer than eval for numeric expressions)
        try {
            const fn = new Function(`return ${processed}`);
            const result = fn();

            if (typeof result !== 'number' || !Number.isFinite(result)) {
                throw new Error('Invalid result');
            }

            return Math.floor(result);
        } catch (e) {
            throw new Error('Evaluation failed');
        }
    },

    /**
     * Update result display
     */
    updateResult(result) {
        const decEl = document.getElementById('expr-result-dec');
        const binEl = document.getElementById('expr-result-bin');
        const hexEl = document.getElementById('expr-result-hex');

        if (decEl) decEl.textContent = result;
        if (binEl) binEl.textContent = Converter.padBinary(Converter.decToBin(Math.abs(result)), 8);
        if (hexEl) hexEl.textContent = '0x' + Converter.decToHex(result < 0 ? result >>> 0 : result);

        // Clear error styling
        const exprInput = document.getElementById('expression-input');
        if (exprInput) {
            exprInput.style.borderColor = '';
        }
    },

    /**
     * Show error
     */
    showError(message) {
        const exprInput = document.getElementById('expression-input');
        if (exprInput) {
            exprInput.style.borderColor = 'var(--accent-danger)';
        }

        const decEl = document.getElementById('expr-result-dec');
        if (decEl) {
            decEl.textContent = 'Error';
        }
    },

    /**
     * Get current variables
     */
    getVariables() {
        return { ...this.variables };
    },

    /**
     * Set variable
     */
    setVariable(name, value) {
        this.variables[name] = value;

        const input = document.querySelector(`.variable-input[data-var="${name}"]`);
        if (input) {
            input.value = value;
            this.updateVariableBinary(input);
        }

        this.evaluate();
    }
};

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Expression;
}
