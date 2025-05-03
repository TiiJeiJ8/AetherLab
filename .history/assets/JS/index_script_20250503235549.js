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

// 生成小球动画
// 适配移动端和桌面端
document.addEventListener('DOMContentLoaded', function () {
    const generateBalls = () => {
        const container = document.getElementById('animated-balls');
        const colors = [
            'var(--bg-color1)',
            'var(--bg-color2)',
            'var(--bg-color3)',
            'var(--bg-color4)',
            'var(--bg-color5)'
        ];

        // 性能优化参数
        const PERFORMANCE = {
            mobile: matchMedia('(max-width: 768px)').matches,
            maxBalls: 50, // 桌面端数量
            mobileBalls: 25 // 移动端数量
        };

        const numBalls = PERFORMANCE.mobile ?
            PERFORMANCE.mobileBalls : PERFORMANCE.maxBalls;

        // 清空容器
        container.innerHTML = '';

        // 生成小球
        for (let i = 0; i < numBalls; i++) {
            const ball = document.createElement('div');
            const size = Math.random() * 4 + 2; // 2-6em
            const delay = Math.random() * 18; // 匹配动画时长

            ball.className = 'ball';
            ball.style.cssText = `
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                left: ${Math.random() * 100}vw;
                top: ${Math.random() * 100}vh;
                width: ${size}em;
                height: ${size}em;
                animation-delay: -${delay}s;
            `;

            container.appendChild(ball);
        }
    };

    // 初始化执行
    generateBalls();

    // 窗口大小变化时重置
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            generateBalls();
        }, 200);
    });
});