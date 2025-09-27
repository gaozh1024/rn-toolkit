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
  set(key: string, value: any): void {
    this.mmkvStorage.set(key, value);
  }

  get(key: string): any {
    return this.mmkvStorage.get(key);
  }

  delete(key: string): void {
    this.mmkvStorage.delete(key);
  }

  clear(): void {
    this.mmkvStorage.clear();
  }

}
const storageService = StorageService.getInstance();
export { storageService }
export default storageService;
