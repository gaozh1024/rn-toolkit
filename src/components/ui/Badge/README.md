# Badge（徽标）

- 支持数值/文本与小红点模式，角标定位与偏移，尺寸与主题色。
- 已接入公共能力：
  - 间距：`SpacingProps`（`m/mv/mh/p/pv/ph/mt/...`）
  - 盒子：`BoxProps`（`width/height/min/max/backgroundColor/transparent/borderColor/borderWidth/borderRadius`）
  - 阴影：`ShadowProps`（`shadowSize/shadowColor/shadowOffset/shadowOpacity/shadowRadius`）
  - 测试：`TestableProps`（`testID`，内部 `buildTestID('Badge', testID)` 规范化）
- 样式合并规则：外部 `style` 作为 overrides；随后由单独属性覆盖同名字段。

## 基本用法

```tsx
// 纯徽标
<Badge value={12} />

// 文本模式
<Badge text="NEW" variant="outline" color="secondary" />

// 小红点
<Badge dot color="error" />
```

## 角标附着

```tsx
// 作为角标附着在子元素上
<Badge value={9} position="top-right">
  <Avatar name="Alice" />
</Badge>

// 调整偏移
<Badge value={9} position="bottom-left" offset={{ x: 4, y: 2 }}>
  <Avatar name="Bob" />
</Badge>
```

## 间距/盒子/阴影

```tsx
<Badge
  value={99}
  max={99}
  // 间距（SpacingProps）
  ml="md"
  // 盒子（BoxProps）
  borderRadius={12}
  borderWidth={1}
  borderColor="#ECECEC"
  // 阴影（ShadowProps）
  shadowSize="sm"
/>
```

## API

- `text?: string` 文本内容（非 dot 模式）
- `value?: number | string` 数值/文本；`max` 限制展示上限（超出显示 `max+`）
- `max?: number` 展示上限
- `dot?: boolean` 小红点模式
- `variant?: 'solid'|'outline'` 背景/边框样式
- `color?: 'primary'|'secondary'|'success'|'warning'|'error'|'info'|string` 主题或自定义颜色
- `size?: 'small'|'medium'|'large'|number` 徽标尺寸（数字为像素）
- `position?: 'top-right'|'top-left'|'bottom-right'|'bottom-left'` 角标位置（有 `children` 时生效）
- `offset?: { x?: number; y?: number }` 角标偏移
- `children?: React.ReactNode` 作为角标附着目标
- `showZero?: boolean` 是否显示 0
- `style?: StyleProp<ViewStyle>` 徽标样式（拍平为 overrides，用于 `buildBoxStyle`）
- `containerStyle?: StyleProp<ViewStyle>` 包裹子元素的容器样式
- `textStyle?: StyleProp<TextStyle>` 文本样式
- `SpacingProps`
- `BoxProps`
- `ShadowProps`
- `TestableProps`（内部规范化为 `Badge-${testID}`）

## 样式与优先级

- 默认背景色依据 `variant`：`solid` 使用 `color`，`outline` 为 `transparent`。
- 外部 `style` 被拍平为 overrides，随后由单独属性覆盖（例如传入 `borderWidth/borderRadius`、`backgroundColor` 等）。
- 有 `children` 时，间距应用在外层容器；无 `children` 时，间距应用在徽标自身。

## 注意事项

- `value/max/showZero` 共同决定展示文本；`dot` 模式不展示文字。
- 作为角标时，外层容器固定为 `position: 'relative'`，角标使用绝对定位。
- 若主题未配置阴影预设，`shadowSize` 等将静默忽略。
