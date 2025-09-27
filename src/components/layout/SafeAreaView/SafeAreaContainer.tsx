import React from 'react';
import { View, ViewStyle, StyleProp } from 'react-native';
import { SafeAreaView } from './SafeAreaView';
import { Edge } from 'react-native-safe-area-context';
import { useTheme } from '../../../theme—old';

export interface SafeAreaContainerProps {
  children: React.ReactNode;
  edges?: Edge[];
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  backgroundColor?: string;
  showStatusBar?: boolean;
  statusBarBackgroundColor?: string;
  testID?: string;
}

export const SafeAreaContainer: React.FC<SafeAreaContainerProps> = ({
  children,
  edges = ['top', 'bottom', 'left', 'right'],
  style,
  contentStyle,
  backgroundColor,
  showStatusBar = true,
  statusBarBackgroundColor,
  testID,
}) => {
  const theme = useTheme();

  const statusBarStyle: ViewStyle = showStatusBar ? {
    backgroundColor: statusBarBackgroundColor || theme.colors.primary,
    height: 0, // 由 SafeAreaView 自动处理
  } : {};

  return (
    <SafeAreaView
      edges={edges}
      style={[{ backgroundColor: backgroundColor || theme.colors.background }, style]}
      testID={testID}
    >
      {showStatusBar && <View style={statusBarStyle} />}
      <View style={[{ flex: 1 }, contentStyle]}>
        {children}
      </View>
    </SafeAreaView>
  );
};