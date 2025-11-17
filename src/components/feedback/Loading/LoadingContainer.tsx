import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Animated, TouchableWithoutFeedback, StyleSheet } from 'react-native';
import { LoadingService, LoadingState } from './LoadingService';
import { useTheme } from '../../../theme/hooks';
import { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { Text } from '../../ui';

/**
 * 函数注释：Loading 容器
 * - 使用 UI.Text 替代 RN.Text，解决部分机型上原生 Text 渲染与交互异常问题。
 * - 保持原有样式与行为一致，仅替换文本组件来源，提升兼容性与主题一致性。
 */
export const LoadingContainer: React.FC = () => {
    const { theme } = useTheme?.() ?? { theme: { colors: { background: '#FFFFFF', text: '#333333' } } };
    const colors = theme?.colors ?? { background: '#FFFFFF', text: '#333333' };

    const [state, setState] = useState<LoadingState>({ visible: false });
    const duration = state.visible && state.animationDuration != null ? state.animationDuration : 200;

    // 改为 reanimated：遮罩淡入/淡出
    const opacity = useSharedValue(0);
    const maskStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

    useEffect(() => {
        const unsub = LoadingService.subscribe(next => {
            setState(next);
            if (next.visible) {
                opacity.value = withTiming(1, { duration: next.animationDuration ?? 200 });
            } else {
                opacity.value = withTiming(0, { duration });
            }
        });
        return unsub;
    }, [opacity, duration]);

    const maskColor = state.visible && state.maskColor ? state.maskColor : (state.visible && state.mode === 'semi' ? 'rgba(0,0,0,0.35)' : 'rgba(0,0,0,0.45)');

    const pointerEventsRoot = state.visible ? (state.mode === 'blocking' ? 'auto' : 'box-none') : 'none';
    const showCancelButton = !!state.visible && !!state.cancelable && state.mode === 'semi';

    /**
     * 函数注释：半阻断模式下支持取消
     * - 在可取消且可见的情况下，点击遮罩或按钮触发取消并隐藏 Loading。
     */
    const handleCancel = () => {
        if (!state.visible || !state.cancelable) return;
        try { state.onCancel?.(); } finally { LoadingService.hide(); }
    };

    if (!state.visible) return null;

    return (
        <View style={styles.root} pointerEvents={pointerEventsRoot}>
            <Animated.View style={[styles.mask, { backgroundColor: maskColor }, maskStyle]} pointerEvents={state.mode === 'blocking' ? 'auto' : 'none'}>
                {state.cancelable && state.mode === 'blocking' ? (
                    <TouchableWithoutFeedback onPress={handleCancel}>
                        <View style={styles.touchFill} />
                    </TouchableWithoutFeedback>
                ) : null}
            </Animated.View>

            {/* 中心内容区域，半阻断模式仅拦截中心卡片触摸 */}
            <View style={styles.center} pointerEvents="auto">
                <View style={[styles.card, { backgroundColor: colors.background }]}>
                    <ActivityIndicator size="small" color={colors.text} />
                    {state.message ? <Text style={[styles.text, { color: colors.text }]}>{state.message}</Text> : null}
                    {showCancelButton ? (
                        <TouchableWithoutFeedback onPress={handleCancel}>
                            <View style={styles.cancelButton}><Text style={[styles.cancelText, { color: colors.text }]}>取消</Text></View>
                        </TouchableWithoutFeedback>
                    ) : null}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    root: {
        position: 'absolute', left: 0, right: 0, top: 0, bottom: 0,
        zIndex: 9999,
    },
    mask: {
        position: 'absolute', left: 0, right: 0, top: 0, bottom: 0,
    },
    touchFill: { flex: 1 },
    center: {
        flex: 1, alignItems: 'center', justifyContent: 'center',
    },
    card: {
        minWidth: 160, maxWidth: 280,
        paddingHorizontal: 16, paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
    },
    text: { marginTop: 8, fontSize: 14 },
    cancelButton: { marginTop: 12, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, opacity: 0.9, borderWidth: StyleSheet.hairlineWidth, borderColor: 'rgba(255,255,255,0.7)' },
    cancelText: { fontSize: 13 },
});