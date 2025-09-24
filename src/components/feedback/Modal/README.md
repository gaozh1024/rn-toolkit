# Modal 组件

Modal 是一个功能强大的模态框组件，支持多种动画效果、位置设置和交互方式。

## 特性

- 🎨 支持多种动画效果（fade、slide、none）
- 📱 响应式设计，适配不同屏幕尺寸
- 🎯 灵活的位置设置（center、top、bottom）
- 🔧 可自定义样式和主题
- 🎭 支持遮罩层点击关闭
- 📱 支持硬件返回键处理
- 🔄 提供 Hook 和 Service 两种使用方式

## 安装

```bash
npm install @your-org/rn-toolkit
```

## 基础用法

### 1. 使用 Modal 组件

```tsx
import React from 'react';
import { View, Text, Button } from 'react-native';
import { Modal, useModal } from '@your-org/rn-toolkit';

const BasicModalExample = () => {
  const modal = useModal();

  return (
    <View>
      <Button title="显示模态框" onPress={modal.show} />
      
      <Modal
        visible={modal.visible}
        onClose={modal.hide}
        title="基础模态框"
      >
        <Text>这是模态框的内容</Text>
        <Button title="关闭" onPress={modal.hide} />
      </Modal>
    </View>
  );
};
```

### 2. 使用 ModalService

```tsx
import { modalService } from '@your-org/rn-toolkit';

// 显示信息模态框
modalService.info({
  title: '提示',
  content: '这是一个信息提示',
  okText: '确定'
});

// 显示确认模态框
modalService.confirm({
  title: '确认删除',
  content: '确定要删除这个项目吗？',
  okText: '删除',
  cancelText: '取消',
  onOk: () => console.log('确认删除'),
  onCancel: () => console.log('取消删除')
});
```

## API 参考

### ModalProps

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| visible | boolean | - | 是否显示模态框 |
| onClose | () => void | - | 关闭回调 |
| onShow | () => void | - | 显示回调 |
| onHide | () => void | - | 隐藏回调 |
| title | string | - | 标题 |
| children | React.ReactNode | - | 内容 |
| animationType | 'slide' \| 'fade' \| 'none' | 'fade' | 动画类型 |
| presentationStyle | 'fullScreen' \| 'pageSheet' \| 'formSheet' \| 'overFullScreen' | 'overFullScreen' | 展示样式 |
| transparent | boolean | true | 是否透明 |
| closable | boolean | true | 是否显示关闭按钮 |
| maskClosable | boolean | true | 点击遮罩是否关闭 |
| hardwareBackPress | boolean | true | 是否响应硬件返回键 |
| width | number \| string | '90%' | 宽度 |
| height | number \| string | 'auto' | 高度 |
| position | 'center' \| 'top' \| 'bottom' | 'center' | 位置 |
| backgroundColor | string | - | 背景色 |
| maskColor | string | - | 遮罩颜色 |

### useModal Hook

```tsx
const modal = useModal(initialVisible?: boolean);

// 返回值
interface UseModalReturn {
  visible: boolean;
  show: () => void;
  hide: () => void;
  toggle: () => void;
}
```

### ModalService

```tsx
// 显示模态框
modalService.show(config: ModalConfig): Promise<any>

// 隐藏模态框
modalService.hide(key: string): void

// 隐藏所有模态框
modalService.hideAll(): void

// 显示确认对话框
modalService.confirm(config: ConfirmConfig): Promise<boolean>

// 显示信息对话框
modalService.info(config: InfoConfig): Promise<void>
```

## 主题定制

Modal 组件支持主题定制，可以通过 ThemeProvider 设置全局主题：

```tsx
import { ThemeProvider } from '@your-org/rn-toolkit';

const theme = {
  colors: {
    background: '#ffffff',
    text: '#000000',
    border: '#e0e0e0',
    shadow: '#000000'
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12
  }
};

<ThemeProvider theme={theme}>
  <App />
</ThemeProvider>
```

## 注意事项

1. 确保在应用根组件中包含 `ModalProvider`
2. 使用 ModalService 时，模态框会自动管理生命周期
3. 在 Android 上，硬件返回键默认会关闭模态框
4. 模态框支持嵌套使用，但建议避免过深的嵌套

## 更多示例

查看以下文件获取更多使用示例：
- [基础示例](./examples.md)
- [高级示例](./advanced-examples.md)
- [ModalService 示例](./service-examples.md)