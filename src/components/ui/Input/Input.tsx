// 修改 import：增加 useRef/useCallback，并移除未使用的 View
import React, { forwardRef, useRef, useCallback } from 'react';
import { TextInput, StyleSheet, Pressable, ViewStyle, TextStyle, Text, StyleProp, Platform, View } from 'react-native';
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
    maxLength?: number;
    onChangeText?: (text: string) => void;
    onFocus?: () => void;
    onBlur?: () => void;
    /**
     * 是否在渲染后自动聚焦；并通过回调返回是否成功获得焦点
     */
    autoFocus?: boolean;
    /**
     * 自动聚焦结果回调：true=获得焦点，false=未获得焦点
     */
    onAutoFocusResult?: (focused: boolean) => void;
    accessibilityLabel?: string;
    accessibilityHint?: string;
    testID?: string;
}

// Input 组件（forwardRef）
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
        maxLength,
        onChangeText,
        onFocus,
        onBlur,
        autoFocus,
        onAutoFocusResult,
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

    // 本地保存 TextInput 引用，方便容器点击时聚焦
    const innerRef = useRef<TextInput | null>(null);
    const requestedAutoFocusRef = useRef(false);
    const [isFocused, setIsFocused] = React.useState(false);

    /**
     * 同步内部 ref 与外部转发的 ref
     * 保证容器点击聚焦可用，同时不影响外部拿到 input 引用
     */
    const setRef = useCallback((node: TextInput | null) => {
        innerRef.current = node;
        if (typeof ref === 'function') {
            ref(node);
        } else if (ref && 'current' in ref) {
            (ref as React.MutableRefObject<TextInput | null>).current = node;
        }
    }, [ref]);

    /**
     * 点击容器触发聚焦
     * 解决只有点中间才能选中的问题
     */
    const handleContainerPress = useCallback(() => {
        if (disabled || !editable) return;
        innerRef.current?.focus();
    }, [disabled, editable]);

    /**
     * 焦点事件包装：上报给外部，同时在自动聚焦路径中返回成功
     */
    const handleFocus = useCallback(() => {
        setIsFocused(true);
        if (requestedAutoFocusRef.current) {
            onAutoFocusResult?.(true);
            requestedAutoFocusRef.current = false;
        }
        onFocus?.();
    }, [onFocus, onAutoFocusResult]);

    const handleBlur = useCallback(() => {
        setIsFocused(false);
        onBlur?.();
    }, [onBlur]);

    /**
     * 自动聚焦流程：尝试 focus，并在超时未获得焦点时回调 false
     */
    React.useEffect(() => {
        if (!autoFocus) return;
        if (disabled || !editable) {
            onAutoFocusResult?.(false);
            return;
        }
        requestedAutoFocusRef.current = true;
        // 触发聚焦（同时将 autoFocus 传递给 TextInput）
        const tick = setTimeout(() => innerRef.current?.focus(), 0);
        const timer = setTimeout(() => {
            if (requestedAutoFocusRef.current) {
                const ok = !!innerRef.current?.isFocused && innerRef.current.isFocused();
                onAutoFocusResult?.(ok);
                requestedAutoFocusRef.current = false;
            }
        }, 600);
        return () => {
            clearTimeout(tick);
            clearTimeout(timer);
        };
    }, [autoFocus, disabled, editable, onAutoFocusResult]);

    return (
        <Pressable
            onPress={handleContainerPress}
            style={containerStyle}
            testID={computedTestID}
            accessible
            accessibilityLabel={accessibilityLabel}
            accessibilityHint={accessibilityHint}
        >
            {/* 左侧图标 */}
            {leftIcon?.name ? (
                <Icon
                    name={leftIcon.name}
                    type={leftIcon.type}
                    size={leftIcon.size ?? iconSize}
                    color={leftIcon.color ?? iconColor}
                />
            ) : null}

            <TextInput
                ref={setRef}
                value={value}
                defaultValue={defaultValue}
                placeholder={placeholder}
                placeholderTextColor={placeholderTextColor}
                secureTextEntry={secureTextEntry}
                editable={editable && !disabled}
                autoFocus={autoFocus}
                keyboardType={keyboardType}
                returnKeyType={returnKeyType}
                autoCapitalize={autoCapitalize}
                maxLength={maxLength}
                onChangeText={onChangeText}
                onFocus={handleFocus}
                onBlur={handleBlur}
                style={[
                  styles.input,
                  Platform.OS === 'android' ? { textAlignVertical: 'center', lineHeight: 20, paddingTop: 2 } : undefined,
                  { color: textColor },
                  inputStyle
                ]}
            />

            {/* 右侧图标 */}
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
        </Pressable>
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