# Chip/Tag（标签）

支持标签文本、图标、可关闭、选中态、变体、颜色与尺寸，接入主题。

## 属性
- `label`: 标签文本或自定义节点
- `icon`: `{ name, size?, color?, type? }` 前置图标（默认 `ionicons`）
- `closable`: 是否显示关闭图标；`onClose`：关闭时回调
- `selected`: 选中态（在 `outline` 下选中会填充为主题色）
- `variant`: `solid | outline`
- `color`: 主题色键或自定义颜色字符串
- `size`: `small | medium | large | number`
- `style`/`textStyle`: 自定义容器/文本样式
- `testID`: 测试标识

## 使用示例

### 基础用法
```tsx
import React from 'react';
import { View } from 'react-native';
import { Chip } from '@gaozh1024/rn-toolkit';

export default function BasicChips() {
  return (
    <View style={{ flexDirection: 'row', gap: 8 }}>
      <Chip label="Default" />
      <Chip label="Primary" color="primary" selected variant="solid" />
      <Chip label="Outline" color="success" variant="outline" />
    </View>
  );
}
```

### 带图标与可关闭
```tsx
<Chip label="Filter" icon={{ name: 'filter' }} />
<Chip label="Closable" closable onClose={() => console.log('closed')} />
<Chip label="Mail" icon={{ name: 'mail' }} closable color="secondary" />
```

### 自定义尺寸与颜色
```tsx
<Chip label="Small" size="small" />
<Chip label="Large" size="large" />
<Chip label="Custom" size={34} color="#222" />
```

## 主题说明
- 颜色来源 `useTheme().colors`；支持主题键或自定义颜色字符串。
- `outline` 未选中时：透明背景、主题色边框与文字；选中或 `solid`：主题色填充、白色文字。

## 可访问性
- `closable` 时关闭图标可点击，`accessibilityLabel="close tag"`；容器的可访问性角色根据是否可关闭设置为 `button` 或 `text`。