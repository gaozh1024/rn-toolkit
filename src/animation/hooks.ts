// import { useSharedValue, useAnimatedStyle, withTiming, withSpring } from 'react-native-reanimated';
// import { useEffect } from 'react';

// // 淡入淡出Hook
// export const useFadeAnimation = (visible: boolean, duration: number = 300) => {
//   const opacity = useSharedValue(visible ? 1 : 0);

//   const animatedStyle = useAnimatedStyle(() => ({
//     opacity: withTiming(opacity.value, { duration })
//   }));

//   useEffect(() => {
//     opacity.value = visible ? 1 : 0;
//   }, [visible, opacity]);

//   return animatedStyle;
// };

// // 缩放动画Hook
// export const useScaleAnimation = (visible: boolean, duration: number = 300) => {
//   const scale = useSharedValue(visible ? 1 : 0);

//   const animatedStyle = useAnimatedStyle(() => ({
//     transform: [{ scale: withSpring(scale.value) }]
//   }));

//   useEffect(() => {
//     scale.value = visible ? 1 : 0;
//   }, [visible, scale]);

//   return animatedStyle;
// };

// // 滑动动画Hook
// export const useSlideAnimation = (
//   visible: boolean, 
//   direction: 'x' | 'y' = 'y', 
//   distance: number = 100
// ) => {
//   const translate = useSharedValue(visible ? 0 : distance);

//   const animatedStyle = useAnimatedStyle(() => ({
//     transform: direction === 'x' 
//       ? [{ translateX: withSpring(translate.value) }]
//       : [{ translateY: withSpring(translate.value) }]
//   }));

//   useEffect(() => {
//     translate.value = visible ? 0 : distance;
//   }, [visible, translate, distance]);

//   return animatedStyle;
// };