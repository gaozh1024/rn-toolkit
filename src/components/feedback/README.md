# Feedback 组件建设清单与规范

本文件用于在 `feedback` 目录中跟踪用户反馈类组件（消息提示、弹窗、气泡等）的建设进度、统一规范与主题接入要求，便于你按清单逐步完成。

## 现状

已完成的组件与基础设施：
- [x] Modal（通用弹窗）：
  - 组件：`Modal/Modal.tsx`
  - Provider：`Modal/ModalProvider.tsx`
  - Service：`Modal/ModalService.ts`
  - Hook：`Modal/useModal.ts`
  - 文档与示例：`Modal/README.md`、`examples.md`、`advanced-examples.md`、`service-examples.md`

这说明反馈体系已经具备 Provider + Service 的基础架构，可复用到其他反馈组件（Toast、Snackbar、Dialog 等）。

---

## 缺口清单（建议优先顺序）

优先级 1：核心消息提示与交互
- [ ] Toast（轻量提示）
  - props：`message`、`type`（`success`/`info`/`warning`/`error`）、`duration`、`position`（`top`/`bottom`）、`icon`、`onPress`、`action`（可选）
  - 能力：队列/合并策略、自动消失、手势滑动关闭（可选）、安全区适配
  - Provider + Service：`ToastProvider` + `ToastService`（支持全局调用）
- [ ] Snackbar（可操作提示条）
  - props：`message`、`actionLabel`、`onAction`、`duration`、`position`（通常 `bottom`）、`icon`
  - 能力：滑动关闭、叠加与优先级、SafeArea 适配
  - Provider + Service：`SnackbarProvider` + `SnackbarService`
- [ ] Alert / Confirm（快速确认弹窗）
  - props：`title`、`description`、`icon`、`buttons`（如 `[ { text, type, onPress } ]`）、`cancellable`
  - 能力：键盘焦点管理、无障碍（`accessibilityRole="alert"`）、统一按钮语义与样式
  - Provider + Service：`DialogProvider` + `DialogService`（可基于现有 Modal 扩展）

优先级 2：覆盖层与轻量交互
- [ ] BottomSheet（底部滑出面板）
  - props：`visible`、`snapPoints`、`onClose`、`dismissible`、`backdrop`、`header`/`footer` 插槽
  - 能力：拖拽手势、回弹动效、内容滚动与键盘适配
  - Provider + Service：`BottomSheetProvider` + `BottomSheetService`
- [ ] ActionSheet（操作列表）
  - props：`options`（`label`/`value`/`icon`/`disabled`）、`cancelButtonIndex`、`destructiveButtonIndex`、`onSelect`
  - 能力：与 BottomSheet 共用基础设施 / 或独立实现；iOS/Android 行为一致性
  - Provider + Service：`ActionSheetProvider` + `ActionSheetService`

优先级 3：气泡与指示
- [ ] Tooltip（提示气泡）
  - props：`content`、`placement`（`top`/`bottom`/`left`/`right`）、`visible`、`trigger`（`hover`/`press`/`longPress`）、`delay`
  - 能力：箭头、边界避让、按外关闭
  - Provider（可选，更多是局部使用）
- [ ] Popover（指向性浮层）
  - props：`anchorRef`/`anchorRect`、`placement`、`offset`、`visible`、`onClose`
  - 能力：与 Tooltip 类似但支持更复杂内容与交互；需要定位与边界避让

优先级 4：页面级提示与占位
- [ ] Banner（页面顶部公告/提示）
  - props：`message`、`type`、`icon`、`closable`、`actions`、`sticky`
  - 能力：与页面滚动配合、SafeArea 顶部留白
- [ ] LoadingOverlay（全局/局部加载覆盖）
  - props：`visible`、`text`、`cancellable`、`blockTouches`
  - 能力：与主题化 Spinner 组合（Spinner 属于 UI 层，但可在此组合）
- [ ] Result / EmptyState（结果/空态）
  - props：`status`（`success`/`error`/`info`/`empty`）、`title`、`description`、`icon`、`actions`
  - 能力：统一页面级反馈样式

---

## 统一规范（反馈组件需遵循）

1) 主题与颜色
- 所有颜色来自主题 tokens，不得硬编码：
  - `toast`: background、text、success/warning/error/info
  - `snackbar`: background、text、actionColor
  - `dialog`: surface、border、titleColor、textColor、buttonColors
  - `overlay`: backdropColor（暗色模式需区分）
  - `bottomSheet`: surface、handleColor、shadow
  - `tooltip/popover`: background、border、shadow、textColor
  - `banner`: background、text、border、iconColor
