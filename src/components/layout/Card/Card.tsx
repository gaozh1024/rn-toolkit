import React from 'react';
import { View, ViewStyle, StyleProp, TouchableOpacity } from 'react-native';
import { useTheme, useSpacingStyle, SpacingProps, SpacingSize } from '../../../theme';

export interface CardProps extends SpacingProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  backgroundColor?: string;
  padding?: SpacingSize; // 改为 SpacingSize 类型，支持 'xs'|'sm'|'md'|'lg'|'xl'|'xxl'|number
  margin?: SpacingSize; // 改为 SpacingSize 类型，支持 'xs'|'sm'|'md'|'lg'|'xl'|'xxl'|number
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

  // 使用 spacing 系统解析 padding 和 margin
  const paddingValue = padding !== undefined ?
    (typeof padding === 'number' ? padding : theme.spacing[padding]) :
    theme.spacing.md;

  const marginValue = margin !== undefined ?
    (typeof margin === 'number' ? margin : theme.spacing[margin]) :
    theme.spacing.sm;

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

  // 应用其他 spacing props (m, mt, mb, p, pt, pb 等)
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