import React from 'react';
import {
    TouchableOpacity,
    TouchableHighlight,
    Pressable,
    Text,
    View,
    ViewStyle,
    TextStyle,
    ActivityIndicator,
    GestureResponderEvent
} from 'react-native';
import { useTheme, useThemeColors, useLayoutStyles, useSpacingStyles } from '../../../theme';

export interface ButtonProps {
    // 基础属性
    children?: React.ReactNode;
    title?: string;
    style?: ViewStyle | ViewStyle[];
    textStyle?: TextStyle | TextStyle[];

    // 按钮变体
    variant?: 'primary' | 'secondary' | 'outline' | 'text';

    // 按钮大小
    size?: 'small' | 'medium' | 'large';

    // 按钮颜色
    color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | string;
    textColor?: string;

    // 按钮形状
    shape?: 'rounded' | 'square' | 'circle';

    // 按钮状态
    disabled?: boolean;
    loading?: boolean;

    // 字体加粗
    bold?: boolean;

    // 图标
    icon?: React.ReactNode;
    iconPosition?: 'left' | 'right';

    // 全宽按钮
    fullWidth?: boolean;

    // 触摸反馈类型
    touchType?: 'opacity' | 'highlight' | 'pressable';

    // 高亮颜色（仅在touchType为highlight时有效）
    underlayColor?: string;

    // 事件处理
    onPress?: (event: GestureResponderEvent) => void;
    onPressIn?: (event: GestureResponderEvent) => void;
    onPressOut?: (event: GestureResponderEvent) => void;
    onLongPress?: (event: GestureResponderEvent) => void;

    // 可访问性
    accessibilityLabel?: string;
    accessibilityHint?: string;
    accessibilityRole?: 'button' | 'link';

    // 测试ID
    testID?: string;
}

