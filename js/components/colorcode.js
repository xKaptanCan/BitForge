/**
 * BitForge - Color Code Analyzer
 */

const ColorCode = {
    /**
     * Initialize component
     */
    init() {
        this.setupEventListeners();
        this.analyze('#3B82F6');
        return true;
    },

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        const colorInput = document.getElementById('color-input');
        const colorPicker = document.getElementById('color-picker');

        if (colorInput) {
            colorInput.addEventListener('input', () => {
                const color = colorInput.value;
                if (this.isValidHex(color)) {
                    this.analyze(color);
                    if (colorPicker) colorPicker.value = this.normalizeHex(color);
                }
            });
        }

        if (colorPicker) {
            colorPicker.addEventListener('input', () => {
                const color = colorPicker.value;
                this.analyze(color);
                if (colorInput) colorInput.value = color.toUpperCase();
            });
        }

        // Copy buttons
        const copyBtns = document.querySelectorAll('.color-container .copy-btn');
        copyBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const reprItem = btn.closest('.repr-item');
                const value = reprItem?.querySelector('.repr-value')?.textContent;
                if (value) {
                    DOM.copyToClipboard(value);
                    btn.textContent = '✓';
                    btn.classList.add('copy-success');
                    setTimeout(() => {
                        btn.textContent = '📋';
                        btn.classList.remove('copy-success');
                    }, 1000);
                }
            });
        });
    },

    /**
     * Analyze color
     */
    analyze(hex) {
        const rgb = this.hexToRgb(hex);
        if (!rgb) return;

        const hsl = this.rgbToHsl(rgb.r, rgb.g, rgb.b);

        this.updateDisplay(hex, rgb, hsl);
    },

    /**
     * Convert hex to RGB
     */
    hexToRgb(hex) {
        const normalized = this.normalizeHex(hex);
        if (!normalized) return null;

        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(normalized);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    },

    /**
     * Normalize hex color
     */
    normalizeHex(hex) {
        let cleaned = hex.replace('#', '');

        // Handle 3-character hex
        if (cleaned.length === 3) {
            cleaned = cleaned.split('').map(c => c + c).join('');
        }

        if (cleaned.length !== 6) return null;
        if (!/^[0-9A-Fa-f]{6}$/.test(cleaned)) return null;

        return '#' + cleaned.toUpperCase();
    },

    /**
     * Validate hex color
     */
    isValidHex(hex) {
        return /^#?([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(hex);
    },

    /**
     * Convert RGB to HSL
     */
    rgbToHsl(r, g, b) {
        r /= 255;
        g /= 255;
        b /= 255;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

            switch (max) {
                case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
                case g: h = ((b - r) / d + 2) / 6; break;
                case b: h = ((r - g) / d + 4) / 6; break;
            }
        }

        return {
            h: Math.round(h * 360),
            s: Math.round(s * 100),
            l: Math.round(l * 100)
        };
    },

    /**
     * Update display
     */
    updateDisplay(hex, rgb, hsl) {
        const normalizedHex = this.normalizeHex(hex);

        // Update preview
        const preview = document.getElementById('color-preview');
        if (preview) preview.style.background = normalizedHex;

        // Update channel values
        this.updateChannel('r', rgb.r);
        this.updateChannel('g', rgb.g);
        this.updateChannel('b', rgb.b);

        // Update representations
        const hexEl = document.getElementById('color-hex');
        const rgbEl = document.getElementById('color-rgb');
        const hslEl = document.getElementById('color-hsl');
        const binaryEl = document.getElementById('color-binary');

        if (hexEl) hexEl.textContent = normalizedHex;
        if (rgbEl) rgbEl.textContent = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
        if (hslEl) hslEl.textContent = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
        if (binaryEl) {
            const rBin = Converter.padBinary(Converter.decToBin(rgb.r), 8);
            const gBin = Converter.padBinary(Converter.decToBin(rgb.g), 8);
            const bBin = Converter.padBinary(Converter.decToBin(rgb.b), 8);
            binaryEl.textContent = `${rBin} ${gBin} ${bBin}`;
        }
    },

    /**
     * Update channel display
     */
    updateChannel(channel, value) {
        const valueEl = document.getElementById(`color-${channel}`);
        const barEl = document.getElementById(`color-${channel}-bar`);
        const binEl = document.getElementById(`color-${channel}-bin`);

        if (valueEl) valueEl.textContent = value;
        if (barEl) barEl.style.width = `${(value / 255) * 100}%`;
        if (binEl) binEl.textContent = Converter.padBinary(Converter.decToBin(value), 8);
    },

    /**
     * Generate random color
     */
    randomColor() {
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);

        const hex = '#' + [r, g, b].map(c => c.toString(16).padStart(2, '0')).join('').toUpperCase();

        this.analyze(hex);

        const colorInput = document.getElementById('color-input');
        const colorPicker = document.getElementById('color-picker');
        if (colorInput) colorInput.value = hex;
        if (colorPicker) colorPicker.value = hex;

        return hex;
    }
};

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ColorCode;
}
