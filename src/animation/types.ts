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