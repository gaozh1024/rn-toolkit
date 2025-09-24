declare module '@react-navigation/stack' {
  import { ComponentType } from 'react';
  import { ViewStyle, TextStyle, ImageStyle } from 'react-native';
  import { ParamListBase, RouteProp, NavigationProp } from '@react-navigation/native';

  // 动画插值器类型
  export interface StackCardInterpolationProps {
    current: {
      progress: any;
    };
    next?: {
      progress: any;
    };
    index: number;
    closing: any;
    layouts: {
      screen: { width: number; height: number };
    };
  }

  export interface StackCardStyleInterpolator {
    (props: StackCardInterpolationProps): {
      cardStyle?: ViewStyle;
      overlayStyle?: ViewStyle;
      shadowStyle?: ViewStyle;
    };
  }

  export interface StackHeaderInterpolationProps {
    current: {
      progress: any;
    };
    next?: {
      progress: any;
    };
    layouts: {
      header: { width: number; height: number };
      screen: { width: number; height: number };
      title?: { width: number; height: number };
      leftLabel?: { width: number; height: number };
    };
  }

  export interface StackHeaderStyleInterpolator {
    (props: StackHeaderInterpolationProps): {
      leftLabelStyle?: TextStyle;
      leftButtonStyle?: ViewStyle;
      rightButtonStyle?: ViewStyle;
      titleStyle?: TextStyle;
      backgroundStyle?: ViewStyle;
    };
  }

  export interface StackNavigationOptions {
    title?: string;
    headerShown?: boolean;
    headerTitle?: string | ((props: { children: string }) => React.ReactNode);
    headerTitleAlign?: 'left' | 'center';
    headerTitleStyle?: TextStyle;
    headerLeft?: (props: { canGoBack: boolean }) => React.ReactNode;
    headerRight?: () => React.ReactNode;
    headerBackTitle?: string;
    headerBackTitleVisible?: boolean;
    headerTruncatedBackTitle?: string;
    headerBackImage?: (props: { tintColor: string }) => React.ReactNode;
    headerPressColorAndroid?: string;
    headerPressColor?: string; // 头部按钮按压颜色
    headerPressOpacity?: number; // 头部按钮按压透明度
    headerTintColor?: string;
    headerStyle?: ViewStyle;
    headerBackground?: () => React.ReactNode;
    headerTransparent?: boolean;
    headerShadowVisible?: boolean;
    headerLargeTitle?: boolean;
    headerLargeTitleStyle?: TextStyle;
    headerBlurEffect?: string;
    headerStatusBarHeight?: number;
    gestureEnabled?: boolean;
    gestureDirection?: 'horizontal' | 'vertical';
    animationEnabled?: boolean;
    cardStyle?: ViewStyle;
    cardOverlayEnabled?: boolean;
    cardShadowEnabled?: boolean;
    presentation?: 'card' | 'modal' | 'transparentModal';
    animationTypeForReplace?: 'push' | 'pop';
    detachPreviousScreen?: boolean;
    // 动画相关属性
    cardStyleInterpolator?: StackCardStyleInterpolator;
    headerStyleInterpolator?: StackHeaderStyleInterpolator;
    transitionSpec?: {
      open?: any;
      close?: any;
    };
    gestureResponseDistance?: {
      horizontal?: number;
      vertical?: number;
    };
    gestureVelocityImpact?: number;
  }

  export interface StackNavigationProp<
    ParamList extends ParamListBase,
    RouteName extends keyof ParamList = string
  > extends NavigationProp<ParamList, RouteName> {
    push<RouteName extends keyof ParamList>(
      name: RouteName,
      params?: ParamList[RouteName]
    ): void;
    pop(count?: number): void;
    popToTop(): void;
    replace<RouteName extends keyof ParamList>(
      name: RouteName,
      params?: ParamList[RouteName]
    ): void;
  }

  export interface StackScreenProps<
    ParamList extends ParamListBase,
    RouteName extends keyof ParamList = string
  > {
    navigation: StackNavigationProp<ParamList, RouteName>;
    route: RouteProp<ParamList, RouteName>;
  }

  export interface StackNavigatorProps {
    initialRouteName?: string;
    screenOptions?: StackNavigationOptions | ((props: any) => StackNavigationOptions);
    children?: React.ReactNode;
  }

  export interface StackScreenOptions {
    name: string;
    component?: ComponentType<any>;
    children?: (props: any) => React.ReactNode;
    options?: StackNavigationOptions | ((props: any) => StackNavigationOptions);
    initialParams?: object;
  }

  export function createStackNavigator<ParamList extends ParamListBase = ParamListBase>(): {
    Navigator: ComponentType<StackNavigatorProps>;
    Screen: ComponentType<StackScreenOptions>;
  };

  export const TransitionPresets: {
    SlideFromRightIOS: {
      cardStyleInterpolator: StackCardStyleInterpolator;
      headerStyleInterpolator: StackHeaderStyleInterpolator;
    };
    ModalSlideFromBottomIOS: {
      cardStyleInterpolator: StackCardStyleInterpolator;
      headerStyleInterpolator: StackHeaderStyleInterpolator;
    };
    ModalPresentationIOS: {
      cardStyleInterpolator: StackCardStyleInterpolator;
      headerStyleInterpolator: StackHeaderStyleInterpolator;
    };
    FadeFromBottomAndroid: {
      cardStyleInterpolator: StackCardStyleInterpolator;
      headerStyleInterpolator: StackHeaderStyleInterpolator;
    };
    RevealFromBottomAndroid: {
      cardStyleInterpolator: StackCardStyleInterpolator;
      headerStyleInterpolator: StackHeaderStyleInterpolator;
    };
    ScaleFromCenterAndroid: {
      cardStyleInterpolator: StackCardStyleInterpolator;
      headerStyleInterpolator: StackHeaderStyleInterpolator;
    };
    DefaultTransition: {
      cardStyleInterpolator: StackCardStyleInterpolator;
      headerStyleInterpolator: StackHeaderStyleInterpolator;
    };
    ModalTransition: {
      cardStyleInterpolator: StackCardStyleInterpolator;
      headerStyleInterpolator: StackHeaderStyleInterpolator;
    };
  };

  export const CardStyleInterpolators: {
    forHorizontalIOS: StackCardStyleInterpolator;
    forVerticalIOS: StackCardStyleInterpolator;
    forModalPresentationIOS: StackCardStyleInterpolator;
    forFadeFromBottomAndroid: StackCardStyleInterpolator;
    forRevealFromBottomAndroid: StackCardStyleInterpolator;
    forScaleFromCenterAndroid: StackCardStyleInterpolator;
    forNoAnimation: StackCardStyleInterpolator;
  };

  export const HeaderStyleInterpolators: {
    forUIKit: StackHeaderStyleInterpolator;
    forFade: StackHeaderStyleInterpolator;
    forStatic: StackHeaderStyleInterpolator;
    forNoAnimation: StackHeaderStyleInterpolator;
  };

  export const TransitionSpecs: {
    TransitionIOSSpec: any;
    FadeInFromBottomAndroidSpec: any;
    FadeOutToBottomAndroidSpec: any;
    RevealFromBottomAndroidSpec: any;
  };
}