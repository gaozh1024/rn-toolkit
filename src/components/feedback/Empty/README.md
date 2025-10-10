# Empty 空态占位组件

- 展示列表/页面的空状态：图标、标题、描述、操作
- 适配主题与暗色模式；支持单按钮或多按钮操作

## 使用

```tsx
import React from 'react';
import { View } from 'react-native';
import { Empty } from '@gaozh1024/rn-toolkit';

export default function EmptyDemo() {
  return (
    <View style={{ flex: 1 }}>
      <Empty
        icon={<View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: '#EFEFF0' }} />}
        title="暂无数据"
        description="试试下拉刷新，或检查网络连接"
        actionText="重新加载"
        onAction={() => fetchData()}
        fullHeight
      />
    </View>
  );
}
```

### 多按钮
```tsx
<Empty
  icon={<Icon name="inbox" size={56} color="#C7C7CC" />}
  title="这里还空着"
  description="去创建第一个项目吧"
  actions={[
    { text: '创建项目', type: 'primary', onPress: createProject },
    { text: '帮助文档', type: 'secondary', onPress: openDocs },
  ]}
/>
```

## API
```ts
interface EmptyAction {
  text: string;
  onPress: () => void;
  type?: 'primary' | 'secondary';
}

interface EmptyProps {
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  actions?: EmptyAction[];
  style?: ViewStyle;
  align?: 'center' | 'start';
  spacing?: number;
  fullHeight?: boolean;
}
```

## 设计说明
- 布局：默认居中展示，`fullHeight=false` 时靠上放置
- 主题：文本颜色取自主题；按钮色可按需接入主题预设
- 组合：与列表容器的 `emptyComponent`/`emptyText` 协同使用