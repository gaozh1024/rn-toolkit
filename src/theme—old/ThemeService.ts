import { ViewStyle, TextStyle, Appearance, DimensionValue } from 'react-native';
import { StyleTheme, SpacingSize, ColorTheme, CSSStyles, StyleGenerators, AppTheme, ThemeMode } from './types';
import { defaultTheme, defaultAppTheme, createStylePresets } from './presets';
import { storageService } from '../storage';
import StorageService from '../storage/StorageService';


class ThemeService {
    private static instance: ThemeService;
    private theme: StyleTheme = defaultTheme;
    private appTheme: AppTheme = defaultAppTheme;
    private presets = createStylePresets(this.theme);
    private listeners: Array<(theme: AppTheme) => void> = [];
    private appearanceSubscription: any = null;
    private static readonly STORAGE_KEY = 'app_theme_mode';
    private isInitialized = false; // 添加初始化标志

    static getInstance(): ThemeService {
        if (!ThemeService.instance) {
            ThemeService.instance = new ThemeService();
        }
        return ThemeService.instance;
    }

    // 初始化主题服务
    async initialize(): Promise<void> {
        if (this.isInitialized) {
            return; // 避免重复初始化
        }

        try {
            // 从存储中读取主题模式
            const savedMode = storageService.get(ThemeService.STORAGE_KEY);
            if (savedMode && ['light', 'dark', 'system'].includes(savedMode)) {
                this.appTheme.mode = savedMode as ThemeMode;
            }

            // 监听系统主题变化
            this.appearanceSubscription = Appearance.addChangeListener(({ colorScheme }) => {
                if (this.appTheme.mode === 'system') {
                    this.updateCurrentTheme();
                }
            });

            // 更新当前主题
            this.updateCurrentTheme();
            this.isInitialized = true;
        } catch (error) {
            console.warn('Failed to initialize theme service:', error);
            // 即使初始化失败，也标记为已初始化，使用默认主题
            this.isInitialized = true;
        }
    }

    // 更新当前主题
    private updateCurrentTheme(): void {
        try {
            // 确保 typography 对象完整
            const safeTypography = {
                ...defaultTheme.typography,
                fontWeight: {
                    // 先使用默认主题的 fontWeight，然后用我们的安全默认值填补缺失的属性
                    ...defaultTheme.typography?.fontWeight,
                    light: defaultTheme.typography?.fontWeight?.light || '300',
                    normal: defaultTheme.typography?.fontWeight?.normal || '400',
                    medium: defaultTheme.typography?.fontWeight?.medium || '500',
                    semibold: defaultTheme.typography?.fontWeight?.semibold || '600',
                    bold: defaultTheme.typography?.fontWeight?.bold || '700',
                }
            };

            // 更新主题
            this.theme = {
                ...defaultTheme,
                typography: safeTypography,
            };

            // 根据当前模式设置颜色
            const currentMode = this.appTheme.mode === 'system'
                ? (Appearance.getColorScheme() || 'light')
                : this.appTheme.mode;

            if (currentMode === 'dark') {
                this.appTheme.currentColors = this.appTheme.colors.dark;
            } else {
                this.appTheme.currentColors = this.appTheme.colors.light;
            }

            // 确保 appTheme 的 typography 也是完整的
            this.appTheme.typography = safeTypography;

            // 重新创建预设
            this.presets = createStylePresets(this.theme);

            // 通知监听器
            this.notifyListeners();
        } catch (error) {
            console.warn('Error updating theme:', error);
            // 即使出错也要确保有基本的主题结构
            this.theme = {
                ...defaultTheme,
                typography: {
                    ...defaultTheme.typography,
                    fontWeight: {
                        light: '300',
                        normal: '400',
                        medium: '500',
                        semibold: '600',
                        bold: '700',
                    }
                }
            };
            this.appTheme.typography = this.theme.typography;
        }
    }

    // 获取完整应用主题
    getAppTheme(): AppTheme {
        // 如果未初始化，确保返回安全的默认主题
        if (!this.isInitialized) {
            return {
                ...defaultAppTheme,
                typography: {
                    ...defaultAppTheme.typography,
                    fontWeight: {
                        ...defaultAppTheme.typography?.fontWeight,
                        light: defaultAppTheme.typography?.fontWeight?.light || '300',
                        normal: defaultAppTheme.typography?.fontWeight?.normal || '400',
                        medium: defaultAppTheme.typography?.fontWeight?.medium || '500',
                        semibold: defaultAppTheme.typography?.fontWeight?.semibold || '600',
                        bold: defaultAppTheme.typography?.fontWeight?.bold || '700',
                    }
                }
            };
        }
        return this.appTheme;
    }

