import { Theme, ThemeConfig, BaseTheme, ThemeMode } from './types';
import {
    lightBaseTheme,
    darkBaseTheme,
    createFullTheme
} from './presets';
import { storageService } from '../storage';
import { Appearance } from 'react-native';

/**
 * 主题服务类
 * 负责管理应用的主题配置，包括浅色/深色模式切换、自定义主题配置的存储和加载
 */
class ThemeService {
    // 当前主题
    private currentTheme: Theme;
    // 当前基础主题
    private currentBaseTheme: BaseTheme;
    // 当前主题模式
    private currentMode: ThemeMode = 'light';
    // 是否为深色模式
    private isDarkMode: boolean = false;
    // 浅色主题自定义配置
    private lightThemeConfig: ThemeConfig = {};
    // 深色主题自定义配置
    private darkThemeConfig: ThemeConfig = {};
    // 主题变化监听器（支持同步或异步回调）
    private listeners: Array<(theme: Theme) => void | Promise<void>> = [];
    // 是否已初始化
    private isInitialized: boolean = false;

    // 获取系统深色模式
    private getSystemDark(): boolean {
        try {
            const scheme = Appearance.getColorScheme();
            return scheme === 'dark';
        } catch (e) {
            return false;
        }
    }

    // 存储键名常量
    static readonly STORAGE_KEYS = {
        // 主题模式存储键名
        THEME_MODE: 'rn_toolkit_theme_mode',
        // 深色模式存储键名
        DARK_MODE: 'rn_toolkit_dark_mode',
        // 浅色主题自定义配置存储键名
        LIGHT_THEME_CONFIG: 'rn_toolkit_light_theme_config',
        // 深色主题自定义配置存储键名
        DARK_THEME_CONFIG: 'rn_toolkit_dark_theme_config',
    } as const;

    constructor() {
        // 初始化默认主题
        this.currentBaseTheme = lightBaseTheme;
        this.currentTheme = createFullTheme(lightBaseTheme);
    }

    /**
     * 初始化主题服务
     * 从存储中加载用户的主题偏好和自定义配置
     */
    private appearanceSubscription: { remove: () => void } | null = null;

    async initialize(): Promise<void> {
        if (this.isInitialized) {
            return;
        }

        try {
            // 1. 加载主题模式偏好
            await this.loadThemeMode();

            // 2. 加载自定义主题配置
            await this.loadCustomThemeConfigs();

            // 3. 应用当前主题
            await this.applyCurrentTheme();

            // 4. 如果是系统模式，开启系统主题监听
            this.updateAppearanceListener();

            this.isInitialized = true;
            console.log('ThemeService initialized successfully');
        } catch (error) {
            console.warn('Failed to initialize ThemeService:', error);
            // 使用默认配置
            this.useDefaultTheme();
            this.isInitialized = true;
        }
    }

    /**
     * 加载主题模式偏好
     */
    private async loadThemeMode(): Promise<void> {
        try {
            // 加载主题模式
            const storedMode = storageService.get(ThemeService.STORAGE_KEYS.THEME_MODE);
            console.log('加载主题模式:', storedMode);
            if (storedMode) {
                // 检查是否已经是有效的模式值
                if (['light', 'dark', 'system'].includes(storedMode)) {
                    this.currentMode = storedMode as ThemeMode;
                } else {
                    // 尝试JSON解析
                    try {
                        const parsedMode = JSON.parse(storedMode);
                        if (['light', 'dark', 'system'].includes(parsedMode)) {
                            this.currentMode = parsedMode as ThemeMode;
                        } else {
                            console.warn('Invalid theme mode value:', parsedMode);
                            this.currentMode = 'light';
                        }
                    } catch (parseError) {
                        console.warn('Failed to parse theme mode, using default:', parseError);
                        this.currentMode = 'light';
                        // 清除无效的存储值
                        storageService.delete(ThemeService.STORAGE_KEYS.THEME_MODE);
                    }
                }
            }

            // 加载深色模式状态
            const storedDarkMode = storageService.get(ThemeService.STORAGE_KEYS.DARK_MODE);
            console.log('加载深色模式状态:', storedDarkMode);
            if (storedDarkMode !== null) {
                // 检查是否已经是布尔值
                if (typeof storedDarkMode === 'boolean') {
                    this.isDarkMode = storedDarkMode;
                } else {
                    // 尝试JSON解析
                    try {
                        const parsedDarkMode = JSON.parse(storedDarkMode);
                        if (typeof parsedDarkMode === 'boolean') {
                            this.isDarkMode = parsedDarkMode;
                        } else {
                            console.warn('Invalid dark mode value:', parsedDarkMode);
                            this.isDarkMode = false;
                        }
                    } catch (parseError) {
                        console.warn('Failed to parse dark mode, using default:', parseError);
                        this.isDarkMode = false;
                        // 清除无效的存储值
                        storageService.delete(ThemeService.STORAGE_KEYS.DARK_MODE);
                    }
                }
            }

            // 根据模式确定深色模式状态
            if (this.currentMode === 'system') {
                // 系统模式：使用系统主题覆盖存储状态
                this.isDarkMode = this.getSystemDark();
            } else {
                this.isDarkMode = this.currentMode === 'dark';
            }
        } catch (error) {
            console.warn('Failed to load theme mode:', error);
            // 使用默认值
            this.currentMode = 'light';
            this.isDarkMode = false;
        }
    }

