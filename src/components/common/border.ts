import type { ColorValue, ViewStyle } from 'react-native';

/**
 * BorderProps 接口：为组件提供统一的边框属性。
 *
 * 用途：
 * - 统一在各 UI 组件中声明边框相关的 props。
 * - 与主题无耦合，纯粹映射到 React Native 的 `ViewStyle`。
 */
export interface BorderProps {
    /** 边框宽度（像素）。 */
    borderWidth?: number;
    /** 边框颜色（任意可解析颜色字符串）。 */
    borderColor?: ColorValue;
    /** 整体圆角半径。 */
    borderRadius?: number;
}

/**
 * 构建边框样式。
 *
 * 用途：
 * - 将 `BorderProps` 映射为 `ViewStyle`，便于直接合并到组件的 `style`。
 *
 * 参数：
 * - props: `BorderProps`，包含宽度、颜色、圆角。
 *
 * 返回：
 * - `Partial<ViewStyle>`，只包含用户传入的边框字段。
 */
export function buildBorderStyle(props?: BorderProps): Partial<ViewStyle> {
    const p = props ?? {};
    const style: Partial<ViewStyle> = {};
    if (p.borderWidth != null) style.borderWidth = p.borderWidth;
    if (p.borderColor != null) style.borderColor = p.borderColor;
    if (p.borderRadius != null) style.borderRadius = p.borderRadius;
    return style;
}