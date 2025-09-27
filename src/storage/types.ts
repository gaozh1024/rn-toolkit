// 基础存储接口
export interface IStorage {
  set(key: string, value: any): void;
  get(key: string): any;
  getBoolean?(key: string): boolean | null;
  getNumber?(key: string): number | null;
  getString?(key: string): string | null;
  delete(key: string): void;
  clear(): void;
  getAllKeys(): string[];
  contains?(key: string): boolean;
}

// 查询选项
export interface QueryOptions {
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// MMKV 配置选项
export interface MMKVConfig {
  id?: string;
  path?: string;
  encryptionKey?: string;
}

// 存储事件类型
export type StorageEventType = 'set' | 'delete' | 'clear';
export interface StorageEvent {
  type: StorageEventType;
  key: string;
  oldValue?: any;
  newValue?: any;
  timestamp: number;
}

// 存储监听器类型
export type StorageListener = (event: StorageEvent) => void;

// 命名空间存储接口（键前缀工具）
export interface NamespacedStorage {
  readonly prefix: string;
  set(key: string, value: any): void;
  get(key: string): any;
  delete(key: string): void;
  clear(): void; // 仅清理当前命名空间下的键
  getAllKeys(): string[]; // 返回命名空间下的键（去除前缀）
  contains(key: string): boolean;
  setMany(entries: Record<string, any>): void;
  getMany(keys: string[]): Record<string, any>;
  deleteMany(keys: string[]): void;
  getOrDefault<T = any>(key: string, defaultValue: T): T;
}