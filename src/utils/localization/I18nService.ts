import LocalizationService from './LocalizationService';
import { storageService } from '../../storage';

type LanguageMode = 'system' | 'fixed';

type Messages = Record<string, string>;
type LanguagePack = {
    tag: string;           // 标准标签，如 'zh-Hans-CN' | 'en-US'
    messages: Messages;    // 扁平 key-value：'home.title' -> '首页'
    aliases?: string[];    // 别名：['zh-CN', 'zh-Hans'] 等
    rtl?: boolean;         // 覆盖 RTL 标记（如某些包需要强行 RTL）
};

type I18nState = {
    tag: string | null;
    mode: LanguageMode;
    rtl: boolean;
};

const STORAGE_KEYS = {
    LANG_MODE: 'rn_toolkit_lang_mode',// 语言模式（system/fixed）
    LANG_TAG: 'rn_toolkit_lang_tag',// 固定语言标签（若模式为 fixed）
    LANG_OVERRIDES: 'rn_toolkit_lang_overrides',// 消息覆盖（key-value 扁平结构）
} as const;

class I18nServiceImpl {
    private initialized = false;
    private mode: LanguageMode = 'system';
    private currentTag: string | null = null;
    private isRTL = false;

    private packs: Map<string, LanguagePack> = new Map();
    private aliasMap: Map<string, string> = new Map();
    private overrides: Messages = {};
    private listeners: Set<(state: I18nState) => void> = new Set();
    private unsubscribeLoc?: () => void;

    async initialize(): Promise<void> {
        if (this.initialized) return;

        // 恢复模式
        const storedModeRaw = storageService.get(STORAGE_KEYS.LANG_MODE);
        const storedMode = this.parseJson<string>(storedModeRaw, 'system');
        if (storedMode === 'system' || storedMode === 'fixed') {
            this.mode = storedMode;
        }

        // 恢复固定语言
        const storedTagRaw = storageService.get(STORAGE_KEYS.LANG_TAG);
        const storedTag = this.parseJson<string | null>(storedTagRaw, null);
        this.currentTag = storedTag;

        // 恢复覆盖
        const overridesRaw = storageService.get(STORAGE_KEYS.LANG_OVERRIDES);
        const loadedObj = this.parseJson<Record<string, unknown>>(overridesRaw, {});
        this.overrides = this.sanitizeMessages(loadedObj);

        // 监听系统语言变化（system 模式时触发重选）
        this.unsubscribeLoc = LocalizationService.addListener(() => {
            if (this.mode === 'system') {
                this.selectBestTag();
            }
        });

        // 首次选择语言（若已注册包则选最佳；否则在后续 registerPacks 时再选）
        this.selectBestTag();

        this.initialized = true;
    }

    destroy(): void {
        try { this.unsubscribeLoc?.(); } catch { /* ignore */ }
        this.unsubscribeLoc = undefined;
        this.listeners.clear();
        this.initialized = false;
    }

    registerPacks(packs: LanguagePack[]): void {
        for (const p of packs) {
            const tag = this.normalizeTag(p.tag);
            this.packs.set(tag, {
                ...p,
                messages: this.sanitizeMessages(p.messages as unknown as Record<string, unknown>),
                tag,
            });
            if (p.aliases && Array.isArray(p.aliases)) {
                for (const a of p.aliases) {
                    this.aliasMap.set(this.normalizeTag(a), tag);
                }
            }
        }
        this.selectBestTag();
    }

    getState(): I18nState {
        return { tag: this.currentTag, mode: this.mode, rtl: this.isRTL };
    }

    addListener(listener: (state: I18nState) => void): () => void {
        this.listeners.add(listener);
        // 立即推送
        try { listener(this.getState()); } catch { /* ignore */ }
        return () => { this.listeners.delete(listener); };
    }

