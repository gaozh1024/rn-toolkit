import { createNavigationContainerRef, StackActions, CommonActions } from '@react-navigation/native';
import { ScreenComponent, RootStackParamList } from './types';

// 创建带类型的导航引用
export const navigationRef = createNavigationContainerRef<RootStackParamList>();

class NavigationService {
  private static instance: NavigationService;
  private screens: Map<string, React.ComponentType<any>> = new Map();

  static getInstance(): NavigationService {
    if (!NavigationService.instance) {
      NavigationService.instance = new NavigationService();
    }
    return NavigationService.instance;
  }

  // 注册屏幕组件
  registerScreens(screens: ScreenComponent[]): void {
    screens.forEach(screen => {
      this.screens.set(screen.name, screen.component);
    });
  }

  // 获取注册的屏幕组件
  getScreen(name: string): React.ComponentType<any> | undefined {
    return this.screens.get(name);
  }

  // 获取所有注册的屏幕
  getAllScreens(): Map<string, React.ComponentType<any>> {
    return this.screens;
  }

  // 导航到指定屏幕 - 使用 dispatch 方式避免类型问题
  navigate(name: string, params?: any): void {
    if (navigationRef.isReady()) {
      const navigateAction = CommonActions.navigate({
        name,
        params,
      });
      navigationRef.dispatch(navigateAction);
    }
  }

  // 推送新屏幕到堆栈
  push(name: string, params?: any): void {
    if (navigationRef.isReady()) {
      navigationRef.dispatch(StackActions.push(name, params));
    }
  }

  // 弹出当前屏幕
  pop(): void {
    if (navigationRef.isReady()) {
      navigationRef.dispatch(StackActions.pop());
    }
  }

  // 弹出到根屏幕
  popToRoot(): void {
    if (navigationRef.isReady()) {
      navigationRef.dispatch(StackActions.popToTop());
    }
  }

  // 替换当前屏幕
  replace(name: string, params?: any): void {
    if (navigationRef.isReady()) {
      navigationRef.dispatch(StackActions.replace(name, params));
    }
  }

  // 重置导航堆栈
  reset(routes: Array<{ name: string; params?: any }>): void {
    if (navigationRef.isReady()) {
      navigationRef.dispatch(
        CommonActions.reset({
          index: routes.length - 1,
          routes: routes,
        })
      );
    }
  }

  // 返回上一屏幕
  goBack(): void {
    if (navigationRef.isReady()) {
      navigationRef.goBack();
    }
  }

  // 获取当前路由名称
  getCurrentRouteName(): string | undefined {
    if (navigationRef.isReady()) {
      return navigationRef.getCurrentRoute()?.name;
    }
    return undefined;
  }

  // 获取当前路由参数
  getCurrentParams(): any {
    if (navigationRef.isReady()) {
      return navigationRef.getCurrentRoute()?.params;
    }
    return undefined;
  }

  // 检查是否可以返回
  canGoBack(): boolean {
    return navigationRef.isReady() ? navigationRef.canGoBack() : false;
  }
}

// 导出类（用于类型定义和扩展）
export { NavigationService };

// 导出实例（主要使用方式）
export const navigationService = NavigationService.getInstance();

// 提供别名导出，更符合命名习惯
export { navigationService as Navigation };