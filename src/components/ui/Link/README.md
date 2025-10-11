# Link（链接）

用于展示可点击的链接文本，支持跳转与自定义样式。

## 特性
- 点击交互：`onPress` 回调
- 跳转：`href`（使用 React Native `Linking` 打开）
- 样式：`underline` 是否下划线、`color` 颜色
- 状态：`disabled` 禁用点击并降低不透明度
- 无障碍：`accessibilityRole="link"`、`accessibilityLabel`

## 用法
```tsx
import { Link } from '@gaozh1024/rn-toolkit';

function Examples() {
  return (
    <>
      {/* 基础：下划线 + 主色 */}
      <Link href="https://example.com">访问官网</Link>

      {/* 自定义颜色与回调 */}
      <Link color="#10B981" onPress={() => console.log('Pressed!')}>
        绿色链接
      </Link>

      {/* 禁用态 */}
      <Link href="https://example.com" disabled>
        不可点击的链接
      </Link>

      {/* 去掉下划线 */}
      <Link underline={false} href="mailto:support@example.com">
        联系我们
      </Link>
    </>
  );
}
```

## Props
- `label`: 显示文本（可选，默认使用 `children`）
- `children`: 文本或自定义节点
- `href`: 跳转地址（支持 `http/https/mailto/tel` 等）
- `onPress`: 点击回调（若同时提供，将先调用回调再尝试跳转）
- `underline`: 是否显示下划线，默认 `true`
- `color`: 颜色（可传主题颜色名或 `#RRGGBB`/命名色）
- `disabled`: 禁用态，默认 `false`
- `style`: 文本样式（应用到内部 `Text`）
- `accessibilityLabel`: 无障碍标签
- `numberOfLines`: 文本行数限制
- `hitSlop`: 扩大点击区域
- `testID`: 测试标识

## 主题说明
- 颜色来源：`colors[color]`，未命中时回退主色 `colors.primary`
- 字体与排版：复用内部 `Text` 组件的 `variant` 等排版能力

## 最佳实践
- 对外链接优先使用 `https`，并处理潜在异常
- 在可点击列表中使用 `hitSlop` 提升可触达性
- 禁用态用于不可交互或加载中场景