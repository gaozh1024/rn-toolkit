import type { ViewStyle, ColorValue, DimensionValue } from 'react-native';
import { buildBackgroundStyle, type BackgroundProps } from './background';
import { buildBorderStyle, type BorderProps } from './border';

export interface SizeProps {
  width?: DimensionValue;
  height?: DimensionValue;
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
}

export type BoxProps = SizeProps & BackgroundProps & BorderProps;

export function buildSizeStyle(props?: SizeProps): Partial<ViewStyle> {
  const p = props ?? {};
  const s: Partial<ViewStyle> = {};
  if (p.width != null) s.width = p.width;
  if (p.height != null) s.height = p.height;
  if (p.minWidth != null) s.minWidth = p.minWidth;
  if (p.minHeight != null) s.minHeight = p.minHeight;
  if (p.maxWidth != null) s.maxWidth = p.maxWidth;
  if (p.maxHeight != null) s.maxHeight = p.maxHeight;
  return s;
}

export function buildBoxStyle(
  defaults: { defaultBackground: ColorValue },
  props?: BoxProps,
  overrides?: Partial<ViewStyle>,
): Partial<ViewStyle> {
  const p = props ?? {};
  return {
    // 先合并外部 style，再用单独属性进行覆盖
    ...(overrides ?? {}),
    ...buildSizeStyle(p),
    ...buildBackgroundStyle(defaults.defaultBackground, p),
    ...buildBorderStyle(p),
  };
}