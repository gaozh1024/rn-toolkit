import { Platform, StatusBar } from 'react-native';
import { storageService } from '../storage';
import { themeService } from '../theme/ThemeService';

export type StatusBarStyleType = 'default' | 'light-content' | 'dark-content';
export type StatusBarAnimation = 'none' | 'fade' | 'slide';

export interface StatusBarConfig {
    barStyle?: StatusBarStyleType;
    backgroundColor?: string; // Android only
    translucent?: boolean;    // Android only
    hidden?: boolean;
    animated?: boolean;
    showHideTransition?: 'fade' | 'slide';
    networkActivityIndicatorVisible?: boolean; // iOS only (deprecated in RN, kept for compat)
}

export interface StatusBarState {
    barStyle: StatusBarStyleType;
    backgroundColor: string;
    translucent: boolean;
    hidden: boolean;
    animated: boolean;
    showHideTransition: 'fade' | 'slide';
    networkActivityIndicatorVisible: boolean;
}

class StatusBarService {
    private static readonly STORAGE_KEY = 'rn_toolkit_statusbar_config';
    private static currentConfig: StatusBarState = {
        barStyle: 'default',
        backgroundColor: '#000000',
        translucent: false,
        hidden: false,
        animated: true,
        showHideTransition: 'fade',
        networkActivityIndicatorVisible: false,
    };

    private static listeners: Array<(config: StatusBarState) => void> = [];
    private static autoThemeEnabled = true;
    private static themeUnsubscribe: (() => void) | null = null;

    /**
     * 初始化状态栏服务
     */
    static async initialize(): Promise<void> {
        try {
            // 读取并解析配置
            const raw = storageService.get(this.STORAGE_KEY);
            if (raw) {
                try {
                    const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
                    this.currentConfig = {
                        ...this.currentConfig,
                        ...(parsed || {}),
                    };
                } catch (e) {
                    console.warn('StatusBarService: Failed to parse stored config, using defaults:', e);
                }
            }

            // 订阅主题变化以自动应用推荐样式
            if (this.autoThemeEnabled && !this.themeUnsubscribe) {
                this.themeUnsubscribe = themeService.addListener(async () => {
                    this.applyThemeBasedStyle();
                });
                // 首次应用推荐样式
                this.applyThemeBasedStyle();
            }

            // 应用当前配置
            this.applyConfig(this.currentConfig);
        } catch (error) {
            console.warn('StatusBarService: Failed to initialize:', error);
        }
    }

    /**
     * 获取当前状态栏配置
     */
    static getCurrentConfig(): StatusBarState {
        return { ...this.currentConfig };
    }

    /**
     * 设置状态栏配置
     */
    static setConfig(config: Partial<StatusBarConfig>): void {
        try {
            const newConfig: StatusBarState = {
                ...this.currentConfig,
                ...config,
            };

            this.currentConfig = newConfig;
            this.applyConfig(newConfig);
            this.saveConfig();
            this.notifyListeners();
        } catch (error) {
            console.warn('StatusBarService: Failed to set config:', error);
        }
    }

    /**
     * 设置状态栏样式
     */
    static setBarStyle(barStyle: StatusBarStyleType, animated: boolean = true): void {
        this.setConfig({ barStyle, animated });
    }

    /**
     * 设置状态栏背景色（Android）
     */
    static setBackgroundColor(backgroundColor: string, animated: boolean = true): void {
        this.setConfig({ backgroundColor, animated });
    }

    /**
     * 设置状态栏透明度（Android）
     */
    static setTranslucent(translucent: boolean): void {
        this.setConfig({ translucent });
    }

    /**
     * 设置显示/隐藏
     */
    static setHidden(hidden: boolean, animation: 'fade' | 'slide' = 'fade'): void {
        this.setConfig({
            hidden,
            showHideTransition: animation,
            animated: true,
        });
    }

    static show(animation: 'fade' | 'slide' = 'fade'): void {
        this.setHidden(false, animation);
    }

    static hide(animation: 'fade' | 'slide' = 'fade'): void {
        this.setHidden(true, animation);
    }

    /**
     * 设置网络活动指示器（iOS；RN 已废弃，保留兼容）
     */
    static setNetworkActivityIndicatorVisible(visible: boolean): void {
        if (Platform.OS === 'ios') {
            this.setConfig({ networkActivityIndicatorVisible: visible });
        }
    }

