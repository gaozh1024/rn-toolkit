# Page 页面容器（支持全屏渐变）

Page 负责页面主体区域搭建，通常与 `Screen`、`Header` 搭配使用。支持在 `SafeAreaView` 外层包裹全屏渐变背景。

## 特性

- 布局：`SafeAreaView + Container` 组合，支持滚动、统一内边距与点击空白收起键盘
- Header：可显示标题与右侧动作，或通过 `headerProps` 定制
- 主题：颜色与导航样式来自主题，深/浅色自动适配
- 渐变（GradientProps）：`linear/radial`，支持角度/位置/中心/半径/透明度；通过公共方法归一化配置
- 测试（TestableProps）：`testID` 会通过 `buildTestID('Page', testID)` 标准化

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

## 全屏渐变背景（公共方法）

```tsx
// 使用 GradientProps（公共能力）统一配置
<Page
  headerShown
  headerProps={{ title: 'Gradient Page' }}
  gradientEnabled
  gradientVariant="linear"
  gradientColors={["#34C759", "#0A84FF"]}
  gradientLocations={[0, 1]}
  gradientAngle={45}
  testID="page-gradient"
/>
```

说明：

- 内部通过 `normalizeGradientConfig` 归一化梯度配置，启用时自动将页面与内容容器背景设为透明以透出渐变。
- `testID` 被标准化为 `Page-page-gradient`。

## Props 摘要

- 布局：`style`, `contentStyle`, `backgroundColor`, `scrollable`, `padding`
- Header：`headerShown`, `headerProps`, `headerActions`
- 安全区：`safeAreaEdges`（默认 `['bottom','left','right']`）
- 状态栏：`statusBarStyle`, `statusBarBackgroundColor`
- 渐变（GradientProps）：`gradientEnabled`, `gradientVariant`, `gradientColors`, `gradientLocations`, `gradientAngle`, `gradientStart`, `gradientEnd`, `gradientCenter`, `gradientRadius`, `gradientOpacity`
- 测试（TestableProps）：`testID`（内部标准化）
- 抽屉：`leftDrawer`, `rightDrawer`
- 行为：`dismissKeyboardOnTapOutside`

## 注意事项

- 启用渐变时：状态栏背景设为透明，页面与内容容器背景设为透明以显示渐变层。
- 避免与 `Header` 自身的渐变重复叠加；Page 渐变位于 Header 下方，Header 自身也可单独开启渐变。
