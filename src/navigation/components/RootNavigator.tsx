import React from 'react';
import { createStackNavigator, CardStyleInterpolators, TransitionPresets } from '@react-navigation/stack';
import { NavigatorConfig, TransitionMode } from '../types';
import { TabNavigator } from './TabNavigator';
import { StackNavigator } from './StackNavigator';

const RootStack = createStackNavigator();

export const RootNavigator: React.FC<NavigatorConfig> = ({
  tabs,
  stacks = [],
  modals = [],
  initialRouteName,
  transitionMode = 'ios',
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

  const getTransitionOptions = (mode: TransitionMode) => {
    switch (mode) {
      case 'fade':
        return {
          headerShown: false,
          ...TransitionPresets.FadeFromBottomAndroid,
          cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter,
        } as const;
      case 'bottom':
        return {
          headerShown: false,
          ...TransitionPresets.ModalSlideFromBottomIOS,
          cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
          presentation: 'modal' as const,
        } as const;
      case 'none':
        return {
          headerShown: false,
          animationEnabled: false,
        } as const;
      case 'ios':
      default:
        return {
          headerShown: false,
          ...TransitionPresets.SlideFromRightIOS,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        } as const;
    }
  };

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
        options={getTransitionOptions(transitionMode)}
      />

      {/* 堆栈页面 */}
      {stacks.map((stack) => (
        <RootStack.Screen
          key={stack.name}
          name={stack.name}
          children={() => (
            <StackNavigator
              stacks={[stack]}
              initialRouteName={stack.name}
              transitionMode={stack.transitionMode || transitionMode}
            />
          )}
          options={getTransitionOptions(stack.transitionMode || transitionMode)}
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
            ...getTransitionOptions(transitionMode),
            ...modal.options,
          }}
        />
      ))}
    </RootStack.Navigator>
  );
};