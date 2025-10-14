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
import { buildTestID, TestableProps } from '../../common/test';
import { buildBoxStyle, BoxProps } from '../../common/box';
import { buildShadowStyle, ShadowProps } from '../../common/shadow';
import type { PressEvents } from '../../common/events';
import { normalizeGradientConfig, type GradientProps } from '../../common/gradient';

// 文件顶部：ButtonProps 接口
export interface ButtonProps extends SpacingProps, BoxProps, ShadowProps, TestableProps, PressEvents, GradientProps {
    // 基础属性
    children?: React.ReactNode;
    title?: string;
    style?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;

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

    // 可访问性
    accessibilityLabel?: string;
    accessibilityHint?: string;
    accessibilityRole?: 'button' | 'link';
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
    // 渐变相关（来自 GradientProps）
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
    const { theme, styles } = useTheme();
    const colors = useThemeColors();
    const layout = useLayoutStyles();
    const spacing = useSpacingStyles();
    const spacingStyle = useSpacingStyle(props);

    // 规范化 testID
    const computedTestID = buildTestID('Button', testID);

    // 用外部样式作为 overrides；单独属性（背景/边框/圆角/尺寸）更高优先级
    const styleOverrides = StyleSheet.flatten(style) ?? undefined;

    // 获取主题颜色（未提供 color 时返回 undefined，使各变体保持主题默认）
    const getThemeColor = (): string | undefined => {
        if (!color) return undefined;
        if (typeof color === 'string' && (color.startsWith('#') || color.startsWith('rgb'))) return color;
        switch (color) {
            case 'primary': return colors.primary;
            case 'secondary': return colors.secondary;
            case 'success': return colors.success;
            case 'warning': return colors.warning;
            case 'error': return colors.error;
            case 'info': return colors.info;
            default: return String(color);
        }
    };

    // 计算默认背景色（传入 buildBoxStyle）
    const defaultBackground = (() => {
        const themeColor = getThemeColor();
        switch (variant) {
            case 'primary': return themeColor ?? colors.primary;
            case 'secondary': return theme.button.secondary.backgroundColor;
            case 'outline': return 'transparent';
            case 'text': return theme.button.text.backgroundColor;
            default: return themeColor ?? colors.primary;
        }
    })();

    // Box 基础样式：先应用 overrides，再由 BoxProps 单独属性覆盖
    const boxBase = buildBoxStyle({ defaultBackground }, props, styleOverrides);

    // 阴影样式：主题预设 + 覆盖（修复：使用 styles.shadow）
    const shadowStyle = buildShadowStyle(styles.shadow, props);

    // 归一化渐变配置（使用主题色作为回退颜色）
    const themeColor = getThemeColor();
    const baseColors = themeColor ? [themeColor, themeColor] : [colors.primary, colors.secondary];
    const gradientCfg = normalizeGradientConfig(baseColors, {
        gradientEnabled,
        gradientVariant,
        gradientColors,
        gradientLocations,
        gradientAngle,
        gradientStart,
        gradientEnd,
        gradientCenter,
        gradientRadius,
        gradientOpacity,
    });

    // 获取宽度样式
    const getWidthStyle = (): ViewStyle => {
        if (flex) return { flex: 1 };
        if (fullWidth) return { width: '100%' };
        return {};
    };

    // 获取高度样式
    const getHeightStyle = (): ViewStyle => {
        switch (size) {
            case 'small': return { maxHeight: theme.button.secondary.height - 8 };
            case 'medium': return { maxHeight: theme.button.primary.height };
            case 'large': return { maxHeight: theme.button.primary.height + 8 };
            default: return { maxHeight: theme.button.primary.height };
        }
    };

    // 获取基础样式（显式传入 height 时不再强制 minHeight）
    const getBaseStyle = (): ViewStyle => ({
        ...layout.row,
        ...layout.center,
        // 显式传入 height 时不强制最小高度
        ...(props.height != null ? {} : { minHeight: 40 }),
    });

