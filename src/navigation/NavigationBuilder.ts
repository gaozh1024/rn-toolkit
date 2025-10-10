import React from 'react';
import { TabConfig, NavigatorConfig, StackConfig, TransitionMode, DrawerConfig } from './types';
import { TabNavigator } from './components/TabNavigator';
import { RootNavigator } from './components/RootNavigator';

/**
 * 简单导航构建器 - 支持链式调用
 */
export class NavigationBuilder {
  private config: NavigatorConfig = {
    tabs: [],
    stacks: [],
    modals: [],
  };

  /**
   * 添加标签页
   */
  addTab(tab: TabConfig): NavigationBuilder {
    this.config.tabs.push(tab);
    return this;
  }

  /**
   * 批量添加标签页
   */
  addTabs(tabs: TabConfig[]): NavigationBuilder {
    this.config.tabs.push(...tabs);
    return this;
  }

  /**
   * 添加堆栈页面
   */
  addStack(stack: StackConfig): NavigationBuilder {
    this.config.stacks = this.config.stacks || [];
    this.config.stacks.push(stack);
    return this;
  }

  /**
   * 设置指定堆栈页面的过渡动画
   */
  setStackTransition(name: string, mode: TransitionMode): NavigationBuilder {
    this.config.stacks = this.config.stacks || [];
    const idx = this.config.stacks.findIndex(s => s.name === name);
    if (idx >= 0) {
      this.config.stacks[idx] = { ...this.config.stacks[idx], transitionMode: mode };
    }
    return this;
  }

  /**
   * 批量添加堆栈页面
   */
  addStacks(stacks: StackConfig[]): NavigationBuilder {
    this.config.stacks = this.config.stacks || [];
    this.config.stacks.push(...stacks);
    return this;
  }

  /**
   * 添加模态页面
   */
  addModal(modal: StackConfig): NavigationBuilder {
    this.config.modals = this.config.modals || [];
    this.config.modals.push(modal);
    return this;
  }

  /**
   * 批量添加模态页面
   */
  addModals(modals: StackConfig[]): NavigationBuilder {
    this.config.modals = this.config.modals || [];
    this.config.modals.push(...modals);
    return this;
  }

  /**
   * 设置初始路由
   */
  setInitialRoute(routeName: string): NavigationBuilder {
    this.config.initialRouteName = routeName;
    return this;
  }

  /**
   * 设置标签栏高度
   */
  setTabBarHeight(height: number): NavigationBuilder {
    this.config.tabBarHeight = height;
    return this;
  }

  /**
   * 设置背景色
   */
  setBackgroundColor(color: string): NavigationBuilder {
    this.config.backgroundColor = color;
    return this;
  }

  /**
   * 设置激活颜色
   */
  setActiveColor(color: string): NavigationBuilder {
    this.config.activeColor = color;
    return this;
  }

  /**
   * 设置非激活颜色
   */
  setInactiveColor(color: string): NavigationBuilder {
    this.config.inactiveColor = color;
    return this;
  }

  /**
   * 设置全局过渡动画模式
   */
  setTransitionMode(mode: TransitionMode): NavigationBuilder {
    this.config.transitionMode = mode;
    return this;
  }

  /**
   * 设置是否显示标签
   */
  setShowLabels(show: boolean): NavigationBuilder {
    this.config.showLabels = show;
    return this;
  }

  /**
   * 设置左侧抽屉
   */
  setLeftDrawer(drawer: DrawerConfig): NavigationBuilder {
    this.config.leftDrawer = drawer;
    return this;
  }
  /**
   * 设置右侧抽屉
   */
  setRightDrawer(drawer: DrawerConfig): NavigationBuilder {
    this.config.rightDrawer = drawer;
    return this;
  }

  /**
   * 构建导航组件
   */
  build(): React.FC {
    if (this.config.tabs.length === 0) {
      throw new Error('至少需要添加一个标签页');
    }

    // 如果只有标签页，使用简单的TabNavigator
    if ((this.config.stacks || []).length === 0 && (this.config.modals || []).length === 0) {
      return () => React.createElement(TabNavigator, this.config);
    }

    // 如果有其他类型的页面，使用RootNavigator
    return () => React.createElement(RootNavigator, this.config);
  }

  /**
   * 构建仅标签导航器
   */
  buildTabsOnly(): React.FC {
    if (this.config.tabs.length === 0) {
      throw new Error('至少需要添加一个标签页');
    }

    return () => React.createElement(TabNavigator, this.config);
  }

  /**
   * 获取当前配置
   */
  getConfig(): NavigatorConfig {
    return { ...this.config };
  }

  /**
   * 重置配置
   */
  reset(): NavigationBuilder {
    this.config = { tabs: [], stacks: [], modals: [] };
    return this;
  }
}

/**
 * 创建简单导航构建器
 */
export const createNavigation = (): NavigationBuilder => {
  return new NavigationBuilder();
};