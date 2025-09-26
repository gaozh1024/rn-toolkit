import React from 'react';
import { createStackNavigator as createRNStackNavigator } from '@react-navigation/stack';
import { StackScreenComponent, RootStackParamList } from '../types';
import { StackPresets, AnimationPresets } from '../styles';
import { useNavigationUtils } from '../utils/navigation';

const Stack = createRNStackNavigator<RootStackParamList>();

/**
 * 现代化堆栈导航器配置
 */
export interface StackNavigatorConfig {
  screens: StackScreenComponent[];
  initialRouteName?: string;
  themePreset?: 'default' | 'transparent' | 'modal' | 'headerless';
  animationPreset?: keyof typeof AnimationPresets;
  customOptions?: any;
  enableTheme?: boolean;
}

/**
 * 现代化堆栈导航器组件
 */
export const StackNavigator: React.FC<StackNavigatorConfig> = ({
  screens,
  initialRouteName,
  themePreset = 'default',
  animationPreset,
  customOptions,
  enableTheme = true,
}) => {
  const { stackStyles } = useNavigationUtils();

  // 获取主题化选项
  const getScreenOptions = () => {
    let options = {};

    // 基础预设选项
    options = {
      ...StackPresets.default,
    };

    // 主题选项
    if (enableTheme) {
      const themedOptions = stackStyles[themePreset]();
      options = {
        ...options,
        ...themedOptions,
      };
    }

    // 动画选项
    if (animationPreset) {
      const animationOptions = AnimationPresets[animationPreset];
      options = {
        ...options,
        ...animationOptions,
      };
    }

    // 自定义选项
    if (customOptions) {
      options = {
        ...options,
        ...customOptions,
      };
    }

    return options;
  };

  return (
    <Stack.Navigator
      initialRouteName={initialRouteName}
      screenOptions={getScreenOptions()}
    >
      {screens.map((screen) => (
        <Stack.Screen
          key={screen.name}
          name={screen.name}
          component={screen.component}
          options={screen.options}
          initialParams={screen.initialParams}
        />
      ))}
    </Stack.Navigator>
  );
};

/**
 * 堆栈导航器构建器
 */
export class StackNavigatorBuilder {
  private config: StackNavigatorConfig = {
    screens: [],
    enableTheme: true,
    themePreset: 'default',
  };

  /**
   * 设置屏幕
   */
  setScreens(screens: StackScreenComponent[]): this {
    this.config.screens = screens;
    return this;
  }

  /**
   * 添加单个屏幕
   */
  addScreen(screen: StackScreenComponent): this {
    this.config.screens.push(screen);
    return this;
  }

  /**
   * 设置初始路由
   */
  setInitialRoute(routeName: string): this {
    this.config.initialRouteName = routeName;
    return this;
  }

  /**
   * 设置主题预设
   */
  setThemePreset(preset: 'default' | 'transparent' | 'modal' | 'headerless'): this {
    this.config.themePreset = preset;
    return this;
  }

  /**
   * 设置动画预设
   */
  setAnimationPreset(preset: keyof typeof AnimationPresets): this {
    this.config.animationPreset = preset;
    return this;
  }

  /**
   * 设置自定义选项
   */
  setCustomOptions(options: any): this {
    this.config.customOptions = options;
    return this;
  }

  /**
   * 启用/禁用主题
   */
  setThemeEnabled(enabled: boolean): this {
    this.config.enableTheme = enabled;
    return this;
  }

  /**
   * 构建导航器组件
   */
  build(): React.FC {
    const config = { ...this.config };
    return () => <StackNavigator {...config} />;
  }

  /**
   * 获取配置
   */
  getConfig(): StackNavigatorConfig {
    return { ...this.config };
  }
}

/**
 * 创建堆栈导航器的工厂函数
 */
export const createStackNavigation = (config: StackNavigatorConfig) => {
  return () => <StackNavigator {...config} />;
};

/**
 * 创建堆栈导航器构建器
 */
export const createStackNavigatorBuilder = () => {
  return new StackNavigatorBuilder();
};

/**
 * 快速创建堆栈导航器的便捷函数
 */
export const StackNavigatorFactory = {
  /**
   * 创建默认堆栈导航器
   */
  default: (screens: StackScreenComponent[], initialRoute?: string) =>
    createStackNavigation({
      screens,
      initialRouteName: initialRoute,
      themePreset: 'default',
    }),

  /**
   * 创建透明堆栈导航器
   */
  transparent: (screens: StackScreenComponent[], initialRoute?: string) =>
    createStackNavigation({
      screens,
      initialRouteName: initialRoute,
      themePreset: 'transparent',
    }),

  /**
   * 创建模态堆栈导航器
   */
  modal: (screens: StackScreenComponent[], initialRoute?: string) =>
    createStackNavigation({
      screens,
      initialRouteName: initialRoute,
      themePreset: 'modal',
      animationPreset: 'slideVertical',
    }),

  /**
   * 创建无头部堆栈导航器
   */
  headerless: (screens: StackScreenComponent[], initialRoute?: string) =>
    createStackNavigation({
      screens,
      initialRouteName: initialRoute,
      themePreset: 'headerless',
    }),

  /**
   * 创建带动画的堆栈导航器
   */
  animated: (
    screens: StackScreenComponent[], 
    animation: keyof typeof AnimationPresets,
    initialRoute?: string
  ) =>
    createStackNavigation({
      screens,
      initialRouteName: initialRoute,
      animationPreset: animation,
    }),

  /**
   * 创建自定义堆栈导航器
   */
  custom: (config: StackNavigatorConfig) => createStackNavigation(config),
} as const;

// 默认导出
export default StackNavigator;