export { NavigationBuilder, createNavigation } from './NavigationBuilder';
export { NavigationContainer, StackNavigator, TabNavigator } from './NavigationContainer';
export { NavigationService } from './NavigationService';
export * from './utils';

// 导出类型
export type {
  RootStackParamList,
  NavigationOptions,
  StackScreenComponent,
  TabScreenComponent,
  ScreenComponent,
  TabItem,
  NavigationProps,
  ScreenConfig,
  StackConfig,
  TabConfig,
} from './types';

// 重新导出 React Navigation 的类型
export type {
  StackNavigationOptions,
  StackNavigationProp,
  StackScreenProps,
} from '@react-navigation/stack';

export type {
  BottomTabNavigationOptions,
  BottomTabNavigationProp,
  BottomTabScreenProps,
} from '@react-navigation/bottom-tabs';

export type {
  NavigationProp,
  RouteProp,
  ParamListBase,
  NavigationContainerRef,
} from '@react-navigation/native';

export type {
  PlatformPressableProps,
  HeaderBackButtonProps,
  HeaderButtonProps,
  HeaderTitleProps,
  HeaderBackgroundProps,
} from '@react-navigation/elements';
