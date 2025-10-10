import React, { useMemo, useState } from 'react';
import { View, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '../../../theme';
import Radio, { RadioSize, RadioColor } from './Radio';

export type RadioGroupLayout = 'vertical' | 'horizontal';

export interface RadioGroupOption {
  label: React.ReactNode | string;
  value: string | number;
  disabled?: boolean;
}

export interface RadioGroupProps {
  value?: string | number;
  defaultValue?: string | number;
  onChange?: (value: string | number) => void;
  options: RadioGroupOption[];
  layout?: RadioGroupLayout;
  size?: RadioSize;
  color?: RadioColor;
  disabled?: boolean;
  gap?: number;
  style?: ViewStyle | ViewStyle[];
  optionStyle?: ViewStyle | ViewStyle[];
  labelStyle?: TextStyle | TextStyle[];
  testID?: string;
}

const RadioGroup: React.FC<RadioGroupProps> = ({
  value,
  defaultValue,
  onChange,
  options,
  layout = 'vertical',
  size = 'medium',
  color = 'primary',
  disabled = false,
  gap,
  style,
  optionStyle,
  labelStyle,
  testID,
}) => {
  const { theme } = useTheme();
  const spacing = theme.spacing;

  const isControlled = typeof value !== 'undefined';
  const [internalValue, setInternalValue] = useState<string | number | undefined>(defaultValue);
  const currentValue = isControlled ? value : internalValue;

  const containerStyle: ViewStyle = useMemo(() => {
    return {
      flexDirection: layout === 'horizontal' ? 'row' : 'column',
      alignItems: layout === 'horizontal' ? 'center' : 'flex-start',
    };
  }, [layout]);

  const itemGap = typeof gap === 'number' ? gap : layout === 'horizontal' ? spacing.md : spacing.sm;

  return (
    <View style={[containerStyle, style]} accessibilityRole="radiogroup" testID={testID}>
      {options.map((opt, idx) => {
        const isSelected = currentValue === opt.value;
        const itemStyle: ViewStyle = {
          marginRight: layout === 'horizontal' && idx < options.length - 1 ? itemGap : 0,
          marginBottom: layout === 'vertical' && idx < options.length - 1 ? itemGap : 0,
        };
        return (
          <View key={String(opt.value)} style={[itemStyle, optionStyle]}>
            <Radio
              checked={isSelected}
              onChange={() => {
                if (disabled || opt.disabled) return;
                if (!isControlled) setInternalValue(opt.value);
                if (onChange) onChange(opt.value);
              }}
              label={opt.label}
              disabled={disabled || !!opt.disabled}
              size={size}
              color={color}
              labelStyle={labelStyle}
            />
          </View>
        );
      })}
    </View>
  );
};

export default RadioGroup;