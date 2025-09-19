import { NavigationOptions } from './types';

// 预设的导航样式
export const NavigationStyles = {
  // 透明导航栏
  transparent: (): NavigationOptions => ({
    topBar: {
      background: {
        color: 'transparent'
      }
    }
  }),

  // 隐藏导航栏
  hidden: (): NavigationOptions => ({
    topBar: {
      visible: false
    }
  }),

  // 深色主题
  dark: (): NavigationOptions => ({
    topBar: {
      background: {
        color: '#000000'
      },
      title: {
        color: '#ffffff'
      }
    },
    statusBar: {
      style: 'light'
    }
  }),

  // 浅色主题
  light: (): NavigationOptions => ({
    topBar: {
      background: {
        color: '#ffffff'
      },
      title: {
        color: '#000000'
      }
    },
    statusBar: {
      style: 'dark'
    }
  })
};