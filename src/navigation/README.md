# 导航配置生成器

一个简洁的链式API来配置React Navigation，让导航配置更加直观和易维护。

## 特性

- 🔗 **链式调用**：流畅的API设计
- 📱 **标签页支持**：轻松配置底部标签页
- 📄 **堆栈导航**：支持页面堆栈管理
- 🎨 **主题集成**：自动集成主题系统
- 📝 **TypeScript**：完整的类型支持
- ⚡ **简洁配置**：减少样板代码

## 基础用法

### 简单的标签页导航

```typescript
import { createNavigation } from '@/navigation';
import { HomeScreen, ProfileScreen } from '@/screens';

const AppNavigation = createNavigation()
  .addTab('home', HomeScreen, { 
    title: '首页', 
    icon: ({ color, size }) => <Icon name="home" color={color} size={size} />
  })
  .addTab('profile', ProfileScreen, { 
    title: '个人中心', 
    icon: ({ color, size }) => <Icon name="user" color={color} size={size} />
  })
  .buildTabNavigator();

export default AppNavigation;
```

### 完整的导航结构（标签页 + 堆栈）

```typescript
import { createNavigation } from '@/navigation';
import { 
  HomeTabScreen, 
  ProfileTabScreen, 
  DetailsScreen, 
  SettingsScreen 
} from '@/screens';

const AppNavigation = createNavigation()
  // 添加标签页
  .addTab('home', HomeTabScreen, {
    title: '首页',
    icon: ({ color, size }) => <Icon name="home" color={color} size={size} />,
  })
  .addTab('profile', ProfileTabScreen, {
    title: '个人中心', 
    icon: ({ color, size }) => <Icon name="user" color={color} size={size} />,
    badge: '3', // 显示徽章
  })
  
  // 添加堆栈页面
  .addScreen('details', DetailsScreen, {
    title: '详情页',
    options: {
      headerBackTitle: '返回',
    }
  })
  .addScreen('settings', SettingsScreen, {
    title: '设置',
    options: {
      presentation: 'modal',
    }
  })
  
  // 设置初始路由
  .setInitialTabRoute('home')
  
  // 构建完整导航
  .buildFullNavigation();

export default AppNavigation;
```

### 自定义导航选项

```typescript
const AppNavigation = createNavigation()
  .addTab('home', HomeScreen, { title: '首页' })
  .addTab('profile', ProfileScreen, { title: '个人' })
  
  // 设置标签页全局选项
  .setTabOptions({
    tabBarActiveTintColor: '#007AFF',
    tabBarInactiveTintColor: '#8E8E93',
    tabBarStyle: {
      backgroundColor: '#F8F8F8',
    },
  })
  
  // 设置堆栈全局选项
  .setStackOptions({
    headerStyle: {
      backgroundColor: '#007AFF',
    },
    headerTintColor: '#FFFFFF',
  })
  
  .buildFullNavigation();
```

## API 参考

### NavigationBuilder

#### 方法

##### `addTab(name, component, config?)`

添加标签页屏幕。

**参数：**
- `name: string` - 屏幕名称
- `component: React.ComponentType` - 屏幕组件
- `config?: TabConfig` - 标签页配置

**TabConfig：**
```typescript
interface TabConfig {
  title?: string;                    // 标签标题
  icon?: React.ReactNode | Function; // 标签图标
  badge?: string | number;           // 徽章文本
  options?: BottomTabNavigationOptions; // 其他选项
}
```

##### `addScreen(name, component, config?)`

添加堆栈屏幕。

**参数：**
- `name: string` - 屏幕名称
- `component: React.ComponentType` - 屏幕组件
- `config?: ScreenConfig` - 屏幕配置

**ScreenConfig：**
```typescript
interface ScreenConfig {
  title?: string;                   // 屏幕标题
  options?: StackNavigationOptions; // 导航选项
  initialParams?: any;              // 初始参数
}
```

##### `setTabOptions(options)`

设置标签页导航器的全局选项。

##### `setStackOptions(options)`

设置堆栈导航器的全局选项。

##### `setInitialTabRoute(routeName)`

设置初始标签页路由。

##### `setInitialStackRoute(routeName)`

设置初始堆栈路由。

##### `build()`

构建导航配置对象。

##### `buildTabNavigator()`

构建并返回标签页导航器组件。

##### `buildStackNavigator()`

构建并返回堆栈导航器组件。

##### `buildFullNavigation()`

构建完整的导航结构（标签页 + 堆栈）。

##### `reset()`

重置构建器状态。

### 工具函数

##### `createNavigation()`

创建新的导航配置生成器实例。

```typescript
const navigation = createNavigation();
```

## 高级用法

### 条件导航

```typescript
const navigation = createNavigation()
  .addTab('home', HomeScreen, { title: '首页' });

// 根据用户状态添加不同的标签页
if (user.isLoggedIn) {
  navigation.addTab('profile', ProfileScreen, { title: '个人中心' });
} else {
  navigation.addTab('login', LoginScreen, { title: '登录' });
}

const AppNavigation = navigation.buildTabNavigator();
```

### 动态配置

```typescript
const tabConfigs = [
  { name: 'home', component: HomeScreen, title: '首页' },
  { name: 'search', component: SearchScreen, title: '搜索' },
  { name: 'profile', component: ProfileScreen, title: '个人' },
];

let navigation = createNavigation();

tabConfigs.forEach(config => {
  navigation = navigation.addTab(config.name, config.component, {
    title: config.title,
  });
});

const AppNavigation = navigation.buildTabNavigator();
```

### 复用配置

```typescript
// 创建基础配置
const baseNavigation = () => createNavigation()
  .setTabOptions({
    tabBarActiveTintColor: '#007AFF',
    tabBarInactiveTintColor: '#8E8E93',
  })
  .setStackOptions({
    headerStyle: { backgroundColor: '#007AFF' },
    headerTintColor: '#FFFFFF',
  });

// 用户导航
const UserNavigation = baseNavigation()
  .addTab('home', HomeScreen, { title: '首页' })
  .addTab('profile', ProfileScreen, { title: '个人' })
  .buildFullNavigation();

// 管理员导航
const AdminNavigation = baseNavigation()
  .addTab('dashboard', DashboardScreen, { title: '仪表板' })
  .addTab('users', UsersScreen, { title: '用户管理' })
  .addTab('settings', SettingsScreen, { title: '设置' })
  .buildFullNavigation();
```

## 注意事项

1. **屏幕名称唯一性**：确保每个屏幕的名称在应用中是唯一的
2. **图标组件**：标签页图标需要是React组件或返回组件的函数
3. **主题集成**：导航器会自动应用当前主题样式
4. **类型安全**：使用TypeScript时会有完整的类型检查

## 迁移指南

### 从传统配置迁移

**之前：**
```typescript
const tabScreens = [
  {
    name: SCREEN_NAMES.HOME_TAB,
    component: HomeTabScreen,
    options: {
      title: SCREEN_TITLES[SCREEN_NAMES.HOME_TAB],
      tabBarIcon: ({ color, size }) => SCREEN_ICONS[SCREEN_NAMES.HOME_TAB],
    },
  },
];
```

**现在：**
```typescript
const navigation = createNavigation()
  .addTab('home', HomeTabScreen, {
    title: '首页',
    icon: ({ color, size }) => <Icon name="home" color={color} size={size} />,
  });
```

这种方式更加简洁，减少了常量定义，提高了可维护性。