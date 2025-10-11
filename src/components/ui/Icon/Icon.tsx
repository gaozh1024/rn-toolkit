import React, { useMemo, forwardRef } from 'react';
import { TextStyle, ViewStyle, Insets } from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { useTheme } from '../../../theme';

// 间距尺寸类型
type SpacingSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | number;

// 自定义图标组件类型
export type CustomIconComponent = React.ComponentType<{
    name: string;
    size?: number;
    color?: string;
    style?: TextStyle | ViewStyle;
    onPress?: () => void;
    testID?: string;
    hitSlop?: Insets;
    accessibilityLabel?: string;
    [key: string]: any;
}>;

// 图标类型（支持默认的 Ionicons 和自定义图标库）
export type IconType = 'ionicons' | string;

export interface IconProps {
    /** 图标名称 */
    name: string;
    /** 图标类型/字体库，默认为 ionicons */
    type?: IconType;
    /** 图标大小 */
    size?: number;
    /** 图标颜色 - 支持主题颜色和自定义颜色 */
    color?: 'primary' | 'secondary' | 'text' | 'textSecondary' | 'textDisabled' | 'error' | 'warning' | 'success' | 'info' | string;
    /** 自定义样式 */
    style?: TextStyle | ViewStyle;
    /** 点击事件 */
    onPress?: () => void;
    /** 是否禁用 */
    disabled?: boolean;
    /** 测试ID */
    testID?: string;
    /** 扩大点击区域 */
    hitSlop?: Insets;
    /** 无障碍标签 */
    accessibilityLabel?: string;

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

// 自定义图标库注册表
const customIconComponents: Record<string, CustomIconComponent> = {};

/**
 * 注册自定义图标库
 * @param name 图标库名称
 * @param component 图标组件
 */
export const registerIconLibrary = (name: string, component: CustomIconComponent) => {
    if (name === 'ionicons') {
        console.warn('Cannot register "ionicons" as it is reserved for the default icon library');
        return;
    }
    customIconComponents[name] = component;
};

/**
 * 注销自定义图标库
 * @param name 图标库名称
 */
export const unregisterIconLibrary = (name: string) => {
    if (name === 'ionicons') {
        console.warn('Cannot unregister "ionicons" as it is the default icon library');
        return;
    }
    delete customIconComponents[name];
};

/**
 * 获取所有已注册的图标库名称
 */
export const getRegisteredIconLibraries = (): string[] => {
    return ['ionicons', ...Object.keys(customIconComponents)];
};

/**
 * 检查图标库是否已注册
 * @param name 图标库名称
 */
export const isIconLibraryRegistered = (name: string): boolean => {
    return name === 'ionicons' || !!customIconComponents[name];
};

export const Icon = forwardRef<any, IconProps>(({
    name,
    type = 'ionicons',
    size = 24,
    color = 'text',
    style,
    onPress,
    disabled = false,
    testID,
    hitSlop,
    accessibilityLabel,
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

    // 获取图标颜色
    const getIconColor = (): string => {
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

    const iconColor = useMemo(getIconColor, [color, colors]);

    // 计算样式，包括间距
    const iconStyle = useMemo(() => {
        const baseStyle: ViewStyle = {
            // Margin（单向 > 轴向 > 总量）
            ...(spacingMemo.mt != null ? { marginTop: spacingMemo.mt } : spacingMemo.mv != null ? { marginTop: spacingMemo.mv } : spacingMemo.m != null ? { marginTop: spacingMemo.m } : {}),
            ...(spacingMemo.mb != null ? { marginBottom: spacingMemo.mb } : spacingMemo.mv != null ? { marginBottom: spacingMemo.mv } : spacingMemo.m != null ? { marginBottom: spacingMemo.m } : {}),
            ...(spacingMemo.ml != null ? { marginLeft: spacingMemo.ml } : spacingMemo.mh != null ? { marginLeft: spacingMemo.mh } : spacingMemo.m != null ? { marginLeft: spacingMemo.m } : {}),
            ...(spacingMemo.mr != null ? { marginRight: spacingMemo.mr } : spacingMemo.mh != null ? { marginRight: spacingMemo.mh } : spacingMemo.m != null ? { marginRight: spacingMemo.m } : {}),

            // Padding（单向 > 轴向 > 总量）
            ...(spacingMemo.pt != null ? { paddingTop: spacingMemo.pt } : spacingMemo.pv != null ? { paddingTop: spacingMemo.pv } : spacingMemo.p != null ? { paddingTop: spacingMemo.p } : {}),
            ...(spacingMemo.pb != null ? { paddingBottom: spacingMemo.pb } : spacingMemo.pv != null ? { paddingBottom: spacingMemo.pv } : spacingMemo.p != null ? { paddingBottom: spacingMemo.p } : {}),
            ...(spacingMemo.pl != null ? { paddingLeft: spacingMemo.pl } : spacingMemo.ph != null ? { paddingLeft: spacingMemo.ph } : spacingMemo.p != null ? { paddingLeft: spacingMemo.p } : {}),
            ...(spacingMemo.pr != null ? { paddingRight: spacingMemo.pr } : spacingMemo.ph != null ? { paddingRight: spacingMemo.ph } : spacingMemo.p != null ? { paddingRight: spacingMemo.p } : {}),
        };
        return baseStyle;
    }, [spacingMemo]);

    let IconComponent: CustomIconComponent;

    // 使用默认的 Ionicons
    if (type === 'ionicons') {
        IconComponent = Ionicons as CustomIconComponent;
    } else {
        // 使用自定义图标库
        IconComponent = customIconComponents[type];
    }

    if (!IconComponent) {
        console.warn(`Icon type "${type}" is not registered. Available types: ${getRegisteredIconLibraries().join(', ')}`);
        return null;
    }

    const iconProps = {
        name,
        size,
        color: iconColor,
        style: iconStyle ? { ...iconStyle, ...(style as object) } : style,
        onPress: disabled ? undefined : onPress,
        testID,
        hitSlop,
        accessibilityLabel: accessibilityLabel || `${name} icon`,
        ...props
    };

    return <IconComponent ref={ref} {...iconProps} />;
});


export default Icon;