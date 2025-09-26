import { StackNavigationOptions } from '@react-navigation/stack';

// 导航翻页模式预设
export const NavigationTransitions = {
  // iOS 水平翻页（默认）
  horizontalIOS: (): StackNavigationOptions => ({
    cardStyleInterpolator: ({ current, next, layouts }) => {
      const translateFocused = current.progress.interpolate({
        inputRange: [0, 1],
        outputRange: [layouts.screen.width, 0],
        extrapolate: 'clamp',
      });

      const translateUnfocused = next
        ? next.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [0, layouts.screen.width * -0.3],
            extrapolate: 'clamp',
          })
        : 0;

      const overlayOpacity = current.progress.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 0.07],
        extrapolate: 'clamp',
      });

      const shadowOpacity = current.progress.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 0.3],
        extrapolate: 'clamp',
      });

      return {
        cardStyle: {
          transform: [{ translateX: translateFocused }],
        },
        overlayStyle: {
          opacity: overlayOpacity,
        },
        shadowStyle: {
          shadowOpacity,
        },
      };
    },
    gestureDirection: 'horizontal',
  }),

  // iOS 垂直翻页
  verticalIOS: (): StackNavigationOptions => ({
    cardStyleInterpolator: ({ current, layouts }) => {
      return {
        cardStyle: {
          transform: [
            {
              translateY: current.progress.interpolate({
                inputRange: [0, 1],
                outputRange: [layouts.screen.height, 0],
                extrapolate: 'clamp',
              }),
            },
          ],
        },
      };
    },
    gestureDirection: 'vertical',
  }),

  // iOS 模态翻页
  modalIOS: (): StackNavigationOptions => ({
    cardStyleInterpolator: ({ current, layouts, index }) => {
      const translateY = current.progress.interpolate({
        inputRange: [0, 1],
        outputRange: [layouts.screen.height, 0],
        extrapolate: 'clamp',
      });

      const overlayOpacity = current.progress.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 0.5],
        extrapolate: 'clamp',
      });

      return {
        cardStyle: {
          transform: [{ translateY }],
        },
        overlayStyle: {
          opacity: index > 0 ? overlayOpacity : 0,
        },
      };
    },
    gestureDirection: 'vertical',
  }),

  // Android 淡入淡出
  fadeAndroid: (): StackNavigationOptions => ({
    cardStyleInterpolator: ({ current }) => {
      return {
        cardStyle: {
          opacity: current.progress,
        },
      };
    },
  }),

  // Android 缩放
  scaleAndroid: (): StackNavigationOptions => ({
    cardStyleInterpolator: ({ current }) => {
      return {
        cardStyle: {
          opacity: current.progress,
          transform: [
            {
              scale: current.progress.interpolate({
                inputRange: [0, 1],
                outputRange: [0.9, 1],
                extrapolate: 'clamp',
              }),
            },
          ],
        },
      };
    },
  }),

  // 无动画
  none: (): StackNavigationOptions => ({
    cardStyleInterpolator: () => ({
      cardStyle: {},
    }),
  }),
};

// 默认翻页模式配置
export const defaultTransitionMode = 'horizontalIOS';

// 获取翻页模式配置
export const getTransitionConfig = (mode: keyof typeof NavigationTransitions = defaultTransitionMode): StackNavigationOptions => {
  return NavigationTransitions[mode]();
};