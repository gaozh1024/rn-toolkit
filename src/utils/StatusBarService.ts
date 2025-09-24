import { Platform, StatusBar, StatusBarStyle } from 'react-native';
import styleService from '../theme/ThemeService';
import { AppTheme } from '../theme/types';
import StorageService from '../storage/StorageService';

export type StatusBarStyleType = 'default' | 'light-content' | 'dark-content';
export type StatusBarAnimation = 'none' | 'fade' | 'slide';

export interface StatusBarConfig {
  barStyle?: StatusBarStyleType;
  backgroundColor?: string;
  translucent?: boolean;
  hidden?: boolean;
  animated?: boolean;
  showHideTransition?: 'fade' | 'slide';
  networkActivityIndicatorVisible?: boolean; // iOS only
}

export interface StatusBarState {
  barStyle: StatusBarStyleType;
  backgroundColor: string;
  translucent: boolean;
  hidden: boolean;
  animated: boolean;
  showHideTransition: 'fade' | 'slide';
  networkActivityIndicatorVisible: boolean;
}

class StatusBarService {
  private static readonly STORAGE_KEY = 'statusbar_config';
  private static currentConfig: StatusBarState = {
    barStyle: 'default',
    backgroundColor: '#000000',
    translucent: false,
    hidden: false,
    animated: true,
    showHideTransition: 'fade',
    networkActivityIndicatorVisible: false,
  };
  private static listeners: Array<(config: StatusBarState) => void> = [];
  private static themeSubscription: any = null;
  private static autoThemeEnabled: boolean = true;

  /**
   * 初始化状态栏服务
   */
  static async initialize(): Promise<void> {
    try {
      // 从存储中读取配置
      const savedConfig = StorageService.getSimple(this.STORAGE_KEY);
      if (savedConfig) {
        this.currentConfig = {
          ...this.currentConfig,
          ...savedConfig,
        };
      }

      // 如果启用了自动主题，添加主题监听器
      if (this.autoThemeEnabled) {
        styleService.addThemeChangeListener(this.handleThemeChange);
        this.applyThemeBasedStyle();
      }

      // 应用当前配置
      this.applyConfig(this.currentConfig);
    } catch (error) {
      console.warn('StatusBarService: Failed to initialize:', error);
    }
  }

  /**
   * 获取当前状态栏配置
   */
  static getCurrentConfig(): StatusBarState {
    return { ...this.currentConfig };
  }

  /**
   * 设置状态栏配置
   */
  static setConfig(config: Partial<StatusBarConfig>): void {
    try {
      const newConfig = {
        ...this.currentConfig,
        ...config,
      };

      this.currentConfig = newConfig;
      this.applyConfig(newConfig);
      this.saveConfig();
      this.notifyListeners();
    } catch (error) {
      console.warn('StatusBarService: Failed to set config:', error);
    }
  }

  /**
   * 设置状态栏样式
   */
  static setBarStyle(barStyle: StatusBarStyleType, animated: boolean = true): void {
    this.setConfig({ barStyle, animated });
  }

  /**
   * 设置状态栏背景色 (Android)
   */
  static setBackgroundColor(backgroundColor: string, animated: boolean = true): void {
    this.setConfig({ backgroundColor, animated });
  }

  /**
   * 设置状态栏透明度
   */
  static setTranslucent(translucent: boolean): void {
    this.setConfig({ translucent });
  }

  /**
   * 显示/隐藏状态栏
   */
  static setHidden(hidden: boolean, animation: 'fade' | 'slide' = 'fade'): void {
    this.setConfig({
      hidden,
      showHideTransition: animation,
      animated: true
    });
  }

  /**
   * 显示状态栏
   */
  static show(animation: 'fade' | 'slide' = 'fade'): void {
    this.setHidden(false, animation);
  }

  /**
   * 隐藏状态栏
   */
  static hide(animation: 'fade' | 'slide' = 'fade'): void {
    this.setHidden(true, animation);
  }

  /**
   * 设置网络活动指示器 (iOS)
   */
  static setNetworkActivityIndicatorVisible(visible: boolean): void {
    if (Platform.OS === 'ios') {
      this.setConfig({ networkActivityIndicatorVisible: visible });
    }
  }

