import { StackNavigationOptions } from '@react-navigation/stack';
import { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { ParamListBase } from '@react-navigation/native';

// 路由参数类型
export interface RootStackParamList extends ParamListBase {
  [key: string]: any;
}

// 基础导航选项类型（用于通用场景）
export type NavigationOptions = StackNavigationOptions | BottomTabNavigationOptions;

// 堆栈屏幕组件接口
export interface StackScreenComponent {
  name: string;
  component: React.ComponentType<any>;
  options?: StackNavigationOptions;
}

// 标签页屏幕组件接口
export interface TabScreenComponent {
  name: string;
  component: React.ComponentType<any>;
  options?: BottomTabNavigationOptions;
}

// 通用屏幕组件接口（向后兼容）
export interface ScreenComponent {
  name: string;
  component: React.ComponentType<any>;
  options?: NavigationOptions;
}

// 标签页配置接口
export interface TabItem {
  name: string;
  component: React.ComponentType<any>;
  options?: BottomTabNavigationOptions;
}

// 导航属性类型
export interface NavigationProps {
  navigation: any;
  route: any;
}

// 屏幕配置接口
export interface ScreenConfig {
  name: string;
  component: React.ComponentType<any>;
  options?: NavigationOptions;
  initialParams?: any;
}

// 堆栈导航器配置
export interface StackConfig {
  screens: StackScreenComponent[];
  initialRouteName?: string;
  screenOptions?: StackNavigationOptions;
}

// 标签页导航器配置
export interface TabConfig {
  screens: TabScreenComponent[];
  initialRouteName?: string;
  screenOptions?: BottomTabNavigationOptions;
}