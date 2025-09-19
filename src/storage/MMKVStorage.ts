import { MMKV } from 'react-native-mmkv';
import { IStorage } from './types';

class MMKVStorage implements IStorage {
  private storage: MMKV;

  constructor(id: string = 'default') {
    this.storage = new MMKV({ id });
  }

  set(key: string, value: any): void {
    if (typeof value === 'object') {
      this.storage.set(key, JSON.stringify(value));
    } else {
      this.storage.set(key, value);
    }
  }

  get(key: string): any {
    const value = this.storage.getString(key);
    if (!value) return null;

    try {
      return JSON.parse(value);
    } catch {
      return value;
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
}

export default MMKVStorage;