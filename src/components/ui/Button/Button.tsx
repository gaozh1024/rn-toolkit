// 顶部 import 区
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
    GestureResponderEvent,
    StyleProp,
    StyleSheet,
    LayoutChangeEvent
} from 'react-native';
import { useTheme, useThemeColors, useLayoutStyles, useSpacingStyles, useSpacingStyle, SpacingProps } from '../../../theme';
import { GradientBackground } from '../../layout/GradientBackground/GradientBackground';

// 文件顶部：ButtonProps 接口
export interface ButtonProps extends SpacingProps {
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

    // 宽度控制
    fullWidth?: boolean;
    flex?: boolean;

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
    // 渐变（可选）
    gradientEnabled?: boolean;
    gradientVariant?: 'linear' | 'radial';
    gradientColors?: string[];
    gradientLocations?: number[];
    gradientAngle?: number;
    gradientStart?: { x: number; y: number };
    gradientEnd?: { x: number; y: number };
    gradientCenter?: { x: number; y: number };
    gradientRadius?: number;
    gradientOpacity?: number;
}

// Button 组件（const Button: React.FC<ButtonProps> = ({ ... }) => { ... }）
const Button: React.FC<ButtonProps> = ({
    children,
    title,
    style,
    textStyle,
    variant = 'primary',
    size = 'medium',
    color,
    textColor,
    shape = 'rounded',
    disabled = false,
    loading = false,
    bold = false,
    icon,
    iconPosition = 'left',
    fullWidth = false,
    flex = false,
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
    gradientEnabled = false,
    gradientVariant = 'linear',
    gradientColors,
    gradientLocations,
    gradientAngle,
    gradientStart,
    gradientEnd,
    gradientCenter = { x: 0.5, y: 0.5 },
    gradientRadius = 0.5,
    gradientOpacity = 1,
    ...props
}) => {
    const { theme } = useTheme();
    const colors = useThemeColors();
    const layout = useLayoutStyles();
    const spacing = useSpacingStyles();
    const spacingStyle = useSpacingStyle(props);

    // 获取按钮样式
    const getButtonStyle = (): ViewStyle => {
        const baseStyle = getBaseStyle();
        const sizeStyle = getSizeStyle();
        const variantStyle = getVariantStyle();
        const shapeStyle = getShapeStyle();
        const disabledStyle = disabled ? { opacity: 0.6 } : {};
        const widthStyle = getWidthStyle();
        const heightStyle = getHeightStyle();

        return {
            ...baseStyle,
            ...sizeStyle,
            ...variantStyle,
            ...shapeStyle,
            ...disabledStyle,
            ...widthStyle,
            ...heightStyle,
        };
    };

    // 获取基础样式
    const getBaseStyle = (): ViewStyle => ({
        ...layout.row,
        ...layout.center,
        minHeight: 40,
    });

    // 获取宽度样式
    const getWidthStyle = (): ViewStyle => {
        if (flex) {
            return { flex: 1 };
        }
        if (fullWidth) {
            return { width: '100%' };
        }
        return {};
    };

    // 获取高度样式
    const getHeightStyle = (): ViewStyle => {
        switch (size) {
            case 'small':
                return { maxHeight: theme.button.secondary.height - 8 };
            case 'medium':
                return { maxHeight: theme.button.primary.height };
            case 'large':
                return { maxHeight: theme.button.primary.height + 8 };
            default:
                return { maxHeight: theme.button.primary.height };
        }
    };

    // 获取尺寸样式
    const getSizeStyle = (): ViewStyle => {
        switch (size) {
            case 'small':
                return {
                    minHeight: theme.button.secondary.height - 8,
                    // 渐变启用时，容器不设置横向 padding
                    ...(gradientEnabled ? {} : spacing.pxSm),
                };
            case 'medium':
                return {
                    minHeight: theme.button.primary.height,
                    ...(gradientEnabled ? {} : spacing.pxMd),
                };
            case 'large':
                return {
                    minHeight: theme.button.primary.height + 8,
                    ...(gradientEnabled ? {} : spacing.pxLg),
                };
            default:
                return {
                    minHeight: theme.button.primary.height,
                    ...(gradientEnabled ? {} : spacing.pxMd),
                };
        }
    };

    // 获取变体样式
    const getVariantStyle = (): ViewStyle => {
        const themeColor = getThemeColor();

        switch (variant) {
            case 'primary':
                return {
                    backgroundColor: themeColor || theme.button.primary.backgroundColor,
                    borderWidth: theme.button.primary.borderWidth,
                    borderColor: theme.button.primary.borderColor,
                    borderRadius: theme.button.primary.borderRadius,
                };
            case 'secondary':
                return {
                    backgroundColor: themeColor || theme.button.secondary.backgroundColor,
                    borderWidth: 1,
                    borderColor: theme.button.secondary.borderColor,
                    borderRadius: theme.button.secondary.borderRadius,
                };
            case 'outline':
                return {
                    backgroundColor: theme.button.outline.backgroundColor,
                    borderWidth: 1,
                    borderColor: themeColor || theme.button.outline.borderColor,
                    borderRadius: theme.button.outline.borderRadius,
                };
            case 'text':
                return {
                    backgroundColor: themeColor || theme.button.text.backgroundColor,
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

    // 获取主题颜色（未提供 color 时返回 undefined，使各变体保持主题默认）
    const getThemeColor = (): string | undefined => {
        if (!color) {
            return undefined;
        }
        if (typeof color === 'string' && (color.startsWith('#') || color.startsWith('rgb'))) {
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
                // 允许传入平台支持的命名颜色或自定义字符串
                return String(color);
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
                // 对自定义 variant，保持与 primary 相同的对比策略
                return theme.button.primary.textColor;
        }
    };

    // 获取高亮模式下的 UnderlayColor，保证在未提供 color/underlayColor 时也有合理回退
    const getUnderlayColor = (): string => {
        if (underlayColor) {
            return underlayColor;
        }

        const themeColor = getThemeColor();
        if (themeColor) {
            return `${themeColor}20`;
        }

        switch (variant) {
            case 'primary':
                return `${theme.button.primary.backgroundColor}20`;
            case 'secondary':
                return `${theme.button.secondary.backgroundColor}20`;
            case 'outline':
                return `${theme.button.outline.borderColor}20`;
            case 'text':
                return `${theme.button.text.backgroundColor}20`;
            default:
                return `${colors.primary}20`;
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

    // 渲染按钮内容：在启用渐变时，将横向 padding 移到内部内容容器
    const renderContent = () => {
        const content = children || title;
        const textColor = getTextColor();
        const sizeConfig = getSizeConfig();
        const innerPadding = gradientEnabled ? { paddingHorizontal: sizeConfig.paddingHorizontal } : {};
    
        if (loading) {
            return (
                <View style={[layout.row, layout.center, innerPadding]}>
                    <ActivityIndicator size="small" color={textColor} style={spacing.mrXs} />
                    {content && (
                        <Text style={[getTextStyle(), textStyle, { opacity: 0.7 }]}>
                            {content}
                        </Text>
                    )}
                </View>
            );
        }
    
        return (
            <View style={[layout.row, layout.center, innerPadding]}>
                {icon && iconPosition === 'left' && <View style={spacing.mrXs}>{icon}</View>}
                {content && <Text style={[getTextStyle(), textStyle]}>{content}</Text>}
                {icon && iconPosition === 'right' && <View style={spacing.mlXs}>{icon}</View>}
            </View>
        );
    };

    // 组合最终样式（启用渐变时背景透明，容器设为相对定位以承载绝对填充的渐变层）
    const baseButtonStyle = getButtonStyle();
    const gradientEnhancer: ViewStyle = { backgroundColor: 'transparent', position: 'relative', overflow: 'hidden' };

    // 测量容器尺寸并传递给渐变层
    const [containerSize, setContainerSize] = React.useState<{ width: number; height: number } | null>(null);
    const handleLayout = (e: LayoutChangeEvent) => {
        const { width, height } = e.nativeEvent.layout;
        setContainerSize({ width, height });
    };

    const finalStyle: StyleProp<ViewStyle> = [
        baseButtonStyle,
        spacingStyle,
        gradientEnabled ? gradientEnhancer : null,
        style,
    ];

    // 从最终样式中计算有效圆角，优先 borderRadius，其次四角，最后回退主题值
    const flatFinal = StyleSheet.flatten(finalStyle) as ViewStyle | undefined;
    const effectiveRadius =
        typeof flatFinal?.borderRadius === 'number'
            ? (flatFinal.borderRadius as number)
            : (() => {
                const corners = [
                    flatFinal?.borderTopLeftRadius,
                    flatFinal?.borderTopRightRadius,
                    flatFinal?.borderBottomLeftRadius,
                    flatFinal?.borderBottomRightRadius,
                ].filter((v) => typeof v === 'number') as number[];
                return corners.length ? Math.max(...corners) : theme.borderRadius.md;
            })();

    const isDisabled = disabled || loading;

    // 根据传入 color 的主题/自定义色，联动默认渐变调色
    const themeColor = getThemeColor();
    const gradientPalette =
        gradientColors && gradientColors.length > 0
            ? gradientColors
            : themeColor
                ? [themeColor, themeColor]
                : [colors.primary, colors.secondary];

    // 根据触摸类型渲染不同的组件
    // 在三种触摸容器上挂载 onLayout，并把精确尺寸传入渐变层（使用 width/height）
    if (touchType === 'highlight') {
    return (
      <TouchableHighlight
        style={finalStyle as StyleProp<ViewStyle>}
        onLayout={handleLayout}
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        onLongPress={onLongPress}
        disabled={isDisabled}
        underlayColor={getUnderlayColor()}
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
        accessibilityRole={accessibilityRole}
        testID={testID}
        {...props}
      >
        <>
          {gradientEnabled && (
            <GradientBackground
              variant={gradientVariant}
              colors={gradientPalette}
              locations={gradientLocations}
              angle={gradientAngle}
              start={gradientStart}
              end={gradientEnd}
              center={gradientCenter}
              radius={gradientRadius}
              opacity={gradientOpacity}
              borderRadius={effectiveRadius}
              style={{ position: 'absolute', top: 0, left: 0, width: containerSize?.width, height: containerSize?.height }}
            />
          )}
          {renderContent()}
        </>
      </TouchableHighlight>
    );
    }
    
    if (touchType === 'pressable') {
    return (
      <Pressable
        style={({ pressed }) => ([
          finalStyle,
          pressed && !isDisabled ? { opacity: 0.8 } : null,
        ] as StyleProp<ViewStyle>)}
        onLayout={handleLayout}
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
        {gradientEnabled && (
          <GradientBackground
            variant={gradientVariant}
            colors={gradientPalette}
            locations={gradientLocations}
            angle={gradientAngle}
            start={gradientStart}
            end={gradientEnd}
            center={gradientCenter}
            radius={gradientRadius}
            opacity={gradientOpacity}
            borderRadius={effectiveRadius}
            style={{ position: 'absolute', top: 0, left: 0, width: containerSize?.width, height: containerSize?.height }}
          />
        )}
        {renderContent()}
      </Pressable>
    );
    }
    
    return (
      <TouchableOpacity
        style={finalStyle as StyleProp<ViewStyle>}
        onLayout={handleLayout}
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
        {gradientEnabled && (
          <GradientBackground
            variant={gradientVariant}
            colors={gradientPalette}
            locations={gradientLocations}
            angle={gradientAngle}
            start={gradientStart}
            end={gradientEnd}
            center={gradientCenter}
            radius={gradientRadius}
            opacity={gradientOpacity}
            borderRadius={effectiveRadius}
            style={{ position: 'absolute', top: 0, left: 0, width: containerSize?.width, height: containerSize?.height }}
          />
        )}
        {renderContent()}
      </TouchableOpacity>
    );
};

export default Button;