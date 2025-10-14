# Progress（进度条）

进度反馈组件，支持线性/环形两种形态，接入主题颜色与尺寸刻度，覆盖确定/不确定两种状态。

## Props

- `variant`: `'linear' | 'circular'`，默认 `linear`
- `value`: `number`（0-1），确定态进度值
- `indeterminate`: `boolean`，不确定态（忽略 `value`）
- `color`: 主题色名或自定义色值（默认 `primary`）
- `trackColor`: 主题色名或自定义色值（默认 `divider`）
- `thickness`: 线性高度或环形描边宽度
- `size`: 线性高度或环形直径，支持 `'small' | 'medium' | 'large' | number`
- `showLabel`: 环形中心显示百分比文本
- `label`: 环形中心自定义节点或字符串（优先于百分比）
- 公共能力：
  - `SpacingProps`: `m/mv/mh/mt/...` 等间距属性，作用于容器
  - `TestableProps`: `testID` 标识，统一测试定位
  - `BoxProps`: 尺寸、背景、边框（线性容器默认背景为 `trackColor`；环形容器默认透明）
  - `ShadowProps`: 阴影预设与覆盖项（应用于容器）

## 类型统一

- `style`: `StyleProp<ViewStyle>`
- `textStyle`: `StyleProp<TextStyle>`

## 主题接入

- 颜色：来自 `theme.colors`（如 `primary`、`success`、`divider` 等），不出现硬编码颜色
- 尺寸：推荐 `size` 使用统一刻度；环形默认 `medium=40`、`small=24`、`large=56`

## 使用示例

### 线性 - 确定态（含间距/阴影/边框）

```tsx
import { Progress } from '@gaozh1024/rn-toolkit';

<Progress
  variant="linear"
  value={0.6}
  color="success"
  trackColor="divider"
  thickness={6}
  mh="md"
  shadowSize="sm"
  borderColor="border"
  borderWidth={1}
/>
```

### 线性 - 不确定态

```tsx
<Progress variant="linear" indeterminate color="primary" thickness={6} testID="page-progress" />
```

### 环形 - 确定态（含中心文案 与 间距/阴影）

```tsx
<Progress
  variant="circular"
  value={0.75}
  color="#7C3AED"
  trackColor="divider"
  size={56}
  thickness={6}
  showLabel
  mt="lg"
  shadowSize="md"
/>
```

### 环形 - 不确定态（自定义中心文案）

```tsx
<Progress variant="circular" indeterminate color="secondary" size="medium" thickness={5} label="加载中" />
```

## 最佳实践

- 线性模式适合页面进度条或区域内加载反馈；不确定态（横向滑动）用于未知时长任务
- 环形模式适合容器化的进度展示；不确定态视觉为持续旋转填充段
- 间距与阴影由容器承担；线性容器默认背景为 `trackColor`，可通过 `BoxProps` 覆盖
- 颜色与尺寸请遵循主题统一刻度，避免与其他组件风格不一致
- 高对比度场景可将 `trackColor` 选为 `divider`/`border`，`color` 选为业务主色或主题色
