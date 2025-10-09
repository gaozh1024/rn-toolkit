# Snackbar 底部提示（可带操作按钮、支持安全区）

- 不阻断交互：仅提示条可点击，外层不拦截触控。
- 动画：淡入 + 自底部轻微上滑；自动消失（默认 3000ms）。
- 安全区：默认遵守底部 `safeArea`，在全面屏设备避免遮挡。

## 安装与挂载
在自定义导航容器中挂载一次 `SnackbarContainer`：

```tsx
import { SnackbarContainer } from '@/components/feedback/Snackbar';

<RNNavigationContainer>
  {children}
  <ToastContainer />
  <LoadingOverlayContainer />
  <DialogContainer />
  <ActionSheetContainer />
  <SnackbarContainer />
</RNNavigationContainer>
```

## 使用示例

### 简单提示
```ts
import { Snackbar } from '@/components/feedback/Snackbar';

Snackbar.show({ message: '已保存至草稿' });
```

### 带操作按钮
```ts
Snackbar.show({
  message: '已删除项目',
  actionText: '撤销',
  onAction: () => restoreItem(),
});
```

### 自定义时长与安全区
```ts
Snackbar.show({ message: '网络恢复', duration: 1500, safeArea: true });
```

## API
```ts
export interface SnackbarOptions {
  message: string;
  duration?: number;      // 默认 3000ms
  actionText?: string;    // 操作按钮文案
  onAction?: () => void;  // 点击操作按钮回调
  safeArea?: boolean;     // 是否遵守底部安全区（默认 true）
  onClose?: () => void;   // 关闭回调（自动/手动）
}

Snackbar.show(options: SnackbarOptions): void;
Snackbar.hide(): void; // 立即关闭
```

## 设计说明
- 风格：深色背景、浅色文本，操作按钮使用主题主色；上限宽度 95%。
- 动画：`useFadeAnimation` 控制透明度；`Animated.timing + translateY` 控制上滑。
- 层级：`zIndex: 9999`，与 Toast 一致；如叠加，注意提示时序。
- 交互：条目本身响应点击；自动消失后触发 `onClose`，点击操作触发 `onAction` 并立即关闭。