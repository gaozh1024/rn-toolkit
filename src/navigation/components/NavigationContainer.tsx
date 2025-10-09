import React from 'react';
import { NavigationContainer as RNNavigationContainer } from '@react-navigation/native';
import { navigationRef } from '../services/NavigationService';
import { DialogContainer, LoadingOverlayContainer, ToastContainer } from '../../components/feedback';
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
    console.log('NavigationContainer: Ready');
    onReady?.();
  };

  const handleStateChange = () => {
    console.log('NavigationContainer: State changed');
    onStateChange?.();
  };

  return (
    <SafeAreaProvider>
      <RNNavigationContainer
        ref={navigationRef}
        onReady={handleReady}
        onStateChange={handleStateChange}
      >
        {children}
        <ToastContainer />
        <LoadingOverlayContainer />
        <DialogContainer />
      </RNNavigationContainer>
    </SafeAreaProvider>
  );
};