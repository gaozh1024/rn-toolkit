# AvatarGroup（头像组）

- 功能点：`items`（数组：`src/name/status`）、`size`、`shape`、`max`、`overlap`。
- 超出 `max` 显示 `+N` 聚合。
- 已接入公共能力：
  - 间距：`SpacingProps`（`m/mv/mh/p/pv/ph/mt/...`）
  - 盒子：`BoxProps`（`width/height/min/max/backgroundColor/transparent/borderColor/borderWidth/borderRadius`）
  - 测试：`TestableProps`（`testID`，内部使用 `buildTestID('AvatarGroup', testID)` 规范化）

## 快速上手

```tsx
<AvatarGroup
  items={[
    { src: 'https://example.com/a1.png', name: 'Alice', status: 'online' },
    { name: 'Bob' },
    { name: 'Carol' },
    { name: 'Dave' },
  ]}
/>
```

```tsx
<AvatarGroup
  items={[{ name: 'Alice' }, { name: 'Bob' }, { name: 'Carol' }, { name: 'Dave' }]}
  size="small"
  shape="rounded"
  max={3}
/>
```

## 间距与盒子示例

```tsx
<AvatarGroup
  items={[{ name: 'Alice' }, { name: 'Bob' }, { name: 'Carol' }, { name: 'Dave' }]}
  // 间距（SpacingProps）
  m="md"
  ph="sm"
  // 盒子（BoxProps）
  backgroundColor="#F7F7F8"
  borderRadius={12}
  borderWidth={1}
  borderColor="#E6E6EA"
/>
```

```tsx
// 使用数字控制头像尺寸与重叠
<AvatarGroup
  items={[{ name: 'Alice' }, { name: 'Bob' }, { name: 'Carol' }, { name: 'Dave' }]}
  size={40}
  overlap={14}
/>
```

## 测试标识

- 传入 `testID`，内部会统一为 `AvatarGroup-${testID}`：
```tsx
<AvatarGroup items={[{ name: 'Alice' }]} testID="team" />
// 渲染时实际 testID: "AvatarGroup-team"
```

## API

- `items: { src?: string; name?: string; status?: 'online'|'offline' }[]`
- `size?: 'small'|'medium'|'large'|number`（默认 `medium`；数字表示像素）
- `shape?: 'circle'|'rounded'|'square'`（默认 `circle`）
- `max?: number` 可见数量上限；超出显示 `+N`
- `overlap?: number` 头像间重叠像素；默认按尺寸约 35% 计算
- `textStyle?: TextStyle | TextStyle[]` 传递给单个头像文本
- `style?: ViewStyle | ViewStyle[]` 外部样式（将被拍平为 overrides，用于 `buildBoxStyle`）
- `SpacingProps`（`m/mv/mh/p/pv/ph/mt/mb/ml/mr/pt/pb/pl/pr`）
- `BoxProps`（`width/height/minWidth/minHeight/maxWidth/maxHeight/backgroundColor/transparent/borderColor/borderWidth/borderRadius`）
- `TestableProps`（`testID?: string`，内部规范化为 `AvatarGroup-${testID}`）

## 样式合并与优先级

- 外部 `style` 会被拍平为 `overrides`，之后由单独属性（`BoxProps`/`SpacingProps`）进行覆盖。
- 间距（`SpacingProps`）中同名字段（如 `margin/padding`）优先于外部 `style` 的对应字段。
- 容器布局固定为 `row + alignItems: 'center'`，确保水平堆叠与居中。
- `+N` 聚合项的背景与边框采用主题色（`theme.colors.card/border`），圆角与头像 `shape` 保持一致。

## 行为说明

- 尺寸计算：`size` 为数字时直接使用像素；为枚举时：
  - `small=28`、`medium=36`、`large=44`
- 重叠计算：`overlap` 未设置时，默认约为头像尺寸的 `35%`。
- `+N` 聚合气泡：
  - `shape='circle'` 时使用圆形；`rounded` 使用 `theme.borderRadius.md`；`square` 不加圆角。
  - 文本字号按尺寸自适应，字体加粗，颜色跟随主题 `colors.text`。

## 注意事项

- 容器默认背景为 `transparent`；需要卡片式底色时，请通过 `backgroundColor` 设置或外层包裹卡片容器。
- 如需控制外部间距，优先使用 `SpacingProps`（`m/p/...`），避免直接把 `margin/padding` 写在 `style` 中影响优先级。
- `textStyle` 仅影响单个头像文字（例如首字母），不作用于 `+N` 聚合的文本样式。