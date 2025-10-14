# IconButton（图标按钮）

- 接入公共能力：
  - 间距：`SpacingProps`（`m/mv/mh/p/...`，用于容器）
  - 测试：`TestableProps`（`testID`，规范化为 `IconButton-${id}`）
  - 事件：`PressEvents`（`onPress/onPressIn/onPressOut/onLongPress`）
  - 阴影：`ShadowProps`（`shadowSize/color/offset/opacity/radius`）
  - 盒子：`BoxProps`（宽高、背景、边框）
  - 渐变：`GradientProps`（统一启用与覆盖项）

## 属性

- `name`、`type`（默认 `ionicons`）、`size`、`color`
- `variant`: `filled | ghost | outline`
- `style`: `StyleProp<ViewStyle>`，与盒子/阴影/间距样式合并

## 用法

```tsx
<IconButton name="heart" variant="filled" m="sm" shadowSize="lg" testID="fav" onPress={() => {}} />
<IconButton name="share" variant="outline" mh="md" onLongPress={() => {}} />
<IconButton name="star" variant="ghost" gradientEnabled gradientColors={['#FF9800', '#FFC107']} shadowSize="xl" />
```

## 注意

- Android 阴影由主题 `elevation` 驱动；iOS 使用 `shadow*` 属性。
- 渐变启用会设置 `position: 'relative'` 与 `overflow: 'hidden'`。
- `BoxProps` 可直接设置 `width/height/background/borderColor` 等并与变体样式合并。
