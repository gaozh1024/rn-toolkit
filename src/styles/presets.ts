import { Appearance } from 'react-native';
import { StylePresets, StyleTheme, AppTheme, ThemeMode, AppThemeColors } from './types';

// 亮色主题颜色
const lightColors = {
    primary: '#007AFF',
    secondary: '#5856D6',
    success: '#34C759',
    warning: '#FF9500',
    error: '#FF3B30',
    info: '#5AC8FA',
    light: '#F2F2F7',
    dark: '#1C1C1E',
    background: '#FFFFFF',
    surface: '#F2F2F7',
    text: '#000000',
    textSecondary: '#6D6D70',
    border: '#C6C6C8',
    shadow: '#000000',
};

// 暗色主题颜色
const darkColors = {
    primary: '#0A84FF',
    secondary: '#5E5CE6',
    success: '#30D158',
    warning: '#FF9F0A',
    error: '#FF453A',
    info: '#64D2FF',
    light: '#F2F2F7',
    dark: '#1C1C1E',
    background: '#000000',
    surface: '#1C1C1E',
    text: '#FFFFFF',
    textSecondary: '#8E8E93',
    border: '#38383A',
    shadow: '#FFFFFF',
};

// 应用主题颜色配置
const appThemeColors: AppThemeColors = {
    light: lightColors,
    dark: darkColors,
};

// 获取系统主题模式
const getSystemThemeMode = (): 'light' | 'dark' => {
    return Appearance.getColorScheme() === 'dark' ? 'dark' : 'light';
};

// 默认应用主题
export const defaultAppTheme: AppTheme = {
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
};

// 保持向后兼容的默认主题
export const defaultTheme: StyleTheme = {
    colors: defaultAppTheme.currentColors,
    spacing: defaultAppTheme.spacing,
    borderRadius: defaultAppTheme.borderRadius,
    shadows: defaultAppTheme.shadows,
    navigation: {
        headerHeight: 56, // Android默认高度
        tabBarHeight: 60,  // 标签栏高度
    },
};

// 创建样式预设
export const createStylePresets = (theme: StyleTheme = defaultTheme): StylePresets => ({
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

    // 定位
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
    textBold: { fontWeight: 'bold' },
    textSemiBold: { fontWeight: '600' },
    textMedium: { fontWeight: '500' },
    textRegular: { fontWeight: 'normal' },
    textLight: { fontWeight: '300' },

    // 边框
    border: { borderWidth: 1, borderColor: theme.colors.border },
    borderTop: { borderTopWidth: 1, borderTopColor: theme.colors.border },
    borderBottom: { borderBottomWidth: 1, borderBottomColor: theme.colors.border },
    borderLeft: { borderLeftWidth: 1, borderLeftColor: theme.colors.border },
    borderRight: { borderRightWidth: 1, borderRightColor: theme.colors.border },

    // 圆角
    rounded: { borderRadius: theme.borderRadius.md },
    roundedSm: { borderRadius: theme.borderRadius.sm },
    roundedMd: { borderRadius: theme.borderRadius.md },
    roundedLg: { borderRadius: theme.borderRadius.lg },
    roundedXl: { borderRadius: theme.borderRadius.xl },
    roundedFull: { borderRadius: theme.borderRadius.full },

    // 阴影
    shadow: theme.shadows.md,
    shadowSm: theme.shadows.sm,
    shadowMd: theme.shadows.md,
    shadowLg: theme.shadows.lg,
    shadowXl: theme.shadows.xl,
});