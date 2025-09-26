# 🧭 Navigation 导航系统

现代化的 React Navigation 封装库，提供类型安全、主题化和链式调用的导航配置体验。

## ✨ 特性

- 🔗 **链式调用 API** - 直观的构建器模式
- 🎨 **主题系统** - 内置深色/浅色主题支持
- 📱 **动画预设** - 丰富的页面过渡动画
- 🛡️ **类型安全** - 完整的 TypeScript 支持
- 🏗️ **工厂模式** - 多种便捷创建方式
- 🎯 **Hook 集成** - 现代化的 React Hook 支持

## 🚀 快速开始

### 基础用法

```typescript
import { createNavigation } from '@/navigation';
import { HomeScreen, ProfileScreen, DetailsScreen } from '@/screens';

// 创建应用导航
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
  .buildRootNavigation();

export default function App() {
  return <AppNavigation />;
}
```

### 主题化导航

```typescript
import { createThemedNavigation } from '@/navigation';

const ThemedNavigation = createThemedNavigation({
  tabPreset: 'floating',
  stackPreset: 'transparent',
  animationPreset: 'fade'
})
  .addTab('home', HomeScreen)
  .addTab('settings', SettingsScreen)
  .buildRootNavigation();
```

## 📚 API 参考

### 构建器方法

#### `addTab(name, component, config?)`

添加标签页屏幕。

```typescript
builder.addTab('home', HomeScreen, {
  title: '首页',
  icon: ({ color, size, focused }) => (
    <Icon name="home" color={color} size={size} />
  ),
  badge: '5',
  options: {
    tabBarBadge: '新',
    tabBarTestID: 'home-tab'
  }
});
```

**参数：**
- `name: string` - 路由名称
- `component: React.ComponentType` - 屏幕组件
- `config?: TabBuilderConfig` - 标签页配置

#### `addScreen(name, component, config?)`

添加堆栈屏幕。

```typescript
builder.addScreen('details', DetailsScreen, {
  title: '详情页',
  transitionMode: 'modalIOS',
  options: {
    presentation: 'modal',
    gestureEnabled: true
  }
});
```

**参数：**
- `name: string` - 路由名称
- `component: React.ComponentType` - 屏幕组件
- `config?: ScreenBuilderConfig` - 屏幕配置

#### `configure(config)`

设置全局配置。

```typescript
builder.configure({
  enableTheme: true,
  tabPreset: 'minimal',
  stackPreset: 'headerless',
  animationPreset: 'slideHorizontal'
});
```

### 构建方法

#### `buildRootNavigation()`

构建包含 `NavigationContainer` 的根导航，适用于应用入口。

```typescript
const RootNavigation = builder.buildRootNavigation();

// 使用
export default function App() {
  return <RootNavigation />;
}
```

#### `buildFullNavigation()`

构建完整导航结构但不包含容器，需要手动包装。

```typescript
const AppNavigator = builder.buildFullNavigation();

// 使用
export default function App() {
  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
}
```

#### `buildTabNavigator()`

仅构建标签页导航器。

```typescript
const TabsNavigator = builder.buildTabNavigator();
```

#### `buildStackNavigator()`

仅构建堆栈导航器。

```typescript
const StackNavigator = builder.buildStackNavigator();
```

### 工厂函数

#### `createNavigation(config?)`

创建基础导航构建器。

```typescript
const builder = createNavigation({
  enableTheme: false,
  initialTabRoute: 'home'
});
```

#### `createThemedNavigation(config?)`

创建启用主题的导航构建器。

```typescript
const builder = createThemedNavigation({
  tabPreset: 'floating',
  stackPreset: 'modal'
});
```

#### `createPlainNavigation(config?)`

创建无主题的简洁导航构建器。

```typescript
const builder = createPlainNavigation();
```

#### 预设工厂函数

```typescript
// 最小化标签页导航
const builder = createMinimalTabNavigation();

// 浮动标签页导航
const builder = createFloatingTabNavigation();

// 模态堆栈导航
const builder = createModalNavigation();

// 透明堆栈导航
const builder = createTransparentNavigation();
```

## 🎨 主题系统

### 使用主题 Hook

```typescript
import { useNavigationUtils } from '@/navigation';

function MyScreen() {
  const { theme, stackStyles, tabStyles, utils, generator } = useNavigationUtils();
  
  return (
    <View style={{ backgroundColor: theme.colors.background }}>
      {/* 你的内容 */}
    </View>
  );
}
```

### 主题预设

#### 标签页主题预设

- `default` - 默认主题
- `minimal` - 最小化主题
- `floating` - 浮动主题

#### 堆栈主题预设

