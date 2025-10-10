import React, { useEffect, useRef } from 'react';
import { View, Animated, Easing, ViewStyle } from 'react-native';
import { useTheme, ColorTheme } from '../../../theme';
import Svg, { Circle } from 'react-native-svg';

export type SpinnerSize = 'small' | 'medium' | 'large' | number;
export type SpinnerColor =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'text'
  | 'subtext'
  | 'border'
  | 'divider'
  | string;

export interface SpinnerProps {
  size?: SpinnerSize;
  color?: SpinnerColor;
  animating?: boolean;
  style?: ViewStyle | ViewStyle[];
  testID?: string;
}

const resolveColor = (colors: ColorTheme, c?: SpinnerColor) => {
  if (!c) return (colors as any)['text'] ?? '#333';
  // 主题键优先
  const themeKeys = [
    'primary',
    'secondary',
    'success',
    'warning',
    'error',
    'info',
    'text',
    'subtext',
    'border',
    'divider',
  ] as const;
  if (typeof c === 'string' && themeKeys.includes(c as any)) {
    const v = (colors as any)[c];
    if (typeof v === 'string') return v;
  }
  // 其余情况按自定义色值处理
  return typeof c === 'string' ? c : (colors as any)['text'] ?? '#333';
};

const sizeToDiameter = (size?: SpinnerSize) => {
  if (typeof size === 'number') return Math.max(12, size);
  switch (size) {
    case 'small':
      return 20;
    case 'large':
      return 32;
    case 'medium':
    default:
      return 24;
  }
};

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'medium',
  color,
  animating = true,
  style,
  testID,
}) => {
  const { theme } = useTheme();
  const colors = theme.colors as ColorTheme;

  const diameter = sizeToDiameter(size);
  const stroke = Math.max(2, Math.round(diameter * 0.08));
  const activeColor = resolveColor(colors, color) ?? (colors as any)['text'];
  const trackColor = (colors as any)['divider'] ?? '#e0e0e0';

  const rotate = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    let loop: Animated.CompositeAnimation | null = null;
    if (animating) {
      rotate.setValue(0);
      loop = Animated.loop(
        Animated.timing(rotate, {
          toValue: 1,
          duration: 800,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      );
      loop.start();
    }
    return () => { loop && loop.stop(); };
  }, [animating, rotate]);

  const spinStyle = {
    transform: [{
      rotateZ: rotate.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] }),
    }],
  };

  // SVG 圆弧参数
  const r = (diameter - stroke) / 2;
  const cx = diameter / 2;
  const cy = diameter / 2;
  const circumference = 2 * Math.PI * r;
  const arcLength = circumference * 0.3; // 30% 的有色段

  return (
    <View style={[{ width: diameter, height: diameter }, style]} testID={testID}>
      <Animated.View style={[{ width: diameter, height: diameter }, spinStyle]}>
        <Svg width={diameter} height={diameter}>
          <Circle cx={cx} cy={cy} r={r} stroke={trackColor} strokeWidth={stroke} fill="none" />
          <Circle
            cx={cx}
            cy={cy}
            r={r}
            stroke={activeColor}
            strokeWidth={stroke}
            fill="none"
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeDashoffset={0}
            strokeLinecap="round"
            rotation={-90}
            originX={cx}
            originY={cy}
          />
        </Svg>
      </Animated.View>
    </View>
  );
};

export default Spinner;