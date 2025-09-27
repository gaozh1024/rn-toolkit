import React from 'react';
import { View, ViewStyle, StyleProp, TouchableOpacity } from 'react-native';
import { useTheme } from '../../../theme—old';

export interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  backgroundColor?: string;
  padding?: number;
  margin?: number;
  borderRadius?: number;
  elevation?: number;
  shadowColor?: string;
  onPress?: () => void;
  disabled?: boolean;
  testID?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  backgroundColor,
  padding = 16,
  margin = 8,
  borderRadius = 12,
  elevation = 2,
  shadowColor,
  onPress,
  disabled = false,
  testID,
}) => {
  const { theme, colors } = useTheme();

  const cardStyle: ViewStyle = {
    backgroundColor: backgroundColor || colors.surface,
    padding,
    margin,
    borderRadius,
    // iOS 阴影
    shadowColor: shadowColor || colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // Android 阴影
    elevation,
  };

  if (onPress) {
    return (
      <TouchableOpacity
        style={[cardStyle, style]}
        onPress={onPress}
        disabled={disabled}
        activeOpacity={0.7}
        testID={testID}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View style={[cardStyle, style]} testID={testID}>
      {children}
    </View>
  );
};