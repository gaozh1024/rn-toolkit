# Header 头部（支持渐变背景）

Header 提供页面标题、返回与右侧操作区，并接入安全区与主题导航配置。现支持可选的渐变背景（基于 react-native-svg）。

## 特性

- 左侧返回、居中标题、右侧最多 3 个动作槽位
- 安全区顶部自动填充（不重复叠加）
- 主题联动：字体尺寸、颜色、分割线与高度来自 `theme.navigation`
- 可选渐变背景：`linear/radial`，支持角度/位置/透明度与 locations

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

## 渐变背景

```tsx
// 线性渐变（45°，默认主题 primary→secondary）
<Header title="Gradient" gradientEnabled gradientVariant="linear" gradientAngle={45} />

// 自定义颜色与 locations
<Header
  title="Custom"
  gradientEnabled
  gradientColors={["#007AFF", "#5856D6"]}
  gradientLocations={[0, 1]}
  gradientAngle={30}
/>

// 径向渐变（居中，半径 0.6）
<Header
  title="Radial"
  gradientEnabled
  gradientVariant="radial"
  gradientCenter={{ x: 0.5, y: 0.5 }}
  gradientRadius={0.6}
/>
```

## 透明背景与顶部安全区控制

在单独使用 Header 时，你可以：

- 设置背景为透明，仅显示 Header 本身：
- 关闭顶部安全区内边距，避免重复叠加：

```tsx
// 透明背景（保留顶部安全区）
<Header title="示例" transparent />

// 透明背景 + 关闭顶部安全区，只显示 header 本身高度
<Header title="示例" transparent safeAreaTopEnabled={false} />

// 保持主题背景，但不添加顶部安全区
<Header title="示例" safeAreaTopEnabled={false} />
```

说明：

- `transparent` 会让 Header 背景透明；若开启渐变，渐变会覆盖 Header 区域。
- `safeAreaTopEnabled={false}` 关闭顶部安全区内边距，适合“只渲染 Header”的场景。
- 与 `Page`/`SafeAreaView` 组合使用时，避免在外层再加顶部安全区以免重复。

## 注意事项

- 开启渐变后容器背景设为透明，底部分割线仍生效
- 顶部安全区由 Header 内部处理，不需要额外在外层再加顶部 safe-area
- 与 `Page` 的渐变同时开启时，`Page` 渐变会在 Header 之下；Header 的渐变覆盖其自身高度

## Props 摘要

- `title`: 标题文本或节点
- `backVisible`, `onBack`, `backIconName`, `backIconColor`
- `actions`: 右侧动作（最多 3 个）
- `backgroundColor`, `borderBottom`, `titleColor`, `height`
- `transparent`: 启用后 Header 背景透明（默认 false）
- `safeAreaTopEnabled`: 是否添加顶部安全区内边距（默认 true）
- 渐变相关：`gradientEnabled`, `gradientVariant`, `gradientColors`, `gradientLocations`, `gradientAngle`, `gradientStart`, `gradientEnd`, `gradientCenter`, `gradientRadius`, `gradientOpacity`