    /**
     * 加载自定义主题配置
     */
    private async loadCustomThemeConfigs(): Promise<void> {
        const parseConfig = (raw: any, key: string): ThemeConfig => {
            try {
                if (raw == null) return {};
                if (typeof raw === 'object' && !Array.isArray(raw)) {
                    return raw as ThemeConfig;
                }
                if (typeof raw === 'string') {
                    const parsed = JSON.parse(raw);
                    return (parsed && typeof parsed === 'object') ? parsed as ThemeConfig : {};
                }
                console.warn(`Invalid theme config type for ${key}:`, typeof raw);
                return {};
            } catch (e) {
                console.warn(`Failed to parse theme config for ${key}:`, e);
                // 清除无效的存储值，避免下次继续报错
                storageService.delete(key);
                return {};
            }
        };

        try {
            // 加载浅色主题自定义配置
            const lightRaw = storageService.get(ThemeService.STORAGE_KEYS.LIGHT_THEME_CONFIG);
            console.log('加载浅色主题自定义配置:', lightRaw);
            this.lightThemeConfig = parseConfig(lightRaw, ThemeService.STORAGE_KEYS.LIGHT_THEME_CONFIG);

            // 加载深色主题自定义配置
            const darkRaw = storageService.get(ThemeService.STORAGE_KEYS.DARK_THEME_CONFIG);
            console.log('加载深色主题自定义配置:', darkRaw);
            this.darkThemeConfig = parseConfig(darkRaw, ThemeService.STORAGE_KEYS.DARK_THEME_CONFIG);
        } catch (error) {
            console.warn('Failed to load custom theme configs:', error);
            // 使用默认配置
            this.lightThemeConfig = {};
            this.darkThemeConfig = {};
        }
    }

    /**
     * 应用当前主题
     */
    private async applyCurrentTheme(): Promise<void> {
        // 获取基础主题
        const baseTheme = this.isDarkMode ? darkBaseTheme : lightBaseTheme;

        // 获取对应的自定义配置
        const customConfig = this.isDarkMode ? this.darkThemeConfig : this.lightThemeConfig;

        // 合并基础主题和自定义配置
        this.currentBaseTheme = this.mergeBaseTheme(baseTheme, customConfig);

        // 生成完整主题
        this.currentTheme = createFullTheme(this.currentBaseTheme);

        // 通知监听器
        await this.notifyListeners();
    }

    /**
     * 使用默认主题
     */
    private useDefaultTheme(): void {
        this.currentMode = 'light';
        this.isDarkMode = false;
        this.lightThemeConfig = {};
        this.darkThemeConfig = {};
        this.currentBaseTheme = lightBaseTheme;
        this.currentTheme = createFullTheme(lightBaseTheme);
    }

    /**
     * 获取当前完整主题
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
     * 获取当前主题模式
     */
    getCurrentMode(): ThemeMode {
        return this.currentMode;
    }

    /**
     * 获取是否为深色模式
     */
    getIsDarkMode(): boolean {
        return this.isDarkMode;
    }

