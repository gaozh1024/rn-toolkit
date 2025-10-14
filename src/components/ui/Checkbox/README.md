# Checkbox（复选框）

- 支持受控/非受控、尺寸、主题色和标签
- 已接入公共能力：
  - 间距：`SpacingProps`（`m/mv/mh/p/pv/ph/mt/...`）
  - 测试：`TestableProps`（`testID`，内部 `buildTestID('Checkbox', testID)` 规范化）
- 样式类型统一为 `StyleProp<ViewStyle>` 与 `StyleProp<TextStyle>`

## 属性

- `checked?: boolean` 受控选中态
- `defaultChecked?: boolean` 非受控初始值
- `onChange?: (checked: boolean) => void`
- `label?: React.ReactNode | string`
- `disabled?: boolean`
- `size?: 'small'|'medium'|'large'|number`
- `color?: 主题键或颜色字符串`
- `style?: StyleProp<ViewStyle>` 容器样式
- `labelStyle?: StyleProp<TextStyle>` 标签样式
- `SpacingProps`
- `TestableProps`

## 用法示例

```tsx
<Checkbox label="同意协议" m="md" testID="agree" />
<Checkbox checked={true} label="受控" mh="sm" />
<Checkbox defaultChecked size="large" color="secondary" testID="checkbox-secondary" />
```

## 注意

- 间距作用于外层容器（`Pressable`）
- 规范化后的 `testID` 形如：`Checkbox-xxx`
