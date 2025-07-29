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

// 获取主题的 color数组
export function getThemeColorPalette(themeName) {
    const theme = getTheme(themeName);
    if (theme && Array.isArray(theme.color) && theme.color.length > 0) {
        return theme.color;
    }
    // 默认色
    return ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'];
}

// 主题分发器：根据主题名返回主题对象

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
