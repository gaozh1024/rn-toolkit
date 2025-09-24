// 导航容器和导航器
export { 
  NavigationContainer, 
  StackNavigator, 
  TabNavigator 
} from './NavigationContainer';

// 导航服务
export { 
  NavigationService, 
  navigationService, 
  Navigation,
  navigationRef 
} from './NavigationService';

// 导航配置生成器 - 新增
export { 
  NavigationBuilder, 
  createNavigation 
} from './NavigationBuilder';

// 类型定义
export type {
  RootStackParamList,
  NavigationOptions,
  StackScreenComponent,
  TabScreenComponent,
  ScreenComponent,
  TabItem,
  NavigationProps,
  ScreenConfig,
  StackConfig,
  TabConfig as NavigationTabConfig
} from './types';

// 导航配置生成器类型 - 新增
export type {
  TabConfig,
  ScreenConfig as NavigationScreenConfig,
  NavigationConfig
} from './NavigationBuilder';

// 工具函数和样式
export {
  NavigationStyles,
  TabStyles,
  NavigationAnimations,
  getThemedNavigationOptions,
  createThemedNavigationStyles,
  createThemedTabStyles
} from './utils';

// 默认导出导航容器
export { default } from './NavigationContainer';
