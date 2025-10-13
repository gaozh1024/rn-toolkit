import React from 'react';
import { View, Pressable, ViewStyle, TextStyle, Insets } from 'react-native';
import { useTheme, useThemeColors } from '../../../theme';
import { Text } from '../Text';

export interface ListItemProps {
    title?: string | React.ReactNode;       // 标题
    description?: string | React.ReactNode; // 描述
    left?: React.ReactNode;                // 左侧插槽
    right?: React.ReactNode;               // 右侧插槽
    onPress?: () => void;                  // 点击事件
    disabled?: boolean;                   // 是否禁用
    selected?: boolean;                   // 是否选中
    style?: ViewStyle | ViewStyle[];     // 容器样式
    contentStyle?: ViewStyle | ViewStyle[]; // 内容区域样式
    titleStyle?: TextStyle;              // 标题样式
    descriptionStyle?: TextStyle;        // 描述样式
    accessibilityLabel?: string;        // 无障碍标签
    hitSlop?: Insets;                    // 扩大点击区域
    testID?: string;                     // 测试ID
    backgroundColor?: string;           // 背景颜色
    borderColor?: string;               // 边框颜色
    rounded?: boolean;                  // 是否圆角
    borderRadius?: number;              // 圆角半径
}

const ListItem: React.FC<ListItemProps> = ({
    title,
    description,
    left,
    right,
    onPress,
    disabled = false,
    selected = false,
    style,
    contentStyle,
    titleStyle,
    descriptionStyle,
    accessibilityLabel,
    hitSlop,
    testID,
    backgroundColor,
    borderColor,
    rounded,
    borderRadius,
}) => {
    const { theme } = useTheme();
    const colors = useThemeColors();

    const containerStyle: ViewStyle = {
        flexDirection: 'row',
        alignItems: 'center',
        minHeight: 56,
        paddingHorizontal: (theme.spacing as any)?.md ?? 16,
        paddingVertical: (theme.spacing as any)?.sm ?? 12,
        borderRadius:
            rounded === false
                ? 0
                : typeof borderRadius === 'number'
                ? borderRadius
                : (theme.borderRadius as any)?.md ?? 8,
        borderWidth: 1,
        borderColor:
            borderColor ?? (selected ? (colors as any).primary ?? '#3B82F6' : (colors as any).border ?? '#DADDE2'),
        backgroundColor:
            backgroundColor ?? (selected ? (colors as any).surface ?? '#F2F3F5' : 'transparent'),
        overflow: rounded === false ? 'visible' : 'hidden',
        opacity: disabled ? 0.6 : 1,
    };

    const leftStyle: ViewStyle = {
        marginRight: (theme.spacing as any)?.md ?? 16,
    };

    const rightStyle: ViewStyle = {
        marginLeft: (theme.spacing as any)?.md ?? 16,
    };

    const contentWrapStyle: ViewStyle = {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
    };

    return (
        <Pressable
            testID={testID}
            accessible
            accessibilityRole={onPress ? 'button' : 'text'}
            accessibilityLabel={accessibilityLabel || (typeof title === 'string' ? title : 'List item')}
            onPress={disabled ? undefined : onPress}
            hitSlop={hitSlop}
            style={[containerStyle, style]}
        >
            {left ? <View style={{ marginRight: (theme.spacing as any)?.md ?? 16 }}>{left}</View> : null}
            <View style={[{ flex: 1, flexDirection: 'column', justifyContent: 'center' }, contentStyle]}>
                {title != null && (
                    typeof title === 'string' ? (
                        <Text variant="body1" weight="semibold" style={titleStyle}>{title}</Text>
                    ) : (
                        title as React.ReactNode
                    )
                )}
                {description != null && (
                    typeof description === 'string' ? (
                        <Text variant="body2" color="textSecondary" style={descriptionStyle}>{description}</Text>
                    ) : (
                        description as React.ReactNode
                    )
                )}
            </View>
            {right ? <View style={{ marginLeft: (theme.spacing as any)?.md ?? 16 }}>{right}</View> : null}
        </Pressable>
    );
};

export default ListItem;