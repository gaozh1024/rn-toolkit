export type Locale = {
    languageTag: string; // e.g. 'zh-Hans-CN' | 'en-US'
    languageCode: string; // e.g. 'zh' | 'en'
    countryCode?: string; // e.g. 'CN' | 'US'
    isRTL: boolean;
};

export interface LocalizationInfo {
    locale: Locale;
    timeZone: string;
    currencies: string[]; // e.g. ['CNY']
    country: string; // e.g. 'CN'
    uses24HourClock: boolean;
    usesMetricSystem: boolean;
}

export interface LocalizationOptions {
    onError?: (error: Error) => void;
}