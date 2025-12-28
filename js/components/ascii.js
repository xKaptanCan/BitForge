/**
 * BitForge - ASCII/Unicode Table
 */

const ASCIITable = {
    filter: 'all',
    searchTerm: '',

    // Control character names
    controlNames: {
        0: 'NUL', 1: 'SOH', 2: 'STX', 3: 'ETX', 4: 'EOT', 5: 'ENQ', 6: 'ACK', 7: 'BEL',
        8: 'BS', 9: 'TAB', 10: 'LF', 11: 'VT', 12: 'FF', 13: 'CR', 14: 'SO', 15: 'SI',
        16: 'DLE', 17: 'DC1', 18: 'DC2', 19: 'DC3', 20: 'DC4', 21: 'NAK', 22: 'SYN', 23: 'ETB',
        24: 'CAN', 25: 'EM', 26: 'SUB', 27: 'ESC', 28: 'FS', 29: 'GS', 30: 'RS', 31: 'US',
        127: 'DEL'
    },

    /**
     * Initialize component
     */
    init() {
        this.setupEventListeners();
        this.render();
        return true;
    },

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Search input
        const searchInput = document.getElementById('ascii-search');
        if (searchInput) {
            searchInput.addEventListener('input', DOM.debounce(() => {
                this.searchTerm = searchInput.value.toLowerCase();
                this.render();
            }, 200));
        }

        // Filter buttons
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.filter = btn.dataset.filter;
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.render();
            });
        });

        // Character input
        const charInput = document.getElementById('ascii-char');
        if (charInput) {
            charInput.addEventListener('input', () => {
                const char = charInput.value;
                if (char.length > 0) {
                    this.updateCharInfo(char.charCodeAt(0));
                }
            });
        }
    },

    /**
     * Get characters based on filter
     */
    getCharacters() {
        let chars = [];

        switch (this.filter) {
            case 'control':
                // 0-31 and 127
                for (let i = 0; i <= 31; i++) chars.push(i);
                chars.push(127);
                break;
            case 'printable':
                // 32-126
                for (let i = 32; i <= 126; i++) chars.push(i);
                break;
            case 'extended':
                // 128-255
                for (let i = 128; i <= 255; i++) chars.push(i);
                break;
            default:
                // All 0-255
                for (let i = 0; i <= 255; i++) chars.push(i);
        }

        // Apply search filter
        if (this.searchTerm) {
            chars = chars.filter(code => {
                const char = this.getDisplayChar(code);
                const charMatch = char.toLowerCase().includes(this.searchTerm);
                const codeMatch = code.toString().includes(this.searchTerm);
                const hexMatch = code.toString(16).toLowerCase().includes(this.searchTerm);
                const nameMatch = (this.controlNames[code] || '').toLowerCase().includes(this.searchTerm);
                return charMatch || codeMatch || hexMatch || nameMatch;
            });
        }

        return chars;
    },

    /**
     * Get display character
     */
    getDisplayChar(code) {
        if (code < 32 || code === 127) {
            return this.controlNames[code] || '?';
        }
        return String.fromCharCode(code);
    },

    /**
     * Render the table
     */
    render() {
        const table = document.getElementById('ascii-table');
        if (!table) return;

        DOM.clear(table);

        const chars = this.getCharacters();

        chars.forEach(code => {
            const displayChar = this.getDisplayChar(code);
            const isControl = code < 32 || code === 127;

            const cell = DOM.create('div', {
                class: `ascii-cell ${isControl ? 'control' : ''}`,
                dataset: { code: code }
            }, [
                DOM.create('span', { class: 'ascii-char' }, [displayChar]),
                DOM.create('span', { class: 'ascii-code' }, [code.toString()])
            ]);

            cell.addEventListener('click', () => {
                this.selectCharacter(code);
            });

            table.appendChild(cell);
        });
    },

    /**
     * Select a character
     */
    selectCharacter(code) {
        this.updateCharInfo(code);

        const charInput = document.getElementById('ascii-char');
        if (charInput && code >= 32 && code !== 127) {
            charInput.value = String.fromCharCode(code);
        }

        // Highlight selected cell
        const cells = document.querySelectorAll('.ascii-cell');
        cells.forEach(cell => cell.classList.remove('selected'));

        const selectedCell = document.querySelector(`.ascii-cell[data-code="${code}"]`);
        if (selectedCell) {
            selectedCell.classList.add('selected');
        }
    },

    /**
     * Update character info display
     */
    updateCharInfo(code) {
        const decEl = document.getElementById('ascii-dec');
        const hexEl = document.getElementById('ascii-hex');
        const binEl = document.getElementById('ascii-bin');
        const octEl = document.getElementById('ascii-oct');

        if (decEl) decEl.textContent = code;
        if (hexEl) hexEl.textContent = code.toString(16).toUpperCase().padStart(2, '0');
        if (binEl) binEl.textContent = Converter.padBinary(Converter.decToBin(code), 8);
        if (octEl) octEl.textContent = code.toString(8);
    },

    /**
     * Get character info
     */
    getCharInfo(code) {
        return {
            char: this.getDisplayChar(code),
            decimal: code,
            hex: code.toString(16).toUpperCase(),
            binary: Converter.padBinary(Converter.decToBin(code), 8),
            octal: code.toString(8),
            isControl: code < 32 || code === 127,
            name: this.controlNames[code] || null
        };
    }
};

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ASCIITable;
}
