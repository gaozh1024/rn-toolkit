export * from './types';
export * from './presets';
export * from './hooks';
export * from './ThemeService';
export { default as themeService } from './ThemeService';

// 导出便捷的 css 对象
import themeService from './ThemeService';
export const css = themeService.getCSS();
