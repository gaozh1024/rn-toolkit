import React from 'react';
import { View, Pressable, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '../../../theme';
import { Icon } from '../Icon';
import { Text } from '../Text';

export type RadioSize = 'small' | 'medium' | 'large' | number;
export type RadioColor = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | string;

export interface RadioProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: React.ReactNode | string;
  disabled?: boolean;
  size?: RadioSize;
  color?: RadioColor;
  style?: ViewStyle | ViewStyle[];
  labelStyle?: TextStyle | TextStyle[];
  testID?: string;
}

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
}) => {
  const { theme } = useTheme();
  const colors = theme.colors;

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
        style,
      ]}
      accessibilityRole="radio"
      accessibilityState={{ selected: checked, disabled }}
      testID={testID}
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