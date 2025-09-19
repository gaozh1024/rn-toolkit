import { Navigation } from 'react-native-navigation';

export interface NavigationOptions {
  topBar?: {
    visible?: boolean;
    title?: {
      text?: string;
      color?: string;
    };
    background?: {
      color?: string;
    };
  };
  bottomTabs?: {
    visible?: boolean;
  };
  statusBar?: {
    visible?: boolean;
    style?: 'light' | 'dark';
  };
}

export interface ScreenComponent {
  name: string;
  component: React.ComponentType<any>;
  options?: NavigationOptions;
}

export interface TabItem {
  stack: {
    children: Array<{
      component: {
        name: string;
        options?: NavigationOptions;
      };
    }>;
    options?: {
      bottomTab?: {
        text?: string;
        icon?: any;
        selectedIcon?: any;
      };
    };
  };
}