import React, { useEffect, useState } from 'react';
import { NavigationContainer as RNNavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { navigationRef } from './NavigationService';
import { StackScreenComponent, TabScreenComponent, RootStackParamList } from './types';
import { noRippleStackOptions, noRippleTabOptions, createThemedNavigationStyles, createThemedTabStyles } from './utils';
import { themeService } from '../theme';

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<RootStackParamList>();

interface NavigationContainerProps {
  children?: React.ReactNode;
  initialRouteName?: string;
  screenOptions?: any;
}

// 堆栈导航器
export const StackNavigator: React.FC<{
  screens: StackScreenComponent[];
  initialRouteName?: string;
  screenOptions?: any;
  useTheme?: boolean;
}> = ({ screens, initialRouteName, screenOptions, useTheme = true }) => {
  const [themedStyles, setThemedStyles] = useState(createThemedNavigationStyles());

  useEffect(() => {
    if (useTheme) {
      const updateStyles = () => {
        setThemedStyles(createThemedNavigationStyles());
      };

      // 监听主题变化
      themeService.addThemeChangeListener(updateStyles);

      return () => {
        themeService.removeThemeChangeListener(updateStyles);
      };
    }
  }, [useTheme]);

  const mergedScreenOptions = {
    ...noRippleStackOptions,
    ...(useTheme ? themedStyles.themed() : {}),
    ...screenOptions,
  };

  return (
    <Stack.Navigator
      initialRouteName={initialRouteName}
      screenOptions={mergedScreenOptions}
    >
      {screens.map((screen) => (
        <Stack.Screen
          key={screen.name}
          name={screen.name}
          component={screen.component}
          options={screen.options}
        />
      ))}
    </Stack.Navigator>
  );
};

// 标签页导航器
export const TabNavigator: React.FC<{
  tabs: TabScreenComponent[];
  initialRouteName?: string;
  screenOptions?: any;
  useTheme?: boolean;
}> = ({ tabs, initialRouteName, screenOptions, useTheme = true }) => {
  const [themedStyles, setThemedStyles] = useState(createThemedTabStyles());

  useEffect(() => {
    if (useTheme) {
      const updateStyles = () => {
        setThemedStyles(createThemedTabStyles());
      };

      // 监听主题变化
      themeService.addThemeChangeListener(updateStyles);

      return () => {
        themeService.removeThemeChangeListener(updateStyles);
      };
    }
  }, [useTheme]);

  const mergedScreenOptions = {
    ...noRippleTabOptions,
    ...(useTheme ? themedStyles.themed() : {}),
    ...screenOptions,
  };

  return (
    <Tab.Navigator
      initialRouteName={initialRouteName}
      screenOptions={mergedScreenOptions}
    >
      {tabs.map((tab) => (
        <Tab.Screen
          key={tab.name}
          name={tab.name}
          component={tab.component}
          options={tab.options}
        />
      ))}
    </Tab.Navigator>
  );
};

// 主导航容器 - 使用 forwardRef 来正确处理 ref
export const NavigationContainer = React.forwardRef<
  any,
  NavigationContainerProps
>(({ children, ...props }, ref) => {
  return (
    <RNNavigationContainer ref={ref ?? navigationRef} {...props}>
      {children}
    </RNNavigationContainer>
  );
});

NavigationContainer.displayName = 'NavigationContainer';

export default NavigationContainer;