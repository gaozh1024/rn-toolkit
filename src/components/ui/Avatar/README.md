# Avatar（头像）

- 支持图片/首字母、尺寸与形状、状态徽标。
- 已接入公共能力：
  - 间距：`SpacingProps`（`m/mv/mh/p/pv/ph/mt/...`）
  - 盒子：`BoxProps`（`width/height/min/max/backgroundColor/transparent/borderColor/borderWidth/borderRadius`）
  - 阴影：`ShadowProps`（`shadowSize/shadowColor/shadowOffset/shadowOpacity/shadowRadius`）
  - 测试：`TestableProps`（`testID`，内部 `buildTestID('Avatar', testID)` 规范化）
- 样式合并规则：外部 `style` 拍平为 overrides；随后由单独属性覆盖同名字段。

## 基本用法

```tsx
<Avatar name="Alice" />

<Avatar src="https://example.com/a.png" size="large" shape="rounded" />
```

## 阴影示例

```tsx
// 使用主题阴影预设
<Avatar name="Carol" shadowSize="sm" />

// 自定义阴影覆盖
<Avatar
  name="Dave"
  shadowSize="md"
  shadowColor="#000"
  shadowOpacity={0.2}
  shadowRadius={4}
  shadowOffset={{ width: 0, height: 2 }}
/>
```

## 状态徽标与间距

```tsx
<Avatar name="Eve" status="online" m="md" />
```

## API 摘要

- `size?: 'small'|'medium'|'large'|number`（默认 `medium`）
- `shape?: 'circle'|'rounded'|'square'`
- `status?: 'online'|'offline'`
- `style?: StyleProp<ViewStyle>`（拍平为 overrides，用于 `buildBoxStyle`）
- `textStyle?: StyleProp<TextStyle>`
- `SpacingProps`（`m/p/...`）
- `BoxProps`（宽高/背景/边框/圆角）
- `ShadowProps`（预设与覆盖）
- `TestableProps`（规范化为 `Avatar-${testID}`）

## 样式与优先级

- 外部 `style` 作为 overrides；之后由 `BoxProps` 和 `ShadowProps` 覆盖其同名字段。
- 阴影样式合并在 `boxStyle` 之后，确保 `shadow*` 覆盖 overrides 中的阴影配置。
- 状态徽标贴近边角，容器采用 `position: 'relative'`，不会因裁剪而被遮挡。