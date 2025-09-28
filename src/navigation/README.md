# 简洁导航系统使用说明

一个基于 React Navigation 的简洁、易用的底部标签页导航系统，支持链式调用配置、完全自定义按钮和自动安全区域适配。

## 🚀 特性

- ✅ **完全自定义 TabBarButton**：每个标签页都使用自定义按钮组件
- ✅ **自动安全区域适配**：自动获取并适配设备底部安全区域
- ✅ **链式调用配置**：流畅的 API 设计，支持链式调用
- ✅ **TypeScript 支持**：完整的类型定义
- ✅ **徽章支持**：支持显示徽章和自定义颜色
- ✅ **调试友好**：内置 console.log 调试信息

## 📦 安装依赖

确保你的项目已安装以下依赖：

```bash
npm install @react-navigation/native @react-navigation/bottom-tabs react-native-safe-area-context
# 或
yarn add @react-navigation/native @react-navigation/bottom-tabs react-native-safe-area-context
```

## 🎯 快速开始

### 基础用法

```typescript
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import createNavigation from './src/navigation';
import { HomeScreen, ProfileScreen, SettingsScreen } from './screens';

const App = () => {
  const NavigationComponent = createNavigation()
    .addTab({
      name: 'Home',
      component: HomeScreen,
      label: '首页',
      iconName: 'home',
    })
    .addTab({
      name: 'Profile', 
      component: ProfileScreen,
      label: '个人',
      iconName: 'person',
      badge: '3',
    })
    .addTab({
      name: 'Settings',
      component: SettingsScreen,
      label: '设置',
      iconName: 'settings',
    })
    .build();

  return (
    <NavigationContainer>
      <NavigationComponent />
    </NavigationContainer>
  );
};

export default App;
```

### 高级配置

```typescript
const NavigationComponent = createNavigation()
  .addTabs([
    {
      name: 'Home',
      component: HomeScreen,
      label: '首页',
      iconName: 'home',
      iconSize: 28,
    },
    {
      name: 'Messages',
      component: MessagesScreen,
      label: '消息',
      iconName: 'message',
      badge: 5,
      badgeColor: '#FF3B30',
    },
    {
      name: 'Profile',
      component: ProfileScreen,
      label: '我的',
      iconName: 'person',
    }
  ])
  .setInitialRoute('Home')
  .setTabBarHeight(70)
  .setActiveColor('#007AFF')
  .setInactiveColor('#8E8E93')
  .setBackgroundColor('#FFFFFF')
  .setShowLabels(true)
  .build();
```

## 📚 API 文档

### NavigationBuilder

链式调用的导航构建器，提供流畅的配置 API。

#### 方法

| 方法 | 参数 | 返回值 | 描述 |
|------|------|--------|------|
| `addTab(tab)` | `TabConfig` | `NavigationBuilder` | 添加单个标签页 |
| `addTabs(tabs)` | `TabConfig[]` | `NavigationBuilder` | 批量添加标签页 |
| `setInitialRoute(routeName)` | `string` | `NavigationBuilder` | 设置初始路由 |
| `setTabBarHeight(height)` | `number` | `NavigationBuilder` | 设置标签栏高度 |
| `setBackgroundColor(color)` | `string` | `NavigationBuilder` | 设置背景色 |
| `setActiveColor(color)` | `string` | `NavigationBuilder` | 设置激活状态颜色 |
| `setInactiveColor(color)` | `string` | `NavigationBuilder` | 设置非激活状态颜色 |
| `setShowLabels(show)` | `boolean` | `NavigationBuilder` | 设置是否显示标签 |
| `build()` | - | `React.FC` | 构建导航组件 |
| `getConfig()` | - | `NavigatorConfig` | 获取当前配置 |
| `reset()` | `routes: Array<{ name: string; params?: any }>` | `NavigationService`/Hook | 重置导航堆栈到指定路由数组 |

### TabConfig

标签页配置接口

