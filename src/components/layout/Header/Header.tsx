// 顶部 import 区域（加入 TextStyle）
import React, { useMemo } from 'react';
import { View, Pressable, ViewStyle, TextStyle } from 'react-native';
import { useTheme, useSpacingStyle } from '../../../theme';
import { Navigation, useComponentNav } from '../../../navigation';
import { useSafeAreaInsets } from '../SafeAreaView';
import { Icon } from '../../ui/Icon';
import Text from '../../ui/Text/Text';

import { SpacingProps } from '../../../theme';
import { TestableProps, buildTestID } from '../../common/test';
import { ShadowProps, buildShadowStyle } from '../../common/shadow';
import { GradientBackground } from '../GradientBackground/GradientBackground';

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

export interface HeaderProps extends TestableProps, ShadowProps, SpacingProps {
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
export const Header: React.FC<HeaderProps> = (rawProps) => {
    const {
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
        // 新增：默认不显示阴影
        shadowSize = 'none',
        shadowColor,
        shadowOpacity,
        shadowRadius,
        shadowOffset,
    } = rawProps;

    const { theme, styles } = useTheme();
    const insets = useSafeAreaInsets();
    const finalTestID = buildTestID('Header', rawProps.testID); // 构建测试ID
    const componentNav = useComponentNav(); // 组件级导航（即时）

    // 主题导航配置（避免与 navAgent 冲突）
    const navTheme = theme.navigation;
    const contentHeight = height ?? navTheme.height;
    const containerBg = transparent ? 'transparent' : (backgroundColor ?? navTheme.backgroundColor);
    const titleColorFinal = titleColor ?? navTheme.titleColor;
    const iconColor = (c?: string) => c ?? navTheme.iconColor;
    const iconSize = navTheme.iconSize;

    // 间距/阴影公共能力
    const spacingStyle = useSpacingStyle(rawProps);
    const shadowStyle = buildShadowStyle(styles.shadow, {
        shadowSize,
        shadowColor,
        shadowOpacity,
        shadowRadius,
        shadowOffset,
    });

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
        borderBottomColor: borderBottom ? navTheme.borderColor : 'transparent',
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
        ...styles.spacing.prXs,
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

    const titleTextStyle: TextStyle = {
        ...(styles.spacing.pxMd as ViewStyle),
    };

    // 函数：renderBackSlot（统一高度为 contentHeight，避免底部裁切）
    const renderBackSlot = () => {
        const canGoBackNow = componentNav.canGoBack() || Navigation.canGoBack();
        const showBack = backVisible ?? canGoBackNow; // 可返回时默认显示
        const handleBack = onBack ?? (() => {
            if (componentNav.canGoBack()) {
                componentNav.goBack();
            } else {
                Navigation.goBack();
            }
        });

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

    const renderActionSlots = () => {
        const slots: React.ReactNode[] = [];
        const actionsCount = actionsLimited.length;

        // 填充空槽位，使实际动作靠右显示
        for (let i = 0; i < MAX_ACTIONS - actionsCount; i++) {
            slots.push(<View key={`action-empty-${i}`} style={{ width: SLOT_SIZE, height: contentHeight }} />);
        }

        // 渲染动作槽位
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
                                style={{ fontSize: act.labelSize ?? navTheme.labelSize, fontWeight: act.labelWeight ?? navTheme.labelWeight }}
                                color={color ?? navTheme.labelColor}
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
        <View style={[outerContainerStyle, shadowStyle, spacingStyle]} testID={finalTestID}>
            {gradientEnabled && (
                // 避免遮挡触摸：渐变包一层 pointerEvents="none"
                <View pointerEvents="none" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
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
                        style={{ flex: 1 }}
                    />
                </View>
            )}
            <View style={contentWrapperStyle}>
                <View style={contentRowStyle}>
                    {/* 左侧返回槽位（固定宽度） */}
                    <View style={leftContainerStyle}>{renderBackSlot()}</View>
                    {/* 中间标题（居中、单行省略） */}
                    <View style={titleContainerStyle}>
                        {typeof title === 'string' ? (
                            <Text
                                style={[titleTextStyle, { fontSize: navTheme.titleSize, fontWeight: navTheme.titleWeight }]}
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