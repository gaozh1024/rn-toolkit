import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Animated,
    Dimensions,
    TouchableOpacity,
    TouchableWithoutFeedback,
    BackHandler,
    StatusBar,
    Platform,
    ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../../theme';


const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export interface ModalProps {
    // 基础属性
    visible: boolean;
    onClose?: () => void;
    onShow?: () => void;
    onHide?: () => void;

    // 内容属性
    title?: string;
    children?: React.ReactNode;

    // 样式属性
    animationType?: 'slide' | 'fade' | 'none';
    presentationStyle?: 'fullScreen' | 'pageSheet' | 'formSheet' | 'overFullScreen';
    transparent?: boolean;

    // 交互属性
    closable?: boolean;
    maskClosable?: boolean;
    hardwareBackPress?: boolean;

    // 布局属性
    width?: number | string;
    height?: number | string;
    position?: 'center' | 'top' | 'bottom';

    // 主题属性
    backgroundColor?: string;
    maskColor?: string;
}

export const Modal: React.FC<ModalProps> = ({
    visible,
    onClose,
    onShow,
    onHide,
    title,
    children,
    animationType = 'fade',
    presentationStyle = 'overFullScreen',
    transparent = true,
    closable = true,
    maskClosable = true,
    hardwareBackPress = true,
    width = '90%',
    height = 'auto',
    position = 'center',
    backgroundColor,
    maskColor,
}) => {
    const { theme, colors } = useTheme();
    const insets = useSafeAreaInsets();
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
    const scaleAnim = useRef(new Animated.Value(0.8)).current;

    // 处理Android返回键
    useEffect(() => {
        if (!visible || !hardwareBackPress) return;

        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            if (onClose) {
                onClose();
                return true;
            }
            return false;
        });

        return () => backHandler.remove();
    }, [visible, hardwareBackPress, onClose]);

    // 显示动画
    useEffect(() => {
        if (visible) {
            onShow?.();

            if (animationType === 'fade') {
                Animated.parallel([
                    Animated.timing(fadeAnim, {
                        toValue: 1,
                        duration: 300,
                        useNativeDriver: true,
                    }),
                    Animated.spring(scaleAnim, {
                        toValue: 1,
                        tension: 100,
                        friction: 8,
                        useNativeDriver: true,
                    }),
                ]).start();
            } else if (animationType === 'slide') {
                Animated.parallel([
                    Animated.timing(fadeAnim, {
                        toValue: 1,
                        duration: 300,
                        useNativeDriver: true,
                    }),
                    Animated.spring(slideAnim, {
                        toValue: 0,
                        tension: 100,
                        friction: 8,
                        useNativeDriver: true,
                    }),
                ]).start();
            }
        } else {
            const animations = [];

            if (animationType === 'fade') {
                animations.push(
                    Animated.timing(fadeAnim, {
                        toValue: 0,
                        duration: 200,
                        useNativeDriver: true,
                    }),
                    Animated.timing(scaleAnim, {
                        toValue: 0.8,
                        duration: 200,
                        useNativeDriver: true,
                    })
                );
            } else if (animationType === 'slide') {
                animations.push(
                    Animated.timing(fadeAnim, {
                        toValue: 0,
                        duration: 200,
                        useNativeDriver: true,
                    }),
                    Animated.timing(slideAnim, {
                        toValue: SCREEN_HEIGHT,
                        duration: 200,
                        useNativeDriver: true,
                    })
                );
            }

            if (animations.length > 0) {
                Animated.parallel(animations).start(() => {
                    onHide?.();
                });
            } else {
                onHide?.();
            }
        }
    }, [visible, animationType, fadeAnim, slideAnim, scaleAnim, onShow, onHide]);

    // 处理遮罩点击
    const handleMaskPress = () => {
        if (maskClosable && onClose) {
            onClose();
        }
    };

    // 处理关闭按钮点击
    const handleClosePress = () => {
        if (onClose) {
            onClose();
        }
    };

    if (!visible) {
        return null;
    }

    // 计算容器样式
    const getContainerStyle = () => {
        const baseStyle: any = {
            backgroundColor: backgroundColor || colors.surface,
            borderRadius: theme.borderRadius?.md || 12,
            maxHeight: SCREEN_HEIGHT * 0.9,
        };

        if (typeof width === 'number') {
            baseStyle.width = width;
        } else if (typeof width === 'string') {
            if (width.includes('%')) {
                baseStyle.width = SCREEN_WIDTH * (parseInt(width) / 100);
            } else {
                baseStyle.width = parseInt(width);
            }
        }

        if (height !== 'auto') {
            if (typeof height === 'number') {
                baseStyle.height = height;
            } else if (typeof height === 'string') {
                if (height.includes('%')) {
                    baseStyle.height = SCREEN_HEIGHT * (parseInt(height) / 100);
                } else {
                    baseStyle.height = parseInt(height);
                }
            }
        }

        return baseStyle;
    };

    // 计算位置样式
    const getPositionStyle = (): ViewStyle => {
        switch (position) {
            case 'top':
                return {
                    justifyContent: 'flex-start' as const,
                    paddingTop: insets.top + 20
                };
            case 'bottom':
                return {
                    justifyContent: 'flex-end' as const,
                    paddingBottom: insets.bottom + 20
                };
            default:
                return {
                    justifyContent: 'center' as const
                };
        }
    };

    // 计算动画变换
    const getAnimatedTransform = () => {
        if (animationType === 'slide') {
            return [{ translateY: slideAnim }];
        } else if (animationType === 'fade') {
            return [{ scale: scaleAnim }];
        }
        return [];
    };

    const styles = createStyles(theme, maskColor);

    return (
        <View style={styles.overlay}>
            <StatusBar
                backgroundColor="rgba(0,0,0,0.5)"
                barStyle={theme.mode === 'dark' ? 'light-content' : 'dark-content'}
                translucent
            />

            <TouchableWithoutFeedback onPress={handleMaskPress}>
                <Animated.View style={[styles.mask, { opacity: fadeAnim }]} />
            </TouchableWithoutFeedback>

            <View style={[styles.container, getPositionStyle()]} pointerEvents="box-none">
                <Animated.View
                    style={[
                        styles.modal,
                        getContainerStyle(),
                        {
                            opacity: fadeAnim,
                            transform: getAnimatedTransform(),
                        },
                    ]}
                >
                    {/* 头部 */}
                    {(title || closable) && (
                        <View style={styles.header}>
                            {title && (
                                <Text style={[styles.title, { color: colors.surface }]}>
                                    {title}
                                </Text>
                            )}
                            {closable && (
                                <TouchableOpacity
                                    style={styles.closeButton}
                                    onPress={handleClosePress}
                                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                >
                                    <Text style={[styles.closeText, { color: colors.surface }]}>
                                        ✕
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    )}

                    {/* 内容 */}
                    <View style={styles.content}>
                        {children}
                    </View>
                </Animated.View>
            </View>
        </View>
    );
};

const createStyles = (colors: any, maskColor?: string) =>
    StyleSheet.create({
        overlay: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1000,
        },
        mask: {
            ...StyleSheet.absoluteFillObject,
            backgroundColor: maskColor || 'rgba(0, 0, 0, 0.5)',
        },
        container: {
            flex: 1,
            alignItems: 'center',
            paddingHorizontal: 20,
        },
        modal: {
            shadowColor: colors.shadow || '#000',
            shadowOffset: {
                width: 0,
                height: 4,
            },
            shadowOpacity: 0.25,
            shadowRadius: 12,
            elevation: 8,
        },
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 20,
            paddingVertical: 16,
            borderBottomWidth: StyleSheet.hairlineWidth,
            borderBottomColor: colors.border,
        },
        title: {
            fontSize: 18,
            fontWeight: '600',
            flex: 1,
        },
        closeButton: {
            width: 32,
            height: 32,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 16,
            backgroundColor: colors.background,
        },
        closeText: {
            fontSize: 16,
            fontWeight: '500',
        },
        content: {
            padding: 20,
        },
    });