import MMKVStorage from './MMKVStorage';

class StorageService {
  private static instance: StorageService;
  private mmkvStorage: MMKVStorage;

  private constructor() {
    this.mmkvStorage = new MMKVStorage();
  }

  static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }

  // MMKV存储方法（用于简单数据）
  setSimple(key: string, value: any): void {
    this.mmkvStorage.set(key, value);
  }

  getSimple(key: string): any {
    return this.mmkvStorage.get(key);
  }

  deleteSimple(key: string): void {
    this.mmkvStorage.delete(key);
  }

  clearSimple(): void {
    this.mmkvStorage.clear();
  }

}

export default StorageService.getInstance();