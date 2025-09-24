import { ViewStyle, TextStyle, Appearance, DimensionValue } from 'react-native';
import { StyleTheme, SpacingSize, ColorTheme, CSSStyles, StyleGenerators, AppTheme, ThemeMode } from './types';
import { defaultTheme, defaultAppTheme, createStylePresets } from './presets';
import StorageService from '../storage/StorageService';


class StyleService {
    private static instance: StyleService;
    private theme: StyleTheme = defaultTheme;
    private appTheme: AppTheme = defaultAppTheme;
    private presets = createStylePresets(this.theme);
    private listeners: Array<(theme: AppTheme) => void> = [];
    private appearanceSubscription: any = null;
    private static readonly STORAGE_KEY = 'app_theme_mode';

    static getInstance(): StyleService {
        if (!StyleService.instance) {
            StyleService.instance = new StyleService();
        }
        return StyleService.instance;
    }

    // 初始化主题服务
    async initialize(): Promise<void> {
        try {
            // 从存储中读取主题模式
            const savedMode = StorageService.getSimple(StyleService.STORAGE_KEY);
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
        } catch (error) {
            console.warn('Failed to initialize theme service:', error);
        }
    }

    // 更新当前主题
    private updateCurrentTheme(): void {
        let targetMode: 'light' | 'dark';
        if (this.appTheme.mode === 'system') {
            targetMode = Appearance.getColorScheme() === 'dark' ? 'dark' : 'light';
        } else {
            targetMode = this.appTheme.mode;
        }

        this.appTheme.currentColors = this.appTheme.colors[targetMode];

        // 在updateCurrentTheme方法中
        this.theme = {
            colors: this.appTheme.currentColors,
            spacing: this.appTheme.spacing,
            borderRadius: this.appTheme.borderRadius,
            shadows: this.appTheme.shadows,
            // 使用defaultTheme中的navigation配置
            navigation: defaultTheme.navigation,
        };
        this.presets = createStylePresets(this.theme);
        this.notifyListeners();
    }

    // 设置主题模式
    async setThemeMode(mode: ThemeMode): Promise<void> {
        this.appTheme.mode = mode;
        StorageService.setSimple(StyleService.STORAGE_KEY, mode);
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

    // 获取完整应用主题
    getAppTheme(): AppTheme {
        return this.appTheme;
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

    // 获取当前主题
    getTheme(): StyleTheme {
        return this.theme;
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

export { StyleService };
export default StyleService.getInstance();