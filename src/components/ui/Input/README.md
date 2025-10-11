# Input（输入框）

通用文本输入组件，支持图标、错误提示、变体与主题接入。

## 特性

- 受控/非受控：`value` / `defaultValue`、`onChangeText`
- 变体与尺寸：`variant`（`solid/outline/ghost`）、`size`（`xs/sm/md/lg/xl`）
- 图标：`leftIcon`、`rightIcon`（可设置 `name/size/color`，`rightIcon` 支持 `onPress`）
- 状态与样式：`disabled`、`error`、`helperText`、`fullWidth`/`flex`、`inputStyle`/`style`
- 键盘：`keyboardType`、`returnKeyType`、`autoCapitalize`
- 细节：`editable`、无障碍 `accessibilityLabel/accessibilityHint/testID`
- 间距与圆角：`paddingH`、`paddingV`、`radius`（不传则使用主题默认）

## 用法

```tsx
import { Input } from '@gaozh1024/rn-toolkit';

export default function Examples() {
  const [text, setText] = React.useState('');
  return (
    <>
      {/* 基础受控输入 */}
      <Input value={text} onChangeText={setText} placeholder="请输入内容" />

      {/* Outline 变体 + 左侧搜索图标 */}
      <Input
        variant="outline"
        placeholder="搜索"
        leftIcon={{ name: 'search' }}
      />

      {/* Solid 变体 + 右侧清除图标 */}
      <Input
        variant="solid"
        placeholder="用户名"
        rightIcon={{ name: 'close', onPress: () => setText('') }}
      />

      {/* 错误态 + 辅助文本 */}
      <Input
        value={text}
        onChangeText={setText}
        error
        helperText="请输入合法的用户名"
      />

      {/* 自定义间距与圆角 */}
      <Input
        placeholder="自定义样式"
        paddingH={8}
        paddingV={10}
        radius={12}
      />
    </>
  );
}
```

## Props

- `value?`: string
- `defaultValue?`: string
- `placeholder?`: string
- `secureTextEntry?`: boolean
- `disabled?`: boolean
- `error?`: boolean
- `helperText?`: string
- `size?`: `'xs' | 'sm' | 'md' | 'lg' | 'xl'`
- `variant?`: `'solid' | 'outline' | 'ghost'`
- `color?`: 主题色键或自定义色值（影响图标颜色）
- `fullWidth?`: boolean（宽度 `100%`）
- `flex?`: number（在父容器中按比例拉伸）
- `style?`: `ViewStyle`
- `inputStyle?`: `TextStyle`
- `leftIcon?`: `{ name: string; color?: string; size?: number }`
- `rightIcon?`: `{ name: string; color?: string; size?: number; onPress?: () => void }`
- `editable?`: boolean（默认 `true`；与 `disabled` 同时生效时禁用输入）
- `keyboardType?`: `KeyboardTypeOptions`
- `returnKeyType?`: `ReturnKeyType`
- `autoCapitalize?`: `'none' | 'sentences' | 'words' | 'characters'`
- `onChangeText?`: `(text: string) => void`
- `onFocus?/onBlur?`: `() => void`
- `accessibilityLabel?/accessibilityHint?/testID?`
- `paddingH?/paddingV?/radius?`: number（未传时使用主题 `spacing` 与 `borderRadius`）

## 主题说明

- 背景：`variant='solid'` 使用 `colors.surface`，其余使用 `colors.background`
- 边框：`variant='outline'` 使用 `colors.border`（错误态使用 `colors.error`）
- 文本：`colors.text`，占位符 `colors.textSecondary`，禁用 `colors.textDisabled`
- 间距：`theme.spacing.sm/md`；圆角：`theme.borderRadius.lg`

## 最佳实践

- 错误态与 `helperText` 搭配使用，底部绝对定位的提示可能遮挡布局，可在容器外额外留白
- 同时传入 `fullWidth` 与 `flex` 仅应选择其一，避免布局冲突
- 图标尺寸与输入高度保持匹配（例如 `md` 对应约 20px 图标）
- 设置合适的 `accessibilityLabel` 与 `hitSlop`（在 `rightIcon` 的 `Pressable` 中已包含）
