# Icon 组件

Icon 组件默认使用 Ionicons 作为图标库，同时支持注册和使用自定义图标库。

## 导入

```typescript
import { 
  Icon, 
  Ionicon,
  registerIconLibrary, 
  unregisterIconLibrary,
  getRegisteredIconLibraries,
  isIconLibraryRegistered
} from '@gaozh1024/rn-toolkit';

// 类型导入
import type { 
  IconProps, 
  IconType, 
  CustomIconComponent,
  IoniconName,
  IoniconProps
} from '@gaozh1024/rn-toolkit';
```

## 基本用法

### 使用默认的 Ionicons

```jsx
import React from 'react';
import { Icon } from '@gaozh1024/rn-toolkit';

const BasicIcon = () => {
  return (
    <View style={{ flexDirection: 'row', gap: 16 }}>
      {/* 使用默认的 Ionicons，type 可以省略 */}
      <Icon name="home" size={24} color="#000" />
      <Icon name="person-outline" size={24} color="blue" />
      <Icon name="settings" size={24} color="green" />
      
      {/* 明确指定 type 为 ionicons */}
      <Icon name="heart" type="ionicons" size={24} color="red" />
    </View>
  );
};
```

### 使用类型安全的 Ionicon 组件

```jsx
import { Ionicon } from '@gaozh1024/rn-toolkit';

const TypeSafeIcon = () => {
  return (
    <View style={{ flexDirection: 'row', gap: 16 }}>
      <Ionicon name="home" size={24} color="#000" />
      <Ionicon name="person-outline" size={24} color="blue" />
      <Ionicon name="settings" size={24} color="green" />
    </View>
  );
};
```

### 可点击的图标

```jsx
const ClickableIcon = () => {
  const handlePress = () => {
    console.log('图标被点击了');
  };

  return (
    <Icon 
      name="heart-outline" 
      size={32} 
      color="red" 
      onPress={handlePress}
    />
  );
};
```

## 常用 Ionicons 图标

### 导航图标

```jsx
<Icon name="home" />
<Icon name="home-outline" />
<Icon name="arrow-back" />
<Icon name="arrow-forward" />
<Icon name="chevron-back" />
<Icon name="chevron-forward" />
<Icon name="menu" />
```

### 操作图标

```jsx
<Icon name="add" />
<Icon name="remove" />
<Icon name="close" />
<Icon name="checkmark" />
<Icon name="search" />
<Icon name="refresh" />
<Icon name="share" />
```

### 状态图标

```jsx
<Icon name="heart" />
<Icon name="heart-outline" />
<Icon name="star" />
<Icon name="star-outline" />
<Icon name="notifications" />
<Icon name="notifications-outline" />
```

### 功能图标

```jsx
<Icon name="camera" />
<Icon name="mail" />
<Icon name="call" />
<Icon name="location" />
<Icon name="settings" />
<Icon name="person" />
```

## 自定义图标库

你仍然可以注册和使用自定义图标库：

```jsx
import { registerIconLibrary } from '@gaozh1024/rn-toolkit';
import MyCustomIcons from './MyCustomIcons';

// 注册自定义图标库
registerIconLibrary('MyCustomIcons', MyCustomIcons);

// 使用自定义图标
<Icon name="my-custom-icon" type="MyCustomIcons" size={24} />
```

## 完整示例

