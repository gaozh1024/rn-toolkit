# Stack 堆叠布局

轻量级布局原语：在容器上统一设置 `flexDirection` 与 `gap`，支持对齐、换行、分隔符等。适合替代零散的 `View` + `flexDirection` + `margin` 组合，实现一致的间距与对齐策略。

## 公共能力

- 间距（SpacingProps）：`m/mv/mh/mt/mb/ml/mr` 与 `p/pv/ph/pt/pb/pl/pr`，统一用主题 `spacing` 或数值
- 测试（TestableProps）：`testID` 内部通过 `buildTestID('Stack', testID)` 规范化

## 导入

```ts
import { Stack } from '@gaozh1024/rn-toolkit';
// 或按需：src/components/layout/Stack/index.ts
```

## 基本用法

### 横向排列（居中对齐、8 间距）

```tsx
<Stack direction="row" align="center" gap={8} mt="sm" testID="actions">
  <Chip label="A" />
  <Chip label="B" />
</Stack>
```

说明：

- `testID="actions"` 会标准化为 `Stack-actions`。
- 间距使用统一语义键或数值，不需手动映射。

## API

```ts
interface StackProps extends SpacingProps, TestableProps {
  children: React.ReactNode;
  direction?: 'row' | 'column';
  gap?: number;
  align?: ViewStyle['alignItems'];
  justify?: ViewStyle['justifyContent'];
  wrap?: ViewStyle['flexWrap'];
  style?: StyleProp<ViewStyle>;
  flex?: number;
  fullWidth?: boolean;
  fullHeight?: boolean;
  divider?: React.ReactNode;
}
```

## 设计与最佳实践

- 优先使用 `gap` 控制间距，避免在子项上混用 `margin`
- 需要可视分隔时使用 `divider`，否则仅用 `gap` 保持简洁
- `align="stretch"` 可让子项在交叉轴拉伸，适合纵向表单分区
- 列表/标签云等场景启用 `wrap="wrap"` 并结合 `gap` 控制行内/跨行的统一间距
- 全局尺寸占满场景可结合 `flex`、`fullWidth`、`fullHeight`，与父容器的布局策略保持一致。
