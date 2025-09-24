import React from 'react';
import { StackNavigationOptions } from '@react-navigation/stack';
import { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { PlatformPressable } from '@react-navigation/elements';
import styleService from '../theme/ThemeService';

// 基于主题的导航样式生成器
export const createThemedNavigationStyles = () => {
  const theme = styleService.getTheme();
  const colors = styleService.getAppTheme().currentColors;

  return {
    // 透明头部
    transparent: (): StackNavigationOptions => ({
      headerTransparent: true,
      headerStyle: {
        backgroundColor: 'transparent',
      },
    }),

    // 隐藏头部
    hidden: (): StackNavigationOptions => ({
      headerShown: false,
    }),

    // 主题适配的头部样式
    themed: (): StackNavigationOptions => ({
      headerStyle: {
        backgroundColor: colors.background,
        borderBottomColor: colors.border,
        height: theme.navigation?.headerHeight || 56,
      },
      headerTintColor: colors.text,
      headerTitleStyle: {
        color: colors.text,
      },
    }),

    // 深色主题（保持向后兼容）
    dark: (): StackNavigationOptions => ({
      headerStyle: {
        backgroundColor: '#000000',
      },
      headerTintColor: '#ffffff',
      headerTitleStyle: {
        color: '#ffffff',
      },
    }),

    // 浅色主题（保持向后兼容）
    light: (): StackNavigationOptions => ({
      headerStyle: {
        backgroundColor: '#ffffff',
      },
      headerTintColor: '#000000',
      headerTitleStyle: {
        color: '#000000',
      },
    }),

    // 无阴影头部
    noShadow: (): StackNavigationOptions => ({
      headerShadowVisible: false,
    }),

    // 自定义返回按钮
    customBack: (onPress: () => void): StackNavigationOptions => ({
      headerLeft: () => null, // 需要在组件中自定义
    }),
  };
};

// 基于主题的标签页样式生成器
export const createThemedTabStyles = () => {
  const theme = styleService.getTheme();
  const colors = styleService.getAppTheme().currentColors;

  return {
    // 隐藏头部
    hidden: (): BottomTabNavigationOptions => ({
      headerShown: false,
    }),

    // 主题适配的标签页样式
    themed: (): BottomTabNavigationOptions => ({
      headerShown: false, // 默认隐藏头部
      tabBarStyle: {
        backgroundColor: colors.surface,
        borderTopColor: colors.border,
        height: theme.navigation?.tabBarHeight || 60,
      },
      tabBarActiveTintColor: colors.primary,
      tabBarInactiveTintColor: colors.textSecondary,
      tabBarLabelStyle: {
        fontSize: 12,
      },
    }),

    // 深色标签栏（保持向后兼容）
    dark: (): BottomTabNavigationOptions => ({
      tabBarStyle: {
        backgroundColor: '#000000',
      },
      tabBarActiveTintColor: '#ffffff',
      tabBarInactiveTintColor: '#666666',
    }),

    // 浅色标签栏（保持向后兼容）
    light: (): BottomTabNavigationOptions => ({
      tabBarStyle: {
        backgroundColor: '#ffffff',
      },
      tabBarActiveTintColor: '#000000',
      tabBarInactiveTintColor: '#999999',
    }),
  };
};

// 预设的导航样式（使用主题）
export const NavigationStyles = createThemedNavigationStyles();

// 标签页样式预设（使用主题）
export const TabStyles = createThemedTabStyles();

// 导航动画预设
export const NavigationAnimations = {
  // 从右侧滑入
  slideFromRight: (): StackNavigationOptions => ({
    cardStyleInterpolator: ({ current, layouts }) => {
      return {
        cardStyle: {
          transform: [
            {
              translateX: current.progress.interpolate({
                inputRange: [0, 1],
                outputRange: [layouts.screen.width, 0],
              }),
            },
          ],
        },
      };
    },
  }),

  // 淡入淡出
  fade: (): StackNavigationOptions => ({
    cardStyleInterpolator: ({ current }) => {
      return {
        cardStyle: {
          opacity: current.progress,
        },
      };
    },
  }),

  // 从底部滑入
  slideFromBottom: (): StackNavigationOptions => ({
    cardStyleInterpolator: ({ current, layouts }) => {
      return {
        cardStyle: {
          transform: [
            {
              translateY: current.progress.interpolate({
                inputRange: [0, 1],
                outputRange: [layouts.screen.height, 0],
              }),
            },
          ],
        },
      };
    },
  }),
};

export const createStackScreens = (screens: Array<{
  name: string;
  component: React.ComponentType<any>;
  options?: StackNavigationOptions;
}>) => {
  return screens;
};

export const createTabScreens = (tabs: Array<{
  name: string;
  component: React.ComponentType<any>;
  options?: BottomTabNavigationOptions;
}>) => {
  return tabs;
};

// 无水滴效果的标签页按钮组件
const NoRippleTabButton = (props: any) =>
  React.createElement(PlatformPressable, {
    ...props,
    android_ripple: { color: 'transparent' }, // 禁用Android水滴效果
    pressColor: 'transparent', // 禁用Android按压颜色
    pressOpacity: 0.3, // iOS按压透明度
  });

// Stack Navigator 禁用水滴效果配置
export const noRippleStackOptions: StackNavigationOptions = {
  headerPressColor: 'transparent', // 禁用头部按钮的水滴效果
  headerPressOpacity: 0.3, // 设置按压透明度
};

// Tab Navigator 禁用水滴效果配置
export const noRippleTabOptions: BottomTabNavigationOptions = {
  tabBarButton: NoRippleTabButton,
  headerShown: false, // 默认隐藏tab页头部
};

// 获取主题化的默认导航选项
export const getThemedNavigationOptions = (): StackNavigationOptions => {
  const colors = styleService.getAppTheme().currentColors;

  return {
    ...noRippleStackOptions,
    headerStyle: {
      backgroundColor: colors.surface,
      borderBottomColor: colors.border,
    },
    headerTintColor: colors.text,
    headerTitleStyle: {
      color: colors.text,
    },
  };
};

// 获取主题化的默认标签页选项
export const getThemedTabOptions = (): BottomTabNavigationOptions => {
  const theme = styleService.getTheme();
  const colors = styleService.getAppTheme().currentColors;

  return {
    headerShown: false, // 默认隐藏头部
    tabBarStyle: {
      backgroundColor: colors.surface,
      borderTopColor: colors.border,
      height: theme.navigation?.tabBarHeight || 60,
    },
    tabBarActiveTintColor: colors.primary,
    tabBarInactiveTintColor: colors.textSecondary,
    tabBarLabelStyle: {
      fontSize: 12,
    },
  };
};