import React, { useMemo } from 'react';
import { View, Pressable, ViewStyle } from 'react-native';
import { useTheme, useLayoutStyles, useSpacingStyles } from '../../../theme';
import { useNav } from '../../../navigation/hooks/useNavigation';
import { useSafeAreaInsets } from '../SafeAreaView';
import { Icon } from '../../ui/Icon';
import Text from '../../ui/Text/Text';

export interface HeaderAction {
    // 图标按钮（可选）
    iconName?: string;
    type?: string;  // 图标库类型，默认 ionicons

    // 文字按钮（可选）
    label?: string;

    // 通用
    onPress?: () => void;
    color?: string; // 支持主题颜色键或自定义颜色（图标或文字皆可）
    disabled?: boolean;
    testID?: string;
    accessibilityLabel?: string;
}

export interface HeaderProps {
    title?: string | React.ReactNode;

    // 左侧返回按钮
    backVisible?: boolean;            // 是否展示返回按钮（默认 true，当提供 onBack 时自动展示）
    onBack?: () => void;              // 返回事件
    backIconName?: string;            // 返回图标名，默认 chevron-back
    backIconColor?: string;           // 返回图标颜色（主题键或颜色值）

    // 右侧动作区（最多 3 个）
    actions?: HeaderAction[];

    // 外观与皮肤
    backgroundColor?: string;         // 覆盖背景色（默认使用 theme.navigation.backgroundColor）
    borderBottom?: boolean;           // 是否显示底部分割线（默认 true）
    titleColor?: string;              // 标题颜色（默认使用 theme.navigation.titleColor）
    height?: number;                  // Header 内容高度（不含安全区，默认 theme.navigation.height）

    // 其他
    testID?: string;
}

/**
 * 公共 Header 组件
 * - 左侧返回，居中标题，右侧最多 3 个动作按钮
 * - 使用主题的 navigation 配置（高度、颜色等）
 */