    setLanguageMode(mode: LanguageMode): void {
        if (mode !== 'system' && mode !== 'fixed') return;
        if (this.mode === mode) return;

        this.mode = mode;
        try { storageService.set(STORAGE_KEYS.LANG_MODE, JSON.stringify(mode)); } catch { /* ignore */ }

        if (mode === 'system') {
            this.selectBestTag();
        } else {
            // fixed 模式：保留 currentTag，不变更
            this.emit();
        }
    }

    setLanguageTag(tag: string | null): void {
        if (!tag) {
            // null/空 -> 回到 system 模式并按系统语言选择
            this.currentTag = null;
            try { storageService.delete(STORAGE_KEYS.LANG_TAG); } catch { /* ignore */ }
            this.setLanguageMode('system');
            return;
        }
        const normalized = this.resolveTag(tag);
        if (!normalized) {
            console.warn('[I18nService] setLanguageTag: unknown tag', tag);
            return;
        }
        this.currentTag = normalized;
        this.isRTL = this.computeRTL(normalized);
        try { storageService.set(STORAGE_KEYS.LANG_TAG, JSON.stringify(normalized)); } catch { /* ignore */ }
        if (this.mode !== 'fixed') {
            this.mode = 'fixed';
            try { storageService.set(STORAGE_KEYS.LANG_MODE, JSON.stringify('fixed')); } catch { /* ignore */ }
        }
        this.emit();
    }

    private sanitizeMessages(src: Record<string, unknown>): Messages {
        const result: Messages = {};
        for (const [k, v] of Object.entries(src || {})) {
            if (typeof v === 'string') {
                result[k] = v;
            }
        }
        return result;
    }

    updateOverrides(next: Record<string, string | null | undefined>): void {
        const sanitized = this.sanitizeMessages(next as Record<string, unknown>);
        this.overrides = { ...this.overrides, ...sanitized };
        try { storageService.set(STORAGE_KEYS.LANG_OVERRIDES, JSON.stringify(this.overrides)); } catch { /* ignore */ }
        this.emit();
    }

    resetOverrides(): void {
        this.overrides = {};
        try { storageService.delete(STORAGE_KEYS.LANG_OVERRIDES); } catch { /* ignore */ }
        this.emit();
    }

    t(key: string, params?: Record<string, any>): string {
        if (!key || typeof key !== 'string') return '';
        const msg = this.resolveMessage(key);
        if (!msg) return key; // 回退：直接返回 key
        return params ? this.interpolate(msg, params) : msg;
    }

    // 工具方法

    private selectBestTag(): void {
        // 若 fixed 且 currentTag 有效，维持现状
        if (this.mode === 'fixed' && this.currentTag && this.packs.has(this.currentTag)) {
            this.isRTL = this.computeRTL(this.currentTag);
            this.emit();
            return;
        }

        const registeredTags = Array.from(this.packs.keys());
        if (registeredTags.length === 0) {
            // 尚未注册包：依据系统信息计算 RTL，但暂不设置 tag
            const sysTag = LocalizationService.getInfo().locale.languageTag;
            this.isRTL = this.computeRTL(sysTag);
            this.emit();
            return;
        }

        // 先尝试使用已存储的 tag（若有效）
        if (this.currentTag && this.packs.has(this.currentTag)) {
            this.isRTL = this.computeRTL(this.currentTag);
            this.emit();
            return;
        }

        // system 模式：按系统语言选最佳
        // 将别名也加入候选列表，以提高匹配率（例如 iOS zh-Hans-CN 可能匹配到别名 zh-Hans，从而定位到 zh-CN）
        const allCandidates = [...registeredTags, ...Array.from(this.aliasMap.keys())];

        // Debug: 打印系统语言与匹配过程
        const sysLocale = LocalizationService.getInfo().locale;
        console.log('\x1b[32m[I18nService] 系统语言:\x1b[0m', sysLocale.languageTag);
        // console.log('[I18nService] Candidates:', allCandidates);

        const best = LocalizationService.findBestLanguage(allCandidates);
        console.log('[I18nService] Best Match:', best);

        // 匹配到的可能是别名，需要 resolve 为主 tag；若未匹配到则兜底使用第一个注册包
        const matchedTag = best ? best.languageTag : registeredTags[0];
        const normalized = this.resolveTag(matchedTag) || registeredTags[0];

        console.log('\x1b[32m[I18nService] 最终解决的标签:\x1b[0m', normalized);

        this.currentTag = normalized;
        this.isRTL = this.computeRTL(normalized);

        try { storageService.set(STORAGE_KEYS.LANG_TAG, JSON.stringify(normalized)); } catch { /* ignore */ }

        this.emit();
    }

