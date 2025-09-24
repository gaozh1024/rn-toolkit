# Modal 基础使用示例

## 1. 简单的模态框

```tsx
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { Modal, useModal } from '@your-org/rn-toolkit';

const SimpleModalExample = () => {
  const modal = useModal();

  return (
    <View style={styles.container}>
      <Button title="显示简单模态框" onPress={modal.show} />
      
      <Modal
        visible={modal.visible}
        onClose={modal.hide}
        title="简单模态框"
      >
        <View style={styles.content}>
          <Text style={styles.text}>这是一个简单的模态框示例</Text>
          <Button title="关闭" onPress={modal.hide} />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    alignItems: 'center',
    gap: 16,
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default SimpleModalExample;
```

## 2. 带表单的模态框

```tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { Modal, useModal } from '@your-org/rn-toolkit';

const FormModalExample = () => {
  const modal = useModal();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = () => {
    console.log('提交数据:', { name, email });
    setName('');
    setEmail('');
    modal.hide();
  };

  return (
    <View style={styles.container}>
      <Button title="打开表单" onPress={modal.show} />
      
      <Modal
        visible={modal.visible}
        onClose={modal.hide}
        title="用户信息"
        width="95%"
      >
        <View style={styles.form}>
          <Text style={styles.label}>姓名</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="请输入姓名"
          />
          
          <Text style={styles.label}>邮箱</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="请输入邮箱"
            keyboardType="email-address"
          />
          
          <View style={styles.buttons}>
            <Button title="取消" onPress={modal.hide} />
            <Button title="提交" onPress={handleSubmit} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  form: {
    gap: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
});

export default FormModalExample;
```

## 3. 无标题模态框

```tsx
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { Modal, useModal } from '@your-org/rn-toolkit';

const NoTitleModalExample = () => {
  const modal = useModal();

  return (
    <View style={styles.container}>
      <Button title="显示无标题模态框" onPress={modal.show} />
      
      <Modal
        visible={modal.visible}
        onClose={modal.hide}
        closable={false} // 隐藏关闭按钮
      >
        <View style={styles.content}>
          <Text style={styles.title}>自定义标题</Text>
          <Text style={styles.text}>
            这是一个没有默认标题栏的模态框，
            你可以完全自定义内容的布局。
          </Text>
          <View style={styles.buttons}>
            <Button title="取消" onPress={modal.hide} />
            <Button title="确定" onPress={modal.hide} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  buttons: {
    flexDirection: 'row',
    gap: 16,
  },
});

export default NoTitleModalExample;
```

## 4. 不可关闭的模态框

```tsx
import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { Modal } from '@your-org/rn-toolkit';

const LoadingModalExample = () => {
  const [loading, setLoading] = useState(false);

  const startLoading = () => {
    setLoading(true);
    // 模拟异步操作
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  };

  return (
    <View style={styles.container}>
      <Button title="开始加载" onPress={startLoading} />
      
      <Modal
        visible={loading}
        maskClosable={false} // 不允许点击遮罩关闭
        hardwareBackPress={false} // 不响应返回键
        closable={false} // 不显示关闭按钮
        transparent={true}
      >
        <View style={styles.loadingContent}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>加载中...</Text>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingContent: {
    backgroundColor: 'white',
    padding: 40,
    borderRadius: 12,
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
});

export default LoadingModalExample;
```

## 5. 使用 useModal Hook

```tsx
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { Modal, useModal } from '@your-org/rn-toolkit';

const UseModalHookExample = () => {
  const modal = useModal(); // 默认不显示
  const autoModal = useModal(true); // 初始显示

  return (
    <View style={styles.container}>
      <Text style={styles.status}>
        Modal 状态: {modal.visible ? '显示' : '隐藏'}
      </Text>
      
      <View style={styles.buttons}>
        <Button title="显示" onPress={modal.show} />
        <Button title="隐藏" onPress={modal.hide} />
        <Button title="切换" onPress={modal.toggle} />
      </View>
      
      <Modal
        visible={modal.visible}
        onClose={modal.hide}
        title="useModal Hook 示例"
      >
        <View style={styles.content}>
          <Text>使用 useModal Hook 可以方便地管理模态框状态</Text>
          <Button title="关闭" onPress={modal.hide} />
        </View>
      </Modal>
      
      {/* 自动显示的模态框 */}
      <Modal
        visible={autoModal.visible}
        onClose={autoModal.hide}
        title="自动显示"
      >
        <View style={styles.content}>
          <Text>这个模态框在组件加载时自动显示</Text>
          <Button title="关闭" onPress={autoModal.hide} />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  status: {
    fontSize: 16,
    marginBottom: 20,
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  content: {
    alignItems: 'center',
    gap: 16,
  },
});

export default UseModalHookExample;
```