import React, { useMemo, useState } from 'react';
import { View, Pressable, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '../../../theme';
import { Icon } from '../Icon';
import { Text } from '../Text';

export type CheckboxSize = 'small' | 'medium' | 'large' | number;
export type CheckboxColor = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | string;

export interface CheckboxProps {
    checked?: boolean;
    defaultChecked?: boolean;
    onChange?: (checked: boolean) => void;
    label?: React.ReactNode | string;
    disabled?: boolean;
    size?: CheckboxSize;
    color?: CheckboxColor;
    style?: ViewStyle | ViewStyle[];
    labelStyle?: TextStyle | TextStyle[];
    testID?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({
    checked,
    defaultChecked = false,
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
    const { colors } = theme;

    const isControlled = typeof checked === 'boolean';
    const [internalChecked, setInternalChecked] = useState<boolean>(defaultChecked);
    const isChecked = isControlled ? (checked as boolean) : internalChecked;

    const boxSize = useMemo(() => {
        if (typeof size === 'number') return size;
        switch (size) {
            case 'small':
                return 18;
            case 'large':
                return 26;
            case 'medium':
            default:
                return 22;
        }
    }, [size]);

    const getThemeColor = (c: CheckboxColor): string => {
        if (!c) return colors.primary;
        const preset = ['primary', 'secondary', 'success', 'warning', 'error', 'info'] as const;
        if (preset.includes(c as any)) {
            return colors[c as keyof typeof colors] as string;
        }
        return c as string;
    };

    const activeColor = getThemeColor(color);
    const borderColor = disabled ? colors.textDisabled : colors.border;
    const labelColor = disabled ? colors.textDisabled : colors.text;

    const iconColor = '#FFFFFF';
    const iconSize = Math.max(12, boxSize - 8);

    const boxStyle: ViewStyle = {
        width: boxSize,
        height: boxSize,
        borderRadius: theme.borderRadius.sm,
        borderWidth: 1,
        borderColor: isChecked ? activeColor : borderColor,
        backgroundColor: isChecked ? activeColor : 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
    };

    const handleToggle = () => {
        if (disabled) return;
        const next = !isChecked;
        if (!isControlled) setInternalChecked(next);
        if (onChange) onChange(next);
    };

    return (
        <Pressable
            onPress={handleToggle}
            style={({ pressed }) => [
                { flexDirection: 'row', alignItems: 'center', opacity: disabled ? 0.6 : 1 },
                pressed && !disabled ? { opacity: 0.8 } : {},
                style,
            ]}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: isChecked, disabled }}
            testID={testID}
        >
            <View style={boxStyle}>
                {isChecked ? <Icon name="checkmark" size={iconSize} color={iconColor} /> : null}
            </View>
            {label !== undefined && label !== null ? (
                typeof label === 'string' ? (
                    <Text style={[{ marginLeft: theme.spacing.xs, color: labelColor }, labelStyle]}>
                        {label}
                    </Text>
                ) : (
                    <View style={{ marginLeft: theme.spacing.xs }}>{label}</View>
                )
            ) : null}
        </Pressable>
    );
};

export default Checkbox;