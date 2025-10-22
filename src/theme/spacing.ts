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

  // 统一解析数值（保留 0）
  const r = (v?: SpacingSize) => resolve(spacing, v);

  // 先计算 margin（全局 -> 轴向 -> 单侧）
  const marginTop = m != null ? r(m) : undefined;
  const marginBottom = m != null ? r(m) : undefined;
  const marginLeft = m != null ? r(m) : undefined;
  const marginRight = m != null ? r(m) : undefined;

  if (mv != null) {
    const v = r(mv);
    (marginTop as any) = v;
    (marginBottom as any) = v;
  }
  if (mh != null) {
    const v = r(mh);
    (marginLeft as any) = v;
    (marginRight as any) = v;
  }
  if (mt != null) (marginTop as any) = r(mt);
  if (mb != null) (marginBottom as any) = r(mb);
  if (ml != null) (marginLeft as any) = r(ml);
  if (mr != null) (marginRight as any) = r(mr);

  // 再计算 padding（全局 -> 轴向 -> 单侧）
  const paddingTop = p != null ? r(p) : undefined;
  const paddingBottom = p != null ? r(p) : undefined;
  const paddingLeft = p != null ? r(p) : undefined;
  const paddingRight = p != null ? r(p) : undefined;

  if (pv != null) {
    const v = r(pv);
    (paddingTop as any) = v;
    (paddingBottom as any) = v;
  }
  if (ph != null) {
    const v = r(ph);
    (paddingLeft as any) = v;
    (paddingRight as any) = v;
  }
  if (pt != null) (paddingTop as any) = r(pt);
  if (pb != null) (paddingBottom as any) = r(pb);
  if (pl != null) (paddingLeft as any) = r(pl);
  if (pr != null) (paddingRight as any) = r(pr);

  // 仅在值存在时写入，避免污染样式
  const style: SpacingStyle = {};
  if (marginTop != null) style.marginTop = marginTop;
  if (marginBottom != null) style.marginBottom = marginBottom;
  if (marginLeft != null) style.marginLeft = marginLeft;
  if (marginRight != null) style.marginRight = marginRight;

  if (paddingTop != null) style.paddingTop = paddingTop;
  if (paddingBottom != null) style.paddingBottom = paddingBottom;
  if (paddingLeft != null) style.paddingLeft = paddingLeft;
  if (paddingRight != null) style.paddingRight = paddingRight;

  return style;
};

export const useSpacingStyle = (props: SpacingProps): SpacingStyle => {
  const spacing = useSpacing();
  return spacingPropsToStyle(spacing, props);
};