  /**
   * 启用自动主题模式
   * 根据当前主题自动调整状态栏样式
   */
  static enableAutoTheme(): void {
    if (!this.autoThemeEnabled) {
      this.autoThemeEnabled = true;
      styleService.addThemeChangeListener(this.handleThemeChange);
      this.applyThemeBasedStyle();
    }
  }

  /**
   * 禁用自动主题模式
   */
  static disableAutoTheme(): void {
    if (this.autoThemeEnabled) {
      this.autoThemeEnabled = false;
      styleService.removeThemeChangeListener(this.handleThemeChange);
    }
  }

  /**
   * 检查是否启用了自动主题
   */
  static isAutoThemeEnabled(): boolean {
    return this.autoThemeEnabled;
  }

  /**
   * 重置为默认配置
   */
  static reset(): void {
    const defaultConfig: StatusBarState = {
      barStyle: 'default',
      backgroundColor: '#000000',
      translucent: false,
      hidden: false,
      animated: true,
      showHideTransition: 'fade',
      networkActivityIndicatorVisible: false,
    };

    this.currentConfig = defaultConfig;
    this.applyConfig(defaultConfig);
    this.saveConfig();
    this.notifyListeners();
  }

  /**
   * 获取推荐的状态栏样式（基于主题）
   */
  static getRecommendedStyle(): StatusBarStyleType {
    const isDark = styleService.isDarkMode();
    return isDark ? 'light-content' : 'dark-content';
  }

  /**
   * 获取推荐的背景色（基于主题）
   */
  static getRecommendedBackgroundColor(): string {
    return styleService.getAppTheme().currentColors.background;
  }

  /**
   * 添加配置变化监听器
   */
  static addConfigChangeListener(listener: (config: StatusBarState) => void): void {
    this.listeners.push(listener);
  }

  /**
   * 移除配置变化监听器
   */
  static removeConfigChangeListener(listener: (config: StatusBarState) => void): void {
    const index = this.listeners.indexOf(listener);
    if (index > -1) {
      this.listeners.splice(index, 1);
    }
  }

  /**
   * 清理资源
   */
  static cleanup(): void {
    this.listeners = [];
    if (this.autoThemeEnabled) {
      styleService.removeThemeChangeListener(this.handleThemeChange);
    }
  }

  /**
   * 应用状态栏配置
   */
  private static applyConfig(config: StatusBarState): void {
    try {
      // 设置状态栏样式
      StatusBar.setBarStyle(config.barStyle, config.animated);

      // Android 特定设置
      if (Platform.OS === 'android') {
        StatusBar.setBackgroundColor(config.backgroundColor, config.animated);
        StatusBar.setTranslucent(config.translucent);
      }

      // 设置显示/隐藏
      if (config.hidden) {
        StatusBar.setHidden(true, config.showHideTransition);
      } else {
        StatusBar.setHidden(false, config.showHideTransition);
      }

      // iOS 特定设置
      if (Platform.OS === 'ios') {
        StatusBar.setNetworkActivityIndicatorVisible(config.networkActivityIndicatorVisible);
      }
    } catch (error) {
      console.warn('StatusBarService: Failed to apply config:', error);
    }
  }

  /**
   * 主题变化处理器
   */
  private static handleThemeChange = (theme: AppTheme): void => {
    if (this.autoThemeEnabled) {
      this.applyThemeBasedStyle();
    }
  };

  /**
   * 应用基于主题的样式
   */
  private static applyThemeBasedStyle(): void {
    const isDark = styleService.isDarkMode();
    const colors = styleService.getAppTheme().currentColors;
    const recommendedStyle = isDark ? 'light-content' : 'dark-content';
    const recommendedBackgroundColor = colors.background;

    this.setConfig({
      barStyle: recommendedStyle,
      backgroundColor: recommendedBackgroundColor,
    });
  }

  /**
   * 保存配置到存储
   */
  private static saveConfig(): void {
    try {
      StorageService.setSimple(this.STORAGE_KEY, this.currentConfig);
    } catch (error) {
      console.warn('StatusBarService: Failed to save config:', error);
    }
  }

  /**
   * 通知所有监听器
   */
  private static notifyListeners(): void {
    this.listeners.forEach(listener => {
      try {
        listener(this.currentConfig);
      } catch (error) {
        console.warn('StatusBarService: Error in config change listener:', error);
      }
    });
  }
}

export default StatusBarService;