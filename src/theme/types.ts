import { ViewStyle, TextStyle, ImageStyle, DimensionValue } from 'react-native';

// 基础样式类型
export type Style = ViewStyle | TextStyle | ImageStyle;

// 间距类型
export type SpacingValue = number | 'auto';
export type SpacingSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

// 字体主题类型
export interface TypographyTheme {
    fontSize: {
        xs: number;
        sm: number;
        md: number;
        lg: number;
        xl: number;
        xxl: number;
    };
    fontWeight: {
        light: '300';
        normal: '400';  // 改为 normal
        medium: '500';
        semibold: '600';  // 改为 semibold
        bold: '700';
    };
    lineHeight: {
        xs: number;
        sm: number;
        md: number;
        lg: number;
        xl: number;
        xxl: number;
    };
    letterSpacing: {
        tight: number;
        normal: number;
        wide: number;
    };
}

// 颜色主题类型
export interface ColorTheme {
    primary: string;
    secondary: string;
    success: string;
    warning: string;
    error: string;
    info: string;
    light: string;
    dark: string;
    background: string;
    surface: string;
    onSurface: string;
    onPrimary: string;
    onSecondary: string;
    onSuccess: string;
    onWarning: string;
    onError: string;
    onInfo: string;
    onBackground: string;
    text: string;
    textSecondary: string;
    placeholder: string;  // 添加 placeholder 颜色
    border: string;
    shadow: string;
}

// 间距主题类型
export interface SpacingTheme {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
}

// 圆角主题类型
export interface BorderRadiusTheme {
    none: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    full: number;
}

// 阴影主题类型
export interface ShadowTheme {
    none: ViewStyle;
    sm: ViewStyle;
    md: ViewStyle;
    lg: ViewStyle;
    xl: ViewStyle;
}

// 完整主题类型
export interface StyleTheme {
    colors: ColorTheme;
    spacing: SpacingTheme;
    borderRadius: BorderRadiusTheme;
    shadows: ShadowTheme;
    typography: TypographyTheme;
    // 添加导航高度配置
    navigation: {
        headerHeight: number;
        tabBarHeight: number;
    };
}

// 样式预设类型
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

    // 定位
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

    // 边框
    border: ViewStyle;
    borderTop: ViewStyle;
    borderBottom: ViewStyle;
    borderLeft: ViewStyle;
    borderRight: ViewStyle;

    // 圆角
    rounded: ViewStyle;
    roundedSm: ViewStyle;
    roundedMd: ViewStyle;
    roundedLg: ViewStyle;
    roundedXl: ViewStyle;
    roundedFull: ViewStyle;

    // 阴影
    shadow: ViewStyle;
    shadowSm: ViewStyle;
    shadowMd: ViewStyle;
    shadowLg: ViewStyle;
    shadowXl: ViewStyle;
}

// 动态样式生成器类型
export interface StyleGenerators {
    // 间距生成器
    p: (value: SpacingSize | number) => ViewStyle;
    pt: (value: SpacingSize | number) => ViewStyle;
    pb: (value: SpacingSize | number) => ViewStyle;
    pl: (value: SpacingSize | number) => ViewStyle;
    pr: (value: SpacingSize | number) => ViewStyle;
    px: (value: SpacingSize | number) => ViewStyle;
    py: (value: SpacingSize | number) => ViewStyle;

    // 外边距生成器
    m: (value: SpacingSize | number) => ViewStyle;
    mt: (value: SpacingSize | number) => ViewStyle;
    mb: (value: SpacingSize | number) => ViewStyle;
    ml: (value: SpacingSize | number) => ViewStyle;
    mr: (value: SpacingSize | number) => ViewStyle;
    mx: (value: SpacingSize | number) => ViewStyle;
    my: (value: SpacingSize | number) => ViewStyle;

    // 尺寸生成器
    w: (value: DimensionValue) => ViewStyle;
    h: (value: DimensionValue) => ViewStyle;
    size: (value: DimensionValue) => ViewStyle;

    // 颜色生成器
    bg: (color: keyof ColorTheme | string) => ViewStyle;
    color: (color: keyof ColorTheme | string) => TextStyle;
    borderColor: (color: keyof ColorTheme | string) => ViewStyle;

    // 透明度生成器
    opacity: (value: number) => ViewStyle;
}

// CSS 样式对象类型
export type CSSStyles = StylePresets & StyleGenerators;


// 主题模式类型
export type ThemeMode = 'light' | 'dark' | 'system';

// 扩展颜色主题，支持亮色和暗色模式
export interface AppThemeColors {
    light: ColorTheme;
    dark: ColorTheme;
}

// 完整的应用主题类型
export interface AppTheme {
    mode: ThemeMode;
    colors: AppThemeColors;
    currentColors: ColorTheme; // 当前激活的颜色主题
    spacing: SpacingTheme;
    borderRadius: BorderRadiusTheme;
    shadows: ShadowTheme;
    typography: TypographyTheme;
}