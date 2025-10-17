# Utils（工具能力）

包含“设备信息、剪贴板、本地化、权限”等常用能力的统一封装与 Hook，统一在 `src/utils/index.ts` 聚合导出，便于按需使用。

## 快速使用

统一导出（建议使用聚合出口）：

```ts
import {
  // 剪贴板
  ClipboardService,
  useClipboard,
  // 设备信息
  DeviceInfoService,
  useDeviceInfo,
  // 本地化
  LocalizationService,
  useLocalization,
  // 权限
  PermissionsService,
  usePermission,
} from '@gaozh1024/rn-toolkit/src/utils';
```

示例：复制文本与读取文本

```ts
const ok = await ClipboardService.copyToClipboard('Hello', { showToast: true });

const { clipboardText, copyToClipboard, getFromClipboard } = useClipboard();
await copyToClipboard('Hello');
const text = await getFromClipboard();
```

示例：设备信息（快照 + Hook）

```ts
const info = await DeviceInfoService.getDeviceInfo();
// { brand, model, systemVersion, screenWidth, screenHeight, ... }

const { info: current, refresh } = useDeviceInfo();
// 监听屏幕与前后台切换自动刷新；手动 refresh 可强制更新
```

示例：本地化信息读取与刷新

```ts
const info = LocalizationService.getInfo();
const { info: loc, refresh } = useLocalization();
// loc.locale.languageTag、loc.timeZone、loc.country、loc.currencies 等
```

示例：权限检查/请求/确保

```ts
const cameraOk = await PermissionsService.ensureCamera({ openSettingsIfBlocked: true });
// usePermission Hook
const { status, isGranted, request } = usePermission('notification');
await request({ alert: true, sound: true, badge: true });
```

## 文档索引

- 剪贴板（Clipboard）：见 [src/utils/clipboard/README.md](./clipboard/README.md)
- 设备信息（Device）：见 [src/utils/device/README.md](./device/README.md)
- 本地化（Localization）：见 [src/utils/localization/README.md](./localization/README.md)
- 权限（Permissions）：见 [src/utils/permissions/README.md](./permissions/README.md)

## 依赖

- 剪贴板：`@react-native-clipboard/clipboard`
- 设备信息：`react-native-device-info`
- 本地化：`react-native-localize`
- 权限：`react-native-permissions`

这些依赖已在项目首页“必须安装的框架”中列出，使用前请确保已安装并完成平台配置。

## 开发期警告（权限）

- 当权限返回 `unavailable`（未声明或设备不支持），开发模式下会输出警告并指出需要的 `Info.plist`/`AndroidManifest.xml` 配置项。
- 详情见 [src/utils/permissions/README.md](./permissions/README.md) 的“平台配置”与“常见问题”。