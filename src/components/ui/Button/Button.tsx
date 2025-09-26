import React from 'react';
import {
    TouchableOpacity,
    TouchableHighlight,
    Pressable,
    Text,
    View,
    ViewStyle,
    TextStyle,
    StyleSheet,
    ActivityIndicator,
    GestureResponderEvent
} from 'react-native';
import { useTheme } from '../../../theme';

export interface ButtonProps {
    // 基础属性
    children?: React.ReactNode;
    title?: string;
    style?: ViewStyle | ViewStyle[];
    textStyle?: TextStyle | TextStyle[];

    // 按钮变体
    variant?: 'filled' | 'outlined' | 'text' | 'elevated';

    // 按钮大小
    size?: 'small' | 'medium' | 'large';

    // 按钮颜色
    color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | string;
    textColor?: string; // 新增：直接设置文本颜色

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
    variant = 'filled',
    size = 'medium',
    color = 'primary',
    textColor, // 新增参数
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
    const { theme, colors } = useTheme();
    const styles = createStyles(theme);

    // 获取按钮样式
    const getButtonStyle = (): ViewStyle => {
        const baseStyle = styles.base;
        const sizeStyle = styles[size];
        const variantStyle = getVariantStyle();
        const shapeStyle = getShapeStyle();
        const disabledStyle = disabled ? styles.disabled : {};
        const fullWidthStyle = fullWidth ? styles.fullWidth : {};

        return {
            ...baseStyle,
            ...sizeStyle,
            ...variantStyle,
            ...shapeStyle,
            ...disabledStyle,
            ...fullWidthStyle,
        };
    };

    // 获取变体样式
    const getVariantStyle = (): ViewStyle => {
        const themeColor = getThemeColor();

        switch (variant) {
            case 'filled':
                return {
                    backgroundColor: themeColor,
                    borderWidth: 0,
                };
            case 'outlined':
                return {
                    backgroundColor: 'transparent',
                    borderWidth: 1,
                    borderColor: themeColor,
                };
            case 'text':
                return {
                    backgroundColor: 'transparent',
                    borderWidth: 0,
                };
            case 'elevated':
                return {
                    backgroundColor: themeColor,
                    borderWidth: 0,
                    elevation: 4,
                    shadowColor: colors.shadow,
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.25,
                    shadowRadius: 4,
                };
            default:
                return {};
        }
    };

    // 获取形状样式
    const getShapeStyle = (): ViewStyle => {
        const sizeConfig = getSizeConfig();

        switch (shape) {
            case 'rounded':
                return {
                    borderRadius: theme.borderRadius?.md || 8,
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

        return colors[color as keyof typeof colors] || colors.primary;
    };

    // 获取文本颜色
    const getTextColor = (): string => {
        // 如果直接指定了文本颜色，优先使用
        if (textColor) {
            return textColor;
        }

        const themeColor = getThemeColor();

        switch (variant) {
            case 'filled':
            case 'elevated':
                if (color === 'primary') return colors.buttonTextPrimary || colors.onPrimary;
                if (color === 'secondary') return colors.buttonTextSecondary || colors.onSecondary;
                if (color === 'error') return colors.onError;
                return colors.buttonTextPrimary || colors.onPrimary;
            case 'outlined':
                return colors.buttonTextOutlined || themeColor;
            case 'text':
                return colors.buttonTextText || themeColor;
            default:
                return colors.onSurface;
        }
    };

    // 获取尺寸配置
    const getSizeConfig = () => {
        switch (size) {
            case 'small':
                return {
                    height: 32,
                    paddingHorizontal: theme.spacing?.sm || 12,
                    fontSize: theme.typography?.fontSize.sm || 14,
                };
            case 'medium':
                return {
                    height: 40,
                    paddingHorizontal: theme.spacing?.md || 16,
                    fontSize: theme.typography?.fontSize.md || 16,
                };
            case 'large':
                return {
                    height: 48,
                    paddingHorizontal: theme.spacing?.lg || 20,
                    fontSize: theme.typography?.fontSize.lg || 18,
                };
            default:
                return {
                    height: 40,
                    paddingHorizontal: theme.spacing?.md || 16,
                    fontSize: theme.typography?.fontSize.md || 16,
                };
        }
    };

    // 获取文本样式
    // 在 getTextStyle 函数中
    const getTextStyle = (): TextStyle => {
        const sizeConfig = getSizeConfig();
        return {
            color: getTextColor(),
            fontSize: sizeConfig.fontSize,
            fontWeight: bold
                ? 'bold'
                : (theme.typography?.fontWeight?.medium || '500') as TextStyle['fontWeight'],
            textAlign: 'center',
        };
    };

    // 渲染按钮内容
    const renderContent = () => {
        const content = children || title;
        const textColor = getTextColor();

        if (loading) {
            return (
                <View style={styles.contentContainer}>
                    <ActivityIndicator
                        size="small"
                        color={textColor}
                        style={styles.loadingIndicator}
                    />
                    {content && (
                        <Text style={[getTextStyle(), textStyle, styles.loadingText]}>
                            {content}
                        </Text>
                    )}
                </View>
            );
        }

        return (
            <View style={styles.contentContainer}>
                {icon && iconPosition === 'left' && (
                    <View style={styles.iconLeft}>
                        {icon}
                    </View>
                )}
                {content && (
                    <Text style={[getTextStyle(), textStyle]}>
                        {content}
                    </Text>
                )}
                {icon && iconPosition === 'right' && (
                    <View style={styles.iconRight}>
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
                    pressed && !isDisabled && styles.pressed
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

const createStyles = (theme: any) => StyleSheet.create({
    base: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 40,
        paddingHorizontal: theme.spacing?.md || 16,
        borderRadius: theme.borderRadius?.md || 8,
    },
    small: {
        minHeight: 32,
        paddingHorizontal: theme.spacing?.sm || 12,
    },
    medium: {
        minHeight: 40,
        paddingHorizontal: theme.spacing?.md || 16,
    },
    large: {
        minHeight: 48,
        paddingHorizontal: theme.spacing?.lg || 20,
    },
    disabled: {
        opacity: 0.6,
    },
    fullWidth: {
        width: '100%',
    },
    pressed: {
        opacity: 0.8,
    },
    contentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconLeft: {
        marginRight: theme.spacing?.xs || 8,
    },
    iconRight: {
        marginLeft: theme.spacing?.xs || 8,
    },
    loadingIndicator: {
        marginRight: theme.spacing?.xs || 8,
    },
    loadingText: {
        opacity: 0.7,
    },
});

export default Button;