import React, { forwardRef, useState } from 'react';
import { TextInput, View, ViewStyle, TextStyle, Pressable, StyleProp } from 'react-native';
import { useTheme, useThemeColors } from '../../../theme';
import { Text } from '../Text';
import { Icon } from '../Icon';
import { buildTestID, type TestableProps } from '../../common/test';
import { useSpacingStyle, type SpacingProps } from '../../../theme/spacing';
import { buildBoxStyle, type BoxProps } from '../../common/box';

export interface TextAreaProps extends TestableProps, SpacingProps, BoxProps {
    value?: string;
    defaultValue?: string;
    placeholder?: string;
    secureTextEntry?: boolean;
    disabled?: boolean;
    error?: boolean;
    helperText?: string;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    variant?: 'solid' | 'outline' | 'ghost';
    color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'text' | 'subtext' | string;
    fullWidth?: boolean;
    flex?: number;
    style?: StyleProp<ViewStyle>;
    inputStyle?: TextStyle;
    rows?: number; // 默认行数（最小高度）
    autoSize?: boolean; // 根据内容自动增长高度
    // 新增：清除能力与可编辑控制
    allowClear?: boolean;
    editable?: boolean;
    // 支持两种图标传法：ReactNode 或对象（与 Input 一致）
    leftIcon?: React.ReactNode | { name: string; color?: string; size?: number };
    rightIcon?: React.ReactNode | { name: string; color?: string; size?: number; onPress?: () => void };
    onChangeText?: (text: string) => void;
    onFocus?: () => void;
    onBlur?: () => void;
}

type IconObject = { name: string; color?: string; size?: number; onPress?: () => void };
const isIconObject = (x: any): x is IconObject => !!x && typeof x === 'object' && 'name' in x;

const TextArea = forwardRef<TextInput, TextAreaProps>((props, ref) => {
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
        rows = 3,
        autoSize = true,
        leftIcon,
        rightIcon,
        onChangeText,
        onFocus,
        onBlur,
        // 新增默认值
        allowClear = false,
        editable = true,
        testID,
        ...restProps
    } = props;

    const { theme } = useTheme();
    const colors = useThemeColors();
    const [isFocused, setIsFocused] = useState(false);
    const [height, setHeight] = useState<number | undefined>(undefined);
    // 新增：受控/非受控文本值，用于 allowClear 正常工作
    const [localValue, setLocalValue] = useState<string>(defaultValue ?? '');
    const isControlled = props.value !== undefined;
    const currentValue = isControlled ? value! : localValue;

    const widthStyle: ViewStyle = flex != null ? { flex } : fullWidth ? { width: '100%' } : {};

    const lineHeightBySize = 22;

    const minHeight = Math.max(1, rows) * lineHeightBySize + theme.spacing.sm * 2; // 含上下内边距

    const baseBorderColor = error
        ? colors.error
        : isFocused
            ? colors.primary
            : colors.border;

    const spacingStyle = useSpacingStyle(restProps);

    const defaultBackground =
        variant === 'solid'
            ? colors.surface
            : variant === 'ghost'
                ? 'transparent'
                : colors.background;

    const containerStyle: ViewStyle = {
        ...buildBoxStyle(
            { defaultBackground },
            restProps,
            {
                borderWidth: variant === 'outline' ? 1 : 0,
                borderColor: variant === 'outline' ? baseBorderColor : 'transparent',
                borderRadius: theme.borderRadius.lg,
                opacity: disabled ? 0.6 : 1,
                paddingHorizontal: theme.spacing.sm,
                paddingVertical: theme.spacing.md,
                ...widthStyle,
            }
        ),
    };

    const textColor = disabled ? (colors.textDisabled ?? colors.subtext) : (colors.text ?? colors.text);
    const placeholderTextColor = colors.subtext;

    // 图标颜色与尺寸（与 Input 一致）
    const iconColor = (typeof color === 'string' && (theme.colors as any)[color])
        ? (theme.colors as any)[color]
        : (typeof color === 'string' ? color : theme.colors.primary);
    const iconSize = size === 'xs' ? 16 : size === 'sm' ? 18 : size === 'md' ? 20 : size === 'lg' ? 22 : 24;

    const canClear = allowClear && !disabled && (currentValue?.length ?? 0) > 0;
    const handleClear = () => {
        if (isControlled) {
            if (onChangeText) onChangeText('');
        } else {
            if (setLocalValue) setLocalValue('');
            if (onChangeText) onChangeText('');
        }
    };

    return (
        <View style={[containerStyle, spacingStyle, style]} testID={buildTestID('TextArea', testID)}>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                {
                    leftIcon ? (
                        isIconObject(leftIcon) ?
                            (
                                <View style={{ marginRight: theme.spacing.xs }}>
                                    <Icon name={leftIcon.name} size={leftIcon.size ?? iconSize} color={leftIcon.color ?? iconColor} />
                                </View>
                            ) :
                            (
                                <View style={{ marginRight: theme.spacing.xs }}>{leftIcon as React.ReactNode}</View>
                            )
                    ) : null
                }

                <TextInput
                    ref={ref}
                    value={currentValue}
                    defaultValue={defaultValue}
                    placeholder={placeholder}
                    placeholderTextColor={placeholderTextColor}
                    secureTextEntry={secureTextEntry}
                    editable={editable && !disabled}
                    onChangeText={(t) => {
                        if (!isControlled) setLocalValue(t);
                        if (onChangeText) onChangeText(t);
                    }}
                    onFocus={() => {
                        setIsFocused(true);
                        if (onFocus) onFocus();
                    }}
                    onBlur={() => {
                        setIsFocused(false);
                        if (onBlur) onBlur();
                    }}
                    multiline
                    numberOfLines={rows}
                    onContentSizeChange={(e) => {
                        if (!autoSize) return;
                        const contentHeight = e.nativeEvent.contentSize.height;
                        setHeight(Math.max(minHeight, contentHeight));
                    }}
                    textAlignVertical="top"
                    style={[
                        {
                            color: textColor,
                            minHeight,
                            height: autoSize ? height : undefined,
                            lineHeight: 22,
                            paddingVertical: 2,
                            paddingHorizontal: 0,
                            flex: 1,
                        },
                        inputStyle,
                    ]}
                />

                {
                    canClear ?
                        (
                            <Pressable onPress={handleClear} hitSlop={8} style={{ marginLeft: theme.spacing.xs }}>
                                <Icon name="close-circle" size={iconSize} color={iconColor} />
                            </Pressable>
                        ) :
                        rightIcon ?
                            (
                                isIconObject(rightIcon) ?
                                    (
                                        <Pressable onPress={rightIcon.onPress} hitSlop={8} disabled={disabled} style={{ marginLeft: theme.spacing.xs }}>
                                            <Icon name={rightIcon.name} size={rightIcon.size ?? iconSize} color={rightIcon.color ?? iconColor} />
                                        </Pressable>
                                    ) :
                                    (
                                        <View style={{ marginLeft: theme.spacing.xs }}>{rightIcon as React.ReactNode}</View>
                                    )
                            ) : null
                }
            </View>
            {helperText ? (
                <View style={{ marginTop: theme.spacing.xs }}>
                    <Text color={error ? 'error' : 'subtext'} size={size}>{helperText}</Text>
                </View>
            ) : null}
        </View>
    );
});

export default TextArea;

