import React, { useEffect, useState } from 'react';
import { View, Text, TouchableWithoutFeedback, TouchableOpacity, StyleSheet, Dimensions, ViewStyle, DimensionValue, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useComponentNavigation } from '../../../navigation';
import { useFadeAnimation } from '../../../animation';
import { StackActions } from '@react-navigation/native';
import Icon from '../../ui/Icon';

// 路由参数：移除 renderContent（避免将函数作为非序列化值放入导航状态）
export type ModalParams = {
    title?: string;
    direction?: 'left' | 'right' | 'top' | 'bottom' | 'fade' | 'none' | 'ios';
    backgroundColor?: string;
    maskColor?: string;
    position?: 'center' | 'top' | 'bottom';
    width?: DimensionValue;
    height?: DimensionValue;
    closable?: boolean;
    maskClosable?: boolean;
    cardBackgroundColor?: string;
    titleAlign?: 'left' | 'center' | 'right';
    headerShown?: boolean;
};

// 标签组件的 Props（用于注册内容与样式）
export type ModalTagProps = ModalParams & {
    id: string;
    children?: React.ReactNode;
};

// 屏幕组件：用于渲染内容
export const ModalScreen: React.FC<any> = ({ route }) => {
    const insets = useSafeAreaInsets();
    const navigation = useComponentNavigation();

    const {
        title,
        backgroundColor = 'rgba(0,0,0,0)',
        maskColor = 'rgba(0,0,0,0.4)',
        position = 'center',
        width = '90%',
        height,
        closable = true,
        maskClosable = true,
        cardBackgroundColor = '#fff',
        titleAlign = 'left',
        direction = 'none',
        headerShown = true,
        children,
    } = route?.params || {};

    const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

    const onClose = () => {
        console.log('onClose');
        navigation.dispatch(StackActions.pop(1));
    };

    const getPositionStyle = (): ViewStyle => {
        switch (position) {
            case 'top':
                return { justifyContent: 'flex-start', alignItems: 'center', paddingTop: insets.top + 16 };
            case 'bottom':
                return { justifyContent: 'flex-end', alignItems: 'center', paddingBottom: insets.bottom + 16 };
            case 'center':
            default:
                return { justifyContent: 'center', alignItems: 'center', paddingTop: insets.top, paddingBottom: insets.bottom };
        }
    };

    const [maskVisible] = useState(true);
    const { fadeAnim, fadeIn } = useFadeAnimation(0);
    useEffect(() => {
        fadeIn(200).start();
    }, [fadeIn]);

    const initialTranslateX = direction === 'left' ? -SCREEN_WIDTH : direction === 'right' ? SCREEN_WIDTH : 0;
    const initialTranslateY = direction === 'top' ? -SCREEN_HEIGHT : direction === 'bottom' || direction === 'ios' ? SCREEN_HEIGHT : 0;
    const cardTranslateX = React.useRef(new Animated.Value(initialTranslateX)).current;
    const cardTranslateY = React.useRef(new Animated.Value(initialTranslateY)).current;
    const cardOpacity = React.useRef(new Animated.Value(direction === 'fade' ? 0 : 1)).current;

    useEffect(() => {
        const anims: Animated.CompositeAnimation[] = [];
        if (direction === 'fade') {
            anims.push(Animated.timing(cardOpacity, { toValue: 1, duration: 200, useNativeDriver: true }));
        }
        if (initialTranslateX !== 0) {
            anims.push(Animated.timing(cardTranslateX, { toValue: 0, duration: 250, useNativeDriver: true }));
        }
        if (initialTranslateY !== 0) {
            anims.push(Animated.timing(cardTranslateY, { toValue: 0, duration: 250, useNativeDriver: true }));
        }
        if (anims.length) {
            Animated.parallel(anims).start();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <View style={[styles.root, { backgroundColor }]}>
            {maskVisible && (
                <TouchableWithoutFeedback onPress={() => { maskClosable ? onClose() : undefined; }}>
                    <Animated.View style={[styles.mask, { backgroundColor: maskColor, opacity: fadeAnim }]} />
                </TouchableWithoutFeedback>
            )}

            <View style={[styles.container, getPositionStyle()]}>
                <Animated.View
                    style={[
                        styles.card,
                        {
                            width,
                            ...(height !== undefined && height !== 'auto' ? { height } : {}),
                            maxWidth: SCREEN_WIDTH - 32,
                            backgroundColor: cardBackgroundColor,
                        },
                        { transform: [{ translateX: cardTranslateX }, { translateY: cardTranslateY }], opacity: cardOpacity },
                    ]}
                >
                    {headerShown && !!title && (
                        <View style={[styles.header, titleAlign === 'center' ? styles.headerCenter : undefined]}>
                            {titleAlign === 'center' && closable && (
                                <TouchableOpacity onPress={onClose} style={styles.closeAbsolute}>
                                    <Icon name="close" size={24} />
                                </TouchableOpacity>
                            )}
                            <Text
                                style={[
                                    styles.title,
                                    titleAlign === 'center' ? styles.titleCenter : undefined,
                                    titleAlign === 'right' ? styles.titleRight : undefined,
                                ]}
                            >
                                {title}
                            </Text>
                            {titleAlign !== 'center' && closable && (
                                <TouchableOpacity onPress={onClose}>
                                    <Text style={styles.close}>✕</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    )}

                    <View style={styles.content}>
                        {children ?? <Text style={styles.placeholder}>No Content</Text>}
                    </View>
                </Animated.View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    root: { flex: 1 },
    mask: { ...StyleSheet.absoluteFillObject },
    container: { flex: 1 },
    card: { borderRadius: 12, overflow: 'hidden' },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#e5e5ea', position: 'relative' },
    headerCenter: { justifyContent: 'center' },
    title: { fontSize: 16, fontWeight: '600' },
    titleCenter: { textAlign: 'center', flex: 1 },
    titleRight: { textAlign: 'right', flex: 1 },
    close: { fontSize: 18 },
    closeAbsolute: { position: 'absolute', right: 16 },
    content: { padding: 16 },
    placeholder: { color: '#8e8e93' },
});
