import { useEffect, useMemo, useState, useCallback } from 'react';
import I18nService from './I18nService';

export interface UseI18nReturn {
    t: (key: string, params?: Record<string, any>) => string;
    tag: string | null;
    mode: 'system' | 'fixed';
    rtl: boolean;
    setLanguageMode: (mode: 'system' | 'fixed') => void;
    setLanguageTag: (tag: string | null) => void;
    updateOverrides: (next: Record<string, string>) => void;
    resetOverrides: () => void;
}

export default function useI18n(): UseI18nReturn {
    const [state, setState] = useState(I18nService.getState());

    useEffect(() => {
        const off = I18nService.addListener(setState);
        return off;
    }, []);

    const t = useCallback((key: string, params?: Record<string, any>) => {
        return I18nService.t(key, params);
    }, []);

    const api = useMemo<UseI18nReturn>(() => ({
        t,
        tag: state.tag,
        mode: state.mode,
        rtl: state.rtl,
        setLanguageMode: (m) => I18nService.setLanguageMode(m),
        setLanguageTag: (tag) => I18nService.setLanguageTag(tag),
        updateOverrides: (next) => I18nService.updateOverrides(next),
        resetOverrides: () => I18nService.resetOverrides(),
    }), [t, state]);

    return api;
}