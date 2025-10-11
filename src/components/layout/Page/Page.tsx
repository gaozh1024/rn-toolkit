import React from 'react';
import { StatusBar, ViewStyle, StyleProp } from 'react-native';
import { SafeAreaView } from '../SafeAreaView/SafeAreaView';
import { Container } from '../Container/Container';
import { Header } from '../Header';
import { useTheme } from '../../../theme/hooks';
import { Edge } from 'react-native-safe-area-context';
import type { HeaderProps } from '../Header/Header';
import { GradientBackground } from '../GradientBackground/GradientBackground';

export interface PageProps {
    children: React.ReactNode;

    // Header控制
    headerShown?: boolean;              // 默认显示 Header
    headerProps?: HeaderProps;          // 传入 Header 的配置（title、actions、onBack 等）

    // 布局与外观
    style?: StyleProp<ViewStyle>;
    contentStyle?: StyleProp<ViewStyle>;
    backgroundColor?: string;

    // Scroll与内边距
    scrollable?: boolean;               // 是否启用滚动内容
    padding?: number | { top?: number; bottom?: number; left?: number; right?: number };

    // 安全区（避免顶部重复安全区，由 Header 自身处理顶部）
    safeAreaEdges?: Edge[];             // 默认 ['bottom', 'left', 'right']

    // 状态栏（可选）
    statusBarStyle?: 'light-content' | 'dark-content' | 'default';
    statusBarBackgroundColor?: string;

    testID?: string;
    // 渐变背景（可选）
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

export const Page: React.FC<PageProps> = ({
    children,
    headerShown = true,
    headerProps,
    style,
    contentStyle,
    backgroundColor,
    scrollable = false,
    padding = 0,
    safeAreaEdges = ['bottom', 'left', 'right'],
    statusBarStyle,
    statusBarBackgroundColor,
    testID,
    // 新增：渐变背景相关
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
    const { theme, isDark } = useTheme();
    const colors = theme.colors;
    const autoStatusBarStyle = statusBarStyle || (isDark ? 'light-content' : 'dark-content');
    const autoStatusBarBgColor = gradientEnabled ? 'transparent' : (statusBarBackgroundColor || colors.background);

    // 开启渐变时让内容容器透明，避免盖住渐变
    const bgColor = gradientEnabled ? 'transparent' : (backgroundColor || colors.background);

    const gradientPalette = (gradientColors && gradientColors.length > 0)
        ? gradientColors
        : [colors.primary, colors.secondary];

    // 普通背景（不启用渐变）
    if (!gradientEnabled) {
        return (
            <SafeAreaView
                edges={safeAreaEdges}
                style={[{ backgroundColor: bgColor }, style]}
                testID={testID}
            >
                <StatusBar
                    barStyle={autoStatusBarStyle}
                    backgroundColor={autoStatusBarBgColor}
                    translucent={false}
                />

                {headerShown && <Header {...headerProps} />}

                <Container
                    flex={1}
                    padding={padding}
                    scrollable={scrollable}
                    style={contentStyle}
                    backgroundColor={bgColor}
                >
                    {children}
                </Container>
            </SafeAreaView>
        );
    }

    // 开启渐变：在 SafeAreaView 外层包裹全屏渐变背景
    return (
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
        >
            <SafeAreaView
                edges={safeAreaEdges}
                style={[{ backgroundColor: bgColor }, style]}
                testID={testID}
            >
                <StatusBar
                    barStyle={autoStatusBarStyle}
                    backgroundColor={autoStatusBarBgColor}
                    translucent={false}
                />

                {headerShown && <Header {...headerProps} />}

                <Container
                    flex={1}
                    padding={padding}
                    scrollable={scrollable}
                    style={contentStyle}
                    backgroundColor={bgColor}
                >
                    {children}
                </Container>
            </SafeAreaView>
        </GradientBackground>
    );
};

export default Page;