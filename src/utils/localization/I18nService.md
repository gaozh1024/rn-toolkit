# I18nService 使用文档

面向应用的多语言服务，支持像“皮肤配置”一样注册语言包、跟随系统/固定模式切换、运行时覆盖文案并持久化。与 `LocalizationService`（读取系统语言环境）协同工作。

## 特性

- 跟随系统（`system`）与固定语言（`fixed`）两种模式
- 语言包注册与别名支持，自动选择最佳匹配
- 文案逐级回退：`zh-Hans-CN → zh-Hans → zh → en`
- `t(key, params?)` 翻译函数，支持插值（`{{name}}`）
- 运行时覆盖文案（类似皮肤配置），持久化到 MMKV
- RTL 支持：包可声明 `rtl`，默认跟随系统

## 安装

- 依赖：`react-native-localize`（项目已标记必装），`react-native-mmkv`（已内置为存储）
- 无需额外初始化：`I18nService.initialize()` 会在模块加载时自动执行

## 快速开始

1) 定义语言包（建议在 `src/i18n/packs.ts`）：

```ts
export const zhHansCN = {
  tag: 'zh-Hans-CN',
  aliases: ['zh-CN', 'zh-Hans', 'zh'],
  rtl: false,
  messages: {
    'home.title': '首页',
    'home.greeting': '你好，{{user.name}}',
    'settings.language': '语言',
  },
};

export const enUS = {
  tag: 'en-US',
  aliases: ['en'],
  rtl: false,
  messages: {
    'home.title': 'Home',
    'home.greeting': 'Hello, {{user.name}}',
    'settings.language': 'Language',
  },
};

export const packs = [zhHansCN, enUS];
```

2) 启动时注册语言包（如 `App.tsx`）：

```ts
import React, { useEffect } from 'react';
import { I18nService } from '@gaozh1024/rn-toolkit/src/utils';
import { packs } from './i18n/packs';

export default function App() {
  useEffect(() => {
    I18nService.registerPacks(packs); // system 模式会按系统语言选择最佳包
  }, []);
  return null;
}
```

3) 组件内使用：

```ts
import { useI18n } from '@gaozh1024/rn-toolkit/src/utils';

export function HomeHeader() {
  const { t, tag, mode, rtl } = useI18n();
  const title = t('home.title');
  const greet = t('home.greeting', { user: { name: 'Alice' } });
  return null;
}
```

## 切换语言与模式

- 固定语言（进入 `fixed` 模式）：

```ts
const { setLanguageTag } = useI18n();
setLanguageTag('en-US');
```

- 跟随系统（`system` 模式）：

```ts
const { setLanguageMode } = useI18n();
setLanguageMode('system');
```

- 恢复系统模式（传 `null` 清除固定标签）：

```ts
const { setLanguageTag } = useI18n();
setLanguageTag(null);
```

## 运行时覆盖文案（类似皮肤配置）

```ts
const { updateOverrides, resetOverrides, t } = useI18n();
updateOverrides({ 'home.title': '我的首页' }); // 立即生效并持久化
// resetOverrides(); // 清除覆盖
```

## 动态加载语言包（远端/按需）

```ts
import { I18nService } from '@gaozh1024/rn-toolkit/src/utils';

export async function loadRemotePack(tag: string, url: string) {
  const res = await fetch(url);
  const messages = await res.json();  // 形如 { 'home.title': '...' }
  I18nService.registerPacks([{ tag, messages, aliases: [tag] }]);
}
```

## API 参考

- 服务（全局）
  - `registerPacks(packs: LanguagePack[])`
  - `setLanguageMode(mode: 'system' | 'fixed')`
  - `setLanguageTag(tag: string | null)`
  - `updateOverrides(overrides: Record<string, string | null | undefined>)`
  - `resetOverrides()`
  - `t(key: string, params?: Record<string, any>): string`
  - `getState(): { tag: string | null; mode: 'system' | 'fixed'; rtl: boolean }`
  - `addListener(listener: (state) => void): () => void`

- Hook（组件）
  - `useI18n(): { t, tag, mode, rtl, setLanguageMode, setLanguageTag, updateOverrides, resetOverrides }`

## 持久化行为

- `rn_toolkit_lang_mode`：`'system' | 'fixed'`
- `rn_toolkit_lang_tag`：当前固定标签
- `rn_toolkit_lang_overrides`：覆盖文案（仅持久化为 `string` 值）

## 回退与匹配规则

- 逐级回退：`zh-Hans-CN → zh-Hans → zh → en`
- 最后尝试默认：`en` 或 `en-US`
- 未命中则返回原始 `key`（用于排查遗漏）

## 常见问题

- 未注册语言包：`system` 模式不会报错但无法翻译；注册后自动选择最佳包
- 标签大小写与别名：内部统一小写；尽量提供常见别名（如 `zh-CN`、`en`）
- 非字符串文案：会被忽略（净化为 `Record<string, string>`）
- Metro 缓存问题：

```bash
yarn start --reset-cache
```
