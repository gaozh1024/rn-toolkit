import { useState, useCallback } from 'react';
import ClipboardService, { ClipboardOptions } from './ClipboardService';

export interface UseClipboardReturn {
  clipboardText: string;
  isLoading: boolean;
  copyToClipboard: (text: string, options?: ClipboardOptions) => Promise<boolean>;
  getFromClipboard: (options?: Omit<ClipboardOptions, 'toastMessage'>) => Promise<string | null>;
  copyObject: (obj: any, options?: ClipboardOptions) => Promise<boolean>;
  getObject: <T = any>(options?: Omit<ClipboardOptions, 'toastMessage'>) => Promise<T | null>;
  hasString: () => Promise<boolean>;
  clearClipboard: () => Promise<boolean>;
}

export function useClipboard(): UseClipboardReturn {
  const [clipboardText, setClipboardText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const copyToClipboard = useCallback(async (
    text: string, 
    options?: ClipboardOptions
  ): Promise<boolean> => {
    setIsLoading(true);
    try {
      const success = await ClipboardService.copyToClipboard(text, options);
      if (success) {
        setClipboardText(text);
      }
      return success;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getFromClipboard = useCallback(async (
    options?: Omit<ClipboardOptions, 'toastMessage'>
  ): Promise<string | null> => {
    setIsLoading(true);
    try {
      const text = await ClipboardService.getFromClipboard(options);
      if (text) {
        setClipboardText(text);
      }
      return text;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const copyObject = useCallback(async (
    obj: any, 
    options?: ClipboardOptions
  ): Promise<boolean> => {
    setIsLoading(true);
    try {
      return await ClipboardService.copyObjectToClipboard(obj, options);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getObject = useCallback(async <T = any>(
    options?: Omit<ClipboardOptions, 'toastMessage'>
  ): Promise<T | null> => {
    setIsLoading(true);
    try {
      return await ClipboardService.getObjectFromClipboard<T>(options);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const hasString = useCallback(async (): Promise<boolean> => {
    return await ClipboardService.hasString();
  }, []);

  const clearClipboard = useCallback(async (): Promise<boolean> => {
    setIsLoading(true);
    try {
      const success = await ClipboardService.clearClipboard();
      if (success) {
        setClipboardText('');
      }
      return success;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    clipboardText,
    isLoading,
    copyToClipboard,
    getFromClipboard,
    copyObject,
    getObject,
    hasString,
    clearClipboard,
  };
}