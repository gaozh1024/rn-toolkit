// 翻页模式类型
export type NavigationTransitionMode = 'horizontalIOS' | 'verticalIOS' | 'modalIOS' | 'fadeAndroid' | 'scaleAndroid' | 'none';

// 标签页项配置接口（用于构建器）
export interface TabItemBuilderConfig {
    title?: string;
    icon?: (props: { color: string; size: number; focused: boolean }) => React.ReactNode;
    badge?: string | number;
    options?: import('@react-navigation/bottom-tabs').BottomTabNavigationOptions;
    disableTheme?: boolean;
}

// 屏幕项配置接口（用于构建器）
export interface ScreenItemBuilderConfig {
    title?: string;
    options?: import('@react-navigation/stack').StackNavigationOptions;
    initialParams?: any;
    disableTheme?: boolean;
    transitionMode?: NavigationTransitionMode;
}
