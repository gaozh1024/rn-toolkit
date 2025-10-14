import React from 'react';
import { View, Pressable, ViewStyle, TextStyle, StyleProp } from 'react-native';
import { useTheme, useSpacingStyle, SpacingProps } from '../../../theme';
import { buildTestID, TestableProps } from '../../common/test';
import { Icon } from '../Icon';
import { Text } from '../Text';

// 接口与类型
export type ChipVariant = 'solid' | 'outline';
export type ChipColor = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | string;
export type ChipSize = 'small' | 'medium' | 'large' | number;

export interface ChipProps extends SpacingProps, TestableProps {
    label?: React.ReactNode | string;
    icon?: React.ReactNode | { name: string; size?: number; color?: string; type?: string };
    closable?: boolean | React.ReactNode;
    onClose?: () => void;
    selected?: boolean;
    variant?: ChipVariant;
    color?: ChipColor;
    size?: ChipSize;
    // 统一样式类型（删除不需要的数组类型）
    style?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
}

// 组件：Chip
const Chip: React.FC<ChipProps> = ({
    label,
    icon,
    closable = false,
    onClose,
    selected = false,
    variant = 'outline',
    color = 'primary',
    size = 'medium',
    style,
    textStyle,
    testID,
    ...props
}) => {
    const { theme } = useTheme();
    const colors = theme.colors;

    const getThemeColor = (c: ChipColor): string => {
        const preset = ['primary', 'secondary', 'success', 'warning', 'error', 'info'] as const;
        if (preset.includes(c as any)) return colors[c as keyof typeof colors] as string;
        return c as string;
    };

    const activeColor = getThemeColor(color);

    const height = typeof size === 'number' ? size : size === 'small' ? 24 : size === 'large' ? 32 : 28;
    const paddingH = Math.max(8, Math.round(height / 3.2));
    const borderRadius = Math.round(height / 2);
    const fontSize = Math.max(12, Math.round(height * 0.46));

    const isOutlineInactive = variant === 'outline' && !selected;
    const backgroundColor = isOutlineInactive ? 'transparent' : activeColor;
    const borderColor = activeColor;
    const borderWidth = isOutlineInactive ? 1 : 0;
    const contentColor = isOutlineInactive ? activeColor : '#FFFFFF';

    const containerStyle: ViewStyle = {
        height,
        minWidth: height,
        paddingHorizontal: paddingH,
        borderRadius,
        backgroundColor,
        borderColor,
        borderWidth,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        columnGap: 6,
    };

    const labelStyle: TextStyle = {
        color: contentColor,
        fontSize,
        fontWeight: '500',
    };

    const iconSize = (icon as any)?.size ?? Math.max(14, Math.round(fontSize + 2));
    const closeSize = Math.max(14, Math.round(fontSize + 2));

    // 新增：公共间距与规范化 testID
    const spacingStyle = useSpacingStyle(props);
    const computedTestID = buildTestID('Chip', testID);

    return (
        <View
            style={[spacingStyle, containerStyle, style]}
            testID={computedTestID}
            accessible
            accessibilityRole={typeof closable === 'boolean' && closable ? 'button' : 'text'}
        >
            {React.isValidElement(icon) ? (
                icon
            ) : (icon as any)?.name ? (
                <Icon
                    name={(icon as any).name}
                    size={iconSize}
                    color={(icon as any).color ?? contentColor}
                    type={(icon as any).type ?? 'ionicons'}
                />
            ) : null}

            {label !== undefined && label !== null ? (
                typeof label === 'string' ? (
                    <Text style={[labelStyle, textStyle]}>{label}</Text>
                ) : (
                    <View>{label}</View>
                )
            ) : null}

            {typeof closable === 'boolean' ? (
                closable ? (
                    <Pressable
                        onPress={onClose}
                        hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                        accessibilityLabel="close tag"
                        accessibilityRole="button"
                    >
                        <Icon name="close" size={closeSize} color={contentColor} />
                    </Pressable>
                ) : null
            ) : React.isValidElement(closable) ? (
                closable
            ) : null}
        </View>
    );
};

export default Chip;