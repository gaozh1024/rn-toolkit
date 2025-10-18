import React from 'react';
import { TabConfig, NavigatorConfig, StackConfig, TransitionMode, DrawerConfig } from './types';
import { TabNavigator } from './components/TabNavigator';
import { RootNavigator } from './components/RootNavigator';
import { DrawerLayout } from './components/DrawerLayout';

/**
 * 简单导航构建器 - 支持链式调用
 */
export class NavigationBuilder {
  private config: NavigatorConfig = {
    tabs: [],
    stacks: [],
    modals: [],
    tabsScreenName: 'MainTabs',
    tabsGroups: [],
  };

  /**
   * 批量添加标签页
   * - 未提供名称且主组为空：作为主组 tabs
   * - 提供名称，或主组已存在：新增一个独立的 Tabs 组（使用该名称作为 Root 屏幕）
   */
  addTabs(tabs: TabConfig[], tabsScreenName?: string): NavigationBuilder {
    const hasMain = (this.config.tabs || []).length > 0;

    if (!tabsScreenName && !hasMain) {
      // 作为主组
      this.config.tabs.push(...tabs);
      return this;
    }

    if (tabsScreenName && !hasMain && (this.config.tabs || []).length === 0) {
      // 首次且指定名称：作为主组并设置主组名称
      this.config.tabs.push(...tabs);
      this.config.tabsScreenName = tabsScreenName;
      return this;
    }

    // 其他情况：新增一个 Tabs 组
    const screenName =
      tabsScreenName || `TabsGroup${(this.config.tabsGroups || []).length + 1}`;
    this.config.tabsGroups = this.config.tabsGroups || [];
    this.config.tabsGroups.push({ screenName, tabs });
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
    const hasTabs = (this.config.tabs || []).length > 0;
    const hasTabGroups = (this.config.tabsGroups || []).length > 0;
    const hasOther = (this.config.stacks || []).length > 0 || (this.config.modals || []).length > 0;

    if (!hasTabs && !hasOther && !hasTabGroups) {
      throw new Error('至少需要添加一个页面（tab/stack/modal）');
    }

    const wrapWithDrawer = (child: React.ReactElement) => {
      const { leftDrawer, rightDrawer } = this.config;
      if (!leftDrawer && !rightDrawer) return child;
      return (
        <DrawerLayout leftDrawer={leftDrawer} rightDrawer={rightDrawer}>
          {child}
        </DrawerLayout>
      );
    };

    // 仅有主组且无其他：仍旧返回单 TabNavigator
    if (hasTabs && !hasOther && !hasTabGroups) {
      return () => wrapWithDrawer(React.createElement(TabNavigator, this.config));
    }

    // 存在额外 Tabs 组或有栈/模态：使用 RootNavigator
    return () => wrapWithDrawer(React.createElement(RootNavigator, this.config));
  }
}

/**
 * 创建简单导航构建器
 */
export const createNavigation = (): NavigationBuilder => {
  return new NavigationBuilder();
};
