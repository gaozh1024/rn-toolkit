# Feedback 组件总览

面向通知、提示、空态与阻断式交互的反馈组件集合，统一风格、主题接入与导航方式。

## 快速开始

- 从聚合导出中引入反馈组件与容器
- 在应用根部挂载需要的容器（Toast/Snackbar/LoadingOverlay 等）

```tsx
import React from 'react';
import { View } from 'react-native';
import {
  // 容器
  ToastContainer,
  SnackbarContainer,
  LoadingOverlayContainer,
  DialogContainer,
  ActionSheetContainer,
  // 服务（示例）
  ToastService,
  SnackbarService,
  LoadingOverlayService,
} from '@gaozh1024/rn-toolkit';

export default function AppRoot() {
  return (
    <View style={{ flex: 1 }}>
      {/* 你的导航或页面 */}

      {/* 全局容器（按需挂载）*/}
      <ToastContainer />
      <SnackbarContainer />
      <LoadingOverlayContainer />
      <DialogContainer />
      <ActionSheetContainer />
    </View>
  );
}

// 在任意位置触发服务
ToastService.show({ message: '操作成功', duration: 2000, position: 'bottom' });
SnackbarService.show({ message: '已保存', actionText: '撤销', onAction: () => {} });
LoadingOverlayService.show({ text: '加载中...', cancelable: false });
LoadingOverlayService.hide();
```

## 导入与导出

- 统一从 `src/components/feedback/index.ts` 聚合导出引入
- 与主题系统协作：颜色/阴影/字体/安全区统一（详见主题文档）

## 组件文档索引

以下链接指向每个组件的详细 README 使用说明：

- [ActionSheet 底部操作面板](./ActionSheet/README.md)
- [Dialog 对话框](./Dialog/README.md)
- [Empty 空态](./Empty/README.md)
- [LoadingOverlay 加载遮罩](./LoadingOverlay/README.md)
- [Modal 模态页](./Modal/README.md)
- [Result 结果页](./Result/README.md)
- [Snackbar 底部提示](./Snackbar/README.md)
- [Toast 轻提示](./Toast/README.md)

## 交互与主题

- 主题：颜色/阴影/边框统一来自主题（light/dark 兼容）
- 安全区：顶部/底部提示遵守 `useSafeAreaInsets`
- 动画：统一使用动画工具（淡入淡出、位移），避免交互抖动

## 最佳实践

- 根据场景选择组件：阻断用 Dialog/Modal；非阻断用 Toast/Snackbar
- 页面空态使用 Empty，并配合明确行动按钮（刷新/重试/创建）
- 全局加载场景使用 LoadingOverlay，支持阻断与可取消
- 结果页使用 Result，提供清晰的下一步（返回/重试/查看详情）
