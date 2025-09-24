// 导出默认存储实现
export { default as MMKVStorage } from './MMKVStorage';

// 导出存储服务
export * from './StorageService';

// 导出类型定义
export type * from './types';

// 重新导出 react-native-mmkv 的类型（如果需要直接使用）
export type { MMKV, MMKVConfiguration } from 'react-native-mmkv';


