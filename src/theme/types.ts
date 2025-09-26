import { ViewStyle, TextStyle, ImageStyle, DimensionValue } from 'react-native';

// 基础样式类型
export type Style = ViewStyle | TextStyle | ImageStyle;

// 间距类型
export type SpacingValue = number | 'auto';
export type SpacingSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

// 字体主题类型 - 必须配置
export interface TypographyTheme {
    fontSize: {
        xs: number;      // 默认: 12
        sm: number;      // 默认: 14
        md: number;      // 默认: 16
        lg: number;      // 默认: 18
        xl: number;      // 默认: 20
        xxl: number;     // 默认: 24
    };
    fontWeight: {
        light: '300';    // 默认: '300'
        normal: '400';   // 默认: '400'
        medium: '500';   // 默认: '500'
        semibold: '600'; // 默认: '600'
        bold: '700';     // 默认: '700'
    };
    lineHeight: {
        xs: number;      // 默认: 16
        sm: number;      // 默认: 20
        md: number;      // 默认: 24
        lg: number;      // 默认: 28
        xl: number;      // 默认: 32
        xxl: number;     // 默认: 36
    };
    letterSpacing: {
        tight: number;   // 默认: -0.5
        normal: number;  // 默认: 0
        wide: number;    // 默认: 0.5
    };
}

// 颜色主题类型 - 必须配置
export interface ColorTheme {
    // 主要颜色
    primary: string;        // 默认: '#007AFF'
    secondary: string;      // 默认: '#5856D6'
    success: string;        // 默认: '#34C759'
    warning: string;        // 默认: '#FF9500'
    error: string;          // 默认: '#FF3B30'
    info: string;           // 默认: '#5AC8FA'
    light: string;          // 默认: '#F2F2F7'
    dark: string;           // 默认: '#1C1C1E'
    
    // 背景颜色
    background: string;     // 默认: '#FFFFFF'
    surface: string;        // 默认: '#F2F2F7'
    
    // 文本颜色
    onSurface: string;      // 默认: '#000000'
    onPrimary: string;      // 默认: '#FFFFFF'
    onSecondary: string;    // 默认: '#FFFFFF'
    onSuccess: string;      // 默认: '#FFFFFF'
    onWarning: string;      // 默认: '#000000'
    onError: string;        // 默认: '#FFFFFF'
    onInfo: string;         // 默认: '#000000'
    onBackground: string;   // 默认: '#000000'
    text: string;           // 默认: '#000000'
    textSecondary: string;  // 默认: '#6D6D70'
    placeholder: string;    // 默认: '#C7C7CC'
    
    // 边框和阴影
    border: string;         // 默认: '#C6C6C8'
    shadow: string;         // 默认: '#000000'

    // 按钮文本颜色 - 必须配置
    buttonTextPrimary: string;   // 默认: '#FFFFFF'
    buttonTextSecondary: string; // 默认: '#FFFFFF'
    buttonTextOutlined: string;  // 默认: '#007AFF'
    buttonTextText: string;      // 默认: '#007AFF'
}

// 间距主题类型 - 必须配置
export interface SpacingTheme {
    xs: number;   // 默认: 4
    sm: number;   // 默认: 8
    md: number;   // 默认: 16
    lg: number;   // 默认: 24
    xl: number;   // 默认: 32
    xxl: number;  // 默认: 48
}

// 圆角主题类型 - 必须配置
export interface BorderRadiusTheme {
    none: number; // 默认: 0
    sm: number;   // 默认: 4
    md: number;   // 默认: 8
    lg: number;   // 默认: 12
    xl: number;   // 默认: 16
    full: number; // 默认: 9999
}

// 阴影主题类型 - 必须配置
export interface ShadowTheme {
    none: ViewStyle;  // 默认: {}
    sm: ViewStyle;    // 默认: 轻微阴影
    md: ViewStyle;    // 默认: 中等阴影
    lg: ViewStyle;    // 默认: 较大阴影
    xl: ViewStyle;    // 默认: 最大阴影
}

// 导航主题类型 - 必须配置
export interface NavigationTheme {
    headerHeight: number;  // 默认: 56
    tabBarHeight: number;  // 默认: 60
}

// 完整主题类型 - 必须配置的核心结构
export interface StyleTheme {
    colors: ColorTheme;
    spacing: SpacingTheme;
    borderRadius: BorderRadiusTheme;
    shadows: ShadowTheme;
    typography: TypographyTheme;
    navigation: NavigationTheme;
}

