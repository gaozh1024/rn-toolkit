import React from 'react';
import { Text as RNText, TextStyle, StyleProp } from 'react-native';
import { useTheme, useThemeColors } from '../../../theme';

export interface TextProps {
    // 基础属性
    children?: React.ReactNode;
    style?: StyleProp<TextStyle>;

    // 文本变体
    variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body1' | 'body2' | 'caption' | 'overline' | 'button' | 'link';

    // 字体大小
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;

    // 字体粗细
    weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold';

    // 文本颜色
    color?: 'primary' | 'secondary' | 'text' | 'textSecondary' | 'textDisabled' | 'error' | 'warning' | 'success' | 'info' | string;

    // 文本对齐
    align?: 'left' | 'center' | 'right' | 'justify';

    // 行高
    lineHeight?: 'tight' | 'normal' | 'relaxed' | number;

    // 文本装饰
    decoration?: 'none' | 'underline' | 'line-through';

    // 文本转换
    transform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';

    // 是否可选择
    selectable?: boolean;

    // 最大行数
    numberOfLines?: number;

    // 文本省略模式
    ellipsizeMode?: 'head' | 'middle' | 'tail' | 'clip';

    // 是否允许字体缩放
    allowFontScaling?: boolean;

    // 最小字体缩放比例
    minimumFontScale?: number;

    // 是否调整字体大小以适应
    adjustsFontSizeToFit?: boolean;

    // 事件处理
    onPress?: () => void;
    onLongPress?: () => void;

    // 测试ID
    testID?: string;
}

const Text: React.FC<TextProps> = ({
    children,
    style,
    variant = 'body1',
    size,
    weight,
    color = 'text',
    align = 'left',
    lineHeight,
    decoration = 'none',
    transform = 'none',
    selectable = false,
    numberOfLines,
    ellipsizeMode = 'tail',
    allowFontScaling = true,
    minimumFontScale,
    adjustsFontSizeToFit = false,
    onPress,
    onLongPress,
    testID,
    ...props
}) => {
    const { theme, isDark } = useTheme();
    console.log('isDark', isDark);
    const colors = useThemeColors();

    // 获取变体样式
    const getVariantStyle = (): TextStyle => {
        switch (variant) {
            case 'h1':
                return theme.text.h1;
            case 'h2':
                return theme.text.h2;
            case 'h3':
                return theme.text.h3;
            case 'h4':
                return theme.text.h4;
            case 'h5':
                return theme.text.h5;
            case 'h6':
                return theme.text.h6;
            case 'body1':
                return theme.text.body1;
            case 'body2':
                return theme.text.body2;
            case 'caption':
                return theme.text.caption;
            case 'overline':
                return theme.text.overline;
            case 'button':
                return theme.text.button;
            case 'link':
                return theme.text.link;
            default:
                return theme.text.body1;
        }
    };

    // 获取字体大小
    const getFontSize = (): number => {
        if (typeof size === 'number') {
            return size;
        }

        if (size) {
            // 从spacing主题中获取对应的数值作为字体大小
            const sizeMap = {
                xs: 12,
                sm: 14,
                md: 16,
                lg: 18,
                xl: 24,
            };
            return sizeMap[size] || 16;
        }

        // 如果没有指定size，使用variant的默认大小
        return getVariantStyle().fontSize || 16;
    };

    // 获取字体粗细
    const getFontWeight = (): TextStyle['fontWeight'] => {
        if (weight) {
            const weightMap: Record<string, TextStyle['fontWeight']> = {
                light: '300',
                normal: '400',
                medium: '500',
                semibold: '600',
                bold: '700',
            };
            return weightMap[weight] || '400';
        }

        // 如果没有指定weight，使用variant的默认粗细
        return getVariantStyle().fontWeight || '400';
    };

    // 获取文本颜色
    const getTextColor = (): string => {
        if (color.startsWith('#') || color.startsWith('rgb')) {
            return color;
        }

        switch (color) {
            case 'primary':
                return colors.primary;
            case 'secondary':
                return colors.secondary;
            case 'text':
                return colors.text;
            case 'textSecondary':
                return colors.textSecondary;
            case 'textDisabled':
                return colors.textDisabled;
            case 'error':
                return colors.error;
            case 'warning':
                return colors.warning;
            case 'success':
                return colors.success;
            case 'info':
                return colors.info;
            default:
                return colors.text;
        }
    };

    // 获取行高
    const getLineHeight = (): number | undefined => {
        if (typeof lineHeight === 'number') {
            return lineHeight;
        }

        if (lineHeight) {
            const lineHeightMap = {
                tight: 1.2,
                normal: 1.5,
                relaxed: 1.8,
            };
            return getFontSize() * (lineHeightMap[lineHeight] || 1.5);
        }

        // 使用variant的默认行高
        return getVariantStyle().lineHeight;
    };

    // 组合样式
    const combinedStyle: TextStyle = {
        fontFamily: 'System',
        ...getVariantStyle(),
        fontSize: getFontSize(),
        fontWeight: getFontWeight(),
        color: getTextColor(),
        textAlign: align,
        lineHeight: getLineHeight(),
        textDecorationLine: decoration,
        textTransform: transform,
        ...(Array.isArray(style) ? Object.assign({}, ...style) : style),
    };

    console.log('combinedStyle', children, combinedStyle,);
    return (
        <RNText
            style={combinedStyle}
            selectable={selectable}
            numberOfLines={numberOfLines}
            ellipsizeMode={ellipsizeMode}
            allowFontScaling={allowFontScaling}
            minimumFontScale={minimumFontScale}
            adjustsFontSizeToFit={adjustsFontSizeToFit}
            onPress={onPress}
            onLongPress={onLongPress}
            testID={testID}
            {...props}
        >
            {children}
        </RNText>
    );
};

export default Text;