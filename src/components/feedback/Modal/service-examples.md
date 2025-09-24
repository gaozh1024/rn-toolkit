# ModalService 使用示例

## 1. 基础信息对话框

```tsx
import React from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { modalService } from '@your-org/rn-toolkit';

const InfoModalExample = () => {
  const showInfo = () => {
    modalService.info({
      title: '提示信息',
      content: '这是一个信息提示对话框',
      okText: '我知道了',
      onOk: () => {
        console.log('用户点击了确定');
      }
    });
  };

  const showSuccess = () => {
    modalService.info({
      title: '操作成功',
      content: '您的操作已经成功完成！',
      okText: '好的'
    });
  };

  const showWarning = () => {
    modalService.info({
      title: '警告',
      content: '请注意，这个操作可能会影响系统性能。',
      okText: '了解'
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttons}>
        <Button title="显示信息" onPress={showInfo} />
        <Button title="显示成功" onPress={showSuccess} />
        <Button title="显示警告" onPress={showWarning} />
      </View>
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
    gap: 16,
  },
});

export default InfoModalExample;
```

## 2. 确认对话框

```tsx
import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { modalService } from '@your-org/rn-toolkit';

const ConfirmModalExample = () => {
  const [itemCount, setItemCount] = useState(5);

  const deleteItem = async () => {
    try {
      const confirmed = await modalService.confirm({
        title: '确认删除',
        content: '确定要删除这个项目吗？删除后无法恢复。',
        okText: '删除',
        cancelText: '取消',
        onOk: () => {
          console.log('用户确认删除');
        },
        onCancel: () => {
          console.log('用户取消删除');
        }
      });

      if (confirmed) {
        setItemCount(prev => prev - 1);
        Alert.alert('成功', '项目已删除');
      }
    } catch (error) {
      console.log('删除操作被取消');
    }
  };

  const deleteAll = async () => {
    try {
      const confirmed = await modalService.confirm({
        title: '危险操作',
        content: `确定要删除所有 ${itemCount} 个项目吗？\n\n⚠️ 此操作不可撤销！`,
        okText: '全部删除',
        cancelText: '取消'
      });

      if (confirmed) {
        setItemCount(0);
        Alert.alert('成功', '所有项目已删除');
      }
    } catch (error) {
      console.log('批量删除被取消');
    }
  };

  const logout = async () => {
    try {
      const confirmed = await modalService.confirm({
        title: '退出登录',
        content: '确定要退出当前账户吗？',
        okText: '退出',
        cancelText: '取消'
      });

      if (confirmed) {
        Alert.alert('已退出', '您已成功退出登录');
      }
    } catch (error) {
      console.log('取消退出');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.status}>当前项目数量: {itemCount}</Text>
      
      <View style={styles.buttons}>
        <Button 
          title="删除单个项目" 
          onPress={deleteItem}
          disabled={itemCount === 0}
        />
        <Button 
          title="删除所有项目" 
          onPress={deleteAll}
          disabled={itemCount === 0}
        />
        <Button title="退出登录" onPress={logout} />
      </View>
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
    fontSize: 18,
    marginBottom: 30,
    fontWeight: '500',
  },
  buttons: {
    gap: 16,
  },
});

export default ConfirmModalExample;
```

## 3. 自定义模态框

