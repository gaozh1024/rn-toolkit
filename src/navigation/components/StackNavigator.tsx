import React, { useMemo } from 'react';
import { createStackNavigator, CardStyleInterpolators, TransitionPresets } from '@react-navigation/stack';
import { StackConfig, TransitionMode } from '../types';

const Stack = createStackNavigator();

interface StackNavigatorProps {
  stacks: StackConfig[];
  initialRouteName?: string;
  transitionMode?: TransitionMode;
}

export const StackNavigator: React.FC<StackNavigatorProps> = ({
  stacks,
  initialRouteName,
  transitionMode = 'ios',
}) => {
  const commonScreenOptions = useMemo(() => {
    switch (transitionMode) {
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
          gestureDirection: 'vertical' as const,
        } as const;
      case 'top':
        return {
          headerShown: false,
          ...TransitionPresets.ModalSlideFromBottomIOS,
          cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
          presentation: 'modal' as const,
          gestureDirection: 'vertical-inverted' as const,
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
  }, [transitionMode]);

  // 新增：将父层传入的初始路由名映射为子层屏幕名（添加后缀）
  const mapToInnerRoute = (name?: string) => (name ? `${name}__screen` : undefined);
  const initialInnerRoute = mapToInnerRoute(initialRouteName) || (stacks[0]?.name ? `${stacks[0].name}__screen` : undefined);

  return (
    <Stack.Navigator
      // 修改：使用映射后的初始路由名，避免与父层重复
      initialRouteName={initialInnerRoute}
      screenOptions={commonScreenOptions as any}
    >
      {stacks.map((stack) => {
        let screenOptions = stack.options;
        if (stack.transitionMode) {
          switch (stack.transitionMode) {
            case 'fade':
              screenOptions = {
                ...screenOptions,
                ...TransitionPresets.FadeFromBottomAndroid,
                cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter,
              } as any;
              break;
            case 'bottom':
              screenOptions = {
                ...screenOptions,
                ...TransitionPresets.ModalSlideFromBottomIOS,
                cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
                presentation: 'modal',
                gestureDirection: 'vertical',
              } as any;
              break;
            case 'top':
              screenOptions = {
                ...screenOptions,
                ...TransitionPresets.ModalSlideFromBottomIOS,
                cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
                presentation: 'modal',
                gestureDirection: 'vertical-inverted',
              } as any;
              break;
            case 'left':
              screenOptions = {
                ...screenOptions,
                ...TransitionPresets.SlideFromRightIOS,
                cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
                gestureDirection: 'horizontal-inverted',
              } as any;
              break;
            case 'right':
              screenOptions = {
                ...screenOptions,
                ...TransitionPresets.SlideFromRightIOS,
                cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
                gestureDirection: 'horizontal',
              } as any;
              break;
            case 'none':
              screenOptions = {
                ...screenOptions,
                animationEnabled: false,
              } as any;
              break;
            case 'ios':
            default:
              screenOptions = {
                ...screenOptions,
                ...TransitionPresets.SlideFromRightIOS,
                cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
              } as any;
          }
        }

        return (
          <Stack.Screen
            key={stack.name}
            // 修改：为子层屏幕名称添加后缀，避免与父层同名
            name={`${stack.name}__screen`}
            component={stack.component}
            options={screenOptions}
          />
        );
      })}
    </Stack.Navigator>
  );
};