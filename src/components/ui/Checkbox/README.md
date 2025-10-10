# Checkbox（复选框）

一个主题化的复选框组件，支持受控/非受控用法、标签、禁用、尺寸与颜色。复选框勾选样式由 `Icon` 渲染。

## 功能特性
- 受控/非受控：`checked` 与 `defaultChecked`
- 状态变更：`onChange(checked)` 回调
- 标签：`label` 支持字符串或自定义节点
- 禁用态：`disabled`
- 尺寸：`small | medium | large | number`
- 颜色：主题色（`primary/secondary/success/warning/error/info`）或自定义字符串颜色
- 可访问性：`accessibilityRole="checkbox"`、`accessibilityState`

## 安装与依赖
- 依赖本仓库的 `Icon` 与 `Text` 组件
- 需要初始化主题服务（详见 `src/theme/README.md`）

## 使用示例

### 非受控用法
```tsx
import React from 'react';
import { View } from 'react-native';
import { Checkbox } from 'rn-toolkit';

export default function UncontrolledDemo() {
  return (
    <View style={{ padding: 16 }}>
      <Checkbox defaultChecked label="我已阅读并同意协议" />
    </View>
  );
}
```

### 受控用法
```tsx
import React, { useState } from 'react';
import { View } from 'react-native';
import { Checkbox } from 'rn-toolkit';

export default function ControlledDemo() {
  const [agree, setAgree] = useState(false);
  return (
    <View style={{ padding: 16 }}>
      <Checkbox
        checked={agree}
        onChange={setAgree}
        label="我同意条款"
      />
    </View>
  );
}
```

### 尺寸与颜色
```tsx
function SizeColorDemo() {
  return (
    <>
      <Checkbox size="small" color="secondary" label="小尺寸" />
      <Checkbox size="medium" color="success" label="中尺寸" />
      <Checkbox size="large" color="error" label="大尺寸" />
      <Checkbox size={30} color="#FF6B6B" label="自定义大小与颜色" />
    </>
  );
}
```

### 禁用态
```tsx
<Checkbox disabled label="禁用复选框" />
<Checkbox disabled checked label="禁用且选中" />
```

## API 参考

### CheckboxProps
| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `checked` | `boolean` | - | 受控选中状态 |
| `defaultChecked` | `boolean` | `false` | 非受控初始选中状态 |
| `onChange` | `(checked: boolean) => void` | - | 状态变更回调 |
| `label` | `ReactNode \| string` | - | 标签文本或自定义节点 |
| `disabled` | `boolean` | `false` | 是否禁用 |
| `size` | `'small' \| 'medium' \| 'large' \| number` | `'medium'` | 复选框尺寸或自定义像素值 |
| `color` | `'primary' \| 'secondary' \| 'success' \| 'warning' \| 'error' \| 'info' \| string` | `'primary'` | 勾选填充颜色 |
| `style` | `ViewStyle \| ViewStyle[]` | - | 外层容器样式 |
| `labelStyle` | `TextStyle \| TextStyle[]` | - | 标签样式 |
| `testID` | `string` | - | 测试标识符 |

## 设计说明
- 颜色取值优先使用主题色；自定义颜色传入字符串即可
- 禁用态降低不透明度并使用 `theme.color.disabled` 作为边框与标签颜色
- 勾选图标使用 Ionicons 的 `checkmark`，图标颜色固定为白色以保证对比度
- 标签为字符串时使用 `Text` 组件渲染，以获得主题化文本样式；自定义节点则原样渲染

## 最佳实践
- 表单中建议与 `RadioGroup`/`Switch` 保持交互一致性
- 与 `Input` 的校验文案搭配时，可统一使用 `helperText` 或错误提示
- 受控场景下请始终从外部状态派发变更（`onChange`）