import { Animated } from 'react-native';
import type { AnimationPreset } from './types';

class AnimationPresetsService {
    private static reanimated: any = null;
    private static isReanimatedAvailable = false;

    static async initialize() {
        try {
            this.reanimated = await import('react-native-reanimated');
            this.isReanimatedAvailable = true;
        } catch (error) {
            this.isReanimatedAvailable = false;
        }
    }

    static fadeIn(duration: number = 300): AnimationPreset {
        if (this.isReanimatedAvailable && this.reanimated) {
            const { withTiming, Easing } = this.reanimated;
            return {
                animation: withTiming(1, {
                    duration,
                    easing: Easing.out(Easing.quad)
                }),
                type: 'reanimated'
            };
        } else {
            return {
                animation: Animated.timing(new Animated.Value(0), {
                    toValue: 1,
                    duration,
                    useNativeDriver: true,
                }),
                type: 'animated'
            };
        }
    }

    static fadeOut(duration: number = 300): AnimationPreset {
        if (this.isReanimatedAvailable && this.reanimated) {
            const { withTiming, Easing } = this.reanimated;
            return {
                animation: withTiming(0, {
                    duration,
                    easing: Easing.in(Easing.quad)
                }),
                type: 'reanimated'
            };
        } else {
            return {
                animation: Animated.timing(new Animated.Value(1), {
                    toValue: 0,
                    duration,
                    useNativeDriver: true,
                }),
                type: 'animated'
            };
        }
    }

    static bounceIn(duration: number = 500): AnimationPreset {
        if (this.isReanimatedAvailable && this.reanimated) {
            const { withTiming, Easing } = this.reanimated;
            return {
                animation: withTiming(1, {
                    duration,
                    easing: Easing.out(Easing.bounce)
                }),
                type: 'reanimated'
            };
        } else {
            // 使用 React Native Animated API 创建弹跳效果
            return {
                animation: Animated.spring(new Animated.Value(0), {
                    toValue: 1,
                    tension: 100,
                    friction: 8,
                    useNativeDriver: true,
                }),
                type: 'animated'
            };
        }
    }

    static slideIn(direction: 'left' | 'right' | 'up' | 'down' = 'right', duration: number = 300): AnimationPreset {
        const getInitialValue = (dir: string) => {
            switch (dir) {
                case 'left': return -100;
                case 'right': return 100;
                case 'up': return -100;
                case 'down': return 100;
                default: return 100;
            }
        };

        const initialValue = getInitialValue(direction);

        if (this.isReanimatedAvailable && this.reanimated) {
            const { withTiming, Easing } = this.reanimated;
            return {
                animation: withTiming(0, {
                    duration,
                    easing: Easing.out(Easing.back(1.5))
                }),
                type: 'reanimated'
            };
        } else {
            return {
                animation: Animated.timing(new Animated.Value(initialValue), {
                    toValue: 0,
                    duration,
                    useNativeDriver: true,
                }),
                type: 'animated'
            };
        }
    }

    static scaleIn(duration: number = 300): AnimationPreset {
        if (this.isReanimatedAvailable && this.reanimated) {
            const { withTiming, Easing } = this.reanimated;
            return {
                animation: withTiming(1, {
                    duration,
                    easing: Easing.out(Easing.back(1.5))
                }),
                type: 'reanimated'
            };
        } else {
            return {
                animation: Animated.timing(new Animated.Value(0), {
                    toValue: 1,
                    duration,
                    useNativeDriver: true,
                }),
                type: 'animated'
            };
        }
    }

    static rotateIn(duration: number = 500): AnimationPreset {
        if (this.isReanimatedAvailable && this.reanimated) {
            const { withTiming, Easing } = this.reanimated;
            return {
                animation: withTiming(360, {
                    duration,
                    easing: Easing.out(Easing.back(1.5))
                }),
                type: 'reanimated'
            };
        } else {
            return {
                animation: Animated.timing(new Animated.Value(0), {
                    toValue: 1,
                    duration,
                    useNativeDriver: true,
                }),
                type: 'animated'
            };
        }
    }

    static flipIn(duration: number = 400): AnimationPreset {
        if (this.isReanimatedAvailable && this.reanimated) {
            const { withTiming, Easing } = this.reanimated;
            return {
                animation: withTiming(1, {
                    duration,
                    easing: Easing.out(Easing.back(1.5))
                }),
                type: 'reanimated'
            };
        } else {
            return {
                animation: Animated.timing(new Animated.Value(0), {
                    toValue: 1,
                    duration,
                    useNativeDriver: true,
                }),
                type: 'animated'
            };
        }
    }

    // 组合动画预设
    static slideInWithFade(direction: 'left' | 'right' | 'up' | 'down' = 'right', duration: number = 300): AnimationPreset {
        const slideAnimation = this.slideIn(direction, duration);
        const fadeAnimation = this.fadeIn(duration);

        if (this.isReanimatedAvailable && this.reanimated) {
            const { withTiming, Easing } = this.reanimated;
            return {
                animation: withTiming(1, {
                    duration,
                    easing: Easing.out(Easing.quad)
                }),
                type: 'reanimated'
            };
        } else {
            return {
                animation: Animated.parallel([
                    slideAnimation.animation as Animated.CompositeAnimation,
                    fadeAnimation.animation as Animated.CompositeAnimation
                ]),
                type: 'animated'
            };
        }
    }
}

export const AnimationPresets = AnimationPresetsService;
export default AnimationPresetsService;