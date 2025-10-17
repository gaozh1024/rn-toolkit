// 顶层导入处
import * as RNLocalize from 'react-native-localize';
import { AppState, AppStateStatus } from 'react-native';
import { LocalizationInfo, LocalizationOptions, Locale } from './types';

// 兼容包装：不同版本可能缺少这些方法，使用可选属性访问
type LocalizeCompat = {
    getLocales: () => Array<{ languageTag: string; languageCode: string; countryCode?: string; isRTL: boolean }>;
    getTimeZone: () => string;
    getCurrencies?: () => string[];
    getCountry?: () => string;
    uses24HourClock?: () => boolean;
    usesMetricSystem?: () => boolean;
    addEventListener?: ((event: 'change', handler: () => void) => void) | ((handler: () => void) => void);
    removeEventListener?: ((event: 'change', handler: () => void) => void) | ((handler: () => void) => void);
    findBestAvailableLanguage?: (tags: string[]) => { languageTag: string; isRTL: boolean } | undefined;
};

const Localize = RNLocalize as unknown as LocalizeCompat;

class LocalizationServiceImpl {
    private info: LocalizationInfo;
    private listeners: Set<(info: LocalizationInfo) => void> = new Set();
    private rnSubscription?: { remove: () => void };
    private hasRNLocalizeListener = false;
    private appStateSubscription?: { remove: () => void };

    constructor() {
        this.info = this.readLocalizationInfo();
        this.attachListeners();
    }

    // readLocalizationInfo 方法
    private readLocalizationInfo(): LocalizationInfo {
        const locales = Localize.getLocales?.() ?? [];
        const primary = locales[0];

        const locale: Locale = {
            languageTag: primary?.languageTag || 'en-US',
            languageCode: primary?.languageCode || 'en',
            countryCode: primary?.countryCode ?? 'US',
            isRTL: !!primary?.isRTL,
        };

        const timeZone = Localize.getTimeZone?.() || 'UTC';
        const currencies = Localize.getCurrencies?.() || [];
        const country = Localize.getCountry?.() || locale.countryCode || 'US';
        const uses24 = Localize.uses24HourClock?.() ?? false;
        const metric = Localize.usesMetricSystem?.() ?? true;

        return {
            locale,
            timeZone,
            currencies,
            country,
            uses24HourClock: uses24,
            usesMetricSystem: metric,
        };
    }

    private handleChange = () => {
        this.info = this.readLocalizationInfo();
        this.emit();
    };

    private handleAppStateChange = (next: AppStateStatus) => {
        if (next === 'active') {
            // 回到前台时重新读取，兼容部分设备变更事件未触发
            this.handleChange();
        }
    };

    private attachListeners() {
        try {
            if (typeof Localize.addEventListener === 'function') {
                try {
                    // 新签名：('change', handler)
                    (Localize.addEventListener as (event: 'change', handler: () => void) => void)('change', this.handleChange);
                } catch {
                    // 旧签名：(handler)
                    (Localize.addEventListener as any)(this.handleChange);
                }
                this.hasRNLocalizeListener = true;
            }
        } catch {
            // ignore
        }
        this.appStateSubscription = AppState.addEventListener('change', this.handleAppStateChange) as any;
    }

    private detachListeners() {
        try {
            if (this.hasRNLocalizeListener && typeof Localize.removeEventListener === 'function') {
                try {
                    // 新签名：('change', handler)
                    (Localize.removeEventListener as (event: 'change', handler: () => void) => void)('change', this.handleChange);
                } catch {
                    // 旧签名：(handler)
                    (Localize.removeEventListener as any)(this.handleChange);
                }
            }
        } catch {
            // ignore
        }
        try { this.appStateSubscription?.remove(); } catch { }
        this.hasRNLocalizeListener = false;
        this.appStateSubscription = undefined;
    }

    private emit() {
        for (const l of Array.from(this.listeners)) {
            try {
                l(this.info);
            } catch { }
        }
    }

    getInfo(): LocalizationInfo {
        // 返回快照，避免外部持有引用
        return { ...this.info, locale: { ...this.info.locale } };
    }

    refresh(options?: LocalizationOptions): LocalizationInfo {
        try {
            this.info = this.readLocalizationInfo();
            this.emit();
            return this.getInfo();
        } catch (e) {
            options?.onError?.(e as Error);
            return this.getInfo();
        }
    }

    addListener(listener: (info: LocalizationInfo) => void): () => void {
        this.listeners.add(listener);
        // 立即推送一次当前状态
        try {
            listener(this.getInfo());
        } catch { }
        return () => {
            this.listeners.delete(listener);
        };
    }

    // 工具方法：根据候选语言选择最佳语言（可用于加载翻译包）
    findBestLanguage(tags: string[]): { languageTag: string; isRTL: boolean } | null {
        if (typeof Localize.findBestAvailableLanguage === 'function') {
            const res = Localize.findBestAvailableLanguage(tags);
            return res ? { languageTag: res.languageTag, isRTL: !!res.isRTL } : null;
        }
        // 回退：基于 getLocales 手工匹配
        const locales = Localize.getLocales?.() ?? [];
        const preferred = locales.map(l => String(l.languageTag).toLowerCase());
        const candidates = tags.map(t => String(t).toLowerCase());

        // 完整语言标签匹配
        for (const c of candidates) {
            const idx = preferred.indexOf(c);
            if (idx >= 0) {
                const found = locales[idx];
                return { languageTag: found.languageTag, isRTL: !!found.isRTL };
            }
        }
        // 语言代码匹配（忽略地区）
        for (const p of preferred) {
            const pLang = p.split('-')[0];
            const match = candidates.find(c => c.split('-')[0] === pLang);
            if (match) {
                const found = locales.find(l => String(l.languageTag).toLowerCase().split('-')[0] === pLang);
                return found ? { languageTag: found.languageTag, isRTL: !!found.isRTL } : { languageTag: match, isRTL: false };
            }
        }
        return null;
    }
}

export const LocalizationService = new LocalizationServiceImpl();
export default LocalizationService;