import type { ViewStyle, ColorValue } from 'react-native';
import type { ShadowStyles } from '../../theme/types';

/**
 * ShadowPresetSize：与主题阴影预设保持一致。
 */
export type ShadowPresetSize =
  | 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  | 'top' | 'bottom' | 'left' | 'right'
  | 'inner' | 'glow';

/**
 * ShadowProps 接口：为组件提供统一的阴影相关属性。
 *
 * 用途：
 * - 统一在各 UI 组件中声明阴影强度与覆盖项。
 * - 与主题弱耦合：通过传入 `shadowStyles` 使用主题预设，再按需覆盖。
 */
export interface ShadowProps {
  /** 阴影预设大小（来自主题 styles.shadow）。 */
  shadowSize?: ShadowPresetSize;
  /** 覆盖阴影颜色。 */
  shadowColor?: ColorValue;
  /** 覆盖阴影偏移。 */
  shadowOffset?: { width: number; height: number };
  /** 覆盖阴影不透明度。 */
  shadowOpacity?: number;
  /** 覆盖阴影半径。 */
  shadowRadius?: number;
}

/**
 * 解析主题阴影预设。
 *
 * 参数：
 * - shadowStyles: 主题的阴影预设对象（`useShadowStyles()` 或 `styles.shadow`）。
 * - size: 预设名称。
 *
 * 返回：
 * - 对应的 ViewStyle；未匹配时返回 `shadowStyles.md` 或空对象。
 */
export function resolveShadowPreset(
  shadowStyles: ShadowStyles,
  size?: ShadowPresetSize,
): ViewStyle {
  if (!shadowStyles) return {};
  if (size && shadowStyles[size]) return shadowStyles[size];
  // 默认不显示阴影：未传 size 时使用 none（不存在则回退空对象）
  return shadowStyles.none ?? {};
}

/**
 * 构建阴影样式（在预设基础上应用覆盖项）。
 *
 * 参数：
 * - shadowStyles: 主题阴影预设对象。
 * - props: ShadowProps（覆盖项）。
 *
 * 返回：
 * - `Partial<ViewStyle>`，可直接合并到组件的 `style`。
 */
export function buildShadowStyle(
  shadowStyles: ShadowStyles,
  props?: ShadowProps,
): Partial<ViewStyle> {
  const p = props ?? {};
  const base = resolveShadowPreset(shadowStyles, p.shadowSize);
  return {
    ...base,
    ...(p.shadowColor != null ? { shadowColor: p.shadowColor } : {}),
    ...(p.shadowOffset != null ? { shadowOffset: p.shadowOffset } : {}),
    ...(p.shadowOpacity != null ? { shadowOpacity: p.shadowOpacity } : {}),
    ...(p.shadowRadius != null ? { shadowRadius: p.shadowRadius } : {}),
  };
}