import { Navigation } from 'react-native-navigation';
import { ScreenComponent, NavigationOptions, TabItem } from './types';

class NavigationService {
  private static instance: NavigationService;
  private currentComponentId: string = '';

  static getInstance(): NavigationService {
    if (!NavigationService.instance) {
      NavigationService.instance = new NavigationService();
    }
    return NavigationService.instance;
  }

  // 注册屏幕组件
  registerScreens(screens: ScreenComponent[]): void {
    screens.forEach(screen => {
      Navigation.registerComponent(screen.name, () => screen.component);
    });
  }

  // 设置当前组件ID
  setCurrentComponentId(componentId: string): void {
    this.currentComponentId = componentId;
  }

  // 启动单屏应用
  startSingleScreenApp(screenName: string, options?: NavigationOptions): void {
    Navigation.setRoot({
      root: {
        stack: {
          children: [
            {
              component: {
                name: screenName,
                options: options || {}
              }
            }
          ]
        }
      }
    });
  }

  // 启动标签页应用
  startTabBasedApp(tabs: TabItem[]): void {
    Navigation.setRoot({
      root: {
        bottomTabs: {
          children: tabs
        }
      }
    });
  }

  // 推送新屏幕
  push(screenName: string, options?: NavigationOptions, passProps?: any): void {
    Navigation.push(this.currentComponentId, {
      component: {
        name: screenName,
        options: options || {},
        passProps: passProps || {}
      }
    });
  }

  // 弹出当前屏幕
  pop(): void {
    Navigation.pop(this.currentComponentId);
  }

  // 弹出到根屏幕
  popToRoot(): void {
    Navigation.popToRoot(this.currentComponentId);
  }

  // 显示模态框
  showModal(screenName: string, options?: NavigationOptions, passProps?: any): void {
    Navigation.showModal({
      stack: {
        children: [
          {
            component: {
              name: screenName,
              options: options || {},
              passProps: passProps || {}
            }
          }
        ]
      }
    });
  }

  // 关闭模态框
  dismissModal(): void {
    Navigation.dismissModal(this.currentComponentId);
  }

  // 更新导航选项
  mergeOptions(options: NavigationOptions): void {
    Navigation.mergeOptions(this.currentComponentId, options);
  }
}

export default NavigationService.getInstance();