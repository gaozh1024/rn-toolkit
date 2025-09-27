# Button 按钮组件

一个功能丰富的按钮组件，支持多种样式、状态和交互方式。

## 特性

- 🎨 **多种变体** - 主要、次要、描边、文本等样式
- 📏 **灵活尺寸** - 小、中、大三种预设尺寸
- 🌈 **主题集成** - 自动适配亮色/暗色主题
- 🔄 **加载状态** - 内置加载指示器
- 🚫 **禁用状态** - 完整的禁用状态支持
- 🎯 **图标支持** - 左右图标位置
- 📱 **触摸反馈** - 多种触摸反馈类型
- ♿ **无障碍支持** - 完整的可访问性支持

## 安装

```bash
# 该组件是 rn-toolkit 的一部分
npm install rn-toolkit
```

## 基础用法

### 基本按钮

```tsx
import { Button } from 'rn-toolkit';

function BasicExample() {
  return (
    <Button title="点击我" onPress={() => console.log('按钮被点击')} />
  );
}
```

### 不同变体

```tsx
function VariantExample() {
  return (
    <>
      <Button variant="primary" title="主要按钮" />
      <Button variant="secondary" title="次要按钮" />
      <Button variant="outline" title="描边按钮" />
      <Button variant="text" title="文本按钮" />
    </>
  );
}
```

### 不同尺寸

```tsx
function SizeExample() {
  return (
    <>
      <Button size="small" title="小按钮" />
      <Button size="medium" title="中按钮" />
      <Button size="large" title="大按钮" />
    </>
  );
}
```

### 不同颜色

```tsx
function ColorExample() {
  return (
    <>
      <Button color="primary" title="主色按钮" />
      <Button color="secondary" title="辅助色按钮" />
      <Button color="success" title="成功按钮" />
      <Button color="warning" title="警告按钮" />
      <Button color="error" title="错误按钮" />
      <Button color="info" title="信息按钮" />
      <Button color="#FF6B6B" title="自定义颜色" />
    </>
  );
}
```

## API 参考

### ButtonProps

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| children | ReactNode | - | 按钮内容 |
| title | string | - | 按钮文本 |
| style | ViewStyle \| ViewStyle[] | - | 按钮样式 |
| textStyle | TextStyle \| TextStyle[] | - | 文本样式 |
| variant | 'primary' \| 'secondary' \| 'outline' \| 'text' | 'primary' | 按钮变体 |
| size | 'small' \| 'medium' \| 'large' | 'medium' | 按钮大小 |
| color | 'primary' \| 'secondary' \| 'success' \| 'warning' \| 'error' \| 'info' \| string | 'primary' | 按钮颜色 |
| textColor | string | - | 文本颜色 |
| shape | 'rounded' \| 'square' \| 'circle' | 'rounded' | 按钮形状 |
| disabled | boolean | false | 是否禁用 |
| loading | boolean | false | 是否显示加载状态 |
| bold | boolean | false | 文本是否加粗 |
| icon | ReactNode | - | 图标 |
| iconPosition | 'left' \| 'right' | 'left' | 图标位置 |
| fullWidth | boolean | true | 是否全宽 |
| touchType | 'opacity' \| 'highlight' \| 'pressable' | 'opacity' | 触摸反馈类型 |
| underlayColor | string | - | 高亮颜色 |
| onPress | (event) => void | - | 点击事件 |
| onPressIn | (event) => void | - | 按下事件 |
| onPressOut | (event) => void | - | 释放事件 |
| onLongPress | (event) => void | - | 长按事件 |
| accessibilityLabel | string | - | 无障碍标签 |
| accessibilityHint | string | - | 无障碍提示 |
| accessibilityRole | 'button' \| 'link' | 'button' | 无障碍角色 |
| testID | string | - | 测试ID |

### 按钮变体说明

- **primary**: 主要按钮，使用主题主色作为背景
- **secondary**: 次要按钮，使用主题次色作为背景
- **outline**: 描边按钮，透明背景带边框
- **text**: 文本按钮，无背景无边框

### 主题颜色

支持以下主题颜色键：
- `primary` - 主色（默认）
- `secondary` - 辅助色
- `success` - 成功色
- `warning` - 警告色
- `error` - 错误色
- `info` - 信息色

也可以使用自定义颜色值（如 `#FF6B6B`）。

