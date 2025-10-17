# LoadingOverlay 全局加载遮罩

支持阻断/半阻断与可取消，淡入/淡出动画，适配主题颜色。

## 安装与挂载

在自定义导航容器中挂载（与 Toast 并列）：

```tsx
import { LoadingOverlayContainer } from '../../components/feedback/LoadingOverlay';

// 省略容器声明...
<RNNavigationContainer>
  {children}
  <ToastContainer />
  <LoadingOverlayContainer />
</RNNavigationContainer>
```

## API

- `LoadingOverlay.show(options?: LoadingOverlayOptions)`
  - `message?: string` 显示文案
  - `mode?: 'blocking' | 'semi'` 默认 `blocking`
  - `cancelable?: boolean` 是否可取消（默认 false）
  - `onCancel?: () => void` 取消回调（遮罩点击或按钮点击触发）
  - `maskColor?: string` 遮罩颜色（默认 blocking: `rgba(0,0,0,0.45)`, semi: `rgba(0,0,0,0.35)`）
  - `animationDuration?: number` 动画时长（默认 200ms）
- `LoadingOverlay.hide()` 隐藏遮罩

## 使用示例

### 阻断式（典型：提交中）

```ts
import { LoadingOverlay } from '@/components/feedback/LoadingOverlay';

async function submit() {
  LoadingOverlay.show({ message: '提交中...', mode: 'blocking' });
  try {
    await doAsyncWork();
  } finally {
    LoadingOverlay.hide();
  }
}
```

### 半阻断（允许底层交互，仅中心拦截）

```ts
LoadingOverlay.show({ message: '同步中...', mode: 'semi' });
// ... 用户仍可滚动或点击非中心区域
```

### 可取消

```ts
LoadingOverlay.show({
  message: '正在处理...',
  mode: 'blocking',
  cancelable: true,
  onCancel: () => abortController.abort(),
});
```

## 设计说明

- 动画使用 `Animated` 原生驱动，低开销且不依赖 Reanimated。
- 半阻断通过 `pointerEvents='box-none'` 让底层交互穿透，中心卡片保持拦截。
- 主题色优先读取 `theme.colors.background/textPrimary`，其他颜色可通过 `maskColor` 自定义。
- Z 轴层级为 `zIndex: 9999`，如需变更可在容器样式调整。

## 常见问题

- 需要安全区适配？容器本身居中显示，不依赖安全区；如需在刘海/底部跟随，可按需读取 `useSafeAreaInsets` 并加内边距。
- 与 Modal/Toast 叠加顺序：确保 `LoadingOverlayContainer` 放在树的末尾，层级更高。