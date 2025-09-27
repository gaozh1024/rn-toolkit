# Layout 组件建设清单与规范

本文件用于在 `layout` 目录中跟踪布局类组件（容器、栅格、分层、响应式等）的建设进度、统一规范与主题接入要求，便于你按清单逐步完成。

## 现状

已存在的布局组件与能力：
- 容器类
  - Container — 通用页面容器（`Container/Container.tsx`）
  - Screen — 屏幕级容器（`Screen/Screen.tsx`）
  - Section — 内容分区容器（`Section/Section.tsx`）
- 安全区
  - SafeAreaContainer / SafeAreaView / useSafeArea（`SafeAreaView/`）
- 展示容器
  - Card — 卡片容器（`Card/Card.tsx`）

这表明基础容器与安全区能力已具备，可以在此之上扩展通用布局原语、栅格与分层组件。

---

## 缺口清单（建议优先顺序）

### 优先级 1：通用布局原语（复用度最高）
- [ ] Box：通用 View 容器
  - props：padding/margin、background、border、radius、shadow、flex/fullWidth、center、style
- [ ] Flex：弹性布局容器
  - props：direction、justify、align、wrap、gap、flex/flexGrow/flexShrink/flexBasis、width/height
- [ ] HStack / VStack：水平/垂直栈式布局
  - props：gap、align、justify、divider（可选）、width/height/fullWidth
- [ ] Center：居中容器
  - props：horizontal/vertical/fullWidth/fullHeight
- [ ] Spacer：弹性/固定占位
  - props：size、flex

### 优先级 2：滚动与键盘适配
- [ ] ScrollContainer：滚动容器（封装 ScrollView）
  - props：contentPadding、horizontal、keyboardDismissMode、shows*Indicator、safeArea、contentContainerStyle
- [ ] KeyboardAvoidingContainer：键盘适配容器（封装 KeyboardAvoidingView）
  - props：behavior、keyboardVerticalOffset、safeArea
- [ ] Content：标准内容容器（Section 的轻量化版本）
  - props：padding（基于 spacing token）、background、fullWidth

### 优先级 3：栅格与响应式
- [ ] Grid / Row / Col：12 栅格（或可配置）
  - Row props：gutter（水平/垂直）、wrap、justify、align
  - Col props：span、offset、order、flexBasis（百分比）
- [ ] Wrap：自动换行容器
  - props：gap、itemMinWidth、maxRows
- [ ] Hidden / Show：响应式显示/隐藏
  - props：above/below/only（断点）、orientation
- [ ] AspectRatio：固定宽高比容器
  - props：ratio（如 16/9）

### 优先级 4：分层与定位
- [ ] ZStack / Overlay：层叠布局
  - props：align/justify、maskColor（主题）、layers（可选）、style
- [ ] Absolute / Relative：定位容器
  - props：top/right/bottom/left、zIndex、pointerEvents
- [ ] SplitView：双栏布局（Pad/桌面适配）
  - props：min/max 宽度、分隔线、拖动（后续）

### 优先级 5：列表与分隔（布局层）
- [ ] Separator / ItemSeparator：列表项分隔
  - props：orientation、thickness、inset、color（主题）
- [ ] StickyHeaderContainer：粘性头容器（后续）

---

## 统一规范（layout 专属）

1) 间距与尺寸
- 所有 padding/margin/gap 统一使用 `theme.spacing` 刻度：`xs` / `sm` / `md` / `lg` / `xl`
- 宽度优先级统一：`flex` > `fullWidth` > 自适应内容

2) 圆角与阴影
- `borderRadius` 使用 `theme.borderRadius` 刻度
- 阴影从 `theme.shadow` 预设获取，不得硬编码

3) 颜色
- 背景/边框/表面色来自 `theme.colors`：`background`、`surface`、`border`、`borderSubtle` 等
- 暗色模式下避免纯黑纯白，优先使用主题 token

4) 安全区与响应式
- 容器类组件建议提供 `safeArea` 开关，内部复用 `SafeAreaContainer`
- 断点建议：`xs` / `sm` / `md` / `lg` / `xl`，可在 theme 内补充 `breakpoints` 与 `useBreakpoint` hooks

