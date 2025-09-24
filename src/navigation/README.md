# 导航配置生成器

一个简洁的链式API来配置React Navigation，让导航配置更加直观和易维护。

## 重要提示 ⚠️

为了避免 `NavigationContainer` 嵌套错误，请根据你的使用场景选择合适的构建方法：

- **`buildRootNavigation()`**：包含 `NavigationContainer`，适用于应用根部
- **`buildFullNavigation()`**：不包含 `NavigationContainer`，需要你在外部包装
- **`buildTabNavigator()`** 和 **`buildStackNavigator()`**：单独的导航器，不包含容器

## 基础用法

### 方式一：作为应用根导航（推荐）

```typescript
// App.tsx
import { createNavigation } from '@/navigation';
import { HomeScreen, ProfileScreen, DetailsScreen } from '@/screens';

const AppNavigation = createNavigation()
  .addTab('home', HomeScreen, { 
    title: '首页', 
    icon: ({ color, size }) => <Icon name="home" color={color} size={size} />
  })
  .addTab('profile', ProfileScreen, { 
    title: '个人中心', 
    icon: ({ color, size }) => <Icon name="user" color={color} size={size} />
  })
  .addScreen('details', DetailsScreen, { title: '详情页' })
  .buildRootNavigation(); // 使用 buildRootNavigation，包含 NavigationContainer

export default function App() {
  return <AppNavigation />;
}
```

### 方式二：手动包装 NavigationContainer

```typescript
// App.tsx
import { NavigationContainer } from '@react-navigation/native';
import { createNavigation } from '@/navigation';
import { HomeScreen, ProfileScreen, DetailsScreen } from '@/screens';

const AppNavigator = createNavigation()
  .addTab('home', HomeScreen, { title: '首页' })
  .addTab('profile', ProfileScreen, { title: '个人中心' })
  .addScreen('details', DetailsScreen, { title: '详情页' })
  .buildFullNavigation(); // 使用 buildFullNavigation，不包含 NavigationContainer

export default function App() {
  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
}
```

### 方式三：嵌套在其他导航器中

```typescript
// 如果你已经有一个根 NavigationContainer，想要嵌套使用
import { createNavigation } from '@/navigation';

const SubNavigation = createNavigation()
  .addTab('tab1', Tab1Screen, { title: 'Tab 1' })
  .addTab('tab2', Tab2Screen, { title: 'Tab 2' })
  .buildTabNavigator(); // 只构建标签页导航器

// 然后在其他地方使用
<Stack.Screen name="SubTabs" component={SubNavigation} />
```

## API 参考

### 构建方法

#### buildRootNavigation()
- **包含**: `NavigationContainer`
- **适用**: 应用根部导航
- **注意**: 确保整个应用只有一个根容器

#### buildFullNavigation()
- **包含**: 完整导航结构（标签页 + 堆栈）
- **不包含**: `NavigationContainer`
- **适用**: 需要手动控制容器的场景

#### buildTabNavigator()
- **包含**: 仅标签页导航器
- **不包含**: `NavigationContainer`
- **适用**: 嵌套在其他导航器中

#### buildStackNavigator()
- **包含**: 仅堆栈导航器
- **不包含**: `NavigationContainer`
- **适用**: 嵌套在其他导航器中

## 错误排查

### NavigationContainer 嵌套错误

如果你看到这个错误：

## 特性

- ✅ **默认无头部**: 所有页面（包括Stack和Tab页面）默认隐藏头部
- ✅ **智能构建**: 自动处理复杂的导航结构
- ✅ **类型安全**: 完整的TypeScript支持
- ✅ **主题适配**: 自动适配深色/浅色主题
- ✅ **容器管理**: 避免NavigationContainer嵌套错误

### 方式一：作为应用根导航（推荐）

```typescript
// App.tsx
import { createNavigation } from '@/navigation';
import { HomeScreen, ProfileScreen, DetailsScreen } from '@/screens';

const AppNavigation = createNavigation()
  .addTab('home', HomeScreen, { 
    title: '首页', 
    icon: ({ color, size }) => <Icon name="home" color={color} size={size} />
  })
  .addTab('profile', ProfileScreen, { 
    title: '个人中心', 
    icon: ({ color, size }) => <Icon name="user" color={color} size={size} />
  })
  .addScreen('details', DetailsScreen, { title: '详情页' })
  .buildRootNavigation(); // 使用 buildRootNavigation，包含 NavigationContainer

export default function App() {
  return <AppNavigation />;
}
```

### 方式二：手动包装 NavigationContainer

```typescript
// App.tsx
import { NavigationContainer } from '@react-navigation/native';
import { createNavigation } from '@/navigation';
import { HomeScreen, ProfileScreen, DetailsScreen } from '@/screens';

const AppNavigator = createNavigation()
  .addTab('home', HomeScreen, { title: '首页' })
  .addTab('profile', ProfileScreen, { title: '个人中心' })
  .addScreen('details', DetailsScreen, { title: '详情页' })
  .buildFullNavigation(); // 使用 buildFullNavigation，不包含 NavigationContainer

export default function App() {
  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
}
```

### 方式三：嵌套在其他导航器中

