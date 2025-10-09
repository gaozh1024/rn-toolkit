# Feedback 组件建设清单与规范

面向通知、提示、空态与阻断式交互的反馈体系建设指南，统一风格、主题接入与导航方式。

**现状**
- 已有：Modal（支持标题、内容、位置、背景/遮罩、可关闭）
- 目录：<mcfolder name="feedback" path="/Users/gzh/Projects/framework/rn-toolkit/src/components/feedback"></mcfolder>

**目标**
- 提供轻提示、空态、操作面板、确认对话、加载遮罩与结果页等通用反馈能力。
- 与主题系统、导航系统协同：颜色/阴影/安全区/转场统一。

**建议组件（按优先级）**
- 优先级 1
  - Empty：空态占位组件（图标/标题/描述/操作）。
  - Toast：轻提示（自动消失/可配置时长/位置）。
  - Dialog：确认/警示对话框（阻断式、按钮组）。
  - ActionSheet：底部操作面板（iOS 风格，手势关闭）。
- 优先级 2
  - Snackbar：底部提示（可带操作按钮、支持安全区）。
  - LoadingOverlay：全局加载遮罩（阻断/半阻断、可取消）。
- 优先级 3
  - Result：结果页（成功/失败/网络错误等场景化反馈）。

**最小 API 草案**
- Empty
  - props：icon、title、description、actionText、onAction、style
- Toast
  - props：message、duration、position（top/center/bottom）、type（success/warning/error/info）、onClose
- Snackbar
  - props：message、actionText、onAction、duration、position="bottom"、safeArea、onClose
- Dialog
  - props：title、message、actions[{ text, type, onPress }]、closable、maskClosable
- ActionSheet
  - props：title、options[{ label, icon, onPress, destructive }]、cancelText、onCancel
- LoadingOverlay
  - props：visible、text、cancelable、onCancel、backgroundColor
- Result
  - props：status（success/error/warning/info/offline）、title、description、extra

**交互与主题要求**
- 主题：颜色/阴影/边框统一来自主题（light/dark 兼容）。
- 导航：路由化模态建议复用导航系统的 modals。
- 安全区：顶部/底部提示遵守 `useSafeAreaInsets`。

**目录与导出约定**
- 每个组件目录：`Component/Component.tsx`、`Component/index.ts`、`Component/README.md`
- 聚合导出：<mcfile name="index.ts" path="/Users/gzh/Projects/framework/rn-toolkit/src/components/feedback/index.ts"></mcfile>
  - `export * from './Modal';`
  - `export * from './Empty';`
  - `export * from './Toast';`
  - `export * from './Snackbar';`
  - `export * from './Dialog';`
  - `export * from './ActionSheet';`
  - `export * from './Loading';`
  - `export * from './Result';`

**使用示例**
- Modal（路由化展示）：
  - 使用导航构建器注册模态，并通过全局导航展示。
  - 参考：<mcfile name="NavigationService.ts" path="/Users/gzh/Projects/framework/rn-toolkit/src/navigation/services/NavigationService.ts"></mcfile> 的 `presentModal`
- Empty（列表空态）：
  - 与 <mcfile name="RefreshableList.tsx" path="/Users/gzh/Projects/framework/rn-toolkit/src/components/layout/RefreshableList/RefreshableList.tsx"></mcfile> 的 `emptyComponent`/`emptyText` 协作。
- Toast（轻提示）：
  - 与工具方法协作：例如复制成功后提示，参考 <mcfile name="ClipboardService.ts" path="/Users/gzh/Projects/framework/rn-toolkit/src/utils/ClipboardService.ts"></mcfile> 中相关注释。

**实施顺序（Roadmap）**
1. Empty、Toast、Dialog、ActionSheet（覆盖高频反馈场景）
2. Snackbar、LoadingOverlay（增强异步与操作提示）
3. Result（完善流程结束态）

**验收标准**
- 主题接入完整、亮/暗模式无视觉问题
- 动画与转场统一，交互无抖动
- API 简洁一致，文档与示例完善