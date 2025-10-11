# IconButton（图标按钮）

仅呈现图标的按钮，用于轻量的可点击操作（例如收藏、分享、返回等）。

## 特性
- 图标：`name`/`type`（兼容 Ionicons 与自定义库）
- 样式：`variant`（`filled`/`ghost`/`outline`）
- 状态：`disabled`（禁用时自动降低不透明度与禁用点击）
- 尺寸与颜色：`size`（图标像素大小）、`color`（支持主题色与自定义色值）
- 主题接入：圆角、间距、边框与表面色来源于主题 tokens

## 用法
```tsx
import { IconButton } from '@gaozh1024/rn-toolkit';

// 轻量操作：默认 ghost 变体
<IconButton name="heart-outline" onPress={() => {}} />

// 填充背景（filled）
<IconButton name="share-outline" variant="filled" />

// 描边（outline）
<IconButton name="arrow-back" variant="outline" />

// 自定义图标大小与颜色（主题色名或色值）
<IconButton name="star" size={24} color="primary" />

// 禁用态
<IconButton name="trash" disabled />
```

## Props
- `name`: 图标名称（必填）
- `type`: 图标库类型，默认 `'ionicons'`；支持通过 `Icon.registerIconLibrary` 注册的自定义库
- `size`: 图标像素大小，默认 `20`
- `color`: 主题色名或自定义色值；禁用态自动使用 `textDisabled`
- `variant`: `'filled' | 'ghost' | 'outline'`，默认 `'ghost'`
- `disabled`: 是否禁用
- `onPress`: 点击事件
- `style`: 容器样式（背景/边框/圆角等已按变体处理）
- `hitSlop`: 扩大点击区域
- `accessibilityLabel`: 无障碍标签
- `testID`: 测试标识

## 主题说明
- 圆角：`theme.borderRadius.md`
- 间距：`theme.spacing.xs`
- 颜色：
  - `filled` 背景：`colors.surface`
  - `outline` 边框：`colors.border`
  - 文本/图标颜色：传入 `color`（如 `primary`/`text`），禁用态为 `textDisabled`

## 最佳实践
- 交互面积建议不小于 `40x40`，组件已通过内边距保证可点击性
- 与 `Icon` 搭配使用：图标库注册与主题色支持可复用 `Icon` 的能力
- 对频繁出现的次级操作使用 `ghost`；强调操作使用 `filled` 或 `outline`