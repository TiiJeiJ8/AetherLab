// Card 跳转逻辑工具函数

/* eslint-disable */

/**
 * 处理卡片点击跳转
 * @param {Object} options
 * @param {string} options.href - 跳转地址
 * @param {boolean} options.isExternal - 是否外链
 * @param {boolean} options.isDeveloping - 是否开发中
 * @param {object} router - vue-router 实例
 */
export function handleCardClick({ href, isExternal, isDeveloping }, router) {
    if (isExternal) {
        window.open(href, '_blank')
    } else if (!isDeveloping) {
        router.push(href)
    } else {
        router.push('/under-construction')
    }
}
