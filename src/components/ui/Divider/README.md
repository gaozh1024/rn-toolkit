# Divider（分割线）

- 功能点：`orientation`、`color`、`thickness`、`inset`。
- 主题接入：默认色使用 `theme.colors.divider`；支持传入主题颜色键（如 `primary`/`border`）或自定义颜色值（如 `#RRGGBB`、`rgba()`）。

## 基本用法
```tsx
// 横向分割线（全宽）
<Divider />

// 自定义颜色与厚度
<Divider color="primary" thickness={2} />

// 横向起始偏移（主轴起点偏移 16）
<Divider inset={16} />

// 横向两端偏移
<Divider inset={{ start: 16, end: 16 }} />

// 纵向分割线（放在行布局中）
<View style={{ flexDirection: 'row', alignItems: 'center' }}>
  <Text>左侧</Text>
  <Divider orientation="vertical" thickness={1} inset={{ start: 8, end: 8 }} />
  <Text>右侧</Text>
</View>
```

## API
- `orientation?: 'horizontal' | 'vertical'` 默认 `horizontal`。
- `color?: ThemeColorKey | string` 默认 `divider`；支持主题键或自定义色值。
- `thickness?: number` 线条厚度，默认 `1`。
- `inset?: number | { start?: number; end?: number }` 主轴方向起止偏移，横向映射 `marginLeft/marginRight`，纵向映射 `marginTop/marginBottom`。
- `style?: ViewStyle | ViewStyle[]` 自定义样式。

## 主题说明
- 颜色来源：`theme.colors.divider`（参见主题类型定义：<mcfile name="types.ts" path="/Users/gzh/Projects/framework/rn-toolkit/src/theme/types.ts"></mcfile>）。
- 建议与 `styles.layout.row`/`styles.layout.column` 组合使用（参见：<mcfile name="hooks.ts" path="/Users/gzh/Projects/framework/rn-toolkit/src/theme/hooks.ts"></mcfile>）。