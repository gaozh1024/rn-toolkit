import { ComponentType } from 'react';
import { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { StackNavigationOptions } from '@react-navigation/stack';

export interface TabConfig {
  name: string;
  component: ComponentType<any>;
  label?: string;
  iconName?: string;
  iconSize?: number;
  badge?: string | number;
  badgeColor?: string;
  options?: BottomTabNavigationOptions;
}

export interface StackConfig {
  name: string;
  component: ComponentType<any>;
  options?: StackNavigationOptions;
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
  iconSize?: number;
  badge?: string | number;
  badgeColor?: string;
  onPress: () => void;
  children?: React.ReactNode;
}

export interface NavigatorConfig {
  tabs: TabConfig[];
  initialRouteName?: string;
  tabBarHeight?: number;
  backgroundColor?: string;
  activeColor?: string;
  inactiveColor?: string;
  showLabels?: boolean;
}

export interface RootNavigatorConfig {
  tabs: TabConfig[];
  stacks: StackConfig[];
  modals: StackConfig[];
  initialRouteName?: string;
  tabBarHeight?: number;
  backgroundColor?: string;
  activeColor?: string;
  inactiveColor?: string;
  showLabels?: boolean;
}

export type NavigationType = 'tab' | 'stack' | 'modal';

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
  canGoBack: () => boolean;
  getCurrentRoute: () => any;
  addListener: (type: string, listener: any) => any;
  dispatch: (action: any) => void;
  raw: any;
}