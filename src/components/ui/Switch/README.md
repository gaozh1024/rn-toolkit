# Switch（开关）

一个主题化的开关组件，支持受控 `value`/`onValueChange`、禁用、尺寸与颜色配置。

## 功能特性

- 受控：`value` 与 `onValueChange(value)`
- 状态：`disabled` 禁用，按压时反馈
- 尺寸：`small | medium | large | number`
- 颜色：主题色（`primary/secondary/success/warning/error/info`）或自定义字符串颜色
- 可访问性：`accessibilityRole="switch"`、`accessibilityState={ checked, disabled }`

## 使用示例

### 基础受控用法

```tsx
import React, { useState } from 'react';
import { View } from 'react-native';
import { Switch } from 'rn-toolkit';

export default function BasicSwitchDemo() {
  const [on, setOn] = useState(false);
  return (
    <View style={{ padding: 16 }}>
      <Switch value={on} onValueChange={setOn} />
    </View>
  );
}
```

### 尺寸与颜色

```tsx
function SizeColorDemo() {
  return (
    <View style={{ gap: 16 }}>
      <Switch value={true} onValueChange={() => {}} size="small" color="secondary" />
      <Switch value={false} onValueChange={() => {}} size="medium" color="success" />
      <Switch value={true} onValueChange={() => {}} size="large" color="error" />
      <Switch value={true} onValueChange={() => {}} size={32} color="#FF6B6B" />
    </View>
  );
}
```

### 禁用态

```tsx
<Switch value={false} onValueChange={() => {}} disabled />
<Switch value={true} onValueChange={() => {}} disabled />
```

## API 参考

### SwitchProps

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `value` | `boolean` | ✅ | 当前开关状态（受控） |
| `onValueChange` | `(value: boolean) => void` | ✅ | 状态变化回调 |
| `disabled` | `boolean` | `false` | 是否禁用 |
| `size` | `'small' \| 'medium' \| 'large' \| number` | `'medium'` | 高度像素或预设尺寸（宽度按比例计算） |
| `color` | `'primary' \| 'secondary' \| 'success' \| 'warning' \| 'error' \| 'info' \| string` | `'primary'` | 开启时的轨道颜色 |
| `style` | `ViewStyle \| ViewStyle[]` | - | 容器样式（包裹 Pressable） |
| `testID` | `string` | - | 测试标识符 |

## 设计说明

- 开启状态使用主题色，关闭状态使用 `theme.colors.border`，禁用状态使用 `theme.colors.textDisabled`
- 滑块（thumb）颜色固定为白色（禁用态略微变浅）以保证对比度
- 组件使用 `Pressable` 提供按压视觉反馈，并接入无障碍属性

## 最佳实践

- 在表单中与 `Checkbox`/`Radio` 保持一致的交互方式
- 对于受控场景，始终从外部状态派发变更（`onValueChange`）
