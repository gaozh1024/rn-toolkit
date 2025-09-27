import MMKVStorage from './MMKVStorage';
import type { MMKVConfig, StorageEvent, StorageListener, NamespacedStorage } from './types';

class StorageService {
  private static instance: StorageService;
  private mmkvStorage: MMKVStorage;
  private listeners: StorageListener[] = [];

  private constructor(config?: MMKVConfig) {
    this.mmkvStorage = new MMKVStorage(config);
  }

  static init(config?: MMKVConfig): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService(config);
    }
    return StorageService.instance;
  }

  static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }

  // MMKV存储方法（用于简单数据）
  set(key: string, value: any): void {
    const oldValue = this.mmkvStorage.get(key);
    this.mmkvStorage.set(key, value);
    this.emit({ type: 'set', key, oldValue, newValue: value, timestamp: Date.now() });
  }

  get(key: string): any {
    return this.mmkvStorage.get(key);
  }

  delete(key: string): void {
    const oldValue = this.mmkvStorage.get(key);
    this.mmkvStorage.delete(key);
    this.emit({ type: 'delete', key, oldValue, newValue: undefined, timestamp: Date.now() });
  }

  clear(): void {
    const keys = this.mmkvStorage.getAllKeys();
    const timestamp = Date.now();
    for (const key of keys) {
      const oldValue = this.mmkvStorage.get(key);
      this.emit({ type: 'clear', key, oldValue, newValue: undefined, timestamp });
    }
    this.mmkvStorage.clear();
  }

  // 类型安全读取方法
  getString(key: string): string | null {
    return this.mmkvStorage.getString(key);
  }

  getNumber(key: string): number | null {
    return this.mmkvStorage.getNumber(key);
  }

  getBoolean(key: string): boolean | null {
    return this.mmkvStorage.getBoolean(key);
  }

  // 工具方法
  getAllKeys(): string[] {
    return this.mmkvStorage.getAllKeys();
  }

  contains(key: string): boolean {
    return this.mmkvStorage.contains(key);
  }

  // 便利批量方法
  setMany(entries: Record<string, any>): void {
    for (const [key, value] of Object.entries(entries)) {
      const oldValue = this.mmkvStorage.get(key);
      this.mmkvStorage.set(key, value);
      this.emit({ type: 'set', key, oldValue, newValue: value, timestamp: Date.now() });
    }
  }

  getMany(keys: string[]): Record<string, any> {
    const result: Record<string, any> = {};
    for (const key of keys) {
      result[key] = this.mmkvStorage.get(key);
    }
    return result;
  }

  deleteMany(keys: string[]): void {
    for (const key of keys) {
      const oldValue = this.mmkvStorage.get(key);
      this.mmkvStorage.delete(key);
      this.emit({ type: 'delete', key, oldValue, newValue: undefined, timestamp: Date.now() });
    }
  }

  getOrDefault<T = any>(key: string, defaultValue: T): T {
    const value = this.get(key);
    return (value === null || value === undefined) ? defaultValue : value as T;
  }

  // 命名空间与键前缀工具
  withPrefix(prefix: string): NamespacedStorage {
    const normalize = (k: string) => `${prefix}${k}`;
    const strip = (k: string) => k.startsWith(prefix) ? k.slice(prefix.length) : null;

    return {
      prefix,
      set: (key: string, value: any) => this.set(normalize(key), value),
      get: (key: string) => this.get(normalize(key)),
      delete: (key: string) => this.delete(normalize(key)),
      clear: () => {
        const keys = this.getAllKeys().map(strip).filter((k): k is string => k !== null);
        this.deleteMany(keys.map(normalize));
      },
      getAllKeys: () => this.getAllKeys().map(strip).filter((k): k is string => k !== null) as string[],
      contains: (key: string) => this.contains(normalize(key)),
      setMany: (entries: Record<string, any>) => {
        const namespaced: Record<string, any> = {};
        for (const [k, v] of Object.entries(entries)) {
          namespaced[normalize(k)] = v;
        }
        this.setMany(namespaced);
      },
      getMany: (keys: string[]) => {
        const namespaced = keys.map(normalize);
        const raw = this.getMany(namespaced);
        const result: Record<string, any> = {};
        for (const k of keys) {
          result[k] = raw[normalize(k)];
        }
        return result;
      },
      deleteMany: (keys: string[]) => this.deleteMany(keys.map(normalize)),
      getOrDefault: <T = any>(key: string, defaultValue: T) => this.getOrDefault(normalize(key), defaultValue),
    };
  }

  // 监听器管理
  addListener(listener: StorageListener): () => void {
    this.listeners.push(listener);
    return () => {
      this.removeListener(listener);
    };
  }

  removeListener(listener: StorageListener): void {
    this.listeners = this.listeners.filter(l => l !== listener);
  }

  removeAllListeners(): void {
    this.listeners = [];
  }

  private emit(event: StorageEvent): void {
    // 独立调用以避免单个监听器异常影响其他监听器
    this.listeners.forEach(listener => {
      try {
        listener(event);
      } catch (e) {
        console.warn('[StorageService] listener error:', e);
      }
    });
  }

}
const storageService = StorageService.getInstance();
export { storageService }
export default storageService;
