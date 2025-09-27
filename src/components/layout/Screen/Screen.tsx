import React from 'react';
import { ViewStyle, StyleProp, StatusBar } from 'react-native';
import { SafeAreaView } from '../SafeAreaView/SafeAreaView';
import { Container } from '../Container/Container';
import { useTheme } from '../../../theme—old';
import { Edge } from 'react-native-safe-area-context';

export interface ScreenProps {
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
    contentStyle?: StyleProp<ViewStyle>;
    backgroundColor?: string;
    statusBarStyle?: 'light-content' | 'dark-content' | 'default';
    statusBarBackgroundColor?: string;
    safeAreaEdges?: Edge[];
    scrollable?: boolean;
    padding?: number | { top?: number; bottom?: number; left?: number; right?: number };
    preset?: 'default' | 'scroll' | 'fixed';
    testID?: string;
}

export const Screen: React.FC<ScreenProps> = ({
    children,
    style,
    contentStyle,
    backgroundColor,
    statusBarStyle,
    statusBarBackgroundColor,
    safeAreaEdges = ['top', 'bottom', 'left', 'right'],
    scrollable,
    padding = 16,
    preset = 'default',
    testID,
}) => {
    const { theme, colors } = useTheme();

    // 根据主题自动设置状态栏样式
    const autoStatusBarStyle = statusBarStyle || (theme.mode === 'dark' ? 'light-content' : 'dark-content');
    const autoStatusBarBgColor = statusBarBackgroundColor || colors.background;

    // 根据预设调整默认行为
    const isScrollable = scrollable !== undefined ? scrollable : preset === 'scroll';

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
            <Container
                flex={1}
                padding={padding}
                scrollable={isScrollable}
                style={contentStyle}
            >
                {children}
            </Container>
        </SafeAreaView>
    );
};