- 支持暗色模式与禁用/危险态对比度要求

2) 动画与交互
- 动画统一使用 `animation` 模块的预设与 hooks（如存在），支持进入/退出动画
- 优先支持按压反馈与可取消（`dismissible`），栈管理与队列策略清晰

3) 无障碍（Accessibility）
- 为 Alert/Dialog/ActionSheet 标注正确的 `accessibilityRole`
- Toast/Snackbar 文本可被读屏读取，提供合理的可见时长与可关闭操作

4) Provider + Service 架构
- 每类组件提供 Provider（上下文 + 队列/栈管理）
- 提供 Service 全局调用 API（如 `ToastService.show({ message })`）
- 可与 `ModalProvider` 共享 Overlay 层级与交互规范（zIndex、遮罩）

5) SafeArea 与层级
- 顶部/底部组件需考虑 `SafeArea`（刘海屏、Home Indicator）
- 一致的分层策略：`zIndex`、叠层关系（Toast/Snackbar < Dialog < ActionSheet/BottomSheet）

---

## 建议实施顺序（Roadmap）

1. Toast → Snackbar → Alert/Confirm（共用 Dialog 基础）
2. Tooltip → Popover（定位与边界避让）
3. BottomSheet → ActionSheet（手势与列表交互）
4. Banner → LoadingOverlay → Result/EmptyState（页面级反馈）

---

## 最小 API 草案（便于逐项实现）

- Toast
  - `show(options: { message: string; type?: 'success' | 'info' | 'warning' | 'error'; duration?: number; position?: 'top' | 'bottom'; icon?: string; onPress?: () => void; })`
  - Provider 管理队列、合并相同消息策略、最大同时展示数

- Snackbar
  - `show({ message, actionLabel, onAction, duration, icon })`
  - 支持手势关闭与安全区适配

- Dialog / Alert / Confirm
  - `alert({ title, description, icon, buttons })`
  - `confirm({ title, description, icon, okText, cancelText, onOk, onCancel })`
  - 基于 Modal 复用动画与遮罩

- BottomSheet
  - `present({ content, snapPoints, onClose, dismissible, backdrop })`
  - 手势拖拽与回弹，内容滚动

- ActionSheet
  - `show({ options: Array<{ label, value, icon?, disabled? }>, cancelButtonIndex?, destructiveButtonIndex?, onSelect })`

- Tooltip / Popover
  - 组件用法为主（不一定走 Service）：`<Tooltip content="..." placement="top">...</Tooltip>`

- Banner
  - `show({ message, type, icon, closable, actions })`（全局或局部）

- LoadingOverlay
  - `show({ text, cancellable })` / `hide()`

- Result / EmptyState
  - 组件用法：`<Result status="empty" title="暂无数据" description="..." actions={[...]} />`

---

## 主题 Tokens 建议增补（示例命名）

- `feedback.toast`: `background`, `text`, `success`, `warning`, `error`, `info`
- `feedback.snackbar`: `background`, `text`, `action`
- `feedback.dialog`: `surface`, `border`, `titleColor`, `textColor`, `buttonPrimary`, `buttonSecondary`
- `feedback.overlay`: `backdropLight`, `backdropDark`
- `feedback.bottomSheet`: `surface`, `handleColor`, `shadow`
- `feedback.tooltip`: `background`, `border`, `shadow`, `textColor`
- `feedback.banner`: `background`, `text`, `border`, `iconColor`

可根据 `ThemeService` 的结构将上述 tokens 按模块归入 `theme.button/theme.text/theme.colors` 等适合位置，或新增 `theme.feedback` 分支。

---

## Provider 接入建议（示例）

App 根节点建议统一挂载各 Provider，并保持层级顺序：

```tsx
<ModalProvider>
  <ToastProvider>
    <SnackbarProvider>
      <BottomSheetProvider>
        {/* App 内容 */}
      </BottomSheetProvider>
    </SnackbarProvider>
  </ToastProvider>
</ModalProvider>
```

---

## 验收标准（Definition of Done）

- 不出现硬编码颜色，全部来源主题 tokens，暗色模式适配良好
- 支持基本交互：展示/关闭、队列或栈管理、动画一致
- Provider + Service API 统一、文档与示例完备
- 无障碍可用（朗读、焦点、按键）
- 与 SafeArea、层级（zIndex）兼容无 UI 问题
- 与现有 `Modal` 架构一致、复用度高

---

如果你愿意，我可以先从 `ToastProvider + ToastService` 开始落地（复用现有 Modal 的部分基础设施），再逐步扩展到 `Snackbar` 与 `Alert/Confirm`。你希望我先实现哪一个？