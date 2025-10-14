# Text 文本组件

一个功能丰富的文本组件，支持多种文本样式、主题集成和自定义配置。

## 特性

- 🎨 多种文本变体
- 🌈 主题集成
- 📏 灵活的尺寸
- 🎯 丰富的样式选项
- 📱 响应式
- ♿ 无障碍支持
- 🧩 公共能力：间距（SpacingProps）、背景（BackgroundProps）、测试标识（TestableProps）

## 公共能力

- `SpacingProps`：`m/mv/mh/mt/...` 与 `p/pv/ph/...`，使用主题 `spacing` 刻度或数值像素
- `BackgroundProps`：`backgroundColor` 与 `transparent`，默认透明，按需覆盖
- `TestableProps`：支持 `testID`；组件内部通过 `buildTestID('Text', testID)` 规范化标识

## 基础用法

```tsx
import { Text } from 'rn-toolkit';

<Text mt="sm" testID="title">这是一段基本文本</Text>

// 设置背景
<Text p="md" backgroundColor="#FFF">白底文字</Text>
<Text p="md" transparent>透明背景文字</Text>
```

## API 参考

- 保持原有 `TextProps` 能力，同时新增公共能力：
  - `SpacingProps`（统一间距）
  - `BackgroundProps`（统一背景：默认透明）
  - `TestableProps`（统一测试标识）

## 注意事项

- 间距统一使用 `SpacingProps`，无需手动映射主题刻度
- 背景默认透明；如需背景色，传入 `backgroundColor`
- 测试标识在内部做了规范化处理，避免冲突
