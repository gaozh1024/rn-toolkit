# UI 组件库总览

提供常用的 React Native UI 组件，统一风格、类型与主题接入。本文档包含：快速使用、导入方式、以及各组件的详细使用文档链接。

## 快速开始

- 安装依赖并完成必要的原生配置（详见项目根 README）
- 从聚合导出中直接引入组件

```tsx
import { Button, Icon, Link, Slider, Skeleton } from '@gaozh1024/rn-toolkit';

export function Example() {
  return (
    <>
      <Button title="提交" onPress={() => {}} />
      <Link href="https://reactnative.dev">打开 React Native 官网</Link>
      <Slider value={50} min={0} max={100} step={5} onValueChange={() => {}} />
      <Skeleton width={120} height={16} />
    </>
  );
}
```

## 导入与主题

- 统一从 `src/components/ui/index.ts` 聚合导出引入
- 所有组件默认读取主题颜色、圆角与间距，可通过 `useTheme`/`useThemeColors` 定制

## 组件文档索引

以下链接指向每个组件的详细 README 使用说明：

- [Avatar 头像](./Avatar/README.md)
- [AvatarGroup 头像组](./AvatarGroup/README.md)
- [Badge 徽章](./Badge/README.md)
- [Button 按钮](./Button/README.md)
- [Checkbox 复选框](./Checkbox/README.md)
- [Chip 筛选项](./Chip/README.md)
- [Divider 分割线](./Divider/README.md)
- [Icon 图标](./Icon/README.md)
- [IconButton 图标按钮](./IconButton/README.md)
- [Link 链接](./Link/README.md)
- [ListItem 列表项](./ListItem/README.md)
- [Progress 进度条](./Progress/README.md)
- [Radio 单选框](./Radio/README.md)
- [SegmentedMenu 分段菜单](./SegmentedMenu/README.md)
- [Skeleton 骨架屏](./Skeleton/README.md)
- [Slider 滑块](./Slider/README.md)
- [Spinner 加载指示](./Spinner/README.md)
- [Stepper 步进器](./Stepper/README.md)
- [Switch 开关](./Switch/README.md)
- [Text 文本](./Text/README.md)
- [TextArea 文本域](./TextArea/README.md)
- [Input 输入框](./Input/README.md)
- [PasswordInput 密码输入框](./PasswordInput/README.md)
