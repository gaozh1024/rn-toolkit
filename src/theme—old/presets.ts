import { Appearance } from 'react-native';
import { StylePresets, StyleTheme, AppTheme, ThemeMode, AppThemeColors, ColorTheme } from './types';

// 创建安全的默认颜色主题
const createDefaultLightColors = (): ColorTheme => ({
    // 主要颜色
    primary: '#007AFF',
    secondary: '#5856D6',
    success: '#34C759',
    warning: '#FF9500',
    error: '#FF3B30',
    info: '#5AC8FA',
    light: '#F2F2F7',
    dark: '#1C1C1E',

    // 背景颜色
    background: '#FFFFFF',
    surface: '#F2F2F7',

    // 文本颜色
    onSurface: '#000000',
    onPrimary: '#FFFFFF',
    onSecondary: '#FFFFFF',
    onSuccess: '#FFFFFF',
    onWarning: '#000000',
    onError: '#FFFFFF',
    onInfo: '#000000',
    onBackground: '#000000',
    text: '#000000',
    textSecondary: '#6D6D70',
    placeholder: '#C7C7CC',

    // 边框和阴影
    border: '#C6C6C8',
    shadow: '#000000',

    // 按钮文本颜色
    buttonTextPrimary: '#FFFFFF',
    buttonTextSecondary: '#FFFFFF',
    buttonTextOutlined: '#007AFF',
    buttonTextText: '#007AFF',
});

const createDefaultDarkColors = (): ColorTheme => ({
    // 主要颜色
    primary: '#0A84FF',
    secondary: '#5E5CE6',
    success: '#30D158',
    warning: '#FF9F0A',
    error: '#FF453A',
    info: '#64D2FF',
    light: '#F2F2F7',
    dark: '#1C1C1E',

    // 背景颜色
    background: '#000000',
    surface: '#1C1C1E',

    // 文本颜色
    onSurface: '#FFFFFF',
    onPrimary: '#000000',
    onSecondary: '#000000',
    onSuccess: '#000000',
    onWarning: '#000000',
    onError: '#000000',
    onInfo: '#000000',
    onBackground: '#FFFFFF',
    text: '#FFFFFF',
    textSecondary: '#8E8E93',
    placeholder: '#48484A',

    // 边框和阴影
    border: '#38383A',
    shadow: '#FFFFFF',

    // 按钮文本颜色
    buttonTextPrimary: '#FFFFFF',
    buttonTextSecondary: '#FFFFFF',
    buttonTextOutlined: '#0A84FF',
    buttonTextText: '#0A84FF',
});

// 亮色主题颜色
export const lightColors: ColorTheme = createDefaultLightColors();

// 暗色主题颜色
export const darkColors: ColorTheme = createDefaultDarkColors();

// 应用主题颜色配置
const appThemeColors: AppThemeColors = {
    light: lightColors,
    dark: darkColors,
};

// 获取系统主题模式
const getSystemThemeMode = (): 'light' | 'dark' => {
    try {
        return Appearance.getColorScheme() === 'dark' ? 'dark' : 'light';
    } catch (error) {
        return 'light'; // 默认返回亮色模式
    }
};

// 创建安全的默认应用主题
export const createDefaultAppTheme = (): AppTheme => ({
    mode: 'system' as ThemeMode,
    colors: appThemeColors,
    currentColors: appThemeColors[getSystemThemeMode()],
    spacing: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
        xxl: 48,
    },
    borderRadius: {
        none: 0,
        sm: 4,
        md: 8,
        lg: 12,
        xl: 16,
        full: 9999,
    },
    shadows: {
        none: {},
        sm: {
            shadowColor: '#000000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 2,
            elevation: 1,
        },
        md: {
            shadowColor: '#000000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
        },
        lg: {
            shadowColor: '#000000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 8,
            elevation: 6,
        },
        xl: {
            shadowColor: '#000000',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.2,
            shadowRadius: 16,
            elevation: 10,
        },
    },
    typography: {
        fontSize: {
            xs: 12,
            sm: 14,
            md: 16,
            lg: 18,
            xl: 20,
            xxl: 24,
        },
        fontWeight: {
            light: '300',
            normal: '400',
            medium: '500',
            semibold: '600',
            bold: '700',
        },
        lineHeight: {
            xs: 16,
            sm: 20,
            md: 24,
            lg: 28,
            xl: 32,
            xxl: 36,
        },
        letterSpacing: {
            tight: -0.5,
            normal: 0,
            wide: 0.5,
        },
    },
});

// 默认应用主题实例
export const defaultAppTheme: AppTheme = createDefaultAppTheme();

// 创建安全的默认样式主题
export const createDefaultStyleTheme = (appTheme: AppTheme = defaultAppTheme): StyleTheme => ({
    colors: appTheme.currentColors,
    spacing: appTheme.spacing,
    borderRadius: appTheme.borderRadius,
    shadows: appTheme.shadows,
    typography: appTheme.typography,
    navigation: {
        headerHeight: 56, // Android默认高度
        tabBarHeight: 60,  // 标签栏高度
    },
});

// 默认样式主题实例
export const defaultTheme: StyleTheme = createDefaultStyleTheme();

