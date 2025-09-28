import React from 'react';
import { View, ViewStyle, TextStyle, StyleProp } from 'react-native';
import { useTheme } from '../../../theme/hooks';
import { Text } from '../../ui/Text';

export interface SectionProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  style?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  subtitleStyle?: StyleProp<TextStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  spacing?: number;
  testID?: string;
}

export const Section: React.FC<SectionProps> = ({
  children,
  title,
  subtitle,
  style,
  titleStyle,
  subtitleStyle,
  contentStyle,
  spacing = 16,
  testID,
}) => {
  const { theme } = useTheme();
  const colors = theme.colors;

  const defaultTitleStyle: TextStyle = {
    ...theme.text.h6,
    color: theme.text.h6.color ?? colors.text,
    marginBottom: subtitle ? 4 : spacing,
  };

  const defaultSubtitleStyle: TextStyle = {
    ...theme.text.caption,
    color: theme.text.caption.color ?? colors.textSecondary,
    marginBottom: spacing,
  };

  return (
    <View style={style} testID={testID}>
      {title && (
        <Text style={[defaultTitleStyle, titleStyle]}>
          {title}
        </Text>
      )}
      {subtitle && (
        <Text style={[defaultSubtitleStyle, subtitleStyle]}>
          {subtitle}
        </Text>
      )}
      <View style={contentStyle}>
        {children}
      </View>
    </View>
  );
};