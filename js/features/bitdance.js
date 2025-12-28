/**
 * BitForge - Bit Dance Animation System
 */

const BitDance = {
    canvas: null,
    ctx: null,
    particles: [],
    isActive: true,

    /**
     * Initialize Bit Dance system
     */
    init() {
        this.canvas = document.getElementById('particle-canvas');
        if (!this.canvas) return false;

        this.ctx = this.canvas.getContext('2d');
        this.resize();

        window.addEventListener('resize', () => this.resize());

        this.animate();
        return true;
    },

    /**
     * Resize canvas
     */
    resize() {
        if (!this.canvas) return;
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    },

    /**
     * Create particles for rising bit (0 → 1)
     */
    emitRise(x, y) {
        const count = 8;
        const colors = ['#22c55e', '#4ade80', '#86efac'];

        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 4,
                vy: -Math.random() * 5 - 2,
                life: 1,
                decay: 0.02 + Math.random() * 0.02,
                size: 3 + Math.random() * 4,
                color: colors[Math.floor(Math.random() * colors.length)],
                type: 'rise'
            });
        }

        // Play sound
        if (typeof AudioUtils !== 'undefined' && AudioUtils.playNote) {
            AudioUtils.playNote('G5', 0.1, 'sine');
        }
    },

    /**
     * Create particles for falling bit (1 → 0)
     */
    emitFall(x, y) {
        const count = 6;
        const colors = ['#64748b', '#94a3b8', '#475569'];

        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 3,
                vy: Math.random() * 3 + 1,
                life: 1,
                decay: 0.03 + Math.random() * 0.02,
                size: 2 + Math.random() * 3,
                color: colors[Math.floor(Math.random() * colors.length)],
                type: 'fall'
            });
        }

        // Play sound
        if (typeof AudioUtils !== 'undefined' && AudioUtils.playNote) {
            AudioUtils.playNote('C4', 0.1, 'sine');
        }
    },

    /**
     * Create sparkle effect
     */
    emitSparkle(x, y) {
        const count = 12;
        const colors = ['#3b82f6', '#60a5fa', '#93c5fd'];

        for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 2;
            const speed = 2 + Math.random() * 3;

            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 1,
                decay: 0.03,
                size: 2 + Math.random() * 2,
                color: colors[Math.floor(Math.random() * colors.length)],
                type: 'sparkle'
            });
        }
    },

    /**
     * Create wave effect
     */
    emitWave(startX, y, count, direction = 1) {
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                const x = startX + (i * 40 * direction);
                this.particles.push({
                    x: x,
                    y: y,
                    vx: 0,
                    vy: -2,
                    life: 1,
                    decay: 0.05,
                    size: 4,
                    color: '#3b82f6',
                    type: 'wave'
                });
            }, i * 50);
        }
    },

    /**
     * Update particles
     */
    update() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];

            // Update position
            p.x += p.vx;
            p.y += p.vy;

            // Apply gravity for falling particles
            if (p.type === 'fall') {
                p.vy += 0.1;
            }

            // Apply friction
            p.vx *= 0.98;
            p.vy *= 0.98;

            // Decay life
            p.life -= p.decay;

            // Remove dead particles
            if (p.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
    },

    /**
     * Draw particles
     */
    draw() {
        if (!this.ctx) return;

        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw particles
        for (const p of this.particles) {
            this.ctx.save();
            this.ctx.globalAlpha = p.life;
            this.ctx.fillStyle = p.color;

            if (p.type === 'sparkle') {
                // Star shape for sparkles
                this.drawStar(p.x, p.y, p.size, 4);
            } else {
                // Circle for regular particles
                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
                this.ctx.fill();
            }

            // Glow effect
            if (p.type === 'rise' || p.type === 'sparkle') {
                this.ctx.shadowBlur = 10;
                this.ctx.shadowColor = p.color;
            }

            this.ctx.restore();
        }
    },

    /**
     * Draw star shape
     */
    drawStar(x, y, size, points) {
        this.ctx.beginPath();
        for (let i = 0; i < points * 2; i++) {
            const radius = i % 2 === 0 ? size : size / 2;
            const angle = (i / (points * 2)) * Math.PI * 2 - Math.PI / 2;
            const px = x + Math.cos(angle) * radius;
            const py = y + Math.sin(angle) * radius;

            if (i === 0) {
                this.ctx.moveTo(px, py);
            } else {
                this.ctx.lineTo(px, py);
            }
        }
        this.ctx.closePath();
        this.ctx.fill();
    },

    /**
     * Animation loop
     */
    animate() {
        if (!this.isActive) return;

        this.update();
        this.draw();

        requestAnimationFrame(() => this.animate());
    },

    /**
     * Clear all particles
     */
    clear() {
        this.particles = [];
    },

    /**
     * Pause animations
     */
    pause() {
        this.isActive = false;
    },

    /**
     * Resume animations
     */
    resume() {
        if (!this.isActive) {
            this.isActive = true;
            this.animate();
        }
    }
};

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BitDance;
}
