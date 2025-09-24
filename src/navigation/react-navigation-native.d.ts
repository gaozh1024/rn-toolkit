declare module '@react-navigation/native' {
  import { ComponentType, ForwardRefExoticComponent, RefAttributes } from 'react';

  export interface ParamListBase {
    [routeName: string]: object | undefined;
  }

  export interface NavigationProp<
    ParamList extends ParamListBase,
    RouteName extends keyof ParamList = string
  > {
    navigate<RouteName extends keyof ParamList>(
      ...args: RouteName extends unknown
        ? undefined extends ParamList[RouteName]
          ? [screen: RouteName] | [screen: RouteName, params: ParamList[RouteName]]
          : [screen: RouteName, params: ParamList[RouteName]]
        : never
    ): void;
    reset(state: any): void;
    goBack(): void;
    canGoBack(): boolean;
    getId(): string | undefined;
    getParent<T = NavigationProp<ParamListBase> | undefined>(id?: string): T;
    getState(): any;
    dispatch(action: any): void;
    setParams(params: Partial<ParamList[RouteName]>): void;
    isFocused(): boolean;
    addListener(type: string, callback: () => void): () => void;
    removeListener(type: string, callback: () => void): void;
  }

  export interface RouteProp<
    ParamList extends ParamListBase,
    RouteName extends keyof ParamList = string
  > {
    key: string;
    name: RouteName;
    params: ParamList[RouteName];
  }

  export interface NavigationContainerProps {
    children?: React.ReactNode;
    initialState?: any;
    onStateChange?: (state: any) => void;
    onReady?: () => void;
    theme?: any;
    linking?: any;
    fallback?: React.ReactNode;
    documentTitle?: {
      enabled?: boolean;
      formatter?: (options: any, route: any) => string;
    };
    onUnhandledAction?: (action: any) => void;
  }

  export interface NavigationContainerRef {
    navigate<RouteName extends string>(name: RouteName, params?: object): void;
    reset(state: any): void;
    goBack(): void;
    canGoBack(): boolean;
    getRootState(): any;
    getCurrentRoute(): any;
    getCurrentOptions(): any;
    addListener(type: string, callback: () => void): () => void;
    removeListener(type: string, callback: () => void): void;
    dispatch(action: any): void;
    isReady(): boolean;
  }

  export const NavigationContainer: ForwardRefExoticComponent<
    NavigationContainerProps & RefAttributes<NavigationContainerRef>
  >;

  export function createNavigationContainerRef<ParamList extends ParamListBase = ParamListBase>(): React.RefObject<NavigationContainerRef>;

  export function useNavigation<T = NavigationProp<ParamListBase>>(): T;
  export function useRoute<T = RouteProp<ParamListBase>>(): T;
  export function useFocusEffect(callback: () => void | (() => void)): void;
  export function useIsFocused(): boolean;
  export function useNavigationState<T = any>(selector: (state: any) => T): T;

  export const DefaultTheme: any;
  export const DarkTheme: any;

  export interface LinkingOptions<ParamList extends ParamListBase> {
    prefixes: string[];
    config?: any;
    getInitialURL?: () => Promise<string | null> | string | null;
    subscribe?: (listener: (url: string) => void) => () => void;
    getStateFromPath?: (path: string, config?: any) => any;
    getPathFromState?: (state: any, config?: any) => string;
  }

  export const CommonActions: {
    navigate: (payload: { name: string; params?: object }) => any;
    reset: (state: any) => any;
    goBack: () => any;
    setParams: (params: object) => any;
  };

  export const StackActions: {
    replace: (name: string, params?: object) => any;
    push: (name: string, params?: object) => any;
    pop: (count?: number) => any;
    popToTop: () => any;
  };

  export const TabActions: {
    jumpTo: (name: string, params?: object) => any;
  };
}