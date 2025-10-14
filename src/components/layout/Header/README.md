# Header 头部（支持渐变背景）

Header 提供页面标题、返回与右侧操作区，并接入安全区与主题导航配置。现支持可选的渐变背景（基于 react-native-svg）。

## 特性

- 左侧返回、居中标题、右侧最多 3 个动作槽位
- 安全区顶部自动填充（不重复叠加）
- 主题联动：字体尺寸、颜色、分割线与高度来自 `theme.navigation`
- 可选渐变背景：`linear/radial`，支持角度/位置/透明度与 locations
- 间距（SpacingProps）：支持 `m/mv/mh/mt/mb/ml/mr` 与 `p/pv/ph/pt/pb/pl/pr`，统一来自主题 `spacing`
- 阴影（ShadowProps）：支持 `shadowSize` 预设与颜色/偏移/不透明度/半径覆盖
- 测试（TestableProps）：`testID` 会通过 `buildTestID('Header', testID)` 标准化

## 导入

```ts
import { Header } from '@gaozh1024/rn-toolkit';
```

## 基本用法

```tsx
<Header title="设置" />
<Header title="返回示例" onBack={() => nav.goBack()} />
<Header title="操作" actions={[{ iconName: 'search' }, { iconName: 'settings' }]} />
```

## 间距与阴影

```tsx
<Header
  title="Spacing + Shadow"
  p="md"            // 内边距 md（也可传 number）
  m="sm"            // 外边距 sm
  shadowSize="sm"   // 使用主题阴影预设
  testID="header-basic"
/>
```

说明：

- 间距属性来自主题，支持语义键（如 `'md'`）或数值。
- `shadowSize` 使用主题 `styles.shadow` 预设；其他阴影字段可按需覆盖。
- `testID` 内部会标准化为 `Header-header-basic`。

## 渐变背景

```tsx
<Header title="Gradient" gradientEnabled gradientVariant="linear" gradientAngle={45} />

<Header
  title="Custom"
  gradientEnabled
  gradientColors={["#007AFF", "#5856D6"]}
  gradientLocations={[0, 1]}
  gradientAngle={30}
/>

<Header
  title="Radial"
  gradientEnabled
  gradientVariant="radial"
  gradientCenter={{ x: 0.5, y: 0.5 }}
  gradientRadius={0.6}
/>
```

## 透明背景与顶部安全区控制

```tsx
<Header title="示例" transparent />
<Header title="示例" transparent safeAreaTopEnabled={false} />
<Header title="示例" safeAreaTopEnabled={false} />
```

## Props 摘要

- 核心：`title`, `backVisible`, `onBack`, `backIconName`, `backIconColor`, `actions`, `backgroundColor`, `borderBottom`, `titleColor`, `height`
- 安全区：`transparent`, `safeAreaTopEnabled`
- 渐变：`gradientEnabled`, `gradientVariant`, `gradientColors`, `gradientLocations`, `gradientAngle`, `gradientStart`, `gradientEnd`, `gradientCenter`, `gradientRadius`, `gradientOpacity`
- 间距（SpacingProps）：`m/mv/mh/mt/mb/ml/mr`、`p/pv/ph/pt/pb/pl/pr`
- 阴影（ShadowProps）：`shadowSize`, `shadowColor`, `shadowOffset`, `shadowOpacity`, `shadowRadius`
- 测试（TestableProps）：`testID`（内部标准化）
