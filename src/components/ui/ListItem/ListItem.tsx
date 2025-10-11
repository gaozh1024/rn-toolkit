import React from 'react';
import { View, Pressable, ViewStyle, TextStyle, Insets } from 'react-native';
import { useTheme, useThemeColors } from '../../../theme';
import { Text } from '../Text';

export interface ListItemProps {
    title?: string | React.ReactNode;
    description?: string | React.ReactNode;
    left?: React.ReactNode;
    right?: React.ReactNode;
    onPress?: () => void;
    disabled?: boolean;
    selected?: boolean;
    style?: ViewStyle | ViewStyle[];
    contentStyle?: ViewStyle | ViewStyle[];
    titleStyle?: TextStyle;
    descriptionStyle?: TextStyle;
    accessibilityLabel?: string;
    hitSlop?: Insets;
    testID?: string;
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
}) => {
    const { theme } = useTheme();
    const colors = useThemeColors();

    const containerStyle: ViewStyle = {
        flexDirection: 'row',
        alignItems: 'center',
        minHeight: 56,
        paddingHorizontal: (theme.spacing as any)?.md ?? 16,
        paddingVertical: (theme.spacing as any)?.sm ?? 12,
        borderRadius: theme.borderRadius?.md ?? 8,
        borderWidth: 1,
        borderColor: selected ? (colors as any).primary ?? '#3B82F6' : (colors as any).border ?? '#DADDE2',
        backgroundColor: selected ? (colors as any).surface ?? '#F2F3F5' : 'transparent',
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
            {left ? <View style={leftStyle}>{left}</View> : null}
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
            {right ? <View style={rightStyle}>{right}</View> : null}
        </Pressable>
    );
};

export default ListItem;