// 全局类型定义

// 通用工具类型
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredKeys<T, K extends keyof T> = T & Required<Pick<T, K>>;

// 回调函数类型
export type SuccessCallback<T = any> = (data: T) => void;
export type ErrorCallback = (error: Error) => void;
export type VoidCallback = () => void;

// 异步操作结果类型
export interface AsyncResult<T = any> {
  success: boolean;
  data?: T;
  error?: Error;
}

// 配置选项基础类型
export interface BaseOptions {
  onSuccess?: SuccessCallback;
  onError?: ErrorCallback;
}

// 服务状态类型
export type ServiceStatus = 'idle' | 'loading' | 'success' | 'error';

// 主题相关类型
export type ThemeMode = 'light' | 'dark' | 'auto';

// 设备信息类型
export interface DeviceInfo {
  platform: 'ios' | 'android' | 'web';
  version: string;
  model?: string;
  brand?: string;
}

// 本地化相关类型
export type LocaleCode = string;
export type TranslationKey = string;
export type TranslationParams = Record<string, string | number>;