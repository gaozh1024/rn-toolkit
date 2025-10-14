# Button（按钮）

- 支持多变体/尺寸/形状、图标/加载态、渐变背景与全宽/弹性布局。
- 已接入公共能力：
  - 间距：`SpacingProps`
  - 盒子：`BoxProps`
  - 阴影：`ShadowProps`
  - 测试：`TestableProps`
  - 事件：`PressEvents`
  - 渐变：`GradientProps`（归一化：`normalizeGradientConfig`）
- 样式合并规则：外部 `style` 拍平为 overrides；随后由单独属性覆盖同名字段。

## 渐变用法

```tsx
// 启用渐变（使用主题/颜色回退）
<Button
  title="渐变按钮"
  gradientEnabled
  gradientVariant="linear"
  gradientOpacity={0.9}
/>

// 自定义渐变
<Button
  title="自定义渐变"
  gradientEnabled
  gradientColors={['#4C9AFF', '#66E3FF']}
  gradientLocations={[0, 1]}
  gradientAngle={90}
/>
```

- 渐变配置通过 `normalizeGradientConfig(baseColors, props)` 归一化；当 `gradientEnabled` 且有效 `colors` 存在时渲染渐变层。
- `baseColors` 默认取自 `color` 或主题主/次色，确保无显式配置时也有合理回退。

## 基本用法

```tsx
<Button title="提交" variant="primary" />

<Button title="更多" variant="secondary" size="small" />

<Button title="删除" variant="outline" color="error" />

<Button title="纯文本" variant="text" />
```

## 图标与加载

```tsx
<Button title="同步" icon={<SyncIcon />} iconPosition="left" />

<Button title="加载中" loading />
```

## 阴影与盒子

```tsx
<Button
  title="带阴影"
  shadowSize="sm"
  borderRadius={12}
  borderWidth={1}
  borderColor="#EEE"
/>
```

## 渐变背景

```tsx
<Button
  title="渐变按钮"
  gradientEnabled
  gradientVariant="linear"
  gradientColors={['#4C9AFF', '#66E3FF']}
  gradientOpacity={0.9}
/>
```

## 尺寸与布局

```tsx
<Button title="全宽" fullWidth />

<Button title="弹性" flex />
```

## 间距示例

```tsx
<Button title="间距" mt="md" mh="lg" />
```

## API 摘要

- `variant?: 'primary'|'secondary'|'outline'|'text'`
- `size?: 'small'|'medium'|'large'`
- `shape?: 'rounded'|'square'|'circle'`
- `color?: 'primary'|'secondary'|'success'|'warning'|'error'|'info'|string`
- `title?: string` / `children?: React.ReactNode`
- `icon?: React.ReactNode` / `iconPosition?: 'left'|'right'`
- `disabled?: boolean` / `loading?: boolean` / `bold?: boolean`
- `fullWidth?: boolean` / `flex?: boolean`
- `style?: StyleProp<ViewStyle>`（拍平为 overrides，用于 `buildBoxStyle`）
- `textStyle?: StyleProp<TextStyle>`
- `gradientEnabled?: boolean` 及一组渐变配置（`variant/colors/locations/angle/start/end/center/radius/opacity`）
- `SpacingProps` / `BoxProps` / `ShadowProps` / `TestableProps` / `PressEvents`

## 样式与优先级

- 外部 `style` 仅作为 overrides；随后由 `BoxProps` 与本地策略（变体/形状）覆盖同名字段。
- 若显式传入 `borderRadius/borderWidth/borderColor/backgroundColor`（来自 `BoxProps`），这些值优先于变体默认。
- 渐变启用时容器使用绝对填充的背景层，圆角取最终合并后的最大角，避免边角不一致。

## 注意事项

- `flex/fullWidth` 控制宽度策略，`shape='circle'` 将以高度为直径并清除横向内边距。
- 事件处理统一通过 `PressEvents`；高亮容器的 `underlayColor` 在未提供时按主题色回退。
