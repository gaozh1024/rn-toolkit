
## 核心特性

- 🚀 **高性能**: 基于 MMKV 的高性能存储引擎
- 🔒 **类型安全**: 完整的 TypeScript 类型支持
- 🎯 **简单易用**: 统一的 API 接口设计
- 🔧 **灵活配置**: 支持多种配置选项
- 📦 **单例模式**: 全局统一的存储实例

## 快速开始

### 基本使用

```typescript
import { storageService } from '@/storage';

// 存储数据
storageService.set('user', { id: 1, name: 'John' });
storageService.set('token', 'abc123');
storageService.set('isLoggedIn', true);

// 读取数据
const user = storageService.get('user');
const token = storageService.get('token');
const isLoggedIn = storageService.get('isLoggedIn');

// 删除数据
storageService.delete('token');

// 清空所有数据
storageService.clear();
```

### 直接使用 MMKVStorage

```typescript
import { MMKVStorage } from '@/storage';

// 创建自定义存储实例
const userStorage = new MMKVStorage('user-data');
const cacheStorage = new MMKVStorage('cache');

// 使用类型安全的方法
const username = userStorage.getString('username');
const userId = userStorage.getNumber('userId');
const isActive = userStorage.getBoolean('isActive');
```

## API 参考

### StorageService

存储服务的主要类，提供单例模式的全局存储访问。

#### 方法

| 方法 | 参数 | 返回值 | 描述 |
|------|------|--------|------|
| `set(key, value)` | `key: string, value: any` | `void` | 存储数据 |
| `get(key)` | `key: string` | `any` | 获取数据 |
| `delete(key)` | `key: string` | `void` | 删除数据 |
| `clear()` | - | `void` | 清空所有数据 |
| `getString(key)` | `key: string` | `string \| null` | 获取字符串值 |
| `getNumber(key)` | `key: string` | `number \| null` | 获取数字值 |
| `getBoolean(key)` | `key: string` | `boolean \| null` | 获取布尔值 |
| `getAllKeys()` | - | `string[]` | 获取所有键名 |
| `contains(key)` | `key: string` | `boolean` | 检查是否包含指定键 |
| `setMany(entries)` | `entries: Record<string, any>` | `void` | 批量设置键值 |
| `getMany(keys)` | `keys: string[]` | `Record<string, any>` | 批量读取键值 |
| `deleteMany(keys)` | `keys: string[]` | `void` | 批量删除键值 |
| `getOrDefault(key, defaultValue)` | `key: string, defaultValue: T` | `T` | 读取失败或空值时返回默认值 |
| `withPrefix(prefix)` | `prefix: string` | `NamespacedStorage` | 返回命名空间存储对象（键前缀工具） |

#### 示例

```typescript
import { storageService } from '@/storage';

// 存储复杂对象
const userProfile = {
  id: 123,
  name: 'Alice',
  preferences: {
    theme: 'dark',
    language: 'zh-CN'
  }
};
storageService.set('userProfile', userProfile);

// 读取并使用
const profile = storageService.get('userProfile');
console.log(profile.preferences.theme); // 'dark'
```

### MMKVStorage

基于 MMKV 的存储实现类，提供更细粒度的控制。

#### 构造函数

```typescript
constructor(configOrId?: MMKVConfig | string)
```

- `configOrId`: 支持传入配置对象或字符串 id；未提供 id 时使用默认 `'default'`
- 配置项：`MMKVConfig` 支持 `id`（实例标识）、`path`（存储目录路径）、`encryptionKey`（加密密钥）

#### 方法

