# Divider（分割线）

- 支持水平/垂直分割、主题色与自定义颜色、厚度与缩进。
- 已接入公共能力：
  - 间距：`SpacingProps`（`m/mv/mh/p/pv/ph/mt/...`，作用于外层容器）
  - 测试：`TestableProps`（`testID`，内部规范化为 `Divider-${你的ID}`）
- 样式类型统一为 `StyleProp<ViewStyle>`。

## 基本用法

```tsx
<Divider />                           // 水平，默认颜色 divider，厚度 1
<Divider color="border" thickness={2} />
<Divider inset={16} />                // 左侧缩进 16
<Divider inset={{ start: 8, end: 8 }} />
```

## 垂直分割

```tsx
<View style={{ flexDirection: 'row', alignItems: 'center' }}>
  <Text>Left</Text>
  <Divider orientation="vertical" thickness={2} inset={{ start: 6, end: 6 }} mh="sm" />
  <Text>Right</Text>
</View>
```

## 间距与测试

```tsx
<Divider m="md" testID="section-divider" />
<Divider orientation="vertical" mh="sm" />
```

## API

- `orientation?: 'horizontal'|'vertical'` 分割线方向（默认 `horizontal`）
- `color?: 主题键或颜色字符串` 颜色（默认 `divider`）
- `thickness?: number` 线条厚度（像素）
- `inset?: number | { start?: number; end?: number }` 缩进（水平为左右，垂直为上下）
- `style?: StyleProp<ViewStyle>` 容器样式
- `SpacingProps`（作用于外层容器）
- `TestableProps`（规范化为 `Divider-${testID}`）

## 注意

- `inset` 为数字时表示起始侧缩进（结束侧为 0）；对象形式可分别设置起止缩进。
- 间距通过 `SpacingProps` 合并到外层容器，不影响内部布局逻辑。
