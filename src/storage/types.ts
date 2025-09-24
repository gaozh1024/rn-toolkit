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
export interface StorageEvent {
  key: string;
  oldValue?: any;
  newValue?: any;
  timestamp: number;
}

// 存储监听器类型
export type StorageListener = (event: StorageEvent) => void;