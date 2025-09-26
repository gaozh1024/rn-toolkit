import React from 'react';
import { Text as RNText, TextStyle, StyleSheet, StyleProp } from 'react-native';
import { useTheme } from '../../../theme';

export interface TextProps {
    // 基础属性
    children?: React.ReactNode;
    style?: StyleProp<TextStyle>;  // 修改为 StyleProp<TextStyle>

    // 文本变体
    variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body1' | 'body2' | 'caption' | 'overline';

    // 字体大小
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;

    // 字体粗细
    weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold';

    // 文本颜色
    color?: 'primary' | 'secondary' | 'onBackground' | 'onSurface' | 'error' | 'warning' | 'success' | 'info' | 'disabled' | 'placeholder' | string;

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
    color = 'onBackground',
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
    const { theme, colors } = useTheme();
    const styles = createStyles(theme);

    // 获取变体样式
    const getVariantStyle = (): TextStyle => {
        switch (variant) {
            case 'h1':
                return styles.h1;
            case 'h2':
                return styles.h2;
            case 'h3':
                return styles.h3;
            case 'h4':
                return styles.h4;
            case 'h5':
                return styles.h5;
            case 'h6':
                return styles.h6;
            case 'body1':
                return styles.body1;
            case 'body2':
                return styles.body2;
            case 'caption':
                return styles.caption;
            case 'overline':
                return styles.overline;
            default:
                return styles.body1;
        }
    };

    // 获取字体大小
    const getFontSize = (): number => {
        if (typeof size === 'number') {
            return size;
        }

        if (size) {
            return theme.typography?.fontSize[size] || theme.typography?.fontSize.md || 16;
        }

        // 如果没有指定size，使用variant的默认大小
        return getVariantStyle().fontSize || theme.typography?.fontSize.md || 16;
    };

    // 获取字体粗细
    const getFontWeight = (): string => {
        if (weight) {
            return theme.typography?.fontWeight[weight] || theme.typography?.fontWeight.normal || '400';
        }

        // 如果没有指定weight，使用variant的默认粗细
        return getVariantStyle().fontWeight?.toString() || theme.typography?.fontWeight.normal || '400';
    };

    // 获取文本颜色
    const getTextColor = (): string => {
        if (color.startsWith('#') || color.startsWith('rgb')) {
            return color;
        }

        return colors[color as keyof typeof colors] || colors.onBackground;
    };

    // 获取行高
    const getLineHeight = (): number | undefined => {
        if (typeof lineHeight === 'number') {
            return lineHeight;
        }

        if (lineHeight && theme.typography?.lineHeight) {
            return getFontSize() * theme.typography.lineHeight[lineHeight as keyof typeof theme.typography.lineHeight];
        }

        return undefined;
    };

    // 组合样式
    // 组合样式
    const combinedStyle: TextStyle = {
        ...styles.base,
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

const createStyles = (theme: any) => StyleSheet.create({
    base: {
        fontFamily: 'System',
    },
    h1: {
        fontSize: theme.typography?.fontSize.xl || 24,
        fontWeight: theme.typography?.fontWeight.bold || '700',
        lineHeight: (theme.typography?.fontSize.xl || 24) * (theme.typography?.lineHeight.tight || 1.2),
    },
    h2: {
        fontSize: theme.typography?.fontSize.lg || 18,
        fontWeight: theme.typography?.fontWeight.bold || '700',
        lineHeight: (theme.typography?.fontSize.lg || 18) * (theme.typography?.lineHeight.tight || 1.2),
    },
    h3: {
        fontSize: theme.typography?.fontSize.md || 16,
        fontWeight: theme.typography?.fontWeight.semibold || '600',
        lineHeight: (theme.typography?.fontSize.md || 16) * (theme.typography?.lineHeight.normal || 1.5),
    },
    // 在 createStyles 函数中，所有使用 fontWeight.medium 的地方都需要添加安全访问
    h4: {
        fontSize: theme.typography?.fontSize.md || 16,
        fontWeight: theme.typography?.fontWeight?.medium || '500',
        lineHeight: (theme.typography?.fontSize.md || 16) * (theme.typography?.lineHeight.normal || 1.5),
    },
    h5: {
        fontSize: theme.typography?.fontSize.sm || 14,
        fontWeight: theme.typography?.fontWeight?.medium || '500',
        lineHeight: (theme.typography?.fontSize.sm || 14) * (theme.typography?.lineHeight.normal || 1.5),
    },
    h6: {
        fontSize: theme.typography?.fontSize.sm || 14,
        fontWeight: theme.typography?.fontWeight.normal || '400',
        lineHeight: (theme.typography?.fontSize.sm || 14) * (theme.typography?.lineHeight.normal || 1.5),
    },
    body1: {
        fontSize: theme.typography?.fontSize.md || 16,
        fontWeight: theme.typography?.fontWeight.normal || '400',
        lineHeight: (theme.typography?.fontSize.md || 16) * (theme.typography?.lineHeight.normal || 1.5),
    },
    body2: {
        fontSize: theme.typography?.fontSize.sm || 14,
        fontWeight: theme.typography?.fontWeight.normal || '400',
        lineHeight: (theme.typography?.fontSize.sm || 14) * (theme.typography?.lineHeight.normal || 1.5),
    },
    caption: {
        fontSize: theme.typography?.fontSize.xs || 12,
        fontWeight: theme.typography?.fontWeight.normal || '400',
        lineHeight: (theme.typography?.fontSize.xs || 12) * (theme.typography?.lineHeight.normal || 1.5),
    },
    overline: {
        fontSize: theme.typography?.fontSize.xs || 12,
        fontWeight: theme.typography?.fontWeight.medium || '500',
        lineHeight: (theme.typography?.fontSize.xs || 12) * (theme.typography?.lineHeight.normal || 1.5),
        textTransform: 'uppercase',
        letterSpacing: 1.5,
    },
});

export default Text;