import React from 'react';
import { TextStyle, ViewStyle } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useThemeColors } from '../../../theme';

// 自定义图标组件类型
export type CustomIconComponent = React.ComponentType<{
    name: string;
    size?: number;
    color?: string;
    style?: TextStyle | ViewStyle;
    onPress?: () => void;
    testID?: string;
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

export const Icon: React.FC<IconProps> = ({
    name,
    type = 'ionicons',
    size = 24,
    color = 'text',
    style,
    onPress,
    disabled = false,
    testID,
}) => {
    const colors = useThemeColors();

    // 获取图标颜色
    const getIconColor = (): string => {
        // 如果是自定义颜色值（十六进制或RGB）
        if (typeof color === 'string' && (color.startsWith('#') || color.startsWith('rgb'))) {
            return color;
        }

        // 如果组件被禁用，使用禁用颜色
        if (disabled) {
            return colors.textDisabled;
        }

        // 根据主题颜色名称获取对应颜色
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
                // 如果是其他字符串，直接使用（可能是自定义颜色名）
                return typeof color === 'string' ? color : colors.text;
        }
    };

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
        color: getIconColor(),
        style,
        onPress: disabled ? undefined : onPress,
        testID,
    };

    return <IconComponent {...iconProps} />;
};

export default Icon;