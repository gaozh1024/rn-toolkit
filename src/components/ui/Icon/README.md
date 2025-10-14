# Icon（图标）

- 支持默认 Ionicons 与自定义图标库注册。
- 已接入公共能力：
  - 间距：`SpacingProps`（`m/mv/mh/p/pv/ph/mt/...`，作用于外层容器）
  - 测试：`TestableProps`（`testID`，内部规范化为 `Icon-${你的ID}`）
  - 事件：`PressEvents`（`onPress`，挂载于容器）

## 用法

```tsx
<Icon name="heart" color="primary" m="sm" testID="fav-icon" onPress={() => {}} />
<Icon name="chatbubble" size={28} color="#222" mh="md" />
```

## 自定义图标库

- 通过 `registerIconLibrary(name, component)` 注册，`type` 指向该名称。
- 容器事件统一在外层处理，不依赖自定义库的事件实现。

## 注意

- `style` 传递给图标自身；间距通过容器合并，不会混用造成警告。
- `testID` 将被规范化为 `Icon-${id}`，便于测试定位。
