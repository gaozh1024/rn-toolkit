import React from 'react';
import { NavigationContainer as RNNavigationContainer } from '@react-navigation/native';
import { navigationRef } from '../services';

interface NavigationContainerProps {
  children?: React.ReactNode;
  initialRouteName?: string;
  screenOptions?: any;
}

// 导航容器
export const NavigationContainer = React.forwardRef<
  any,
  NavigationContainerProps
>(({ children, ...props }, ref) => {
  return (
    <RNNavigationContainer ref={ref || navigationRef} {...props}>
      {children}
    </RNNavigationContainer>
  );
});

NavigationContainer.displayName = 'NavigationContainer';

export default NavigationContainer;