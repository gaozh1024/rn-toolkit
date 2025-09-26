import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { RootNavigatorConfig } from '../types';
import { TabNavigator } from './TabNavigator';

const RootStack = createStackNavigator();

export const RootNavigator: React.FC<RootNavigatorConfig> = ({
  tabs,
  stacks = [],
  modals = [],
  initialRouteName,
  ...tabConfig
}) => {
  // 创建标签导航器组件
  const TabsComponent = () => (
    <TabNavigator
      tabs={tabs}
      initialRouteName={initialRouteName}
      {...tabConfig}
    />
  );

  return (
    <RootStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* 主标签导航器 */}
      <RootStack.Screen
        name="MainTabs"
        component={TabsComponent}
      />
      
      {/* 堆栈页面 */}
      {stacks.map((stack) => (
        <RootStack.Screen
          key={stack.name}
          name={stack.name}
          component={stack.component}
          options={stack.options}
        />
      ))}
      
      {/* 模态页面 */}
      {modals.map((modal) => (
        <RootStack.Screen
          key={modal.name}
          name={modal.name}
          component={modal.component}
          options={{
            presentation: 'modal',
            ...modal.options,
          }}
        />
      ))}
    </RootStack.Navigator>
  );
};