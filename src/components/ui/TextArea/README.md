# TextArea（多行输入）

TextArea 继承 Input 能力，新增 `rows` 与 `autoSize`，用于多行文本输入。样式与交互全部接入主题。

## Props

- `value` / `defaultValue`
- `placeholder`
- `secureTextEntry`（少用）
- `disabled` / `error`
- `helperText`
- `size`: `xs | sm | md | lg | xl`
- `variant`: `solid | outline | ghost`
- `color`: 主题色名或自定义色值（影响聚焦/状态色）
- `fullWidth` / `flex`
- `style` / `inputStyle`
- `rows`: 最小显示行数（默认 3）
- `autoSize`: 是否根据内容自动增高（默认 `true`）
- `leftIcon` / `rightIcon`: 以 ReactNode 传入图标
- `onChangeText` / `onFocus` / `onBlur`

## 主题接入

- 颜色来源：`useThemeColors()`（如 `colors.input?.background/border/placeholder/text`、`colors.border`、`colors.error`、`colors.primary` 等）
- 尺寸与圆角：`useTheme()` 中的 `theme.spacing`、`theme.borderRadius`、`theme.size`

## 使用示例

```tsx
import React from 'react';
import { View } from 'react-native';
import { TextArea } from '../';

export default function Demo() {
  return (
    <View style={{ padding: 16 }}>
      <TextArea placeholder="请输入备注" helperText="最长 500 字" />

      <TextArea
        variant="solid"
        size="lg"
        rows={4}
        autoSize
        placeholder="自动增长的多行输入"
        helperText="支持错误态与禁用态"
      />

      <TextArea error helperText="内容不符合规则" />
      <TextArea disabled placeholder="禁用状态" />
    </View>
  );
}
```

## 最佳实践

- 建议开启 `autoSize`，从而避免滚动内嵌引起的可用性问题
- 文案较多时提高 `rows`（如 4–6）以改善初始可读性
- 错误态（`error`）配合 `helperText` 明确提示

## 验收标准

- 无硬编码颜色（全部来源主题 tokens）
- 变体、尺寸、禁用态、错误态完整
- 支持暗色模式（主题切换）
- 集中导出接入到 `src/components/ui/index.ts`