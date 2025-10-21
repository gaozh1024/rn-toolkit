import React, { useMemo } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StackConfig, TransitionMode } from '../types';

const Stack = createNativeStackNavigator();

interface StackNavigatorProps {
  stacks: StackConfig[];
  initialRouteName?: string;
  transitionMode?: TransitionMode;
  initialParams?: any; // 新增：用于透传父路由参数到初始子屏幕
}

export const StackNavigator: React.FC<StackNavigatorProps> = ({
  stacks,
  initialRouteName,
  initialParams, // 新增：从 props 接收
  transitionMode = 'ios',
}) => {
  const commonScreenOptions = useMemo(() => {
    switch (transitionMode) {
      case 'fade':
        return {
          headerShown: false,
          animation: 'fade',
        } as const;
      case 'bottom':
        return {
          headerShown: false,
          presentation: 'modal',
          animation: 'slide_from_bottom',
        } as const;
      case 'top':
        return {
          headerShown: false,
          presentation: 'modal',
          animation: 'slide_from_top',
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
  }, [transitionMode]);

  // 将父层传入的初始路由名映射为子层屏幕名（添加后缀）
  const mapToInnerRoute = (name?: string) => (name ? `${name}__screen` : undefined);
  const initialInnerRoute = mapToInnerRoute(initialRouteName) || (stacks[0]?.name ? `${stacks[0].name}__screen` : undefined);

  return (
    <Stack.Navigator
      initialRouteName={initialInnerRoute}
      screenOptions={commonScreenOptions as any}
    >
      {stacks.map((stack) => {
        const localTransition = (() => {
          switch (stack.transitionMode) {
            case 'fade':
              return { animation: 'fade' } as any;
            case 'bottom':
              return { presentation: 'modal', animation: 'slide_from_bottom' } as any;
            case 'top':
              return { presentation: 'modal', animation: 'slide_from_top' } as any;
            case 'left':
              return { animation: 'slide_from_left' } as any;
            case 'right':
              return { animation: 'slide_from_right' } as any;
            case 'none':
              return { animation: 'none' } as any;
            case 'ios':
            default:
              return { animation: 'slide_from_right' } as any;
          }
        })();

        const screenOptions = {
          ...(stack.options as any),
          ...localTransition,
        };

        const isInitial = `${stack.name}__screen` === initialInnerRoute;

        return (
          <Stack.Screen
            key={stack.name}
            name={`${stack.name}__screen`}
            component={stack.component}
            options={screenOptions}
            initialParams={isInitial ? initialParams : undefined} // 新增：仅给初始子屏幕设置参数
          />
        );
      })}
    </Stack.Navigator>
  );
}