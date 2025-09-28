import React, { useMemo } from 'react';
import { Text as RNText, TextStyle, StyleProp } from 'react-native';
import { useTheme } from '../../../theme';

type SpacingSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | number;

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

    // 间距（基于主题 spacing，亦可传数字像素）
    m?: SpacingSize;
    mv?: SpacingSize; // marginVertical
    mh?: SpacingSize; // marginHorizontal
    mt?: SpacingSize;
    mb?: SpacingSize;
    ml?: SpacingSize;
    mr?: SpacingSize;

    p?: SpacingSize;
    pv?: SpacingSize; // paddingVertical
    ph?: SpacingSize; // paddingHorizontal
    pt?: SpacingSize;
    pb?: SpacingSize;
    pl?: SpacingSize;
    pr?: SpacingSize;
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
    testID,
    // spacing shortcuts
    m, mv, mh, mt, mb, ml, mr,
    p, pv, ph, pt, pb, pl, pr,
    ...props
}, ref) => {
    const { theme } = useTheme();
    const colors = theme.colors;

    // 解析 spacing 值（优先主题刻度，支持数字像素）
    const getSpacingValue = (value: SpacingSize | undefined): number | undefined => {
        if (value == null) return undefined;
        if (typeof value === 'number') return value;
        const s = theme.spacing as any;
        return s[value] ?? undefined;
    };

    const spacingMemo = useMemo(() => ({
        m: getSpacingValue(m),
        mv: getSpacingValue(mv),
        mh: getSpacingValue(mh),
        mt: getSpacingValue(mt),
        mb: getSpacingValue(mb),
        ml: getSpacingValue(ml),
        mr: getSpacingValue(mr),
        p: getSpacingValue(p),
        pv: getSpacingValue(pv),
        ph: getSpacingValue(ph),
        pt: getSpacingValue(pt),
        pb: getSpacingValue(pb),
        pl: getSpacingValue(pl),
        pr: getSpacingValue(pr),
    }), [theme.spacing, m, mv, mh, mt, mb, ml, mr, p, pv, ph, pt, pb, pl, pr]);

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
            return sizeMap[size as keyof typeof sizeMap] || 16;
        }

        return variantStyle.fontSize || 16;
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
            if (!mapped) {
                if (__DEV__) {
                    console.warn('Invalid weight provided:', weight);
                }
                return normalizeFontWeight(variantStyle.fontWeight);
            }
            return mapped;
        }

        return normalizeFontWeight(variantStyle.fontWeight);
    };

    const fontWeightMemo = useMemo(getFontWeight, [weight, variantStyle]);

    // 获取文本颜色（支持 hex、rgb(a)、hsl(a)、transparent 与命名颜色；优先主题键）
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

    const textColorMemo = useMemo(getTextColor, [color, colors]); // 依赖 colors 引用，主题更新或自定义颜色键变化会触发重新计算

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

    // 默认行高计算（当变体未定义且未显式传入时）
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

    // 组合样式（仅内部样式，用户样式通过数组传递以保留 StyleSheet 引用）

    const baseStyle: TextStyle = {
        ...variantStyle,
        fontSize: fontSizeMemo,
        fontWeight: fontWeightMemo,
        // 颜色优先级：用户传入 > 变体定义 > 默认 text
        ...(color ? { color: textColorMemo } : (!variantStyle.color ? { color: colors.text } : {})),
        ...(typeof align !== 'undefined' ? { textAlign: align } : {}),
        ...(typeof lineHeight !== 'undefined' ? { lineHeight: lineHeightMemo } : (!variantStyle.lineHeight ? { lineHeight: defaultLineHeightMemo } : {})),
        ...(typeof decoration !== 'undefined' ? { textDecorationLine: decoration } : {}),
        ...(typeof transform !== 'undefined' ? { textTransform: transform } : {}),
    };

    return (
        <RNText
            ref={ref}
            style={[baseStyle, style]}
            selectable={selectable}
            numberOfLines={numberOfLines}
            ellipsizeMode={ellipsizeMode}
            allowFontScaling={allowFontScaling}
            {...(adjustsFontSizeToFit ? { minimumFontScale } : {})}
            adjustsFontSizeToFit={adjustsFontSizeToFit}
            onPress={onPress}
            onLongPress={onLongPress}
            testID={testID}
            {...props}
        >
            {children}
        </RNText>
    );
});

Text.displayName = 'Text';

export default Text;