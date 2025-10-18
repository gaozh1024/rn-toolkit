import { ComponentType } from 'react';
import { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';

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
  options?: NativeStackNavigationOptions;
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

export interface DrawerConfig {
  /** 抽屉是否默认打开 */
  open?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
  width?: number;
  /** 抽屉内容：组件类型或节点 */
  content: ComponentType<any> | React.ReactNode;
  /** 抽屉样式：'front' | 'back' | 'slide'（库支持范围内可选） */
  drawerType?: 'front' | 'back' | 'slide';
  /** 边缘手势宽度 */
  edgeWidth?: number;
}

/** 额外的 Tabs 组（每组渲染为一个 RootStack.Screen） */
export interface TabsGroupConfig {
  /** 该组在 RootStack 中的屏幕名称（例如：'HomeTabs'、'MallTabs'） */
  screenName: string;
  /** 该组内的标签页 */
  tabs: TabConfig[];
  /** 该组的初始 Tab（可选，不传则用全局 initialRouteName 或第一项） */
  initialRouteName?: string;
  /** 该组的外观覆盖（可选，不传则沿用全局配置） */
  tabBarHeight?: number;
  backgroundColor?: string;
  activeColor?: string;
  inactiveColor?: string;
  showLabels?: boolean;
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
  transitionMode?: TransitionMode;
  leftDrawer?: DrawerConfig;
  rightDrawer?: DrawerConfig;
  /** 主 Tabs 在 RootStack 中的屏幕名称（默认 'MainTabs'） */
  tabsScreenName?: string;
  /** 额外的 Tabs 组（每组一个 RootStack.Screen） */
  tabsGroups?: TabsGroupConfig[];
}

export type NavigationType = 'tab' | 'stack' | 'modal';

export type TransitionMode = 'ios' | 'fade' | 'bottom' | 'none' | 'left' | 'right' | 'top';

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