export const Header: React.FC<HeaderProps> = ({
    title,
    backVisible,
    onBack,
    backIconName = 'chevron-back',
    backIconColor,
    actions = [],
    backgroundColor,
    borderBottom = true,
    titleColor,
    height,
    testID,
}) => {
    const { theme } = useTheme();
    const layout = useLayoutStyles();
    const spacing = useSpacingStyles();
    const insets = useSafeAreaInsets();

    // 主题导航配置
    const nav = theme.navigation;
    const contentHeight = height ?? nav.height;
    const containerBg = backgroundColor ?? nav.backgroundColor;
    const titleColorFinal = titleColor ?? nav.titleColor;
    const iconColor = (c?: string) => c ?? nav.iconColor;
    const iconSize = nav.iconSize;

    // 动作区最多保留 3 个
    const MAX_ACTIONS = 3;
    const actionsLimited = useMemo(() => actions.slice(0, MAX_ACTIONS), [actions]);
    // 每个图标按钮的触控槽位宽度（保证左右两边等宽以实现标题真正居中）
    const LEFT_SIZE = 44;
    const SLOT_SIZE = 36;
    const sideWidth = SLOT_SIZE * MAX_ACTIONS;

    const containerStyle: ViewStyle = {
        backgroundColor: containerBg,
        paddingTop: insets.top,
        borderBottomWidth: borderBottom ? 1 : 0,
        borderBottomColor: borderBottom ? nav.borderColor : 'transparent',
    };

    const contentRowStyle: ViewStyle = {
        height: contentHeight,
        flexDirection: 'row',
        alignItems: 'center',
    };

    const sideContainerStyle: ViewStyle = {
        width: sideWidth,
        flexDirection: 'row',
        alignItems: 'center',
    };

    const leftContainerStyle: ViewStyle = {
        ...sideContainerStyle,
    };

    const rightContainerStyle: ViewStyle = {
        ...sideContainerStyle,
        ...spacing.prXs,
        justifyContent: 'flex-end',
    };

    const titleContainerStyle: ViewStyle = {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        // 通过左右固定宽度容器，确保标题真实居中且有最大宽度限制
    };

    const titleTextStyle: ViewStyle = {
        // 使用主题导航的字体定义
        // Text 组件支持通过 style 覆盖 fontSize/weight
        // 颜色使用 Text 的 color 属性（支持主题键或颜色值）
        ...(spacing.pxMd as ViewStyle),
    };

    const renderBackSlot = () => {
        const nav = useNav();
        const showBack = backVisible ?? true; // 默认显示返回按钮
        const handleBack = onBack ?? (() => nav.goBack());
        // 保留一个槽位，以保证左侧宽度固定（即使不显示返回按钮也占位）
        return (
            <View style={{ width: SLOT_SIZE, height: SLOT_SIZE, justifyContent: 'center' }}>
                {showBack && (
                    <Pressable
                        onPress={handleBack}
                        hitSlop={8}
                        accessibilityLabel="返回"
                        style={{ width: LEFT_SIZE, height: SLOT_SIZE, alignItems: 'center', justifyContent: 'center' }}
                    >
                        <Icon name={backIconName} size={iconSize} color={iconColor(backIconColor)} />
                    </Pressable>
                )}
            </View>
        );
    };

    const renderActionSlots = () => {
        const slots: React.ReactNode[] = [];
        const actionsCount = actionsLimited.length;

        // 先填充空槽位，使实际动作靠右显示
        for (let i = 0; i < MAX_ACTIONS - actionsCount; i++) {
            slots.push(<View key={`action-empty-${i}`} style={{ width: SLOT_SIZE, height: SLOT_SIZE }} />);
        }

        // 再渲染动作槽位
        for (let i = 0; i < actionsCount; i++) {
            const act = actionsLimited[i];
            const {
                label,
                iconName,
                onPress,
                color,
                type = 'ionicons',
                disabled,
                testID: actionTestID,
                accessibilityLabel,
            } = act;
            slots.push(
                <View key={`action-${i}`} style={{ width: SLOT_SIZE, height: SLOT_SIZE, justifyContent: 'center' }}>
                    <Pressable
                        onPress={onPress}
                        disabled={disabled}
                        hitSlop={8}
                        accessibilityLabel={accessibilityLabel || `${(label || iconName) ?? 'action'}`}
                        testID={actionTestID}
                        style={{ minWidth: SLOT_SIZE, height: SLOT_SIZE, paddingHorizontal: 4, alignItems: 'center', justifyContent: 'center' }}
                    >
                        {label ? (
                            <Text
                                numberOfLines={1}
                                ellipsizeMode="tail"
                                style={{ fontSize: nav.labelSize, fontWeight: nav.labelWeight }}
                                color={color ?? nav.labelColor}
                            >
                                {label}
                            </Text>
                        ) : (
                            <Icon name={iconName!} type={type} size={iconSize} color={iconColor(color)} />
                        )}
                    </Pressable>
                </View>
            );
        }
        return slots;
    };

    return (
        <View style={containerStyle} testID={testID}>
            <View style={contentRowStyle}>
                {/* 左侧返回槽位（固定宽度） */}
                <View style={leftContainerStyle}>{renderBackSlot()}</View>

                {/* 中间标题（居中、单行省略） */}
                <View style={titleContainerStyle}>
                    {typeof title === 'string' ? (
                        <Text
                            style={[titleTextStyle, { fontSize: nav.titleSize, fontWeight: nav.titleWeight }]}
                            color={titleColorFinal}
                            numberOfLines={1}
                            ellipsizeMode="tail"
                        >
                            {title}
                        </Text>
                    ) : (
                        // 如果传入自定义节点，交由外部控制，但仍受居中与最大宽度限制
                        title
                    )}
                </View>

                {/* 右侧动作区（最多3个槽位，固定宽度） */}
                <View style={rightContainerStyle}>{renderActionSlots()}</View>
            </View>
        </View>
    );
};

Header.displayName = 'Header';

export default Header;