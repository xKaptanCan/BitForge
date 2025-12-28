/**
 * BitForge - Internationalization (i18n)
 * Supports 10 Languages: TR, EN, ES, ZH, HI, AR, PT, RU, JA, DE, FR
 */

const I18n = {
    currentLang: 'en',

    // Language metadata
    languages: {
        en: { name: 'English', flag: '🇬🇧', dir: 'ltr' },
        tr: { name: 'Türkçe', flag: '🇹🇷', dir: 'ltr' },
        es: { name: 'Español', flag: '🇪🇸', dir: 'ltr' },
        zh: { name: '中文', flag: '🇨🇳', dir: 'ltr' },
        hi: { name: 'हिन्दी', flag: '🇮🇳', dir: 'ltr' },
        ar: { name: 'العربية', flag: '🇸🇦', dir: 'rtl' },
        pt: { name: 'Português', flag: '🇧🇷', dir: 'ltr' },
        ru: { name: 'Русский', flag: '🇷🇺', dir: 'ltr' },
        ja: { name: '日本語', flag: '🇯🇵', dir: 'ltr' },
        de: { name: 'Deutsch', flag: '🇩🇪', dir: 'ltr' },
        fr: { name: 'Français', flag: '🇫🇷', dir: 'ltr' }
    },

    // Translation data - will be populated from language files
    data: {
        tr: {
            'nav.converter': 'Dönüştürücü',
            'nav.operations': 'İşlemler',
            'nav.ieee754': 'IEEE 754',
            'nav.twos': "Two's Comp",
            'nav.expression': 'İfade',
            'nav.more': 'Daha Fazla',
            'nav.color': 'Renk Kodu',
            'nav.ascii': 'ASCII Tablosu',
            'nav.comparison': 'Karşılaştırma',
            'converter.title': 'Sayı Dönüştürücü',
            'converter.subtitle': 'Binary, Decimal, Hexadecimal ve Octal arasında dönüştürün',
            'converter.decimal': 'Onluk',
            'converter.binary': 'İkilik',
            'converter.hexadecimal': 'Onaltılık',
            'converter.octal': 'Sekizlik',
            'bitgrid.title': 'İnteraktif Bit Izgarası',
            'bitgrid.clear': 'Tümünü Temizle',
            'bitgrid.setBits': 'Aktif bitler:',
            'bitgrid.maxValue': 'Maksimum değer:',
            'operations.title': 'Bit İşlemleri',
            'operations.subtitle': 'Bitwise işlemleri adım adım görselleştirin',
            'operations.result': 'Sonuç',
            'operations.animate': '▶ Animasyonlu Göster',
            'ieee754.title': 'IEEE 754 Kayan Nokta',
            'ieee754.subtitle': 'Kayan nokta sayılarının binary gösterimini analiz edin',
            'ieee754.float': 'Float (32-bit)',
            'ieee754.double': 'Double (64-bit)',
            'ieee754.sign': 'İşaret',
            'ieee754.exponent': 'Üs',
            'ieee754.mantissa': 'Mantis',
            'ieee754.signValue': 'İşaret:',
            'ieee754.exponentValue': 'Üs:',
            'ieee754.mantissaValue': 'Mantis:',
            'ieee754.formula': 'Formül:',
            'ieee754.specialValues': 'Özel Değerler',
            'twos.title': "Two's Complement",
            'twos.subtitle': 'İşaretli tam sayı gösterimini anlayın',
            'twos.originalBinary': 'Orijinal Binary (|n|):',
            'twos.inverted': 'Terslenmiş (NOT):',
            'twos.addOne': '1 Ekle:',
            'twos.decimalValue': 'Onluk Değer:',
            'twos.hexValue': 'Hex Değer:',
            'twos.range': 'Aralık:',
            'expression.title': 'Bitwise İfade Değerlendirici',
            'expression.subtitle': 'Karmaşık bitwise ifadeleri değerlendirin',
            'expression.variables': 'Değişkenler',
            'expression.addVariable': '+ Değişken Ekle',
            'expression.result': 'Sonuç',
            'color.title': 'Renk Kodu Analizörü',
            'color.subtitle': 'Renk kodlarını binary ve hexadecimal olarak analiz edin',
            'ascii.title': 'ASCII / Unicode Tablosu',
            'ascii.subtitle': 'Karakter kodlarını arayın ve görüntüleyin',
            'ascii.searchPlaceholder': 'Karakter veya kod ara...',
            'ascii.all': 'Tümü',
            'ascii.control': 'Kontrol',
            'ascii.printable': 'Yazdırılabilir',
            'ascii.extended': 'Genişletilmiş',
            'ascii.character': 'Karakter:',
            'comparison.title': 'Karşılaştırma Modu',
            'comparison.subtitle': 'İki sayıyı bit bit karşılaştırın',
            'comparison.valueA': 'Değer A',
            'comparison.valueB': 'Değer B',
            'comparison.diff': 'Fark',
            'comparison.hamming': 'Hamming Mesafesi',
            'comparison.bitsDifferent': 'bit farklı',
            'comparison.similarity': 'Benzerlik',
            'music.title': '🎵 Binary Müzik',
            'music.play': '▶ Çal',
            'music.stop': '⏹ Durdur',
            'music.loop': '🔁 Döngü',
            'music.tempo': 'Tempo:',
            'music.wave': 'Dalga:',
            'music.volume': 'Ses:',
            'history.title': '📜 Geçmiş',
            'history.recent': 'Son İşlemler',
            'history.favorites': '⭐ Favoriler',
            'history.clear': 'Geçmişi Temizle',
            'shortcuts.title': '⌨️ Klavye Kısayolları',
            'shortcuts.focusDec': 'Decimal girişine odaklan',
            'shortcuts.focusBin': 'Binary girişine odaklan',
            'shortcuts.focusHex': 'Hexadecimal girişine odaklan',
            'shortcuts.focusOct': 'Octal girişine odaklan',
            'shortcuts.toggleBitgrid': 'Bit Izgarasını Aç/Kapat',
            'shortcuts.toggleMusic': 'Binary Müziği Aç/Kapat',
            'shortcuts.toggleHistory': 'Geçmişi Aç/Kapat',
            'shortcuts.showShortcuts': 'Kısayolları Göster',
            'shortcuts.closeModal': 'Modal/Panel Kapat',
            'common.copy': 'Kopyala',
            'common.copied': 'Kopyalandı!',
            'common.error': 'Hata',
            'common.close': 'Kapat'
        },

        en: {
            'nav.converter': 'Converter',
            'nav.operations': 'Operations',
            'nav.ieee754': 'IEEE 754',
            'nav.twos': "Two's Comp",
            'nav.expression': 'Expression',
            'nav.more': 'More',
            'nav.color': 'Color Code',
            'nav.ascii': 'ASCII Table',
            'nav.comparison': 'Comparison',
            'converter.title': 'Number Converter',
            'converter.subtitle': 'Convert between Binary, Decimal, Hexadecimal, and Octal',
            'converter.decimal': 'Decimal',
            'converter.binary': 'Binary',
            'converter.hexadecimal': 'Hexadecimal',
            'converter.octal': 'Octal',
            'bitgrid.title': 'Interactive Bit Grid',
            'bitgrid.clear': 'Clear All',
            'bitgrid.setBits': 'Set bits:',
            'bitgrid.maxValue': 'Max value:',
            'operations.title': 'Bit Operations',
            'operations.subtitle': 'Visualize bitwise operations step by step',
            'operations.result': 'Result',
            'operations.animate': '▶ Animate',
            'ieee754.title': 'IEEE 754 Floating Point',
            'ieee754.subtitle': 'Analyze the binary representation of floating-point numbers',
            'ieee754.float': 'Float (32-bit)',
            'ieee754.double': 'Double (64-bit)',
            'ieee754.sign': 'Sign',
            'ieee754.exponent': 'Exponent',
            'ieee754.mantissa': 'Mantissa',
            'ieee754.signValue': 'Sign:',
            'ieee754.exponentValue': 'Exponent:',
            'ieee754.mantissaValue': 'Mantissa:',
            'ieee754.formula': 'Formula:',
            'ieee754.specialValues': 'Special Values',
            'twos.title': "Two's Complement",
            'twos.subtitle': 'Understand signed integer representation',
            'twos.originalBinary': 'Original Binary (|n|):',
            'twos.inverted': 'Inverted (NOT):',
            'twos.addOne': 'Add 1:',
            'twos.decimalValue': 'Decimal Value:',
            'twos.hexValue': 'Hex Value:',
            'twos.range': 'Range:',
            'expression.title': 'Bitwise Expression Evaluator',
            'expression.subtitle': 'Evaluate complex bitwise expressions',
            'expression.variables': 'Variables',
            'expression.addVariable': '+ Add Variable',
            'expression.result': 'Result',
            'color.title': 'Color Code Analyzer',
            'color.subtitle': 'Analyze color codes in binary and hexadecimal',
            'ascii.title': 'ASCII / Unicode Table',
            'ascii.subtitle': 'Browse and search character codes',
            'ascii.searchPlaceholder': 'Search character or code...',
            'ascii.all': 'All',
            'ascii.control': 'Control',
            'ascii.printable': 'Printable',
            'ascii.extended': 'Extended',
            'ascii.character': 'Character:',
            'comparison.title': 'Comparison Mode',
            'comparison.subtitle': 'Compare two numbers bit by bit',
            'comparison.valueA': 'Value A',
            'comparison.valueB': 'Value B',
            'comparison.diff': 'Diff',
            'comparison.hamming': 'Hamming Distance',
            'comparison.bitsDifferent': 'bits different',
            'comparison.similarity': 'Similarity',
            'music.title': '🎵 Binary Music',
            'music.play': '▶ Play',
            'music.stop': '⏹ Stop',
            'music.loop': '🔁 Loop',
            'music.tempo': 'Tempo:',
            'music.wave': 'Wave:',
            'music.volume': 'Volume:',
            'history.title': '📜 History',
            'history.recent': 'Recent',
            'history.favorites': '⭐ Favorites',
            'history.clear': 'Clear History',
            'shortcuts.title': '⌨️ Keyboard Shortcuts',
            'shortcuts.focusDec': 'Focus Decimal input',
            'shortcuts.focusBin': 'Focus Binary input',
            'shortcuts.focusHex': 'Focus Hexadecimal input',
            'shortcuts.focusOct': 'Focus Octal input',
            'shortcuts.toggleBitgrid': 'Toggle Bit Grid',
            'shortcuts.toggleMusic': 'Toggle Binary Music',
            'shortcuts.toggleHistory': 'Toggle History',
            'shortcuts.showShortcuts': 'Show Shortcuts',
            'shortcuts.closeModal': 'Close Modal/Panel',
            'common.copy': 'Copy',
            'common.copied': 'Copied!',
            'common.error': 'Error',
            'common.close': 'Close'
        }
    },

    /**
     * Initialize i18n - loads external language files
     */
    init() {
        // Register language data from external files
        if (typeof LANG_ES !== 'undefined') this.data.es = LANG_ES;
        if (typeof LANG_ZH !== 'undefined') this.data.zh = LANG_ZH;
        if (typeof LANG_HI !== 'undefined') this.data.hi = LANG_HI;
        if (typeof LANG_AR !== 'undefined') this.data.ar = LANG_AR;
        if (typeof LANG_PT !== 'undefined') this.data.pt = LANG_PT;
        if (typeof LANG_RU !== 'undefined') this.data.ru = LANG_RU;
        if (typeof LANG_JA !== 'undefined') this.data.ja = LANG_JA;
        if (typeof LANG_DE !== 'undefined') this.data.de = LANG_DE;
        if (typeof LANG_FR !== 'undefined') this.data.fr = LANG_FR;

        // Load saved language or detect from browser
        const savedLang = Storage.get('language');
        if (savedLang && this.data[savedLang]) {
            this.currentLang = savedLang;
        } else {
            const browserLang = navigator.language.split('-')[0];
            this.currentLang = this.data[browserLang] ? browserLang : 'en';
        }

        this.updateUI();
        this.updateLangSelector();
        this.updateTextDirection();
    },

    /**
     * Set language
     */
    setLanguage(lang) {
        if (!this.data[lang]) return false;

        this.currentLang = lang;
        Storage.set('language', lang);
        this.updateUI();
        this.updateLangSelector();
        this.updateTextDirection();
        return true;
    },

    /**
     * Get translation
     */
    t(key, fallback = '') {
        const translations = this.data[this.currentLang] || this.data.en;
        return translations[key] || this.data.en[key] || fallback || key;
    },

    /**
     * Update all UI elements with translations
     */
    updateUI() {
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(el => {
            const key = el.getAttribute('data-i18n');
            const translation = this.t(key);

            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = translation;
            } else {
                el.textContent = translation;
            }
        });

        // Update placeholders
        const placeholders = document.querySelectorAll('[data-i18n-placeholder]');
        placeholders.forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            el.placeholder = this.t(key);
        });

        // Update document language
        document.documentElement.lang = this.currentLang;
    },

    /**
     * Update text direction for RTL languages
     */
    updateTextDirection() {
        const langInfo = this.languages[this.currentLang];
        if (langInfo && langInfo.dir === 'rtl') {
            document.documentElement.dir = 'rtl';
            document.body.classList.add('rtl');
        } else {
            document.documentElement.dir = 'ltr';
            document.body.classList.remove('rtl');
        }
    },

    /**
     * Update language selector UI
     */
    updateLangSelector() {
        const langBtn = document.getElementById('lang-toggle');
        if (!langBtn) return;

        const langInfo = this.languages[this.currentLang];
        const flag = langBtn.querySelector('.lang-flag');
        const code = langBtn.querySelector('.lang-code');

        if (flag && langInfo) flag.textContent = langInfo.flag;
        if (code) code.textContent = this.currentLang.toUpperCase();
    },

    /**
     * Get current language
     */
    getLanguage() {
        return this.currentLang;
    },

    /**
     * Get available languages
     */
    getAvailableLanguages() {
        return Object.keys(this.languages);
    },

    /**
     * Get language info
     */
    getLanguageInfo(lang) {
        return this.languages[lang] || null;
    }
};

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = I18n;
}
