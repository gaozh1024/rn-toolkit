# StatusBar 模块使用说明

提供统一的状态栏控制服务与 React Hooks，支持主题联动、样式/背景色/透明度/可见性管理，以及订阅状态变更。

## 导入
- 顶层导出（Service）：
```ts
import { StatusBarService } from '@gaozh1024/rn-toolkit';
```
- Hooks：
```ts
import { useStatusBar, useStatusBarStyle, useStatusBarVisibility } from '@gaozh1024/rn-toolkit';
```

## 快速上手
```tsx
import React, { useEffect } from 'react';
import { View } from 'react-native';
import { StatusBarService } from '@gaozh1024/rn-toolkit';
import { useStatusBar } from '@gaozh1024/rn-toolkit';

export default function Demo() {
  const { setBarStyle, setBackgroundColor, show, hide, getRecommendedStyle } = useStatusBar();

  useEffect(() => {
    // 初始化并应用推荐样式（基于主题）
    StatusBarService.initialize();
    setBarStyle(getRecommendedStyle(), true);
    setBackgroundColor(StatusBarService.getRecommendedBackgroundColor(), true);
  }, [setBarStyle, setBackgroundColor, getRecommendedStyle]);

  return <View />;
}
```

## Hook API
- `useStatusBar()`：完整管理与订阅
  - 返回值：
    - `config` 当前配置
    - `setConfig(partial)` 更新配置
    - `setBarStyle(style, animated?)`
    - `setBackgroundColor(color, animated?)`（Android）
    - `setTranslucent(boolean)`（Android）
    - `setHidden(boolean, animation?)`
    - `show(animation?)` / `hide(animation?)`
    - `setNetworkActivityIndicatorVisible(boolean)`（iOS 兼容）
    - `enableAutoTheme()` / `disableAutoTheme()`
    - `isAutoThemeEnabled`
    - `reset()`
    - `getRecommendedStyle()` / `getRecommendedBackgroundColor()`
- `useStatusBarStyle()`：仅管理与订阅 `barStyle`
- `useStatusBarVisibility()`：仅管理与订阅 `hidden`

## Service API（核心方法）
- 初始化与配置：
  - `initialize()` — 初始化服务，读取持久化配置并订阅主题变化。
  - `getCurrentConfig()` — 获取当前配置。
  - `setConfig(partial)` — 局部更新配置并应用。
- 样式与显示：
  - `setBarStyle(style, animated?)`
  - `setBackgroundColor(color, animated?)`（Android）
  - `setTranslucent(boolean)`（Android）
  - `setHidden(boolean, animation?)` / `show(animation?)` / `hide(animation?)`
- 主题联动：
  - `enableAutoTheme()` / `disableAutoTheme()` — 启用/禁用随主题自动推荐样式。
  - `isAutoThemeEnabled()` — 查询自动主题状态。
  - `getRecommendedStyle()` / `getRecommendedBackgroundColor()` — 基于当前主题给出推荐样式/背景色。
- 其他：
  - `reset()` — 重置为默认配置。
  - `addConfigChangeListener(fn)` / `removeConfigChangeListener(fn)` — 订阅/取消订阅配置变化。

## 示例：可见性控制
```tsx
import { useStatusBarVisibility } from '@gaozh1024/rn-toolkit';

const VisibilityDemo = () => {
  const { hidden, toggle } = useStatusBarVisibility();
  return (
    <Button onPress={() => toggle('fade')}>{hidden ? '显示' : '隐藏'}</Button>
  );
};
```

## 注意事项
- iOS 的 `networkActivityIndicatorVisible` 在 RN 新版中已废弃，框架保留向下兼容，调用不会报错但可能无效果。
- Android 的 `backgroundColor` 与 `translucent` 生效条件取决于设备及系统版本。
- 建议启用 `enableAutoTheme()` 以在主题切换时自动应用推荐样式。
