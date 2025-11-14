import React, { useEffect, useRef, useState } from 'react';
import { StatusBar, ViewStyle, StyleProp, Platform, KeyboardAvoidingView, Keyboard, View } from 'react-native';
import { Edge, useSafeAreaInsets } from 'react-native-safe-area-context';
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
    /** 启用键盘避让（默认 false）。开启后底部输入不再被键盘遮挡 */
    keyboardAvoiding?: boolean;
    /**
     * 键盘垂直偏移（可选）。
     * - 不传时自动使用：Header高度 + 顶部安全区（若 Header 开启 safeAreaTopEnabled）
     * - iOS 常用；Android 在 adjustResize 下可留空或传 'height' 行为
     */
    keyboardVerticalOffset?: number;
}


/** 
 * useAndroidKeyboardPadding
 * Android 专用键盘避让：通过底部 padding 把内容顶到键盘上方
 * - 在键盘显示期间只增不减，避免候选栏/ActionMode 导致的高度抖动
 * - 键盘隐藏时归零
 */
function useAndroidKeyboardPadding(enabled: boolean) {
    const [paddingBottom, setPaddingBottom] = useState(0);
    const maxWhileVisible = useRef(0);

    useEffect(() => {
        if (!enabled || Platform.OS !== 'android') return;

        const onShow = (e: any) => {
            const h = e?.endCoordinates?.height ?? 0;
            if (h > maxWhileVisible.current) {
                maxWhileVisible.current = h;
                setPaddingBottom(maxWhileVisible.current);
            }
        };
        // 某些输入法或状态栏变化可能重复上报显示事件；保持“只增不减”
        const onChange = (e: any) => {
            const h = e?.endCoordinates?.height ?? 0;
            if (h > maxWhileVisible.current) {
                maxWhileVisible.current = h;
                setPaddingBottom(maxWhileVisible.current);
            }
        };
        const onHide = () => {
            maxWhileVisible.current = 0;
            setPaddingBottom(0);
        };

        const s1 = Keyboard.addListener('keyboardDidShow', onShow);
        // 注意：部分 RN 版本在 Android 上不会触发 keyboardDidChangeFrame；这里做兼容
        const s2 = Keyboard.addListener('keyboardDidChangeFrame', onChange);
        const s3 = Keyboard.addListener('keyboardDidHide', onHide);

        return () => {
            s1.remove();
            s2.remove();
            s3.remove();
        };
    }, [enabled]);

    return paddingBottom;
}

// export const Page: React.FC<PageProps>
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
        statusBarBackgroundColor,
        // 梯度与测试ID来自公共能力（rawProps.gradientEnabled/...，rawProps.testID）
        leftDrawer,
        rightDrawer,
        dismissKeyboardOnTapOutside = false,
        keyboardAvoiding = false,
        keyboardVerticalOffset,
    } = rawProps;
    const { theme, isDark } = useTheme();
    const colors = theme.colors;
    const insets = useSafeAreaInsets();
    const finalTestID = buildTestID('Page', rawProps.testID);
    const gradientCfg = normalizeGradientConfig([colors.primary, colors.secondary], rawProps);

    // 渐变启用时使用透明状态栏
    const useTransparentStatusBar = !!gradientCfg.colors;

    const autoStatusBarStyle = statusBarStyle || (isDark ? 'light-content' : 'dark-content');
    const autoStatusBarBgColor = useTransparentStatusBar ? 'transparent' : (statusBarBackgroundColor || colors.background);
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
        <Header {...(headerActions ? { ...headerProps, actions: headerActions } : headerProps)} />
    ) : null;

    // 计算 Header 顶部安全区与高度，用于键盘偏移
    /** 计算：键盘避让的默认偏移 = Header内容高度 + 顶部安全区（若启用） */
    const headerHeight = theme.navigation?.height ?? 44;
    const headerTopInset = (headerProps?.safeAreaTopEnabled ?? true) ? insets.top : 0;
    const defaultKeyboardOffset = headerShown ? (headerHeight + headerTopInset) : 0;

    // Android：使用自定义 padding 避让（只增不减）；iOS：使用 KAV
    const androidKeyboardPadding = useAndroidKeyboardPadding(keyboardAvoiding);
    const keyboardHeight = useRef(0);
    const keyboardHeight_first = useRef(0);

    // console.log('androidKeyboardPadding', androidKeyboardPadding);
    // console.log('defaultKeyboardOffset', defaultKeyboardOffset);
    // console.log('keyboardHeight', keyboardHeight.current);
    // console.log('keyboardHeight_first', keyboardHeight_first.current);
    const content = (
        <SafeAreaView
            edges={safeAreaEdges}
            style={[{ backgroundColor: bgColor, flex: 1 }, style]}
            testID={finalTestID}
        >
            <StatusBar
                barStyle={autoStatusBarStyle}
                backgroundColor={autoStatusBarBgColor}
                translucent={useTransparentStatusBar}
            />

            {headerNode}

            {/* 键盘避让：iOS 使用 KAV；Android 使用底部 padding（稳定不缩） */}
            <KeyboardAvoidingView
                onLayout={(e) => {
                    const { height } = e.nativeEvent.layout;
                    // console.log('height', height)
                    if (keyboardHeight_first.current === 0) {
                        keyboardHeight_first.current = height;
                    } else if (keyboardHeight.current === 0) {
                        keyboardHeight.current = height - keyboardHeight_first.current;
                    }

                }}
                enabled={keyboardAvoiding}
                behavior={Platform.OS === 'ios' ? 'padding' : androidKeyboardPadding ? 'padding' : 'height'}
                keyboardVerticalOffset={androidKeyboardPadding ? keyboardHeight.current : 0}
                style={{ flex: 1 }}>
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
            </KeyboardAvoidingView>
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

