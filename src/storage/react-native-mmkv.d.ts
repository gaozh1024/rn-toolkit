declare module 'react-native-mmkv' {
  export interface MMKVConfiguration {
    id: string;
    path?: string;
    encryptionKey?: string;
  }

  export class MMKV {
    constructor(configuration?: MMKVConfiguration);

    // String methods
    set(key: string, value: string): void;
    getString(key: string): string | undefined;

    // Number methods
    set(key: string, value: number): void;
    getNumber(key: string): number | undefined;

    // Boolean methods
    set(key: string, value: boolean): void;
    getBoolean(key: string): boolean | undefined;

    // Buffer methods
    set(key: string, value: Uint8Array): void;
    getBuffer(key: string): Uint8Array | undefined;

    // Generic methods
    contains(key: string): boolean;
    delete(key: string): void;
    getAllKeys(): string[];
    clearAll(): void;
    recrypt(encryptionKey?: string): void;

    // Size and count
    size: number;
    
    // Listeners
    addOnValueChangedListener(listener: (changedKey: string) => void): () => void;
  }

  // Default instance
  export const MMKVLoader: {
    withInstanceID(instanceID: string): MMKVLoader;
    withEncryptionKey(encryptionKey: string): MMKVLoader;
    initialize(): MMKV;
  };

  // Hooks (if using with React)
  export function useMMKVStorage<T>(
    key: string,
    defaultValue?: T,
    instance?: MMKV
  ): [T, (value: T) => void];

  export function useMMKVListener(
    listener: (key: string) => void,
    instance?: MMKV
  ): void;

  // Storage types
  export type MMKVStorageValueType = string | number | boolean | Uint8Array;
}