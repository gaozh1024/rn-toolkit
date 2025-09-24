import React from 'react';
import { View, Text, ViewStyle, TextStyle, StyleProp } from 'react-native';
import { useTheme } from '../../../utils/useTheme';

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
  const theme = useTheme();

  const defaultTitleStyle: TextStyle = {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.onBackground,
    marginBottom: subtitle ? 4 : spacing,
  };

  const defaultSubtitleStyle: TextStyle = {
    fontSize: 14,
    color: theme.colors.placeholder,
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