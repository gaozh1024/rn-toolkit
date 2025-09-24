import { Animated } from 'react-native';
import type { SpringConfig } from './types';

// 为了避免 TypeScript 编译时错误，使用动态导入
type ReanimatedModule = typeof import('react-native-reanimated');

class AnimationService {
  private static reanimated: ReanimatedModule | null = null;
  private static isReanimatedAvailable = false;

  static async initializeReanimated() {
    try {
      // 使用动态导入避免编译时依赖检查
      this.reanimated = await import('react-native-reanimated');
      this.isReanimatedAvailable = true;
    } catch (error) {
      console.warn('react-native-reanimated not available, falling back to React Native Animated API');
      this.isReanimatedAvailable = false;
    }
  }

  // 创建淡入动画 - 支持降级
  static fadeIn(duration: number = 300, delay: number = 0) {
    if (this.isReanimatedAvailable && this.reanimated) {
      const { withTiming, Easing, runOnJS } = this.reanimated;
      return withTiming(1, {
        duration,
        easing: Easing.out(Easing.quad)
      }, () => {
        if (delay > 0) {
          runOnJS(() => { })();
        }
      });
    } else {
      // 降级到 React Native Animated API
      return Animated.timing(new Animated.Value(0), {
        toValue: 1,
        duration,
        delay,
        useNativeDriver: true,
      });
    }
  }

  // 创建淡出动画
  static fadeOut(duration: number = 300) {
    if (this.isReanimatedAvailable && this.reanimated) {
      const { withTiming, Easing } = this.reanimated;
      return withTiming(0, {
        duration,
        easing: Easing.in(Easing.quad)
      });
    } else {
      // 降级到 React Native Animated API
      return Animated.timing(new Animated.Value(1), {
        toValue: 0,
        duration,
        useNativeDriver: true,
      });
    }
  }

  // 创建滑入动画
  static slideIn(from: 'left' | 'right' | 'top' | 'bottom', distance: number = 100, duration: number = 300) {
    const initialValue = from === 'left' || from === 'top' ? -distance : distance;

    if (this.isReanimatedAvailable && this.reanimated) {
      const { withTiming, Easing } = this.reanimated;
      return withTiming(0, {
        duration,
        easing: Easing.out(Easing.back(1.5))
      });
    } else {
      // 降级到 React Native Animated API
      return Animated.timing(new Animated.Value(initialValue), {
        toValue: 0,
        duration,
        useNativeDriver: true,
      });
    }
  }

  // 创建弹簧动画
  static spring(toValue: number, config?: SpringConfig) {
    if (this.isReanimatedAvailable && this.reanimated) {
      const { withSpring } = this.reanimated;
      return withSpring(toValue, {
        damping: config?.damping || 15,
        stiffness: config?.stiffness || 150,
        mass: config?.mass || 1
      });
    } else {
      // 降级到 React Native Animated API
      return Animated.spring(new Animated.Value(0), {
        toValue,
        tension: config?.stiffness || 150,
        friction: config?.damping || 15,
        useNativeDriver: true,
      });
    }
  }

  // 创建缩放动画
  static scale(toValue: number, duration: number = 300) {
    if (this.isReanimatedAvailable && this.reanimated) {
      const { withTiming, Easing } = this.reanimated;
      return withTiming(toValue, {
        duration,
        easing: Easing.out(Easing.back(1.5))
      });
    } else {
      // 降级到 React Native Animated API
      return Animated.timing(new Animated.Value(0), {
        toValue,
        duration,
        useNativeDriver: true,
      });
    }
  }

  // 创建旋转动画
  static rotate(duration: number = 1000, repeat: boolean = true) {
    if (this.isReanimatedAvailable && this.reanimated) {
      const { withTiming, withRepeat } = this.reanimated;
      const rotation = repeat
        ? withRepeat(withTiming(360, { duration }), -1, false)
        : withTiming(360, { duration });
      return rotation;
    } else {
      // 降级到 React Native Animated API
      const animatedValue = new Animated.Value(0);
      const animation = Animated.timing(animatedValue, {
        toValue: 1,
        duration,
        useNativeDriver: true,
      });

      if (repeat) {
        return Animated.loop(animation);
      } else {
        return animation;
      }
    }
  }

  // 创建序列动画
  static sequence(...animations: any[]) {
    if (this.isReanimatedAvailable && this.reanimated) {
      const { withSequence } = this.reanimated;
      return withSequence(...animations);
    } else {
      // 降级到 React Native Animated API
      return Animated.sequence(animations);
    }
  }

  // 创建重复动画
  static repeat(animation: any, numberOfReps: number = -1, reverse: boolean = false) {
    if (this.isReanimatedAvailable && this.reanimated) {
      const { withRepeat } = this.reanimated;
      return withRepeat(animation, numberOfReps, reverse);
    } else {
      // 降级到 React Native Animated API
      return Animated.loop(animation, { iterations: numberOfReps === -1 ? undefined : numberOfReps });
    }
  }
}

export { AnimationService };
export default AnimationService;