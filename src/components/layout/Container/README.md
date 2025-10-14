# Container 容器

通用页面/区域容器，集成背景控制（BackgroundProps）、间距（SpacingProps）、测试标识（TestableProps），支持可滚动内容与点击空白处收起键盘。

## 导入

```ts
import { Container } from '@gaozh1024/rn-toolkit';
```

## 快速上手

```tsx
import React from 'react';
import { Text } from 'react-native';
import { Container } from '@gaozh1024/rn-toolkit';

export const BasicContainer = () => (
  <Container p={16} m={12}>
    <Text>基础容器</Text>
  </Container>
);
```

## 场景示例

- 可滚动内容（自动将 padding 迁移到 `contentContainerStyle`）

```tsx
<Container scrollable p={16} testID="container-scroll">
  {/* 长列表或内容 */}
</Container>
```

- 透明背景（覆盖页面渐变等场景）

```tsx
<Container transparent p={16}>
  {/* 内容层 */}
</Container>
```

- 指定背景色（优先于主题背景）

```tsx
<Container backgroundColor="#FAFAFA" p={16} m={8}>
  {/* 内容层 */}
</Container>
```

- 点击空白处收起键盘

```tsx
<Container dismissKeyboardOnTapOutside p={16}>
  {/* 表单元素等 */}
</Container>
```

## Props（整合说明）

- 核心
  - `children`: 容器内容
  - `style?: StyleProp<ViewStyle>`: 外部样式（会被拍平参与合并）

- 背景（BackgroundProps）
  - `backgroundColor?: string`: 背景色（优先级高于主题默认色）
  - `transparent?: boolean`: 背景透明（优先于 `backgroundColor`）

- 间距（SpacingProps）
  - 支持 `p/pv/ph/pt/pb/pl/pr` 与 `m/mv/mh/mt/mb/ml/mr` 等键
  - 使用主题间距映射（如 `md`、`lg`），也支持直接传 `number`

- 测试（TestableProps）
  - `testID?: string`: 测试标识符（内部会标准化命名）

- 行为
  - `scrollable?: boolean`: 使用 `ScrollView` 承载内容
  - `scrollViewProps?: React.ComponentProps<typeof ScrollView>`: 透传 `ScrollView` 属性
  - `dismissKeyboardOnTapOutside?: boolean`: 点击空白区域收起键盘

## 样式与合并规则

- 背景与外边距来自“单独属性”（BackgroundProps/SpacingProps），优先级高于外部 `style` 中同名字段。
- 非滚动模式：样式数组顺序为 `[style, baseContainerStyle, paddingOnly]`，避免外部样式反向覆盖。
- 滚动模式：会从外部 `style` 剥离 `padding` 并迁移到 `contentContainerStyle`；合并为
  - `style`: `[styleWithoutPadding, baseContainerStyle]`
  - `contentContainerStyle`: `paddingOnly`（再叠加来自 `style` 的 padding 字段）
- 建议通过 Props 指定背景与间距（而非通过 `style`），以获得最优的主题一致性与优先级控制。

## 设计与主题

- 默认背景来自 `theme.colors.background`。
- 间距来自主题 `spacing`，支持语义尺寸（如 `md`、`lg`）；也可用数值。
- 与页面/卡片的渐变背景配合时，建议将容器设置为 `transparent`，让背景层透出。

## 注意事项

- 当 `scrollable` 为 `true` 时，`style` 内的 `padding*` 将不会作用在外层，而是被迁移到 `contentContainerStyle`。
- 使用 `transparent` 将强制背景透明；若同时传 `backgroundColor`，透明优先。
- `dismissKeyboardOnTapOutside` 会在非滚动模式下使用 `TouchableWithoutFeedback` 包裹，避免影响子元素交互。
