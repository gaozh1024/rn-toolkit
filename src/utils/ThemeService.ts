import { Appearance, ColorSchemeName } from 'react-native';
import StorageService from '../storage/StorageService';

export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeColors {
    // 基础颜色
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    error: string;
    warning: string;
    success: string;
    info: string;

    // 文本颜色
    onPrimary: string;
    onSecondary: string;
    onBackground: string;
    onSurface: string;
    onError: string;

    // 边框和分割线
    border: string;
    divider: string;

    // 状态颜色
    disabled: string;
    placeholder: string;

    // 阴影
    shadow: string;
}

export interface Theme {
    mode: 'light' | 'dark';
    colors: ThemeColors;
}

// 预定义的亮色主题
const lightTheme: Theme = {
    mode: 'light',
    colors: {
        primary: '#007AFF',
        secondary: '#5856D6',
        background: '#FFFFFF',
        surface: '#F2F2F7',
        error: '#FF3B30',
        warning: '#FF9500',
        success: '#34C759',
        info: '#5AC8FA',

        onPrimary: '#FFFFFF',
        onSecondary: '#FFFFFF',
        onBackground: '#000000',
        onSurface: '#000000',
        onError: '#FFFFFF',

        border: '#C6C6C8',
        divider: '#E5E5EA',

        disabled: '#8E8E93',
        placeholder: '#8E8E93',

        shadow: 'rgba(0, 0, 0, 0.1)',
    },
};

// 预定义的暗色主题
const darkTheme: Theme = {
    mode: 'dark',
    colors: {
        primary: '#0A84FF',
        secondary: '#5E5CE6',
        background: '#000000',
        surface: '#1C1C1E',
        error: '#FF453A',
        warning: '#FF9F0A',
        success: '#30D158',
        info: '#64D2FF',

        onPrimary: '#FFFFFF',
        onSecondary: '#FFFFFF',
        onBackground: '#FFFFFF',
        onSurface: '#FFFFFF',
        onError: '#FFFFFF',

        border: '#38383A',
        divider: '#2C2C2E',

        disabled: '#8E8E93',
        placeholder: '#8E8E93',

        shadow: 'rgba(0, 0, 0, 0.3)',
    },
};

class ThemeService {
    // 存储键名，用于保存用户偏好的主题模式
    private static readonly STORAGE_KEY = 'theme_mode';
    private static currentTheme: Theme = lightTheme;
    private static themeMode: ThemeMode = 'system';
    private static listeners: Array<(theme: Theme) => void> = [];
    private static appearanceSubscription: any = null;

    /**
     * 初始化主题服务
     */
    static async initialize(): Promise<void> {
        try {
            // 从存储中读取用户偏好
            const savedMode = StorageService.getSimple(this.STORAGE_KEY);
            if (savedMode && ['light', 'dark', 'system'].includes(savedMode)) {
                this.themeMode = savedMode as ThemeMode;
            }

            // 设置初始主题
            this.updateTheme();

            // 监听系统主题变化
            this.appearanceSubscription = Appearance.addChangeListener(({ colorScheme }) => {
                if (this.themeMode === 'system') {
                    this.updateTheme();
                }
            });
        } catch (error) {
            console.warn('ThemeService: Failed to initialize:', error);
        }
    }

    /**
     * 获取当前主题
     */
    static getCurrentTheme(): Theme {
        return this.currentTheme;
    }

    /**
     * 获取当前主题模式
     */
    static getCurrentThemeMode(): ThemeMode {
        return this.themeMode;
    }

    /**
     * 设置主题模式
     */
    static async setThemeMode(mode: ThemeMode): Promise<void> {
        try {
            this.themeMode = mode;
            StorageService.setSimple(this.STORAGE_KEY, mode);
            this.updateTheme();
        } catch (error) {
            console.warn('ThemeService: Failed to set theme mode:', error);
        }
    }

    /**
     * 切换到下一个主题模式
     */
    static async toggleTheme(): Promise<void> {
        const modes: ThemeMode[] = ['light', 'dark', 'system'];
        const currentIndex = modes.indexOf(this.themeMode);
        const nextIndex = (currentIndex + 1) % modes.length;
        await this.setThemeMode(modes[nextIndex]);
    }

    /**
     * 获取系统主题
     */
    static getSystemColorScheme(): ColorSchemeName {
        return Appearance.getColorScheme();
    }

    /**
     * 判断当前是否为暗色主题
     */
    static isDarkMode(): boolean {
        return this.currentTheme.mode === 'dark';
    }

    /**
     * 获取预定义主题
     */
    static getLightTheme(): Theme {
        return { ...lightTheme };
    }

    static getDarkTheme(): Theme {
        return { ...darkTheme };
    }

    /**
     * 自定义主题颜色
     */
    static setCustomTheme(customTheme: Partial<Theme>): void {
        const baseTheme = this.isDarkMode() ? darkTheme : lightTheme;
        this.currentTheme = {
            ...baseTheme,
            ...customTheme,
            colors: {
                ...baseTheme.colors,
                ...customTheme.colors,
            },
        };
        this.notifyListeners();
    }

    /**
     * 添加主题变化监听器
     */
    static addThemeChangeListener(listener: (theme: Theme) => void): void {
        this.listeners.push(listener);
    }

    /**
     * 移除主题变化监听器
     */
    static removeThemeChangeListener(listener: (theme: Theme) => void): void {
        const index = this.listeners.indexOf(listener);
        if (index > -1) {
            this.listeners.splice(index, 1);
        }
    }

    /**
     * 移除所有监听器并清理资源
     */
    static cleanup(): void {
        this.listeners = [];
        if (this.appearanceSubscription) {
            this.appearanceSubscription.remove();
            this.appearanceSubscription = null;
        }
    }

    /**
     * 更新当前主题
     */
    private static updateTheme(): void {
        let newTheme: Theme;

        if (this.themeMode === 'system') {
            const systemScheme = Appearance.getColorScheme();
            newTheme = systemScheme === 'dark' ? darkTheme : lightTheme;
        } else {
            newTheme = this.themeMode === 'dark' ? darkTheme : lightTheme;
        }

        if (newTheme.mode !== this.currentTheme.mode) {
            this.currentTheme = newTheme;
            this.notifyListeners();
        }
    }

    /**
     * 通知所有监听器
     */
    private static notifyListeners(): void {
        this.listeners.forEach(listener => {
            try {
                listener(this.currentTheme);
            } catch (error) {
                console.warn('ThemeService: Error in theme change listener:', error);
            }
        });
    }
}

export default ThemeService;