    /**
     * 获取当前模式的自定义配置
     */
    getCurrentThemeConfig(): ThemeConfig {
        return this.isDarkMode ? this.darkThemeConfig : this.lightThemeConfig;
    }

    /**
     * 获取浅色主题自定义配置
     */
    getLightThemeConfig(): ThemeConfig {
        return this.lightThemeConfig;
    }

    /**
     * 获取深色主题自定义配置
     */
    getDarkThemeConfig(): ThemeConfig {
        return this.darkThemeConfig;
    }

    /**
     * 设置主题模式
     */
    async setThemeMode(mode: ThemeMode): Promise<void> {
        // 参数验证
        if (!mode || typeof mode !== 'string') {
            console.warn('Invalid theme mode provided:', mode);
            return;
        }

        // 验证模式有效性
        if (!['light', 'dark', 'system'].includes(mode)) {
            console.warn('Invalid theme mode value:', mode);
            return;
        }

        if (this.currentMode === mode) {
            return;
        }

        this.currentMode = mode;

        // 根据模式更新深色模式状态
        if (mode === 'light') {
            this.isDarkMode = false;
        } else if (mode === 'dark') {
            this.isDarkMode = true;
        } else if (mode === 'system') {
            // 立即与系统主题同步
            this.isDarkMode = this.getSystemDark();
        }

        // 保存到存储
        await this.saveThemeMode();

        // 应用主题
        await this.applyCurrentTheme();

        // 更新系统主题监听器
        this.updateAppearanceListener();
    }

    /**
     * 切换深色模式
     */
    async toggleDarkMode(): Promise<void> {
        await this.setDarkMode(!this.isDarkMode);
    }

    /**
     * 设置深色模式
     */
    async setDarkMode(isDark: boolean): Promise<void> {
        // 参数验证
        if (typeof isDark !== 'boolean') {
            console.warn('Invalid dark mode flag provided:', isDark);
            return;
        }

        if (this.isDarkMode === isDark) {
            return;
        }

        this.isDarkMode = isDark;

        // 如果不是系统模式，同步更新主题模式
        if (this.currentMode !== 'system') {
            this.currentMode = isDark ? 'dark' : 'light';
        }

        // 保存到存储
        await this.saveThemeMode();

        // 应用主题
        await this.applyCurrentTheme();

        // 确保监听器状态正确
        this.updateAppearanceListener();
    }

    /**
     * 更新当前模式的主题配置
     */
    async updateCurrentThemeConfig(config: Partial<ThemeConfig>): Promise<void> {
        if (this.isDarkMode) {
            await this.updateDarkThemeConfig(config);
        } else {
            await this.updateLightThemeConfig(config);
        }
    }

    /**
     * 更新浅色主题配置
     */
    async updateLightThemeConfig(config: Partial<ThemeConfig>): Promise<void> {
        // 参数校验
        if (!config || typeof config !== 'object') {
            console.warn('Invalid light theme config provided:', config);
            return;
        }

        // 深度合并配置
        this.lightThemeConfig = this.deepMergeConfig(this.lightThemeConfig, config);

        // 保存到存储（JSON.stringify 可能抛错，包裹 try/catch）
        try {
            storageService.set(
                ThemeService.STORAGE_KEYS.LIGHT_THEME_CONFIG,
                JSON.stringify(this.lightThemeConfig)
            );
        } catch (e) {
            console.warn('Failed to persist light theme config, skipping storage write:', e);
        }

        // 如果当前是浅色模式，应用主题
        if (!this.isDarkMode) {
            await this.applyCurrentTheme();
        }
    }

    /**
     * 更新深色主题配置
     */
    async updateDarkThemeConfig(config: Partial<ThemeConfig>): Promise<void> {
        // 参数校验
        if (!config || typeof config !== 'object') {
            console.warn('Invalid dark theme config provided:', config);
            return;
        }

        // 深度合并配置
        this.darkThemeConfig = this.deepMergeConfig(this.darkThemeConfig, config);

        // 保存到存储（JSON.stringify 可能抛错，包裹 try/catch）
        try {
            storageService.set(
                ThemeService.STORAGE_KEYS.DARK_THEME_CONFIG,
                JSON.stringify(this.darkThemeConfig)
            );
        } catch (e) {
            console.warn('Failed to persist dark theme config, skipping storage write:', e);
        }

        // 如果当前是深色模式，应用主题
        if (this.isDarkMode) {
            await this.applyCurrentTheme();
        }
    }

