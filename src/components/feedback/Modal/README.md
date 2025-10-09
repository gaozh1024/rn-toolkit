# Modal 使用说明

导航驱动的模态组件，支持通过路由参数控制标题、内容、位置、背景色、遮罩色、尺寸以及关闭行为。

**概览**
- 文件：`src/components/feedback/Modal/Modal.tsx`
- 能力：标题、内容渲染、位置（top/bottom/center）、背景/遮罩、宽高、可关闭、点击遮罩关闭
- 适配：`useSafeAreaInsets` 自动处理顶部/底部安全区

**注册到导航**
- 使用 `NavigationBuilder` 在框架层注册模态页面：

```tsx:src%2FApp.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import createNavigation from './src/navigation';
import { Modal } from './src/components/feedback/Modal/Modal';

const App = () => {
  const NavigationComponent = createNavigation()
    .addModal({
      name: 'Modal',
      component: Modal,
      transitionMode: 'bottom',
      options: { cardStyle: { backgroundColor: 'transparent' } },
    })
    .build();

  return (
    <NavigationContainer>
      <NavigationComponent />
    </NavigationContainer>
  );
};

export default App;
```

**展示模态（全局调用）**
- 使用全局导航服务在任意位置展示：

```tsx:src%2Fanywhere.ts
import { navigationService } from './src/navigation';

navigationService.presentModal('Modal', {
  direction: 'bottom',
  backgroundColor: 'transparent',
  title: '框架级模态',
  position: 'center',          // 'top' | 'bottom' | 'center'
  width: '90%',                 // DimensionValue：数值或百分比
  height: 360,                  // DimensionValue：数值；'auto' 时不强制注入
  closable: true,
  maskClosable: true,
  renderContent: () => null,    // 或渲染你的内容
});
```

**在组件内展示（依赖导航上下文）**

```tsx:src%2Fscreens%2FSomeScreen.tsx
import React from 'react';
import { Button } from 'react-native';
import { useComponentNavigation } from '../src/navigation';

export default function SomeScreen() {
  const nav = useComponentNavigation();
  return (
    <Button
      title="打开模态"
      onPress={() => nav.navigate('Modal', {
        title: '来自页面',
        position: 'top',
        renderContent: () => null,
      })}
    />
  );
}
```

**参数类型（route.params）**

```ts:src%2Fcomponents%2Ffeedback%2FModal%2Ftypes.ts
export type ModalParams = {
  title?: string;
  renderContent?: () => React.ReactNode;
  direction?: 'left' | 'right' | 'top' | 'bottom' | 'fade' | 'none' | 'ios';
  backgroundColor?: string;   // 屏幕背景色（可透明）
  maskColor?: string;         // 遮罩色
  position?: 'center' | 'top' | 'bottom';
  width?: import('react-native').DimensionValue;   // 默认 '90%'
  height?: import('react-native').DimensionValue;  // 不传或 'auto' 时按内容自适应
  closable?: boolean;         // 是否显示右上角关闭按钮
  maskClosable?: boolean;     // 点击遮罩是否关闭
};
```

**示例**
- 居中模态，自定义内容：

```tsx:src%2Fexamples%2FModalCenterExample.tsx
navigationService.presentModal('Modal', {
  title: '提示',
  position: 'center',
  width: '90%',
  renderContent: () => (
    <View>
      <Text>这是自定义内容</Text>
    </View>
  ),
});
```

- 顶部对齐，固定尺寸：

```tsx:src%2Fexamples%2FModalTopExample.tsx
navigationService.presentModal('Modal', {
  title: '顶部模态',
  position: 'top',
  width: 320,
  height: 420,
});
```

- 点击遮罩关闭与右上角关闭：

```tsx:src%2Fexamples%2FModalClosableExample.tsx
navigationService.presentModal('Modal', {
  title: '可关闭',
  closable: true,
  maskClosable: true,
});
```

**注意事项**
- `height: 'auto'` 或未传时不强制注入高度，按内容自适应。
- `width/height` 类型为 `DimensionValue`（数值或百分比字符串）。
- `position` 会自动应用安全区边距：顶部/底部分别加上 `insets.top` / `insets.bottom`。
- 透明背景建议通过 `options.cardStyle.backgroundColor = 'transparent'` 或传入 `backgroundColor: 'transparent'`。

**主题与安全区**
- 安全区：通过 `useSafeAreaInsets` 自动处理。
- 主题：建议与自定义内容协同使用主题色与字体（参考全局主题文档）。

**导出**
- 在聚合导出处添加：

```ts:src%2Fcomponents%2Ffeedback%2Findex.ts
export * from './Modal';
```

**参考**
- 组件实现：<mcfile name="Modal.tsx" path="/Users/gzh/Projects/framework/rn-toolkit/src/components/feedback/Modal/Modal.tsx"></mcfile>
- 导航服务：<mcfile name="NavigationService.ts" path="/Users/gzh/Projects/framework/rn-toolkit/src/navigation/services/NavigationService.ts"></mcfile>
- 根导航注册：<mcfile name="RootNavigator.tsx" path="/Users/gzh/Projects/framework/rn-toolkit/src/navigation/components/RootNavigator.tsx"></mcfile>
- 组件符号：<mcsymbol name="Modal" filename="Modal.tsx" path="/Users/gzh/Projects/framework/rn-toolkit/src/components/feedback/Modal/Modal.tsx" startline="21" type="function"></mcsymbol>