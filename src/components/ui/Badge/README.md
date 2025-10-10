# Badge（徽标）

支持文本/数值、圆点、最大值截断、主题颜色、变体、角标定位。

## 功能与属性
- `text`/`value`: 显示的文本或数值（`text` 优先于 `value`）
- `max`: 数值超出后显示为 `max+`
- `dot`: 仅显示圆点（忽略文本/数值）
- `variant`: `solid` | `outline`
- `color`: 主题色键（primary/secondary/success/warning/error/info）或自定义颜色字符串
- `size`: `small` | `medium` | `large` | number
- `position`: `top-right` | `top-left` | `bottom-right` | `bottom-left`（配合 `children` 用作角标）
- `offset`: 角标位置的偏移 `{ x?: number; y?: number }`
- `showZero`: `value` 为 0 时是否显示（默认 true）
- `children`: 若提供则作为角标覆盖在子元素角上
- `style`/`containerStyle`/`textStyle`: 自定义样式
- `testID`: 测试标识

## 使用示例

### 基础用法（文本/数值）
```tsx
import React from 'react';
import { View } from 'react-native';
import { Badge } from '@gaozh1024/rn-toolkit';

export default function BasicBadge() {
  return (
    <View style={{ flexDirection: 'row', gap: 12 }}>
      <Badge value={8} />
      <Badge text="New" color="success" />
      <Badge value={120} max={99} color="error" />
    </View>
  );
}
```

### 变体（solid / outline）
```tsx
<Badge value={3} color="primary" variant="solid" />
<Badge value={3} color="primary" variant="outline" />
```

### 圆点模式
```tsx
<Badge dot color="warning" />
<Badge dot size="large" color="info" />
```

### 作为角标（配合 children）
```tsx
import { View, Image } from 'react-native';

<View style={{ width: 64, height: 64 }}>
  <Badge value={7} position="top-right">
    <Image source={{ uri: 'https://...' }} style={{ width: 64, height: 64, borderRadius: 8 }} />
  </Badge>
</View>

<View>
  <Badge value={1} position="bottom-left" offset={{ x: -4, y: 2 }}>
    <View style={{ width: 36, height: 36, backgroundColor: '#eee', borderRadius: 6 }} />
  </Badge>
</View>
```

### 自定义颜色 / 尺寸
```tsx
<Badge value={5} color="#222" />
<Badge value={5} size={22} />
```

## 主题说明
- 颜色统一来源于 `useTheme().colors`，支持主题键或自定义颜色字符串。
- 无硬编码与主题冲突的颜色（solid 文本颜色默认白色）。

## 可访问性
- 非 `dot` 模式下设置 `accessibilityRole="text"`，支持屏幕阅读。