    private resolveMessage(key: string): string | null {
        // 覆盖优先
        if (this.overrides && this.overrides[key] != null) {
            return this.overrides[key];
        }
        // 当前语言
        const tag = this.currentTag;
        if (tag) {
            const found = this.lookupInTag(tag, key);
            if (found) return found;
            // 逐级回退（去地区、去脚本、仅语言）
            const chain = this.fallbackChain(tag);
            for (const t of chain) {
                const msg = this.lookupInTag(t, key);
                if (msg) return msg;
            }
        }
        // 全局默认：尝试 'en'/'en-US'
        const defaults = ['en', 'en-US'];
        for (const dt of defaults) {
            const resolved = this.resolveTag(dt);
            if (!resolved) continue;
            const msg = this.lookupInTag(resolved, key);
            if (msg) return msg;
        }
        return null;
    }

    private lookupInTag(tag: string, key: string): string | null {
        const pack = this.packs.get(tag);
        if (!pack) return null;
        const val = pack.messages[key];
        return typeof val === 'string' ? val : null;
    }

    private fallbackChain(tag: string): string[] {
        const lower = this.normalizeTag(tag);
        const parts = lower.split('-');

        const chain: string[] = [];
        // zh-hans-cn -> zh-hans -> zh
        if (parts.length === 3) {
            chain.push(`${parts[0]}-${parts[1]}`, parts[0]);
        } else if (parts.length === 2) {
            chain.push(parts[0]);
        }

        // 将别名映射到真实 tag
        return chain
            .map(t => this.resolveTag(t))
            .filter((t): t is string => !!t);
    }

    private computeRTL(tagOrAlias: string): boolean {
        const tag = this.resolveTag(tagOrAlias);
        const pack = tag ? this.packs.get(tag) : null;
        if (pack && typeof pack.rtl === 'boolean') {
            return !!pack.rtl;
        }
        // 若包未提供 rtl，则跟随系统
        return LocalizationService.getInfo().locale.isRTL;
    }

    private resolveTag(tagOrAlias: string): string | null {
        const norm = this.normalizeTag(tagOrAlias);
        if (this.packs.has(norm)) return norm;
        const aliased = this.aliasMap.get(norm);
        return aliased ?? null;
    }

    private normalizeTag(tag: string): string {
        return String(tag).trim().toLowerCase();
    }

    private interpolate(msg: string, params: Record<string, any>): string {
        return msg.replace(/\{\{\s*([a-zA-Z0-9_.$]+)\s*\}\}/g, (_, key) => {
            // 支持深层取值：user.name
            const path = String(key).split('.');
            let v: any = params;
            for (const p of path) {
                if (v == null) break;
                v = v[p];
            }
            if (v == null) return '';
            return String(v);
        });
    }

    private parseJson<T>(raw: any, fallback: T): T {
        try {
            if (raw == null) return fallback;
            if (typeof raw === 'object') return raw as T;
            if (typeof raw === 'string') {
                const s = raw === 'null' ? 'null' : raw;
                const parsed = JSON.parse(s);
                return (parsed ?? fallback) as T;
            }
            return fallback;
        } catch {
            return fallback;
        }
    }

    private emit(): void {
        const state = this.getState();
        for (const l of Array.from(this.listeners)) {
            try {
                l(state);
            } catch { /* ignore */ }
        }
    }
}

export const I18nService = new I18nServiceImpl();
I18nService.initialize().catch(err => console.warn('I18nService init failed:', err));

export default I18nService;