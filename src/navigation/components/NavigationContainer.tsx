import React, { useEffect, useLayoutEffect } from 'react';
import { NavigationContainer as RNNavigationContainer } from '@react-navigation/native';
import { Platform } from 'react-native';
import { KeyboardProvider, KeyboardController, AndroidSoftInputModes } from 'react-native-keyboard-controller';
import { navigationRef } from '../services/NavigationService';
import { DialogContainer, LoadingContainer, ToastContainer, ActionSheetContainer, SnackbarContainer } from '../../components/feedback';
import { SafeAreaProvider } from '../../components/layout/SafeAreaView';

interface NavigationContainerProps {
  children: React.ReactNode;
  onReady?: () => void;
  onStateChange?: () => void;
}

/**
 * 自定义导航容器
 * 自动绑定navigationRef，支持全局导航
 */
/**
 * 函数注释：导航容器（集成 KeyboardProvider 与安卓输入模式）
 * - Provider 置于应用最外层，提供统一的键盘控制上下文。
 * - 安卓：在最早阶段设为 ADJUST_NOTHING，杜绝系统窗口 resize，避免“先挤上去再回归”的闪动。
 */
export const NavigationContainer: React.FC<NavigationContainerProps> = ({
  children,
  onReady,
  onStateChange,
}) => {
  const handleReady = () => {
    console.log('NavigationContainer: Ready', typeof onReady);
    onReady?.();
  };

  const handleStateChange = () => {
    console.log('NavigationContainer: State changed', typeof onStateChange);
    onStateChange?.();
  };

  useLayoutEffect(() => {
    if (Platform.OS === 'android') {
      KeyboardController.setInputMode(AndroidSoftInputModes.SOFT_INPUT_ADJUST_NOTHING);
    }
  }, []);

  return (
    <KeyboardProvider preload={false}>
      <SafeAreaProvider>
        <RNNavigationContainer
          ref={navigationRef}
          onReady={handleReady}
          onStateChange={handleStateChange}
        >
          <LoadingContainer />
          <ToastContainer />
          <DialogContainer />
          <ActionSheetContainer />
          {/* Snackbar 挂载 */}
          <SnackbarContainer />
          {children}
        </RNNavigationContainer>
      </SafeAreaProvider>
    </KeyboardProvider>
  );
};