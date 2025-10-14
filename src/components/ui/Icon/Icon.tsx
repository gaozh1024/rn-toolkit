import React, { useMemo, forwardRef } from 'react';
import { TextStyle, ViewStyle, Insets, Pressable, StyleProp } from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { useTheme, useSpacingStyle, SpacingProps } from '../../../theme';
import { buildTestID, TestableProps } from '../../common/test';
import type { PressEvents } from '../../common/events';

// 顶部类型声明：CustomIconComponent
export type CustomIconComponent = React.ComponentType<{
    name: string;
    size?: number;
    color?: string;
    style?: StyleProp<TextStyle | ViewStyle>;
    onPress?: () => void;
    testID?: string;
    hitSlop?: Insets;
    accessibilityLabel?: string;
    [key: string]: any;
}>;

// 图标类型（支持默认的 Ionicons 和自定义图标库）
export type IconType = 'ionicons' | string;

export interface IconProps extends SpacingProps, TestableProps {
    name: string;
    type?: IconType;
    size?: number;
    color?: 'primary' | 'secondary' | 'text' | 'textSecondary' | 'textDisabled' | 'error' | 'warning' | 'success' | 'info' | string;
    style?: StyleProp<TextStyle | ViewStyle>;
    disabled?: boolean;
    hitSlop?: Insets;
    accessibilityLabel?: string;
    onPress?: () => void;
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
    disabled = false,
    testID,
    hitSlop,
    accessibilityLabel,
    onPress,
    ...props
}, ref) => {
    const { theme } = useTheme();
    const colors = theme.colors;

    // 获取图标颜色（支持主题键与常见字面量）
    const getIconColor = (): string => {
        if (!color || typeof color !== 'string') return colors.text;
        const c = color.trim();
        if (Object.prototype.hasOwnProperty.call(colors, c)) return (colors as any)[c];
        const isHex = /^#([0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(c);
        const isFuncColor = /^(rgb|rgba|hsl|hsla)\(/i.test(c);
        if (isHex || isFuncColor || c.toLowerCase() === 'transparent') return c;
        return c;
    };
    const iconColor = useMemo(getIconColor, [color, colors]);

    // 公共间距（作用于容器 Pressable）
    const spacingStyle = useSpacingStyle(props);
    // 规范化测试ID
    const computedTestID = buildTestID('Icon', testID);

    let IconComponent: CustomIconComponent;
    if (type === 'ionicons') {
        IconComponent = Ionicons as CustomIconComponent;
    } else {
        IconComponent = customIconComponents[type];
    }
    if (!IconComponent) {
        console.warn(`Icon type "${type}" is not registered. Available types: ${getRegisteredIconLibraries().join(', ')}`);
        return null;
    }

    // 仅将样式传递给图标本身；事件与测试挂载在 Pressable 容器
    const iconProps = {
        name,
        size,
        color: iconColor,
        style,
        // 不再把 onPress 透传给图标，避免重复回调，由容器接管事件
        ...props
    };

    return (
        <Pressable
            disabled={disabled}
            hitSlop={hitSlop}
            accessibilityLabel={accessibilityLabel || `${name} icon`}
            testID={computedTestID}
            style={spacingStyle as StyleProp<ViewStyle>}
            pointerEvents="box-only"
            onPress={disabled ? undefined : onPress}
        >
            <IconComponent ref={ref} {...iconProps} />
        </Pressable>
    );
});


export default Icon;