# Modal 高级使用示例

## 1. 不同位置的模态框

```tsx
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { Modal, useModal } from '@your-org/rn-toolkit';

const PositionModalExample = () => {
  const centerModal = useModal();
  const topModal = useModal();
  const bottomModal = useModal();

  return (
    <View style={styles.container}>
      <View style={styles.buttons}>
        <Button title="居中显示" onPress={centerModal.show} />
        <Button title="顶部显示" onPress={topModal.show} />
        <Button title="底部显示" onPress={bottomModal.show} />
      </View>

      {/* 居中模态框 */}
      <Modal
        visible={centerModal.visible}
        onClose={centerModal.hide}
        title="居中模态框"
        position="center"
      >
        <Text style={styles.text}>这是居中显示的模态框</Text>
        <Button title="关闭" onPress={centerModal.hide} />
      </Modal>

      {/* 顶部模态框 */}
      <Modal
        visible={topModal.visible}
        onClose={topModal.hide}
        title="顶部模态框"
        position="top"
        animationType="slide"
      >
        <Text style={styles.text}>这是从顶部滑入的模态框</Text>
        <Button title="关闭" onPress={topModal.hide} />
      </Modal>

      {/* 底部模态框 */}
      <Modal
        visible={bottomModal.visible}
        onClose={bottomModal.hide}
        title="底部模态框"
        position="bottom"
        animationType="slide"
        height="50%"
      >
        <Text style={styles.text}>这是从底部滑入的模态框，常用于操作面板</Text>
        <Button title="关闭" onPress={bottomModal.hide} />
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
  buttons: {
    gap: 12,
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default PositionModalExample;
```

## 2. 不同动画效果

```tsx
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { Modal, useModal } from '@your-org/rn-toolkit';

const AnimationModalExample = () => {
  const fadeModal = useModal();
  const slideModal = useModal();
  const noneModal = useModal();

  return (
    <View style={styles.container}>
      <View style={styles.buttons}>
        <Button title="淡入淡出" onPress={fadeModal.show} />
        <Button title="滑动效果" onPress={slideModal.show} />
        <Button title="无动画" onPress={noneModal.show} />
      </View>

      {/* 淡入淡出动画 */}
      <Modal
        visible={fadeModal.visible}
        onClose={fadeModal.hide}
        title="淡入淡出"
        animationType="fade"
      >
        <Text style={styles.text}>使用淡入淡出动画效果</Text>
        <Button title="关闭" onPress={fadeModal.hide} />
      </Modal>

      {/* 滑动动画 */}
      <Modal
        visible={slideModal.visible}
        onClose={slideModal.hide}
        title="滑动效果"
        animationType="slide"
        position="bottom"
      >
        <Text style={styles.text}>使用滑动动画效果</Text>
        <Button title="关闭" onPress={slideModal.hide} />
      </Modal>

      {/* 无动画 */}
      <Modal
        visible={noneModal.visible}
        onClose={noneModal.hide}
        title="无动画"
        animationType="none"
      >
        <Text style={styles.text}>直接显示，无动画效果</Text>
        <Button title="关闭" onPress={noneModal.hide} />
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
  buttons: {
    gap: 12,
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default AnimationModalExample;
```

## 3. 自定义样式的模态框

```tsx
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { Modal, useModal } from '@your-org/rn-toolkit';

const CustomStyleModalExample = () => {
  const customModal = useModal();
  const fullScreenModal = useModal();

  return (
    <View style={styles.container}>
      <View style={styles.buttons}>
        <Button title="自定义样式" onPress={customModal.show} />
        <Button title="全屏模态框" onPress={fullScreenModal.show} />
      </View>

      {/* 自定义样式模态框 */}
      <Modal
        visible={customModal.visible}
        onClose={customModal.hide}
        title="自定义样式"
        backgroundColor="#f0f8ff"
        maskColor="rgba(255, 0, 0, 0.3)"
        width="80%"
        height={300}
      >
        <View style={styles.customContent}>
          <Text style={styles.customText}>
            这是一个自定义样式的模态框：
          </Text>
          <Text style={styles.feature}>• 自定义背景色</Text>
          <Text style={styles.feature}>• 自定义遮罩颜色</Text>
          <Text style={styles.feature}>• 固定尺寸</Text>
          <Button title="关闭" onPress={customModal.hide} />
        </View>
      </Modal>

      {/* 全屏模态框 */}
      <Modal
        visible={fullScreenModal.visible}
        onClose={fullScreenModal.hide}
        presentationStyle="fullScreen"
        width="100%"
        height="100%"
        title="全屏模态框"
      >
        <View style={styles.fullScreenContent}>
          <Text style={styles.fullScreenText}>
            这是一个全屏模态框
          </Text>
          <Text style={styles.description}>
            适用于需要完整屏幕空间的场景，
            如图片查看器、视频播放器等。
          </Text>
          <Button title="关闭" onPress={fullScreenModal.hide} />
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
  buttons: {
    gap: 12,
  },
  customContent: {
    padding: 20,
    alignItems: 'center',
  },
  customText: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 16,
    color: '#2c3e50',
  },
  feature: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  fullScreenContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#ecf0f1',
  },
  fullScreenText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2c3e50',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
    color: '#7f8c8d',
  },
});

export default CustomStyleModalExample;
```

## 4. 嵌套模态框