// 样式预设类型 - 自动生成，无需手动配置
export interface StylePresets {
    // 布局相关
    flex1: ViewStyle;
    flexRow: ViewStyle;
    flexColumn: ViewStyle;
    flexWrap: ViewStyle;
    flexNoWrap: ViewStyle;

    // 对齐方式
    center: ViewStyle;
    centerH: ViewStyle;
    centerV: ViewStyle;

    // 行布局组合
    row: ViewStyle;
    rowCenter: ViewStyle;
    rowBetween: ViewStyle;
    rowAround: ViewStyle;
    rowEvenly: ViewStyle;
    rowStart: ViewStyle;
    rowEnd: ViewStyle;
    rowBetweenCenter: ViewStyle;
    rowAroundCenter: ViewStyle;
    rowEvenlyCenter: ViewStyle;

    // 列布局组合
    column: ViewStyle;
    columnCenter: ViewStyle;
    columnBetween: ViewStyle;
    columnAround: ViewStyle;
    columnEvenly: ViewStyle;
    columnStart: ViewStyle;
    columnEnd: ViewStyle;
    columnBetweenCenter: ViewStyle;
    columnAroundCenter: ViewStyle;
    columnEvenlyCenter: ViewStyle;

    // 定位相关
    absolute: ViewStyle;
    relative: ViewStyle;
    absoluteFill: ViewStyle;
    absoluteTop: ViewStyle;
    absoluteBottom: ViewStyle;
    absoluteLeft: ViewStyle;
    absoluteRight: ViewStyle;

    // 文本样式
    textCenter: TextStyle;
    textLeft: TextStyle;
    textRight: TextStyle;
    textBold: TextStyle;
    textSemiBold: TextStyle;
    textMedium: TextStyle;
    textRegular: TextStyle;
    textLight: TextStyle;

    // 边框样式
    border: ViewStyle;
    borderTop: ViewStyle;
    borderBottom: ViewStyle;
    borderLeft: ViewStyle;
    borderRight: ViewStyle;

    // 圆角样式
    rounded: ViewStyle;
    roundedSm: ViewStyle;
    roundedMd: ViewStyle;
    roundedLg: ViewStyle;
    roundedXl: ViewStyle;
    roundedFull: ViewStyle;

    // 阴影样式
    shadow: ViewStyle;
    shadowSm: ViewStyle;
    shadowMd: ViewStyle;
    shadowLg: ViewStyle;
    shadowXl: ViewStyle;
}

// 样式生成器类型 - 自动生成，无需手动配置
export interface StyleGenerators {
    // 内边距
    p: (value: SpacingSize | number) => ViewStyle;
    pt: (value: SpacingSize | number) => ViewStyle;
    pb: (value: SpacingSize | number) => ViewStyle;
    pl: (value: SpacingSize | number) => ViewStyle;
    pr: (value: SpacingSize | number) => ViewStyle;
    px: (value: SpacingSize | number) => ViewStyle;
    py: (value: SpacingSize | number) => ViewStyle;

    // 外边距
    m: (value: SpacingSize | number) => ViewStyle;
    mt: (value: SpacingSize | number) => ViewStyle;
    mb: (value: SpacingSize | number) => ViewStyle;
    ml: (value: SpacingSize | number) => ViewStyle;
    mr: (value: SpacingSize | number) => ViewStyle;
    mx: (value: SpacingSize | number) => ViewStyle;
    my: (value: SpacingSize | number) => ViewStyle;

    // 尺寸
    w: (value: DimensionValue) => ViewStyle;
    h: (value: DimensionValue) => ViewStyle;
    size: (value: DimensionValue) => ViewStyle;

    // 颜色
    bg: (color: keyof ColorTheme | string) => ViewStyle;
    color: (color: keyof ColorTheme | string) => TextStyle;
    borderColor: (color: keyof ColorTheme | string) => ViewStyle;

    // 透明度
    opacity: (value: number) => ViewStyle;
}

// CSS 样式组合类型
export type CSSStyles = StylePresets & StyleGenerators;

// 主题模式类型
export type ThemeMode = 'light' | 'dark' | 'system';

// 应用主题颜色配置
export interface AppThemeColors {
    light: ColorTheme;
    dark: ColorTheme;
}

// 应用主题类型 - 必须配置的顶层结构
export interface AppTheme {
    mode: ThemeMode;
    colors: AppThemeColors;
    currentColors: ColorTheme;
    spacing: SpacingTheme;
    borderRadius: BorderRadiusTheme;
    shadows: ShadowTheme;
    typography: TypographyTheme;
}