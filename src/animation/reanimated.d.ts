// 为可选的 react-native-reanimated 依赖提供类型声明
declare module 'react-native-reanimated' {
  export interface EasingFunction {
    (value: number): number;
  }

  export interface EasingStatic {
    linear: EasingFunction;
    ease: EasingFunction;
    quad: EasingFunction;
    cubic: EasingFunction;
    poly(n: number): EasingFunction;
    sin: EasingFunction;
    circle: EasingFunction;
    exp: EasingFunction;
    elastic(bounciness?: number): EasingFunction;
    back(s?: number): EasingFunction;
    bounce: EasingFunction;
    bezier(x1: number, y1: number, x2: number, y2: number): EasingFunction;
    in(easing: EasingFunction): EasingFunction;
    out(easing: EasingFunction): EasingFunction;
    inOut(easing: EasingFunction): EasingFunction;
  }

  export interface WithTimingConfig {
    duration?: number;
    easing?: EasingFunction;
  }

  export interface WithSpringConfig {
    damping?: number;
    mass?: number;
    stiffness?: number;
    overshootClamping?: boolean;
    restDisplacementThreshold?: number;
    restSpeedThreshold?: number;
  }

  export function withTiming(
    toValue: number,
    config?: WithTimingConfig,
    callback?: (finished?: boolean) => void
  ): number;

  export function withSpring(
    toValue: number,
    config?: WithSpringConfig,
    callback?: (finished?: boolean) => void
  ): number;

  export function withRepeat(
    animation: number,
    numberOfReps?: number,
    reverse?: boolean,
    callback?: (finished?: boolean) => void
  ): number;

  export function withSequence(...animations: number[]): number;

  export function runOnJS<Args extends any[], Return>(
    fn: (...args: Args) => Return
  ): (...args: Args) => void;

  export const Easing: EasingStatic;

  export function useSharedValue<T>(initialValue: T): { value: T };

  export function useAnimatedStyle<T extends Record<string, any>>(
    updater: () => T,
    dependencies?: any[]
  ): T;

  export function useDerivedValue<T>(
    updater: () => T,
    dependencies?: any[]
  ): { value: T };

  export function useAnimatedGestureHandler<T extends Record<string, any>>(
    handlers: T,
    dependencies?: any[]
  ): T;

  export function interpolate(
    value: number,
    inputRange: number[],
    outputRange: number[],
    extrapolate?: 'extend' | 'clamp' | 'identity'
  ): number;

  export function cancelAnimation(sharedValue: { value: any }): void;
}