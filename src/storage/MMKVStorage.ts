import { MMKV } from 'react-native-mmkv';
import { IStorage, MMKVConfig } from './types';

class MMKVStorage implements IStorage {
  private storage: MMKV;

  constructor(configOrId?: MMKVConfig | string) {
    let config: MMKVConfig;
    if (typeof configOrId === 'string') {
      config = { id: configOrId };
    } else {
      config = configOrId ?? {};
    }
    const options: { id: string; path?: string; encryptionKey?: string } = {
      id: config.id ?? 'default',
      ...(config.path ? { path: config.path } : {}),
      ...(config.encryptionKey ? { encryptionKey: config.encryptionKey } : {}),
    };
    this.storage = new MMKV(options);
  }

  set(key: string, value: any): void {
    // key 校验与归一化
    if (typeof key !== 'string' || key.trim().length === 0) {
      console.warn('[MMKVStorage] Invalid key provided to set:', key);
      return;
    }

    // 统一处理 undefined -> null（避免 MMKV 接收 undefined 导致异常）
    if (value === undefined) {
      this.storage.set(key, 'null');
      return;
    }

    // 直接处理 null
    if (value === null) {
      this.storage.set(key, 'null');
      return;
    }

    const t = typeof value;
    if (t === 'string' || t === 'number' || t === 'boolean') {
      this.storage.set(key, value as any);
      return;
    }

    // 对 function/symbol 等不可序列化类型做安全降级
    if (t === 'function' || t === 'symbol') {
      console.warn('[MMKVStorage] Non-serializable type for key', key, 'stored as string');
      this.storage.set(key, String(value));
      return;
    }

    // 对象与其他复杂类型：使用安全序列化（支持循环引用防卫）
    try {
      const json = this.safeSerialize(value);
      this.storage.set(key, json);
    } catch (e) {
      console.warn('[MMKVStorage] Failed to serialize value for key', key, e);
      // Fallback：避免崩溃，存储字符串表示
      this.storage.set(key, String(value));
    }
  }

  get(key: string): any {
    if (typeof key !== 'string' || key.trim().length === 0) {
      return null;
    }
    const raw = this.storage.getString(key);
    if (raw == null) return null;

    // 与 set 的归一化约定：'null' 表示空值
    if (raw === 'null') return null;

    // 优先尝试 JSON 反序列化
    try {
      return JSON.parse(raw);
    } catch {
      // 回退：返回原始字符串
      return raw;
    }
  }

  getBoolean(key: string): boolean | null {
    return this.storage.getBoolean(key) ?? null;
  }

  getNumber(key: string): number | null {
    return this.storage.getNumber(key) ?? null;
  }

  getString(key: string): string | null {
    return this.storage.getString(key) ?? null;
  }

  delete(key: string): void {
    this.storage.delete(key);
  }

  clear(): void {
    this.storage.clearAll();
  }

  getAllKeys(): string[] {
    return this.storage.getAllKeys();
  }

  contains(key: string): boolean {
    return this.storage.contains(key);
  }

  // 安全序列化，处理循环引用与不可枚举属性
  private safeSerialize(value: any): string {
    const cache = new WeakSet<object>();
    return JSON.stringify(value, (key, val) => {
      if (typeof val === 'object' && val !== null) {
        if (cache.has(val)) {
          return '[Circular]';
        }
        cache.add(val);
      }
      return val;
    });
  }
}

export default MMKVStorage;