const Button: React.FC<ButtonProps> = ({
    children,
    title,
    style,
    textStyle,
    variant = 'primary',
    size = 'medium',
    color = 'primary',
    textColor,
    shape = 'rounded',
    disabled = false,
    loading = false,
    bold = false,
    icon,
    iconPosition = 'left',
    fullWidth = true,
    touchType = 'opacity',
    underlayColor,
    onPress,
    onPressIn,
    onPressOut,
    onLongPress,
    accessibilityLabel,
    accessibilityHint,
    accessibilityRole = 'button',
    testID,
    ...props
}) => {
    const { theme } = useTheme();
    const colors = useThemeColors();
    const layout = useLayoutStyles();
    const spacing = useSpacingStyles();

    // 获取按钮样式
    const getButtonStyle = (): ViewStyle => {
        const baseStyle = getBaseStyle();
        const sizeStyle = getSizeStyle();
        const variantStyle = getVariantStyle();
        const shapeStyle = getShapeStyle();
        const disabledStyle = disabled ? { opacity: 0.6 } : {};
        const fullWidthStyle: any = fullWidth ? { width: '100%' } : {};

        return {
            ...baseStyle,
            ...sizeStyle,
            ...variantStyle,
            ...shapeStyle,
            ...disabledStyle,
            ...fullWidthStyle,
        };
    };

    // 获取基础样式
    const getBaseStyle = (): ViewStyle => ({
        ...layout.row,
        ...layout.center,
        minHeight: 40,
    });

    // 获取尺寸样式
    const getSizeStyle = (): ViewStyle => {
        switch (size) {
            case 'small':
                return {
                    minHeight: theme.button.secondary.height - 8,
                    ...spacing.pxSm,
                };
            case 'medium':
                return {
                    minHeight: theme.button.primary.height,
                    ...spacing.pxMd,
                };
            case 'large':
                return {
                    minHeight: theme.button.primary.height + 8,
                    ...spacing.pxLg,
                };
            default:
                return {
                    minHeight: theme.button.primary.height,
                    ...spacing.pxMd,
                };
        }
    };

    // 获取变体样式
    const getVariantStyle = (): ViewStyle => {
        const themeColor = getThemeColor();

        switch (variant) {
            case 'primary':
                return {
                    backgroundColor: theme.button.primary.backgroundColor,
                    borderWidth: theme.button.primary.borderWidth,
                    borderColor: theme.button.primary.borderColor,
                    borderRadius: theme.button.primary.borderRadius,
                };
            case 'secondary':
                return {
                    backgroundColor: theme.button.secondary.backgroundColor,
                    borderWidth: 1,
                    borderColor: theme.button.secondary.borderColor,
                    borderRadius: theme.button.secondary.borderRadius,
                };
            case 'outline':
                return {
                    backgroundColor: theme.button.outline.backgroundColor,
                    borderWidth: 1,
                    borderColor: theme.button.outline.borderColor,
                    borderRadius: theme.button.outline.borderRadius,
                };
            case 'text':
                return {
                    backgroundColor: theme.button.text.backgroundColor,
                    borderWidth: 0,
                    borderRadius: theme.button.text.borderRadius,
                };
            default:
                return {
                    backgroundColor: themeColor,
                    borderWidth: 0,
                    borderRadius: theme.borderRadius.md,
                };
        }
    };

    // 获取形状样式
    const getShapeStyle = (): ViewStyle => {
        const sizeConfig = getSizeConfig();

        switch (shape) {
            case 'rounded':
                return {
                    borderRadius: theme.borderRadius.md,
                };
            case 'square':
                return {
                    borderRadius: 0,
                };
            case 'circle':
                return {
                    borderRadius: sizeConfig.height / 2,
                    width: sizeConfig.height,
                    paddingHorizontal: 0,
                };
            default:
                return {};
        }
    };

    // 获取主题颜色
    const getThemeColor = (): string => {
        if (color.startsWith('#') || color.startsWith('rgb')) {
            return color;
        }

        switch (color) {
            case 'primary':
                return colors.primary;
            case 'secondary':
                return colors.secondary;
            case 'success':
                return colors.success;
            case 'warning':
                return colors.warning;
            case 'error':
                return colors.error;
            case 'info':
                return colors.info;
            default:
                return colors.primary;
        }
    };

    // 获取文本颜色
    const getTextColor = (): string => {
        if (textColor) {
            return textColor;
        }

        switch (variant) {
            case 'primary':
                return theme.button.primary.textColor;
            case 'secondary':
                return theme.button.secondary.textColor;
            case 'outline':
                return theme.button.outline.textColor;
            case 'text':
                return theme.button.text.textColor;
            default:
                return theme.button.primary.textColor;
        }
    };

    // 获取尺寸配置
    const getSizeConfig = () => {
        switch (size) {
            case 'small':
                return {
                    height: theme.button.secondary.height - 8,
                    paddingHorizontal: theme.spacing.sm,
                    fontSize: theme.button.secondary.fontSize - 2,
                };
            case 'medium':
                return {
                    height: theme.button.primary.height,
                    paddingHorizontal: theme.spacing.md,
                    fontSize: theme.button.primary.fontSize,
                };
            case 'large':
                return {
                    height: theme.button.primary.height + 8,
                    paddingHorizontal: theme.spacing.lg,
                    fontSize: theme.button.primary.fontSize + 2,
                };
            default:
                return {
                    height: theme.button.primary.height,
                    paddingHorizontal: theme.spacing.md,
                    fontSize: theme.button.primary.fontSize,
                };
        }
    };

    // 获取文本样式
    const getTextStyle = (): TextStyle => {
        const sizeConfig = getSizeConfig();
        return {
            color: getTextColor(),
            fontSize: sizeConfig.fontSize,
            fontWeight: bold
                ? theme.button.primary.fontWeight
                : theme.button.secondary.fontWeight,
            textAlign: 'center',
        };
    };

    // 渲染按钮内容
    const renderContent = () => {
        const content = children || title;
        const textColor = getTextColor();

        if (loading) {
            return (
                <View style={[layout.row, layout.center]}>
                    <ActivityIndicator
                        size="small"
                        color={textColor}
                        style={spacing.mrXs}
                    />
                    {content && (
                        <Text style={[getTextStyle(), textStyle, { opacity: 0.7 }]}>
                            {content}
                        </Text>
                    )}
                </View>
            );
        }

        return (
            <View style={[layout.row, layout.center]}>
                {icon && iconPosition === 'left' && (
                    <View style={spacing.mrXs}>
                        {icon}
                    </View>
                )}
                {content && (
                    <Text style={[getTextStyle(), textStyle]}>
                        {content}
                    </Text>
                )}
                {icon && iconPosition === 'right' && (
                    <View style={spacing.mlXs}>
                        {icon}
                    </View>
                )}
            </View>
        );
    };

    // 组合最终样式
    const finalStyle = [getButtonStyle(), style];
    const isDisabled = disabled || loading;

    // 根据触摸类型渲染不同的组件
    if (touchType === 'highlight') {
        return (
            <TouchableHighlight
                style={finalStyle}
                onPress={onPress}
                onPressIn={onPressIn}
                onPressOut={onPressOut}
                onLongPress={onLongPress}
                disabled={isDisabled}
                underlayColor={underlayColor || `${getThemeColor()}20`}
                accessibilityLabel={accessibilityLabel}
                accessibilityHint={accessibilityHint}
                accessibilityRole={accessibilityRole}
                testID={testID}
                {...props}
            >
                {renderContent()}
            </TouchableHighlight>
        );
    }

    if (touchType === 'pressable') {
        return (
            <Pressable
                style={({ pressed }) => [
                    finalStyle,
                    pressed && !isDisabled && { opacity: 0.8 }
                ]}
                onPress={onPress}
                onPressIn={onPressIn}
                onPressOut={onPressOut}
                onLongPress={onLongPress}
                disabled={isDisabled}
                accessibilityLabel={accessibilityLabel}
                accessibilityHint={accessibilityHint}
                accessibilityRole={accessibilityRole}
                testID={testID}
                {...props}
            >
                {renderContent()}
            </Pressable>
        );
    }

    // 默认使用 TouchableOpacity
    return (
        <TouchableOpacity
            style={finalStyle}
            onPress={onPress}
            onPressIn={onPressIn}
            onPressOut={onPressOut}
            onLongPress={onLongPress}
            disabled={isDisabled}
            activeOpacity={0.7}
            accessibilityLabel={accessibilityLabel}
            accessibilityHint={accessibilityHint}
            accessibilityRole={accessibilityRole}
            testID={testID}
            {...props}
        >
            {renderContent()}
        </TouchableOpacity>
    );
};

export default Button;