// 文件顶部导入
import React from 'react';
import { ViewStyle, StyleProp, DimensionValue } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming } from 'react-native-reanimated';
import { useTheme, useThemeColors } from '../../../theme';

export interface SkeletonProps {
  variant?: 'rect' | 'circle' | 'line';
  width?: DimensionValue; // 修改：使用 DimensionValue 支持数字与百分比
  height?: number;
  animated?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'rect',
  width,
  height,
  animated = true,
  style,
  testID,
}) => {
  const { theme, isDark } = useTheme();
  const colors = useThemeColors();

  // 调整：加深默认背景色，区分亮/暗主题
  const baseColor = isDark
    ? ((colors as any).skeletonFill ?? (colors as any).border ?? (colors as any).surface ?? '#4A4F57')
    : ((colors as any).skeletonFill ?? (colors as any).border ?? (colors as any).surface ?? '#C7CBD3');

  // 修改：默认尺寸类型改为 DimensionValue，并在 circle 下强制使用数值直径
  const defaultDims = (): { width?: DimensionValue; height: number } => {
    if (variant === 'circle') {
      const size = typeof width === 'number' ? width : (height ?? 40);
      return { width: typeof width === 'number' ? width : size, height: size };
    }
    if (variant === 'line') {
      return { width: width ?? '100%', height: height ?? 12 };
    }
    return { width: width ?? '100%', height: height ?? 16 };
  };

  const dims = defaultDims();

  const containerStyle: ViewStyle = {
    backgroundColor: baseColor,
    borderRadius:
      variant === 'circle'
        ? typeof dims.height === 'number'
          ? dims.height / 2
          : (theme as any).borderRadius?.full ?? 9999
        : theme.borderRadius?.sm ?? 6,
    overflow: 'hidden',
  };

  const pulse = useSharedValue(1);

  React.useEffect(() => {
    if (animated) {
      pulse.value = withRepeat(withTiming(0.6, { duration: 900 }), -1, true);
    } else {
      pulse.value = 1;
    }
  }, [animated]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: pulse.value,
  }));

  return (
    <Animated.View
      testID={testID}
      accessible={false}
      style={[{ width: dims.width, height: dims.height }, containerStyle, animatedStyle, style]}
    />
  );
};

export default Skeleton;