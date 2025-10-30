// 顶部导入处（加入 BackgroundProps）
import React, { useMemo } from 'react';
import { Text as RNText, TextStyle, StyleProp, Platform } from 'react-native';
// 顶部导入处
import { useTheme, useSpacingStyle, SpacingProps } from '../../../theme';
import { buildTestID, TestableProps } from '../../common/test';
import { BackgroundProps, buildBackgroundStyle } from '../../common/background';
import { BoxProps, buildSizeStyle } from '../../common/box';

export interface TextProps extends SpacingProps, TestableProps, BackgroundProps, BoxProps {
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
    // iOS：是否抑制点击高亮背景（默认：在有 onPress/onLongPress 时为 true）
    suppressHighlighting?: boolean;
    // 测试ID（继承自 TestableProps）
    testID?: string;
}

const Text = React.forwardRef<React.ComponentRef<typeof RNText>, TextProps>(({
    children,
    style,
    variant = 'body1',
    size,
    weight,
    color,
    align,
    lineHeight,
    decoration,
    transform,
    selectable = false,
    numberOfLines,
    ellipsizeMode = 'tail',
    allowFontScaling = true,
    minimumFontScale,
    adjustsFontSizeToFit = false,
    onPress,
    onLongPress,
    suppressHighlighting,
    testID,
    // spacing shortcuts
    m, mv, mh, mt, mb, ml, mr,
    p, pv, ph, pt, pb, pl, pr,
    // background shortcuts
    backgroundColor,
    transparent,
    ...props
}, ref) => {
    /**
     * 在 iOS 上移除 Text 的点击高亮背景：
     * - 默认：当存在 onPress/onLongPress 时关闭高亮
     * - 可通过 suppressHighlighting 显式控制（true 关闭，false 开启）
     */
    const iosSuppressHighlighting =
        Platform.OS === 'ios'
            ? (typeof suppressHighlighting === 'boolean'
                ? suppressHighlighting
                : (typeof onPress === 'function' || typeof onLongPress === 'function'))
            : undefined;

    const { theme } = useTheme();
    const colors = theme.colors;
    const computedTestID = buildTestID('Text', testID);

    // 间距样式（统一公共方法）
    const spacingStyle = useSpacingStyle({
        m, mv, mh, mt, mb, ml, mr,
        p, pv, ph, pt, pb, pl, pr,
    });

    // 背景样式（默认透明，按需覆盖）
    const backgroundStyle = buildBackgroundStyle('transparent', { backgroundColor, transparent });

    // 尺寸样式（支持 width/height/minWidth/maxWidth 等）
    const sizeStyle = buildSizeStyle(props);

    // 获取变体样式（memo）
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

    const variantStyle = useMemo(getVariantStyle, [theme, variant]);

    // 获取字体大小
    const getFontSize = (): number => {
        if (typeof size === 'number') {
            return size;
        }

        if (size) {
            const sizeMap = {
                xs: 12,
                sm: 14,
                md: 16,
                lg: 18,
                xl: 24,
            } as const;
            return sizeMap[size as keyof typeof sizeMap] || 14;
        }

        return variantStyle.fontSize || 14;
    };

    const fontSizeMemo = useMemo(getFontSize, [size, variantStyle]);

    // 获取字体粗细（统一数值映射）
    const normalizeFontWeight = (fw: TextStyle['fontWeight'] | undefined): TextStyle['fontWeight'] => {
        if (!fw) return '400';
        if (fw === 'normal') return '400';
        if (fw === 'bold') return '700';
        return fw;
    };

    const getFontWeight = (): TextStyle['fontWeight'] => {
        if (weight) {
            const weightMap: Record<string, TextStyle['fontWeight']> = {
                light: '300',
                normal: '400',
                medium: '500',
                semibold: '600',
                bold: '700',
            };
            const mapped = weightMap[weight];
            return mapped ?? normalizeFontWeight(variantStyle.fontWeight);
        }
        return normalizeFontWeight(variantStyle.fontWeight);
    };

    const fontWeightMemo = useMemo(getFontWeight, [weight, variantStyle]);

    // 获取文本颜色（优先主题键）
    const getTextColor = (): string => {
        if (!color || typeof color !== 'string') {
            return colors.text;
        }
        const c = color.trim();
        // 优先：如果主题中存在同名颜色键（支持用户自定义键），直接返回
        if (Object.prototype.hasOwnProperty.call(colors, c)) {
            return (colors as any)[c];
        }
        // 兼容常见颜色字面量
        const isHex = /^#([0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(c);
        const isFuncColor = /^(rgb|rgba|hsl|hsla)\(/i.test(c);
        if (isHex || isFuncColor || c.toLowerCase() === 'transparent') {
            return c;
        }
        // 兜底返回原字符串（RN 支持部分命名颜色）
        return c;
    };

    const textColorMemo = useMemo(getTextColor, [color, colors]);

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
            } as const;
            return fontSizeMemo * (lineHeightMap[lineHeight as keyof typeof lineHeightMap] || 1.5);
        }
        return variantStyle.lineHeight;
    };

    const lineHeightMemo = useMemo(getLineHeight, [lineHeight, fontSizeMemo, variantStyle]);

    // 默认行高计算
    const getDefaultLineHeightForVariant = (): number => {
        const sizeValue = fontSizeMemo;
        if (typeof variant === 'string' && variant.startsWith('h')) {
            return Math.round(sizeValue * 1.25);
        }
        if (variant === 'caption' || variant === 'overline' || variant === 'button' || variant === 'link') {
            return Math.round(sizeValue * 1.3);
        }
        return Math.round(sizeValue * 1.5);
    };

    const defaultLineHeightMemo = useMemo(getDefaultLineHeightForVariant, [variant, fontSizeMemo]);

    // 组合样式
    const baseStyle: TextStyle = {
        ...variantStyle,
        fontSize: fontSizeMemo,
        fontWeight: fontWeightMemo,
        ...(color ? { color: textColorMemo } : (!variantStyle.color ? { color: colors.text } : {})),
        ...(typeof align !== 'undefined' ? { textAlign: align } : {}),
        ...(typeof lineHeight !== 'undefined' ? { lineHeight: lineHeightMemo } : (!variantStyle.lineHeight ? { lineHeight: defaultLineHeightMemo } : {})),
        ...(typeof decoration !== 'undefined' ? { textDecorationLine: decoration } : {}),
        ...(typeof transform !== 'undefined' ? { textTransform: transform } : {}),
    };
    if (Platform.OS === 'android') {
        baseStyle.fontFamily = 'lucida grande, tahoma, verdana, arial, sans-serif';
    }

    return (
        <RNText
            ref={ref}
            style={[baseStyle, spacingStyle, backgroundStyle, sizeStyle, style]}
            selectable={selectable}
            numberOfLines={numberOfLines}
            ellipsizeMode={ellipsizeMode}
            allowFontScaling={allowFontScaling}
            {...(adjustsFontSizeToFit ? { minimumFontScale } : {})}
            adjustsFontSizeToFit={adjustsFontSizeToFit}
            onPress={onPress}
            onLongPress={onLongPress}
            suppressHighlighting={iosSuppressHighlighting as boolean | undefined}
            testID={computedTestID}
            {...props}
        >
            {children}
        </RNText>
    );
});

Text.displayName = 'Text';

export default Text;