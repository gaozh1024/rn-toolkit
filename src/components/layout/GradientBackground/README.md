# GradientBackground 渐变背景

使用 react-native-svg 实现线性/径向渐变背景，适用于 Screen/Page/Container/Card 的背景装饰。

## 特性

- 支持 `linear` / `radial` 两种渐变
- 支持 `colors`/`locations`（Stop 位置与颜色）
- 线性渐变支持 `angle` 或 `start/end`；径向支持 `center`/`radius`
- 默认颜色来自主题：`primary -> secondary`
- 支持 `borderRadius` 与子元素叠加显示

## 用法

```tsx
import { GradientBackground, Screen, Container } from '@gaozh1024/rn-toolkit';

// 线性（角度 45°）
<GradientBackground angle={45} colors={['#007AFF', '#5856D6']} borderRadius={12}>
  <Container padding={16}>
    {/* 内容 */}
  </Container>
</GradientBackground>

// 径向（中心 0.5/0.5，半径 0.6）
<GradientBackground variant="radial" center={{ x: 0.5, y: 0.5 }} radius={0.6} />
```

## 与布局组件搭配

- 页面背景：在 `Screen`/`Page` 的内部最外层包裹，用于整页背景
- 容器背景：包裹 `Container` 或作为 `Card` 的背景叠层

## 性能与注意事项

- 静态或轻度动画场景性能开销极低，与 `react-native-linear-gradient` 接近
- 建议渐变仅在必要处使用，避免多层嵌套带来的过度绘制
- 使用 `borderRadius` 时容器会启用 `overflow: 'hidden'`，注意子元素的裁剪行为
