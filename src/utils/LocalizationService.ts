import {
    getLocales,
    getNumberFormatSettings,
    getCalendar,
    getCountry,
    getCurrencies,
    getTemperatureUnit,
    getTimeZone,
    uses24HourClock,
    usesMetricSystem,
    findBestLanguageTag,
    type Locale,
    type NumberFormatSettings as RNLocalizeNumberFormatSettings,
    type TemperatureUnit,
    type LanguageTag
} from 'react-native-localize';
import { AppState, AppStateStatus } from 'react-native';

export interface LocaleInfo extends Locale {}

export interface NumberFormatSettings extends RNLocalizeNumberFormatSettings {}

export interface LocalizationData {
    locales: LocaleInfo[];
    numberFormat: NumberFormatSettings;
    calendar: string;
    country: string;
    currencies: string[];
    temperatureUnit: TemperatureUnit;
    timeZone: string;
    uses24HourClock: boolean;
    usesMetricSystem: boolean;
}

class LocalizationService {
    private static listeners: Array<() => void> = [];
    private static appStateSubscription: any = null;

    /**
     * 获取用户首选语言列表
     */
    static getLocales(): LocaleInfo[] {
        return getLocales();
    }

    /**
     * 获取当前语言标签
     */
    static getCurrentLanguageTag(): string {
        const locales = this.getLocales();
        return locales[0]?.languageTag || 'en-US';
    }

    /**
     * 获取当前语言代码
     */
    static getCurrentLanguageCode(): string {
        const locales = this.getLocales();
        return locales[0]?.languageCode || 'en';
    }

    /**
     * 获取当前国家代码
     */
    static getCurrentCountryCode(): string {
        const locales = this.getLocales();
        return locales[0]?.countryCode || 'US';
    }

    /**
     * 检查当前语言是否为从右到左
     */
    static isRTL(): boolean {
        const locales = this.getLocales();
        return locales[0]?.isRTL || false;
    }

    /**
     * 从支持的语言标签中找到最佳匹配
     */
    static findBestLanguageTag(supportedLanguageTags: string[]): LanguageTag | undefined {
        return findBestLanguageTag(supportedLanguageTags);
    }

    /**
     * 获取数字格式设置
     */
    static getNumberFormatSettings(): NumberFormatSettings {
        return getNumberFormatSettings();
    }

    /**
     * 获取日历类型
     */
    static getCalendar(): string {
        return getCalendar();
    }

    /**
     * 获取国家代码
     */
    static getCountry(): string {
        return getCountry();
    }

    /**
     * 获取货币列表
     */
    static getCurrencies(): string[] {
        return getCurrencies();
    }

    /**
     * 获取温度单位
     */
    static getTemperatureUnit(): TemperatureUnit {
        return getTemperatureUnit();
    }

    /**
     * 获取时区
     */
    static getTimeZone(): string {
        return getTimeZone();
    }

    /**
     * 检查是否使用24小时制
     */
    static uses24HourClock(): boolean {
        return uses24HourClock();
    }

    /**
     * 检查是否使用公制单位
     */
    static usesMetricSystem(): boolean {
        return usesMetricSystem();
    }

    /**
     * 获取完整的本地化数据
     */
    static getLocalizationData(): LocalizationData {
        return {
            locales: this.getLocales(),
            numberFormat: this.getNumberFormatSettings(),
            calendar: this.getCalendar(),
            country: this.getCountry(),
            currencies: this.getCurrencies(),
            temperatureUnit: this.getTemperatureUnit(),
            timeZone: this.getTimeZone(),
            uses24HourClock: this.uses24HourClock(),
            usesMetricSystem: this.usesMetricSystem(),
        };
    }

    /**
     * 格式化数字
     */
    static formatNumber(number: number): string {
        const { decimalSeparator, groupingSeparator } = this.getNumberFormatSettings();

        return number.toLocaleString(this.getCurrentLanguageTag(), {
            useGrouping: true,
        }).replace(/,/g, groupingSeparator).replace(/\./g, decimalSeparator);
    }

