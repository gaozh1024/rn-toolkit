# Text 文本组件

一个功能丰富的文本组件，支持多种文本样式、主题集成和自定义配置。

## 特性

- 🎨 **多种文本变体** - 支持标题、正文、说明文字等多种预设样式
- 🌈 **主题集成** - 自动适配亮色/暗色主题
- 📏 **灵活的尺寸** - 支持预设尺寸和自定义数值
- 🎯 **丰富的样式选项** - 字体粗细、颜色、对齐、装饰等
- 📱 **响应式** - 支持字体缩放和自适应
- ♿ **无障碍支持** - 完整的可访问性支持

## 安装

```bash
# 该组件是 rn-toolkit 的一部分
npm install rn-toolkit
```

## 基础用法

### 基本文本

```tsx
import { Text } from 'rn-toolkit';

function BasicExample() {
  return (
    <Text>这是一段基本文本</Text>
  );
}
```

### 文本变体

```tsx
function VariantExample() {
  return (
    <>
      <Text variant="h1">主标题</Text>
      <Text variant="h2">副标题</Text>
      <Text variant="body1">正文内容</Text>
      <Text variant="caption">说明文字</Text>
    </>
  );
}
```

### 自定义样式

```tsx
function CustomStyleExample() {
  return (
    <>
      <Text size="lg" weight="bold" color="primary">
        大号粗体主色文本
      </Text>
      <Text align="center" decoration="underline">
        居中下划线文本
      </Text>
      <Text transform="uppercase" color="#FF6B6B">
        大写红色文本
      </Text>
    </>
  );
}
```

## API 参考

### TextProps

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| children | ReactNode | - | 文本内容 |
| style | TextStyle \| TextStyle[] | - | 自定义样式 |
| variant | 'h1' \| 'h2' \| 'h3' \| 'h4' \| 'h5' \| 'h6' \| 'body1' \| 'body2' \| 'caption' \| 'overline' \| 'button' \| 'link' | 'body1' | 文本变体 |
| size | 'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| number | - | 字体大小 |
| weight | 'light' \| 'normal' \| 'medium' \| 'semibold' \| 'bold' | - | 字体粗细 |
| color | 'primary' \| 'secondary' \| 'text' \| 'textSecondary' \| 'textDisabled' \| 'error' \| 'warning' \| 'success' \| 'info' \| string | 'text' | 文本颜色 |
| align | 'left' \| 'center' \| 'right' \| 'justify' | 'left' | 文本对齐 |
| lineHeight | 'tight' \| 'normal' \| 'relaxed' \| number | - | 行高 |
| decoration | 'none' \| 'underline' \| 'line-through' | 'none' | 文本装饰 |
| transform | 'none' \| 'uppercase' \| 'lowercase' \| 'capitalize' | 'none' | 文本转换 |
| selectable | boolean | false | 是否可选择 |
| numberOfLines | number | - | 最大行数 |
| ellipsizeMode | 'head' \| 'middle' \| 'tail' \| 'clip' | 'tail' | 省略模式 |
| allowFontScaling | boolean | true | 是否允许字体缩放 |
| minimumFontScale | number | - | 最小字体缩放比例 |
| adjustsFontSizeToFit | boolean | false | 是否调整字体大小以适应 |
| onPress | () => void | - | 点击事件 |
| onLongPress | () => void | - | 长按事件 |
| testID | string | - | 测试ID |
| m | 'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| 'xxl' \| number | - | 外边距（全方向） |
| mv | 同上 | - | 外边距（垂直） |
| mh | 同上 | - | 外边距（水平） |
| mt | 同上 | - | 外边距（上） |
| mb | 同上 | - | 外边距（下） |
| ml | 同上 | - | 外边距（左） |
| mr | 同上 | - | 外边距（右） |
| p | 同上 | - | 内边距（全方向） |
| pv | 同上 | - | 内边距（垂直） |
| ph | 同上 | - | 内边距（水平） |
| pt | 同上 | - | 内边距（上） |
| pb | 同上 | - | 内边距（下） |
| pl | 同上 | - | 内边距（左） |
| pr | 同上 | - | 内边距（右） |

### 文本变体说明

- **h1-h6**: 标题样式，h1最大，h6最小
- **body1**: 主要正文样式（默认）
- **body2**: 次要正文样式，稍小
- **caption**: 说明文字样式
- **overline**: 上标样式，通常用于标签
- **button**: 按钮文本样式，适配 Button 组件的文字规范
- **link**: 链接文本样式，通常带有高亮颜色与下划线

### 主题颜色

支持以下主题颜色键：
- `primary` - 主色
- `secondary` - 辅助色
- `text` - 主文本色（默认）
- `textSecondary` - 次文本色
- `textDisabled` - 禁用文本色
- `error` - 错误色
- `warning` - 警告色
- `success` - 成功色
- `info` - 信息色

也可以使用自定义颜色值（如 `#FF6B6B`）。

## 高级用法

### 响应式文本

```tsx
function ResponsiveExample() {
  return (
    <Text
      adjustsFontSizeToFit
      minimumFontScale={0.8}
      numberOfLines={1}
    >
      这段文本会自动调整大小以适应容器
    </Text>
  );
}
```

### 可交互文本

```tsx
function InteractiveExample() {
  return (
    <Text
      color="primary"
      decoration="underline"
      onPress={() => console.log('文本被点击')}
      onLongPress={() => console.log('文本被长按')}
    >
      点击我
    </Text>
  );
}
```

### 多行文本处理

```tsx
function MultilineExample() {
  return (
    <Text
      numberOfLines={3}
      ellipsizeMode="tail"
    >
      这是一段很长的文本，如果超过三行就会被截断并显示省略号...
    </Text>
  );
}
```

## 注意事项

1. **主题依赖**: 组件依赖 ThemeService，确保在使用前已正确初始化主题服务
2. **性能优化**: 对于大量文本，建议使用 `numberOfLines` 限制行数
3. **可访问性**: 重要文本建议设置 `testID` 以便测试
4. **字体缩放**: 在需要精确布局的场景中，可能需要禁用 `allowFontScaling`

## 样式定制

可以通过 `style` 属性进行进一步的样式定制：

```tsx
<Text
  style={{
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  }}
>
  带阴影的文本
</Text>
```