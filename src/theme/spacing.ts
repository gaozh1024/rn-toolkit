import type { ViewStyle, TextStyle } from 'react-native';
import { useSpacing } from './hooks';
import type { SpacingTheme } from './types';

export type SpacingSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | number;

export interface SpacingProps {
  m?: SpacingSize;
  mv?: SpacingSize; // marginVertical
  mh?: SpacingSize; // marginHorizontal
  mt?: SpacingSize;
  mb?: SpacingSize;
  ml?: SpacingSize;
  mr?: SpacingSize;
  p?: SpacingSize;
  pv?: SpacingSize; // paddingVertical
  ph?: SpacingSize; // paddingHorizontal
  pt?: SpacingSize;
  pb?: SpacingSize;
  pl?: SpacingSize;
  pr?: SpacingSize;
}

export type SpacingStyle = Partial<ViewStyle & TextStyle>;

const resolve = (spacing: SpacingTheme, v?: SpacingSize): number | undefined => {
  if (typeof v === 'number') return v;
  if (v == null) return undefined;
  return spacing[v];
};

export const spacingPropsToStyle = (spacing: SpacingTheme, props: SpacingProps): SpacingStyle => {
  const {
    m, mv, mh, mt, mb, ml, mr,
    p, pv, ph, pt, pb, pl, pr,
  } = props;

  return {
    // margin
    ...(m != null ? { margin: resolve(spacing, m) } : {}),
    ...(mv != null ? { marginTop: resolve(spacing, mv), marginBottom: resolve(spacing, mv) } : {}),
    ...(mh != null ? { marginLeft: resolve(spacing, mh), marginRight: resolve(spacing, mh) } : {}),
    ...(mt != null ? { marginTop: resolve(spacing, mt) } : {}),
    ...(mb != null ? { marginBottom: resolve(spacing, mb) } : {}),
    ...(ml != null ? { marginLeft: resolve(spacing, ml) } : {}),
    ...(mr != null ? { marginRight: resolve(spacing, mr) } : {}),
    // padding
    ...(p != null ? { padding: resolve(spacing, p) } : {}),
    ...(pv != null ? { paddingTop: resolve(spacing, pv), paddingBottom: resolve(spacing, pv) } : {}),
    ...(ph != null ? { paddingLeft: resolve(spacing, ph), paddingRight: resolve(spacing, ph) } : {}),
    ...(pt != null ? { paddingTop: resolve(spacing, pt) } : {}),
    ...(pb != null ? { paddingBottom: resolve(spacing, pb) } : {}),
    ...(pl != null ? { paddingLeft: resolve(spacing, pl) } : {}),
    ...(pr != null ? { paddingRight: resolve(spacing, pr) } : {}),
  };
};

export const useSpacingStyle = (props: SpacingProps): SpacingStyle => {
  const spacing = useSpacing();
  return spacingPropsToStyle(spacing, props);
};