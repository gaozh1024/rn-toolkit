export * from './types';
export * from './presets';
export * from './hooks';
export * from './ThemeService';
export { default as themeService } from './ThemeService';

// 导出便捷的 css 对象
import themeService from './ThemeService';
export const css = themeService.getCSS();

// 导出主题创建工具
export {
    createDefaultAppTheme,
    createDefaultStyleTheme,
    createCustomTheme,
    createStylePresets,
    lightColors,
    darkColors,
} from './presets';

// 导出默认主题实例
export {
    defaultAppTheme,
    defaultTheme,
} from './presets';
