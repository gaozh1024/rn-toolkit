# Card 组件

Card 组件是一个通用的卡片容器组件，提供了阴影效果、圆角边框和可选的点击交互功能。

## 导入

```typescript
import { Card } from '@gaozh1024/rn-toolkit';
// 或者
import { Card, CardProps } from '@gaozh1024/rn-toolkit';
```

## 基本用法

### 简单卡片

```jsx
import React from 'react';
import { Text } from 'react-native';
import { Card } from '@gaozh1024/rn-toolkit';

const BasicCard = () => {
  return (
    <Card>
      <Text>这是一个基本的卡片内容</Text>
    </Card>
  );
};
```

### 可点击卡片

```jsx
const ClickableCard = () => {
  const handlePress = () => {
    console.log('卡片被点击了');
  };

  return (
    <Card onPress={handlePress}>
      <Text>点击这个卡片</Text>
    </Card>
  );
};
```

## 属性 (Props)

| 属性名 | 类型 | 默认值 | 必填 | 描述 |
|--------|------|--------|------|------|
| `children` | `React.ReactNode` | - | ✅ | 卡片内容 |
| `style` | `StyleProp<ViewStyle>` | - | ❌ | 自定义样式 |
| `backgroundColor` | `string` | `theme.colors.surface` | ❌ | 背景颜色 |
| `padding` | `number` | `16` | ❌ | 内边距 |
| `margin` | `number` | `8` | ❌ | 外边距 |
| `borderRadius` | `number` | `12` | ❌ | 圆角半径 |
| `elevation` | `number` | `2` | ❌ | Android 阴影高度 |
| `shadowColor` | `string` | `theme.colors.shadow` | ❌ | iOS 阴影颜色 |
| `onPress` | `() => void` | - | ❌ | 点击事件处理函数 |
| `disabled` | `boolean` | `false` | ❌ | 是否禁用点击 |
| `testID` | `string` | - | ❌ | 测试标识符 |

## 使用示例

### 自定义样式

```jsx
const CustomStyledCard = () => {
  return (
    <Card
      backgroundColor="#f0f8ff"
      padding={20}
      margin={16}
      borderRadius={8}
      elevation={4}
      shadowColor="#000"
    >
      <Text>自定义样式的卡片</Text>
    </Card>
  );
};
```

### 复杂内容卡片

```jsx
import { View, Text, Image } from 'react-native';

const ComplexCard = () => {
  return (
    <Card padding={0}>
      <Image 
        source={{ uri: 'https://example.com/image.jpg' }}
        style={{ width: '100%', height: 200, borderTopLeftRadius: 12, borderTopRightRadius: 12 }}
      />
      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>
          卡片标题
        </Text>
        <Text style={{ color: '#666', lineHeight: 20 }}>
          这是卡片的描述内容，可以包含多行文字和其他组件。
        </Text>
      </View>
    </Card>
  );
};
```

### 列表卡片

```jsx
const CardList = () => {
  const items = [
    { id: 1, title: '项目 1', description: '描述 1' },
    { id: 2, title: '项目 2', description: '描述 2' },
    { id: 3, title: '项目 3', description: '描述 3' },
  ];

  return (
    <View>
      {items.map(item => (
        <Card 
          key={item.id}
          onPress={() => console.log(`点击了 ${item.title}`)}
          margin={8}
        >
          <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
            {item.title}
          </Text>
          <Text style={{ color: '#666', marginTop: 4 }}>
            {item.description}
          </Text>
        </Card>
      ))}
    </View>
  );
};
```

### 无边距卡片

```jsx
const NoMarginCard = () => {
  return (
    <Card margin={0} style={{ marginHorizontal: 16, marginVertical: 8 }}>
      <Text>使用自定义 style 控制边距</Text>
    </Card>
  );
};
```

### 禁用状态卡片

```jsx
const DisabledCard = () => {
  return (
    <Card 
      onPress={() => console.log('不会被触发')}
      disabled={true}
      style={{ opacity: 0.6 }}
    >
      <Text>这是一个禁用的卡片</Text>
    </Card>
  );
};
```

## 主题集成

Card 组件自动集成了主题系统：

- `backgroundColor` 默认使用 `theme.colors.surface`
- `shadowColor` 默认使用 `theme.colors.shadow`
- 支持通过 ThemeService 进行全局主题切换

## 平台差异

- **iOS**: 使用 `shadowColor`、`shadowOffset`、`shadowOpacity`、`shadowRadius` 实现阴影
- **Android**: 使用 `elevation` 实现阴影效果

## 注意事项

1. 当提供 `onPress` 属性时，卡片会自动变为可点击状态，使用 `TouchableOpacity` 包装
2. 阴影效果在不同平台上的表现可能略有差异
3. 如果需要复杂的点击反馈效果，建议使用自定义的 `style` 属性
4. `children` 是必需属性，必须提供卡片内容

## TypeScript 支持

组件完全支持 TypeScript，提供了完整的类型定义：

```typescript
import { CardProps } from '@gaozh1024/rn-toolkit';

const MyCard: React.FC<{ data: any }> = ({ data }) => {
  const cardProps: CardProps = {
    children: <Text>{data.title}</Text>,
    onPress: () => console.log('clicked'),
    backgroundColor: '#fff',
    elevation: 3,
  };

  return <Card {...cardProps} />;
};
```