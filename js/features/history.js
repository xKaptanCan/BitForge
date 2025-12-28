/**
 * BitForge - History & Favorites
 */

const History = {
    maxHistory: 50,
    history: [],
    favorites: [],

    /**
     * Initialize history component
     */
    init() {
        this.load();
        this.setupEventListeners();
        this.render();
        return true;
    },

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // History toggle button
        const historyToggle = document.getElementById('history-toggle');
        if (historyToggle) {
            historyToggle.addEventListener('click', () => this.togglePanel());
        }

        // Close panel button
        const closeBtn = document.getElementById('close-history');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closePanel());
        }

        // Clear history button
        const clearBtn = document.getElementById('clear-history');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => this.clear());
        }

        // Tab buttons
        const tabBtns = document.querySelectorAll('.history-tab');
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.render(btn.dataset.tab);
            });
        });
    },

    /**
     * Toggle panel visibility
     */
    togglePanel() {
        const panel = document.getElementById('history-panel');
        if (panel) {
            panel.classList.toggle('active');
        }
    },

    /**
     * Close panel
     */
    closePanel() {
        const panel = document.getElementById('history-panel');
        if (panel) {
            panel.classList.remove('active');
        }
    },

    /**
     * Add entry to history
     */
    add(entry) {
        const item = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            value: entry.value,
            decimal: entry.decimal,
            binary: entry.binary,
            hex: entry.hex,
            type: entry.type || 'conversion'
        };

        // Remove duplicate if exists
        this.history = this.history.filter(h => h.decimal !== item.decimal);

        // Add to beginning
        this.history.unshift(item);

        // Limit history size
        if (this.history.length > this.maxHistory) {
            this.history.pop();
        }

        this.save();
        this.render();
    },

    /**
     * Toggle favorite status
     */
    toggleFavorite(id) {
        const item = this.history.find(h => h.id === id);
        if (!item) return;

        const favIndex = this.favorites.findIndex(f => f.id === id);

        if (favIndex >= 0) {
            this.favorites.splice(favIndex, 1);
        } else {
            this.favorites.push({ ...item });
        }

        this.save();
        this.render();
    },

    /**
     * Check if item is favorite
     */
    isFavorite(id) {
        return this.favorites.some(f => f.id === id);
    },

    /**
     * Remove from history
     */
    remove(id) {
        this.history = this.history.filter(h => h.id !== id);
        this.favorites = this.favorites.filter(f => f.id !== id);
        this.save();
        this.render();
    },

    /**
     * Clear all history
     */
    clear() {
        this.history = [];
        this.save();
        this.render();
    },

    /**
     * Clear favorites
     */
    clearFavorites() {
        this.favorites = [];
        this.save();
        this.render();
    },

    /**
     * Render history list
     */
    render(tab = 'history') {
        const list = document.getElementById('history-list');
        if (!list) return;

        DOM.clear(list);

        const items = tab === 'favorites' ? this.favorites : this.history;

        if (items.length === 0) {
            const emptyMsg = DOM.create('div', { class: 'history-empty' }, [
                tab === 'favorites' ? 'No favorites yet' : 'No history yet'
            ]);
            list.appendChild(emptyMsg);
            return;
        }

        items.forEach(item => {
            const historyItem = DOM.create('div', { class: 'history-item' }, [
                DOM.create('span', { class: 'history-value' }, [
                    `${item.decimal} (0x${item.hex})`
                ]),
                DOM.create('button', {
                    class: `history-fav ${this.isFavorite(item.id) ? 'active' : ''}`,
                    dataset: { id: item.id }
                }, [this.isFavorite(item.id) ? '⭐' : '☆'])
            ]);

            // Click to restore
            historyItem.addEventListener('click', (e) => {
                if (!e.target.classList.contains('history-fav')) {
                    this.restore(item);
                }
            });

            // Favorite button
            const favBtn = historyItem.querySelector('.history-fav');
            favBtn.addEventListener('click', () => {
                this.toggleFavorite(item.id);
            });

            list.appendChild(historyItem);
        });
    },

    /**
     * Restore a history item
     */
    restore(item) {
        // Update converter inputs
        const decInput = document.getElementById('dec-input');
        if (decInput) {
            decInput.value = item.decimal;
            decInput.dispatchEvent(new Event('input'));
        }

        // Close panel
        this.closePanel();
    },

    /**
     * Save to localStorage
     */
    save() {
        Storage.set('history', this.history);
        Storage.set('favorites', this.favorites);
    },

    /**
     * Load from localStorage
     */
    load() {
        this.history = Storage.get('history', []);
        this.favorites = Storage.get('favorites', []);
    },

    /**
     * Get history
     */
    getHistory() {
        return [...this.history];
    },

    /**
     * Get favorites
     */
    getFavorites() {
        return [...this.favorites];
    }
};

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = History;
}
