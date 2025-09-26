import { StackNavigationOptions } from '@react-navigation/stack';
import { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { ParamListBase } from '@react-navigation/native';

// 路由参数类型
export interface RootStackParamList extends ParamListBase {
  [key: string]: any;
}

// 基础导航选项类型（用于通用场景）
export type NavigationOptions = StackNavigationOptions | BottomTabNavigationOptions;

// 翻页模式类型
export type TransitionMode = 'horizontalIOS' | 'verticalIOS' | 'modalIOS' | 'fadeAndroid' | 'scaleAndroid' | 'none';

// React Navigation 主题接口 (符合官方规范)
export interface ReactNavigationTheme {
  dark: boolean;
  colors: {
    primary: string;
    background: string;
    card: string;
    text: string;
    border: string;
    notification: string;
  };
}

// 堆栈屏幕组件接口
export interface StackScreenComponent {
  name: string;
  component: React.ComponentType<any>;
  options?: StackNavigationOptions;
  initialParams?: any;
}

// 标签页屏幕组件接口
export interface TabScreenComponent {
  name: string;
  component: React.ComponentType<any>;
  options?: BottomTabNavigationOptions;
  initialParams?: any;
}

// 通用屏幕组件接口（向后兼容）
export interface ScreenComponent {
  name: string;
  component: React.ComponentType<any>;
  options?: NavigationOptions;
  initialParams?: any;
}

// 标签页配置接口
export interface TabConfig {
  screens: TabScreenComponent[];
  initialRouteName?: string;
  screenOptions?: BottomTabNavigationOptions;
}

// 堆栈配置接口
export interface StackConfig {
  screens: StackScreenComponent[];
  initialRouteName?: string;
  screenOptions?: StackNavigationOptions;
}

// 屏幕配置接口
export interface ScreenConfig {
  name: string;
  component: React.ComponentType<any>;
  options?: NavigationOptions;
  initialParams?: any;
  transitionMode?: TransitionMode;
}

// 标签页项配置接口
export interface TabItem {
  name: string;
  component: React.ComponentType<any>;
  options?: BottomTabNavigationOptions;
  initialParams?: any;
}

// 导航属性类型
export interface NavigationProps {
  navigation: any;
  route: any;
}

// 导航构建器配置
export interface NavigationBuilderConfig {
  enableTheme?: boolean;
  tabOptions?: BottomTabNavigationOptions;
  stackOptions?: StackNavigationOptions;
  initialTabRoute?: string;
  initialStackRoute?: string;
  defaultTransitionMode?: TransitionMode;
}