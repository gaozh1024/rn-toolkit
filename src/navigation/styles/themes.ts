import { StackNavigationOptions } from '@react-navigation/stack';
import { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { ReactNavigationTheme } from '../types/navigation';
import styleService from '../../theme/ThemeService';

/**
 * 获取当前主题的导航配置
 */
export const getNavigationTheme = (): ReactNavigationTheme => {
  const appTheme = styleService.getAppTheme();
  const colors = appTheme.currentColors;
  const isDark = styleService.isDarkMode();

  return {
    dark: isDark,
    colors: {
      primary: colors.primary,
      background: colors.background,
      card: colors.surface,
      text: colors.text,
      border: colors.border,
      notification: colors.secondary,
    },
  };
};

/**
 * React Navigation 主题适配器 (直接返回标准格式)
 */
export const createReactNavigationTheme = (): ReactNavigationTheme => {
  return getNavigationTheme();
};

/**
 * 堆栈导航主题样式生成器
 */
export class StackThemeGenerator {
  private static getColors() {
    return styleService.getAppTheme().currentColors;
  }

  /**
   * 默认堆栈样式
   */
  static default(): StackNavigationOptions {
    const colors = this.getColors();

    return {
      headerStyle: {
        backgroundColor: colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        elevation: 4,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      headerTintColor: colors.text,
      headerTitleStyle: {
        color: colors.text,
        fontWeight: '600',
        fontSize: 18,
      },
      headerBackTitleVisible: false,
      headerTitleAlign: 'center',
    };
  }

  /**
   * 透明头部样式
   */
  static transparent(): StackNavigationOptions {
    const colors = this.getColors();

    return {
      headerTransparent: true,
      headerStyle: {
        backgroundColor: 'transparent',
      },
      headerTintColor: colors.text,
      headerTitleStyle: {
        color: colors.text,
        fontWeight: '600',
      },
    };
  }

  /**
   * 模态样式
   */
  static modal(): StackNavigationOptions {
    const colors = this.getColors();

    return {
      presentation: 'modal',
      headerStyle: {
        backgroundColor: colors.surface,
        borderBottomWidth: 0,
        elevation: 0,
        shadowOpacity: 0,
      },
      headerTintColor: colors.text,
      headerLeft: () => null,
      gestureEnabled: true,
    };
  }

  /**
   * 无头部样式
   */
  static headerless(): StackNavigationOptions {
    return {
      headerShown: false,
    };
  }
}

/**
 * 标签页导航主题样式生成器
 */
export class TabThemeGenerator {
  private static getColors() {
    return styleService.getAppTheme().currentColors;
  }

  /**
   * 默认标签页样式
   */
  static default(): BottomTabNavigationOptions {
    const colors = this.getColors();

    return {
      headerShown: false,
      tabBarStyle: {
        backgroundColor: colors.surface,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        elevation: 8,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        height: 60,
        paddingBottom: 8,
        paddingTop: 8,
      },
      tabBarActiveTintColor: colors.primary,
      tabBarInactiveTintColor: colors.textSecondary,
      tabBarLabelStyle: {
        fontSize: 12,
        fontWeight: '500',
        marginTop: 4,
      },
      tabBarIconStyle: {
        marginBottom: 2,
      },
      tabBarHideOnKeyboard: true,
    };
  }

  /**
   * 简约标签页样式
   */
  static minimal(): BottomTabNavigationOptions {
    const colors = this.getColors();

    return {
      headerShown: false,
      tabBarStyle: {
        backgroundColor: colors.surface,
        borderTopWidth: 0,
        elevation: 0,
        shadowOpacity: 0,
        height: 50,
      },
      tabBarActiveTintColor: colors.primary,
      tabBarInactiveTintColor: colors.textSecondary,
      tabBarShowLabel: false,
      tabBarHideOnKeyboard: true,
    };
  }

  /**
   * 浮动标签页样式
   */
  static floating(): BottomTabNavigationOptions {
    const colors = this.getColors();

    return {
      headerShown: false,
      tabBarStyle: {
        backgroundColor: colors.surface,
        borderTopWidth: 0,
        borderRadius: 20,
        marginHorizontal: 16,
        marginBottom: 16,
        elevation: 8,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        position: 'absolute',
        height: 60,
      },
      tabBarActiveTintColor: colors.primary,
      tabBarInactiveTintColor: colors.textSecondary,
      tabBarHideOnKeyboard: true,
    };
  }

  /**
   * 增强标签页样式 - 支持自定义按钮和更丰富的交互
   */
  static enhanced(): BottomTabNavigationOptions {
    const colors = this.getColors();

    return {
      headerShown: false,
      tabBarStyle: {
        backgroundColor: colors.surface,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        elevation: 12,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        height: 65,
        paddingBottom: 10,
        paddingTop: 10,
        paddingHorizontal: 8,
      },
      tabBarActiveTintColor: colors.primary,
      tabBarInactiveTintColor: colors.textSecondary,
      tabBarShowLabel: false, // 使用自定义标签
      tabBarHideOnKeyboard: true,
      tabBarItemStyle: {
        borderRadius: 12,
        marginHorizontal: 4,
      },
      tabBarIconStyle: {
        marginBottom: 0,
      },
    };
  }
}

/**
 * 主题响应式样式钩子
 */
export const useNavigationTheme = () => {
  const theme = getNavigationTheme();

  return {
    theme,
    stackStyles: StackThemeGenerator,
    tabStyles: TabThemeGenerator,
    reactNavigationTheme: createReactNavigationTheme(),
  };
};

/**
 * 动态主题更新器
 */
export class NavigationThemeUpdater {
  private static listeners: Set<() => void> = new Set();

  /**
   * 添加主题变化监听器
   */
  static addListener(callback: () => void): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  /**
   * 通知主题变化
   */
  static notifyThemeChange(): void {
    this.listeners.forEach(callback => callback());
  }

  /**
   * 获取当前主题状态
   */
  static getCurrentTheme(): ReactNavigationTheme {
    return getNavigationTheme();
  }
}

/**
 * 导出统一的主题接口
 */
export const NavigationThemes = {
  Stack: StackThemeGenerator,
  Tab: TabThemeGenerator,
  Updater: NavigationThemeUpdater,
  getTheme: getNavigationTheme,
  createReactNavigationTheme,
  useTheme: useNavigationTheme,
} as const;

// 导出类型定义
export type NavigationThemeType = ReturnType<typeof getNavigationTheme>;
export type StackThemeMethod = keyof typeof StackThemeGenerator;
export type TabThemeMethod = keyof typeof TabThemeGenerator;