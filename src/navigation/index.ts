// ===== 核心构建器 =====
export {
    NavigationBuilder,
    NavigationBuilderFactory,
    createNavigation,
    createThemedNavigation,
    createPlainNavigation,
    createMinimalTabNavigation,
    createFloatingTabNavigation,
    createModalNavigation,
    createTransparentNavigation,
} from './builders';

// ===== 组件 =====
export {
    StackNavigator,
    TabNavigator,
    NavigationContainer,
} from './components';

// ===== 服务 =====
export {
    navigationRef,
    NavigationService,
    navigationService,
    Navigation,
} from './services';

// ===== 工具函数 =====
export {
    NavigationUtils,
    NavigationGenerator,
    useNavigationUtils,
} from './utils';

// ===== 样式和主题 =====
export {
    NavigationThemes,
    StackPresets,
    TabPresets,
    AnimationPresets,
    getTransitionConfig,
} from './styles';

// ===== 类型定义 =====
export type {
    RootStackParamList,
    NavigationOptions,
    TransitionMode,
    ReactNavigationTheme,
    StackScreenComponent,
    TabScreenComponent,
    ScreenComponent,
    TabConfig,
    StackConfig,
    ScreenConfig,
    TabItem,
    NavigationProps,
    NavigationBuilderConfig,
} from './types';

// ===== 默认导出 =====
export { default } from './builders/NavigationBuilder';