```tsx
import React from 'react';
import { View, Text, Button, StyleSheet, TextInput } from 'react-native';
import { modalService } from '@your-org/rn-toolkit';

const CustomModalExample = () => {
  const showCustomModal = () => {
    modalService.show({
      title: '自定义表单',
      width: '90%',
      children: (
        <CustomForm 
          onSubmit={(data) => {
            console.log('表单数据:', data);
            modalService.hideAll();
          }}
          onCancel={() => modalService.hideAll()}
        />
      )
    });
  };

  const showImageModal = () => {
    modalService.show({
      title: '图片预览',
      width: '95%',
      height: '80%',
      children: (
        <ImagePreview 
          onClose={() => modalService.hideAll()}
        />
      )
    });
  };

  const showListModal = () => {
    modalService.show({
      title: '选择选项',
      position: 'bottom',
      height: '60%',
      children: (
        <OptionsList 
          onSelect={(option) => {
            console.log('选择了:', option);
            modalService.hideAll();
          }}
        />
      )
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttons}>
        <Button title="自定义表单" onPress={showCustomModal} />
        <Button title="图片预览" onPress={showImageModal} />
        <Button title="选项列表" onPress={showListModal} />
      </View>
    </View>
  );
};

// 自定义表单组件
const CustomForm = ({ onSubmit, onCancel }) => {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');

  const handleSubmit = () => {
    if (name && email) {
      onSubmit({ name, email });
    }
  };

  return (
    <View style={styles.form}>
      <TextInput
        style={styles.input}
        placeholder="姓名"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="邮箱"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <View style={styles.formButtons}>
        <Button title="取消" onPress={onCancel} />
        <Button title="提交" onPress={handleSubmit} />
      </View>
    </View>
  );
};

// 图片预览组件
const ImagePreview = ({ onClose }) => {
  return (
    <View style={styles.imagePreview}>
      <View style={styles.imagePlaceholder}>
        <Text style={styles.imageText}>图片预览区域</Text>
        <Text style={styles.imageSubtext}>这里可以放置图片组件</Text>
      </View>
      <Button title="关闭" onPress={onClose} />
    </View>
  );
};

// 选项列表组件
const OptionsList = ({ onSelect }) => {
  const options = [
    { id: 1, label: '选项 1', value: 'option1' },
    { id: 2, label: '选项 2', value: 'option2' },
    { id: 3, label: '选项 3', value: 'option3' },
    { id: 4, label: '选项 4', value: 'option4' },
  ];

  return (
    <View style={styles.optionsList}>
      {options.map((option) => (
        <Button
          key={option.id}
          title={option.label}
          onPress={() => onSelect(option)}
        />
      ))}
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
    gap: 16,
  },
  form: {
    padding: 20,
    gap: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  formButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  imagePreview: {
    padding: 20,
    alignItems: 'center',
    gap: 20,
  },
  imagePlaceholder: {
    width: '100%',
    height: 200,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  imageText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#666',
  },
  imageSubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
  },
  optionsList: {
    padding: 20,
    gap: 12,
  },
});

export default CustomModalExample;
```

## 4. 链式调用和队列管理

```tsx
import React from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { modalService } from '@your-org/rn-toolkit';

const ChainModalExample = () => {
  const showChainModals = async () => {
    try {
      // 第一个模态框
      await modalService.info({
        title: '步骤 1',
        content: '这是第一个步骤，点击确定继续',
        okText: '下一步'
      });

      // 第二个模态框
      const confirmed = await modalService.confirm({
        title: '步骤 2',
        content: '确认要继续执行步骤 3 吗？',
        okText: '继续',
        cancelText: '取消'
      });

      if (confirmed) {
        // 第三个模态框
        await modalService.info({
          title: '步骤 3',
          content: '所有步骤已完成！',
          okText: '完成'
        });
      }
    } catch (error) {
      console.log('用户取消了操作');
    }
  };

  const showMultipleModals = () => {
    // 同时显示多个模态框（不推荐，仅作演示）
    modalService.show({
      key: 'modal1',
      title: '模态框 1',
      position: 'top',
      children: <Text>这是第一个模态框</Text>
    });

    setTimeout(() => {
      modalService.show({
        key: 'modal2',
        title: '模态框 2',
        position: 'center',
        children: <Text>这是第二个模态框</Text>
      });
    }, 1000);

    setTimeout(() => {
      modalService.show({
        key: 'modal3',
        title: '模态框 3',
        position: 'bottom',
        children: <Text>这是第三个模态框</Text>
      });
    }, 2000);
  };

  const hideAllModals = () => {
    modalService.hideAll();
  };

  const showWithKey = () => {
    modalService.show({
      key: 'unique-modal',
      title: '带键值的模态框',
      children: (
        <View style={styles.modalContent}>
          <Text>这个模态框有唯一的键值</Text>
          <Button 
            title="关闭这个模态框" 
            onPress={() => modalService.hide('unique-modal')} 
          />
        </View>
      )
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttons}>
        <Button title="链式调用" onPress={showChainModals} />
        <Button title="多个模态框" onPress={showMultipleModals} />
        <Button title="带键值模态框" onPress={showWithKey} />
        <Button title="关闭所有" onPress={hideAllModals} />
      </View>
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
    gap: 16,
  },
  modalContent: {
    padding: 20,
    alignItems: 'center',
    gap: 16,
  },
});

export default ChainModalExample;
```

