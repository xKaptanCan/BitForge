/**
 * BitForge - Main Application
 * Binary/Hex/Decimal Converter & Bit Manipulation Visualizer
 */

const App = {
    currentSection: 'converter',
    theme: 'dark',

    /**
     * Initialize the application
     */
    init() {
        console.log('🔧 BitForge initializing...');

        // Load saved preferences
        this.loadPreferences();

        // Initialize i18n
        I18n.init();

        // Initialize components
        this.initComponents();

        // Setup event listeners
        this.setupEventListeners();

        // Setup keyboard shortcuts
        this.setupKeyboardShortcuts();

        // Initialize bit grid with default value
        BitGrid.init('bitgrid');
        BitGrid.onChange((value, bitWidth) => {
            this.onBitGridChange(value, bitWidth);
        });

        console.log('✅ BitForge ready!');
    },

    /**
     * Load saved preferences
     */
    loadPreferences() {
        this.theme = Storage.get('theme', 'dark');
        document.documentElement.setAttribute('data-theme', this.theme);
    },

    /**
     * Initialize all components
     */
    initComponents() {
        // Initialize all feature modules
        Operations.init();
        IEEE754.init();
        TwosComplement.init();
        Expression.init();
        ColorCode.init();
        ASCIITable.init();
        Comparison.init();
        BitDance.init();
        BinaryMusic.init();
        History.init();
    },

    /**
     * Setup global event listeners
     */
    setupEventListeners() {
        // Navigation
        const navLinks = document.querySelectorAll('.nav-link[data-section], .dropdown-item[data-section]');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.dataset.section;
                this.showSection(section);

                // Update active state
                document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                const mainNavLink = document.querySelector(`.nav-link[data-section="${section}"]`);
                if (mainNavLink) mainNavLink.classList.add('active');
            });
        });

        // Theme toggle
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }

        // Language selector
        const langOptions = document.querySelectorAll('.lang-option');
        langOptions.forEach(option => {
            option.addEventListener('click', () => {
                I18n.setLanguage(option.dataset.lang);
            });
        });

        // Converter inputs
        this.setupConverterInputs();

        // Copy buttons
        this.setupCopyButtons();

        // Shortcuts modal
        const shortcutsBtn = document.getElementById('keyboard-shortcuts');
        const shortcutsModal = document.getElementById('shortcuts-modal');
        const closeShortcuts = document.getElementById('close-shortcuts');

        if (shortcutsBtn && shortcutsModal) {
            shortcutsBtn.addEventListener('click', () => {
                shortcutsModal.classList.add('active');
            });
        }

        if (closeShortcuts && shortcutsModal) {
            closeShortcuts.addEventListener('click', () => {
                shortcutsModal.classList.remove('active');
            });
        }

        // Close modal on backdrop click
        if (shortcutsModal) {
            shortcutsModal.addEventListener('click', (e) => {
                if (e.target === shortcutsModal) {
                    shortcutsModal.classList.remove('active');
                }
            });
        }
    },

    /**
     * Setup converter input handlers
     */
    setupConverterInputs() {
        const inputs = {
            'dec-input': 10,
            'bin-input': 2,
            'hex-input': 16,
            'oct-input': 8
        };

        Object.entries(inputs).forEach(([id, base]) => {
            const input = document.getElementById(id);
            if (input) {
                input.addEventListener('input', () => {
                    this.onConverterInput(input.value, base);
                });

                // Select all on focus
                input.addEventListener('focus', () => {
                    input.select();
                });
            }
        });
    },

    /**
     * Handle converter input change
     */
    onConverterInput(value, fromBase) {
        if (!value || value === '') {
            this.updateAllInputs(0n);
            return;
        }

        // Validate input
        if (!Converter.isValidForBase(value, fromBase)) {
            return;
        }

        // Convert to decimal
        let decimal;
        switch (fromBase) {
            case 2:
                decimal = Converter.binToDec(value);
                break;
            case 8:
                decimal = Converter.octToDec(value);
                break;
            case 10:
                decimal = Converter.parseDec(value);
                break;
            case 16:
                decimal = Converter.hexToDec(value);
                break;
        }

        if (decimal === null) return;

        this.updateAllInputs(decimal, fromBase);

        // Update bit grid
        BitGrid.setValue(decimal);

        // Add to history (debounced)
        this.addToHistoryDebounced(decimal);
    },

    /**
     * Update all converter inputs
     */
    updateAllInputs(decimal, skipBase = null) {
        const inputs = {
            'dec-input': { base: 10, value: decimal.toString() },
            'bin-input': { base: 2, value: Converter.decToBin(decimal) },
            'hex-input': { base: 16, value: Converter.decToHex(decimal) },
            'oct-input': { base: 8, value: Converter.decToOct(decimal) }
        };

        Object.entries(inputs).forEach(([id, data]) => {
            if (data.base !== skipBase) {
                const input = document.getElementById(id);
                if (input) {
                    input.value = data.value;
                }
            }
        });
    },

    /**
     * Handle bit grid change
     */
    onBitGridChange(value, bitWidth) {
        this.updateAllInputs(value);

        // Update music value
        BinaryMusic.setValue(value, bitWidth);
    },

    /**
     * Debounced add to history
     */
    addToHistoryDebounced: DOM.debounce((decimal) => {
        History.add({
            value: decimal.toString(),
            decimal: decimal.toString(),
            binary: Converter.decToBin(decimal),
            hex: Converter.decToHex(decimal),
            type: 'conversion'
        });
    }, 1000),

    /**
     * Show section
     */
    showSection(sectionId) {
        // Hide all sections
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('section-active');
        });

        // Show target section
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('section-active');
        }

        this.currentSection = sectionId;

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    /**
     * Toggle theme
     */
    toggleTheme() {
        this.theme = this.theme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', this.theme);
        Storage.set('theme', this.theme);
    },

    /**
     * Setup copy buttons
     */
    setupCopyButtons() {
        const copyBtns = document.querySelectorAll('.converter-card .copy-btn');
        copyBtns.forEach(btn => {
            btn.addEventListener('click', async () => {
                const card = btn.closest('.converter-card');
                const input = card?.querySelector('.converter-input');
                if (input && input.value) {
                    const success = await DOM.copyToClipboard(input.value);
                    if (success) {
                        btn.textContent = '✓';
                        btn.classList.add('copy-success');
                        setTimeout(() => {
                            btn.textContent = '📋';
                            btn.classList.remove('copy-success');
                        }, 1000);
                    }
                }
            });
        });
    },

    /**
     * Setup keyboard shortcuts
     */
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Check for Ctrl/Cmd key
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case '1':
                        e.preventDefault();
                        document.getElementById('dec-input')?.focus();
                        break;
                    case '2':
                        e.preventDefault();
                        document.getElementById('bin-input')?.focus();
                        break;
                    case '3':
                        e.preventDefault();
                        document.getElementById('hex-input')?.focus();
                        break;
                    case '4':
                        e.preventDefault();
                        document.getElementById('oct-input')?.focus();
                        break;
                    case 'b':
                        e.preventDefault();
                        this.showSection('converter');
                        break;
                    case 'm':
                        e.preventDefault();
                        BinaryMusic.togglePanel();
                        break;
                    case 'h':
                        e.preventDefault();
                        History.togglePanel();
                        break;
                    case 'k':
                        e.preventDefault();
                        document.getElementById('shortcuts-modal')?.classList.add('active');
                        break;
                }
            }

            // Escape key
            if (e.key === 'Escape') {
                // Close modals and panels
                document.getElementById('shortcuts-modal')?.classList.remove('active');
                document.getElementById('music-panel')?.classList.remove('active');
                document.getElementById('history-panel')?.classList.remove('active');
            }
        });
    },

    /**
     * Get current value
     */
    getCurrentValue() {
        const decInput = document.getElementById('dec-input');
        return decInput ? BigInt(decInput.value || 0) : 0n;
    }
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = App;
}
