declare module '@react-navigation/elements' {
  import { ComponentType } from 'react';
  import { ViewStyle, TextStyle, PressableProps } from 'react-native';

  export interface PlatformPressableProps extends PressableProps {
    children?: React.ReactNode;
    style?: ViewStyle | ((state: { pressed: boolean }) => ViewStyle);
    android_ripple?: {
      color?: string;
      borderless?: boolean;
      radius?: number;
    };
    pressColor?: string;
    pressOpacity?: number;
  }

  export const PlatformPressable: ComponentType<PlatformPressableProps>;

  export interface HeaderBackButtonProps {
    disabled?: boolean;
    onPress?: () => void;
    pressColor?: string;
    pressOpacity?: number;
    backImage?: (props: { tintColor: string }) => React.ReactNode;
    tintColor?: string;
    label?: string;
    truncatedLabel?: string;
    labelVisible?: boolean;
    labelStyle?: TextStyle;
    allowFontScaling?: boolean;
    onLabelLayout?: (e: any) => void;
    screenLayout?: { width: number; height: number };
    titleLayout?: { width: number; height: number };
    canGoBack?: boolean;
    accessibilityLabel?: string;
    testID?: string;
    style?: ViewStyle;
  }

  export const HeaderBackButton: ComponentType<HeaderBackButtonProps>;

  export interface HeaderButtonProps {
    onPress?: () => void;
    pressColor?: string;
    pressOpacity?: number;
    tintColor?: string;
    disabled?: boolean;
    accessibilityLabel?: string;
    testID?: string;
    style?: ViewStyle;
    children?: React.ReactNode;
  }

  export const HeaderButton: ComponentType<HeaderButtonProps>;

  export interface HeaderTitleProps {
    children?: string;
    tintColor?: string;
    style?: TextStyle;
    allowFontScaling?: boolean;
    onLayout?: (e: any) => void;
  }

  export const HeaderTitle: ComponentType<HeaderTitleProps>;

  export interface HeaderBackgroundProps {
    style?: ViewStyle;
    children?: React.ReactNode;
  }

  export const HeaderBackground: ComponentType<HeaderBackgroundProps>;

  export interface SafeAreaProviderCompat {
    children?: React.ReactNode;
  }

  export const SafeAreaProviderCompat: ComponentType<SafeAreaProviderCompat>;

  export interface ScreenProps {
    focused?: boolean;
    route?: any;
    navigation?: any;
    children?: React.ReactNode;
    style?: ViewStyle;
  }

  export const Screen: ComponentType<ScreenProps>;

  export interface MissingIconProps {
    color?: string;
    size?: number;
    style?: ViewStyle;
  }

  export const MissingIcon: ComponentType<MissingIconProps>;

  export interface ResourceSavingViewProps {
    visible?: boolean;
    children?: React.ReactNode;
    style?: ViewStyle;
  }

  export const ResourceSavingView: ComponentType<ResourceSavingViewProps>;

  export interface BackgroundProps {
    style?: ViewStyle;
    children?: React.ReactNode;
  }

  export const Background: ComponentType<BackgroundProps>;

  export const getDefaultHeaderHeight: (
    layout: { width: number; height: number },
    modal: boolean,
    statusBarHeight: number
  ) => number;

  export const getHeaderTitle: (
    options: any,
    fallback: string
  ) => string;

  export const Header: ComponentType<{
    layout: { width: number; height: number };
    modal?: boolean;
    title?: string;
    headerTitle?: string | ((props: any) => React.ReactNode);
    headerTitleAlign?: 'left' | 'center';
    headerTitleStyle?: TextStyle;
    headerLeft?: (props: any) => React.ReactNode;
    headerRight?: (props: any) => React.ReactNode;
    headerBackground?: (props: any) => React.ReactNode;
    headerTransparent?: boolean;
    headerTintColor?: string;
    headerPressColor?: string;
    headerPressOpacity?: number;
    headerShadowVisible?: boolean;
    headerStyle?: ViewStyle;
    headerStatusBarHeight?: number;
    styleInterpolator?: any;
    onGoBack?: () => void;
    canGoBack?: boolean;
    route?: any;
    navigation?: any;
    scene?: any;
    previous?: any;
  }>;
}