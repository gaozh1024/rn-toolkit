# Skeleton（骨架屏）

用于在数据加载时占位，减少感知等待与布局抖动。

## 特性
- 变体：`rect`（矩形）、`circle`（圆形）、`line`（行/文本占位）
- 尺寸：`width`/`height` 支持数字与百分比（如 `'100%'`）
- 动画：`animated` 脉冲透明度（基于 Reanimated），轻量稳定
- 主题化：颜色取自主题（优先 `skeletonFill`），暗色模式友好

## 安装前置
- 需按动画模块要求启用 Reanimated 插件（位于 `babel.config.js -> plugins` 最后一行）：
```javascript
module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: ['react-native-reanimated/plugin'],
};
```
- iOS 请执行：
```bash
cd ios && pod install
```

## 用法
```tsx
import { Skeleton } from '@gaozh1024/rn-toolkit';

// 矩形：常用于图片和卡片
<Skeleton variant="rect" width={160} height={120} />

// 圆形：常用于头像
<Skeleton variant="circle" width={48} />

// 行：常用于文本行占位，默认宽度 100%、高度 12
<Skeleton variant="line" />

// 启用动画（默认 true）
<Skeleton variant="rect" width={'100%'} height={16} animated />

// 自定义样式（示例：圆角与外边距）
<Skeleton variant="rect" width={'100%'} height={12} style={{ borderRadius: 8, marginVertical: 6 }} />
```

## Props
- `variant`: `'rect' | 'circle' | 'line'`，默认 `'rect'`
- `width`: `number | string`（百分比如 `'100%'`），用于 `rect/line`
- `height`: `number`，`line` 默认 `12`；`rect` 默认 `16`
- `animated`: `boolean`，默认 `true`
- `style`: 容器样式
- `testID`: 测试标识

- 注意：`circle` 变体直径需为数值（取 `width` 的数值或 `height`），不建议用百分比。