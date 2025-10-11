# PasswordInput（密码输入框）

在 Input 基础上提供密码显隐切换，简化常见登录/注册场景。

## 特性

- 密码模式：`secureTextEntry`（默认开启）
- 显隐切换：`toggleIconVisible`（默认显示）
- 自定义图标名：`toggleIconNames`（默认 `{ show: 'eye', hide: 'eye-off' }`）
- 显隐回调：`onVisibilityChange(visible)`
- 图标颜色：`toggleIconColor`
- 其他 `Input` 的 Props 均可透传（但不接受 `rightIcon`，见说明）

## 用法

```tsx
import { PasswordInput } from '@gaozh1024/rn-toolkit';

export default function Examples() {
  const [pwd, setPwd] = React.useState('');
  return (
    <>
      {/* 基础密码输入：带显隐按钮 */}
      <PasswordInput
        value={pwd}
        onChangeText={setPwd}
        placeholder="请输入密码"
      />

      {/* 自定义显隐图标与颜色 */}
      <PasswordInput
        placeholder="自定义显隐图标"
        toggleIconNames={{ show: 'eye-outline', hide: 'eye-off-outline' }}
        toggleIconColor="#6366F1"
      />

      {/* 关闭显隐按钮（如需完全自定义右侧操作，建议改用 Input） */}
      <PasswordInput
        placeholder="无显隐按钮"
        toggleIconVisible={false}
      />
    </>
  );
}
```

## Props

- `secureTextEntry?`: boolean（默认 `true`；显隐开启时自动在内部切换）
- `toggleIconVisible?`: boolean（是否显示显隐按钮，默认 `true`）
- `toggleIconNames?`: `{ show: string; hide: string }`
- `onVisibilityChange?`: `(visible: boolean) => void`
- `toggleIconColor?`: string
- 其余 Props 同 `Input`（例如 `value/defaultValue/placeholder/size/variant/...`）

## 说明

- 本组件不接收 `rightIcon`（类型上已移除），若需完全自定义右侧按钮，请直接使用 `Input` 并设置 `secureTextEntry` 与自定义 `rightIcon`
- 内置显隐逻辑：当 `visible=true` 时强制关闭加密（`secureTextEntry=false`），反之开启

## 最佳实践

- 登录/注册场景建议保留显隐按钮，提升输入体验
- 避免与 `disabled/editable=false` 同时使用显隐按钮（不可点击时会降低不透明度，但不会切换）
