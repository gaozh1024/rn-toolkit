import React, { useMemo } from 'react';
import { View, Pressable, ViewStyle } from 'react-native';
import { useTheme, useSpacingStyles } from '../../../theme';
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

import { GradientBackground } from '../GradientBackground/GradientBackground';

export interface HeaderProps {
    title?: string | React.ReactNode;
    // 左侧返回按钮
    backVisible?: boolean;
    onBack?: () => void;
    backIconName?: string;
    backIconColor?: string;
    // 右侧动作区（最多 3 个）
    actions?: HeaderAction[];
    // 外观与皮肤
    backgroundColor?: string;
    borderBottom?: boolean;
    titleColor?: string;
    height?: number;
    // 其他
    testID?: string;
    // 渐变（可选）
    gradientEnabled?: boolean;
    gradientVariant?: 'linear' | 'radial';
    gradientColors?: string[];
    gradientLocations?: number[];
    gradientAngle?: number;
    gradientStart?: { x: number; y: number };
    gradientEnd?: { x: number; y: number };
    gradientCenter?: { x: number; y: number };
    gradientRadius?: number;
    gradientOpacity?: number;
}

// Header 组件布局修复：让渐变覆盖安全区+bar
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
    // 渐变相关
    gradientEnabled = false,
    gradientVariant = 'linear',
    gradientColors,
    gradientLocations,
    gradientAngle,
    gradientStart,
    gradientEnd,
    gradientCenter = { x: 0.5, y: 0.5 },
    gradientRadius = 0.5,
    gradientOpacity = 1,
}) => {
    const { theme } = useTheme();
    const spacing = useSpacingStyles();
    const insets = useSafeAreaInsets();

    // 主题导航配置
    const nav = theme.navigation;
    const contentHeight = height ?? nav.height;
    const containerBg = backgroundColor ?? nav.backgroundColor;
    const titleColorFinal = titleColor ?? nav.titleColor;
    const iconColor = (c?: string) => c ?? nav.iconColor;
    const iconSize = nav.iconSize;

    // 补齐缺失的常量定义
    const MAX_ACTIONS = 3;
    const actionsLimited = useMemo(() => actions.slice(0, MAX_ACTIONS), [actions]);
    const LEFT_SIZE = 44;
    const SLOT_SIZE = 36;
    const sideWidth = SLOT_SIZE * MAX_ACTIONS;

    const gradientPalette = (gradientColors && gradientColors.length > 0)
        ? gradientColors
        : [theme.colors.primary, theme.colors.secondary];

    // 原有 containerStyle 改为外层容器（无 paddingTop）
    const outerContainerStyle: ViewStyle = {
        backgroundColor: gradientEnabled ? 'transparent' : containerBg,
        borderBottomWidth: borderBottom ? 1 : 0,
        borderBottomColor: borderBottom ? nav.borderColor : 'transparent',
        position: 'relative',
    };

    // 新增：内容包裹层，把安全区内边距放到这里
    const contentWrapperStyle: ViewStyle = {
        paddingTop: insets.top,
    };

    const contentRowStyle: ViewStyle = {
        height: contentHeight,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'transparent',
    };

    const sideContainerStyle: ViewStyle = {
        width: sideWidth,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'transparent',
    };

    const leftContainerStyle: ViewStyle = {
        ...sideContainerStyle,
        backgroundColor: 'transparent',
    };

    const rightContainerStyle: ViewStyle = {
        ...sideContainerStyle,
        ...spacing.prXs,
        justifyContent: 'flex-end',
        backgroundColor: 'transparent',
    };

    const titleContainerStyle: ViewStyle = {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
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
        <View style={[outerContainerStyle]} testID={testID}>
            {gradientEnabled && (
                <GradientBackground
                    variant={gradientVariant}
                    colors={gradientPalette}
                    locations={gradientLocations}
                    angle={gradientAngle}
                    start={gradientStart}
                    end={gradientEnd}
                    center={gradientCenter}
                    radius={gradientRadius}
                    opacity={gradientOpacity}
                    style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0}}
                />
            )}
            <View style={contentWrapperStyle}>
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
                            title
                        )}
                    </View>
                    {/* 右侧动作区（最多3个槽位，固定宽度） */}
                    <View style={rightContainerStyle}>{renderActionSlots()}</View>
                </View>
            </View>
        </View>
    );
};

Header.displayName = 'Header';

export default Header;