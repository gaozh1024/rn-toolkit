import { Animated } from 'react-native';
import type { SpringConfig, AnimationPreset, InterpolatorPreset, InterpolatorOptions } from './types';

// 为了避免 TypeScript 编译时错误，使用动态导入的类型别名
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
  static fadeIn(value?: Animated.Value, duration: number = 300, delay: number = 0): AnimationPreset {
    if (this.isReanimatedAvailable && this.reanimated) {
      const { withTiming, Easing, runOnJS } = this.reanimated;
      const animation = withTiming(1, {
        duration,
        easing: Easing.out(Easing.quad)
      }, () => {
        if (delay > 0) {
          runOnJS(() => { })();
        }
      });
      return { animation, type: 'reanimated' };
    } else {
      // 降级到 React Native Animated API
      if (!value) {
        console.warn('[AnimationService.fadeIn] Animated.Value is required when reanimated is unavailable.');
        value = new Animated.Value(0);
      }
      const animation = Animated.timing(value, {
        toValue: 1,
        duration,
        delay,
        useNativeDriver: true,
      });
      return { animation, type: 'animated' };
    }
  }

  // 创建淡出动画
  static fadeOut(value?: Animated.Value, duration: number = 300): AnimationPreset {
    if (this.isReanimatedAvailable && this.reanimated) {
      const { withTiming, Easing } = this.reanimated;
      return {
        animation: withTiming(0, {
          duration,
          easing: Easing.in(Easing.quad)
        }), type: 'reanimated'
      };
    } else {
      // 降级到 React Native Animated API
      if (!value) {
        console.warn('[AnimationService.fadeOut] Animated.Value is required when reanimated is unavailable.');
        value = new Animated.Value(1);
      }
      return {
        animation: Animated.timing(value, {
          toValue: 0,
          duration,
          useNativeDriver: true,
        }), type: 'animated'
      };
    }
  }

  // 创建滑入动画
  static slideIn(value: Animated.Value | undefined, from: 'left' | 'right' | 'top' | 'bottom', distance: number = 100, duration: number = 300): AnimationPreset {
    const initialValue = from === 'left' || from === 'top' ? -distance : distance;

    if (this.isReanimatedAvailable && this.reanimated) {
      const { withTiming, Easing } = this.reanimated;
      return {
        animation: withTiming(0, {
          duration,
          easing: Easing.out(Easing.back(1.5))
        }), type: 'reanimated'
      };
    } else {
      // 降级到 React Native Animated API
      if (!value) {
        console.warn('[AnimationService.slideIn] Animated.Value is required when reanimated is unavailable.');
        value = new Animated.Value(initialValue);
      }
      return {
        animation: Animated.timing(value, {
          toValue: 0,
          duration,
          useNativeDriver: true,
        }), type: 'animated'
      };
    }
  }

  // 创建弹簧动画
  static spring(value: Animated.Value | undefined, toValue: number, config?: SpringConfig): AnimationPreset {
    if (this.isReanimatedAvailable && this.reanimated) {
      const { withSpring } = this.reanimated;
      return {
        animation: withSpring(toValue, {
          damping: config?.damping || 15,
          stiffness: config?.stiffness || 150,
          mass: config?.mass || 1
        }),
        type: 'reanimated'
      };
    } else {
      // 降级到 React Native Animated API
      if (!value) {
        console.warn('[AnimationService.spring] Animated.Value is required when reanimated is unavailable.');
        value = new Animated.Value(0);
      }
      return {
        animation: Animated.spring(value, {
          toValue,
          tension: config?.stiffness || 150,
          friction: config?.damping || 15,
          useNativeDriver: true,
        }),
        type: 'animated'
      };
    }
  }

  // 创建缩放动画
  static scale(value: Animated.Value | undefined, toValue: number, duration: number = 300): AnimationPreset {
    if (this.isReanimatedAvailable && this.reanimated) {
      const { withTiming, Easing } = this.reanimated;
      return {
        animation: withTiming(toValue, {
          duration,
          easing: Easing.out(Easing.back(1.5))
        }),
        type: 'reanimated'
      };
    } else {
      // 降级到 React Native Animated API
      if (!value) {
        console.warn('[AnimationService.scale] Animated.Value is required when reanimated is unavailable.');
        value = new Animated.Value(0);
      }
      return {
        animation: Animated.timing(value, {
          toValue,
          duration,
          useNativeDriver: true,
        }),
        type: 'animated'
      };
    }
  }

  // 创建旋转动画
  static rotate(value: Animated.Value | undefined, duration: number = 1000, repeat: boolean = true): AnimationPreset {
    if (this.isReanimatedAvailable && this.reanimated) {
      const { withTiming, withRepeat } = this.reanimated;
      const animation = repeat
        ? withRepeat(withTiming(360, { duration }), -1, false)
        : withTiming(360, { duration });
      return { animation, type: 'reanimated' };
    } else {
      // 降级到 React Native Animated API
      if (!value) {
        console.warn('[AnimationService.rotate] Animated.Value is required when reanimated is unavailable.');
        value = new Animated.Value(0);
      }
      const base = Animated.timing(value, {
        toValue: 1,
        duration,
        useNativeDriver: true,
      });
      const animation = repeat ? Animated.loop(base) : base;
      return { animation, type: 'animated' };
    }
  }

  // 创建序列动画
  static sequence(...animations: any[]): AnimationPreset {
    const items = animations.map((a: any) => (a && typeof a === 'object' && 'animation' in a) ? (a as AnimationPreset).animation : a);
    if (this.isReanimatedAvailable && this.reanimated) {
      const { withSequence } = this.reanimated;
      return { animation: withSequence(...items), type: 'reanimated' };
    } else {
      // 降级到 React Native Animated API
      return { animation: Animated.sequence(items as any), type: 'animated' };
    }
  }

  // 创建重复动画
  static repeat(animation: any, numberOfReps: number = -1, reverse: boolean = false): AnimationPreset {
    if (this.isReanimatedAvailable && this.reanimated) {
      const { withRepeat } = this.reanimated;
      return { animation: withRepeat(animation, numberOfReps, reverse), type: 'reanimated' };
    } else {
      // 降级到 React Native Animated API
      return { animation: Animated.loop(animation, { iterations: numberOfReps === -1 ? undefined : numberOfReps }), type: 'animated' };
    }
  }

  // 创建循环动画（归一化 0→1 循环），常用于旋转加载、进度条等
  static loop(value?: Animated.Value, duration: number = 1000, iterations: number = -1, reverse: boolean = false): AnimationPreset {
    if (this.isReanimatedAvailable && this.reanimated) {
      const { withTiming, withRepeat } = this.reanimated;
      // Reanimated: 让共享值在 0→1 区间循环变化
      return { animation: withRepeat(withTiming(1, { duration }), iterations, reverse), type: 'reanimated' };
    } else {
      // Animated: 需要一个归一化的 Animated.Value
      if (!value) {
        console.warn('[AnimationService.loop] Animated.Value is required when reanimated is unavailable. A new value will be created.');
        value = new Animated.Value(0);
      }
      const forward = Animated.timing(value, { toValue: 1, duration, useNativeDriver: true });
      const base = reverse
        ? Animated.sequence([
          forward,
          Animated.timing(value, { toValue: 0, duration, useNativeDriver: true })
        ])
        : forward;
      return { animation: Animated.loop(base as any, { iterations: iterations === -1 ? undefined : iterations }), type: 'animated' };
    }
  }

  // 并行动画：在 Animated 路径下使用 Animated.parallel，在 Reanimated 路径下返回动画数组以便分别赋值到各自的共享值
  static parallel(stopTogether: boolean = true, ...animations: any[]): AnimationPreset {
    const items = animations.map((a: any) => (a && typeof a === 'object' && 'animation' in a) ? (a as AnimationPreset).animation : a);
    if (this.isReanimatedAvailable && this.reanimated) {
      // Reanimated 没有官方 withParallel；返回动画数组，调用方需分别赋值到对应 sharedValue
      return { animation: items, type: 'reanimated' };
    } else {
      return { animation: Animated.parallel(items as any, { stopTogether }), type: 'animated' };
    }
  }

  // 交错并行动画（逐个延迟启动）：Animated 使用 Animated.stagger；Reanimated 返回经过 withDelay 包裹的动画数组
  static stagger(delayMs: number, ...animations: any[]): AnimationPreset {
    const items = animations.map((a: any) => (a && typeof a === 'object' && 'animation' in a) ? (a as AnimationPreset).animation : a);
    if (this.isReanimatedAvailable && this.reanimated) {
      const { withDelay } = this.reanimated;
      const delayed = items.map((anim: any, idx: number) => withDelay(delayMs * idx, anim));
      return { animation: delayed, type: 'reanimated' };
    } else {
      return { animation: Animated.stagger(delayMs, items as any), type: 'animated' };
    }
  }

  // 插值器：数值（返回 InterpolatorPreset，兼容两条路径）
  static interpolate(inputRange: number[], outputRange: number[], options?: InterpolatorOptions): InterpolatorPreset {
    if (this.isReanimatedAvailable && this.reanimated) {
      return {
        type: 'reanimated',
        kind: 'number',
        config: { inputRange, outputRange, options }
      };
    } else {
      // Animated 路径：提供一个 helper，用于在组件里调用 Animated.Value.interpolate
      return {
        type: 'animated',
        kind: 'number',
        value: { inputRange, outputRange, options }
      };
    }
  }

  // 插值器：角度字符串（'deg'），Animated 路径直接提供字符串输出，Reanimated 提供配置
  static interpolateDeg(inputRange: number[], outputRangeDeg: number[], options?: InterpolatorOptions): InterpolatorPreset {
    if (this.isReanimatedAvailable && this.reanimated) {
      const outputRange = outputRangeDeg.map(v => `${v}deg`);
      return {
        type: 'reanimated',
        kind: 'string',
        config: { inputRange, outputRange, options }
      };
    } else {
      return {
        type: 'animated',
        kind: 'string',
        value: { inputRange, outputRange: outputRangeDeg.map(v => `${v}deg`), options }
      };
    }
  }

  // 插值器：颜色（返回颜色字符串）
  static interpolateColor(inputRange: number[], outputColors: string[], colorSpace: 'RGB' | 'HSV' = 'RGB'): InterpolatorPreset {
    if (this.isReanimatedAvailable && this.reanimated) {
      return {
        type: 'reanimated',
        kind: 'color',
        config: { inputRange, outputRange: outputColors, options: {} as any, colorSpace }
      };
    } else {
      // Animated 原生不支持颜色插值，这里返回配置，调用方可在样式层按进度自行混色，或结合第三方库
      return {
        type: 'animated',
        kind: 'color',
        value: { inputRange, outputRange: outputColors, colorSpace }
      };
    }
  }
}

// 自动初始化 Reanimated（后台进行，无需手动调用）
void AnimationService.initializeReanimated();

export { AnimationService };
export default AnimationService;