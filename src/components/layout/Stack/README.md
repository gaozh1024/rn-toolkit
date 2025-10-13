# Stack 堆叠布局

轻量级布局原语：在容器上统一设置 `flexDirection` 与 `gap`，支持对齐、换行、分隔符等。适合替代零散的 `View` + `flexDirection` + `margin` 组合，实现一致的间距与对齐策略。

## 导入
```ts
import { Stack } from '@gaozh1024/rn-toolkit';
// 或按需：src/components/layout/Stack/index.ts
```

## 基本用法

### 横向排列（居中对齐、8 间距）
```tsx
<Stack direction="row" align="center" gap={8}>
  <Chip label="A" />
  <Chip label="B" />
  <Chip label="C" />
</Stack>
```

### 纵向排列（12 间距，拉伸对齐）
```tsx
<Stack direction="column" gap={12}>
  <Section title="标题">...</Section>
  <Section title="更多">...</Section>
</Stack>
```

### 带分隔符（在子元素之间插入分隔节点）
```tsx
<Stack
  direction="row"
  divider={<View style={{ width: 1, height: 16, backgroundColor: '#E5E6EB' }} />}
>
  <Text>左</Text>
  <Text>中</Text>
  <Text>右</Text>
</Stack>
```

### 自动换行与占满尺寸
```tsx
<Stack direction="row" wrap="wrap" gap={8} fullWidth>
  {/* 标签列表等可自动换行 */}
  {items.map(i => <Chip key={i.id} label={i.name} />)}
</Stack>

<Stack direction="column" fullHeight gap={12}>
  {/* 占满可用高度，内部再用 flex 控制子项 */}
  <Section title="内容" />
  <Section title="更多" />
</Stack>
```

## API
```ts
interface StackProps {
  children: React.ReactNode;
  direction?: 'row' | 'column';
  gap?: number;                       // 子项间距（使用 RN 的 gap）
  align?: ViewStyle['alignItems'];    // 交叉轴对齐：'flex-start'|'center'|'flex-end'|'stretch' 等
  justify?: ViewStyle['justifyContent']; // 主轴分布：'flex-start'|'center'|'space-between' 等
  wrap?: ViewStyle['flexWrap'];       // 是否换行：'nowrap'|'wrap'
  style?: StyleProp<ViewStyle];
  flex?: number;                      // 容器 flex 值
  fullWidth?: boolean;                // 容器宽度 100%
  fullHeight?: boolean;               // 容器高度 100%
  divider?: React.ReactNode;          // 分隔符：存在时在子元素之间插入
  testID?: string;
}
```

## 设计与最佳实践
- 优先使用 `gap` 控制间距，避免在子项上混用 `margin` 导致不一致。
- 需要可视分隔时使用 `divider`，否则仅用 `gap` 保持简洁。
- `align="stretch"` 可让子项在交叉轴拉伸，适合纵向表单分区。
- 列表/标签云等场景启用 `wrap="wrap"`，并结合 `gap` 控制行内/跨行的统一间距。
- 全局尺寸占满场景可结合 `flex`、`fullWidth`、`fullHeight`，与父容器的布局策略保持一致。