declare module '@react-navigation/bottom-tabs' {
  import { ComponentType } from 'react';
  import { ViewStyle, TextStyle } from 'react-native';
  import { ParamListBase, RouteProp, NavigationProp } from '@react-navigation/native';

  export interface BottomTabNavigationOptions {
    title?: string;
    tabBarLabel?: string | ((props: { focused: boolean; color: string }) => React.ReactNode);
    tabBarIcon?: (props: { focused: boolean; color: string; size: number }) => React.ReactNode;
    tabBarBadge?: string | number;
    tabBarBadgeStyle?: TextStyle;
    tabBarAccessibilityLabel?: string;
    tabBarTestID?: string;
    tabBarButton?: (props: any) => React.ReactNode;
    tabBarActiveTintColor?: string;
    tabBarInactiveTintColor?: string;
    tabBarActiveBackgroundColor?: string;
    tabBarInactiveBackgroundColor?: string;
    tabBarHideOnKeyboard?: boolean;
    tabBarItemStyle?: ViewStyle;
    tabBarLabelStyle?: TextStyle;
    tabBarIconStyle?: ViewStyle;
    tabBarStyle?: ViewStyle;
    tabBarBackground?: () => React.ReactNode;
    tabBarShowLabel?: boolean;
    tabBarShowIcon?: boolean;
    tabBarAllowFontScaling?: boolean;
    tabBarLabelPosition?: 'beside-icon' | 'below-icon';
    tabBarKeyboardHidesTabBar?: boolean;
    tabBarVisibilityAnimationConfig?: {
      show?: object;
      hide?: object;
    };
    lazy?: boolean;
    unmountOnBlur?: boolean;
    freezeOnBlur?: boolean;
    headerShown?: boolean;
  }

  export interface BottomTabNavigationProp<
    ParamList extends ParamListBase,
    RouteName extends keyof ParamList = string
  > extends NavigationProp<ParamList, RouteName> {
    jumpTo<RouteName extends keyof ParamList>(
      name: RouteName,
      params?: ParamList[RouteName]
    ): void;
  }

  export interface BottomTabScreenProps<
    ParamList extends ParamListBase,
    RouteName extends keyof ParamList = string
  > {
    navigation: BottomTabNavigationProp<ParamList, RouteName>;
    route: RouteProp<ParamList, RouteName>;
  }

  export interface BottomTabNavigatorProps {
    initialRouteName?: string;
    screenOptions?: BottomTabNavigationOptions | ((props: any) => BottomTabNavigationOptions);
    tabBar?: (props: any) => React.ReactNode;
    children?: React.ReactNode;
    backBehavior?: 'firstRoute' | 'initialRoute' | 'order' | 'history' | 'none';
    detachInactiveScreens?: boolean;
    sceneContainerStyle?: ViewStyle;
  }

  export interface BottomTabScreenOptions {
    name: string;
    component?: ComponentType<any>;
    children?: (props: any) => React.ReactNode;
    options?: BottomTabNavigationOptions | ((props: any) => BottomTabNavigationOptions);
    initialParams?: object;
    listeners?: object;
  }

  export function createBottomTabNavigator<ParamList extends ParamListBase = ParamListBase>(): {
    Navigator: ComponentType<BottomTabNavigatorProps>;
    Screen: ComponentType<BottomTabScreenOptions>;
  };

  export interface BottomTabBarProps {
    state: any;
    descriptors: any;
    navigation: any;
    insets: {
      top: number;
      right: number;
      bottom: number;
      left: number;
    };
  }

  export const BottomTabBar: ComponentType<BottomTabBarProps>;
}