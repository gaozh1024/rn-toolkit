import React from 'react';
import { View, ViewStyle, StyleProp, TouchableOpacity } from 'react-native';
import { useTheme } from '../../../theme';

export interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  backgroundColor?: string;
  padding?: number;
  margin?: number;
  borderRadius?: number;
  elevation?: number;
  shadowColor?: string;
  shadowSize?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  onPress?: () => void;
  disabled?: boolean;
  testID?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  backgroundColor,
  padding,
  margin,
  borderRadius,
  elevation,
  shadowColor,
  shadowSize = 'md',
  onPress,
  disabled = false,
  testID,
}) => {
  const { theme, styles } = useTheme();

  const paddingValue = typeof padding === 'number' ? padding : theme.spacing.md;
  const marginValue = typeof margin === 'number' ? margin : theme.spacing.sm;
  const borderRadiusValue = typeof borderRadius === 'number' ? borderRadius : theme.borderRadius.lg;
  const backgroundColorValue = backgroundColor || theme.colors.card;

  const shadowPreset = styles.shadow[shadowSize] || styles.shadow.md;
  const shadowStyle: ViewStyle = {
    ...shadowPreset,
    shadowColor: shadowColor || theme.colors.shadow,
  };

  const cardStyle: ViewStyle = {
    backgroundColor: backgroundColorValue,
    padding: paddingValue,
    margin: marginValue,
    borderRadius: borderRadiusValue,
    ...shadowStyle,
    ...(typeof elevation === 'number' ? { elevation } : {}),
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