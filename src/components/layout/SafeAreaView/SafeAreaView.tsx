import React from 'react';
import { ViewStyle, StyleProp, View } from 'react-native';
import { SafeAreaView as RNSafeAreaView, Edge } from 'react-native-safe-area-context';
import { useTheme } from '../../../theme/hooks';

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
  const { theme } = useTheme();
  const colors = theme.colors;

  const containerStyle: StyleProp<ViewStyle> = {
    flex: 1,
    backgroundColor: backgroundColor || colors.background,
  };

  return (
    <View style={[{ flex: 1 }, containerStyle, style]}>
      <RNSafeAreaView
        edges={edges}
        mode={mode}
        testID={testID}
        style={{ flex: 1 }}
        {...props}
      >
        {children}
      </RNSafeAreaView>
    </View>
  );
};