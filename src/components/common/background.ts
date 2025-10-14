import type { ColorValue, ViewStyle } from 'react-native';

/**
 * BackgroundProps 接口：为组件提供统一的背景相关属性。
 *
 * 用途：
 * - 统一在各 UI 组件中声明背景色与透明控制。
 * - 与主题无耦合，通过传入默认色来解析最终背景色。
 */
export interface BackgroundProps {
  /** 背景颜色。 */
  backgroundColor?: ColorValue;
  /** 是否背景透明。 */
  transparent?: boolean;
}

/**
 * 构建背景样式。
 *
 * 用途：
 * - 将 `BackgroundProps` 映射为 `ViewStyle` 的 `backgroundColor` 字段。
 * - 根据 `transparent` 与 `backgroundColor` 解析最终背景色。
 *
 * 参数：
 * - defaultColor: 默认背景色（组件的主题默认）。
 * - props: `BackgroundProps`，包含颜色与透明控制。
 *
 * 返回：
 * - `Partial<ViewStyle>`，仅包含解析后的 `backgroundColor`。
 */
export function buildBackgroundStyle(
  defaultColor: ColorValue,
  props?: BackgroundProps,
): Partial<ViewStyle> {
  const p = props ?? {};
  if (p.transparent) return { backgroundColor: 'transparent' };
  return { backgroundColor: p.backgroundColor ?? defaultColor };
}