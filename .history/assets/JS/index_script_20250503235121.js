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
