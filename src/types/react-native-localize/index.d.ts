declare module 'react-native-localize' {
  // 基础接口定义
  export interface Locale {
    languageCode: string;
    scriptCode?: string;
    countryCode: string;
    languageTag: string;
    isRTL: boolean;
  }

  export interface NumberFormatSettings {
    decimalSeparator: string;
    groupingSeparator: string;
  }

  export interface Calendar {
    calendar: string;
  }

  export interface Currency {
    currencyCode: string;
    currencySymbol: string;
  }

  export interface LanguageTag {
    languageTag: string;
    isRTL: boolean;
  }

  // 温度单位类型
  export type TemperatureUnit = 'celsius' | 'fahrenheit';

  // 主要 API 函数
  /**
   * 获取用户首选语言列表
   */
  export function getLocales(): Locale[];

  /**
   * 获取数字格式设置
   */
  export function getNumberFormatSettings(): NumberFormatSettings;

  /**
   * 获取日历类型
   */
  export function getCalendar(): string;

  /**
   * 获取国家代码
   */
  export function getCountry(): string;

  /**
   * 获取货币列表
   */
  export function getCurrencies(): string[];

  /**
   * 获取温度单位
   */
  export function getTemperatureUnit(): TemperatureUnit;

  /**
   * 获取时区
   */
  export function getTimeZone(): string;

  /**
   * 检查是否使用24小时制
   */
  export function uses24HourClock(): boolean;

  /**
   * 检查是否使用公制单位
   */
  export function usesMetricSystem(): boolean;

  /**
   * 从支持的语言标签中找到最佳匹配
   * @param languageTags 支持的语言标签数组
   */
  export function findBestLanguageTag(
    languageTags: string[]
  ): LanguageTag | undefined;

  /**
   * 从支持的语言标签中找到最佳匹配（旧版本兼容）
   * @param languageTags 支持的语言标签数组
   */
  export function findBestAvailableLanguage(
    languageTags: string[]
  ): LanguageTag | undefined;

  // 事件监听相关类型
  export type LocalizationChangeListener = () => void;

  // 扩展的本地化数据接口
  export interface LocalizationData {
    locales: Locale[];
    numberFormat: NumberFormatSettings;
    calendar: string;
    country: string;
    currencies: string[];
    temperatureUnit: TemperatureUnit;
    timeZone: string;
    uses24HourClock: boolean;
    usesMetricSystem: boolean;
  }

  // 格式化选项
  export interface NumberFormatOptions {
    useGrouping?: boolean;
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
  }

  export interface CurrencyFormatOptions extends NumberFormatOptions {
    currencyCode?: string;
    currencyDisplay?: 'symbol' | 'code' | 'name';
  }

  export interface DateFormatOptions {
    year?: 'numeric' | '2-digit';
    month?: 'numeric' | '2-digit' | 'long' | 'short' | 'narrow';
    day?: 'numeric' | '2-digit';
    hour?: 'numeric' | '2-digit';
    minute?: 'numeric' | '2-digit';
    second?: 'numeric' | '2-digit';
    timeZoneName?: 'short' | 'long';
    hour12?: boolean;
  }

  // 常量
  export const LOCALE_CHANGE_EVENT: string;

  // 实用工具函数（这些可能不是官方 API，但在某些版本中可能存在）
  export namespace Utils {
    /**
     * 获取当前语言标签
     */
    export function getCurrentLanguageTag(): string;

    /**
     * 获取当前语言代码
     */
    export function getCurrentLanguageCode(): string;

    /**
     * 获取当前国家代码
     */
    export function getCurrentCountryCode(): string;

    /**
     * 检查当前语言是否为从右到左
     */
    export function isRTL(): boolean;
  }
}

// 为了向后兼容，也可以导出一些常用的类型别名
declare module 'react-native-localize' {
  // 这些是可能在某些版本中存在的函数，但不保证在所有版本中都可用
  // 如果使用这些函数，建议先检查它们是否存在

  /**
   * 添加本地化变化监听器
   * @deprecated 在新版本中可能已移除，建议使用 AppState 监听应用状态变化
   * @param type 事件类型，通常是 'change'
   * @param handler 事件处理函数
   */
  export const addEventListener: ((
    type: 'change',
    handler: LocalizationChangeListener
  ) => void) | undefined;

  /**
   * 移除本地化变化监听器
   * @deprecated 在新版本中可能已移除
   * @param type 事件类型，通常是 'change'
   * @param handler 要移除的事件处理函数
   */
  export const removeEventListener: ((
    type: 'change',
    handler: LocalizationChangeListener
  ) => void) | undefined;
}