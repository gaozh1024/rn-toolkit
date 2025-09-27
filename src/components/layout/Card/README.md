# Card 卡片（基于新主题系统）

Card 是一个通用的卡片容器组件，内置圆角与阴影预设，支持点击态与可访问性，并全面接入新的主题系统（useTheme）。

## 导入

```ts
import { Card } from '@gaozh1024/rn-toolkit';
// 或者
import { Card, CardProps } from '@gaozh1024/rn-toolkit';
```

## 基本用法

```tsx
import React from 'react';
import { Text } from 'react-native';
import { Card } from '@gaozh1024/rn-toolkit';

export const BasicCard = () => (
  <Card>
    <Text>这是一个基本卡片</Text>
  </Card>
);
```

### 可点击卡片

```tsx
export const ClickableCard = () => (
  <Card onPress={() => console.log('点击卡片')}>
    <Text>点击这个卡片</Text>
  </Card>
);
```

## 属性（Props）

| 属性名 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| children | React.ReactNode | - | 卡片内容 |
| style | StyleProp<ViewStyle> | - | 自定义样式（会与内置样式合并） |
| backgroundColor | string | theme.colors.card | 背景色（随浅/深色模式切换） |
| padding | number | theme.spacing.md | 内边距（使用主题间距） |
| margin | number | theme.spacing.sm | 外边距（使用主题间距） |
| borderRadius | number | theme.borderRadius.lg | 圆角（使用主题圆角） |
| elevation | number | 由阴影预设决定 | Android 阴影高度（显式传入将覆盖预设） |
| shadowColor | string | theme.colors.shadow | iOS 阴影颜色（可覆盖） |
| shadowSize | 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'md' | 阴影强度预设（来自 styles.shadow） |
| onPress | () => void | - | 点击事件（存在时使用 TouchableOpacity 包裹） |
| disabled | boolean | false | 点击是否禁用 |
| testID | string | - | 测试标识符 |

说明：当 elevation 指定时，会覆盖预设阴影里的 elevation 值；shadowColor 也可覆盖预设的 shadowColor。

## 主题集成与设计规范

- 默认背景：theme.colors.card（而非 surface），更贴合卡片语义。
- 圆角/间距：默认使用 theme.borderRadius.lg 与 theme.spacing.*，统一视觉节奏。
- 阴影：通过 styles.shadow 预设（xs/sm/md/lg/xl）快速切换强度；可配合 theme.colors.shadow 做全局风格调整。

## 示例

### 自定义 Token 与阴影预设

```tsx
import { Text, View } from 'react-native';
import { Card } from '@gaozh1024/rn-toolkit';

export const TokenCard = () => (
  <Card
    padding={20}
    margin={16}
    borderRadius={12}
    shadowSize="lg"
  >
    <Text>使用 Token 的卡片</Text>
  </Card>
);
```

### 复杂内容布局

```tsx
import { View, Text, Image } from 'react-native';

export const ComplexCard = () => (
  <Card padding={0} shadowSize="sm">
    <Image
      source={{ uri: 'https://example.com/image.jpg' }}
      style={{ width: '100%', height: 200, borderTopLeftRadius: 12, borderTopRightRadius: 12 }}
    />
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>卡片标题</Text>
      <Text style={{ color: '#666', lineHeight: 20 }}>描述内容...</Text>
    </View>
  </Card>
);
```

### 列表卡片

```tsx
import { View, Text } from 'react-native';

export const CardList = () => {
  const items = [
    { id: 1, title: '项目 1', description: '描述 1' },
    { id: 2, title: '项目 2', description: '描述 2' },
    { id: 3, title: '项目 3', description: '描述 3' },
  ];

  return (
    <View>
      {items.map((item) => (
        <Card key={item.id} onPress={() => console.log('点击', item.title)} margin={8}>
          <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{item.title}</Text>
          <Text style={{ color: '#666', marginTop: 4 }}>{item.description}</Text>
        </Card>
      ))}
    </View>
  );
};
```

### 禁用状态

```tsx
export const DisabledCard = () => (
  <Card onPress={() => {}} disabled style={{ opacity: 0.6 }}>
    <Text>禁用的卡片</Text>
  </Card>
);
```

## 平台差异

- iOS：主要使用 shadowColor、shadowOffset、shadowOpacity、shadowRadius 实现阴影；颜色由 theme.colors.shadow 控制。
- Android：主要依赖 elevation；可通过传入 elevation 覆盖预设中的值。

## 无障碍（A11y）

- onPress 存在时使用 TouchableOpacity 包装，具备可点击语义。
- 可通过 testID 与可读的 children 文本提升自动化测试与可读性。

## 迁移指南（从旧主题）

- 旧版默认背景来自 theme.colors.surface；现改为 theme.colors.card。
- 旧版导入 useTheme 来自 theme—old；现在无需使用旧目录，组件已内置对新 theme 的集成。
- 新增 shadowSize 属性用于选择 styles.shadow 预设。

## TypeScript 支持

```ts
import { Card, CardProps } from '@gaozh1024/rn-toolkit';

export const TSExample = () => {
  const props: CardProps = {
    onPress: () => {},
    shadowSize: 'md',
  };
  return <Card {...props}><Text>TS</Text></Card>;
};
```