import React, { useEffect, useState } from 'react';
import { View, Text, TouchableWithoutFeedback, TouchableOpacity, StyleSheet, Dimensions, ViewStyle, DimensionValue, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useComponentNavigation } from '../../../navigation';
import { useFadeAnimation } from '../../../animation';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export type ModalParams = {
    title?: string; // 弹窗标题
    renderContent?: () => React.ReactNode; // 弹窗内容渲染函数
    direction?: 'left' | 'right' | 'top' | 'bottom' | 'fade' | 'none' | 'ios'; // 弹窗动画方向
    backgroundColor?: string; // 屏幕背景色（可透明）
    maskColor?: string;       // 遮罩色
    position?: 'center' | 'top' | 'bottom'; // 弹窗位置
    width?: DimensionValue; // 弹窗宽度
    height?: DimensionValue; // 弹窗高度
    closable?: boolean; // 是否显示关闭按钮
    maskClosable?: boolean; // 是否点击遮罩关闭弹窗
    cardBackgroundColor?: string; // 弹窗卡片背景色
    titleAlign?: 'left' | 'center' | 'right'; // 弹窗标题对齐方式
};

// 组件：Modal（在已有 useComponentNavigation 之后插入）
export const Modal: React.FC<any> = ({ route }) => {
    const params: ModalParams = route?.params || {};
    const {
        title,
        renderContent,
        backgroundColor = 'rgba(0,0,0,0)',
        maskColor = 'rgba(0,0,0,0.4)',
        position = 'center',
        width = '90%',
        height,
        closable = true,
        maskClosable = true,
        // 新增默认值
        cardBackgroundColor = '#fff',
        titleAlign = 'left',
    } = params;

    const insets = useSafeAreaInsets();
    const navigation = useComponentNavigation();

    const onClose = () => {
        navigation.goBack();
    };

    const getPositionStyle = (): ViewStyle => {
        switch (position) {
            case 'top':
                return {
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    paddingTop: insets.top + 16,
                };
            case 'bottom':
                return {
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    paddingBottom: insets.bottom + 16,
                };
            case 'center':
            default:
                return {
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingTop: insets.top,
                    paddingBottom: insets.bottom,
                };
        }
    };

    // 新增：遮罩可见状态与过渡事件监听
    const [maskVisible, setMaskVisible] = useState(false);
    const { fadeAnim, fadeIn } = useFadeAnimation(0);

    useEffect(() => {
        const unsubEnd = navigation.addListener('transitionEnd', () => {
            setMaskVisible(true);
            fadeIn(200).start();
        });
        const unsubStart = navigation.addListener('transitionStart', () => {
            setMaskVisible(false);
        });
        return () => {
            unsubEnd?.();
            unsubStart?.();
        };
    }, [navigation, fadeIn]);

    return (
        <View style={[styles.root, { backgroundColor }]}>
            {maskVisible && (
                <TouchableWithoutFeedback onPress={maskClosable ? onClose : undefined}>
                    <Animated.View style={[styles.mask, { backgroundColor: maskColor, opacity: fadeAnim }]} />
                </TouchableWithoutFeedback>
            )}

            <View style={[styles.container, getPositionStyle()]}>
                <View style={[
                    styles.card,
                    {
                        width,
                        ...(height !== undefined && height !== 'auto' ? { height } : {}),
                        maxWidth: SCREEN_WIDTH - 32,
                        // 使用可配置卡片背景色
                        backgroundColor: cardBackgroundColor,
                    },
                ]}>
                    {!!title && (
                        <View style={[
                            styles.header,
                            titleAlign === 'center' ? styles.headerCenter : undefined,
                        ]}>
                            {titleAlign === 'center' && closable && (
                                <TouchableOpacity onPress={onClose} style={styles.closeAbsolute}>
                                    <Text style={styles.close}>✕</Text>
                                </TouchableOpacity>
                            )}
                            <Text style={[
                                styles.title,
                                titleAlign === 'center' ? styles.titleCenter : undefined,
                                titleAlign === 'right' ? styles.titleRight : undefined,
                            ]}>{title}</Text>
                            {titleAlign !== 'center' && closable && (
                                <TouchableOpacity onPress={onClose}>
                                    <Text style={styles.close}>✕</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    )}

                    <View style={styles.content}>
                        {typeof renderContent === 'function' ? renderContent() : <Text style={styles.placeholder}>No Content</Text>}
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    root: { flex: 1 },
    mask: { ...StyleSheet.absoluteFillObject },
    container: { flex: 1 },
    card: { borderRadius: 12, overflow: 'hidden' }, // 移除固定白色，改为上方可配置项
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
