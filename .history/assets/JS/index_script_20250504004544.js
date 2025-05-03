// 粒子系统初始化
function initParticles() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    // 设置Canvas尺寸
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // 粒子系统
    const particles = [];
    const particleCount = 100;

    class Particle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.size = Math.random() * 3 + 1;
            this.speedX = Math.random() * 3 - 1.5;
            this.speedY = Math.random() * 3 - 1.5;
            this.life = 30;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.size > 0.2) this.size -= 0.1;
            this.life--;
        }

        draw() {
            ctx.fillStyle = `rgba(108, 140, 255, ${this.life / 30})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // 动画循环
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 生成新粒子
        if (particles.length < particleCount) {
            particles.push(new Particle(
                Math.random() * canvas.width,
                Math.random() * canvas.height
            ));
        }

        // 更新并绘制粒子
        particles.forEach((particle, index) => {
            particle.update();
            particle.draw();
            if (particle.life <= 0) {
                particles.splice(index, 1);
            }
        });

        requestAnimationFrame(animate);
    }

    // 鼠标交互
    let mouseX = 0;
    let mouseY = 0;

    canvas.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        // 生成更多粒子
        for (let i = 0; i < 3; i++) {
            particles.push(new Particle(mouseX, mouseY));
        }
    });

    canvas.addEventListener('click', (e) => {
        // 点击时生成粒子爆发
        for (let i = 0; i < 20; i++) {
            particles.push(new Particle(e.clientX, e.clientY));
        }
    });

    animate();
}

// 确保在DOM加载完成后执行
document.addEventListener('DOMContentLoaded', initParticles);