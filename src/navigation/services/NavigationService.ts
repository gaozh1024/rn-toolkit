import { createNavigationContainerRef, StackActions, CommonActions } from '@react-navigation/native';
import { getGlobalDrawerController } from '../DrawerContext';

// 创建导航引用
export const navigationRef = createNavigationContainerRef();

/**
 * 简洁导航服务类
 * 提供全局导航操作功能
 */
class NavigationService {
  private static instance: NavigationService;

  static getInstance(): NavigationService {
    if (!NavigationService.instance) {
      NavigationService.instance = new NavigationService();
    }
    return NavigationService.instance;
  }

  /**
   * 关闭当前模态（弹出栈顶一层）
   */
  closeModal(): void {
    if (!navigationRef.current?.isReady()) {
      console.warn('NavigationService: Navigation not ready');
      return;
    }
    // 展示导航注册列表
    console.log('关闭模态', navigationRef.current.getState().routes);

    this.goBack()

    // 展示导航注册列表
    console.log('关闭模态后', navigationRef.current.getState().routes);
  }

  /**
   * 按名称打开模态（push）
   * name 为通过 NavigationBuilder.addModal 注册的屏幕名
   */
  openModal(name: string, params?: any): void {
    if (navigationRef.current?.isReady()) {
      // 展示导航注册列表
      console.log('打开模态', navigationRef.current.getState().routes);

      console.log('NavigationService: openModal (push)', name, params);
      this.navigate(name, params);
      console.log('打开模态后', navigationRef.current.getState().routes);
    } else {
      console.warn('NavigationService: Navigation not ready');
    }
  }

  /**
   * 导航到指定屏幕
   * @param name 屏幕名称
   * @param params 传递的参数
   */
  navigate(name: string, params?: any): void {
    if (navigationRef.current?.isReady()) {
      console.log('NavigationService: navigate to', name, params);
      const navigateAction = CommonActions.navigate({
        name,
        params,
      });
      navigationRef.current.dispatch(navigateAction);
    } else {
      console.warn('NavigationService: Navigation not ready');
    }
  }

  /**
   * 推送新屏幕到堆栈
   * @param name 屏幕名称
   * @param params 传递的参数
   */
  push(name: string, params?: any): void {
    if (navigationRef.current?.isReady()) {
      console.log('NavigationService: push to', name, params);
      navigationRef.current.dispatch(StackActions.push(name, params));
    } else {
      console.warn('NavigationService: Navigation not ready');
    }
  }

  /**
   * 弹出当前屏幕
   * @param count 弹出的屏幕数量，默认为1
   */
  pop(count: number = 1): void {
    if (navigationRef.current?.isReady()) {
      console.log('NavigationService: pop', count, 'screens');
      navigationRef.current.dispatch(StackActions.pop(count));
    } else {
      console.warn('NavigationService: Navigation not ready');
    }
  }

  /**
   * 弹出到根屏幕
   */
  popToRoot(): void {
    if (navigationRef.current?.isReady()) {
      console.log('NavigationService: popToRoot');
      navigationRef.current.dispatch(StackActions.popToTop());
    } else {
      console.warn('NavigationService: Navigation not ready');
    }
  }

  /**
   * 替换当前屏幕
   * @param name 新屏幕名称
   * @param params 传递的参数
   */
  replace(name: string, params?: any): void {
    if (navigationRef.current?.isReady()) {
      console.log('NavigationService: replace with', name, params);
      navigationRef.current.dispatch(StackActions.replace(name, params));
    } else {
      console.warn('NavigationService: Navigation not ready');
    }
  }

  /**
   * 重置导航堆栈
   * @param routes 新的路由数组
   */
  reset(routes: Array<{ name: string; params?: any }>): void {
    if (navigationRef.current?.isReady()) {
      console.log('NavigationService: reset with routes', routes);
      navigationRef.current.dispatch(
        CommonActions.reset({
          index: routes.length - 1,
          routes,
        })
      );
    } else {
      console.warn('NavigationService: Navigation not ready');
    }
  }

  /**
   * 返回上一屏幕
   */
  goBack(): void {
    if (navigationRef.current?.isReady() && navigationRef.current.canGoBack()) {
      console.log('NavigationService: goBack');
      navigationRef.current.goBack();
    } else {
      console.warn('NavigationService: Cannot go back or navigation not ready');
    }
  }

