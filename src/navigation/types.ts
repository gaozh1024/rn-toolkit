import { ComponentType } from 'react';
import { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { StackNavigationOptions } from '@react-navigation/stack';

export interface TabConfig {
  name: string;
  component: ComponentType<any>;
  label?: string;
  iconName?: string;
  /** 选中态时使用的图标名称（可选）。如果未设置则沿用 iconName */
  activeIconName?: string;
  iconSize?: number;
  badge?: string | number;
  badgeColor?: string;
  /** 覆盖全局的选中/未选中颜色（可选） */
  activeColor?: string;
  inactiveColor?: string;
  options?: BottomTabNavigationOptions;
}

export interface StackConfig {
  name: string;
  component: ComponentType<any>;
  options?: StackNavigationOptions;
  transitionMode?: TransitionMode; // 单屏覆盖过渡动画
}

export interface SafeAreaInsets {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

export interface CustomTabButtonProps {
  focused: boolean;
  label?: string;
  iconName?: string;
  /** 选中态时使用的图标名称（可选） */
  activeIconName?: string;
  iconSize?: number;
  badge?: string | number;
  badgeColor?: string;
  /** 优先使用每个 Tab 自身的颜色配置，其次使用全局颜色 */
  activeColor?: string;
  inactiveColor?: string;
  onPress: () => void;
  children?: React.ReactNode;
}

export interface NavigatorConfig {
  tabs: TabConfig[];
  stacks?: StackConfig[];
  modals?: StackConfig[];
  initialRouteName?: string;
  tabBarHeight?: number;
  backgroundColor?: string;
  activeColor?: string;
  inactiveColor?: string;
  showLabels?: boolean;
  transitionMode?: TransitionMode; // 全局过渡动画模式
}

export type NavigationType = 'tab' | 'stack' | 'modal';

export type TransitionMode = 'ios' | 'fade' | 'bottom' | 'none';

// 导航参数类型
export type RootParamList = {
  [key: string]: any;
};

// 导航Hook返回类型
export interface NavigationHookReturn {
  navigate: (name: string, params?: any) => void;
  goBack: () => void;
  push: (name: string, params?: any) => void;
  pop: (count?: number) => void;
  popToRoot: () => void;
  replace: (name: string, params?: any) => void;
  reset: (routes: Array<{ name: string; params?: any }>) => void;
  canGoBack: () => boolean;
  getCurrentRoute: () => any;
  addListener: (type: string, listener: any) => any;
  dispatch: (action: any) => void;
  raw: any;
}