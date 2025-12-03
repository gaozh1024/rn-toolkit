import React from 'react';
import { StatusBar, ViewStyle, StyleProp, View, Platform } from 'react-native';
import { Edge, useSafeAreaInsets } from 'react-native-safe-area-context';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { SafeAreaView } from '../SafeAreaView/SafeAreaView';
import { Container } from '../Container/Container';
import { Header } from '../Header';
import { useTheme } from '../../../theme/hooks';
import type { HeaderAction, HeaderProps } from '../Header/Header';
import { GradientBackground } from '../GradientBackground/GradientBackground';
import DrawerLayout from '../../../navigation/components/DrawerLayout';
import { DrawerConfig } from '../../../navigation/types';

import { TestableProps, buildTestID } from '../../common/test';
import { GradientProps, normalizeGradientConfig } from '../../common/gradient';

// export interface PageProps
export interface PageProps extends TestableProps, GradientProps {
    children: React.ReactNode;

    // Header控制
    headerShown?: boolean;              // 默认显示 Header
    headerProps?: HeaderProps;          // 传入 Header 的配置（title、actions、onBack 等）
    headerActions?: HeaderAction[];     // 新增：直接在 Page 上设置右侧动作（图标/文本）

    // 布局与外观
    style?: StyleProp<ViewStyle>;
    contentStyle?: StyleProp<ViewStyle>;
    backgroundColor?: string;

    // Scroll与内边距
    scrollable?: boolean;               // 是否启用滚动内容
    padding?: number;

    // 安全区（避免顶部重复安全区，由 Header 自身处理顶部）
    safeAreaEdges?: Edge[];             // 默认 ['bottom', 'left', 'right']

    // 状态栏（可选）
    statusBarStyle?: 'light-content' | 'dark-content' | 'default';
    statusBarBackgroundColor?: string;

    // 可选：页面级左右抽屉
    leftDrawer?: DrawerConfig;
    rightDrawer?: DrawerConfig;
    // 新增：点击空白处收起键盘
    dismissKeyboardOnTapOutside?: boolean;
    // 新增：键盘避让（默认 false）。开启后底部输入不再被键盘遮挡
    keyboardAvoiding?: boolean;
}

// export const Page: React.FC<PageProps>
/**
 * 函数注释：Page（键盘避让布局）
 * - Header 固定在避让视图之外，避免随内容上移。
 * - 两端统一使用 keyboard-controller 的 KeyboardAvoidingView（translate-with-padding）。
 */
export const Page: React.FC<PageProps> = (rawProps) => {
    const {
        children,
        headerShown = true,
        headerProps,
        headerActions,
        style,
        contentStyle,
        backgroundColor,
        scrollable = false,
        padding = 0,
        safeAreaEdges = ['bottom', 'left', 'right'],
        statusBarStyle,
        statusBarBackgroundColor,// 新增：自定义状态栏背景颜色
        // 梯度与测试ID来自公共能力（rawProps.gradientEnabled/...，rawProps.testID）
        leftDrawer,
        rightDrawer,
        dismissKeyboardOnTapOutside = false,
        keyboardAvoiding = false,
    } = rawProps;
    const { theme, isDark } = useTheme();
    const insets = useSafeAreaInsets();
    const colors = theme.colors;
    const finalTestID = buildTestID('Page', rawProps.testID);
    const gradientCfg = normalizeGradientConfig([colors.primary, colors.secondary], rawProps);

    // 渐变启用时使用透明状态栏
    const useTransparentStatusBar = !!gradientCfg.colors;

    const autoStatusBarStyle = statusBarStyle || (isDark ? 'light-content' : 'dark-content');
    
    // 是否需要渲染自定义状态栏背景（当颜色不是透明时）
    // 修正：只有当用户显式设置了 statusBarBackgroundColor 时，才渲染自定义 View
    // 这样默认情况下（未设置时），状态栏颜色由 Header 背景色决定（通过透明状态栏透出 Header）
    const shouldRenderStatusBarBg = !!statusBarBackgroundColor && statusBarBackgroundColor !== 'transparent';

    // 如果我们自己渲染状态栏背景，Header 就不应该处理顶部安全区
    const headerSafeAreaTop = !shouldRenderStatusBarBg;

    const bgColor = useTransparentStatusBar ? 'transparent' : (backgroundColor || colors.background);

    const wrapWithDrawer = (node: React.ReactNode) => {
        if (leftDrawer || rightDrawer) {
            return (
                <DrawerLayout leftDrawer={leftDrawer} rightDrawer={rightDrawer}>
                    {node}
                </DrawerLayout>
            );
        }
        return node;
    };

    const headerNode = headerShown ? (
        <Header 
            {...(headerActions ? { ...headerProps, actions: headerActions } : headerProps)} 
            safeAreaTopEnabled={headerSafeAreaTop}
        />
    ) : null;

    const content = (
        <SafeAreaView
            edges={safeAreaEdges}
            backgroundColor={bgColor}
            style={[style]}
            testID={finalTestID}
        >
            {/* 
                状态栏配置：
                - translucent: 始终为 true，实现沉浸式布局，由我们自己控制背景 View 或 Header padding。
                - backgroundColor: 设为 transparent，因为我们用 View 或 Header 来填充颜色。
            */}
            <StatusBar
                barStyle={autoStatusBarStyle}
                backgroundColor="transparent"
                translucent={true}
            />

            {headerNode}

            {
                keyboardAvoiding ? <KeyboardAvoidingView
                    enabled={keyboardAvoiding}
                    behavior={'padding'}
                    style={{ flex: 1 }}
                    pointerEvents={'box-none'}
                >
                    <Container
                        flex={1}
                        p={padding}
                        scrollable={scrollable}
                        style={contentStyle}
                        backgroundColor={bgColor}
                        dismissKeyboardOnTapOutside={dismissKeyboardOnTapOutside}
                    >
                        {children}
                    </Container>
                </KeyboardAvoidingView> :
                    <Container
                        flex={1}
                        p={padding}
                        scrollable={scrollable}
                        style={contentStyle}
                        backgroundColor={bgColor}
                        dismissKeyboardOnTapOutside={dismissKeyboardOnTapOutside}
                    >
                        {children}
                    </Container>
            }
        </SafeAreaView>
    );

    const wrapped = gradientCfg.colors ? (
        <GradientBackground
            variant={gradientCfg.variant}
            colors={gradientCfg.colors}
            locations={gradientCfg.locations}
            angle={gradientCfg.angle}
            start={gradientCfg.start}
            end={gradientCfg.end}
            center={gradientCfg.center}
            radius={gradientCfg.radius}
            opacity={gradientCfg.opacity}
            style={{ flex: 1 }}
        >
            {content}
        </GradientBackground>
    ) : content;

    return wrapWithDrawer(wrapped);
};

export default Page;

