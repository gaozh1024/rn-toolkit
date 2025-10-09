import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, ActivityIndicator, Animated, TouchableWithoutFeedback, StyleSheet } from 'react-native';
import { LoadingOverlayService, LoadingOverlayState } from './LoadingOverlayService';
import { useTheme } from '../../../theme/hooks';

export const LoadingOverlayContainer: React.FC = () => {
    const { theme } = useTheme?.() ?? { theme: { colors: { background: '#FFFFFF', textPrimary: '#333333' } } };
    const colors = theme?.colors ?? { background: '#FFFFFF', textPrimary: '#333333' };

    const [state, setState] = useState<LoadingOverlayState>({ visible: false });
    const opacity = useRef(new Animated.Value(0)).current;
    const duration = state.visible && state.animationDuration != null ? state.animationDuration : 200;

    useEffect(() => {
        const unsub = LoadingOverlayService.subscribe(next => {
            setState(next);
            if (next.visible) {
                Animated.timing(opacity, { toValue: 1, duration: next.animationDuration ?? 200, useNativeDriver: true }).start();
            } else {
                Animated.timing(opacity, { toValue: 0, duration, useNativeDriver: true }).start();
            }
        });
        return unsub;
    }, [opacity, duration]);

    const maskColor = state.visible && state.maskColor ? state.maskColor : (state.visible && state.mode === 'semi' ? 'rgba(0,0,0,0.35)' : 'rgba(0,0,0,0.45)');

    const pointerEventsRoot = state.visible ? (state.mode === 'blocking' ? 'auto' : 'box-none') : 'none';
    const showCancelButton = !!state.visible && !!state.cancelable && state.mode === 'semi';

    const handleCancel = () => {
        if (!state.visible || !state.cancelable) return;
        try { state.onCancel?.(); } finally { LoadingOverlayService.hide(); }
    };

    if (!state.visible) return null;

    return (
        <View style={styles.root} pointerEvents={pointerEventsRoot}>
            {/* 遮罩层（允许淡入/淡出），半阻断模式下不拦截触摸 */}
            <Animated.View style={[styles.mask, { backgroundColor: maskColor, opacity }]} pointerEvents={state.mode === 'blocking' ? 'auto' : 'none'}>
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