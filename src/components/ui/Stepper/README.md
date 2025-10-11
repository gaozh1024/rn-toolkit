# Stepper（步进器）

用于按固定步长增加或减少数值，一般搭配数量选择、表单输入等场景。

## 特性
- 受控组件：`value` + `onChange`
- 约束：`min`/`max` 边界，`step` 步长
- 状态：`disabled` 禁用整体与按钮
- 无障碍：`adjustable`，支持 `increment`/`decrement` 操作
- 主题接入：圆角、间距、边框使用主题 tokens

## 用法
```tsx
import { Stepper } from '@gaozh1024/rn-toolkit';

function QuantitySelector() {
  const [qty, setQty] = React.useState(1);
  return (
    <>
      <Stepper value={qty} min={1} max={10} step={1} onChange={setQty} />
      {/* 外部展示数值（推荐） */}
      {/* <Text>{qty}</Text> */}
    </>
  );
}
```

## Props
- `value`: 当前值（必填，受控）
- `min`: 最小值（可选）
- `max`: 最大值（可选）
- `step`: 步长，默认 `1`
- `disabled`: 是否禁用，默认 `false`
- `onChange(next)`: 值变化回调（已做 `clamp(min,max)`）
- `style`: 容器样式
- `testID`: 测试标识

## 主题说明
- 圆角：`theme.borderRadius.md`
- 间距：`theme.spacing.xs`
- 边框颜色：`colors.border`

## 最佳实践
- 将值展示交由外部（如 `Text`），Stepper 专注于增减交互
- 边界内禁用对应按钮，避免无效点击与视觉抖动
- 与表单输入并排时，保持一致的高度与圆角风格