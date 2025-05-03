// index_script.js
let resizeObserver = null;

function initBalls() {
    const container = document.getElementById('animated-balls');

    if (container) {
        console.log('成功初始化小球系统');

        // 性能配置...
        const performanceConfig = { /* 保持原有配置 */ };

        // 生成函数...
        const generateBalls = () => { /* 更新后的安全逻辑 */ };

        // 初始化执行
        generateBalls();

        // ResizeObserver初始化
        resizeObserver = new ResizeObserver(() => { /* 安全逻辑 */ });
        resizeObserver.observe(document.documentElement);

        return;
    }

    // 使用MutationObserver监听
    const observer = new MutationObserver((mutations) => {
        mutations.forEach(() => {
            if (document.getElementById('animated-balls')) {
                observer.disconnect();
                initBalls();
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

// 兼容Dash的启动方式
if (document.readyState === 'complete') {
    initBalls();
} else {
    document.addEventListener('DOMContentLoaded', initBalls);
    window.addEventListener('load', initBalls);
}