import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigatorConfig, TabConfig } from '../types';
import { CustomTabButton } from './CustomTabButton';
import { useBottomSafeArea } from '../hooks/useSafeArea';

const Tab = createBottomTabNavigator();

export const TabNavigator: React.FC<NavigatorConfig> = ({
  tabs,
  initialRouteName,
  tabBarHeight = 60,
  backgroundColor = '#FFFFFF',
  activeColor = '#007AFF',
  inactiveColor = '#8E8E93',
  showLabels = true,
}) => {
  const bottomSafeArea = useBottomSafeArea();

  const getTabBarButton = (tab: TabConfig) => {
    return (rawProps: any) => {
      const { onPress } = rawProps || {};
   
      return (
        <CustomTabButton
          focused={rawProps['aria-selected']}
          label={showLabels ? (tab.label || tab.name) : undefined}
          iconName={tab.iconName}
          activeIconName={tab.activeIconName}
          iconSize={tab.iconSize}
          badge={tab.badge}
          badgeColor={tab.badgeColor}
          activeColor={tab.activeColor ?? activeColor}
          inactiveColor={tab.inactiveColor ?? inactiveColor}
          onPress={onPress}
        />
      );
    };
  };

  return (
    <Tab.Navigator
      initialRouteName={initialRouteName || tabs[0]?.name}
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: tabBarHeight + bottomSafeArea,
          backgroundColor,
          borderTopWidth: 1,
          borderTopColor: '#E5E5EA',
          paddingBottom: 0, // 让CustomTabButton自己处理底部安全区域
        },
        tabBarShowLabel: false, // 禁用默认标签，使用自定义按钮
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: inactiveColor,
      }}
    >
      {tabs.map((tab) => (
        <Tab.Screen
          key={tab.name}
          name={tab.name}
          component={tab.component}
          options={{
            ...tab.options,
            tabBarButton: getTabBarButton(tab),
          }}
        />
      ))}
    </Tab.Navigator>
  );
};