# PasswordInput（密码输入框）

- 能力继承自 `Input`：
  - 间距：`SpacingProps`（`m/mv/mh/p/...`）
  - 测试：`TestableProps`（`testID`）
  - 盒子：`BoxProps`（宽高、背景、边框）
- 新增：
  - 阴影：`ShadowProps`（`shadowSize/color/offset/opacity/radius`），合并到 `style` 中，使用主题预设。

## Props

- 显隐：`secureTextEntry`（默认开启）、`toggleIconVisible`、`toggleIconNames`、`toggleIconType`、`onVisibilityChange`、`toggleIconColor`
- 继承：`InputProps`（除 `rightIcon/secureTextEntry` 外），包含 `SpacingProps/TestableProps/BoxProps` 等

## 用法

```tsx
<PasswordInput placeholder="密码" m="sm" shadowSize="lg" />
<PasswordInput
  placeholder="登录密码"
  toggleIconNames={{ show: 'eye', hide: 'eye-off' }}
  borderRadius={12}
  p="md"
/>
```

## 注意

- 阴影在 Android 使用主题 `elevation`；在 iOS 使用 `shadow*` 属性。
- 盒子/间距由 `Input` 容器合并生效；`PasswordInput` 仅在样式上额外合并阴影。
