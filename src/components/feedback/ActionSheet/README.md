# ActionSheet 底部操作面板（iOS 风格）

- 自底部滑入、遮罩淡入；手势下拉关闭与点击遮罩关闭（默认开启）。
- iOS 风格按钮分组：主操作列表 + 独立“取消”按钮。
- 适配安全区（`useSafeAreaInsets`）。

## 安装与挂载

在自定义导航容器中挂载一次 `ActionSheetContainer`：

```tsx
import { ActionSheetContainer } from '@/components/feedback/ActionSheet';

<RNNavigationContainer>
  {children}
  <ToastContainer />
  <LoadingOverlayContainer />
  <DialogContainer />
  <ActionSheetContainer />
</RNNavigationContainer>
```

## 快速使用

### 选择操作（Promise 风格）

```ts
import { ActionSheet } from '@/components/feedback/ActionSheet';

const value = await ActionSheet.open({
  title: '请选择要执行的操作',
  actions: [
    { text: '复制', value: 'copy' },
    { text: '移动', value: 'move' },
    { text: '删除', role: 'destructive', value: 'delete' },
  ],
});

if (value === 'delete') {
  // 执行删除
}
```

### 非阻断展示

```ts
ActionSheet.show({
  title: '分享至',
  actions: [
    { text: '微信', value: 'weixin' },
    { text: '微博', value: 'weibo' },
  ],
  cancelable: true,        // 点击遮罩可取消（默认 true）
  enablePanToClose: true,  // 下拉手势关闭（默认 true）
});
```

## API

```ts
export interface ActionSheetOptions {
  title?: string;
  actions: { text: string; value?: any; role?: 'cancel' | 'destructive' | 'default' }[];
  cancelText?: string;          // 默认“取消”
  cancelable?: boolean;         // 默认 true
  enablePanToClose?: boolean;   // 默认 true
  blocking?: boolean;           // 默认 true
  maskColor?: string;           // 默认 rgba(0,0,0,0.45)
  animationDuration?: number;   // 默认 220ms
}

ActionSheet.open(options: ActionSheetOptions): Promise<any>; // 返回选择的 value；取消返回 false
ActionSheet.show(options: ActionSheetOptions): void;         // 仅展示，不关心返回值
ActionSheet.hide(): void;                                    // 关闭
```

## 设计说明

- 动画：遮罩淡入（`useFadeAnimation`）+ 面板自底部滑入（`Animated.timing` + `translateY`，按高度测量进入）。
- 手势：`PanResponder` 绑定 `translateY`，阈值 80 像素或较大下拉速度时触发关闭，失败回弹。
- 主题：背景/文本/分隔线/危险操作颜色来自主题；可按需扩展图标与列表样式。
- 层级：`zIndex: 9998`，与 Dialog/LoadingOverlay 协调。
