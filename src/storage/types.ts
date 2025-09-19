// 基础存储接口
export interface IStorage {
  set(key: string, value: any): void;
  get(key: string): any;
  delete(key: string): void;
  clear(): void;
  getAllKeys(): string[];
}


// 查询选项
export interface QueryOptions {
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}