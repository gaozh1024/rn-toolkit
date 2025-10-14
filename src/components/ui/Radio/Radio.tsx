// 顶部 import 区
import React from 'react';
import { View, Pressable, ViewStyle, TextStyle, StyleProp } from 'react-native';
import { useTheme, useSpacingStyle, SpacingProps } from '../../../theme';
import { buildTestID, TestableProps } from '../../common/test';
import { Icon } from '../Icon';
import { Text } from '../Text';

// 接口与类型
export type RadioSize = 'small' | 'medium' | 'large' | number;
export type RadioColor = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | string;

export interface RadioProps extends SpacingProps, TestableProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: React.ReactNode | string;
  disabled?: boolean;
  size?: RadioSize;
  color?: RadioColor;
  style?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
}

// 组件：Radio
const Radio: React.FC<RadioProps> = ({
  checked = false,
  onChange,
  label,
  disabled = false,
  size = 'medium',
  color = 'primary',
  style,
  labelStyle,
  testID,
  ...props
}) => {
  const { theme } = useTheme();
  const colors = theme.colors;
  const spacingStyle = useSpacingStyle(props);
  const computedTestID = buildTestID('Radio', testID);
  const iconSize = typeof size === 'number' ? size : size === 'small' ? 18 : size === 'large' ? 26 : 22;

  const getThemeColor = (c: RadioColor): string => {
    const preset = ['primary', 'secondary', 'success', 'warning', 'error', 'info'] as const;
    if (preset.includes(c as any)) return colors[c as keyof typeof colors] as string;
    return c as string;
  };

  const activeColor = getThemeColor(color);
  const inactiveColor = disabled ? colors.textDisabled : colors.border;
  const labelColor = disabled ? colors.textDisabled : colors.text;

  const handlePress = () => {
    if (disabled) return;
    if (onChange) onChange(!checked);
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        { flexDirection: 'row', alignItems: 'center', opacity: disabled ? 0.6 : 1 },
        pressed && !disabled ? { opacity: 0.8 } : {},
        spacingStyle,
        style,
      ]}
      accessibilityRole="radio"
      accessibilityState={{ selected: checked, disabled }}
      testID={computedTestID}
    >
      <Icon name={checked ? 'radio-button-on' : 'radio-button-off'} size={iconSize} color={checked ? activeColor : inactiveColor} />
      {label !== undefined && label !== null ? (
        typeof label === 'string' ? (
          <Text style={[{ marginLeft: theme.spacing.xs, color: labelColor }, labelStyle]}>{label}</Text>
        ) : (
          <View style={{ marginLeft: theme.spacing.xs }}>{label}</View>
        )
      ) : null}
    </Pressable>
  );
};

export default Radio;