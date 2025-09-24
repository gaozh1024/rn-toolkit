import { useState, useEffect, useCallback, useRef } from 'react';
import { Animated } from 'react-native';

export const useAnimation = () => {
    const [isReanimatedAvailable, setIsReanimatedAvailable] = useState(false);
    const reanimatedRef = useRef<any>(null);

    useEffect(() => {
        const initReanimated = async () => {
            try {
                const reanimated = await import('react-native-reanimated');
                reanimatedRef.current = reanimated;
                setIsReanimatedAvailable(true);
            } catch (error) {
                setIsReanimatedAvailable(false);
            }
        };
        initReanimated();
    }, []);

    const fadeIn = useCallback((duration: number = 300) => {
        if (isReanimatedAvailable && reanimatedRef.current) {
            const { withTiming, Easing } = reanimatedRef.current;
            return withTiming(1, {
                duration,
                easing: Easing.out(Easing.quad)
            });
        } else {
            return Animated.timing(new Animated.Value(0), {
                toValue: 1,
                duration,
                useNativeDriver: true,
            });
        }
    }, [isReanimatedAvailable]);

    const fadeOut = useCallback((duration: number = 300) => {
        if (isReanimatedAvailable && reanimatedRef.current) {
            const { withTiming, Easing } = reanimatedRef.current;
            return withTiming(0, {
                duration,
                easing: Easing.in(Easing.quad)
            });
        } else {
            return Animated.timing(new Animated.Value(1), {
                toValue: 0,
                duration,
                useNativeDriver: true,
            });
        }
    }, [isReanimatedAvailable]);

    const slideIn = useCallback((from: 'left' | 'right' | 'top' | 'bottom' = 'left', distance: number = 100, duration: number = 300) => {
        const initialValue = from === 'left' || from === 'top' ? -distance : distance;

        if (isReanimatedAvailable && reanimatedRef.current) {
            const { withTiming, Easing } = reanimatedRef.current;
            return withTiming(0, {
                duration,
                easing: Easing.out(Easing.back(1.5))
            });
        } else {
            return Animated.timing(new Animated.Value(initialValue), {
                toValue: 0,
                duration,
                useNativeDriver: true,
            });
        }
    }, [isReanimatedAvailable]);

    const scale = useCallback((toValue: number = 1, duration: number = 300) => {
        if (isReanimatedAvailable && reanimatedRef.current) {
            const { withTiming, Easing } = reanimatedRef.current;
            return withTiming(toValue, {
                duration,
                easing: Easing.out(Easing.back(1.5))
            });
        } else {
            return Animated.timing(new Animated.Value(0), {
                toValue,
                duration,
                useNativeDriver: true,
            });
        }
    }, [isReanimatedAvailable]);

    return {
        fadeIn,
        fadeOut,
        slideIn,
        scale,
        isReanimatedAvailable
    };
};

// 可选的 reanimated hooks（仅在可用时导出）
export const useSharedValue = (initialValue: number) => {
    const [isReanimatedAvailable, setIsReanimatedAvailable] = useState(false);
    const [sharedValue, setSharedValue] = useState<any>(null);

    useEffect(() => {
        const initReanimated = async () => {
            try {
                const reanimated = await import('react-native-reanimated');
                if (reanimated.useSharedValue) {
                    const value = reanimated.useSharedValue(initialValue);
                    setSharedValue(value);
                    setIsReanimatedAvailable(true);
                }
            } catch (error) {
                // 降级到普通状态值
                setSharedValue({ value: initialValue });
                setIsReanimatedAvailable(false);
            }
        };
        initReanimated();
    }, [initialValue]);

    return sharedValue || { value: initialValue };
};

export const useAnimatedStyle = (styleFunction: () => any, dependencies?: any[]) => {
    const [isReanimatedAvailable, setIsReanimatedAvailable] = useState(false);
    const [animatedStyle, setAnimatedStyle] = useState<any>({});

    useEffect(() => {
        const initReanimated = async () => {
            try {
                const reanimated = await import('react-native-reanimated');
                if (reanimated.useAnimatedStyle) {
                    const style = reanimated.useAnimatedStyle(styleFunction, dependencies);
                    setAnimatedStyle(style);
                    setIsReanimatedAvailable(true);
                }
            } catch (error) {
                // 降级到普通样式对象
                setAnimatedStyle(styleFunction());
                setIsReanimatedAvailable(false);
            }
        };
        initReanimated();
    }, dependencies);

    return animatedStyle;
};

// 其他常用的动画 hooks
export const useFadeAnimation = (initialValue: number = 0) => {
    const fadeAnim = useRef(new Animated.Value(initialValue)).current;

    const fadeIn = useCallback((duration: number = 300) => {
        return Animated.timing(fadeAnim, {
            toValue: 1,
            duration,
            useNativeDriver: true,
        });
    }, [fadeAnim]);

    const fadeOut = useCallback((duration: number = 300) => {
        return Animated.timing(fadeAnim, {
            toValue: 0,
            duration,
            useNativeDriver: true,
        });
    }, [fadeAnim]);

    return { fadeAnim, fadeIn, fadeOut };
};

export const useScaleAnimation = (initialValue: number = 0) => {
    const scaleAnim = useRef(new Animated.Value(initialValue)).current;

    const scaleIn = useCallback((duration: number = 300) => {
        return Animated.timing(scaleAnim, {
            toValue: 1,
            duration,
            useNativeDriver: true,
        });
    }, [scaleAnim]);

    const scaleOut = useCallback((duration: number = 300) => {
        return Animated.timing(scaleAnim, {
            toValue: 0,
            duration,
            useNativeDriver: true,
        });
    }, [scaleAnim]);

    return { scaleAnim, scaleIn, scaleOut };
};

export const useSlideAnimation = (initialValue: number = -100) => {
    const slideAnim = useRef(new Animated.Value(initialValue)).current;

    const slideIn = useCallback((duration: number = 300) => {
        return Animated.timing(slideAnim, {
            toValue: 0,
            duration,
            useNativeDriver: true,
        });
    }, [slideAnim]);

    const slideOut = useCallback((toValue: number = -100, duration: number = 300) => {
        return Animated.timing(slideAnim, {
            toValue,
            duration,
            useNativeDriver: true,
        });
    }, [slideAnim]);

    return { slideAnim, slideIn, slideOut };
};

export const useSequenceAnimation = () => {
    const runSequence = useCallback((animations: Animated.CompositeAnimation[]) => {
        return Animated.sequence(animations);
    }, []);

    return { runSequence };
};