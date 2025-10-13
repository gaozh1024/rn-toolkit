# SegmentedProgress（分段进度条）

支持按段配置颜色与权重，未到达部分可显示默认背景或半透明预览，让用户感知后续颜色但避免过于相似。

## Props

- `segments`: `(string | { color: string; weight?: number })[]`，每段颜色与权重（默认 1）
- `value`: `number`（0-1），整体进度值
- `thickness`: `number`，高度（默认 8）
- `radius`: `number`，圆角（默认 `thickness/2`）
- `segmentGap`: `number`，段间距（默认 4）
- `previewMode`: `'none' | 'dim'`，未到达部分预览（默认 `none`）
- `previewOpacity`: `number`，半透明预览的透明度（默认 0.25）
- `trackColor`: 轨道背景（默认 `divider`）
- `style`: 容器样式

## 颜色解析

- 主题键：`primary`、`secondary`、`success`、`warning`、`error`、`info`、`text`、`subtext`、`border`、`divider`
- 自定义色值：直接使用，如 `#7C3AED`、`rgba(124,58,237,1)`

## 使用示例

```tsx
import { SegmentedProgress } from '@gaozh1024/rn-toolkit';

// 三段：成功/警告/错误，第二段权重 2（长度翻倍）
<SegmentedProgress
  segments={[
    { color: 'success', weight: 1 },
    { color: 'warning', weight: 2 },
    { color: 'error', weight: 1 },
  ]}
  value={0.35}
  thickness={10}
  segmentGap={6}
  previewMode="dim"
  previewOpacity={0.25}
/>
```

## 行为说明

- `previewMode='none'`：未到达部分使用 `trackColor`
- `previewMode='dim'`：未到达部分使用对应段颜色的半透明预览（默认 0.25 透明度），与进度色区分明显
- 进度计算按权重线性累积；填充按段内百分比渲染