    /**
     * 重置当前模式的主题配置
     */
    async resetCurrentThemeConfig(): Promise<void> {
        if (this.isDarkMode) {
            await this.resetDarkThemeConfig();
        } else {
            await this.resetLightThemeConfig();
        }
    }

    /**
     * 重置浅色主题配置
     */
    async resetLightThemeConfig(): Promise<void> {
        this.lightThemeConfig = {};

        // 删除存储的配置
        storageService.delete(ThemeService.STORAGE_KEYS.LIGHT_THEME_CONFIG);

        // 如果当前是浅色模式，应用主题
        if (!this.isDarkMode) {
            await this.applyCurrentTheme();
        }
    }

    /**
     * 重置深色主题配置
     */
    async resetDarkThemeConfig(): Promise<void> {
        this.darkThemeConfig = {};

        // 删除存储的配置
        storageService.delete(ThemeService.STORAGE_KEYS.DARK_THEME_CONFIG);

        // 如果当前是深色模式，应用主题
        if (this.isDarkMode) {
            await this.applyCurrentTheme();
        }
    }

    /**
     * 重置所有主题配置
     */
    async resetAllThemeConfigs(): Promise<void> {
        // 重置为默认状态
        this.currentMode = 'light';
        this.isDarkMode = false;
        this.lightThemeConfig = {};
        this.darkThemeConfig = {};

        // 清除所有存储
        storageService.delete(ThemeService.STORAGE_KEYS.THEME_MODE);
        storageService.delete(ThemeService.STORAGE_KEYS.DARK_MODE);
        storageService.delete(ThemeService.STORAGE_KEYS.LIGHT_THEME_CONFIG);
        storageService.delete(ThemeService.STORAGE_KEYS.DARK_THEME_CONFIG);

        // 应用默认主题
        await this.applyCurrentTheme();
    }