| 方法 | 参数 | 返回值 | 描述 |
|------|------|--------|------|
| `set(key, value)` | `key: string, value: any` | `void` | 存储数据；对 `undefined/null` 统一归一化为字符串 `'null'`；对象安全序列化（循环引用保护）；不可序列化类型（function/symbol）降级为字符串 |
| `get(key)` | `key: string` | `any` | 获取数据；读取到 `'null'` 时返回 `null`；优先尝试 JSON 反序列化，失败则返回原始字符串 |
| `getString(key)` | `key: string` | `string \| null` | 获取字符串值 |
| `getNumber(key)` | `key: string` | `number \| null` | 获取数字值 |
| `getBoolean(key)` | `key: string` | `boolean \| null` | 获取布尔值 |
| `delete(key)` | `key: string` | `void` | 删除指定键的数据 |
| `clear()` | - | `void` | 清空所有数据 |
| `getAllKeys()` | - | `string[]` | 获取所有键名 |
| `contains(key)` | `key: string` | `boolean` | 检查是否包含指定键 |

#### 示例

```typescript
import { MMKVStorage } from '@/storage';

// 创建专用存储实例
const settingsStorage = new MMKVStorage('app-settings');

// 类型安全的数据操作
settingsStorage.set('theme', 'dark');
settingsStorage.set('fontSize', 16);
settingsStorage.set('notifications', true);

// 类型安全的数据读取
const theme = settingsStorage.getString('theme');        // string | null
const fontSize = settingsStorage.getNumber('fontSize');  // number | null
const notifications = settingsStorage.getBoolean('notifications'); // boolean | null

// 检查数据存在性
if (settingsStorage.contains('theme')) {
  console.log('主题设置已保存');
}

// 获取所有设置键名
const allSettings = settingsStorage.getAllKeys();
console.log('所有设置项:', allSettings);
```

## 类型定义

### IStorage 接口

```typescript
interface IStorage {
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
```

### MMKVConfig 配置

```typescript
interface MMKVConfig {
  id?: string;           // 存储实例ID
  path?: string;         // 存储路径
  encryptionKey?: string; // 加密密钥
}
```

### StorageEvent 事件

```typescript
// 事件类型
type StorageEventType = 'set' | 'delete' | 'clear';

// 事件负载
interface StorageEvent {
  type: StorageEventType; // 事件类型
  key: string;            // 变更的键名
  oldValue?: any;         // 旧值
  newValue?: any;         // 新值
  timestamp: number;      // 时间戳
}
```

### 存储事件监听

```typescript
import { storageService } from '@/storage';

// 添加监听器
const unsubscribe = storageService.addListener((event) => {
  switch (event.type) {
    case 'set':
      console.log('[SET]', event.key, { from: event.oldValue, to: event.newValue }, event.timestamp);
      break;
    case 'delete':
      console.log('[DELETE]', event.key, { from: event.oldValue }, event.timestamp);
      break;
    case 'clear':
      console.log('[CLEAR]', event.key, { from: event.oldValue }, event.timestamp);
      break;
  }
});

// 取消订阅
unsubscribe();

// 或者按引用移除
// storageService.removeListener(listenerRef);

// 移除全部
// storageService.removeAllListeners();
```

## 高级用法

### 多实例存储

```typescript
import { MMKVStorage } from '@/storage';

// 为不同功能创建独立的存储实例
const userStorage = new MMKVStorage('user');
const cacheStorage = new MMKVStorage('cache');
const settingsStorage = new MMKVStorage('settings');

// 用户数据
userStorage.set('profile', userProfile);
userStorage.set('token', authToken);

// 缓存数据
cacheStorage.set('apiResponse', responseData);

// 应用设置
settingsStorage.set('theme', 'dark');
settingsStorage.set('language', 'zh-CN');
```

### 数据迁移

```typescript
import { MMKVStorage } from '@/storage';

// 从旧存储迁移数据
const oldStorage = new MMKVStorage('old-version');
const newStorage = new MMKVStorage('new-version');

// 迁移所有数据
const allKeys = oldStorage.getAllKeys();
allKeys.forEach(key => {
  const value = oldStorage.get(key);
  newStorage.set(key, value);
});

// 清理旧数据
oldStorage.clear();
```

### 命名空间与键前缀工具

