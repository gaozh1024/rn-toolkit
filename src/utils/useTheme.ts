import { useState, useEffect, useCallback } from 'react';
import ThemeService, { Theme, ThemeMode } from './ThemeService';

export interface UseThemeReturn {
  theme: Theme;
  themeMode: ThemeMode;
  isDarkMode: boolean;
  setThemeMode: (mode: ThemeMode) => Promise<void>;
  toggleTheme: () => Promise<void>;
  colors: Theme['colors'];
}

/**
 * 主题管理 Hook
 * 提供主题状态和切换功能
 */
export const useTheme = (): UseThemeReturn => {
  const [theme, setTheme] = useState<Theme>(ThemeService.getCurrentTheme());
  const [themeMode, setCurrentThemeMode] = useState<ThemeMode>(ThemeService.getCurrentThemeMode());

  // 主题变化监听器
  const handleThemeChange = useCallback((newTheme: Theme) => {
    setTheme(newTheme);
    setCurrentThemeMode(ThemeService.getCurrentThemeMode());
  }, []);

  useEffect(() => {
    // 初始化主题服务
    ThemeService.initialize();

    // 添加监听器
    ThemeService.addThemeChangeListener(handleThemeChange);

    // 清理函数
    return () => {
      ThemeService.removeThemeChangeListener(handleThemeChange);
    };
  }, [handleThemeChange]);

  // 设置主题模式
  const setThemeMode = useCallback(async (mode: ThemeMode) => {
    await ThemeService.setThemeMode(mode);
  }, []);

  // 切换主题
  const toggleTheme = useCallback(async () => {
    await ThemeService.toggleTheme();
  }, []);

  return {
    theme,
    themeMode,
    isDarkMode: theme.mode === 'dark',
    setThemeMode,
    toggleTheme,
    colors: theme.colors,
  };
};

/**
 * 获取当前主题颜色的 Hook
 * 轻量级版本，只返回颜色
 */
export const useThemeColors = () => {
  const [colors, setColors] = useState(ThemeService.getCurrentTheme().colors);

  const handleThemeChange = useCallback((newTheme: Theme) => {
    setColors(newTheme.colors);
  }, []);

  useEffect(() => {
    ThemeService.addThemeChangeListener(handleThemeChange);
    return () => {
      ThemeService.removeThemeChangeListener(handleThemeChange);
    };
  }, [handleThemeChange]);

  return colors;
};

/**
 * 主题模式选择器 Hook
 * 提供主题模式切换功能
 */
export const useThemeMode = () => {
  const [themeMode, setCurrentThemeMode] = useState<ThemeMode>(ThemeService.getCurrentThemeMode());

  const handleThemeChange = useCallback(() => {
    setCurrentThemeMode(ThemeService.getCurrentThemeMode());
  }, []);

  useEffect(() => {
    ThemeService.addThemeChangeListener(handleThemeChange);
    return () => {
      ThemeService.removeThemeChangeListener(handleThemeChange);
    };
  }, [handleThemeChange]);

  const setThemeMode = useCallback(async (mode: ThemeMode) => {
    await ThemeService.setThemeMode(mode);
  }, []);

  const toggleTheme = useCallback(async () => {
    await ThemeService.toggleTheme();
  }, []);

  return {
    themeMode,
    setThemeMode,
    toggleTheme,
    isDarkMode: ThemeService.isDarkMode(),
  };
};