```typescript
interface TabConfig {
  name: string;                    // 路由名称（必需）
  component: ComponentType<any>;   // 页面组件（必需）
  label?: string;                  // 显示标签
  iconName?: string;               // 图标名称
  iconSize?: number;               // 图标大小，默认 24
  badge?: string | number;         // 徽章内容
  badgeColor?: string;             // 徽章颜色，默认 '#FF3B30'
  options?: BottomTabNavigationOptions; // 额外的导航选项
}
```

### NavigatorConfig

导航器配置接口

```typescript
interface NavigatorConfig {
  tabs: TabConfig[];               // 标签页列表
  initialRouteName?: string;       // 初始路由名称
  tabBarHeight?: number;           // 标签栏高度，默认 60
  backgroundColor?: string;        // 背景色，默认 '#FFFFFF'
  activeColor?: string;            // 激活颜色，默认 '#007AFF'
  inactiveColor?: string;          // 非激活颜色，默认 '#8E8E93'
  showLabels?: boolean;            // 是否显示标签，默认 true
}
```

## 🎨 自定义样式

### CustomTabButton 组件

每个标签页都使用 `CustomTabButton` 组件渲染，你可以通过以下方式自定义：

```typescript
// 自定义图标渲染
const NavigationComponent = createNavigation()
  .addTab({
    name: 'Home',
    component: HomeScreen,
    label: '首页',
    // 可以通过 children 属性传入自定义图标
  })
  .build();
```

### 样式定制

标签按钮的样式在 `CustomTabButton.tsx` 中定义，包含：

- `container`: 按钮容器样式
- `content`: 内容区域样式  
- `iconContainer`: 图标容器样式
- `defaultIcon`: 默认图标样式
- `badge`: 徽章样式
- `badgeText`: 徽章文字样式
- `label`: 标签文字样式

## 🔧 Hooks

### useSafeArea()

获取完整的安全区域信息

```typescript
import { useSafeArea } from './src/navigation';

const MyComponent = () => {
  const { top, bottom, left, right } = useSafeArea();
  
  return (
    <View style={{ paddingTop: top, paddingBottom: bottom }}>
      {/* 内容 */}
    </View>
  );
};
```

### useBottomSafeArea()

仅获取底部安全区域高度

```typescript
import { useBottomSafeArea } from './src/navigation';

const MyComponent = () => {
  const bottomSafeArea = useBottomSafeArea();
  
  return (
    <View style={{ paddingBottom: bottomSafeArea }}>
      {/* 内容 */}
    </View>
  );
};
```

## 🐛 调试

系统内置了调试信息，在 `CustomTabButton` 组件中会输出：

```javascript
console.log('CustomTabButton rendered:', { focused, label, bottomSafeArea });
```

这可以帮助你：
- 确认按钮是否正确渲染
- 查看焦点状态
- 检查安全区域高度
- 验证标签显示

## 📱 安全区域适配

系统自动处理设备安全区域：

1. **自动检测**：使用 `react-native-safe-area-context` 获取安全区域
2. **动态适配**：标签栏高度 = 设置高度 + 底部安全区域
3. **按钮适配**：每个按钮的 `paddingBottom` 会自动加上安全区域高度

## 🔄 迁移指南

### 从旧版导航系统迁移

如果你之前使用的是复杂的导航系统，可以这样迁移：

```typescript
// 旧版本（复杂）
const navigation = createNavigation()
  .buildTabNavigator();

// 新版本（简洁）
const NavigationComponent = createNavigation()
  .addTab({ name: 'Home', component: HomeScreen })
  .build();
```

## ⚠️ 注意事项

1. **SafeAreaProvider**: 确保在应用根部包裹 `SafeAreaProvider`
2. **图标组件**: 目前使用默认的色块作为图标，你可以替换为自己的图标组件
3. **性能**: 每次配置变更都会重新创建组件，建议在组件外部创建配置

## 🤝 贡献

欢迎提交 Issue 和 Pull Request 来改进这个导航系统！

## 📄 许可证

MIT License