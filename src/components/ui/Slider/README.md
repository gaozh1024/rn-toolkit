# Slider（滑块）

用于按步长调整数值，提供拖拽与无障碍增减操作。

## 特性
- 受控：`value` + `onValueChange`
- 约束：`min` / `max` / `step`
- 状态：`disabled` 禁用拖拽与交互
- 主题：轨道/填充/圆角来源主题 tokens
- 手势：基于 Gesture Handler + Reanimated，性能与兼容性更好

## 用法
```tsx
import { Slider } from '@gaozh1024/rn-toolkit';

function Volume() {
  const [vol, setVol] = React.useState(50);
  return (
    <Slider value={vol} min={0} max={100} step={5} onValueChange={setVol} />
  );
}
```

## Props
- `value`: 当前值（必填）
- `min`: 最小值，默认 `0`
- `max`: 最大值，默认 `100`
- `step`: 步长，默认 `1`
- `disabled`: 是否禁用，默认 `false`
- `onValueChange(next)`: 值变化回调（拖拽或无障碍增减触发）
- `style`: 容器样式
- `testID`: 测试标识

## 主题说明
- 轨道颜色：`colors.border`
- 填充颜色：`colors.primary`
- 圆角：`theme.borderRadius.md`

## 最佳实践
- 设置合适的 `min/max/step`，避免非整数步长导致的取值误差
- 外部展示当前值并与业务逻辑绑定；Slider 专注于交互
- 禁用状态用于边界条件或不允许更改的场景