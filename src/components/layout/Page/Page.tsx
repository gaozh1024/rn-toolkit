import React from 'react';
import { StatusBar, ViewStyle, StyleProp } from 'react-native';
import { SafeAreaView } from '../SafeAreaView/SafeAreaView';
import { Container } from '../Container/Container';
import { Header } from '../Header';
import { useTheme } from '../../../theme/hooks';
import { Edge } from 'react-native-safe-area-context';
import type { HeaderProps } from '../Header/Header';

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
}) => {
    const { theme, isDark } = useTheme();
    const colors = theme.colors;
    const autoStatusBarStyle = statusBarStyle || (isDark ? 'light-content' : 'dark-content');
    const autoStatusBarBgColor = statusBarBackgroundColor || colors.background;

    // SafeAreaView background applied from theme colors.background or provided backgroundColor
    return (
        <SafeAreaView
            edges={safeAreaEdges}
            style={[{ backgroundColor: backgroundColor || colors.background }, style]}
            testID={testID}
        >
            <StatusBar
                barStyle={autoStatusBarStyle}
                backgroundColor={autoStatusBarBgColor}
                translucent={false}
            />

            {/* 顶部公共Header（默认显示） */}
            {headerShown && <Header {...headerProps} />}

            {/* 页面主体内容（可滚动/非滚动） */}
            <Container
                flex={1}
                padding={padding}
                scrollable={scrollable}
                style={contentStyle}
                backgroundColor={backgroundColor || colors.background}
            >
                {children}
            </Container>
        </SafeAreaView>
    );
};

export default Page;