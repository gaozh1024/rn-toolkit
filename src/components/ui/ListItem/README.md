# ListItem（列表项）

用于展示标题/描述等内容，支持左右插槽与点击交互。

## 特性
- 标题/描述：`title`、`description`（字符串或自定义节点）
- 插槽：`left`/`right` 可放头像、图标、开关等
- 交互与状态：`onPress`、`disabled`、`selected`
- 主题接入：圆角、间距、边框/背景来源主题 tokens

## 用法
```tsx
import { ListItem, Avatar, IconButton, Switch } from '@gaozh1024/rn-toolkit';

function Example() {
  const [enabled, setEnabled] = React.useState(false);
  return (
    <>
      {/* 头像 + 文本 + 右侧操作 */}
      <ListItem
        title="张三"
        description="产品经理"
        left={<Avatar name="张三" />}
        right={<IconButton name="chevron-forward" />}
        onPress={() => {}}
        selected
      />

      {/* 图标 + 文本 + 开关 */}
      <ListItem
        title="通知提醒"
        description="接收应用消息通知"
        left={<IconButton name="notifications-outline" />}
        right={<Switch value={enabled} onValueChange={setEnabled} />}
      />
    </>
  );
}
```

## Props
- `title`: `string | ReactNode`
- `description`: `string | ReactNode`
- `left`: `ReactNode`（如 `Avatar`/`IconButton`/`Switch`）
- `right`: `ReactNode`（同上）
- `onPress`: 点击回调
- `disabled`: 禁用态
- `selected`: 选中态（背景与边框高亮）
- `style`: 容器样式
- `contentStyle`: 中间内容区域样式（title/description 包裹层）
- `titleStyle`: 标题文本样式
- `descriptionStyle`: 描述文本样式
- `accessibilityLabel`: 无障碍标签
- `hitSlop`: 扩大点击区域
- `testID`: 测试标识

## 主题说明
- 圆角：`theme.borderRadius.md`
- 间距：`theme.spacing.sm/md`
- 边框：`colors.border`，选中态使用 `colors.primary` 高亮
- 背景：选中态使用 `colors.surface`

## 最佳实践
- 左右插槽尺寸建议与 `minHeight` 对齐，保证点击区域充足
- 标题使用 `body1` + `semibold`，描述使用 `body2` + `textSecondary`
- 对可点击项设置 `onPress` 与合理的 `accessibilityLabel`