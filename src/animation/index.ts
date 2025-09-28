export { AnimationService } from './AnimationService';
export { useAnimation, useColorInterpolation, useSharedValue, useAnimatedStyle, useFadeAnimation, useScaleAnimation, useSlideAnimation, useSequenceAnimation } from './hooks';
export { AnimationPresets } from './presets';
export * from './color';
export type {
    AnimationConfig,
    AnimationPreset,
    SpringConfig,
    AnimationDirection,
    EasingFunction,
    InterpolatorOptions,
    InterpolatorPreset,
    ColorSpace
} from './types';

// 默认导出
export { default } from './AnimationService';