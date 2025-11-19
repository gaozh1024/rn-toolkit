import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Animated, ViewStyle, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFadeAnimation } from '../../../animation';
import { ToastService, ToastOptions, ToastPosition } from './ToastService';
import { Text } from '../../ui/Text';

/**
 * ToastContainer：全局轻提示容器。
 * - 动画：淡入/淡出。
 * - 位置：top/center/bottom。
 * - Android 兼容：通过为 Text 设置 lineHeight 与 includeFontPadding 修复多行文本在部分机型（如小米 15 / MIUI）底部被裁切的问题。
 */
export const ToastContainer: React.FC = () => {
    const insets = useSafeAreaInsets();
    const [visible, setVisible] = useState(false);
    const [message, setMessage] = useState('');
    const [position, setPosition] = useState<ToastPosition>('bottom');
    const hideTimerRef = useRef<NodeJS.Timeout | null>(null);
    const { fadeAnim, fadeIn, fadeOut } = useFadeAnimation(0);

    useEffect(() => {
        const unsub = ToastService.subscribe((opts: ToastOptions) => {
            // 清理上一次计时器
            if (hideTimerRef.current) {
                clearTimeout(hideTimerRef.current);
                hideTimerRef.current = null;
            }
            // 展示新内容
            setMessage(opts.message);
            setPosition(opts.position ?? 'bottom');
            setVisible(true);
            // 先重置为 0，再淡入
            (fadeAnim as any).setValue?.(0);
            const ani = fadeIn(150);
            (ani as any).start?.();

            // 自动消失
            hideTimerRef.current = setTimeout(() => {
                const out = fadeOut(150);
                (out as any).start?.(() => {
                    setVisible(false);
                });
            }, opts.duration ?? 2000);
        });
        return () => unsub();
    }, [fadeAnim, fadeIn, fadeOut]);

    if (!visible) return null;

    const containerStyle = ((): ViewStyle => {
        switch (position) {
            case 'top':
                return { alignItems: 'center', justifyContent: 'flex-start', paddingTop: insets.top + 16 };
            case 'center':
                return { alignItems: 'center', justifyContent: 'center' };
            case 'bottom':
            default:
                return { alignItems: 'center', justifyContent: 'flex-end', paddingBottom: insets.bottom + 64 };
        }
    })();

    return (
        <View pointerEvents="box-none" style={styles.root}>
            <View pointerEvents="none" style={[styles.overlay, containerStyle]}>
                <Animated.View style={[styles.toast, { opacity: fadeAnim }]}>
                    <Text style={styles.text}>{message}</Text>
                </Animated.View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    root: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, zIndex: 9999 },
    overlay: { flex: 1, paddingHorizontal: 24 },
    toast: {
        backgroundColor: 'rgba(0,0,0,0.8)',
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 16,
        maxWidth: '100%',
    },
    text: {
        color: '#fff',
        fontSize: 14,
        textAlign: 'center',
        ...(Platform.OS === 'android' ? { lineHeight: 18, includeFontPadding: false } : {}),
    },
});

export default ToastContainer;