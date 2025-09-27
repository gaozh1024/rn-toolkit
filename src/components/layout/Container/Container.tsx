import React from 'react';
import { View, ViewStyle, StyleProp, ScrollView } from 'react-native';
import { useTheme } from '../../../theme—old';

export interface ContainerProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  backgroundColor?: string;
  padding?: number | { top?: number; bottom?: number; left?: number; right?: number };
  margin?: number | { top?: number; bottom?: number; left?: number; right?: number };
  flex?: number;
  scrollable?: boolean;
  scrollViewProps?: React.ComponentProps<typeof ScrollView>;
  testID?: string;
}

export const Container: React.FC<ContainerProps> = ({
  children,
  style,
  backgroundColor,
  padding = 0,
  margin = 0,
  flex = 1,
  scrollable = false,
  scrollViewProps,
  testID,
}) => {
  const { theme, colors } = useTheme();

  const paddingStyle = typeof padding === 'number'
    ? { padding }
    : {
      paddingTop: padding.top,
      paddingBottom: padding.bottom,
      paddingLeft: padding.left,
      paddingRight: padding.right,
    };

  const marginStyle = typeof margin === 'number'
    ? { margin }
    : {
      marginTop: margin.top,
      marginBottom: margin.bottom,
      marginLeft: margin.left,
      marginRight: margin.right,
    };

  const containerStyle: ViewStyle = {
    flex,
    backgroundColor: backgroundColor || colors.background,
    ...paddingStyle,
    ...marginStyle,
  };

  if (scrollable) {
    return (
      <ScrollView
        style={[containerStyle, style]}
        testID={testID}
        showsVerticalScrollIndicator={false}
        {...scrollViewProps}
      >
        {children}
      </ScrollView>
    );
  }

  return (
    <View style={[containerStyle, style]} testID={testID}>
      {children}
    </View>
  );
};