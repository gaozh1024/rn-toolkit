import React from 'react';
import { View, ViewStyle, StyleProp, TouchableOpacity } from 'react-native';
import { useTheme, useSpacingStyle, SpacingProps } from '../../../theme';

export interface CardProps extends SpacingProps {
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
  transparent?: boolean;
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
  transparent = false,
  testID,
  ...props
}) => {
  const { theme, styles } = useTheme();

  const paddingValue = typeof padding === 'number' ? padding : theme.spacing.md;
  const marginValue = typeof margin === 'number' ? margin : theme.spacing.sm;
  const borderRadiusValue = typeof borderRadius === 'number' ? borderRadius : theme.borderRadius.lg;
  const backgroundColorValue = transparent ? 'transparent' : (backgroundColor || theme.colors.card);

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

  const spacingStyle = useSpacingStyle(props);

  if (onPress) {
    return (
      <TouchableOpacity
        style={[cardStyle, spacingStyle, style]}
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
    <View style={[cardStyle, spacingStyle, style]} testID={testID}>
      {children}
    </View>
  );
};