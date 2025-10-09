# Dialog 确认/警示对话框

阻断式弹窗，支持按钮组、可取消遮罩与动画（scale + fade）。

## 安装与挂载
在自定义导航容器中挂载一次 `DialogContainer`：

```tsx
import { DialogContainer } from '@/components/feedback/Dialog';

<RNNavigationContainer>
  {children}
  <ToastContainer />
  <LoadingOverlayContainer />
  <DialogContainer />
</RNNavigationContainer>
```

## 快速使用

### Alert
```ts
import { Dialog } from '@/components/feedback/Dialog';

await Dialog.alert({ title: '提示', message: '操作完成', type: 'info' });
```

### Confirm
```ts
const ok = await Dialog.confirm({ title: '确认删除', message: '删除后不可恢复', type: 'warning', cancelable: false });
if (ok) {
  // 执行删除
}
```

### 自定义按钮组
```ts
Dialog.show({
  title: '选择操作',
  message: '请选择要执行的操作',
  actions: [
    { text: '复制', value: 'copy' },
    { text: '移动', value: 'move' },
    { text: '删除', role: 'destructive', value: 'delete' },
    { text: '取消', role: 'cancel' },
  ],
});
```

## API
```ts
export type DialogType = 'info' | 'warning' | 'error' | 'success';

Dialog.alert(options: Omit<DialogOptions, 'actions'>): Promise<void>;
Dialog.confirm(options: Omit<DialogOptions, 'actions'>): Promise<boolean>;
Dialog.show(options: DialogOptions): void; // 自定义按钮组
Dialog.hide(): void;

interface DialogOptions {
  title?: string;
  message?: string;
  type?: DialogType;
  blocking?: boolean;          // 是否阻断（默认 true）
  cancelable?: boolean;        // 点击遮罩是否可取消（默认 false）
  confirmText?: string;        // 确认文案（Alert/Confirm）
  cancelText?: string;         // 取消文案（Confirm）
  actions?: { text: string; role?: 'cancel' | 'destructive' | 'default'; value?: any; }[];
  maskColor?: string;          // 遮罩色（默认 rgba(0,0,0,0.45)）
  animationDuration?: number;  // 动画时长（默认 200ms）
}
```

## 设计说明
- 动画：卡片缩放 + 遮罩淡入；关闭时淡出后移除，避免瞬间消失。
- 交互：阻断式遮罩，`cancelable` 为 `true` 时点击遮罩触发取消。
- 主题：卡片背景与文字颜色来自主题；遮罩色可覆盖。
- 层级：`zIndex: 9998`，保证与 LoadingOverlay（9999）层级协调。

## 常见问题
- 想要非阻断？将 `blocking` 保持为 true，但设置 `cancelable: true` 允许点击遮罩关闭；若需“半阻断”请考虑使用 LoadingOverlay。
- 需要图标/类型样式？可根据 `type` 在容器内扩展图标与色彩方案（后续可接入 UI/Icon）。