    /**
     * 格式化货币
     */
    static formatCurrency(amount: number, currencyCode?: string): string {
        const currency = currencyCode || this.getCurrencies()[0] || 'USD';

        return new Intl.NumberFormat(this.getCurrentLanguageTag(), {
            style: 'currency',
            currency: currency,
        }).format(amount);
    }

    /**
     * 格式化日期
     */
    static formatDate(date: Date, options?: Intl.DateTimeFormatOptions): string {
        const defaultOptions: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        };

        return new Intl.DateTimeFormat(
            this.getCurrentLanguageTag(),
            { ...defaultOptions, ...options }
        ).format(date);
    }

    /**
     * 格式化时间
     */
    static formatTime(date: Date): string {
        return new Intl.DateTimeFormat(this.getCurrentLanguageTag(), {
            hour: 'numeric',
            minute: 'numeric',
            hour12: !this.uses24HourClock(),
        }).format(date);
    }

    /**
     * 添加本地化变化监听器
     * 由于新版本的 react-native-localize 移除了 addEventListener，
     * 我们使用 AppState 来监听应用状态变化，当应用从后台回到前台时检查本地化变化
     */
    static addChangeListener(listener: () => void): void {
        this.listeners.push(listener);
        
        // 如果是第一个监听器，开始监听应用状态变化
        if (this.listeners.length === 1 && !this.appStateSubscription) {
            this.appStateSubscription = AppState.addEventListener(
                'change',
                this.handleAppStateChange
            );
        }
    }

    /**
     * 移除本地化变化监听器
     */
    static removeChangeListener(listener: () => void): void {
        const index = this.listeners.indexOf(listener);
        if (index > -1) {
            this.listeners.splice(index, 1);
        }
        
        // 如果没有监听器了，移除应用状态监听
        if (this.listeners.length === 0 && this.appStateSubscription) {
            this.appStateSubscription.remove();
            this.appStateSubscription = null;
        }
    }

    private static handleAppStateChange = (nextAppState: AppStateStatus): void => {
        // 当应用从后台回到前台时，触发本地化变化检查
        if (nextAppState === 'active') {
            this.handleLocalizationChange();
        }
    };

    private static handleLocalizationChange = (): void => {
        // 通知所有监听器本地化可能发生了变化
        this.listeners.forEach(listener => {
            try {
                listener();
            } catch (error) {
                console.warn('LocalizationService: Error in change listener:', error);
            }
        });
    };

    /**
     * 移除所有监听器并清理资源
     */
    static removeAllListeners(): void {
        this.listeners = [];
        if (this.appStateSubscription) {
            this.appStateSubscription.remove();
            this.appStateSubscription = null;
        }
    }

    /**
     * 检查是否支持指定的语言标签
     */
    static isLanguageSupported(languageTag: string): boolean {
        const locales = this.getLocales();
        return locales.some(locale => locale.languageTag === languageTag);
    }

    /**
     * 获取支持的语言标签列表
     */
    static getSupportedLanguageTags(): string[] {
        return this.getLocales().map(locale => locale.languageTag);
    }

    /**
     * 获取本地化的星期几名称
     */
    static getWeekdayNames(format: 'long' | 'short' | 'narrow' = 'long'): string[] {
        const formatter = new Intl.DateTimeFormat(this.getCurrentLanguageTag(), {
            weekday: format
        });
        
        const weekdays: string[] = [];
        // 从周日开始（0）到周六（6）
        for (let i = 0; i < 7; i++) {
            const date = new Date(2023, 0, i + 1); // 2023年1月1日是周日
            weekdays.push(formatter.format(date));
        }
        
        return weekdays;
    }

    /**
     * 获取本地化的月份名称
     */
    static getMonthNames(format: 'long' | 'short' | 'narrow' = 'long'): string[] {
        const formatter = new Intl.DateTimeFormat(this.getCurrentLanguageTag(), {
            month: format
        });
        
        const months: string[] = [];
        for (let i = 0; i < 12; i++) {
            const date = new Date(2023, i, 1);
            months.push(formatter.format(date));
        }
        
        return months;
    }
}

export default LocalizationService;