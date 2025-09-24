declare module 'react-native-safe-area-context' {
  import { ComponentType } from 'react';
  import { ViewProps, ViewStyle } from 'react-native';

  export type Edge = 'top' | 'right' | 'bottom' | 'left';

  export interface EdgeInsets {
    top: number;
    right: number;
    bottom: number;
    left: number;
  }

  export interface SafeAreaViewProps extends ViewProps {
    children?: React.ReactNode;
    edges?: Edge[];
    mode?: 'padding' | 'margin';
    style?: StyleProp<ViewStyle>;
  }

  export interface SafeAreaProviderProps {
    children?: React.ReactNode;
    initialMetrics?: EdgeInsets | null;
  }

  export interface SafeAreaFrameContext {
    x: number;
    y: number;
    width: number;
    height: number;
  }

  export interface SafeAreaInsetsContext extends EdgeInsets {}

  export const SafeAreaView: ComponentType<SafeAreaViewProps>;
  export const SafeAreaProvider: ComponentType<SafeAreaProviderProps>;
  export const SafeAreaConsumer: ComponentType<{
    children: (insets: EdgeInsets) => React.ReactNode;
  }>;

  export function useSafeAreaInsets(): EdgeInsets;
  export function useSafeAreaFrame(): SafeAreaFrameContext;
  export function withSafeAreaInsets<P extends object>(
    Component: ComponentType<P & { insets: EdgeInsets }>
  ): ComponentType<P>;

  export const initialWindowMetrics: EdgeInsets | null;
  export const initialWindowSafeAreaInsets: EdgeInsets | null;
}