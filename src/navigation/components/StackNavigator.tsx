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
    // 全局过渡预设
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

  return (
    <Stack.Navigator
      initialRouteName={initialRouteName || stacks[0]?.name}
      screenOptions={commonScreenOptions as any}
    >
      {stacks.map((stack) => {
        let screenOptions = stack.options;
        if (stack.transitionMode) {
          // 单屏覆盖过渡
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
            name={stack.name}
            component={stack.component}
            options={screenOptions}
          />
        );
      })}
    </Stack.Navigator>
  );
};