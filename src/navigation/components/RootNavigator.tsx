import React, { useMemo } from 'react';
import { createStackNavigator, CardStyleInterpolators, TransitionPresets } from '@react-navigation/stack';
import { NavigatorConfig, TransitionMode } from '../types';
import { TabNavigator } from './TabNavigator';
import { StackNavigator } from './StackNavigator';
import { Modal as DefaultModal } from '../../components/feedback/Modal';
import { WheelPickerModal } from '../../components/feedback/Picker'

const RootStack = createStackNavigator();

export const RootNavigator: React.FC<NavigatorConfig> = ({
  tabs,
  stacks = [],
  modals = [],
  initialRouteName,
  transitionMode = 'ios',
  tabsScreenName,
  tabsGroups = [],
  ...tabConfig
}) => {
  // 创建主标签导航器组件
  const TabsComponent = () => (
    <TabNavigator
      tabs={tabs}
      initialRouteName={initialRouteName}
      tabBarHeight={tabConfig.tabBarHeight}
      backgroundColor={tabConfig.backgroundColor}
      activeColor={tabConfig.activeColor}
      inactiveColor={tabConfig.inactiveColor}
      showLabels={tabConfig.showLabels}
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
          presentation: 'transparentModal' as const,
          gestureDirection: 'vertical' as const,
          transitionSpec: {
            open: { animation: 'timing', config: { duration: 200 } },
            close: { animation: 'timing', config: { duration: 100 } },
          },
        } as const;
      case 'top':
        return {
          headerShown: false,
          ...TransitionPresets.ModalSlideFromBottomIOS,
          cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
          presentation: 'transparentModal' as const,
          gestureDirection: 'vertical-inverted' as const,
          transitionSpec: {
            open: { animation: 'timing', config: { duration: 200 } },
            close: { animation: 'timing', config: { duration: 100 } },
          },
        } as const;
      case 'left':
        return {
          headerShown: false,
          ...TransitionPresets.SlideFromRightIOS,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          gestureDirection: 'horizontal-inverted' as const,
        } as const;
      case 'right':
        return {
          headerShown: false,
          ...TransitionPresets.SlideFromRightIOS,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          gestureDirection: 'horizontal' as const,
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

  const allModals = useMemo(() => {
    const existsDefault = (modals || []).some(m => m.name === 'Modal');
    const existsPicker = (modals || []).some(m => m.name === 'WheelPickerModal');
    const def = { name: 'Modal', component: DefaultModal } as any;
    const picker = { name: 'WheelPickerModal', component: WheelPickerModal } as any;
    if (existsDefault && existsPicker) return modals || [];
    if (existsDefault && !existsPicker) return [{ ...picker }, ...(modals || [])];
    if (!existsDefault && existsPicker) return [{ ...def }, ...(modals || [])];
    return [{ ...def }, { ...picker }, ...(modals || [])];
  }, [modals]);

  return (
    <RootStack.Navigator
      screenOptions={{ headerShown: false }}
    >
      {/* 主标签导航器：仅在存在主组 tabs 时挂载 */}
      {tabs.length > 0 && (
        <RootStack.Screen
          name={tabsScreenName || 'MainTabs'}
          component={TabsComponent}
          options={getTransitionOptions(transitionMode)}
        />
      )}

      {/* 额外的 Tabs 组：每组一个独立屏幕 */}
      {tabsGroups.map((group) => (
        <RootStack.Screen
          key={group.screenName}
          name={group.screenName}
          children={() => (
            <TabNavigator
              tabs={group.tabs}
              initialRouteName={group.initialRouteName ?? initialRouteName}
              tabBarHeight={group.tabBarHeight ?? tabConfig.tabBarHeight}
              backgroundColor={group.backgroundColor ?? tabConfig.backgroundColor}
              activeColor={group.activeColor ?? tabConfig.activeColor}
              inactiveColor={group.inactiveColor ?? tabConfig.inactiveColor}
              showLabels={group.showLabels ?? tabConfig.showLabels}
            />
          )}
          options={getTransitionOptions(transitionMode)}
        />
      ))}

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
      {allModals.map((modal) => (
        <RootStack.Screen
          key={modal.name}
          name={modal.name}
          component={modal.component}
          options={({ route }: any) => {
            // 统一：导航层动画使用 fade（不再根据 params.direction 切换）
            const base = getTransitionOptions('fade');
            return {
              ...base,
              presentation: 'transparentModal',
              cardStyle: {
                ...(typeof (modal.options as any)?.cardStyle === 'object' ? (modal.options as any).cardStyle : {}),
                backgroundColor: 'transparent',
              },
              ...(typeof modal.options === 'function' ? (modal.options as any)({ route }) : (modal.options || {})),
            } as any;
          }}
        />
      ))}
    </RootStack.Navigator>
  );
};