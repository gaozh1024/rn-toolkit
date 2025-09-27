import { useState, useEffect } from 'react';
import { themeService } from './ThemeService';
import { BaseTheme, Theme, ThemeConfig, UseThemeReturn, StylePresets } from './types';

/**
 * 主题Hook - 统一的主题使用接口
 */
export const useTheme = (): UseThemeReturn => {
  const [fullTheme, setFullTheme] = useState<Theme>(themeService.getCurrentTheme());
  const [isDark, setIsDark] = useState<boolean>(themeService.getIsDarkMode());

  useEffect(() => {
    // 监听主题变化
    const unsubscribe = themeService.addListener((newTheme) => {
      setFullTheme(newTheme);
      setIsDark(themeService.getIsDarkMode());
    });

    return unsubscribe;
  }, []);

  const updateTheme = async (config: ThemeConfig) => {
    try {
      await themeService.updateCurrentThemeConfig(config);
    } catch (error) {
      console.error('Failed to update theme:', error);
    }
  };

  const resetTheme = async () => {
    try {
      await themeService.resetCurrentThemeConfig();
    } catch (error) {
      console.error('Failed to reset theme:', error);
    }
  };

  const toggleDarkMode = () => {
    themeService.toggleDarkMode();
  };

  // 提取基础主题（用户可修改部分）
  const theme: BaseTheme = {
    colors: fullTheme.colors,
    navigation: fullTheme.navigation,
    text: fullTheme.text,
    button: fullTheme.button,
    input: fullTheme.input,
    spacing: fullTheme.spacing,
    borderRadius: fullTheme.borderRadius,
    shadow: fullTheme.shadow,
  };

  // 样式预设（只读）
  const styles: StylePresets = fullTheme.styles;

  return {
    theme,
    fullTheme,
    styles,
    updateTheme,
    resetTheme,
    isDark,
    toggleDarkMode,
  };
};

/**
 * 获取基础主题的Hook（用户可修改部分）
 */
export const useBaseTheme = (): BaseTheme => {
  const { theme } = useTheme();
  return theme;
};

/**
 * 获取样式预设的Hook（只读）
 */
export const useStyles = (): StylePresets => {
  const { styles } = useTheme();
  return styles;
};

/**
 * 获取布局样式的Hook
 */
export const useLayoutStyles = () => {
  const { styles } = useTheme();
  return styles.layout;
};

/**
 * 获取圆角样式的Hook
 */
export const useBorderRadiusStyles = () => {
  const { styles } = useTheme();
  return styles.borderRadius;
};

/**
 * 获取阴影样式的Hook
 */
export const useShadowStyles = () => {
  const { styles } = useTheme();
  return styles.shadow;
};

/**
 * 获取边框样式的Hook
 */
export const useBorderStyles = () => {
  const { styles } = useTheme();
  return styles.border;
};

/**
 * 获取间距样式的Hook
 */
export const useSpacingStyles = () => {
  const { styles } = useTheme();
  return styles.spacing;
};

/**
 * 获取尺寸样式的Hook
 */
export const useSizeStyles = () => {
  const { styles } = useTheme();
  return styles.size;
};

// =============================================================================
// 向后兼容的Hook（获取基础主题的特定部分）
// =============================================================================

/**
 * 获取颜色主题的Hook
 */
export const useThemeColors = () => {
  const { theme } = useTheme();
  return theme.colors;
};

/**
 * 获取导航主题的Hook
 */
export const useNavigationTheme = () => {
  const { theme } = useTheme();
  return theme.navigation;
};

/**
 * 获取文本样式的Hook
 */
export const useTextStyles = () => {
  const { theme } = useTheme();
  return theme.text;
};

/**
 * 获取按钮样式的Hook
 */
export const useButtonStyles = () => {
  const { theme } = useTheme();
  return theme.button;
};

/**
 * 获取输入框样式的Hook
 */
export const useInputStyles = () => {
  const { theme } = useTheme();
  return theme.input;
};

/**
 * 获取间距主题的Hook
 */
export const useSpacing = () => {
  const { theme } = useTheme();
  return theme.spacing;
};

/**
 * 获取圆角主题的Hook
 */
export const useBorderRadius = () => {
  const { theme } = useTheme();
  return theme.borderRadius;
};

/**
 * 获取阴影主题的Hook
 */
export const useShadow = () => {
  const { theme } = useTheme();
  return theme.shadow;
};