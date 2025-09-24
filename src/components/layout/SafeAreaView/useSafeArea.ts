import { useSafeAreaInsets, Edge } from 'react-native-safe-area-context';
import { useTheme } from '../../../utils/useTheme';

export interface SafeAreaConfig {
  edges?: Edge[];
  additionalPadding?: {
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
  };
}

export const useSafeArea = (config?: SafeAreaConfig) => {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const { edges = ['top', 'bottom', 'left', 'right'], additionalPadding = {} } = config || {};

  const safeAreaStyle = {
    paddingTop: edges.includes('top') ? insets.top + (additionalPadding.top || 0) : additionalPadding.top || 0,
    paddingBottom: edges.includes('bottom') ? insets.bottom + (additionalPadding.bottom || 0) : additionalPadding.bottom || 0,
    paddingLeft: edges.includes('left') ? insets.left + (additionalPadding.left || 0) : additionalPadding.left || 0,
    paddingRight: edges.includes('right') ? insets.right + (additionalPadding.right || 0) : additionalPadding.right || 0,
  };

  return {
    insets,
    safeAreaStyle,
    theme,
    // 便捷方法
    topInset: insets.top,
    bottomInset: insets.bottom,
    leftInset: insets.left,
    rightInset: insets.right,
  };
};