```typescript
// 如果你已经有一个根 NavigationContainer，想要嵌套使用
import { createNavigation } from '@/navigation';

const SubNavigation = createNavigation()
  .addTab('tab1', Tab1Screen, { title: 'Tab 1' })
  .addTab('tab2', Tab2Screen, { title: 'Tab 2' })
  .buildTabNavigator(); // 只构建标签页导航器

// 然后在其他地方使用
<Stack.Screen name="SubTabs" component={SubNavigation} />
```

## API 参考

### 构建方法

#### buildRootNavigation()
- **包含**: `NavigationContainer`
- **适用**: 应用根部导航
- **注意**: 确保整个应用只有一个根容器

#### buildFullNavigation()
- **包含**: 完整导航结构（标签页 + 堆栈）
- **不包含**: `NavigationContainer`
- **适用**: 需要手动控制容器的场景

#### buildTabNavigator()
- **包含**: 仅标签页导航器
- **不包含**: `NavigationContainer`
- **适用**: 嵌套在其他导航器中

#### buildStackNavigator()
- **包含**: 仅堆栈导航器
- **不包含**: `NavigationContainer`
- **适用**: 嵌套在其他导航器中

## 错误排查

### NavigationContainer 嵌套错误

如果你看到这个错误：

## Tab页面配置

### 基础用法（默认无头部）

```typescript
const navigation = createNavigation()
  .addTab('Home', HomeScreen, {
    title: '首页',
    icon: ({ color, size }) => <Icon name="home" color={color} size={size} />
  })
  .addTab('Profile', ProfileScreen, {
    title: '个人中心',
    icon: ({ color, size }) => <Icon name="user" color={color} size={size} />
  });
```

### 显示Tab页头部

如果需要显示某个tab页的头部：

```typescript
const navigation = createNavigation()
  .addTab('Home', HomeScreen, {
    title: '首页',
    icon: ({ color, size }) => <Icon name="home" color={color} size={size} />,
    options: {
      headerShown: true, // 显示头部
      headerTitle: '首页标题'
    }
  });
```

### 全局设置Tab页头部样式

```typescript
const navigation = createNavigation()
  .setTabOptions({
    headerShown: true, // 全局显示tab页头部
    headerStyle: {
      backgroundColor: '#f8f9fa',
    },
    headerTintColor: '#333',
  })
  .addTab('Home', HomeScreen)
  .addTab('Profile', ProfileScreen);
```

### 方式一：作为应用根导航（推荐）

```typescript
// App.tsx
import { createNavigation } from '@/navigation';
import { HomeScreen, ProfileScreen, DetailsScreen } from '@/screens';

const AppNavigation = createNavigation()
  .addTab('home', HomeScreen, { 
    title: '首页', 
    icon: ({ color, size }) => <Icon name="home" color={color} size={size} />
  })
  .addTab('profile', ProfileScreen, { 
    title: '个人中心', 
    icon: ({ color, size }) => <Icon name="user" color={color} size={size} />
  })
  .addScreen('details', DetailsScreen, { title: '详情页' })
  .buildRootNavigation(); // 使用 buildRootNavigation，包含 NavigationContainer

export default function App() {
  return <AppNavigation />;
}
```

### 方式二：手动包装 NavigationContainer

```typescript
// App.tsx
import { NavigationContainer } from '@react-navigation/native';
import { createNavigation } from '@/navigation';
import { HomeScreen, ProfileScreen, DetailsScreen } from '@/screens';

const AppNavigator = createNavigation()
  .addTab('home', HomeScreen, { title: '首页' })
  .addTab('profile', ProfileScreen, { title: '个人中心' })
  .addScreen('details', DetailsScreen, { title: '详情页' })
  .buildFullNavigation(); // 使用 buildFullNavigation，不包含 NavigationContainer

export default function App() {
  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
}
```

### 方式三：嵌套在其他导航器中

```typescript
// 如果你已经有一个根 NavigationContainer，想要嵌套使用
import { createNavigation } from '@/navigation';

const SubNavigation = createNavigation()
  .addTab('tab1', Tab1Screen, { title: 'Tab 1' })
  .addTab('tab2', Tab2Screen, { title: 'Tab 2' })
  .buildTabNavigator(); // 只构建标签页导航器

// 然后在其他地方使用
<Stack.Screen name="SubTabs" component={SubNavigation} />
```

## API 参考

### addTab(name, component, config?)

添加标签页。

**参数:**
- `name`: 路由名称
- `component`: 页面组件
- `config`: 标签页配置
  - `title?`: 标签页标题
  - `icon?`: 标签页图标函数
  - `badge?`: 标签页徽章
  - `options?`: 底部标签页导航选项
    - `headerShown?`: 是否显示头部（默认为 `false`）

### setTabOptions(options)

设置标签页导航器的全局选项。

**参数:**
- `options`: 底部标签页导航选项
  - `headerShown?`: 是否显示头部（默认为 `false`）
  - `tabBarStyle?`: 标签栏样式
  - `tabBarActiveTintColor?`: 激活状态颜色
  - `tabBarInactiveTintColor?`: 非激活状态颜色

## 注意事项

1. **默认无头部**: 所有页面（Stack和Tab）默认都不显示头部
2. **显示头部**: 如需显示头部，请在 `options` 中设置 `headerShown: true`
3. **全局设置**: 使用 `setStackOptions()` 或 `setTabOptions()` 进行全局配置
4. **优先级**: 单个页面的 `options` 会覆盖全局设置