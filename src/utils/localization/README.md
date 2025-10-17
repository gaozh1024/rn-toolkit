# Localization（本地化）

封装 `react-native-localize`，统一读取 `locale/timeZone/currencies/country` 等信息，支持事件监听（前后台切换自动刷新）、`findBestLanguage` 选择最佳语言、`useLocalization` Hook。

## 安装

已在项目首页列为必装依赖；如需单独安装：

```bash
yarn add react-native-localize
```

## 快速使用

Service 方式：

```ts
import { LocalizationService } from '@gaozh1024/rn-toolkit/src/utils';

const info = LocalizationService.getInfo();
const off = LocalizationService.addListener(next => {
  // 状态变更（系统语言、地区、时区变化）时回调
});
const next = LocalizationService.refresh(); // 手动刷新（会触发监听回调）
const best = LocalizationService.findBestLanguage(['zh-Hans-CN', 'en-US']);
```

Hook 方式（组件内）：

```ts
import { useLocalization } from '@gaozh1024/rn-toolkit/src/utils';

const { info, refresh } = useLocalization();
```

## API

- `LocalizationService.getInfo()`：读取最新本地化信息（内部维持快照）
- `LocalizationService.addListener(listener)`：订阅变化；返回取消订阅函数
- `LocalizationService.refresh(options?)`：手动刷新，触发订阅回调
- `LocalizationService.findBestLanguage(tags)`：在候选语言中选择最优匹配（命名 API 不可用时自动回退到手动匹配）
- `useLocalization()`：Hook，返回 `{ info, refresh }`

## 类型

```ts
type Locale = { languageTag; languageCode; countryCode?; isRTL };
type LocalizationInfo = {
  locale: Locale;
  timeZone: string;
  currencies: string[];
  country: string;
  uses24HourClock: boolean;
  usesMetricSystem: boolean;
};
```