    // 获取主题
    getTheme(): StyleTheme {
        // 如果未初始化，确保返回安全的默认主题
        if (!this.isInitialized) {
            return {
                ...defaultTheme,
                typography: {
                    ...defaultTheme.typography,
                    fontWeight: {
                        ...defaultTheme.typography?.fontWeight,
                        light: defaultTheme.typography?.fontWeight?.light || '300',
                        normal: defaultTheme.typography?.fontWeight?.normal || '400',
                        medium: defaultTheme.typography?.fontWeight?.medium || '500',
                        semibold: defaultTheme.typography?.fontWeight?.semibold || '600',
                        bold: defaultTheme.typography?.fontWeight?.bold || '700',
                    }
                }
            };
        }
        return this.theme;
    }

    // 设置主题模式
    async setThemeMode(mode: ThemeMode): Promise<void> {
        this.appTheme.mode = mode;
        storageService.set(ThemeService.STORAGE_KEY, mode);
        this.updateCurrentTheme();
    }

    // 切换主题
    async toggleTheme(): Promise<void> {
        const newMode: ThemeMode = this.appTheme.mode === 'light' ? 'dark' : 'light';
        await this.setThemeMode(newMode);
    }

    // 获取当前主题模式
    getCurrentThemeMode(): ThemeMode {
        return this.appTheme.mode;
    }

    // 判断是否为暗色模式
    isDarkMode(): boolean {
        return this.appTheme.currentColors === this.appTheme.colors.dark;
    }

    // 添加主题变化监听器
    addThemeChangeListener(listener: (theme: AppTheme) => void): void {
        this.listeners.push(listener);
    }

    // 移除主题变化监听器
    removeThemeChangeListener(listener: (theme: AppTheme) => void): void {
        const index = this.listeners.indexOf(listener);
        if (index > -1) {
            this.listeners.splice(index, 1);
        }
    }

    // 通知监听器
    private notifyListeners(): void {
        this.listeners.forEach(listener => {
            try {
                listener(this.appTheme);
            } catch (error) {
                console.warn('Theme listener error:', error);
            }
        });
    }

    // 清理资源
    cleanup(): void {
        if (this.appearanceSubscription) {
            this.appearanceSubscription.remove();
            this.appearanceSubscription = null;
        }
        this.listeners = [];
    }

    // 设置主题
    setTheme(theme: Partial<StyleTheme>): void {
        this.theme = { ...this.theme, ...theme };
        this.presets = createStylePresets(this.theme);
    }

    // 获取间距值
    private getSpacingValue(value: SpacingSize | number): number {
        if (typeof value === 'number') return value;
        return this.theme.spacing[value];
    }

    // 获取颜色值
    private getColorValue(color: keyof ColorTheme | string): string {
        if (typeof color === 'string' && color.startsWith('#')) return color;
        return this.theme.colors[color as keyof ColorTheme] || color;
    }

    // 创建样式生成器
    private createGenerators(): StyleGenerators {
        return {
            // 内边距
            p: (value) => ({ padding: this.getSpacingValue(value) }),
            pt: (value) => ({ paddingTop: this.getSpacingValue(value) }),
            pb: (value) => ({ paddingBottom: this.getSpacingValue(value) }),
            pl: (value) => ({ paddingLeft: this.getSpacingValue(value) }),
            pr: (value) => ({ paddingRight: this.getSpacingValue(value) }),
            px: (value) => ({ paddingHorizontal: this.getSpacingValue(value) }),
            py: (value) => ({ paddingVertical: this.getSpacingValue(value) }),

            // 外边距
            m: (value) => ({ margin: this.getSpacingValue(value) }),
            mt: (value) => ({ marginTop: this.getSpacingValue(value) }),
            mb: (value) => ({ marginBottom: this.getSpacingValue(value) }),
            ml: (value) => ({ marginLeft: this.getSpacingValue(value) }),
            mr: (value) => ({ marginRight: this.getSpacingValue(value) }),
            mx: (value) => ({ marginHorizontal: this.getSpacingValue(value) }),
            my: (value) => ({ marginVertical: this.getSpacingValue(value) }),

            // 尺寸
            w: (value: DimensionValue) => ({ width: value }),
            h: (value: DimensionValue) => ({ height: value }),
            size: (value: DimensionValue) => ({ width: value, height: value }),

            // 颜色
            bg: (color) => ({ backgroundColor: this.getColorValue(color) }),
            color: (color) => ({ color: this.getColorValue(color) }),
            borderColor: (color) => ({ borderColor: this.getColorValue(color) }),

            // 透明度
            opacity: (value) => ({ opacity: value }),
        };
    }

    // 获取完整的CSS样式对象
    getCSS(): CSSStyles {
        return {
            ...this.presets,
            ...this.createGenerators(),
        };
    }

    // 组合多个样式
    combine(...styles: (ViewStyle | TextStyle | undefined | null | false)[]): ViewStyle | TextStyle {
        return Object.assign({}, ...styles.filter(Boolean));
    }

    // 条件样式
    when(condition: boolean, style: ViewStyle | TextStyle): ViewStyle | TextStyle | {} {
        return condition ? style : {};
    }
}

export { ThemeService };
export default ThemeService.getInstance();
