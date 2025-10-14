# Radio / RadioGroup（单选）

- 支持尺寸、主题色、受控/非受控与分组布局。
- 已接入公共能力：
  - 间距：`SpacingProps`（`m/mv/mh/p/pv/ph/mt/...`，作用于外层容器）
  - 测试：`TestableProps`（`testID`，内部规范化为 `Radio-xxx` / `RadioGroup-xxx`）
- 样式类型统一为 `StyleProp<ViewStyle>` / `StyleProp<TextStyle>`。

## Radio 用法

```tsx
<Radio label="选项A" m="sm" testID="radio-a" />
<Radio checked label="选项B" color="secondary" mh="md" />
<Radio size="large" label="大号" />
```

## RadioGroup 用法

```tsx
<RadioGroup
  options={[
    { label: '苹果', value: 'apple' },
    { label: '香蕉', value: 'banana' },
  ]}
  layout="horizontal"
  value="apple"
  onChange={(v) => console.log(v)}
  m="md"
  testID="fruits-group"
/>
```

## 属性补充

- Radio：`SpacingProps`、`TestableProps`；`style`/`labelStyle` 为 `StyleProp`
- RadioGroup：`SpacingProps`、`TestableProps`；`style`/`optionStyle`/`labelStyle` 为 `StyleProp`

## 注意

- `RadioGroup` 的间距（`SpacingProps`）作用于外层容器，内部 `gap` 控制选项间距。
- 规范化后的 `testID` 形如：`Radio-xxx` / `RadioGroup-xxx`，便于测试定位。

使用 Icon 呈现单选状态（Ionicons：`radio-button-on`/`radio-button-off`），支持受控/非受控组、选项禁用与横纵布局。

## 功能特性

- 组控：`value`（受控）与 `defaultValue`（非受控）
- 事件：`onChange(value)`（组）/ `onChange(checked)`（项）
- 选项：`options`（`label/value/disabled`）
- 布局：`layout`（`horizontal` | `vertical`）与 `gap`（间距）
- 主题：颜色与间距取自 `theme.colors` / `theme.spacing`
- 无障碍：`radiogroup` 与 `radio` 的 `accessibilityRole` / `accessibilityState`

## 使用示例

### 非受控组

```tsx
import React from 'react';
import { View } from 'react-native';
import { RadioGroup } from 'rn-toolkit';

export default function UncontrolledGroupDemo() {
  return (
    <View style={{ padding: 16 }}>
      <RadioGroup
        defaultValue="b"
        options={[
          { label: '选项 A', value: 'a' },
          { label: '选项 B', value: 'b' },
          { label: '选项 C', value: 'c', disabled: true },
        ]}
      />
    </View>
  );
}
```

### 受控组

```tsx
import React, { useState } from 'react';
import { View } from 'react-native';
import { RadioGroup } from 'rn-toolkit';

export default function ControlledGroupDemo() {
  const [value, setValue] = useState<'a' | 'b' | 'c'>('a');
  return (
    <View style={{ padding: 16 }}>
      <RadioGroup
        value={value}
        onChange={setValue}
        options={[
          { label: '选项 A', value: 'a' },
          { label: '选项 B', value: 'b' },
          { label: '选项 C', value: 'c' },
        ]}
      />
    </View>
  );
}
```

### 横向布局与尺寸/颜色

```tsx
function LayoutSizeColorDemo() {
  return (
    <RadioGroup
      defaultValue="1"
      layout="horizontal"
      size="large"
      color="success"
      options={[
        { label: '一', value: '1' },
        { label: '二', value: '2' },
        { label: '三', value: '3' },
      ]}
    />
  );
}
```

### 禁用态（组/项）

```tsx
<RadioGroup
  defaultValue="x"
  disabled
  options={[
    { label: 'X', value: 'x' },
    { label: 'Y', value: 'y', disabled: true },
  ]}
/>
```

## API 参考

### RadioProps（单项）

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `checked` | `boolean` | `false` | 选中状态（受控） |
| `onChange` | `(checked: boolean) => void` | - | 状态变化回调 |
| `label` | `ReactNode \| string` | - | 标签文本或节点 |
| `disabled` | `boolean` | `false` | 禁用 |
| `size` | `'small' \| 'medium' \| 'large' \| number` | `'medium'` | 图标尺寸 |
| `color` | `'primary' \| 'secondary' \| 'success' \| 'warning' \| 'error' \| 'info' \| string` | `'primary'` | 选中颜色 |
| `style` | `ViewStyle \| ViewStyle[]` | - | 容器样式 |
| `labelStyle` | `TextStyle \| TextStyle[]` | - | 标签样式 |
| `testID` | `string` | - | 测试ID |

### RadioGroupProps（组）

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `value` | `string \| number` | - | 受控选中值 |
| `defaultValue` | `string \| number` | - | 非受控初始值 |
| `onChange` | `(value: string \| number) => void` | - | 选中值变化 |
| `options` | `{ label: ReactNode \| string; value: string \| number; disabled?: boolean; }[]` | ✅ | 选项列表 |
| `layout` | `'horizontal' \| 'vertical'` | `'vertical'` | 布局方向 |
| `size` | `'small' \| 'medium' \| 'large' \| number` | `'medium'` | 单项尺寸 |
| `color` | 同 Radio | `'primary'` | 选中颜色 |
| `disabled` | `boolean` | `false` | 整组禁用 |
| `gap` | `number` | - | 项间距（默认取主题 spacing） |
| `style` | `ViewStyle \| ViewStyle[]` | - | 容器样式 |
| `optionStyle` | `ViewStyle \| ViewStyle[]` | - | 单项容器样式 |
| `labelStyle` | `TextStyle \| TextStyle[]` | - | 标签样式 |
| `testID` | `string` | - | 测试ID |

## 设计说明

- 选中与未选中的图标：`radio-button-on` / `radio-button-off`
- 颜色优先使用主题色（`theme.colors`），禁用态统一使用 `textDisabled`
- 横向布局默认更大间距（`spacing.md`），纵向布局更小间距（`spacing.sm`）
- 单项 Radio 允许独立使用，但推荐通过 RadioGroup 管理选中值
