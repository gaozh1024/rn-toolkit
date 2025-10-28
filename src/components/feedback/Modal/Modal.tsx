import React, { useEffect, useState } from 'react';
import { View, Text, TouchableWithoutFeedback, TouchableOpacity, StyleSheet, Dimensions, ViewStyle, DimensionValue, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useComponentNavigation } from '../../../navigation';
import { useFadeAnimation } from '../../../animation';
import { StackActions } from '@react-navigation/native';
import Icon from '../../ui/Icon';
import { Row } from '../../layout';
import { IconButton } from '../../ui';

// 路由参数：移除 renderContent（避免将函数作为非序列化值放入导航状态）
export type ModalParams = {
    title?: string;// 标题
    direction?: 'left' | 'right' | 'top' | 'bottom' | 'fade' | 'none' | 'ios';// 弹出方向
    backgroundColor?: string;// 背景颜色
    maskColor?: string;// 蒙层颜色
    position?: 'center' | 'top' | 'bottom';// 弹出位置
    width?: DimensionValue;// 宽度
    height?: DimensionValue;// 高度
    closable?: boolean;// 是否显示关闭按钮
    maskClosable?: boolean;// 是否点击蒙层关闭
    cardBackgroundColor?: string;// 卡片背景颜色
    titleAlign?: 'left' | 'center' | 'right';// 标题对齐方式
    headerShown?: boolean;// 是否显示标题栏
    useSafeAreaInsets?: boolean; // 是否应用安全区内边距（默认 true）
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
        useSafeAreaInsets: useInsets = true, // 新增：默认启用安全区
        children,
    } = route?.params || {};

    const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

    const onClose = () => {
        console.log('onClose');
        navigation.dispatch(StackActions.pop(1));
    };

    const getPositionStyle = (): ViewStyle => {
        const pt = useInsets ? insets.top : 0;
        const pb = useInsets ? insets.bottom : 0;

        switch (position) {
            case 'top':
                return { justifyContent: 'flex-start', alignItems: 'stretch', paddingTop: pt };
            case 'bottom':
                return { justifyContent: 'flex-end', alignItems: 'stretch', paddingBottom: pb };
            case 'center':
            default:
                return { justifyContent: 'center', alignItems: 'center', paddingTop: pt, paddingBottom: pb };
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
                            backgroundColor: cardBackgroundColor,
                        },
                        // 居中时保留 16px 边距；顶部/底部 或 明确 100% 宽度时不限制最大宽度
                        (() => {
                            const isFullWidth = width === '100%' || (typeof width === 'number' && width >= SCREEN_WIDTH);
                            return (!isFullWidth && position === 'center') ? { maxWidth: SCREEN_WIDTH - 32 } : {};
                        })(),
                        { transform: [{ translateX: cardTranslateX }, { translateY: cardTranslateY }], opacity: cardOpacity },
                    ]}
                >
                    {
                        headerShown && !!title && (
                            <Row justify={'space-between'} align={'center'} ph={5} style={styles.header} >
                                {
                                    (titleAlign === 'right' && closable) ?
                                        <IconButton name="close" size={24} onPress={onClose} /> :
                                        <View style={{ width: 40, height: 40 }} />
                                }
                                <Text
                                    style={[
                                        styles.title,
                                        titleAlign === 'center' ? styles.titleCenter : undefined,
                                        titleAlign === 'right' ? styles.titleRight : undefined,
                                        titleAlign === 'left' ? styles.titleLeft : undefined,
                                    ]}
                                >
                                    {title}
                                </Text>
                                {
                                    (titleAlign !== 'right' && closable) ?
                                        <IconButton name="close" size={24} onPress={onClose} /> :
                                        <View style={{ width: 40, height: 40 }} />
                                }
                            </Row>
                        )
                    }
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
    header: { borderBottomWidth: 1, borderBottomColor: '#e5e5e5' },
    title: { fontSize: 15, fontWeight: '600', lineHeight: 50 },
    titleCenter: { textAlign: 'center', flex: 1 },
    titleRight: { textAlign: 'right', flex: 1, paddingRight: 16 },
    titleLeft: { textAlign: 'left', flex: 1, paddingLeft: 16 },
    content: { padding: 16 },
    placeholder: { color: '#8e8e93' },
});