5) 可访问性
- 仅布局语义的容器不应抢占可访问性焦点（保持 `accessible={false}` 默认）

6) 风格一致性
- 不允许硬编码颜色/半透明遮罩/尺寸，均来自主题或 size/spacing token
- 交互类（如果有 Pressable 场景）统一复用 UI 层的按压反馈封装（避免重复造轮子）

---

## 主题 Tokens 建议增补

为支撑布局组件，建议在主题中确认/增补如下 tokens：

- spacing：`xs`、`sm`、`md`、`lg`、`xl`
- borderRadius：`xs`、`sm`、`md`、`lg`、`xl`
- colors（与布局相关）：`background`、`surface`、`border`、`borderSubtle`、`overlay`（浅/深模式区分）
- shadow：`sm`、`md`、`lg`（平台差异可在内部处理）
- breakpoints：`xs`、`sm`、`md`、`lg`、`xl`（用于 Hidden/Show、Grid）

---

## 目录与导出约定

- 每个组件目录结构：
  - `Component/`
    - `Component.tsx`
    - `README.md`
    - `index.ts`（`export { default as Component } from './Component'`）
- 统一在 `src/components/layout/index.ts` 中集中导出，命名与 UI 层保持一致的风格

---

## 组件最小 API 草案（便于逐项实现）

- Box
  - props：`p`/`px`/`py`、`m`/`mx`/`my`、`bg`、`borderColor`、`borderWidth`、`radius`、`shadow`、`flex`、`fullWidth`、`center`、`style`
- Flex
  - props：`direction`、`justify`、`align`、`wrap`、`gap`、`flex`/`flexGrow`/`flexShrink`/`flexBasis`、`width`/`height`
- HStack/VStack
  - props：`gap`、`align`、`justify`、`divider?`、`width`/`height`/`fullWidth`
- Center
  - props：`horizontal`、`vertical`、`fullWidth`、`fullHeight`
- Spacer
  - props：`size`、`flex`
- ScrollContainer
  - props：`safeArea`、`contentPadding`、`horizontal`、`keyboardDismissMode`、`showsVerticalScrollIndicator`、`showsHorizontalScrollIndicator`、`style`、`contentContainerStyle`
- KeyboardAvoidingContainer
  - props：`behavior`、`keyboardVerticalOffset`、`safeArea`、`style`
- Grid/Row/Col
  - Row：`gutter`（x/y）、`wrap`、`justify`、`align`
  - Col：`span`、`offset`、`order`、`flexBasis`
- Wrap
  - props：`gap`、`itemMinWidth`、`maxRows`
- ZStack/Overlay
  - props：`align`、`justify`、`maskColor`、`style`
- AspectRatio
  - props：`ratio`

---

## 实施顺序（Roadmap）

1. 原语：Box、Flex、HStack/VStack、Center、Spacer
2. 容器：ScrollContainer、KeyboardAvoidingContainer、Content
3. 栅格与响应式：Grid/Row/Col、Wrap、AspectRatio、Hidden/Show
4. 分层与定位：ZStack/Overlay、Absolute/Relative、SplitView
5. 列表与分隔：Separator/ItemSeparator、StickyHeaderContainer（可选）

---

## 示例骨架（Box 与 HStack）

以下示例仅展示 API 形态与主题接入思路，具体实现按你现有 hooks 落地（`useTheme`/`useThemeColors`）：