- `default` - 默认主题
- `transparent` - 透明主题
- `modal` - 模态主题
- `headerless` - 无头部主题

### 动画预设

- `slideHorizontal` - 水平滑动
- `slideVertical` - 垂直滑动
- `fade` - 淡入淡出
- `scale` - 缩放动画
- `none` - 无动画

## 🛠️ 工具函数

### NavigationUtils

静态工具类，提供导航相关的实用方法。

```typescript
import { NavigationUtils } from '@/navigation';

// 获取堆栈选项
const stackOptions = NavigationUtils.getStackOptions('modal');

// 获取标签页选项
const tabOptions = NavigationUtils.getTabOptions('floating');

// 创建动画堆栈
const animatedStack = NavigationUtils.createAnimatedStack('fade');

// 创建过渡动画
const transition = NavigationUtils.createTransition('modalIOS');
```

### NavigationGenerator

选项生成器，提供预配置的导航选项。

```typescript
import { NavigationGenerator } from '@/navigation';

// 堆栈选项
const stackOptions = NavigationGenerator.stack.modal();
const animatedOptions = NavigationGenerator.stack.animated('fade');

// 标签页选项
const tabOptions = NavigationGenerator.tab.floating();

// 过渡动画
const transition = NavigationGenerator.transition.modal();
```

## 📱 使用场景

### 场景 1：简单的标签页应用

```typescript
const SimpleApp = createNavigation()
  .addTab('home', HomeScreen, { title: '首页' })
  .addTab('profile', ProfileScreen, { title: '我的' })
  .buildRootNavigation();
```

### 场景 2：带模态页面的应用

```typescript
const ModalApp = createThemedNavigation()
  .addTab('home', HomeScreen)
  .addTab('explore', ExploreScreen)
  .addScreen('modal', ModalScreen, {
    transitionMode: 'modalIOS',
    options: { presentation: 'modal' }
  })
  .buildRootNavigation();
```

### 场景 3：嵌套导航

```typescript
// 子导航
const SubTabs = createNavigation()
  .addTab('tab1', Tab1Screen)
  .addTab('tab2', Tab2Screen)
  .buildTabNavigator();

// 主导航
const MainApp = createNavigation()
  .addTab('main', MainScreen)
  .addScreen('subTabs', SubTabs)
  .buildRootNavigation();
```

### 场景 4：自定义主题

```typescript
const CustomApp = createThemedNavigation({
  tabPreset: 'floating',
  stackPreset: 'transparent',
  animationPreset: 'fade'
})
  .configure({
    initialTabRoute: 'dashboard',
    defaultTransitionMode: 'fadeAndroid'
  })
  .addTab('dashboard', DashboardScreen, {
    icon: ({ color, size }) => <DashboardIcon color={color} size={size} />
  })
  .addTab('analytics', AnalyticsScreen, {
    icon: ({ color, size }) => <AnalyticsIcon color={color} size={size} />
  })
  .buildRootNavigation();
```

## ⚠️ 注意事项

### NavigationContainer 嵌套

为避免 `NavigationContainer` 嵌套错误，请根据使用场景选择合适的构建方法：

- **应用根部**：使用 `buildRootNavigation()`
- **手动控制容器**：使用 `buildFullNavigation()`
- **嵌套使用**：使用 `buildTabNavigator()` 或 `buildStackNavigator()`

### 类型安全

所有方法都提供完整的 TypeScript 类型支持：

```typescript
// 类型安全的路由参数
type RootStackParamList = {
  Home: undefined;
  Profile: { userId: string };
  Details: { itemId: number };
};

// 在组件中使用
function ProfileScreen({ route }: { route: RouteProp<RootStackParamList, 'Profile'> }) {
  const { userId } = route.params; // 类型安全
}
```

## 🔧 高级用法

### 自定义导航服务

```typescript
import { NavigationService } from '@/navigation';

// 编程式导航
NavigationService.navigate('Details', { itemId: 123 });
NavigationService.goBack();
NavigationService.reset('Home');
```

### 动态配置

```typescript
const builder = createNavigation();

// 根据条件添加屏幕
if (userIsLoggedIn) {
  builder.addTab('profile', ProfileScreen);
} else {
  builder.addScreen('login', LoginScreen);
}

const Navigation = builder.buildRootNavigation();
```

### 性能优化

```typescript
// 懒加载屏幕
const LazyScreen = React.lazy(() => import('./LazyScreen'));

const OptimizedApp = createNavigation()
  .addTab('home', HomeScreen)
  .addScreen('lazy', LazyScreen)
  .buildRootNavigation();
```

## 📄 许可证

MIT License