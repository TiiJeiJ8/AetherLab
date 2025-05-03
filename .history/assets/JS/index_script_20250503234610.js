// 卡片入场动画
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.cyber-card');
    cards.forEach((card, i) => {
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, i * 200);
    });

    // 按钮光效
    document.querySelectorAll('.neon-btn').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            btn.style.background = `
                        radial-gradient(
                            circle at ${e.clientX - rect.left}px ${e.clientY - rect.top}px,
                            rgba(0, 255, 255, 0.3),
                            transparent 80%
                        )`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.background = 'none';
        });
    });
});

document.addEventListener('DOMContentLoaded', function () {
    // 粒子配置
    const config = {
        particleColor: 'rgba(108,140,255,0.6)',  // 主色匹配
        particleCount: 60,      // 粒子密度
        maxSpeed: 0.5,         // 运动速度
        mouseDist: 100,        // 鼠标影响范围
        lineMaxDist: 120,      // 连线最大距离
        fadeInSpeed: 0.05,     // 渐现速度
        fadeOutSpeed: 0.02     // 渐隐速度
    };

    class ParticleSystem {
        constructor(canvasId) {
            this.canvas = document.getElementById(canvasId);
            this.ctx = this.canvas.getContext('2d');
            this.particles = [];
            this.mouse = { x: null, y: null };
            this.animate = false;

            this.initCanvas();
            this.initEvents();
            this.loop();
        }

        initCanvas() {
            const rect = this.canvas.parentElement.getBoundingClientRect();
            this.canvas.width = rect.width;
            this.canvas.height = rect.height;
        }

        initEvents() {
            // 鼠标进入卡片区域
            this.canvas.parentElement.parentElement.addEventListener('mouseenter', () => {
                this.animate = true;
                this.spawnParticles();
            });

            // 鼠标离开卡片区域
            this.canvas.parentElement.parentElement.addEventListener('mouseleave', () => {
                this.animate = false;
            });

            // 鼠标移动
            this.canvas.parentElement.parentElement.addEventListener('mousemove', (e) => {
                const rect = this.canvas.getBoundingClientRect();
                this.mouse.x = e.clientX - rect.left;
                this.mouse.y = e.clientY - rect.top;
            });
        }

        spawnParticles() {
            for (let i = 0; i < config.particleCount; i++) {
                this.particles.push({
                    x: Math.random() * this.canvas.width,
                    y: Math.random() * this.canvas.height,
                    size: Math.random() * 2 + 1,
                    alpha: 0,
                    targetAlpha: 0.6,
                    dx: (Math.random() - 0.5) * config.maxSpeed,
                    dy: (Math.random() - 0.5) * config.maxSpeed
                });
            }
        }

        updateParticles() {
            this.particles.forEach(p => {
                // 渐隐逻辑
                if (!this.animate) p.targetAlpha = 0;
                p.alpha += (p.targetAlpha - p.alpha) *
                    (p.targetAlpha > p.alpha ? config.fadeInSpeed : config.fadeOutSpeed);

                // 运动逻辑
                p.x += p.dx;
                p.y += p.dy;

                // 边界反弹
                if (p.x < 0 || p.x > this.canvas.width) p.dx *= -1;
                if (p.y < 0 || p.y > this.canvas.height) p.dy *= -1;

                // 鼠标吸引
                if (this.mouse.x && this.mouse.y) {
                    const dx = this.mouse.x - p.x;
                    const dy = this.mouse.y - p.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < config.mouseDist) {
                        const angle = Math.atan2(dy, dx);
                        p.dx += Math.cos(angle) * 0.1;
                        p.dy += Math.sin(angle) * 0.1;
                    }
                }
            });
        }

        drawParticles() {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            this.particles.forEach(p => {
                // 绘制粒子
                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                this.ctx.fillStyle = config.particleColor.replace('0.6', p.alpha);
                this.ctx.fill();

                // 绘制连线
                this.particles.forEach(other => {
                    const dx = other.x - p.x;
                    const dy = other.y - p.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < config.lineMaxDist) {
                        this.ctx.beginPath();
                        this.ctx.moveTo(p.x, p.y);
                        this.ctx.lineTo(other.x, other.y);
                        this.ctx.strokeStyle = config.particleColor.replace('0.6', (1 - dist / config.lineMaxDist) * 0.3);
                        this.ctx.stroke();
                    }
                });
            });
        }

        loop() {
            if (this.animate || this.particles.some(p => p.alpha > 0)) {
                this.updateParticles();
                this.drawParticles();
            }
            requestAnimationFrame(() => this.loop());
        }
    }

    // 初始化所有粒子卡片
    document.querySelectorAll('[id^="particle-canvas"]').forEach(canvas => {
        new ParticleSystem(canvas.id);
    });
});