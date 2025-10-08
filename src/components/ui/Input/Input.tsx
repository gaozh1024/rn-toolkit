import React, { forwardRef } from 'react';
import { View, TextInput, StyleSheet, Pressable, ViewStyle, TextStyle, Text } from 'react-native';
import { useTheme } from '../../../theme/hooks';
import { Icon } from '../Icon';

export type InputSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type InputVariant = 'solid' | 'outline' | 'ghost';

export interface InputProps {
    value?: string;
    defaultValue?: string;
    placeholder?: string;
    secureTextEntry?: boolean;
    disabled?: boolean;
    error?: boolean;
    helperText?: string;
    size?: InputSize;
    variant?: InputVariant;
    color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'text' | 'textSecondary' | string;
    fullWidth?: boolean;
    flex?: number;
    style?: ViewStyle;
    inputStyle?: TextStyle;
    leftIcon?: { name: string; color?: string; size?: number };
    rightIcon?: { name: string; color?: string; size?: number; onPress?: () => void };
    editable?: boolean;
    keyboardType?: import('react-native').KeyboardTypeOptions;
    returnKeyType?: import('react-native').ReturnKeyType;
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
    onChangeText?: (text: string) => void;
    onFocus?: () => void;
    onBlur?: () => void;
    accessibilityLabel?: string;
    accessibilityHint?: string;
    testID?: string;
    // 新增：可配置的内边距与圆角
    paddingH?: number;
    paddingV?: number;
    radius?: number;
}

const Input = forwardRef<TextInput, InputProps>((props, ref) => {
    const {
        value,
        defaultValue,
        placeholder,
        secureTextEntry,
        disabled,
        error,
        helperText,
        size = 'md',
        variant = 'outline',
        color = 'primary',
        fullWidth,
        flex,
        style,
        inputStyle,
        leftIcon,
        rightIcon,
        editable = true,
        keyboardType,
        returnKeyType,
        autoCapitalize = 'none',
        onChangeText,
        onFocus,
        onBlur,
        accessibilityLabel,
        accessibilityHint,
        testID,
    } = props;

    const { theme } = useTheme();
    const colors = theme.colors;

    const widthStyle: ViewStyle = flex != null ? { flex } : fullWidth ? { width: '100%' } : {};

    const baseBorderColor = error ? colors.error : colors.border;
    const bgColor = variant === 'solid' ? colors.surface : colors.background;
    const borderWidth = variant === 'outline' ? 1 : 0;

    // 原默认值改为优先取 props，未传入时使用主题值
    const paddingH = props.paddingH ?? theme.spacing.sm;
    const paddingV = props.paddingV ?? theme.spacing.md;
    const radius = props.radius ?? theme.borderRadius.lg;

    const containerStyle: ViewStyle = {
        backgroundColor: bgColor,
        borderWidth,
        borderColor: baseBorderColor,
        borderRadius: radius,
        opacity: disabled ? 0.6 : 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: paddingH,
        paddingVertical: paddingV,
        ...widthStyle,
    };

    const textColor = disabled ? colors.textDisabled : colors.text;
    const placeholderTextColor = colors.textSecondary;

    const iconColor = typeof color === 'string' && colors[color as keyof typeof colors]
        ? (colors[color as keyof typeof colors] as string)
        : (typeof color === 'string' ? color : colors.primary);

    const iconSize = size === 'xs' ? 16 : size === 'sm' ? 18 : size === 'md' ? 20 : size === 'lg' ? 22 : 24;

    return (
        <View style={[containerStyle, style]} testID={testID} accessible accessibilityLabel={accessibilityLabel} accessibilityHint={accessibilityHint}>
            {leftIcon?.name ? (
                <Icon name={leftIcon.name} size={leftIcon.size ?? iconSize} color={leftIcon.color ?? iconColor} />
            ) : null}

            <TextInput
                ref={ref}
                value={value}
                defaultValue={defaultValue}
                placeholder={placeholder}
                placeholderTextColor={placeholderTextColor}
                secureTextEntry={secureTextEntry}
                editable={editable && !disabled}
                keyboardType={keyboardType}
                returnKeyType={returnKeyType}
                autoCapitalize={autoCapitalize}
                onChangeText={onChangeText}
                onFocus={onFocus}
                onBlur={onBlur}
                style={[styles.input, { color: textColor }, inputStyle]}
            />

            {rightIcon?.name ? (
                <Pressable onPress={rightIcon.onPress} hitSlop={8} disabled={disabled}>
                    <Icon name={rightIcon.name} size={rightIcon.size ?? iconSize} color={rightIcon.color ?? iconColor} />
                </Pressable>
            ) : null}

            {!!helperText && (
                <Text style={[styles.helperText, { color: error ? colors.error : colors.textSecondary }]}>{helperText}</Text>
            )}
        </View>
    );
});

const styles = StyleSheet.create({
    input: {
        flex: 1,
        paddingVertical: 0,
        marginHorizontal: 8,
        fontSize: 16,
    },
    helperText: {
        position: 'absolute',
        left: 12,
        bottom: -18,
        fontSize: 12,
    },
});

export default Input;