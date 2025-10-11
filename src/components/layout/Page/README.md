# Page 页面容器（支持全屏渐变）

Page 负责页面主体区域搭建，通常与 `Screen`、`Header` 搭配使用。支持在 `SafeAreaView` 外层包裹全屏渐变背景。

## 导入

```ts
import { Page } from '@gaozh1024/rn-toolkit';
```

## 基本结构

```tsx
<Screen>
  <Page headerShown headerProps={{ title: '首页' }}>
    {/* 内容 */}
  </Page>
</Screen>
```

## 全屏渐变背景

```tsx
// 默认主题 primary→secondary 的线性渐变
<Page headerShown headerProps={{ title: 'Gradient Page' }} gradientEnabled />

// 自定义参数（线性）
<Page
  gradientEnabled
  gradientVariant="linear"
  gradientColors={["#34C759", "#0A84FF"]}
  gradientLocations={[0, 1]}
  gradientAngle={45}
  headerProps={{ title: 'Linear' }}
>
  {/* 内容 */}
</Page>

// 径向渐变（中心与半径）
<Page
  gradientEnabled
  gradientVariant="radial"
  gradientCenter={{ x: 0.5, y: 0.5 }}
  gradientRadius={0.6}
  headerProps={{ title: 'Radial' }}
/>
```

## Props 摘要

- 布局：`style`, `contentStyle`, `backgroundColor`, `scrollable`, `padding`
- Header：`headerShown`, `headerProps`
- 安全区：`safeAreaEdges`（默认 `['bottom','left','right']`）
- 状态栏：`statusBarStyle`, `statusBarBackgroundColor`
- 渐变：`gradientEnabled`, `gradientVariant`, `gradientColors`, `gradientLocations`, `gradientAngle`, `gradientStart`, `gradientEnd`, `gradientCenter`, `gradientRadius`, `gradientOpacity`

## 注意事项

- 开启渐变后，内部 `SafeAreaView/Container` 的背景自动设为透明，以显示渐变
- 状态栏背景在渐变开启时为透明；建议根据深浅色选择合适的 `barStyle`
- `headerShown` 为 true 时，Header 置于渐变之上；Header 自身也可单独开启渐变