    /**
     * 添加主题变化监听器
     */
    addListener(listener: (theme: Theme) => void | Promise<void>): () => void {
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
     * 移除所有监听器
     */
    removeAllListeners(): void {
        this.listeners = [];
    }

    /**
     * 根据当前模式管理系统主题监听器
     */
    private updateAppearanceListener() {
        try {
            // 清理旧的监听
            if (this.appearanceSubscription) {
                this.appearanceSubscription.remove();
                this.appearanceSubscription = null;
            }

            if (this.currentMode === 'system') {
                this.appearanceSubscription = Appearance.addChangeListener(async ({ colorScheme }) => {
                    const newIsDark = colorScheme === 'dark';
                    if (this.isDarkMode !== newIsDark) {
                        this.isDarkMode = newIsDark;
                        await this.saveThemeMode();
                        await this.applyCurrentTheme();
                    }
                });
            }
        } catch (e) {
            console.warn('Failed to update appearance listener:', e);
        }
    }

    /**
     * 保存主题模式到存储
     */
    private async saveThemeMode(): Promise<void> {
        try {
            storageService.set(
                ThemeService.STORAGE_KEYS.THEME_MODE,
                JSON.stringify(this.currentMode)
            );
            storageService.set(
                ThemeService.STORAGE_KEYS.DARK_MODE,
                JSON.stringify(this.isDarkMode)
            );
        } catch (error) {
            console.warn('Failed to save theme mode:', error);
        }
    }

    /**
     * 通知所有监听器
     * - 支持异步回调：逐个 await，避免竞态与未捕获的 Promise
     * - 捕获并记录单个监听器错误，保证其他监听器继续执行
     */
    private async notifyListeners(): Promise<void> {
        for (const listener of this.listeners) {
            try {
                await listener(this.currentTheme);
            } catch (error) {
                console.warn('Error in theme listener:', error);
            }
        }
    }

    /**
     * 深度合并基础主题和自定义配置
     */
    private mergeBaseTheme(baseTheme: BaseTheme, config: ThemeConfig): BaseTheme {
        const merged: BaseTheme = JSON.parse(JSON.stringify(baseTheme));

        if (config.colors) {
            merged.colors = { ...merged.colors, ...config.colors };
        }

        if (config.navigation) {
            merged.navigation = { ...merged.navigation, ...config.navigation };
        }

        if (config.text) {
            merged.text = { ...merged.text };
            Object.keys(config.text).forEach(key => {
                const configValue = config.text![key as keyof typeof config.text];
                const mergedValue = merged.text[key as keyof typeof merged.text];

                // 如果配置值和合并值都是对象，则深度合并
                if (typeof configValue === 'object' && configValue !== null &&
                    typeof mergedValue === 'object' && mergedValue !== null) {
                    merged.text[key as keyof typeof merged.text] = {
                        ...mergedValue,
                        ...configValue
                    } as any;
                } else {
                    // 否则直接覆盖
                    merged.text[key as keyof typeof merged.text] = configValue as any;
                }
            });
        }

        if (config.button) {
            merged.button = { ...merged.button };
            Object.keys(config.button).forEach(key => {
                const configValue = config.button![key as keyof typeof config.button];
                const mergedValue = merged.button[key as keyof typeof merged.button];

                // 如果配置值和合并值都是对象，则深度合并
                if (typeof configValue === 'object' && configValue !== null &&
                    typeof mergedValue === 'object' && mergedValue !== null) {
                    merged.button[key as keyof typeof merged.button] = {
                        ...mergedValue,
                        ...configValue
                    } as any;
                } else {
                    // 否则直接覆盖
                    merged.button[key as keyof typeof merged.button] = configValue as any;
                }
            });
        }

        if (config.input) {
            merged.input = { ...merged.input };
            Object.keys(config.input).forEach(key => {
                const configValue = config.input![key as keyof typeof config.input];
                const mergedValue = merged.input[key as keyof typeof merged.input];

                // 如果配置值和合并值都是对象，则深度合并
                if (typeof configValue === 'object' && configValue !== null &&
                    typeof mergedValue === 'object' && mergedValue !== null) {
                    merged.input[key as keyof typeof merged.input] = {
                        ...mergedValue,
                        ...configValue
                    } as any;
                } else {
                    // 否则直接覆盖
                    merged.input[key as keyof typeof merged.input] = configValue as any;
                }
            });
        }

        if (config.spacing) {
            merged.spacing = { ...merged.spacing, ...config.spacing };
        }

        if (config.borderRadius) {
            merged.borderRadius = { ...merged.borderRadius, ...config.borderRadius };
        }

        if (config.shadow) {
            merged.shadow = { ...merged.shadow };
            Object.keys(config.shadow).forEach(key => {
                merged.shadow[key as keyof typeof merged.shadow] = {
                    ...merged.shadow[key as keyof typeof merged.shadow],
                    ...config.shadow![key as keyof typeof config.shadow]
                };
            });
        }

        return merged;
    }

    /**
     * 深度合并主题配置
     */
    private deepMergeConfig(target: ThemeConfig, source: Partial<ThemeConfig>): ThemeConfig {
        const result: ThemeConfig = JSON.parse(JSON.stringify(target));

        Object.keys(source).forEach(key => {
            const sourceValue = source[key as keyof ThemeConfig];
            const targetValue = result[key as keyof ThemeConfig];

            if (sourceValue && typeof sourceValue === 'object' && !Array.isArray(sourceValue)) {
                result[key as keyof ThemeConfig] = {
                    ...targetValue,
                    ...sourceValue
                } as any;
            } else {
                result[key as keyof ThemeConfig] = sourceValue as any;
            }
        });

        return result;
    }

    /**
     * 获取主题服务状态（用于调试）
     */
    getDebugInfo() {
        return {
            isInitialized: this.isInitialized,
            currentMode: this.currentMode,
            isDarkMode: this.isDarkMode,
            lightThemeConfig: this.lightThemeConfig,
            darkThemeConfig: this.darkThemeConfig,
            listenersCount: this.listeners.length,
        };
    }
}

// 创建单例实例
export const themeService = new ThemeService();

// 自动初始化
themeService.initialize().catch(error => {
    console.warn('Failed to initialize ThemeService:', error);
});

export default themeService;