// 创建样式预设 - 确保所有样式都有默认值
export const createStylePresets = (theme: StyleTheme = defaultTheme): StylePresets => {
    // 确保主题对象完整性
    const safeTheme = {
        colors: theme.colors || defaultTheme.colors,
        spacing: theme.spacing || defaultTheme.spacing,
        borderRadius: theme.borderRadius || defaultTheme.borderRadius,
        shadows: theme.shadows || defaultTheme.shadows,
        typography: theme.typography || defaultTheme.typography,
        navigation: theme.navigation || defaultTheme.navigation,
    };

    return {
        // 基础布局
        flex1: { flex: 1 },
        flexRow: { flexDirection: 'row' },
        flexColumn: { flexDirection: 'column' },
        flexWrap: { flexWrap: 'wrap' },
        flexNoWrap: { flexWrap: 'nowrap' },

        // 对齐方式
        center: { justifyContent: 'center', alignItems: 'center' },
        centerH: { alignItems: 'center' },
        centerV: { justifyContent: 'center' },

        // 行布局组合
        row: { flexDirection: 'row' },
        rowCenter: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
        rowBetween: { flexDirection: 'row', justifyContent: 'space-between' },
        rowAround: { flexDirection: 'row', justifyContent: 'space-around' },
        rowEvenly: { flexDirection: 'row', justifyContent: 'space-evenly' },
        rowStart: { flexDirection: 'row', justifyContent: 'flex-start' },
        rowEnd: { flexDirection: 'row', justifyContent: 'flex-end' },
        rowBetweenCenter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
        rowAroundCenter: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
        rowEvenlyCenter: { flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' },

        // 列布局组合
        column: { flexDirection: 'column' },
        columnCenter: { flexDirection: 'column', justifyContent: 'center', alignItems: 'center' },
        columnBetween: { flexDirection: 'column', justifyContent: 'space-between' },
        columnAround: { flexDirection: 'column', justifyContent: 'space-around' },
        columnEvenly: { flexDirection: 'column', justifyContent: 'space-evenly' },
        columnStart: { flexDirection: 'column', justifyContent: 'flex-start' },
        columnEnd: { flexDirection: 'column', justifyContent: 'flex-end' },
        columnBetweenCenter: { flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center' },
        columnAroundCenter: { flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center' },
        columnEvenlyCenter: { flexDirection: 'column', justifyContent: 'space-evenly', alignItems: 'center' },

        // 定位相关
        absolute: { position: 'absolute' },
        relative: { position: 'relative' },
        absoluteFill: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
        absoluteTop: { position: 'absolute', top: 0, left: 0, right: 0 },
        absoluteBottom: { position: 'absolute', bottom: 0, left: 0, right: 0 },
        absoluteLeft: { position: 'absolute', left: 0, top: 0, bottom: 0 },
        absoluteRight: { position: 'absolute', right: 0, top: 0, bottom: 0 },

        // 文本样式
        textCenter: { textAlign: 'center' },
        textLeft: { textAlign: 'left' },
        textRight: { textAlign: 'right' },
        textBold: { fontWeight: safeTheme.typography.fontWeight.bold || 'bold' },
        textSemiBold: { fontWeight: safeTheme.typography.fontWeight.semibold || '600' },
        textMedium: { fontWeight: safeTheme.typography.fontWeight.medium || '500' },
        textRegular: { fontWeight: safeTheme.typography.fontWeight.normal || 'normal' },
        textLight: { fontWeight: safeTheme.typography.fontWeight.light || '300' },

        // 边框样式
        border: { borderWidth: 1, borderColor: safeTheme.colors.border || '#C6C6C8' },
        borderTop: { borderTopWidth: 1, borderTopColor: safeTheme.colors.border || '#C6C6C8' },
        borderBottom: { borderBottomWidth: 1, borderBottomColor: safeTheme.colors.border || '#C6C6C8' },
        borderLeft: { borderLeftWidth: 1, borderLeftColor: safeTheme.colors.border || '#C6C6C8' },
        borderRight: { borderRightWidth: 1, borderRightColor: safeTheme.colors.border || '#C6C6C8' },

        // 圆角样式
        rounded: { borderRadius: safeTheme.borderRadius.md || 8 },
        roundedSm: { borderRadius: safeTheme.borderRadius.sm || 4 },
        roundedMd: { borderRadius: safeTheme.borderRadius.md || 8 },
        roundedLg: { borderRadius: safeTheme.borderRadius.lg || 12 },
        roundedXl: { borderRadius: safeTheme.borderRadius.xl || 16 },
        roundedFull: { borderRadius: safeTheme.borderRadius.full || 9999 },

        // 阴影样式
        shadow: safeTheme.shadows.md || {},
        shadowSm: safeTheme.shadows.sm || {},
        shadowMd: safeTheme.shadows.md || {},
        shadowLg: safeTheme.shadows.lg || {},
        shadowXl: safeTheme.shadows.xl || {},
    };
};

// 导出工厂函数，用于创建自定义主题
export const createCustomTheme = (customConfig: Partial<AppTheme>): AppTheme => {
    const baseTheme = createDefaultAppTheme();

    return {
        ...baseTheme,
        ...customConfig,
        colors: {
            ...baseTheme.colors,
            ...customConfig.colors,
            light: {
                ...baseTheme.colors.light,
                ...customConfig.colors?.light,
            },
            dark: {
                ...baseTheme.colors.dark,
                ...customConfig.colors?.dark,
            },
        },
        spacing: {
            ...baseTheme.spacing,
            ...customConfig.spacing,
        },
        borderRadius: {
            ...baseTheme.borderRadius,
            ...customConfig.borderRadius,
        },
        shadows: {
            ...baseTheme.shadows,
            ...customConfig.shadows,
        },
        typography: {
            ...baseTheme.typography,
            ...customConfig.typography,
            fontSize: {
                ...baseTheme.typography.fontSize,
                ...customConfig.typography?.fontSize,
            },
            fontWeight: {
                ...baseTheme.typography.fontWeight,
                ...customConfig.typography?.fontWeight,
            },
            lineHeight: {
                ...baseTheme.typography.lineHeight,
                ...customConfig.typography?.lineHeight,
            },
            letterSpacing: {
                ...baseTheme.typography.letterSpacing,
                ...customConfig.typography?.letterSpacing,
            },
        },
    };
};