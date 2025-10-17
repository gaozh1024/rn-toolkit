import { useEffect, useState, useCallback } from 'react';
import LocalizationService from './LocalizationService';
import type { LocalizationInfo } from './types';

export interface UseLocalizationReturn {
  info: LocalizationInfo;
  refresh: () => void;
}

export default function useLocalization(): UseLocalizationReturn {
  const [info, setInfo] = useState<LocalizationInfo>(LocalizationService.getInfo());

  useEffect(() => {
    const off = LocalizationService.addListener(setInfo);
    return off;
  }, []);

  const refresh = useCallback(() => {
    const next = LocalizationService.refresh();
    setInfo(next);
  }, []);

  return { info, refresh };
}