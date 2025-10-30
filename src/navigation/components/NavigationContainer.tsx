import React from 'react';
import { NavigationContainer as RNNavigationContainer } from '@react-navigation/native';
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

  return (
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
  );
};