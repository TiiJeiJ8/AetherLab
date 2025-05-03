// assets/js/interaction.js
class QuantumInteraction {
    constructor() {
        this.canvas = document.getElementById('main-canvas');
        this._initHoverEffect();
        this._initResizeObserver();
    }

    _initHoverEffect() {
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            this._createRipple(x, y);
        });
    }

    _createRipple(x, y) {
        const ripple = document.createElement('div');
        ripple.className = 'quantum-ripple';
        Object.assign(ripple.style, {
            left: `${x}px`,
            top: `${y}px`,
            animation: 'ripple-expand 0.8s ease-out'
        });
        this.canvas.appendChild(ripple);
        setTimeout(() => ripple.remove(), 800);
    }

    _initResizeObserver() {
        const observer = new ResizeObserver(entries => {
            entries.forEach(entry => {
                this._adjustGridPattern(entry.contentRect);
            });
        });
        observer.observe(this.canvas);
    }
}