```tsx
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Icon, Ionicon } from '@gaozh1024/rn-toolkit';

const IconDemo = () => {
  return (
    <ScrollView style={{ padding: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16 }}>
        Ionicons 图标示例
      </Text>
      
      {/* 导航栏 */}
      <View style={{ 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        marginBottom: 16
      }}>
        <Icon name="menu" size={24} />
        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>标题</Text>
        <Icon name="notifications-outline" size={24} />
      </View>
      
      {/* 功能按钮 */}
      <View style={{ marginBottom: 20 }}>
        <Text style={{ fontSize: 16, marginBottom: 8 }}>功能按钮:</Text>
        <View style={{ flexDirection: 'row', gap: 16, flexWrap: 'wrap' }}>
          {[
            { name: 'home', label: '首页' },
            { name: 'search', label: '搜索' },
            { name: 'heart-outline', label: '收藏' },
            { name: 'person-outline', label: '个人' },
            { name: 'settings-outline', label: '设置' },
            { name: 'mail-outline', label: '邮件' },
          ].map((item, index) => (
            <TouchableOpacity 
              key={index}
              style={{ 
                alignItems: 'center', 
                padding: 12,
                backgroundColor: '#e3f2fd',
                borderRadius: 8,
                minWidth: 80
              }}
            >
              <Ionicon name={item.name as any} size={24} color="#1976d2" />
              <Text style={{ marginTop: 4, fontSize: 12 }}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      
      {/* 状态图标 */}
      <View style={{ marginBottom: 20 }}>
        <Text style={{ fontSize: 16, marginBottom: 8 }}>状态图标:</Text>
        <View style={{ flexDirection: 'row', gap: 16 }}>
          <Icon name="checkmark-circle" size={32} color="green" />
          <Icon name="warning" size={32} color="orange" />
          <Icon name="close-circle" size={32} color="red" />
          <Icon name="information-circle" size={32} color="blue" />
        </View>
      </View>
      
      {/* 可点击图标 */}
      <View style={{ marginBottom: 20 }}>
        <Text style={{ fontSize: 16, marginBottom: 8 }}>可点击图标:</Text>
        <View style={{ flexDirection: 'row', gap: 16 }}>
          <Icon 
            name="heart-outline" 
            size={32} 
            color="red" 
            onPress={() => console.log('点击了心形图标')}
          />
          <Icon 
            name="star-outline" 
            size={32} 
            color="gold" 
            onPress={() => console.log('点击了星形图标')}
          />
          <Icon 
            name="share-outline" 
            size={32} 
            color="blue" 
            onPress={() => console.log('点击了分享图标')}
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default IconDemo;
```

## API 参考

### Icon 组件属性

| 属性名 | 类型 | 默认值 | 必填 | 描述 |
|--------|------|--------|------|------|
| `name` | `string` | - | ✅ | 图标名称 |
| `type` | `IconType` | `'ionicons'` | ❌ | 图标库类型，默认为 ionicons |
| `size` | `number` | `24` | ❌ | 图标大小 |
| `color` | `string` | `'#000000'` | ❌ | 图标颜色 |
| `style` | `TextStyle \| ViewStyle` | - | ❌ | 自定义样式 |
| `onPress` | `() => void` | - | ❌ | 点击事件处理函数 |
| `disabled` | `boolean` | `false` | ❌ | 是否禁用 |
| `testID` | `string` | - | ❌ | 测试标识符 |

### Ionicon 组件属性

`Ionicon` 组件是 `Icon` 组件的类型安全版本，专门用于 Ionicons：

| 属性名 | 类型 | 默认值 | 必填 | 描述 |
|--------|------|--------|------|------|
| `name` | `IoniconName` | - | ✅ | Ionicons 图标名称（有类型提示） |
| `size` | `number` | `24` | ❌ | 图标大小 |
| `color` | `string` | `'#000000'` | ❌ | 图标颜色 |
| `style` | `any` | - | ❌ | 自定义样式 |
| `onPress` | `() => void` | - | ❌ | 点击事件处理函数 |
| `testID` | `string` | - | ❌ | 测试标识符 |

## 安装和配置

### 1. 安装依赖

```bash
npm install react-native-vector-icons
# 或
yarn add react-native-vector-icons
```

### 2. iOS 配置

在 `ios/Podfile` 中添加：

```ruby
pod 'RNVectorIcons', :path => '../node_modules/react-native-vector-icons'
```

然后运行：

```bash
cd ios && pod install
```

### 3. Android 配置

在 `android/app/build.gradle` 中添加：

```gradle
apply from: "../../node_modules/react-native-vector-icons/fonts.gradle"
```

## 图标参考

- [Ionicons 官方图标库](https://ionic.io/ionicons)
- 在线预览和搜索 Ionicons 图标

## 注意事项

1. **默认图标库**：组件默认使用 Ionicons，`type` 属性可以省略
2. **类型安全**：使用 `Ionicon` 组件可以获得更好的类型提示
3. **自定义图标库**：仍然支持注册自定义图标库，但不能使用 "ionicons" 作为名称
4. **图标名称**：确保使用正确的 Ionicons 图标名称
5. **性能**：Ionicons 是按需加载的，只有使用的图标会被包含在最终的应用中

这样配置后，你就可以方便地使用 Ionicons 作为默认图标库了！
