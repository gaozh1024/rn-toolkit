import type { Animated } from 'react-native';

// 弹簧动画配置
export interface SpringConfig {
  damping?: number;
  stiffness?: number;
  mass?: number;
  velocity?: number;
}

// 动画配置
export interface AnimationConfig {
  duration?: number;
  delay?: number;
  easing?: any;
  useNativeDriver?: boolean;
}

// 动画预设类型
export interface AnimationPreset {
  animation: any; // 可以是 reanimated 或 Animated 的动画
  type: 'reanimated' | 'animated';
}

// 动画方向
export type AnimationDirection = 'left' | 'right' | 'up' | 'down' | 'top' | 'bottom';

// 缓动函数类型
export type EasingFunction = (value: number) => number;

// 插值器选项和预设类型
export type ExtrapolateType = 'extend' | 'clamp' | 'identity';
export type ColorSpace = 'RGB' | 'HSV';

export interface InterpolatorOptions {
  extrapolate?: ExtrapolateType;
  extrapolateLeft?: ExtrapolateType;
  extrapolateRight?: ExtrapolateType;
}

export interface InterpolatorPreset {
  type: 'reanimated' | 'animated';
  // Animated 路径下，直接可用于样式的插值值（如数值、角度字符串、颜色字符串）
  value?: any;
  // Reanimated 路径下，提供配置，需在 useAnimatedStyle 中使用 interpolate/interpolateColor 应用
  config?: {
    inputRange: number[];
    outputRange: any[];
    options?: InterpolatorOptions;
    colorSpace?: 'RGB' | 'HSV';
  };
  kind: 'number' | 'string' | 'color';
}