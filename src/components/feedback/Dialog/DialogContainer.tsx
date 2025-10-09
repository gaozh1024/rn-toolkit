import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Animated, StyleSheet, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { DialogService, DialogState } from './DialogService';
import { useFadeAnimation, useScaleAnimation } from '../../../animation';
import { useTheme } from '../../../theme/hooks';

export const DialogContainer: React.FC = () => {
    const { theme } = useTheme?.() ?? { theme: { colors: { background: '#FFFFFF', textPrimary: '#333333' } } };
    const colors = theme?.colors ?? { background: '#FFFFFF', textPrimary: '#333333' };

    // 渲染门控，保证淡出动画可见
    const [rendering, setRendering] = useState(false);
    const [state, setState] = useState<DialogState>({ visible: false });
    const { fadeAnim, fadeIn, fadeOut } = useFadeAnimation(0);
    const { scaleAnim, scaleIn, scaleOut } = useScaleAnimation(0);
    const durationRef = useRef(200);

    useEffect(() => {
        const unsub = DialogService.subscribe((next) => {
            const duration = next.visible && next.animationDuration != null ? next.animationDuration : 200;
            durationRef.current = duration;

            if (next.visible) {
                setRendering(true);
                setState(next);
                (fadeAnim as any).setValue?.(0);
                (scaleAnim as any).setValue?.(0);
                (fadeIn(duration) as any).start?.();
                (scaleIn(duration) as any).start?.();
            } else {
                const d = durationRef.current;
                (fadeOut(d) as any).start?.(() => { setRendering(false); setState({ visible: false }); });
                (scaleOut(d) as any).start?.();
            }
        });
        return () => unsub();
    }, [fadeAnim, fadeIn, fadeOut, scaleAnim, scaleIn, scaleOut]);

    if (!rendering) return null;

    const maskColor = (state.visible && state.maskColor) || 'rgba(0,0,0,0.45)';
    const pointerEventsRoot = 'auto'; // 阻断式

    const { title, message, confirmText, cancelText, actions, cancelable } = (state.visible ? state : {}) as any;

    const handleBackdrop = () => {
        if ((state as any).cancelable) DialogService.cancel();
    };

    const handleAction = (action: any) => {
        const v = action?.value ?? (action?.role === 'cancel' ? false : true);
        DialogService.submit(v);
    };

    const finalActions = (() => {
        if (actions?.length) return actions;
        if (confirmText && cancelText) return [{ text: cancelText, role: 'cancel' }, { text: confirmText, role: 'default' }];
        if (confirmText) return [{ text: confirmText, role: 'default' }];
        return [{ text: '确定', role: 'default' }];
    })();

    return (
        <View style={styles.root} pointerEvents={pointerEventsRoot}>
            <TouchableWithoutFeedback onPress={cancelable ? handleBackdrop : undefined}>
                <Animated.View style={[styles.mask, { backgroundColor: maskColor, opacity: fadeAnim }]} />
            </TouchableWithoutFeedback>

            <View style={styles.center} pointerEvents="box-none">
                <Animated.View style={[styles.card, { backgroundColor: colors.background, transform: [{ scale: scaleAnim }] }] }>
                    {!!title && (
                        <View style={styles.titleWrapper}>
                            <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
                        </View>
                    )}
                    {!!message && (
                        <View style={styles.messageWrapper}>
                            <Text style={[styles.message, { color: colors.text }]}>{message}</Text>
                        </View>
                    )}
                    <View style={styles.actions}>
                        {finalActions.map((a: any, idx: number) => (
                            <TouchableOpacity
                                key={idx}
                                onPress={() => handleAction(a)}
                                activeOpacity={0.8}
                                style={[
                                    styles.actionButton,
                                    idx > 0 ? styles.actionSeparator : undefined,
                                    a.role === 'destructive' ? styles.actionDestructive : undefined,
                                ]}
                            >
                                <Text style={styles.actionText}>{a.text}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </Animated.View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    root: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, zIndex: 9998 },
    mask: { ...StyleSheet.absoluteFillObject },
    center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
    card: { minWidth: 300, maxWidth: 420, borderRadius: 12, paddingTop: 10 },
    title: { fontSize: 16, fontWeight: '600', textAlign: 'center', lineHeight: 40 },
    message: { marginTop: 8, fontSize: 14, lineHeight: 24, textAlign: 'center' },
    titleWrapper: { minHeight: 40, paddingHorizontal: 20, alignItems: 'center', justifyContent: 'center' },
    messageWrapper: { minHeight: 50, paddingHorizontal: 20, alignItems: 'center', justifyContent: 'center' },
    actions: { marginTop: 16, flexDirection: 'row', borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: '#E5E5EA', },
    actionButton: { flex: 1, paddingVertical: 12, alignItems: 'center', justifyContent: 'center', },
    actionSeparator: { borderLeftWidth: StyleSheet.hairlineWidth, borderLeftColor: '#E5E5EA', },
    actionText: { fontSize: 14, fontWeight: '600', lineHeight: 30 },
    actionDestructive: { borderColor: '#FF3B30' },
});