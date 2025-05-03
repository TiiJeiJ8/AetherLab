// index_script.js
document.addEventListener('DOMContentLoaded', function () {
    const container = document.getElementById('animated-balls');
    const colors = ['var(--bg-color1)', 'var(--bg-color2)', 'var(--bg-color3)', 'var(--bg-color4)', 'var(--bg-color5)'];

    // 性能优化配置
    const performanceConfig = {
        desktop: {
            maxBalls: 50,
            sizeRange: { min: 2, max: 6 }, // 2-6em
            animationDuration: '18s'
        },
        mobile: {
            maxBalls: 25,
            sizeRange: { min: 1, max: 4 }, // 1-4em
            animationDuration: '24s'
        }
    };

    // 创建单个小球元素
    const createBallElement = () => {
        const ball = document.createElement('div');
        const isMobile = window.matchMedia('(max-width: 768px)').matches;
        const config = isMobile ? performanceConfig.mobile : performanceConfig.desktop;

        const size = Math.random() * (config.sizeRange.max - config.sizeRange.min) + config.sizeRange.min;
        const delay = Math.random() * parseInt(config.animationDuration);

        ball.className = 'ball';
        ball.style.cssText = `
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            width: ${size}em;
            height: ${size}em;
            animation: float ${config.animationDuration} ease-in-out -${delay}s infinite;
        `;

        return ball;
    };

    // 智能DOM复用函数
    const generateBalls = () => {
        const isMobile = window.matchMedia('(max-width: 768px)').matches;
        const targetCount = isMobile ? performanceConfig.mobile.maxBalls : performanceConfig.desktop.maxBalls;
        const existingBalls = Array.from(container.children);

        // 调整小球数量
        if (existingBalls.length < targetCount) {
            // 添加新小球
            const fragment = document.createDocumentFragment();
            for (let i = existingBalls.length; i < targetCount; i++) {
                fragment.appendChild(createBallElement());
            }
            container.appendChild(fragment);
        } else if (existingBalls.length > targetCount) {
            // 移除多余小球
            existingBalls.slice(targetCount).forEach(ball => ball.remove());
        }

        // 更新所有小球位置
        container.childNodes.forEach(ball => {
            ball.style.left = `${Math.random() * 100}vw`;
            ball.style.top = `${Math.random() * 100}vh`;
        });
    };

    // 使用ResizeObserver优化
    const resizeObserver = new ResizeObserver(entries => {
        // 节流处理：每200ms最多触发一次
        if (!container.resizeTimestamp || Date.now() - container.resizeTimestamp > 200) {
            generateBalls();
            container.resizeTimestamp = Date.now();
        }
    });

    // 开始监听文档元素
    resizeObserver.observe(document.documentElement);

    // 初始化生成
    generateBalls();

    // 清理监听器（可选）
    window.addEventListener('beforeunload', () => {
        resizeObserver.disconnect();
    });
});