```tsx
import React from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { Modal, useModal } from '@your-org/rn-toolkit';

const NestedModalExample = () => {
  const firstModal = useModal();
  const secondModal = useModal();
  const thirdModal = useModal();

  const showConfirmation = () => {
    Alert.alert(
      '确认',
      '你已经打开了三层模态框！',
      [{ text: '确定', onPress: () => {} }]
    );
  };

  return (
    <View style={styles.container}>
      <Button title="打开第一层模态框" onPress={firstModal.show} />

      {/* 第一层模态框 */}
      <Modal
        visible={firstModal.visible}
        onClose={firstModal.hide}
        title="第一层模态框"
        backgroundColor="#e8f4fd"
      >
        <View style={styles.modalContent}>
          <Text style={styles.text}>这是第一层模态框</Text>
          <View style={styles.buttons}>
            <Button title="打开第二层" onPress={secondModal.show} />
            <Button title="关闭" onPress={firstModal.hide} />
          </View>
        </View>
      </Modal>

      {/* 第二层模态框 */}
      <Modal
        visible={secondModal.visible}
        onClose={secondModal.hide}
        title="第二层模态框"
        backgroundColor="#fff2e8"
        position="top"
      >
        <View style={styles.modalContent}>
          <Text style={styles.text}>这是第二层模态框</Text>
          <View style={styles.buttons}>
            <Button title="打开第三层" onPress={thirdModal.show} />
            <Button title="关闭" onPress={secondModal.hide} />
          </View>
        </View>
      </Modal>

      {/* 第三层模态框 */}
      <Modal
        visible={thirdModal.visible}
        onClose={thirdModal.hide}
        title="第三层模态框"
        backgroundColor="#f0fff0"
        position="bottom"
        height="40%"
      >
        <View style={styles.modalContent}>
          <Text style={styles.text}>这是第三层模态框</Text>
          <Text style={styles.warning}>
            ⚠️ 不建议嵌套太多层模态框
          </Text>
          <View style={styles.buttons}>
            <Button title="显示确认" onPress={showConfirmation} />
            <Button title="关闭" onPress={thirdModal.hide} />
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
  modalContent: {
    padding: 20,
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  warning: {
    fontSize: 14,
    color: '#e67e22',
    marginBottom: 20,
    textAlign: 'center',
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
  },
});

export default NestedModalExample;
```

## 5. 响应式模态框

```tsx
import React from 'react';
import { View, Text, Button, StyleSheet, Dimensions } from 'react-native';
import { Modal, useModal } from '@your-org/rn-toolkit';

const ResponsiveModalExample = () => {
  const modal = useModal();
  const { width, height } = Dimensions.get('window');
  
  // 根据屏幕尺寸调整模态框大小
  const getModalSize = () => {
    if (width < 768) {
      // 手机
      return { width: '95%', height: 'auto' };
    } else if (width < 1024) {
      // 平板竖屏
      return { width: '80%', height: '70%' };
    } else {
      // 平板横屏或更大屏幕
      return { width: '60%', height: '60%' };
    }
  };

  const modalSize = getModalSize();

  return (
    <View style={styles.container}>
      <Text style={styles.info}>
        屏幕尺寸: {width.toFixed(0)} x {height.toFixed(0)}
      </Text>
      <Button title="显示响应式模态框" onPress={modal.show} />

      <Modal
        visible={modal.visible}
        onClose={modal.hide}
        title="响应式模态框"
        width={modalSize.width}
        height={modalSize.height}
      >
        <View style={styles.content}>
          <Text style={styles.text}>
            这个模态框会根据屏幕尺寸自动调整大小：
          </Text>
          <Text style={styles.rule}>
            • 手机 (&lt; 768px): 95% 宽度
          </Text>
          <Text style={styles.rule}>
            • 平板竖屏 (768-1024px): 80% 宽度，70% 高度
          </Text>
          <Text style={styles.rule}>
            • 大屏幕 (&gt; 1024px): 60% 宽度，60% 高度
          </Text>
          <Text style={styles.current}>
            当前模态框尺寸: {modalSize.width} x {modalSize.height}
          </Text>
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
  info: {
    fontSize: 16,
    marginBottom: 20,
    color: '#666',
  },
  content: {
    padding: 20,
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
  rule: {
    fontSize: 14,
    marginBottom: 8,
    color: '#666',
    alignSelf: 'flex-start',
  },
  current: {
    fontSize: 14,
    marginTop: 16,
    marginBottom: 20,
    color: '#007AFF',
    fontWeight: '500',
  },
});

export default ResponsiveModalExample;
```

## 6. 带生命周期回调的模态框

```tsx
import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { Modal, useModal } from '@your-org/rn-toolkit';

const LifecycleModalExample = () => {
  const modal = useModal();
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
  };

  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <View style={styles.container}>
      <Button title="显示模态框" onPress={modal.show} />
      <Button title="清空日志" onPress={clearLogs} />
      
      <View style={styles.logsContainer}>
        <Text style={styles.logsTitle}>生命周期日志:</Text>
        {logs.map((log, index) => (
          <Text key={index} style={styles.logItem}>
            {log}
          </Text>
        ))}
      </View>

      <Modal
        visible={modal.visible}
        onClose={modal.hide}
        onShow={() => addLog('模态框已显示')}
        onHide={() => addLog('模态框已隐藏')}
        title="生命周期示例"
      >
        <View style={styles.modalContent}>
          <Text style={styles.text}>
            这个模态框演示了生命周期回调的使用
          </Text>
          <Text style={styles.description}>
            查看下方的日志来了解模态框的显示和隐藏时机
          </Text>
          <Button 
            title="关闭" 
            onPress={() => {
              addLog('用户点击关闭按钮');
              modal.hide();
            }} 
          />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  logsContainer: {
    flex: 1,
    marginTop: 20,
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  logsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  logItem: {
    fontSize: 12,
    fontFamily: 'monospace',
    marginBottom: 4,
    color: '#495057',
  },
  modalContent: {
    padding: 20,
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
});

export default LifecycleModalExample;
```