# Device（设备信息）

基于 `react-native-device-info` 提供设备与应用信息读取、缓存与 Hook 刷新（屏幕尺寸变更、前后台切换时自动更新）。

## 安装

已在项目首页列为必装依赖；如需单独安装：

```bash
yarn add react-native-device-info
```

## 快速使用

Service 方式：

```ts
import { DeviceInfoService } from '@gaozh1024/rn-toolkit/src/utils';

const info = await DeviceInfoService.getDeviceInfo();
// { brand, model, deviceId, systemName, systemVersion, appVersion, buildNumber, bundleId, screenWidth, screenHeight, platform, isTablet, isEmulator }
const app = await DeviceInfoService.getAppInfo(); // { version, buildNumber, bundleId }
const battery = await DeviceInfoService.getBatteryInfo();
const memory = await DeviceInfoService.getMemoryInfo();
```

Hook 方式（组件内）：

```ts
import { useDeviceInfo } from '@gaozh1024/rn-toolkit/src/utils';

const { info, refresh } = useDeviceInfo();
// 自动监听屏幕尺寸变更与前台切换；手动 refresh 可强制更新
```

## API

- `DeviceInfoService.getDeviceInfo()`：首次读取并缓存完整设备信息；含屏幕尺寸与平台字段
- `DeviceInfoService.clearCache()`：清除缓存，下次读取会重新拉取
- `DeviceInfoService.getDeviceId()`：设备 ID
- `DeviceInfoService.getAppInfo()`：应用版本信息
- `DeviceInfoService.getDeviceType()`：设备类型（手机/平板等）
- `DeviceInfoService.getBatteryInfo()`：电量、充电状态与电源信息
- `DeviceInfoService.getMemoryInfo()`：内存信息（总量、已用、剩余）
- `useDeviceInfo()`：Hook，返回 `{ info, refresh }`

## 类型

```ts
type DeviceInformation = {
  brand; model; deviceId; systemName; systemVersion;
  appVersion; buildNumber; bundleId;
  screenWidth; screenHeight;
  platform: 'ios' | 'android';
  isTablet; isEmulator;
};
```
