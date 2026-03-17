/* ==========================================
   PORTFOLIO - PARTICLE BACKGROUND
   Canvas-based Animated Particles
   ========================================== */

class ParticleBackground {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.particleCount = 80;
        this.connectionDistance = 150;
        this.mouseRadius = 150;
        this.mouse = { x: null, y: null };

        this.init();
        this.animate();
        this.addEventListeners();
    }

    init() {
        this.resize();
        this.createParticles();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticles() {
        this.particles = [];
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push(new Particle(this.canvas));
        }
    }

    addEventListeners() {
        window.addEventListener('resize', () => {
            this.resize();
            this.createParticles();
        });

        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });

        window.addEventListener('mouseout', () => {
            this.mouse.x = null;
            this.mouse.y = null;
        });
    }

    connectParticles() {
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.connectionDistance) {
                    const opacity = 1 - (distance / this.connectionDistance);
                    this.ctx.strokeStyle = `rgba(212, 175, 55, ${opacity * 0.3})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }
        }
    }

    connectToMouse() {
        if (this.mouse.x === null || this.mouse.y === null) return;

        for (let i = 0; i < this.particles.length; i++) {
            const dx = this.particles[i].x - this.mouse.x;
            const dy = this.particles[i].y - this.mouse.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < this.mouseRadius) {
                const opacity = 1 - (distance / this.mouseRadius);
                this.ctx.strokeStyle = `rgba(212, 175, 55, ${opacity * 0.5})`;
                this.ctx.lineWidth = 1.5;
                this.ctx.beginPath();
                this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                this.ctx.lineTo(this.mouse.x, this.mouse.y);
                this.ctx.stroke();

                // Push particles away from mouse
                const angle = Math.atan2(dy, dx);
                const force = (this.mouseRadius - distance) / this.mouseRadius;
                this.particles[i].vx += Math.cos(angle) * force * 0.5;
                this.particles[i].vy += Math.sin(angle) * force * 0.5;
            }
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Update and draw particles
        for (let i = 0; i < this.particles.length; i++) {
            this.particles[i].update(this.canvas);
            this.particles[i].draw(this.ctx);
        }

        // Connect particles
        this.connectParticles();
        this.connectToMouse();

        requestAnimationFrame(() => this.animate());
    }
}

class Particle {
    constructor(canvas) {
        this.canvas = canvas;
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.baseVx = (Math.random() - 0.5) * 0.5;
        this.baseVy = (Math.random() - 0.5) * 0.5;
        this.vx = this.baseVx;
        this.vy = this.baseVy;
        this.opacity = Math.random() * 0.5 + 0.3;
    }

    update(canvas) {
        // Apply base velocity
        this.x += this.vx;
        this.y += this.vy;

        // Gradually return to base velocity
        this.vx += (this.baseVx - this.vx) * 0.05;
        this.vy += (this.baseVy - this.vy) * 0.05;

        // Boundary collision
        if (this.x < 0) {
            this.x = 0;
            this.vx = -this.vx;
            this.baseVx = -this.baseVx;
        }
        if (this.x > canvas.width) {
            this.x = canvas.width;
            this.vx = -this.vx;
            this.baseVx = -this.baseVx;
        }
        if (this.y < 0) {
            this.y = 0;
            this.vy = -this.vy;
            this.baseVy = -this.baseVy;
        }
        if (this.y > canvas.height) {
            this.y = canvas.height;
            this.vy = -this.vy;
            this.baseVy = -this.baseVy;
        }
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212, 175, 55, ${this.opacity})`;
        ctx.fill();

        // Add glow effect
        ctx.shadowBlur = 15;
        ctx.shadowColor = 'rgba(212, 175, 55, 0.5)';
    }
}

// Initialize particle background when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ParticleBackground('particles');
});

// Additional floating shapes for visual interest
class FloatingShapes {
    constructor() {
        this.shapes = [];
        this.createShapes();
        this.animate();
    }

    createShapes() {
        const shapesContainer = document.createElement('div');
        shapesContainer.className = 'floating-shapes';
        shapesContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 0;
            overflow: hidden;
        `;

        const colors = [
            'rgba(212, 175, 55, 0.03)',
            'rgba(184, 144, 91, 0.03)',
            'rgba(243, 229, 171, 0.03)'
        ];

        for (let i = 0; i < 5; i++) {
            const shape = document.createElement('div');
            const size = Math.random() * 400 + 200;

            shape.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                background: ${colors[i % colors.length]};
                border-radius: 50%;
                filter: blur(60px);
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: floatShape ${20 + Math.random() * 10}s ease-in-out infinite;
                animation-delay: ${-Math.random() * 20}s;
            `;

            shapesContainer.appendChild(shape);
            this.shapes.push(shape);
        }

        // Add CSS animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes floatShape {
                0%, 100% { transform: translate(0, 0) rotate(0deg); }
                25% { transform: translate(50px, -50px) rotate(90deg); }
                50% { transform: translate(0, -100px) rotate(180deg); }
                75% { transform: translate(-50px, -50px) rotate(270deg); }
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(shapesContainer);
    }

    animate() {
        // Optional: Add dynamic updates here
    }
}

// Initialize floating shapes
document.addEventListener('DOMContentLoaded', () => {
    new FloatingShapes();
});
