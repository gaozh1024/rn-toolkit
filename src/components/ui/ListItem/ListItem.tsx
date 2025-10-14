import React from 'react';
import { View, Pressable, ViewStyle, TextStyle, Insets, StyleProp } from 'react-native';
import { useTheme, useThemeColors } from '../../../theme';
import { Text } from '../Text';

import { useSpacingStyle, SpacingProps } from '../../../theme/spacing';
import { buildTestID, TestableProps } from '../../common/test';
import { buildBoxStyle, type BoxProps } from '../../common/box';

export interface ListItemProps extends SpacingProps, TestableProps, BoxProps {
    title?: string | React.ReactNode;
    description?: string | React.ReactNode;
    left?: React.ReactNode;
    right?: React.ReactNode;
    onPress?: () => void;
    disabled?: boolean;
    selected?: boolean;
    style?: StyleProp<ViewStyle>;
    contentStyle?: StyleProp<ViewStyle>;
    titleStyle?: StyleProp<TextStyle>;
    descriptionStyle?: StyleProp<TextStyle>;
    accessibilityLabel?: string;
    hitSlop?: Insets;
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
    ...restProps
}) => {
    const { theme } = useTheme();
    const colors = useThemeColors();

    // 统一间距与测试ID
    const spacingStyle = useSpacingStyle(restProps);
    const computedTestID = buildTestID('ListItem', testID);

    // 默认背景与边框（可被 BoxProps 覆盖）
    const defaultBackground = selected ? ((colors as any).surface ?? '#F2F3F5') : 'transparent';
    const defaultBorderColor = selected
        ? ((colors as any).primary ?? '#3B82F6')
        : ((colors as any).border ?? '#DADDE2');

    const base: ViewStyle = {
        flexDirection: 'row',
        alignItems: 'center',
        minHeight: 56,
        paddingHorizontal: (theme.spacing as any)?.md ?? 16,
        paddingVertical: (theme.spacing as any)?.sm ?? 12,
        opacity: disabled ? 0.6 : 1,
    };

    const boxStyle = buildBoxStyle(
        { defaultBackground },
        restProps,
        { ...base, borderWidth: 1, borderColor: defaultBorderColor, backgroundColor: defaultBackground },
    );

    const containerStyle: StyleProp<ViewStyle> = [boxStyle, spacingStyle, style];

    const contentWrapStyle: ViewStyle = {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
    };

    return (
        <Pressable
            testID={computedTestID}
            accessible
            accessibilityRole={onPress ? 'button' : 'text'}
            accessibilityLabel={accessibilityLabel || (typeof title === 'string' ? title : 'List item')}
            onPress={disabled ? undefined : onPress}
            hitSlop={hitSlop}
            style={containerStyle}
        >
            {left ? <View style={{ marginRight: (theme.spacing as any)?.md ?? 16 }}>{left}</View> : null}
            <View style={[contentWrapStyle, contentStyle]}>
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