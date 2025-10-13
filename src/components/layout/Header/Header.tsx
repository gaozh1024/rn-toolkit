// 顶部 import 区域（加入 TextStyle）
import React, { useMemo } from 'react';
import { View, Pressable, ViewStyle, TextStyle } from 'react-native';
import { useTheme, useSpacingStyles } from '../../../theme';
import { useNav } from '../../../navigation/hooks/useNavigation';
import { useSafeAreaInsets } from '../SafeAreaView';
import { Icon } from '../../ui/Icon';
import Text from '../../ui/Text/Text';

// 接口：HeaderAction（新增大小/粗细相关配置）
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
    // 图标大小/样式（可选）
    iconSize?: number;
    iconStyle?: TextStyle | ViewStyle;
    // 文本大小/粗细（可选）
    labelSize?: number;
    labelWeight?: TextStyle['fontWeight'];
}

import { GradientBackground } from '../GradientBackground/GradientBackground';

// 在 HeaderProps 中新增两个可选属性
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
    // 背景透明与安全区
    transparent?: boolean;            // 开启后 Header 背景透明
    safeAreaTopEnabled?: boolean;     // 是否添加顶部安全区内边距，默认 true
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
    // 新增：透明与安全区控制
    transparent = false,
    safeAreaTopEnabled = true,
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
    const containerBg = transparent ? 'transparent' : (backgroundColor ?? nav.backgroundColor);
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

    // 内容包裹层：根据 safeAreaTopEnabled 决定是否添加顶部安全区内边距
    const contentWrapperStyle: ViewStyle = {
        paddingTop: safeAreaTopEnabled ? insets.top : 0,
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

    // 函数：renderBackSlot（统一高度为 contentHeight，避免底部裁切）
    const renderBackSlot = () => {
        const nav = useNav();
        const showBack = backVisible ?? true; // 默认显示返回按钮
        const handleBack = onBack ?? (() => nav.goBack());
        // 保留一个槽位，以保证左侧宽度固定（即使不显示返回按钮也占位）
        return (
            <View style={{ width: SLOT_SIZE, height: contentHeight, justifyContent: 'center' }}>
                {showBack && (
                    <Pressable
                        onPress={handleBack}
                        hitSlop={8}
                        accessibilityLabel="返回"
                        style={{ width: LEFT_SIZE, height: contentHeight, alignItems: 'center', justifyContent: 'center' }}
                    >
                        <Icon name={backIconName} size={iconSize} color={iconColor(backIconColor)} />
                    </Pressable>
                )}
            </View>
        );
    };

    // 函数：renderActionSlots（支持大小/粗细配置并修复裁切）
    const renderActionSlots = () => {
        const slots: React.ReactNode[] = [];
        const actionsCount = actionsLimited.length;
    
        // 先填充空槽位，使实际动作靠右显示（高度统一为 contentHeight）
        for (let i = 0; i < MAX_ACTIONS - actionsCount; i++) {
            slots.push(<View key={`action-empty-${i}`} style={{ width: SLOT_SIZE, height: contentHeight }} />);
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
                <View key={`action-${i}`} style={{ width: SLOT_SIZE, height: contentHeight, justifyContent: 'center' }}>
                    <Pressable
                        onPress={onPress}
                        disabled={disabled}
                        hitSlop={8}
                        accessibilityLabel={accessibilityLabel || `${(label || iconName) ?? 'action'}`}
                        testID={actionTestID}
                        style={{ minWidth: SLOT_SIZE, height: contentHeight, paddingHorizontal: 6, alignItems: 'center', justifyContent: 'center' }}
                    >
                        {label ? (
                            <Text
                                numberOfLines={1}
                                ellipsizeMode="tail"
                                style={{ fontSize: act.labelSize ?? nav.labelSize, fontWeight: act.labelWeight ?? nav.labelWeight }}
                                color={color ?? nav.labelColor}
                            >
                                {label}
                            </Text>
                        ) : (
                            <Icon
                                name={iconName!}
                                type={type}
                                size={act.iconSize ?? iconSize}
                                color={iconColor(color)}
                                style={act.iconStyle}
                            />
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