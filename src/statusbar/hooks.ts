import { useState, useEffect, useCallback } from 'react';
import StatusBarService, { StatusBarConfig, StatusBarState, StatusBarStyleType } from './StatusBarService';

/**
 * 状态栏管理 Hook
 * 提供状态栏的统一控制与订阅能力
 */
export const useStatusBar = (): {
  config: StatusBarState;
  setConfig: (config: Partial<StatusBarConfig>) => void;
  setBarStyle: (barStyle: StatusBarStyleType, animated?: boolean) => void;
  setBackgroundColor: (backgroundColor: string, animated?: boolean) => void;
  setTranslucent: (translucent: boolean) => void;
  setHidden: (hidden: boolean, animation?: 'fade' | 'slide') => void;
  show: (animation?: 'fade' | 'slide') => void;
  hide: (animation?: 'fade' | 'slide') => void;
  setNetworkActivityIndicatorVisible: (visible: boolean) => void;
  enableAutoTheme: () => void;
  disableAutoTheme: () => void;
  isAutoThemeEnabled: boolean;
  reset: () => void;
  getRecommendedStyle: () => StatusBarStyleType;
  getRecommendedBackgroundColor: () => string;
} => {
  const [config, setConfigState] = useState<StatusBarState>(StatusBarService.getCurrentConfig());
  const [isAutoThemeEnabled, setIsAutoThemeEnabled] = useState<boolean>(StatusBarService.isAutoThemeEnabled());

  const handleConfigChange = useCallback((newConfig: StatusBarState) => {
    setConfigState(newConfig);
  }, []);

  useEffect(() => {
    // 初始化服务（只需一次）
    StatusBarService.initialize();

    // 订阅配置变化
    StatusBarService.addConfigChangeListener(handleConfigChange);

    // 清理
    return () => {
      StatusBarService.removeConfigChangeListener(handleConfigChange);
    };
  }, [handleConfigChange]);

  const setConfig = useCallback((newConfig: Partial<StatusBarConfig>) => {
    StatusBarService.setConfig(newConfig);
  }, []);

  const setBarStyle = useCallback((barStyle: StatusBarStyleType, animated: boolean = true) => {
    StatusBarService.setBarStyle(barStyle, animated);
  }, []);

  const setBackgroundColor = useCallback((backgroundColor: string, animated: boolean = true) => {
    StatusBarService.setBackgroundColor(backgroundColor, animated);
  }, []);

  const setTranslucent = useCallback((translucent: boolean) => {
    StatusBarService.setTranslucent(translucent);
  }, []);

  const setHidden = useCallback((hidden: boolean, animation: 'fade' | 'slide' = 'fade') => {
    StatusBarService.setHidden(hidden, animation);
  }, []);

  const show = useCallback((animation: 'fade' | 'slide' = 'fade') => {
    StatusBarService.show(animation);
  }, []);

  const hide = useCallback((animation: 'fade' | 'slide' = 'fade') => {
    StatusBarService.hide(animation);
  }, []);

  const setNetworkActivityIndicatorVisible = useCallback((visible: boolean) => {
    StatusBarService.setNetworkActivityIndicatorVisible(visible);
  }, []);

  const enableAutoTheme = useCallback(() => {
    StatusBarService.enableAutoTheme();
    setIsAutoThemeEnabled(true);
  }, []);

  const disableAutoTheme = useCallback(() => {
    StatusBarService.disableAutoTheme();
    setIsAutoThemeEnabled(false);
  }, []);

  const reset = useCallback(() => {
    StatusBarService.reset();
  }, []);

  const getRecommendedStyle = useCallback(() => {
    return StatusBarService.getRecommendedStyle();
  }, []);

  const getRecommendedBackgroundColor = useCallback(() => {
    return StatusBarService.getRecommendedBackgroundColor();
  }, []);

  return {
    config,
    setConfig,
    setBarStyle,
    setBackgroundColor,
    setTranslucent,
    setHidden,
    show,
    hide,
    setNetworkActivityIndicatorVisible,
    enableAutoTheme,
    disableAutoTheme,
    isAutoThemeEnabled,
    reset,
    getRecommendedStyle,
    getRecommendedBackgroundColor,
  };
};

/**
 * 简化的状态栏样式 Hook
 */
export const useStatusBarStyle = () => {
  const [barStyle, setBarStyleState] = useState<StatusBarStyleType>(StatusBarService.getCurrentConfig().barStyle);

  const handleConfigChange = useCallback((config: StatusBarState) => {
    setBarStyleState(config.barStyle);
  }, []);

  useEffect(() => {
    StatusBarService.addConfigChangeListener(handleConfigChange);
    return () => {
      StatusBarService.removeConfigChangeListener(handleConfigChange);
    };
  }, [handleConfigChange]);

  const setBarStyle = useCallback((style: StatusBarStyleType, animated: boolean = true) => {
    StatusBarService.setBarStyle(style, animated);
  }, []);

  return {
    barStyle,
    setBarStyle,
    getRecommendedStyle: StatusBarService.getRecommendedStyle,
  };
};

/**
 * 状态栏可见性控制 Hook
 */
export const useStatusBarVisibility = () => {
  const [hidden, setHiddenState] = useState<boolean>(StatusBarService.getCurrentConfig().hidden);

  const handleConfigChange = useCallback((config: StatusBarState) => {
    setHiddenState(config.hidden);
  }, []);

  useEffect(() => {
    StatusBarService.addConfigChangeListener(handleConfigChange);
    return () => {
      StatusBarService.removeConfigChangeListener(handleConfigChange);
    };
  }, [handleConfigChange]);

  const show = useCallback((animation: 'fade' | 'slide' = 'fade') => {
    StatusBarService.show(animation);
  }, []);

  const hide = useCallback((animation: 'fade' | 'slide' = 'fade') => {
    StatusBarService.hide(animation);
  }, []);

  const toggle = useCallback((animation: 'fade' | 'slide' = 'fade') => {
    if (hidden) {
      show(animation);
    } else {
      hide(animation);
    }
  }, [hidden, show, hide]);

  return {
    hidden,
    show,
    hide,
    toggle,
  };
};