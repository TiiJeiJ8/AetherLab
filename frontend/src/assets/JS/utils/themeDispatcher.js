/* eslint-disable */

/* dispatcher.js */

// 获取主题的 visualMap.inRange.color 数组
export function getVisualMapInRangeColor(themeName) {
    const theme = getTheme(themeName);
    if (theme && theme.visualMap && Array.isArray(theme.visualMap.color) && theme.visualMap.color.length > 0) {
        return theme.visualMap.color;
    }
    // 兜底用主题主色
    if (theme && Array.isArray(theme.color) && theme.color.length > 0) {
        return theme.color;
    }
    // 默认色
    return ['#e0ffff', '#006edd'];
}
// themeDispatcher.js
// 主题分发器：根据主题名返回主题对象

// 假设所有主题 JSON 已通过 import 或 require 方式加载
import defaultTheme from '../../../../public/themes/default.json';
import darkTheme from '../../../../public/themes/dark.json';
import vintageTheme from '../../../../public/themes/vintage.json';
import macaronsTheme from '../../../../public/themes/macarons.json';
import infographicTheme from '../../../../public/themes/infographic.json';
import shineTheme from '../../../../public/themes/shine.json';
import romaTheme from '../../../../public/themes/roma.json';
import waldenTheme from '../../../../public/themes/walden.json';
import westerosTheme from '../../../../public/themes/westeros.json';
import essosTheme from '../../../../public/themes/essos.json';
import wonderlandTheme from '../../../../public/themes/wonderland.json';
import chalkTheme from '../../../../public/themes/chalk.json';
import purplePassionTheme from '../../../../public/themes/purple-passion.json';

const themeMap = {
    default: defaultTheme,
    dark: darkTheme,
    vintage: vintageTheme,
    macarons: macaronsTheme,
    infographic: infographicTheme,
    shine: shineTheme,
    roma: romaTheme,
    walden: waldenTheme,
    westeros: westerosTheme,
    essos: essosTheme,
    wonderland: wonderlandTheme,
    chalk: chalkTheme,
    'purple-passion': purplePassionTheme,
};

export function getTheme(themeName) {
    return themeMap[themeName] || themeMap['default'];
}

export default themeMap;