  /**
   * 获取当前路由名称
   * @returns 当前路由名称或undefined
   */
  getCurrentRouteName(): string | undefined {
    if (navigationRef.current?.isReady()) {
      const state = navigationRef.current.getRootState();
      return this.getActiveRouteName(state);
    }
    return undefined;
  }

  /**
   * 获取当前路由参数
   * @returns 当前路由参数
   */
  getCurrentParams(): any {
    if (navigationRef.current?.isReady()) {
      const state = navigationRef.current.getRootState();
      const route = this.getActiveRoute(state);
      return route?.params;
    }
    return undefined;
  }

  /**
   * 检查是否可以返回
   * @returns 是否可以返回
   */
  canGoBack(): boolean {
    return navigationRef.current?.canGoBack() ?? false;
  }

  /**
   * 获取导航状态
   * @returns 导航状态
   */
  getState(): any {
    return navigationRef.current?.getRootState();
  }

  /**
   * 检查导航是否准备就绪
   * @returns 是否准备就绪
   */
  isReady(): boolean {
    return navigationRef.current?.isReady() ?? false;
  }

  /**
   * 添加导航状态变化监听器
   * @param listener 监听器函数
   * @returns 移除监听器的函数
   */
  addStateChangeListener(listener: () => void): () => void {
    if (navigationRef.current) {
      return navigationRef.current.addListener('state', listener);
    }
    return () => { };
  }

  /**
   * 从导航状态中获取活跃路由名称
   * @param state 导航状态
   * @returns 活跃路由名称
   */
  private getActiveRouteName(state: any): string | undefined {
    const route = this.getActiveRoute(state);
    return route?.name;
  }

  /**
   * 从导航状态中获取活跃路由
   * @param state 导航状态
   * @returns 活跃路由
   */
  private getActiveRoute(state: any): any {
    if (!state || !state.routes || state.routes.length === 0) {
      return undefined;
    }

    const route = state.routes[state.index || 0];

    if (route.state) {
      return this.getActiveRoute(route.state);
    }

    return route;
  }

  openLeftDrawer(): void {
    try {
      getGlobalDrawerController().openLeft();
      console.log('NavigationService: openLeftDrawer');
    } catch (e) {
      console.warn('NavigationService: Drawer controller not set');
    }
  }

  closeLeftDrawer(): void {
    try {
      getGlobalDrawerController().closeLeft();
      console.log('NavigationService: closeLeftDrawer');
    } catch (e) {
      console.warn('NavigationService: Drawer controller not set');
    }
  }

  toggleLeftDrawer(): void {
    try {
      getGlobalDrawerController().toggleLeft();
      console.log('NavigationService: toggleLeftDrawer');
    } catch (e) {
      console.warn('NavigationService: Drawer controller not set');
    }
  }

  /**
   * 打开右侧抽屉
   */
  openRightDrawer(): void {
    try {
      getGlobalDrawerController().openRight();
      console.log('NavigationService: openRightDrawer');
    } catch (e) {
      console.warn('NavigationService: Drawer controller not set');
    }
  }

  /**
   * 关闭右侧抽屉
   */
  closeRightDrawer(): void {
    try {
      getGlobalDrawerController().closeRight();
      console.log('NavigationService: closeRightDrawer');
    } catch (e) {
      console.warn('NavigationService: Drawer controller not set');
    }
  }

  /**
   * 切换右侧抽屉状态
   */
  toggleRightDrawer(): void {
    try {
      getGlobalDrawerController().toggleRight();
      console.log('NavigationService: toggleRightDrawer');
    } catch (e) {
      console.warn('NavigationService: Drawer controller not set');
    }
  }

  /**
   * 查询左侧抽屉是否打开
   * @returns boolean
   */
  isLeftDrawerOpen(): boolean {
    try {
      return !!getGlobalDrawerController().isLeftOpen();
    } catch {
      return false;
    }
  }

  /**
   * 查询右侧抽屉是否打开
   * @returns boolean
   */
  isRightDrawerOpen(): boolean {
    try {
      return !!getGlobalDrawerController().isRightOpen();
    } catch {
      return false;
    }
  }

  /**
   * 查询是否有任一抽屉打开
   * @returns boolean
   */
  isAnyDrawerOpen(): boolean {
    return this.isLeftDrawerOpen() || this.isRightDrawerOpen();
  }
}

// 导出NavigationService类
export { NavigationService };

// 导出单例实例
export const navigationService = NavigationService.getInstance();

// 导出别名
export { navigationService as Navigation };

