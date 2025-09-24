// import {
//   useSharedValue,
//   useAnimatedStyle,
//   withTiming,
//   withSpring,
//   withSequence,
//   withRepeat,
//   runOnJS,
//   Easing
// } from 'react-native-reanimated';

// export interface AnimationConfig {
//   duration?: number;
//   easing?: any;
//   delay?: number;
// }

// export interface SpringConfig {
//   damping?: number;
//   stiffness?: number;
//   mass?: number;
// }

// class AnimationService {
//   // 创建淡入动画
//   static fadeIn(duration: number = 300, delay: number = 0) {
//     return withTiming(1, {
//       duration,
//       easing: Easing.out(Easing.quad)
//     }, () => {
//       if (delay > 0) {
//         runOnJS(() => {})();
//       }
//     });
//   }

//   // 创建淡出动画
//   static fadeOut(duration: number = 300) {
//     return withTiming(0, {
//       duration,
//       easing: Easing.in(Easing.quad)
//     });
//   }

//   // 创建滑入动画
//   static slideIn(from: 'left' | 'right' | 'top' | 'bottom', distance: number = 100, duration: number = 300) {
//     const initialValue = from === 'left' || from === 'top' ? -distance : distance;
//     return withTiming(0, {
//       duration,
//       easing: Easing.out(Easing.back(1.5))
//     });
//   }

//   // 创建弹簧动画
//   static spring(toValue: number, config?: SpringConfig) {
//     return withSpring(toValue, {
//       damping: config?.damping || 15,
//       stiffness: config?.stiffness || 150,
//       mass: config?.mass || 1
//     });
//   }

//   // 创建缩放动画
//   static scale(toValue: number, duration: number = 300) {
//     return withTiming(toValue, {
//       duration,
//       easing: Easing.out(Easing.back(1.5))
//     });
//   }

//   // 创建旋转动画
//   static rotate(duration: number = 1000, repeat: boolean = true) {
//     const rotation = repeat 
//       ? withRepeat(withTiming(360, { duration }), -1, false)
//       : withTiming(360, { duration });
//     return rotation;
//   }

//   // 创建序列动画
//   static sequence(...animations: any[]) {
//     return withSequence(...animations);
//   }

//   // 创建重复动画
//   static repeat(animation: any, numberOfReps: number = -1, reverse: boolean = false) {
//     return withRepeat(animation, numberOfReps, reverse);
//   }
// }

// export default AnimationService;