```typescript
import { storageService } from '@/storage';

// 创建命名空间存储
const userNS = storageService.withPrefix('user.');
const appNS = storageService.withPrefix('app.');

// 单条写入与读取
userNS.set('profile', { name: 'Alice' });
console.log(userNS.get('profile')); // { name: 'Alice' }

// 批量写入与读取
userNS.setMany({
  token: 'abc123',
  settings: { theme: 'dark' },
});
const result = userNS.getMany(['token', 'settings']);
// result = { token: 'abc123', settings: { theme: 'dark' } }

// 命名空间 contains / getAllKeys
console.log(userNS.contains('token')); // true
console.log(userNS.getAllKeys());      // ['profile', 'token', 'settings']

// 仅清理当前命名空间
userNS.clear(); // 只清空所有 user.* 键，不影响 app.*
```

注意事项：
- `withPrefix` 返回的 NamespacedStorage 只作用于指定前缀的键；`clear()` 仅清理该前缀下的键。
- 批量操作会自动进行键前缀映射，输入/输出为去前缀后的键集合。
- 与事件机制兼容：底层会按全键名触发事件；你可通过解析键名前缀来识别命名空间。

## 最佳实践

### 1. 键名规范

```typescript
// 推荐：使用命名空间
storage.set('user.profile', userProfile);
storage.set('app.settings', appSettings);
storage.set('cache.apiData', apiData);

// 避免：平铺的键名
storage.set('userProfile', userProfile);
storage.set('appSettings', appSettings);
```

### 2. 数据验证

```typescript
import { MMKVStorage } from '@/storage';

const storage = new MMKVStorage();

// 存储时验证
function saveUserProfile(profile: UserProfile) {
  if (!profile.id || !profile.name) {
    throw new Error('Invalid user profile');
  }
  storage.set('user.profile', profile);
}

// 读取时验证
function getUserProfile(): UserProfile | null {
  const profile = storage.get('user.profile');
  if (!profile || !profile.id || !profile.name) {
    return null;
  }
  return profile as UserProfile;
}
```

### 3. 错误处理

```typescript
import { MMKVStorage } from '@/storage';

const storage = new MMKVStorage();

function safeGet<T>(key: string, defaultValue: T): T {
  try {
    const value = storage.get(key);
    return value !== null ? value : defaultValue;
  } catch (error) {
    console.warn(`Failed to get ${key}:`, error);
    return defaultValue;
  }
}

function safeSet(key: string, value: any): boolean {
  try {
    storage.set(key, value);
    return true;
  } catch (error) {
    console.error(`Failed to set ${key}:`, error);
    return false;
  }
}
```

### 4. 性能优化

```typescript
import { MMKVStorage } from '@/storage';

// 缓存频繁访问的数据
class CachedStorage {
  private storage = new MMKVStorage();
  private cache = new Map<string, any>();

  get(key: string): any {
    if (this.cache.has(key)) {
      return this.cache.get(key);
    }
    
    const value = this.storage.get(key);
    this.cache.set(key, value);
    return value;
  }

  set(key: string, value: any): void {
    this.storage.set(key, value);
    this.cache.set(key, value);
  }

  delete(key: string): void {
    this.storage.delete(key);
    this.cache.delete(key);
  }
}
```

## 注意事项

1. **数据大小限制**: MMKV 适合存储小到中等大小的数据，对于大型数据建议使用其他方案
2. **序列化**: 对象会自动进行 JSON 序列化，确保数据可序列化
3. **线程安全**: MMKV 本身是线程安全的，可以在多线程环境中使用
4. **加密支持**: 可以通过配置 `encryptionKey` 来启用数据加密

## 依赖项

- `react-native-mmkv`: MMKV 的 React Native 绑定

## 更新日志

### v1.0.0
- 初始版本发布
- 基础的 MMKV 存储功能
- 类型安全的 API 设计
- 单例模式的存储服务