## 高级用法

### 带图标的按钮

```tsx
import { Button, Icon } from 'rn-toolkit';

function IconButtonExample() {
  return (
    <>
      <Button
        title="添加"
        icon={<Icon name="add" size={20} color="white" />}
        iconPosition="left"
      />
      <Button
        title="下一步"
        icon={<Icon name="arrow-forward" size={20} color="white" />}
        iconPosition="right"
      />
    </>
  );
}
```

### 加载状态

```tsx
function LoadingExample() {
  const [loading, setLoading] = useState(false);

  const handlePress = async () => {
    setLoading(true);
    // 模拟异步操作
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLoading(false);
  };

  return (
    <Button
      title="提交"
      loading={loading}
      onPress={handlePress}
    />
  );
}
```

### 不同形状

```tsx
function ShapeExample() {
  return (
    <>
      <Button shape="rounded" title="圆角按钮" />
      <Button shape="square" title="方形按钮" />
      <Button 
        shape="circle" 
        icon={<Icon name="add" size={24} color="white" />}
      />
    </>
  );
}
```

### 全宽按钮

```tsx
function FullWidthExample() {
  return (
    <Button
      title="全宽按钮"
      fullWidth
      variant="primary"
      color="primary"
    />
  );
}
```

### 自定义样式

```tsx
function CustomStyleExample() {
  return (
    <Button
      title="自定义样式"
      style={{
        borderRadius: 25,
        paddingHorizontal: 30,
      }}
      textStyle={{
        fontSize: 18,
        fontWeight: 'bold',
      }}
      color="#FF6B6B"
    />
  );
}
```

### 不同触摸反馈

```tsx
function TouchTypeExample() {
  return (
    <>
      <Button touchType="opacity" title="透明度反馈" />
      <Button touchType="highlight" title="高亮反馈" />
      <Button touchType="pressable" title="按压反馈" />
    </>
  );
}
```

### 主题颜色示例

```tsx
function ThemeColorExample() {
  return (
    <>
      <Button variant="primary" color="primary" title="主色按钮" />
      <Button variant="secondary" color="secondary" title="辅助色按钮" />
      <Button variant="outline" color="success" title="成功描边按钮" />
      <Button variant="text" color="error" title="错误文本按钮" />
    </>
  );
}
```

## 注意事项

1. **主题依赖**: 组件依赖 ThemeService，确保在使用前已正确初始化主题服务
2. **图标组件**: 建议使用 rn-toolkit 提供的 Icon 组件，已集成主题支持
3. **性能优化**: 对于频繁重渲染的场景，建议使用 React.memo 包装
4. **可访问性**: 重要按钮建议设置 accessibilityLabel 和 accessibilityHint
5. **加载状态**: 在加载状态下，按钮会自动禁用点击事件
6. **主题适配**: 按钮会自动适配深色/浅色主题，无需手动处理

## 样式定制

可以通过 `style` 和 `textStyle` 属性进行进一步的样式定制：

```tsx
<Button
  title="自定义按钮"
  style={{
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  }}
  textStyle={{
    letterSpacing: 1,
    textTransform: 'uppercase',
  }}
/>
```

## 完整示例

```tsx
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Icon } from 'rn-toolkit';

const ButtonDemo = () => {
  const [loading, setLoading] = useState(false);

  const handleAsyncAction = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      {/* 基础按钮 */}
      <Button title="基础按钮" onPress={() => console.log('点击')} />
      
      {/* 不同变体 */}
      <Button variant="primary" title="主要按钮" />
      <Button variant="secondary" title="次要按钮" />
      <Button variant="outline" title="描边按钮" />
      <Button variant="text" title="文本按钮" />
      
      {/* 不同颜色 */}
      <Button color="success" title="成功按钮" />
      <Button color="warning" title="警告按钮" />
      <Button color="error" title="错误按钮" />
      
      {/* 带图标 */}
      <Button
        title="添加项目"
        icon={<Icon name="add" size={20} color="white" />}
        iconPosition="left"
      />
      
      {/* 加载状态 */}
      <Button
        title="异步操作"
        loading={loading}
        onPress={handleAsyncAction}
      />
      
      {/* 禁用状态 */}
      <Button title="禁用按钮" disabled />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 16,
  },
});

export default ButtonDemo;
```