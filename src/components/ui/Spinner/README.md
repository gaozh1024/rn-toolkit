# Spinner / ActivityIndicator

轻量的加载指示器，支持尺寸、颜色与开关动画。

## 导入

```tsx
import { Spinner, ActivityIndicator } from '@gaozh1024/rn-toolkit';
```

## 基本用法

```tsx
<Spinner />
<Spinner size="small" />
<Spinner size="large" color="primary" />
<Spinner size={40} color="#7c3aed" />
```

## 关闭动画（静态展示）

```tsx
<Spinner animating={false} />
```

## 与主题颜色结合

```tsx
// 使用主题键：primary / secondary / success / warning / error / info / text / subtext / border / divider
<Spinner color="primary" />
<Spinner color="text" />

// 使用自定义色值
<Spinner color="#0ea5e9" />
```

## API

- `size`: `'small' | 'medium' | 'large' | number`，默认 `medium`
- `color`: 主题键或字符串色值，默认取 `theme.colors.text`
- `animating`: `boolean`，默认 `true`
- `style`: 容器样式
- `testID`: 测试标识

## 设计说明

- 视觉来自一个“有色段”圆环，配合线性旋转形成加载动效。
- 颜色均来自主题 `theme.colors`；未指定时使用 `text`，轨道使用 `divider`。
- 厚度会随直径按比例变化（≈8%），避免在不同尺寸下过粗/过细。