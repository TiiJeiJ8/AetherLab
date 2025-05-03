// index_script.js
document.addEventListener('DOMContentLoaded', function () {
    // 1. 安全获取容器元素
    const container = document.getElementById('animated-balls');
    if (!container) {
        console.error('错误：找不到id为animated-balls的容器元素');
        return;
    }

    // 2. 初始化时间戳属性
    container.resizeTimestamp = 0;

    // 3. 性能优化配置
    const performanceConfig = {
        desktop: {
            maxBalls: 50,
            sizeRange: { min: 2, max: 6 },
            animationDuration: '18s'
        },
        mobile: {
            maxBalls: 25,
            sizeRange: { min: 1, max: 4 },
            animationDuration: '24s'
        }
    };

    // 4. 创建小球元素函数
    const createBallElement = () => {
        const isMobile = window.matchMedia('(max-width: 768px)').matches;
        const config = isMobile ? performanceConfig.mobile : performanceConfig.desktop;
        const size = Math.random() * (config.sizeRange.max - config.sizeRange.min) + config.sizeRange.min;
        const delay = Math.random() * parseInt(config.animationDuration);

        const ball = document.createElement('div');
        ball.className = 'ball';
        ball.style.cssText = `
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            width: ${size}em;
            height: ${size}em;
            animation: float ${config.animationDuration} ease-in-out -${delay}s infinite;
        `;
        return ball;
    };

    // 5. 智能DOM复用逻辑
    const generateBalls = () => {
        if (!container) return;

        const isMobile = window.matchMedia('(max-width: 768px)').matches;
        const targetCount = isMobile ? performanceConfig.mobile.maxBalls : performanceConfig.desktop.maxBalls;
        const existingBalls = Array.from(container.children);

        // 数量调整
        if (existingBalls.length < targetCount) {
            const fragment = document.createDocumentFragment();
            for (let i = existingBalls.length; i < targetCount; i++) {
                fragment.appendChild(createBallElement());
            }
            container.appendChild(fragment);
        } else if (existingBalls.length > targetCount) {
            existingBalls.slice(targetCount).forEach(ball => ball.remove());
        }

        // 更新位置
        container.childNodes.forEach(ball => {
            ball.style.left = `${Math.random() * 100}vw`;
            ball.style.top = `${Math.random() * 100}vh`;
        });
    };

    // 6. 安全的事件监听
    const resizeObserver = new ResizeObserver(entries => {
        if (!container) return;

        // 节流处理
        if (Date.now() - container.resizeTimestamp > 200) {
            generateBalls();
            container.resizeTimestamp = Date.now();
        }
    });

    // 7. 初始化执行
    generateBalls();
    resizeObserver.observe(document.documentElement);

    // 8. 清理监听器
    window.addEventListener('beforeunload', () => {
        resizeObserver.disconnect();
        container.resizeTimestamp = null;
    });
});