## 5. 异步操作和加载状态

```tsx
import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator } from 'react-native';
import { modalService } from '@your-org/rn-toolkit';

const AsyncModalExample = () => {
  const [loading, setLoading] = useState(false);

  const simulateAsyncOperation = () => {
    return new Promise((resolve) => {
      setTimeout(resolve, 2000);
    });
  };

  const showLoadingModal = async () => {
    // 显示加载模态框
    modalService.show({
      key: 'loading',
      maskClosable: false,
      closable: false,
      children: (
        <View style={styles.loadingContent}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>正在处理...</Text>
        </View>
      )
    });

    try {
      // 模拟异步操作
      await simulateAsyncOperation();
      
      // 关闭加载模态框
      modalService.hide('loading');
      
      // 显示成功消息
      modalService.info({
        title: '成功',
        content: '操作已完成！',
        okText: '确定'
      });
    } catch (error) {
      // 关闭加载模态框
      modalService.hide('loading');
      
      // 显示错误消息
      modalService.info({
        title: '错误',
        content: '操作失败，请重试。',
        okText: '确定'
      });
    }
  };

  const showProgressModal = async () => {
    let progress = 0;
    
    modalService.show({
      key: 'progress',
      title: '上传进度',
      maskClosable: false,
      closable: false,
      children: <ProgressContent progress={progress} />
    });

    const interval = setInterval(() => {
      progress += 10;
      
      if (progress <= 100) {
        // 更新进度（实际应用中可能需要重新渲染）
        modalService.hide('progress');
        modalService.show({
          key: 'progress',
          title: '上传进度',
          maskClosable: false,
          closable: false,
          children: <ProgressContent progress={progress} />
        });
      }
      
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          modalService.hide('progress');
          modalService.info({
            title: '完成',
            content: '上传已完成！',
            okText: '确定'
          });
        }, 500);
      }
    }, 200);
  };

  const showAsyncConfirm = async () => {
    try {
      const confirmed = await modalService.confirm({
        title: '异步确认',
        content: '确认后将执行异步操作，是否继续？',
        okText: '确认',
        cancelText: '取消'
      });

      if (confirmed) {
        await showLoadingModal();
      }
    } catch (error) {
      console.log('用户取消了操作');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttons}>
        <Button title="显示加载" onPress={showLoadingModal} />
        <Button title="显示进度" onPress={showProgressModal} />
        <Button title="异步确认" onPress={showAsyncConfirm} />
      </View>
    </View>
  );
};

// 进度内容组件
const ProgressContent = ({ progress }) => {
  return (
    <View style={styles.progressContent}>
      <View style={styles.progressBar}>
        <View 
          style={[
            styles.progressFill, 
            { width: `${progress}%` }
          ]} 
        />
      </View>
      <Text style={styles.progressText}>{progress}%</Text>
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
    gap: 16,
  },
  loadingContent: {
    padding: 40,
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  progressContent: {
    padding: 20,
    alignItems: 'center',
    gap: 16,
    minWidth: 200,
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default AsyncModalExample;
```

## 6. 与 ModalProvider 集成

```tsx
import React from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { ModalProvider, modalService } from '@your-org/rn-toolkit';

// 应用根组件
const App = () => {
  return (
    <ModalProvider>
      <ServiceIntegrationExample />
    </ModalProvider>
  );
};

const ServiceIntegrationExample = () => {
  const showServiceModal = () => {
    modalService.info({
      title: '集成示例',
      content: '这个模态框通过 ModalService 显示，但由 ModalProvider 管理',
      okText: '确定'
    });
  };

  const showMultipleServices = () => {
    // 显示多个服务模态框
    modalService.info({
      title: '第一个',
      content: '第一个服务模态框',
      okText: '下一个',
      onOk: () => {
        modalService.confirm({
          title: '第二个',
          content: '第二个服务模态框',
          okText: '确认',
          cancelText: '取消'
        });
      }
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttons}>
        <Button title="服务模态框" onPress={showServiceModal} />
        <Button title="多个服务模态框" onPress={showMultipleServices} />
      </View>
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
    gap: 16,
  },
});

export default App;
```