    // 获取尺寸样式（显式传入 height：不再设置 minHeight，只保留横向 padding（非渐变时））
    const getSizeStyle = (): ViewStyle => {
        // 显式传入 height：不再设置 minHeight，只保留横向 padding（非渐变时）
        if (props.height != null) {
            switch (size) {
                case 'small': return { ...(gradientEnabled ? {} : spacing.pxSm) };
                case 'large': return { ...(gradientEnabled ? {} : spacing.pxLg) };
                default: return { ...(gradientEnabled ? {} : spacing.pxMd) };
            }
        }
        switch (size) {
            case 'small': return { minHeight: theme.button.secondary.height - 8, ...(gradientEnabled ? {} : spacing.pxSm) };
            case 'medium': return { minHeight: theme.button.primary.height, ...(gradientEnabled ? {} : spacing.pxMd) };
            case 'large': return { minHeight: theme.button.primary.height + 8, ...(gradientEnabled ? {} : spacing.pxLg) };
            default: return { minHeight: theme.button.primary.height, ...(gradientEnabled ? {} : spacing.pxMd) };
        }
    };


    // 获取形状样式（circle 时优先使用显式 height）
    const getShapeStyle = (): ViewStyle => {
        const sizeConfig = getSizeConfig();
        // 圆形形状优先使用显式 height
        if (shape === 'circle') {
            const h = (props.height as number) ?? sizeConfig.height;
            return { borderRadius: h / 2, width: h, paddingHorizontal: 0 };
        }
        switch (shape) {
            case 'rounded': return { borderRadius: props.borderRadius ?? theme.borderRadius.md };
            case 'square': return { borderRadius: props.borderRadius ?? 0 };
            default: return {};
        }
    };

    // 获取变体样式（不覆盖 BoxProps 中的同名字段）
    const getVariantStyle = (): ViewStyle => {
        const themeColor = getThemeColor();
        switch (variant) {
            case 'primary':
                return {
                    borderWidth: props.borderWidth ?? theme.button.primary.borderWidth,
                    borderColor: props.borderColor ?? (themeColor ?? colors.primary),
                    borderRadius: props.borderRadius ?? theme.button.primary.borderRadius,
                };
            case 'secondary':
                return {
                    borderWidth: props.borderWidth ?? 1,
                    borderColor: props.borderColor ?? theme.button.secondary.borderColor,
                    borderRadius: props.borderRadius ?? theme.button.secondary.borderRadius,
                };
            case 'outline':
                return {
                    borderWidth: props.borderWidth ?? 1,
                    borderColor: props.borderColor ?? (themeColor ?? theme.button.outline.borderColor),
                    borderRadius: props.borderRadius ?? theme.button.outline.borderRadius,
                };
            case 'text':
                return {
                    borderWidth: props.borderWidth ?? 0,
                    borderColor: props.borderColor ?? 'transparent',
                    borderRadius: props.borderRadius ?? theme.button.text.borderRadius,
                };
            default:
                return {
                    borderWidth: props.borderWidth ?? 0,
                    borderColor: props.borderColor ?? (themeColor ?? colors.primary),
                    borderRadius: props.borderRadius ?? theme.borderRadius.md,
                };
        }
    };

    // 获取尺寸配置
    const getSizeConfig = () => {
        switch (size) {
            case 'small':
                return { height: theme.button.secondary.height - 8, paddingHorizontal: theme.spacing.sm, fontSize: theme.button.secondary.fontSize - 2 };
            case 'medium':
                return { height: theme.button.primary.height, paddingHorizontal: theme.spacing.md, fontSize: theme.button.primary.fontSize };
            case 'large':
                return { height: theme.button.primary.height + 8, paddingHorizontal: theme.spacing.lg, fontSize: theme.button.primary.fontSize + 2 };
            default:
                return { height: theme.button.primary.height, paddingHorizontal: theme.spacing.md, fontSize: theme.button.primary.fontSize };
        }
    };

    // 获取文本颜色
    const getTextColor = (): string => {
        if (textColor) return textColor;
        switch (variant) {
            case 'primary': return theme.button.primary.textColor;
            case 'secondary': return theme.button.secondary.textColor;
            case 'outline': return theme.button.outline.textColor;
            case 'text': return theme.button.text.textColor;
            default: return theme.button.primary.textColor;
        }
    };

