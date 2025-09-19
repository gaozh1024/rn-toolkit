import { useState, useEffect, useCallback } from 'react';
import StatusBarService, { StatusBarConfig, StatusBarState, StatusBarStyleType } from './StatusBarService';

export interface UseStatusBarReturn {
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
}

/**
 * 状态栏管理 Hook
 * 提供状态栏控制功能
 */
export const useStatusBar = (): UseStatusBarReturn => {
  const [config, setConfigState] = useState<StatusBarState>(StatusBarService.getCurrentConfig());
  const [isAutoThemeEnabled, setIsAutoThemeEnabled] = useState<boolean>(StatusBarService.isAutoThemeEnabled());

  // 配置变化监听器
  const handleConfigChange = useCallback((newConfig: StatusBarState) => {
    setConfigState(newConfig);
  }, []);

  useEffect(() => {
    // 初始化状态栏服务
    StatusBarService.initialize();

    // 添加监听器
    StatusBarService.addConfigChangeListener(handleConfigChange);

    // 清理函数
    return () => {
      StatusBarService.removeConfigChangeListener(handleConfigChange);
    };
  }, [handleConfigChange]);

  // 设置配置
  const setConfig = useCallback((newConfig: Partial<StatusBarConfig>) => {
    StatusBarService.setConfig(newConfig);
  }, []);

  // 设置状态栏样式
  const setBarStyle = useCallback((barStyle: StatusBarStyleType, animated: boolean = true) => {
    StatusBarService.setBarStyle(barStyle, animated);
  }, []);

  // 设置背景色
  const setBackgroundColor = useCallback((backgroundColor: string, animated: boolean = true) => {
    StatusBarService.setBackgroundColor(backgroundColor, animated);
  }, []);

  // 设置透明度
  const setTranslucent = useCallback((translucent: boolean) => {
    StatusBarService.setTranslucent(translucent);
  }, []);

  // 设置显示/隐藏
  const setHidden = useCallback((hidden: boolean, animation: 'fade' | 'slide' = 'fade') => {
    StatusBarService.setHidden(hidden, animation);
  }, []);

  // 显示状态栏
  const show = useCallback((animation: 'fade' | 'slide' = 'fade') => {
    StatusBarService.show(animation);
  }, []);

  // 隐藏状态栏
  const hide = useCallback((animation: 'fade' | 'slide' = 'fade') => {
    StatusBarService.hide(animation);
  }, []);

  // 设置网络活动指示器
  const setNetworkActivityIndicatorVisible = useCallback((visible: boolean) => {
    StatusBarService.setNetworkActivityIndicatorVisible(visible);
  }, []);

  // 启用自动主题
  const enableAutoTheme = useCallback(() => {
    StatusBarService.enableAutoTheme();
    setIsAutoThemeEnabled(true);
  }, []);

  // 禁用自动主题
  const disableAutoTheme = useCallback(() => {
    StatusBarService.disableAutoTheme();
    setIsAutoThemeEnabled(false);
  }, []);

  // 重置配置
  const reset = useCallback(() => {
    StatusBarService.reset();
  }, []);

  // 获取推荐样式
  const getRecommendedStyle = useCallback(() => {
    return StatusBarService.getRecommendedStyle();
  }, []);

  // 获取推荐背景色
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
 * 只提供样式控制功能
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