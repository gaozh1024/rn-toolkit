# Toast 轻提示

- 全局触发、自动消失、可配置时长与位置
- 位置：`top` | `center` | `bottom`（默认 `bottom`）
- 默认时长：`2000ms`

## 安装与挂载
在应用根部挂载一次 `ToastContainer`。例如：

```tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { ToastContainer } from '@gaozh1024/rn-toolkit';

export default function App() {
  return (
    <NavigationContainer>
      {/* 其他导航与页面 */}
      <ToastContainer />
    </NavigationContainer>
  );
}
```

## 触发使用
任意位置调用：

```ts
import { ToastService } from '@gaozh1024/rn-toolkit';

ToastService.show({ message: '已复制到剪贴板', duration: 1500, position: 'top' });
ToastService.show({ message: '保存成功', position: 'bottom' }); // 默认 2000ms
ToastService.show({ message: '网络异常，请稍后重试', duration: 3000, position: 'center' });
```

## API
```ts
ToastService.show({
  message: string; // 必填
  duration?: number; // 毫秒，默认 2000
  position?: 'top' | 'center' | 'bottom'; // 默认 bottom
});
```

## 注意事项
- 请确保 `ToastContainer` 仅挂载一次（通常在 App 根）。
- Toast 不拦截触控事件（外层 `pointerEvents` 为 `box-none`）。
- 动画使用 `useFadeAnimation`，淡入/淡出 150ms，可按需调整。