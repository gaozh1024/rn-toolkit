import React, { forwardRef } from 'react';
import { View, TextInput, StyleSheet, Pressable, ViewStyle, TextStyle, Text, StyleProp } from 'react-native';
import { useTheme } from '../../../theme/hooks';
import { Icon, IconType } from '../Icon';
import { useSpacingStyle, SpacingProps } from '../../../theme/spacing';
import { buildTestID, TestableProps } from '../../common/test';
import { buildBoxStyle, BoxProps } from '../../common/box';

export type InputSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type InputVariant = 'solid' | 'outline' | 'ghost';

export interface InputProps extends SpacingProps, TestableProps, BoxProps {
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
    // 保留兼容：通过 BoxProps 推荐设置宽高；如需兼容旧用法，可继续传入
    fullWidth?: boolean;
    flex?: number;
    style?: StyleProp<ViewStyle>;
    inputStyle?: StyleProp<TextStyle>;
    leftIcon?: { name: string; color?: string; size?: number; type?: IconType };
    rightIcon?: { name: string; color?: string; size?: number; onPress?: () => void; type?: IconType };
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

    // 间距样式与测试ID
    const spacingStyle = useSpacingStyle(props);
    const computedTestID = buildTestID('Input', testID);

    // 旧兼容：宽度/弹性
    const widthStyle: ViewStyle = flex != null ? { flex } : fullWidth ? { width: '100%' } : {};

    // 错误态边框色与默认背景
    const baseBorderColor = error ? colors.error : colors.border;
    const defaultBackground =
        variant === 'ghost'
            ? 'transparent'
            : (variant === 'solid' ? colors.surface : colors.background);

    // 容器基础与变体样式
    const base: ViewStyle = {
        flexDirection: 'row',
        alignItems: 'center',
        opacity: disabled ? 0.6 : 1,
        paddingHorizontal: theme.spacing?.sm ?? 8,
        paddingVertical: theme.spacing?.md ?? 12,
    };
    const variantOverrides: ViewStyle = {
        backgroundColor: defaultBackground,
        borderWidth: variant === 'outline' ? 1 : 0,
        borderColor: baseBorderColor,
        borderRadius: theme.borderRadius?.lg ?? 12,
        ...widthStyle,
    };

    // 盒子样式（支持 BoxProps 覆盖宽高/背景/边框等）
    const boxStyle = buildBoxStyle({ defaultBackground }, props, { ...base, ...variantOverrides });
    const containerStyle: StyleProp<ViewStyle> = [boxStyle, spacingStyle, style];

    // 文本与图标样式
    const textColor = disabled ? colors.textDisabled : colors.text;
    const placeholderTextColor = colors.textSecondary;
    const iconColor = typeof color === 'string' && (colors as any)[color]
        ? (colors as any)[color]
        : (typeof color === 'string' ? color : colors.primary);
    const iconSize = size === 'xs' ? 16 : size === 'sm' ? 18 : size === 'md' ? 20 : size === 'lg' ? 22 : 24;

    return (
        <View
            style={containerStyle}
            testID={computedTestID}
            accessible
            accessibilityLabel={accessibilityLabel}
            accessibilityHint={accessibilityHint}
        >
            {leftIcon?.name ? (
                <Icon
                    name={leftIcon.name}
                    type={leftIcon.type}
                    size={leftIcon.size ?? iconSize}
                    color={leftIcon.color ?? iconColor}
                />
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
                    <Icon
                        name={rightIcon.name}
                        type={rightIcon.type}
                        size={rightIcon.size ?? iconSize}
                        color={rightIcon.color ?? iconColor}
                    />
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