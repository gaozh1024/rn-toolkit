import { useState, useEffect, useCallback, useMemo } from 'react';
import { ViewStyle, TextStyle } from 'react-native';
import { CSSStyles, AppTheme, ThemeMode } from './types';
import themeService from './ThemeService';
import { defaultAppTheme } from './presets';

// 使用样式的主要 Hook
export const useStyles = (): CSSStyles => {
    return useMemo(() => themeService.getCSS(), []);
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

// 创建安全的默认主题
const createSafeTheme = (): AppTheme => {
    try {
        return themeService.getAppTheme();
    } catch (error) {
        console.warn('Theme service not initialized, using default theme');
        return defaultAppTheme;
    }
};

export const useTheme = (): UseThemeReturn => {
    const [theme, setTheme] = useState<AppTheme>(createSafeTheme);
    const [themeMode, setCurrentThemeMode] = useState<ThemeMode>(() => {
        try {
            return themeService.getCurrentThemeMode();
        } catch (error) {
            return 'system';
        }
    });

    // 主题变化监听器
    const handleThemeChange = useCallback((newTheme: AppTheme) => {
        setTheme(newTheme);
        setCurrentThemeMode(newTheme.mode);
    }, []);

    useEffect(() => {
        // 异步初始化主题服务
        const initializeTheme = async () => {
            try {
                await themeService.initialize();
                // 初始化完成后更新主题
                setTheme(themeService.getAppTheme());
                setCurrentThemeMode(themeService.getCurrentThemeMode());
            } catch (error) {
                console.warn('Failed to initialize theme service:', error);
            }
        };

        initializeTheme();

        // 添加监听器
        themeService.addThemeChangeListener(handleThemeChange);

        // 清理函数
        return () => {
            themeService.removeThemeChangeListener(handleThemeChange);
        };
    }, [handleThemeChange]);

    // 设置主题模式
    const setThemeMode = useCallback(async (mode: ThemeMode) => {
        try {
            await themeService.setThemeMode(mode);
        } catch (error) {
            console.warn('Failed to set theme mode:', error);
        }
    }, []);

    // 切换主题
    const toggleTheme = useCallback(async () => {
        try {
            await themeService.toggleTheme();
        } catch (error) {
            console.warn('Failed to toggle theme:', error);
        }
    }, []);

    return {
        theme,
        themeMode,
        isDarkMode: (() => {
            try {
                return themeService.isDarkMode();
            } catch (error) {
                return false;
            }
        })(),
        setThemeMode,
        toggleTheme,
        colors: theme.currentColors,
    };
};

// 获取当前主题颜色的 Hook（轻量级版本）
export const useThemeColors = () => {
    const [colors, setColors] = useState(() => {
        try {
            return themeService.getAppTheme().currentColors;
        } catch (error) {
            return defaultAppTheme.currentColors;
        }
    });

    const handleThemeChange = useCallback((newTheme: AppTheme) => {
        setColors(newTheme.currentColors);
    }, []);

    useEffect(() => {
        themeService.addThemeChangeListener(handleThemeChange);
        return () => {
            themeService.removeThemeChangeListener(handleThemeChange);
        };
    }, [handleThemeChange]);

    return colors;
};

// 主题模式选择器 Hook
export const useThemeMode = () => {
    const [themeMode, setCurrentThemeMode] = useState<ThemeMode>(themeService.getCurrentThemeMode());

    const handleThemeChange = useCallback((newTheme: AppTheme) => {
        setCurrentThemeMode(newTheme.mode);
    }, []);

    useEffect(() => {
        themeService.addThemeChangeListener(handleThemeChange);
        return () => {
            themeService.removeThemeChangeListener(handleThemeChange);
        };
    }, [handleThemeChange]);

    const setThemeMode = useCallback(async (mode: ThemeMode) => {
        await themeService.setThemeMode(mode);
    }, []);

    const toggleTheme = useCallback(async () => {
        await themeService.toggleTheme();
    }, []);

    return {
        themeMode,
        setThemeMode,
        toggleTheme,
        isDarkMode: themeService.isDarkMode(),
    };
};

// 组合样式的 Hook
export const useCombinedStyles = (
    ...styles: (ViewStyle | TextStyle | undefined | null | false)[]
): ViewStyle | TextStyle => {
    return useMemo(() => themeService.combine(...styles), [styles]);
};

// 条件样式的 Hook
export const useConditionalStyle = (
    condition: boolean,
    style: ViewStyle | TextStyle
): ViewStyle | TextStyle | {} => {
    return useMemo(() => themeService.when(condition, style), [condition, style]);
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