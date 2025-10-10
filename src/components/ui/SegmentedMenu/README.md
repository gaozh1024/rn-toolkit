# SegmentedMenu（分段菜单）

一个可横向滚动、带平滑指示条的菜单组件，适用于页签/分段选择。

## 导入

```ts
import { SegmentedMenu } from '@gaozh1024/rn-toolkit';
```

## 基本用法

```tsx
<SegmentedMenu
  items={[
    { key: 'all', label: '全部' },
    { key: 'fav', label: '收藏' },
    { key: 'recent', label: '最近' },
    { key: 'archived', label: '归档' },
  ]}
  defaultIndex={0}
  onChange={(key, idx) => console.log('change:', key, idx)}
/>
```

## 受控用法

```tsx
const [idx, setIdx] = useState(1);

<SegmentedMenu
  items={[{ key: 1, label: '一' }, { key: 2, label: '二' }, { key: 3, label: '三' }]}
  index={idx}
  onChange={(key, i) => setIdx(i)}
/>
```

## 属性
- `items`: 菜单项数组，`{ key, label }`。
- `index`/`defaultIndex`: 受控/非受控当前索引。
- `onChange(key, index)`: 切换回调。
- `color`/`selectColor`/`lineColor`: 文本与指示条颜色（默认取主题）。
- `lineSize`: 指示条宽度，默认 `24`。
- `edge`: 每项左右内边距，默认 `16`。
- `size`: 字体大小，默认 `14`。
- `animatedDuration`: 动画时长，默认 `240ms`。
- `style/styleInner/itemStyle/selectStyle`: 容器/内容/项/选中样式。

## 主题
- 通过 `useTheme` 接入主题，颜色来自 `theme.colors`（如 `primary/text/subtext`）。
- 暗色模式下无需额外适配，遵循主题色彩对比。

## 动画
- 使用 `react-native-reanimated` 的 `useSharedValue` + `withTiming` 控制指示条位移。
- 自动居中当前项，保持滚动体验一致。