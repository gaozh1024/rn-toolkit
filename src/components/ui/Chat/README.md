# ChatBubble

一个轻量聊天气泡组件，支持可选头像、气泡下方左侧按钮组与右侧文字。

## 导入

```ts
import { ChatBubble } from 'src/components/ui';
// 或顶层聚合：
// import { ChatBubble } from 'src/components';
```

> 顶层 `src/components/index.ts` 已 `export * from './ui'`，因此可从 `src/components` 直接导入。

## 已接入的公共能力

- 间距：`SpacingProps`（`m/mv/mh/p/pv/ph/mt/...`，作用于组件外层容器）
- 测试：`TestableProps`（`testID`，内部规范化为 `ChatBubble-${你的ID}`）
- 盒子：`BoxProps`（宽高、背景、边框统一处理，可覆盖默认气泡外观）

## Props

- `text?: string`：气泡内文本；与 `children` 二选一。
- `children?: React.ReactNode`：自定义气泡内容。
- `showAvatar?: boolean`：是否显示头像，默认 `false`。
- `avatarUri?: string`：头像图片地址。
- `avatarNode?: React.ReactNode`：自定义头像节点（优先于 `avatarUri`）。
- `align?: 'left' | 'right'`：消息方向，默认 `'left'`；`'right'` 表示自己消息。
- `leftActions?: (React.ReactNode | { label: string; onPress?: () => void })[]`：气泡下方左侧的按钮/节点；字符串与数字将按纯文本渲染。
- `rightFooterText?: string | React.ReactNode`：气泡下方右侧的文字或节点。
- `bubbleStyle?: StyleProp<ViewStyle>`：气泡容器样式（在统一样式构建之后叠加）。
- `textStyle?: StyleProp<TextStyle>`：气泡内文字样式。
- `footerTextStyle?: StyleProp<TextStyle>`：底部右侧文字样式。
- `style?: StyleProp<ViewStyle>`：组件最外层样式。
- `maxBubbleWidth?: DimensionValue`：气泡列最大宽度（默认 `'80%'`）。
- `avatarVerticalAlign?: 'top' | 'bottom'`：头像垂直对齐（默认 `'bottom'`）。
- `bubbleRadius?: number`：气泡圆角半径（默认取 `theme.borderRadius.lg`）。
- `squareCornerNearAvatar?: boolean`：显示头像时，靠近头像的角设为直角。
- `squareCorners?: { topLeft?; topRight?; bottomLeft?; bottomRight? }`：独立控制四角直角。
- `footerPlacement?: 'inside' | 'outside'`：底部内容位置（默认 `'outside'`）。
- 公共：`SpacingProps` / `TestableProps` / `BoxProps`

> 变更说明：移除了重复的 `testID` 独立声明，改由 `TestableProps` 提供并统一规范化。

## 主题适配

- 右侧（自己）消息默认 `backgroundColor=colors.primary`，文字为白色。
- 左侧（对方）消息默认使用 `theme.button.secondary.backgroundColor` 或兜底颜色。
- 以上默认外观可通过 `BoxProps` 完全覆盖，如 `backgroundColor/borderColor/borderWidth/borderRadius/...`。

## 基础用法

```tsx
<ChatBubble text="你好！这是一个示例消息" />

<ChatBubble align="right" text="这是我发送的消息" />
```

## 间距与测试

```tsx
<ChatBubble text="带外层间距与测试ID" m="sm" testID="hello" />
// 实际 testID 为：ChatBubble-hello
```

## 头像与按钮组

```tsx
<ChatBubble
  showAvatar
  avatarUri="https://example.com/avatar.jpg"
  text="支持头像和底部按钮组"
  leftActions={[
    { label: '复制', onPress: () => console.log('复制') },
    { label: '转发', onPress: () => console.log('转发') },
    '更多',
  ]}
  rightFooterText="下午 3:45"
/>
```

## 自定义内容与盒子样式

```tsx
<ChatBubble
  align="right"
  text="可用 BoxProps 控制边框与圆角"
  borderWidth={1}
  borderColor="#DDD"
  borderRadius={12}
  p="md"
  mh="sm"
/>

<ChatBubble align="right">
  <View>
    <Text>自定义内容块</Text>
    <Text style={{ opacity: 0.7 }}>副标题或补充说明</Text>
  </View>
</ChatBubble>
```

## 样式自定义

```tsx
<ChatBubble
  text="可自定义气泡与文字样式"
  bubbleStyle={{ backgroundColor: '#EEF4FF', borderRadius: 20 }}
  textStyle={{ color: '#1E3A8A', fontSize: 15 }}
  footerTextStyle={{ color: '#6B7280' }}
/>
```

## 注意事项

- `leftActions` 既支持对象（带 `label/onPress`）也支持任意 `ReactNode`（如图标、定制按钮、字符串/数字）。
- 当传入 `avatarNode` 时优先显示该节点；否则 fallback 到 `avatarUri` 与占位头像。
- 组件会根据 `align` 与主题自动调整默认配色；如需覆盖，请使用 `BoxProps` 或 `bubbleStyle`。
