import { useState, useEffect, useCallback, useMemo } from 'react';
import { ViewStyle, TextStyle } from 'react-native';
import { CSSStyles, AppTheme, ThemeMode } from './types';
import styleService from './StyleService';

// 使用样式的主要 Hook
export const useStyles = (): CSSStyles => {
    return useMemo(() => styleService.getCSS(), []);
};

// 完整的主题管理 Hook
export interface UseThemeReturn {
    theme: AppTheme;
    themeMode: ThemeMode;
    isDarkMode: boolean;
    setThemeMode: (mode: ThemeMode) => Promise<void>;
    toggleTheme: () => Promise<void>;
    colors: AppTheme['currentColors'];
}

export const useTheme = (): UseThemeReturn => {
    const [theme, setTheme] = useState<AppTheme>(styleService.getAppTheme());
    const [themeMode, setCurrentThemeMode] = useState<ThemeMode>(styleService.getCurrentThemeMode());

    // 主题变化监听器
    const handleThemeChange = useCallback((newTheme: AppTheme) => {
        setTheme(newTheme);
        setCurrentThemeMode(newTheme.mode);
    }, []);

    useEffect(() => {
        // 初始化主题服务
        styleService.initialize();

        // 添加监听器
        styleService.addThemeChangeListener(handleThemeChange);

        // 清理函数
        return () => {
            styleService.removeThemeChangeListener(handleThemeChange);
        };
    }, [handleThemeChange]);

    // 设置主题模式
    const setThemeMode = useCallback(async (mode: ThemeMode) => {
        await styleService.setThemeMode(mode);
    }, []);

    // 切换主题
    const toggleTheme = useCallback(async () => {
        await styleService.toggleTheme();
    }, []);

    return {
        theme,
        themeMode,
        isDarkMode: styleService.isDarkMode(),
        setThemeMode,
        toggleTheme,
        colors: theme.currentColors,
    };
};

// 获取当前主题颜色的 Hook（轻量级版本）
export const useThemeColors = () => {
    const [colors, setColors] = useState(styleService.getAppTheme().currentColors);

    const handleThemeChange = useCallback((newTheme: AppTheme) => {
        setColors(newTheme.currentColors);
    }, []);

    useEffect(() => {
        styleService.addThemeChangeListener(handleThemeChange);
        return () => {
            styleService.removeThemeChangeListener(handleThemeChange);
        };
    }, [handleThemeChange]);

    return colors;
};

// 主题模式选择器 Hook
export const useThemeMode = () => {
    const [themeMode, setCurrentThemeMode] = useState<ThemeMode>(styleService.getCurrentThemeMode());

    const handleThemeChange = useCallback((newTheme: AppTheme) => {
        setCurrentThemeMode(newTheme.mode);
    }, []);

    useEffect(() => {
        styleService.addThemeChangeListener(handleThemeChange);
        return () => {
            styleService.removeThemeChangeListener(handleThemeChange);
        };
    }, [handleThemeChange]);

    const setThemeMode = useCallback(async (mode: ThemeMode) => {
        await styleService.setThemeMode(mode);
    }, []);

    const toggleTheme = useCallback(async () => {
        await styleService.toggleTheme();
    }, []);

    return {
        themeMode,
        setThemeMode,
        toggleTheme,
        isDarkMode: styleService.isDarkMode(),
    };
};

// 组合样式的 Hook
export const useCombinedStyles = (
    ...styles: (ViewStyle | TextStyle | undefined | null | false)[]
): ViewStyle | TextStyle => {
    return useMemo(() => styleService.combine(...styles), [styles]);
};

// 条件样式的 Hook
export const useConditionalStyle = (
    condition: boolean,
    style: ViewStyle | TextStyle
): ViewStyle | TextStyle | {} => {
    return useMemo(() => styleService.when(condition, style), [condition, style]);
};

// 响应式样式 Hook（基于屏幕尺寸）
export const useResponsiveStyles = (
    styles: {
        small?: ViewStyle | TextStyle;
        medium?: ViewStyle | TextStyle;
        large?: ViewStyle | TextStyle;
    },
    screenWidth: number
): ViewStyle | TextStyle => {
    return useMemo(() => {
        if (screenWidth < 768 && styles.small) return styles.small;
        if (screenWidth < 1024 && styles.medium) return styles.medium;
        return styles.large || {};
    }, [styles, screenWidth]);
};