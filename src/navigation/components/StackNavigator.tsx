import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { StackConfig } from '../types';

const Stack = createStackNavigator();

interface StackNavigatorProps {
  stacks: StackConfig[];
  initialRouteName?: string;
}

export const StackNavigator: React.FC<StackNavigatorProps> = ({
  stacks,
  initialRouteName,
}) => {
  return (
    <Stack.Navigator
      initialRouteName={initialRouteName || stacks[0]?.name}
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: '#FFFFFF',
        },
        headerTintColor: '#000000',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      {stacks.map((stack) => (
        <Stack.Screen
          key={stack.name}
          name={stack.name}
          component={stack.component}
          options={stack.options}
        />
      ))}
    </Stack.Navigator>
  );
};