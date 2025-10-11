import React from 'react';
import { View, Pressable, ViewStyle, AccessibilityActionEvent } from 'react-native';
import { IconButton } from '../IconButton';
import { useTheme, useThemeColors } from '../../../theme';

export interface StepperProps {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  onChange?: (next: number) => void;
  style?: ViewStyle | ViewStyle[];
  testID?: string;
}

const Stepper: React.FC<StepperProps> = ({
  value,
  min,
  max,
  step = 1,
  disabled = false,
  onChange,
  style,
  testID,
}) => {
  const { theme } = useTheme();
  const colors = useThemeColors();

  const clamp = (n: number): number => {
    const lo = min ?? Number.NEGATIVE_INFINITY;
    const hi = max ?? Number.POSITIVE_INFINITY;
    return Math.min(hi, Math.max(lo, n));
  };

  const canDecrement = !disabled && (min == null || value > min);
  const canIncrement = !disabled && (max == null || value < max);

  const containerStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: (theme.spacing as any)?.xs ?? 8,
    // 兜底边框与圆角，便于与其它输入控件并排
    borderWidth: 1,
    borderColor: (colors as any).border ?? '#DADDE2',
    borderRadius: theme.borderRadius?.md ?? 8,
    paddingHorizontal: (theme.spacing as any)?.xs ?? 8,
    paddingVertical: (theme.spacing as any)?.xs ?? 8,
    opacity: disabled ? 0.6 : 1,
  };

  const apply = (next: number) => {
    const clamped = clamp(next);
    if (clamped !== value && onChange) {
      onChange(clamped);
    }
  };

  const onAccessibilityAction = (event: AccessibilityActionEvent) => {
    const action = event.nativeEvent.actionName;
    if (disabled) return;
    if (action === 'increment' && canIncrement) {
      apply(value + step);
    } else if (action === 'decrement' && canDecrement) {
      apply(value - step);
    }
  };

  return (
    <Pressable
      testID={testID}
      accessible
      accessibilityRole="adjustable"
      accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
      onAccessibilityAction={onAccessibilityAction}
      style={[containerStyle, style]}
    >
      <IconButton name="remove-outline" variant="ghost" disabled={!canDecrement} onPress={() => apply(value - step)} />
      <IconButton name="add-outline" variant="ghost" disabled={!canIncrement} onPress={() => apply(value + step)} />
    </Pressable>
  );
};

export default Stepper;