    // 获取高亮 UnderlayColor
    const getUnderlayColor = (): string => {
        if (underlayColor) return underlayColor;
        const themeColor = getThemeColor();
        if (themeColor) return `${themeColor}20`;
        switch (variant) {
            case 'primary': return `${theme.button.primary.backgroundColor}20`;
            case 'secondary': return `${theme.button.secondary.backgroundColor}20`;
            case 'outline': return `${theme.button.outline.borderColor}20`;
            case 'text': return `${theme.button.text.backgroundColor}20`;
            default: return `${colors.primary}20`;
        }
    };

    // 获取文本样式
    const getTextStyle = (): TextStyle => {
        const sizeConfig = getSizeConfig();
        return {
            color: getTextColor(),
            fontSize: sizeConfig.fontSize,
            fontWeight: bold ? theme.button.primary.fontWeight : theme.button.secondary.fontWeight,
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

    // 组合容器样式（先 boxBase，再 shadow，再局部策略；不再在最终样式数组末尾附加 style）
    const baseButtonStyle = {
        ...boxBase,
        ...shadowStyle,
        ...getBaseStyle(),
        ...getSizeStyle(),
        ...getVariantStyle(),
        ...getShapeStyle(),
        ...(disabled ? { opacity: 0.6 } : {}),
        ...getWidthStyle(),
        ...getHeightStyle(),
    } as ViewStyle;

    // 渐变增强：背景透明并承载绝对填充的渐变层（改为用于内部包裹层）
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
        // 修复：不再在外层添加 overflow:hidden，避免阴影被裁剪
        // gradientCfg.colors ? gradientEnhancer : null,
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
                testID={computedTestID}
                {...props}
            >
                {/* 修复：将裁剪移到内部包裹层，保留外层阴影 */}
                <View style={[gradientCfg.colors ? gradientEnhancer : null, { flex: 1 }]}>
                    {gradientCfg.colors && (
                        <GradientBackground
                            variant={gradientCfg.variant}
                            colors={gradientCfg.colors}
                            locations={gradientCfg.locations}
                            angle={gradientCfg.angle}
                            start={gradientCfg.start}
                            end={gradientCfg.end}
                            center={gradientCfg.center}
                            radius={gradientCfg.radius}
                            opacity={gradientCfg.opacity}
                            borderRadius={effectiveRadius}
                            style={{ position: 'absolute', top: 0, left: 0, width: containerSize?.width, height: containerSize?.height }}
                        />
                    )}
                    {renderContent()}
                </View>
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
                testID={computedTestID}
                {...props}
            >
                <View style={[gradientCfg.colors ? gradientEnhancer : null, { flex: 1 }]}>
                    {gradientCfg.colors && (
                        <GradientBackground
                            variant={gradientCfg.variant}
                            colors={gradientCfg.colors}
                            locations={gradientCfg.locations}
                            angle={gradientCfg.angle}
                            start={gradientCfg.start}
                            end={gradientCfg.end}
                            center={gradientCfg.center}
                            radius={gradientCfg.radius}
                            opacity={gradientCfg.opacity}
                            borderRadius={effectiveRadius}
                            style={{ position: 'absolute', top: 0, left: 0, width: containerSize?.width, height: containerSize?.height }}
                        />
                    )}
                    {renderContent()}
                </View>
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
            testID={computedTestID}
            {...props}
        >
            <View style={[gradientCfg.colors ? gradientEnhancer : null, { flex: 1 }]}>
                {gradientCfg.colors && (
                    <GradientBackground
                        variant={gradientCfg.variant}
                        colors={gradientCfg.colors}
                        locations={gradientCfg.locations}
                        angle={gradientCfg.angle}
                        start={gradientCfg.start}
                        end={gradientCfg.end}
                        center={gradientCfg.center}
                        radius={gradientCfg.radius}
                        opacity={gradientCfg.opacity}
                        borderRadius={effectiveRadius}
                        style={{ position: 'absolute', top: 0, left: 0, width: containerSize?.width, height: containerSize?.height }}
                    />
                )}
                {renderContent()}
            </View>
        </TouchableOpacity>
    );
};

export default Button;