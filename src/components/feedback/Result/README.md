# Result（结果页）

用于流程结束态的场景化反馈（成功/失败/警告/信息/离线），统一图标、颜色与版式，支持标题、描述、额外内容与动作按钮。

## 特性

- 状态：`success | error | warning | info | offline`
- 结构：状态图标 + 标题 + 描述 + 额外内容/动作按钮
- 主题：颜色/字体/间距接入全局主题（亮/暗模式兼容）
- 布局：支持居中/居左、全高居中占位

## 用法

```tsx
import React from 'react';
import { Result } from '@gaozh1024/rn-toolkit';

export default function ResultExamples() {
  return (
    <>
      {/* 成功 */}
      <Result
        status="success"
        title="提交成功"
        description="我们已收到你的信息，稍后可在任务列表查看处理进度。"
        actions={[{ text: '返回首页', type: 'primary', onPress: () => {} }]}
      />

      {/* 失败 */}
      <Result
        status="error"
        title="提交失败"
        description="服务暂时异常，请检查网络或稍后重试。"
        actions={[
          { text: '重试', type: 'primary', onPress: () => {} },
          { text: '联系支持', type: 'secondary', onPress: () => {} },
        ]}
      />

      {/* 网络错误（离线） */}
      <Result
        status="offline"
        title="网络连接异常"
        description="请检查当前网络状态，或切换到稳定网络后重试。"
        extra={<Text style={{ textAlign: 'center', marginTop: 8 }}>错误码：NET-001</Text>}
      />
    </>
  );
}
```

## Props

- `status`: `'success' | 'error' | 'warning' | 'info' | 'offline'`
- `title?`: `string | ReactNode`
- `description?`: `string | ReactNode`
- `extra?`: `ReactNode`（自定义内容区；若传入 `actions` 则忽略）
- `actions?`: `ResultAction[]`（按钮组；`primary`/`secondary` 两种风格）
- `style?`: `ViewStyle`（容器样式）
- `align?`: `'center' | 'start'`（内容对齐；默认 `center`）
- `spacing?`: `number`（行间距；默认 `8`）
- `fullHeight?`: `boolean`（是否占满高度居中；默认 `true`）
- `testID?`: `string`

## 主题与可访问性

- 主题色：状态图标采用主题色 `success/error/warning/info/border`，文案使用 `text/textSecondary`
- 文本层级：标题 `20`、描述 `14`；行间距与圆角遵循主题规范
- 可访问性：为关键操作按钮设置清晰文案与触达区域（内置 `height:36` 与圆角）

## 最佳实践

- 用 `actions` 提供明确的下一步，引导用户继续完成任务（如“返回首页/重试”）
- 错误态建议同时给出上下文信息（如错误码/提示），并提供兜底操作
- 页面内嵌时可关闭 `fullHeight` 并设置 `align='start'` 以贴合内容流
