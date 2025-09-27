import React from 'react';
import { ViewStyle, StyleProp } from 'react-native';
import { SafeAreaView as RNSafeAreaView, Edge } from 'react-native-safe-area-context';
import { useTheme } from '../../../theme—old';

export interface SafeAreaViewProps {
  children: React.ReactNode;
  edges?: Edge[];
  style?: StyleProp<ViewStyle>;
  backgroundColor?: string;
  mode?: 'padding' | 'margin';
  testID?: string;
}

export const SafeAreaView: React.FC<SafeAreaViewProps> = ({
  children,
  edges = ['top', 'bottom', 'left', 'right'],
  style,
  backgroundColor,
  mode = 'padding',
  testID,
  ...props
}) => {
  const theme = useTheme();

  const containerStyle: StyleProp<ViewStyle> = {
    flex: 1,
    backgroundColor: backgroundColor || theme.colors.background,
  };

  return (
    <RNSafeAreaView
      edges={edges}
      mode={mode}
      style={[containerStyle, style]}
      testID={testID}
      {...props}
    >
      {children}
    </RNSafeAreaView>
  );
};