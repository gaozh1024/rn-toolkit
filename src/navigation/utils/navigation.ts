import { StackNavigationOptions } from '@react-navigation/stack';
import { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import {
  NavigationThemes,
  StackPresets,
  TabPresets,
  AnimationPresets,
  getTransitionConfig
} from '../styles';
import { ReactNavigationTheme } from '../types/navigation';

/**
 * 现代化导航工具类
 */
export class NavigationUtils {
  /**
   * 获取主题化的堆栈导航选项
   */
  static getStackOptions(preset: 'default' | 'transparent' | 'modal' | 'headerless' = 'default'): StackNavigationOptions {
    const themeOptions = NavigationThemes.Stack[preset]();
    const presetOptions = StackPresets.default;

    return {
      ...presetOptions,
      ...themeOptions,
    };
  }

  /**
   * 获取主题化的标签页导航选项
   */
  static getTabOptions(preset: 'default' | 'minimal' | 'floating' = 'default'): BottomTabNavigationOptions {
    const themeOptions = NavigationThemes.Tab[preset]();
    const presetOptions = TabPresets.default;

    return {
      ...presetOptions,
      ...themeOptions,
    };
  }

  /**
   * 创建带动画的堆栈选项
   */
  static createAnimatedStack(
    animation: keyof typeof AnimationPresets,
    themePreset: 'default' | 'transparent' | 'modal' | 'headerless' = 'default'
  ): StackNavigationOptions {
    return {
      ...this.getStackOptions(themePreset),
      ...AnimationPresets[animation],
    };
  }

  /**
   * 创建过渡动画选项
   */
  static createTransition(mode: 'horizontalIOS' | 'verticalIOS' | 'modalIOS' | 'fadeAndroid' | 'scaleAndroid' | 'none'): StackNavigationOptions {
    return getTransitionConfig(mode);
  }

  /**
   * 获取当前主题
   */
  static getCurrentTheme(): ReactNavigationTheme {
    return NavigationThemes.getTheme();
  }

  /**
   * 创建屏幕配置
   */
  static createScreen<T extends Record<string, any>>(config: {
    name: string;
    component: React.ComponentType<any>;
    options?: StackNavigationOptions;
    initialParams?: T;
    themePreset?: 'default' | 'transparent' | 'modal' | 'headerless';
  }) {
    return {
      name: config.name,
      component: config.component,
      options: {
        ...this.getStackOptions(config.themePreset),
        ...config.options,
      },
      initialParams: config.initialParams,
    };
  }

  /**
   * 创建标签页配置
   */
  static createTab<T extends Record<string, any>>(config: {
    name: string;
    component: React.ComponentType<any>;
    options?: BottomTabNavigationOptions;
    initialParams?: T;
    themePreset?: 'default' | 'minimal' | 'floating';
  }) {
    return {
      name: config.name,
      component: config.component,
      options: {
        ...this.getTabOptions(config.themePreset),
        ...config.options,
      },
      initialParams: config.initialParams,
    };
  }

  /**
   * 批量创建屏幕配置
   */
  static createScreens(screens: Array<{
    name: string;
    component: React.ComponentType<any>;
    options?: StackNavigationOptions;
    initialParams?: any;
    themePreset?: 'default' | 'transparent' | 'modal' | 'headerless';
  }>) {
    return screens.map(screen => this.createScreen(screen));
  }

  /**
   * 批量创建标签页配置
   */
  static createTabs(tabs: Array<{
    name: string;
    component: React.ComponentType<any>;
    options?: BottomTabNavigationOptions;
    initialParams?: any;
    themePreset?: 'default' | 'minimal' | 'floating';
  }>) {
    return tabs.map(tab => this.createTab(tab));
  }
}

/**
 * 导航选项生成器
 */
export const NavigationGenerator = {
  /**
   * 堆栈选项
   */
  stack: {
    default: () => NavigationUtils.getStackOptions('default'),
    transparent: () => NavigationUtils.getStackOptions('transparent'),
    modal: () => NavigationUtils.getStackOptions('modal'),
    headerless: () => NavigationUtils.getStackOptions('headerless'),
    animated: (animation: keyof typeof AnimationPresets) =>
      NavigationUtils.createAnimatedStack(animation),
  },

  /**
   * 标签页选项
   */
  tab: {
    default: () => NavigationUtils.getTabOptions('default'),
    minimal: () => NavigationUtils.getTabOptions('minimal'),
    floating: () => NavigationUtils.getTabOptions('floating'),
  },

  /**
   * 过渡动画
   */
  transition: {
    horizontal: () => NavigationUtils.createTransition('horizontalIOS'),
    vertical: () => NavigationUtils.createTransition('verticalIOS'),
    modal: () => NavigationUtils.createTransition('modalIOS'),
    fade: () => NavigationUtils.createTransition('fadeAndroid'),
    scale: () => NavigationUtils.createTransition('scaleAndroid'),
    none: () => NavigationUtils.createTransition('none'),
  },
} as const;

/**
 * 主题钩子
 */
export const useNavigationUtils = () => {
  const theme = NavigationThemes.useTheme();

  return {
    theme: theme.theme,
    stackStyles: theme.stackStyles,
    tabStyles: theme.tabStyles,
    utils: NavigationUtils,
    generator: NavigationGenerator,
  };
};

// 默认导出
export default NavigationUtils;