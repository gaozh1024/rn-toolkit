export * from './types';
export * from './presets';
export * from './hooks';
export { StyleService } from './StyleService';
export { default as styleService } from './StyleService';

// 导出便捷的 css 对象
import styleService from './StyleService';
export const css = styleService.getCSS();