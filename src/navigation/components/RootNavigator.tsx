import React, { useMemo } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigatorConfig, TransitionMode } from '../types';
import { TabNavigator } from './TabNavigator';
import { StackNavigator } from './StackNavigator';
import { ModalScreen } from '../../components/feedback/Modal';
import { WheelPickerModal } from '../../components/feedback/Picker'
import { Platform } from 'react-native';

const RootStack = createNativeStackNavigator();

export const RootNavigator: React.FC<NavigatorConfig> = ({
  tabs,
  stacks = [],
  modals = [],
  initialRouteName,
  transitionMode = 'ios',
  tabsTransitionMode,
  animationDuration, // 新增：全局动画时长
  tabsScreenName,
  tabsGroups = [],
  ...tabConfig
}) => {
  /**
   * 函数注释：初始路由分发策略
   * - 若 initialRouteName 命中某个 Stack 名称，则将 RootStack 的初始路由设为该 Stack（满足“打开非 Tab 的首屏”需求）。
   * - 若 initialRouteName 命中某个 Tab 名称，则仅把它传给 TabNavigator；RootStack 仍以主 Tabs 屏幕为初始路由。
   * - 避免将一个不存在于 Tabs 的名称传给 TabNavigator，防止 "Couldn't find a screen named ..." 警告。
   */
  const tabNames = (tabs || []).map(t => t.name);
  const isInitialTab = !!initialRouteName && tabNames.includes(initialRouteName!);
  const isInitialStack = !!initialRouteName && (stacks || []).some(s => s.name === initialRouteName);

  const rootInitialRouteName = (() => {
    if (isInitialStack) return initialRouteName!; // 初始路由是某个 Stack
    if (tabs.length > 0) return tabsScreenName || 'MainTabs'; // 默认进入主 Tabs
    if (stacks.length > 0) return stacks[0].name; // 无 Tabs 时进入第一个 Stack
    if ((tabsGroups || []).length > 0) return tabsGroups[0].screenName; // 或第一个 Tabs 组
    return undefined;
  })();

  const tabsInitialRouteName = isInitialTab ? initialRouteName : undefined;

  // 创建主标签导航器组件
  const TabsComponent = () => (
    <TabNavigator
      tabs={tabs}
      initialRouteName={tabsInitialRouteName}
      tabBarHeight={tabConfig.tabBarHeight}
      backgroundColor={tabConfig.backgroundColor}
      activeColor={tabConfig.activeColor}
      inactiveColor={tabConfig.inactiveColor}
      showLabels={tabConfig.showLabels}
    />
  );

  /**
   * getTransitionOptions
   * 说明：根据过渡模式返回屏幕选项。
   * 修复：iOS 上将模态展示改为 containedTransparentModal，避免以独立 VC 覆盖根视图，从而允许顶层浮窗覆盖显示。
   */
  const getTransitionOptions = (mode: TransitionMode) => {
      switch (mode) {
          case 'fade':
              return {
                  headerShown: false,
                  animation: 'fade',
              } as const;
          case 'bottom':
              return {
                  headerShown: false,
                  presentation: Platform.OS === 'ios' ? 'containedTransparentModal' : 'transparentModal',
                  animation: 'fade',
              } as const;
          case 'top':
              return {
                  headerShown: false,
                  presentation: Platform.OS === 'ios' ? 'containedTransparentModal' : 'transparentModal',
                  animation: 'fade',
              } as const;
          case 'left':
              return {
                  headerShown: false,
                  animation: 'slide_from_left',
              } as const;
          case 'right':
              return {
                  headerShown: false,
                  animation: 'slide_from_right',
              } as const;
          case 'none':
              return {
                  headerShown: false,
                  animation: 'none',
              } as const;
          case 'ios':
          default:
              return {
                  headerShown: false,
                  animation: 'slide_from_right',
              } as const;
      }
  };

  const allModals = useMemo(() => {
    const existsDefault = (modals || []).some(m => m.name === 'Modal');
    const existsPicker = (modals || []).some(m => m.name === 'WheelPickerModal');
    const def = { name: 'Modal', component: ModalScreen } as any;
    const picker = { name: 'WheelPickerModal', component: WheelPickerModal } as any;
    if (existsDefault && existsPicker) return modals || [];
    if (existsDefault && !existsPicker) return [{ ...picker }, ...(modals || [])];
    if (!existsDefault && existsPicker) return [{ ...def }, ...(modals || [])];
    return [{ ...def }, { ...picker }, ...(modals || [])];
  }, [modals]);

  return (
    <RootStack.Navigator
      // 若定义了根初始路由，则应用；否则使用 React Navigation 默认行为（第一个声明的屏幕）
      initialRouteName={rootInitialRouteName as any}
      screenOptions={{ headerShown: false }}
    >
      {/* 主标签导航器：仅在存在主组 tabs 时挂载 */}
      {tabs.length > 0 && (
        <RootStack.Screen
          name={tabsScreenName || 'MainTabs'}
          component={TabsComponent}
          options={getTransitionOptions(tabsTransitionMode ?? transitionMode)}
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
          options={getTransitionOptions(tabsTransitionMode ?? transitionMode)}
        />
      ))}

      {/* 堆栈页面：把父 route.params 透传给 StackNavigator */}
      {stacks.map((stack) => (
        <RootStack.Screen
          key={stack.name}
          name={stack.name}
          children={({ route }) => (
            <StackNavigator
              stacks={[stack]}
              initialRouteName={stack.name}
              initialParams={route.params} // 新增：将父层参数传入
              transitionMode={stack.transitionMode || transitionMode}
            />
          )}
          options={getTransitionOptions(stack.transitionMode || transitionMode)}
        />
      ))}

      {/* 模态页面：native-stack 透明模态（iOS 使用 containedTransparentModal） */}
      {allModals.map((modal) => (
        <RootStack.Screen
          key={modal.name}
          name={modal.name}
          component={modal.component}
          initialParams={{ animationDuration }} // 传递全局动画时长
          options={({ route }: any) => {
            const base = getTransitionOptions('fade');
            return {
              ...base,
              presentation: Platform.OS === 'ios' ? 'containedTransparentModal' : 'transparentModal',
              contentStyle: {
                backgroundColor: 'transparent',
                ...((modal.options as any)?.cardStyle || {}),
                ...((modal.options as any)?.contentStyle || {}),
              },
              ...(typeof modal.options === 'function' ? (modal.options as any)({ route }) : (modal.options || {})),
            } as any;
          }}
        />
      ))}
    </RootStack.Navigator>
  );
};
