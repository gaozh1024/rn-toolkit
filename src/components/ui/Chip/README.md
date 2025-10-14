# Chip/Tag（标签）

支持标签文本、图标、可关闭、选中态、变体、颜色与尺寸，接入主题。

- 已接入公共能力：
  - 间距：`SpacingProps`（`m/mv/mh/p/pv/ph/mt/...`）
  - 测试：`TestableProps`（`testID`，内部 `buildTestID('Chip', testID)` 规范化）
- 样式类型统一为 `StyleProp<ViewStyle>` 与 `StyleProp<TextStyle>`

## 属性

- `label?: React.ReactNode | string`
- `icon?: React.ReactNode | { name, size?, color?, type? }`
- `closable?: boolean | React.ReactNode`（为 `true` 时显示关闭按钮）
- `onClose?: () => void`
- `selected?: boolean`
- `variant?: 'solid' | 'outline'`
- `color?: 'primary'|'secondary'|'success'|'warning'|'error'|'info'|string`
- `size?: 'small'|'medium'|'large'|number`
- `style?: StyleProp<ViewStyle>` 容器样式
- `textStyle?: StyleProp<TextStyle>` 文本样式
- `SpacingProps`（作用于外层容器）
- `TestableProps`（规范化为 `Chip-${testID}`）

## 使用示例

```tsx
<Chip label="Default" m="sm" testID="chip-default" />
<Chip label="Primary" color="primary" selected variant="solid" mh="md" />
<Chip label="Closable" closable onClose={() => console.log('closed')} testID="chip-close" />
<Chip label="Custom Size" size={34} color="#222" p="sm" />
```

## 注意事项

- 间距通过 `SpacingProps` 应用于外层容器（不影响内部布局逻辑）
- `testID` 将被规范化为 `Chip-${你的ID}`，便于测试用例定位
