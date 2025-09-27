import React from 'react';
import { View, ViewStyle, TextStyle, StyleProp } from 'react-native';
import { useTheme } from '../../../theme—old';
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
  const { colors } = useTheme();

  const defaultTitleStyle: TextStyle = {
    fontSize: 18,
    fontWeight: '600',
    color: colors.onBackground,
    marginBottom: subtitle ? 4 : spacing,
  };

  const defaultSubtitleStyle: TextStyle = {
    fontSize: 14,
    color: colors.placeholder,
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