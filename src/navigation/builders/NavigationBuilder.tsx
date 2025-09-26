import React from 'react';
import { StackNavigationOptions } from '@react-navigation/stack';
import { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { StackScreenComponent, TabScreenComponent, TransitionMode } from '../types';
import { StackNavigator, TabNavigator, NavigationContainer } from '../components';
import { NavigationUtils, useNavigationUtils } from '../utils/navigation';

/**
 * 标签页配置接口
 */
export interface TabBuilderConfig {
  title?: string;
  icon?: (props: { color: string; size: number; focused: boolean }) => React.ReactNode;
  badge?: string | number;
  options?: BottomTabNavigationOptions;
  disableTheme?: boolean;
}

/**
 * 屏幕配置接口
 */
export interface ScreenBuilderConfig {
  title?: string;
  options?: StackNavigationOptions;
  initialParams?: any;
  disableTheme?: boolean;
  transitionMode?: TransitionMode;
}

/**
 * 导航构建器配置
 */
export interface NavigationBuilderConfig {
  enableTheme?: boolean;
  tabPreset?: 'default' | 'minimal' | 'floating';
  stackPreset?: 'default' | 'transparent' | 'modal' | 'headerless';
  animationPreset?: 'slideHorizontal' | 'slideVertical' | 'fade' | 'scale' | 'none';
  initialTabRoute?: string;
  initialStackRoute?: string;
  defaultTransitionMode?: TransitionMode;
}

/**
 * 现代化导航构建器
 * 提供链式调用API来简化导航配置，集成新的主题系统
 */
export class NavigationBuilder {
  private tabs: TabScreenComponent[] = [];
  private screens: StackScreenComponent[] = [];
  private config: Required<NavigationBuilderConfig>;

  constructor(config: NavigationBuilderConfig = {}) {
    this.config = {
      enableTheme: true,
      tabPreset: 'default',
      stackPreset: 'default',
      animationPreset: 'slideHorizontal',
      initialTabRoute: '',
      initialStackRoute: '',
      defaultTransitionMode: 'horizontalIOS',
      ...config,
    };
  }

  /**
   * 启用主题适配
   */
  enableTheme(): NavigationBuilder {
    this.config.enableTheme = true;
    return this;
  }

  /**
   * 禁用主题适配
   */
  disableTheme(): NavigationBuilder {
    this.config.enableTheme = false;
    return this;
  }

  /**
   * 设置标签页预设主题
   */
  setTabPreset(preset: 'default' | 'minimal' | 'floating'): NavigationBuilder {
    this.config.tabPreset = preset;
    return this;
  }

  /**
   * 设置堆栈预设主题
   */
  setStackPreset(preset: 'default' | 'transparent' | 'modal' | 'headerless'): NavigationBuilder {
    this.config.stackPreset = preset;
    return this;
  }

  /**
   * 设置动画预设
   */
  setAnimationPreset(preset: 'slideHorizontal' | 'slideVertical' | 'fade' | 'scale' | 'none'): NavigationBuilder {
    this.config.animationPreset = preset;
    return this;
  }

  /**
   * 添加标签页
   */
  addTab(
    name: string,
    component: React.ComponentType<any>,
    config: TabBuilderConfig = {}
  ): NavigationBuilder {
    const { title, icon, badge, options = {}, disableTheme = false } = config;

    // 构建选项
    let mergedOptions: BottomTabNavigationOptions = {
      title,
      tabBarLabel: title,
      tabBarIcon: icon,
      tabBarBadge: badge,
      ...options,
    };

    // 如果启用主题且未禁用，应用主题选项
    if (this.config.enableTheme && !disableTheme) {
      const themeOptions = NavigationUtils.getTabOptions(this.config.tabPreset);
      mergedOptions = {
        ...themeOptions,
        ...mergedOptions,
      };
    }

    this.tabs.push({
      name,
      component,
      options: mergedOptions,
    });

    return this;
  }

  /**
   * 设置默认翻页模式
   */
  setDefaultTransitionMode(mode: TransitionMode): NavigationBuilder {
    this.config.defaultTransitionMode = mode;
    return this;
  }

  /**
   * 添加堆栈屏幕
   */
  addScreen(
    name: string,
    component: React.ComponentType<any>,
    config: ScreenBuilderConfig = {}
  ): NavigationBuilder {
    const {
      title,
      options = {},
      initialParams,
      disableTheme = false,
      transitionMode
    } = config;

    // 获取过渡动画配置
    const transitionConfig = NavigationUtils.createTransition(
      transitionMode || this.config.defaultTransitionMode
    );

    // 构建选项
    let mergedOptions: StackNavigationOptions = {
      title,
      headerTitle: title,
      ...transitionConfig,
      ...options,
    };

    // 如果启用主题且未禁用，应用主题选项
    if (this.config.enableTheme && !disableTheme) {
      const themeOptions = NavigationUtils.getStackOptions(this.config.stackPreset);
      mergedOptions = {
        ...themeOptions,
        ...mergedOptions,
      };
    }

    this.screens.push({
      name,
      component,
      options: mergedOptions,
      initialParams,
    });

    return this;
  }

  /**
   * 设置初始标签页路由
   */
  setInitialTabRoute(routeName: string): NavigationBuilder {
    this.config.initialTabRoute = routeName;
    return this;
  }

  /**
   * 设置初始堆栈路由
   */
  setInitialStackRoute(routeName: string): NavigationBuilder {
    this.config.initialStackRoute = routeName;
    return this;
  }

  /**
   * 构建标签页导航器
   */
  buildTabNavigator(): React.FC {
    return () => (
      <TabNavigator
        tabs={this.tabs}
        initialRouteName={this.config.initialTabRoute}
        themePreset={this.config.tabPreset}
        enableTheme={this.config.enableTheme}
      />
    );
  }

  /**
   * 构建堆栈导航器
   */
  buildStackNavigator(): React.FC {
    return () => (
      <StackNavigator
        screens={this.screens}
        initialRouteName={this.config.initialStackRoute}
        themePreset={this.config.stackPreset}
        animationPreset={this.config.animationPreset}
        enableTheme={this.config.enableTheme}
      />
    );
  }

  /**
   * 构建完整导航结构（不含容器）
   */
  buildFullNavigation(): React.FC {
    return () => (
      <StackNavigator
        screens={[
          {
            name: 'MainTabs',
            component: () => (
              <TabNavigator
                tabs={this.tabs}
                initialRouteName={this.config.initialTabRoute}
                themePreset={this.config.tabPreset}
                enableTheme={this.config.enableTheme}
              />
            ),
            options: { headerShown: false },
          },
          ...this.screens,
        ]}
        initialRouteName="MainTabs"
        themePreset={this.config.stackPreset}
        animationPreset={this.config.animationPreset}
        enableTheme={this.config.enableTheme}
      />
    );
  }

  /**
   * 构建根导航（含容器）
   */
  buildRootNavigation(): React.FC {
    return () => (
      <NavigationContainer>
        <StackNavigator
          screens={[
            {
              name: 'MainTabs',
              component: () => (
                <TabNavigator
                  tabs={this.tabs}
                  initialRouteName={this.config.initialTabRoute}
                  themePreset={this.config.tabPreset}
                  enableTheme={this.config.enableTheme}
                />
              ),
              options: { headerShown: false },
            },
            ...this.screens,
          ]}
          initialRouteName="MainTabs"
          themePreset={this.config.stackPreset}
          animationPreset={this.config.animationPreset}
          enableTheme={this.config.enableTheme}
        />
      </NavigationContainer>
    );
  }

  /**
   * 重置构建器
   */
  reset(): NavigationBuilder {
    this.tabs = [];
    this.screens = [];
    this.config = {
      enableTheme: true,
      tabPreset: 'default',
      stackPreset: 'default',
      animationPreset: 'slideHorizontal',
      initialTabRoute: '',
      initialStackRoute: '',
      defaultTransitionMode: 'horizontalIOS',
    };
    return this;
  }

  /**
   * 获取当前配置
   */
  getConfig(): Required<NavigationBuilderConfig> {
    return { ...this.config };
  }

  /**
   * 获取标签页列表
   */
  getTabs(): TabScreenComponent[] {
    return [...this.tabs];
  }

  /**
   * 获取屏幕列表
   */
  getScreens(): StackScreenComponent[] {
    return [...this.screens];
  }
}

/**
 * 构建器工厂类
 */
export class NavigationBuilderFactory {
  /**
   * 创建默认导航构建器
   */
  static create(config?: NavigationBuilderConfig): NavigationBuilder {
    return new NavigationBuilder(config);
  }

  /**
   * 创建启用主题的导航构建器
   */
  static createThemed(config?: Omit<NavigationBuilderConfig, 'enableTheme'>): NavigationBuilder {
    return new NavigationBuilder({ ...config, enableTheme: true });
  }

  /**
   * 创建禁用主题的导航构建器
   */
  static createPlain(config?: Omit<NavigationBuilderConfig, 'enableTheme'>): NavigationBuilder {
    return new NavigationBuilder({ ...config, enableTheme: false });
  }

  /**
   * 创建最小化标签页导航构建器
   */
  static createMinimalTabs(config?: Omit<NavigationBuilderConfig, 'tabPreset'>): NavigationBuilder {
    return new NavigationBuilder({ ...config, tabPreset: 'minimal' });
  }

  /**
   * 创建浮动标签页导航构建器
   */
  static createFloatingTabs(config?: Omit<NavigationBuilderConfig, 'tabPreset'>): NavigationBuilder {
    return new NavigationBuilder({ ...config, tabPreset: 'floating' });
  }

  /**
   * 创建模态堆栈导航构建器
   */
  static createModalStack(config?: Omit<NavigationBuilderConfig, 'stackPreset' | 'animationPreset'>): NavigationBuilder {
    return new NavigationBuilder({
      ...config,
      stackPreset: 'modal',
      animationPreset: 'slideVertical'
    });
  }

  /**
   * 创建透明堆栈导航构建器
   */
  static createTransparentStack(config?: Omit<NavigationBuilderConfig, 'stackPreset'>): NavigationBuilder {
    return new NavigationBuilder({ ...config, stackPreset: 'transparent' });
  }
}

/**
 * Hook：使用导航构建器
 */
export const useNavigationBuilder = (config?: NavigationBuilderConfig) => {
  const [builder] = React.useState(() => new NavigationBuilder(config));
  const navigationUtils = useNavigationUtils();

  return {
    builder,
    utils: navigationUtils,
    factory: NavigationBuilderFactory,
  };
};

// 便捷函数导出
export const createNavigation = (config?: NavigationBuilderConfig): NavigationBuilder =>
  NavigationBuilderFactory.create(config);

export const createThemedNavigation = (config?: Omit<NavigationBuilderConfig, 'enableTheme'>): NavigationBuilder =>
  NavigationBuilderFactory.createThemed(config);

export const createPlainNavigation = (config?: Omit<NavigationBuilderConfig, 'enableTheme'>): NavigationBuilder =>
  NavigationBuilderFactory.createPlain(config);

export const createMinimalTabNavigation = (config?: Omit<NavigationBuilderConfig, 'tabPreset'>): NavigationBuilder =>
  NavigationBuilderFactory.createMinimalTabs(config);

export const createFloatingTabNavigation = (config?: Omit<NavigationBuilderConfig, 'tabPreset'>): NavigationBuilder =>
  NavigationBuilderFactory.createFloatingTabs(config);

export const createModalNavigation = (config?: Omit<NavigationBuilderConfig, 'stackPreset' | 'animationPreset'>): NavigationBuilder =>
  NavigationBuilderFactory.createModalStack(config);

export const createTransparentNavigation = (config?: Omit<NavigationBuilderConfig, 'stackPreset'>): NavigationBuilder =>
  NavigationBuilderFactory.createTransparentStack(config);

// 默认导出
export default NavigationBuilder;