    /**
     * 启用自动主题模式
     * 主题变化时自动更新推荐样式
     */
    static enableAutoTheme(): void {
        if (!this.autoThemeEnabled) {
            this.autoThemeEnabled = true;
            if (!this.themeUnsubscribe) {
                this.themeUnsubscribe = themeService.addListener(async () => {
                    this.applyThemeBasedStyle();
                });
            }
            this.applyThemeBasedStyle();
        }
    }

    /**
     * 禁用自动主题模式
     */
    static disableAutoTheme(): void {
        if (this.autoThemeEnabled) {
            this.autoThemeEnabled = false;
            if (this.themeUnsubscribe) {
                try {
                    this.themeUnsubscribe();
                } catch { }
                this.themeUnsubscribe = null;
            }
        }
    }

    /**
     * 检查是否启用了自动主题
     */
    static isAutoThemeEnabled(): boolean {
        return this.autoThemeEnabled;
    }

    /**
     * 重置为默认配置
     */
    static reset(): void {
        const defaultConfig: StatusBarState = {
            barStyle: 'default',
            backgroundColor: '#000000',
            translucent: false,
            hidden: false,
            animated: true,
            showHideTransition: 'fade',
            networkActivityIndicatorVisible: false,
        };

        this.currentConfig = defaultConfig;
        this.applyConfig(defaultConfig);
        this.saveConfig();
        this.notifyListeners();
    }

    /**
     * 获取推荐的状态栏样式（基于主题）
     */
    static getRecommendedStyle(): StatusBarStyleType {
        const isDark = themeService.getIsDarkMode();
        return isDark ? 'light-content' : 'dark-content';
    }

    /**
     * 获取推荐的背景色（基于主题）
     */
    static getRecommendedBackgroundColor(): string {
        const colors = themeService.getCurrentTheme().colors;
        return colors.background;
    }

    /**
     * 添加配置变化监听器
     */
    static addConfigChangeListener(listener: (config: StatusBarState) => void): void {
        this.listeners.push(listener);
    }

    /**
     * 移除配置变化监听器
     */
    static removeConfigChangeListener(listener: (config: StatusBarState) => void): void {
        const index = this.listeners.indexOf(listener);
        if (index > -1) {
            this.listeners.splice(index, 1);
        }
    }

    /**
     * 清理资源
     */
    static cleanup(): void {
        this.listeners = [];
        if (this.themeUnsubscribe) {
            try {
                this.themeUnsubscribe();
            } catch { }
            this.themeUnsubscribe = null;
        }
    }

    /**
     * 应用状态栏配置到原生 API
     */
    private static applyConfig(config: StatusBarState): void {
        try {
            StatusBar.setBarStyle(config.barStyle, config.animated);

            if (Platform.OS === 'android') {
                StatusBar.setBackgroundColor(config.backgroundColor, config.animated);
                StatusBar.setTranslucent(config.translucent);
            }

            if (config.hidden) {
                StatusBar.setHidden(true, config.showHideTransition);
            } else {
                StatusBar.setHidden(false, config.showHideTransition);
            }

            if (Platform.OS === 'ios') {
                // RN 新版已移除该 API，保留 try/catch 兼容旧版本
                try {
                    // @ts-ignore
                    StatusBar.setNetworkActivityIndicatorVisible(config.networkActivityIndicatorVisible);
                } catch { }
            }
        } catch (error) {
            console.warn('StatusBarService: Failed to apply config:', error);
        }
    }

    /**
     * 根据当前主题应用推荐样式
     */
    private static applyThemeBasedStyle(): void {
        const isDark = themeService.getIsDarkMode();
        const colors = themeService.getCurrentTheme().colors;

        const recommendedStyle: StatusBarStyleType = isDark ? 'light-content' : 'dark-content';
        const recommendedBackgroundColor = colors.background;

        this.setConfig({
            barStyle: recommendedStyle,
            backgroundColor: recommendedBackgroundColor,
        });
    }

    /**
     * 持久化配置
     */
    private static saveConfig(): void {
        try {
            storageService.set(this.STORAGE_KEY, JSON.stringify(this.currentConfig));
        } catch (error) {
            console.warn('StatusBarService: Failed to save config:', error);
        }
    }

    /**
     * 通知所有监听器
     */
    private static notifyListeners(): void {
        this.listeners.forEach(listener => {
            try {
                listener(this.currentConfig);
            } catch (error) {
                console.warn('StatusBarService: Error in config change listener:', error);
            }
        });
    }
}

export default StatusBarService;
export { StatusBarService };