import { Theme, ThemeConfig, BaseTheme } from './types';
import { lightTheme, darkTheme, lightBaseTheme, darkBaseTheme } from './presets';
import { storageService } from '../storage';

class ThemeService {
    private currentTheme: Theme = lightTheme;
    private currentBaseTheme: BaseTheme = lightBaseTheme;
    private isDarkMode: boolean = false;
    private listeners: Array<(theme: Theme) => void> = [];
    private isInitialized: boolean = false;

    // 深色模式存储键名
    static DARK_THEME = 'rn_toolkit_dark_mode';
    // 主题存储键名
    static STORAGE_KEY = 'rn_toolkit_theme';

    /**
     * 初始化主题服务（从缓存加载设置）
     */
    async initialize(): Promise<void> {
        if (this.isInitialized) return;

        try {
            // 从存储中加载深色模式偏好
            const storedDarkMode = storageService.get(ThemeService.DARK_THEME);
            console.log('storedDarkMode', storedDarkMode);
            if (storedDarkMode !== null) {
                this.isDarkMode = JSON.parse(storedDarkMode);
            }

            // 从存储中加载自定义主题配置
            const storedThemeConfig = storageService.get(ThemeService.STORAGE_KEY);
            if (storedThemeConfig) {
                const config: ThemeConfig = JSON.parse(storedThemeConfig);
                this.currentBaseTheme = this.mergeBaseTheme(
                    this.isDarkMode ? darkBaseTheme : lightBaseTheme,
                    config
                );
            } else {
                this.currentBaseTheme = this.isDarkMode ? darkBaseTheme : lightBaseTheme;
            }

            // 重新生成完整主题
            this.regenerateTheme();
            this.isInitialized = true;
        } catch (error) {
            console.warn('Failed to load theme from storage:', error);
            // 使用默认主题
            this.currentTheme = this.isDarkMode ? darkTheme : lightTheme;
            this.currentBaseTheme = this.isDarkMode ? darkBaseTheme : lightBaseTheme;
            this.isInitialized = true;
        }
    }

    /**
     * 获取当前主题
     */
    getCurrentTheme(): Theme {
        return this.currentTheme;
    }

    /**
     * 获取当前基础主题
     */
    getCurrentBaseTheme(): BaseTheme {
        return this.currentBaseTheme;
    }

    /**
     * 获取是否为深色模式
     */
    getIsDarkMode(): boolean {
        return this.isDarkMode;
    }

    /**
     * 设置主题
     */
    async setTheme(theme: Theme): Promise<void> {
        this.currentTheme = theme;
        await this.notifyListeners();
    }

    /**
     * 更新主题配置
     */
    async updateTheme(config: ThemeConfig): Promise<void> {
        this.currentBaseTheme = this.mergeBaseTheme(this.currentBaseTheme, config);
        this.regenerateTheme();

        // 保存到存储
        storageService.set(ThemeService.STORAGE_KEY, JSON.stringify(config));
        await this.notifyListeners();
    }

    /**
     * 切换深色模式
     */
    async toggleDarkMode(): Promise<void> {
        this.isDarkMode = !this.isDarkMode;
        await this.applyDarkModeChange();
    }

    /**
     * 设置深色模式
     */
    async setDarkMode(isDark: boolean): Promise<void> {
        if (this.isDarkMode !== isDark) {
            this.isDarkMode = isDark;
            await this.applyDarkModeChange();
        }
    }

    /**
     * 重置主题
     */
    async resetTheme(): Promise<void> {
        this.currentBaseTheme = this.isDarkMode ? darkBaseTheme : lightBaseTheme;
        this.regenerateTheme();

        // 清除存储的自定义配置
        storageService.delete(ThemeService.STORAGE_KEY);
        await this.notifyListeners();
    }

    /**
     * 添加主题变化监听器
     */
    addListener(listener: (theme: Theme) => void): () => void {
        this.listeners.push(listener);

        // 返回取消监听的函数
        return () => {
            const index = this.listeners.indexOf(listener);
            if (index > -1) {
                this.listeners.splice(index, 1);
            }
        };
    }

    /**
     * 应用深色模式变化
     */
    private async applyDarkModeChange(): Promise<void> {
        // 保存深色模式偏好
        storageService.set(ThemeService.DARK_THEME, JSON.stringify(this.isDarkMode));

        // 更新基础主题
        const baseTheme = this.isDarkMode ? darkBaseTheme : lightBaseTheme;

        // 如果有自定义配置，需要重新应用
        const storedConfig = storageService.get(ThemeService.STORAGE_KEY);
        if (storedConfig) {
            const config: ThemeConfig = JSON.parse(storedConfig);
            this.currentBaseTheme = this.mergeBaseTheme(baseTheme, config);
        } else {
            this.currentBaseTheme = baseTheme;
        }

        this.regenerateTheme();
        await this.notifyListeners();
    }

    /**
     * 重新生成完整主题
     */
    private regenerateTheme(): void {
        // 这里应该调用 createFullTheme 函数来生成完整主题
        // 由于我们需要导入 createFullTheme，先简单处理
        this.currentTheme = this.isDarkMode ? darkTheme : lightTheme;
    }

    /**
     * 通知所有监听器
     */
    private async notifyListeners(): Promise<void> {
        this.listeners.forEach(listener => listener(this.currentTheme));
    }

    /**
     * 深度合并基础主题配置
     */
    private mergeBaseTheme(baseTheme: BaseTheme, config: ThemeConfig): BaseTheme {
        const merged = { ...baseTheme };

        if (config.colors) {
            merged.colors = { ...merged.colors, ...config.colors };
        }

        if (config.navigation) {
            merged.navigation = { ...merged.navigation, ...config.navigation };
        }

        if (config.text) {
            merged.text = { ...merged.text, ...config.text };
        }

        if (config.button) {
            merged.button = {
                ...merged.button,
                primary: { ...merged.button.primary, ...config.button.primary },
                secondary: { ...merged.button.secondary, ...config.button.secondary },
                outline: { ...merged.button.outline, ...config.button.outline },
                text: { ...merged.button.text, ...config.button.text },
                disabled: { ...merged.button.disabled, ...config.button.disabled },
            };
        }

        if (config.input) {
            merged.input = {
                ...merged.input,
                default: { ...merged.input.default, ...config.input.default },
                focused: { ...merged.input.focused, ...config.input.focused },
                error: { ...merged.input.error, ...config.input.error },
                disabled: { ...merged.input.disabled, ...config.input.disabled },
                label: { ...merged.input.label, ...config.input.label },
                helperText: { ...merged.input.helperText, ...config.input.helperText },
                errorText: { ...merged.input.errorText, ...config.input.errorText },
            };
        }

        if (config.spacing) {
            merged.spacing = { ...merged.spacing, ...config.spacing };
        }

        if (config.borderRadius) {
            merged.borderRadius = { ...merged.borderRadius, ...config.borderRadius };
        }

        if (config.shadow) {
            merged.shadow = { ...merged.shadow, ...config.shadow };
        }

        return merged;
    }

}

export const themeService = new ThemeService();

// 自动初始化
themeService.initialize().catch(error => {
    console.warn('Failed to initialize theme service:', error);
});