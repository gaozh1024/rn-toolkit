import { useSharedValue, useAnimatedStyle } from 'react-native-reanimated';
import AnimationService from './AnimationService';

// 预设动画效果
export const AnimationPresets = {
  // 淡入淡出
  fadeInOut: (visible: boolean, duration: number = 300) => {
    const opacity = useSharedValue(visible ? 1 : 0);
    
    const animatedStyle = useAnimatedStyle(() => ({
      opacity: visible 
        ? AnimationService.fadeIn(duration)
        : AnimationService.fadeOut(duration)
    }));

    return { animatedStyle, opacity };
  },

  // 弹跳进入
  bounceIn: (visible: boolean) => {
    const scale = useSharedValue(visible ? 1 : 0);
    
    const animatedStyle = useAnimatedStyle(() => ({
      transform: [
        { 
          scale: visible 
            ? AnimationService.spring(1, { damping: 8, stiffness: 100 })
            : AnimationService.spring(0, { damping: 8, stiffness: 100 })
        }
      ]
    }));

    return { animatedStyle, scale };
  },

  // 滑动进入
  slideInFromBottom: (visible: boolean, distance: number = 100) => {
    const translateY = useSharedValue(visible ? 0 : distance);
    
    const animatedStyle = useAnimatedStyle(() => ({
      transform: [
        { 
          translateY: visible 
            ? AnimationService.slideIn('bottom', distance)
            : AnimationService.slideIn('top', -distance)
        }
      ]
    }));

    return { animatedStyle, translateY };
  }
};