# ChatBubble

一个轻量聊天气泡组件，支持可选头像、气泡下方左侧按钮组与右侧文字。

## 导入

```ts
import { ChatBubble } from 'src/components/ui';
// 或顶层聚合：
// import { ChatBubble } from 'src/components';
```

> 顶层 `src/components/index.ts` 已 `export * from './ui'`，因此可从 `src/components` 直接导入。

## Props

- `text?: string`：气泡内文本；与 `children` 二选一。
- `children?: React.ReactNode`：自定义气泡内容。
- `showAvatar?: boolean`：是否显示头像，默认 `false`。
- `avatarUri?: string`：头像图片地址。
- `avatarNode?: React.ReactNode`：自定义头像节点（优先于 `avatarUri`）。
- `align?: 'left' | 'right'`：消息方向，默认 `'left'`；`'right'` 表示自己消息。
- `leftActions?: (React.ReactNode | { label: string; onPress?: () => void })[]`：气泡下方左侧的按钮/节点；字符串与数字将按纯文本渲染。
- `rightFooterText?: string | React.ReactNode`：气泡下方右侧的文字或节点。
- `bubbleStyle?: StyleProp<ViewStyle>`：气泡容器样式。
- `textStyle?: StyleProp<TextStyle>`：气泡内文字样式。
- `footerTextStyle?: StyleProp<TextStyle>`：底部右侧文字样式。
- `style?: StyleProp<ViewStyle>`：组件最外层样式。
- `testID?: string`：测试标识。

## 主题适配
- 右侧（自己）消息默认使用主题 `colors.primary` 作为气泡背景，文字为白色。
- 左侧（对方）消息在浅色/深色主题下自动切换背景与文字颜色，遵循 `theme.button.secondary.backgroundColor` 或兜底颜色。

## 基础用法

```tsx
<ChatBubble text="你好！这是一个示例消息" />

<ChatBubble align="right" text="这是我发送的消息" />
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

## 自定义内容

```tsx
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
- `leftActions` 内既支持对象（带 `label`/`onPress`）也支持任意 `ReactNode`（如图标、定制按钮、字符串/数字）。
- 当传入 `avatarNode` 时会优先使用该节点显示头像；否则 fallback 到 `avatarUri` 与占位头像。
- 组件会根据 `align` 与主题自动调整默认配色，可通过 `bubbleStyle`/`textStyle` 覆盖。