```tsx
import React from 'react';
import { View, ViewStyle } from 'react-native';
import { useTheme, useThemeColors } from '../../theme';

type Spacing = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface BoxProps {
  p?: Spacing;
  px?: Spacing;
  py?: Spacing;
  m?: Spacing;
  mx?: Spacing;
  my?: Spacing;
  bg?: keyof ReturnType<typeof useThemeColors>;
  borderColor?: keyof ReturnType<typeof useThemeColors>;
  borderWidth?: number;
  radius?: keyof ReturnType<typeof useTheme>['theme']['borderRadius'];
  shadow?: keyof ReturnType<typeof useTheme>['theme']['shadow'];
  flex?: number;
  fullWidth?: boolean;
  center?: boolean;
  style?: ViewStyle;
  children?: React.ReactNode;
}

export const Box: React.FC<BoxProps> = ({
  p, px, py, m, mx, my,
  bg, borderColor, borderWidth, radius, shadow,
  flex, fullWidth, center, style, children
}) => {
  const { theme } = useTheme();
  const colors = useThemeColors();

  const spacing = theme.size; // 或 theme.spacing，按你当前主题结构调整
  const widthStyle: ViewStyle = flex != null ? { flex } : fullWidth ? { width: '100%' } : {};

  const resolved: ViewStyle = {
    backgroundColor: bg ? (colors as any)[bg] : undefined,
    borderColor: borderColor ? (colors as any)[borderColor] : undefined,
    borderWidth,
    borderRadius: radius ? (theme.borderRadius as any)[radius] : undefined,
    ...(shadow ? (theme.shadow as any)[shadow] : {}),
    padding: p ? (spacing as any)[p] : undefined,
    paddingHorizontal: px ? (spacing as any)[px] : undefined,
    paddingVertical: py ? (spacing as any)[py] : undefined,
    margin: m ? (spacing as any)[m] : undefined,
    marginHorizontal: mx ? (spacing as any)[mx] : undefined,
    marginVertical: my ? (spacing as any)[my] : undefined,
    ...(center ? { alignItems: 'center', justifyContent: 'center' } : {}),
    ...widthStyle,
  };

  return <View style={[resolved, style]}>{children}</View>;
};
```

```tsx
import React from 'react';
import { View, ViewStyle } from 'react-native';
import { useTheme } from '../../theme';

type Spacing = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type Align = 'flex-start' | 'center' | 'flex-end' | 'stretch' | 'baseline';
type Justify = 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';

export interface StackProps {
  gap?: Spacing;
  align?: Align;
  justify?: Justify;
  fullWidth?: boolean;
  style?: ViewStyle;
  children?: React.ReactNode;
}

export const HStack: React.FC<StackProps> = ({ gap = 'sm', align = 'center', justify = 'flex-start', fullWidth, style, children }) => {
  const { theme } = useTheme();
  const widthStyle: ViewStyle = fullWidth ? { width: '100%' } : {};
  const spacing = (theme.size as any)[gap] ?? 0;

  // RN 未原生支持 gap，可用在 children 周围加 margin 实现（具体实现可封装）
  const items = React.Children.toArray(children);
  const spaced = items.map((child, idx) => (
    <View key={idx} style={{ marginRight: idx < items.length - 1 ? spacing : 0 }}>
      {child}
    </View>
  ));

  return (
    <View style={[{ flexDirection: 'row', alignItems: align, justifyContent: justify }, widthStyle, style]}>
      {spaced}
    </View>
  );
};

export const VStack: React.FC<StackProps> = ({ gap = 'sm', align = 'flex-start', justify = 'flex-start', fullWidth, style, children }) => {
  const { theme } = useTheme();
  const widthStyle: ViewStyle = fullWidth ? { width: '100%' } : {};
  const spacing = (theme.size as any)[gap] ?? 0;

  const items = React.Children.toArray(children);
  const spaced = items.map((child, idx) => (
    <View key={idx} style={{ marginBottom: idx < items.length - 1 ? spacing : 0 }}>
      {child}
    </View>
  ));

  return (
    <View style={[{ flexDirection: 'column', alignItems: align, justifyContent: justify }, widthStyle, style]}>
      {spaced}
    </View>
  );
};
```

---

## 验收标准（Definition of Done）

- 不出现硬编码颜色/阴影/尺寸，全部来自主题 tokens
- 统一宽度策略（`flex` > `fullWidth` > 自适应）
- 支持亮/暗主题切换（背景/分隔/遮罩等）
- README 与示例齐全，导出已接入 `src/components/layout/index.ts`
- 与 SafeArea、栅格、分层等组件组合良好，交互一致，无明显布局抖动