# Card 卡片

通用卡片容器，内置圆角与阴影预设，支持点击态与渐变背景，全面接入新主题系统（useTheme）。

## 导入

```ts
import { Card } from '@gaozh1024/rn-toolkit';
// 或者
import { Card, CardProps } from '@gaozh1024/rn-toolkit';
```

## 快速示例

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

### 渐变 + 阴影 + 边框 + 点击（组合示例）

```tsx
import { Layout, UI, ToastService, useTheme } from '@gaozh1024/rn-toolkit';

export const ComposedCard = () => {
  const { theme } = useTheme();
  const { colors } = theme;

  return (
    <Layout.Card
      gradientEnabled
      gradientVariant="linear"
      gradientColors={[colors.primary, colors.secondary]}
      gradientAngle={45}
      shadowSize="md"
      borderWidth={1}
      borderColor="#f00"
      borderRadius={16}
      p={16}
      onPress={() => ToastService.show({ message: '组合示例被点击' })}
      testID="card-composed"
    >
      <UI.Text variant="h3" color="onSurface">组合示例</UI.Text>
      <UI.Text variant="body2" color="onSurface">支持渐变、阴影、边框与点击事件的组合。</UI.Text>
    </Layout.Card>
  );
};
```

说明：

- 开启 `gradientEnabled` 后，卡片会渲染一个“绝对定位的渐变背景层”，它覆盖整个卡片区域（包含 padding），不再因为包裹内容导致与内边距产生空隙。
- 渐变背景会自动使用与卡片一致的 `borderRadius` 进行裁剪。

## Props（类别说明）

Card 组件的 Props 聚合了多类能力：

- 核心
  - `children`: 卡片内容
  - `style?: StyleProp<ViewStyle>`: 外部样式（会被拍平参与合并）
- 交互
  - `onPress?: () => void`: 点击事件；存在时使用 `TouchableOpacity` 包裹
  - `disabled?: boolean`: 点击禁用
- 间距（SpacingProps）
  - 支持 `p/pv/ph/pt/pb/pl/pr` 与 `m/mv/mh/mt/mb/ml/mr` 等键
  - 未显式传入任一 spacing 键时，默认 `padding=theme.spacing.md`、`margin=theme.spacing.sm`
- 盒子（BoxProps）
  - `width/height/minWidth/minHeight/maxWidth/maxHeight`
  - `backgroundColor?: ColorValue`
  - `transparent?: boolean`（背景透明）
  - `borderWidth/borderColor/borderRadius/...`（边框相关，常用为 `borderWidth/borderColor/borderRadius`）
- 阴影（ShadowProps）
  - `shadowSize?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'`
  - `shadowColor?: string`
- 渐变（GradientProps）
  - `gradientEnabled?: boolean`
  - `gradientVariant?: 'linear' | 'radial'`
  - `gradientColors?: string[]`
  - `gradientLocations?: number[]`
  - `gradientAngle?: number`
  - `gradientStart/gradientEnd?: { x: number; y: number }`
  - `gradientCenter?: { x: number; y: number }`
  - `gradientRadius?: number`
  - `gradientOpacity?: number`
- 测试（TestableProps）
  - `testID?: string`

## 样式优先级与合并规则

- 外部 `style` 会被拍平为 `overrides` 并参与合并；但“单独传入的属性”（如 `borderWidth/borderColor/borderRadius/backgroundColor/width/height` 等）具有更高优先级，会覆盖 `overrides` 中同名字段。
- 最终容器样式不再附加原始 `style` 数组项，避免其在合并后反向覆盖内部计算结果。
- 阴影与圆角在最终样式上合并；开启渐变时，背景层绝对定位于容器底部，内容与内边距在其上层。

## 设计规范

- 默认背景：`theme.colors.background`（更贴合容器语义与浅/深色适配）。
- 间距：默认 `padding=theme.spacing.md`、`margin=theme.spacing.sm`；显式传入任一 spacing 键后不再套用默认值。
- 阴影：通过 `styles.shadow` 预设进行强度切换，`shadowColor` 可覆盖颜色。
- 渐变：采用 `react-native-svg` 实现；作为背景层覆盖卡片区域，并在圆角下裁剪。

## 示例

### 自定义 Token 与阴影预设

```tsx
export const TokenCard = () => (
  <Card
    p={20}
    m={16}
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
  <Card p={0} shadowSize="sm" borderRadius={12}>
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
export const CardList = () => {
  const items = [
    { id: 1, title: '项目 1', description: '描述 1' },
    { id: 2, title: '项目 2', description: '描述 2' },
    { id: 3, title: '项目 3', description: '描述 3' },
  ];

  return (
    <View>
      {items.map((item) => (
        <Card key={item.id} onPress={() => console.log('点击', item.title)} m={8}>
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

## 注意事项

- 渐变依赖 `react-native-svg`；已集成于 `GradientBackground`。
- 使用 `borderRadius` 时，背景层会启用裁剪；阴影仍在容器层生效。
- 为保证样式一致性，尽量通过 props（而非 style）指定宽高、背景、边框与圆角。
