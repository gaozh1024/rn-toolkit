import React from 'react';
import { Animated } from 'react-native';
import AnimationService from '../../animation/AnimationService';

export type PressRotateOptions = {
  animationName?: 'none' | 'rotate';
  iterations?: number;
  duration?: number;
  disabled?: boolean;
};

export function useIconPressRotate(
  value: Animated.Value,
  options: PressRotateOptions
) {
  const {
    animationName = 'none',
    iterations = 0,
    duration = 400,
    disabled = false,
  } = options;

  const isAnimatingRef = React.useRef(false);

  const degCfg = React.useMemo(
    () => AnimationService.interpolateDeg([0, 1], [0, 360]),
    []
  );

  const rotateStyle =
    animationName === 'rotate'
      ? {
          transform: [
            {
              rotate: value.interpolate(
                degCfg.type === 'animated'
                  ? (degCfg.value as any)
                  : { inputRange: [0, 1], outputRange: ['0deg', '360deg'] }
              ),
            },
          ],
        }
      : undefined;

  const runPressAnimation = React.useCallback(async () => {
    if (disabled) return;
    if (animationName !== 'rotate' || iterations <= 0) return;
    if (isAnimatingRef.current) return;

    isAnimatingRef.current = true;

    const runOnce = () =>
      new Promise<void>((resolve) => {
        const preset = AnimationService.rotate(value, duration, false);
        if (preset.type === 'animated') {
          value.setValue(0);
          preset.animation.start(() => resolve());
        } else {
          value.setValue(0);
          Animated.timing(value, {
            toValue: 1,
            duration,
            useNativeDriver: true,
          }).start(() => resolve());
        }
      });

    for (let i = 0; i < iterations; i++) {
      await runOnce();
    }
    value.setValue(0);
    isAnimatingRef.current = false;
  }, [animationName, iterations, disabled, duration, value]);

  return { rotateStyle, runPressAnimation };
}