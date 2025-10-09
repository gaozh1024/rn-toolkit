import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Animated, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, PanResponder } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFadeAnimation } from '../../../animation';
import { useTheme } from '../../../theme/hooks';
import { ActionSheetService, ActionSheetState, ActionSheetAction } from './ActionSheetService';

export const ActionSheetContainer: React.FC = () => {
    const { theme } = useTheme?.() ?? { theme: { colors: { background: '#FFFFFF', text: '#333333', border: '#E5E5EA', destructive: '#FF3B30' } } } as any;
    const colors = theme?.colors ?? { background: '#FFFFFF', text: '#333333', border: '#E5E5EA', destructive: '#FF3B30' } as any;
    const insets = useSafeAreaInsets();

    const [rendering, setRendering] = useState(false);
    const [state, setState] = useState<ActionSheetState>({ visible: false });

    const { fadeAnim, fadeIn, fadeOut } = useFadeAnimation(0);
    const translateY = useRef(new Animated.Value(300)).current;
    const sheetHeightRef = useRef(300);
    const durationRef = useRef(220);
    const pendingEnterRef = useRef(false);

    useEffect(() => {
        const unsub = ActionSheetService.subscribe((next) => {
            const duration = next.visible && next.animationDuration != null ? next.animationDuration : 220;
            durationRef.current = duration;

            if (next.visible) {
                setRendering(true);
                setState(next);
                (fadeAnim as any).setValue?.(0);
                translateY.setValue(sheetHeightRef.current);
                const mask = fadeIn(duration);
                (mask as any).start?.();
                // 等待 onLayout 拿到真实高度后执行进入动画
                pendingEnterRef.current = true;
            } else {
                const d = durationRef.current;
                const outMask = fadeOut(d);
                (outMask as any).start?.(() => { setRendering(false); setState({ visible: false }); });
                Animated.timing(translateY, { toValue: sheetHeightRef.current, duration: d, useNativeDriver: true }).start();
            }
        });
        return () => unsub();
    }, [fadeAnim, fadeIn, fadeOut, translateY]);

    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: (_, gesture) => (state as any).visible && (state as any).enablePanToClose && (gesture.dy > 6),
            onPanResponderMove: Animated.event([null, { dy: translateY }], { useNativeDriver: false }),
            onPanResponderRelease: (_, gesture) => {
                if (!(state as any).visible) return;
                const threshold = 80;
                const velocity = gesture.vy;
                const dy = gesture.dy;
                if (dy > threshold || velocity > 0.8) {
                    ActionSheetService.cancel();
                } else {
                    Animated.timing(translateY, { toValue: 0, duration: 180, useNativeDriver: true }).start();
                }
            },
        })
    ).current;

    if (!rendering) return null;

    const s = (state.visible ? state : {}) as any;
    const maskColor = s.maskColor || 'rgba(0,0,0,0.45)';
    const pointerEventsRoot = 'auto'; // 阻断式

    const runEnterIfNeeded = () => {
        if (pendingEnterRef.current) {
            pendingEnterRef.current = false;
            Animated.timing(translateY, { toValue: 0, duration: durationRef.current, useNativeDriver: true }).start();
        }
    };

    const handleBackdrop = () => {
        if (s.cancelable) ActionSheetService.cancel();
    };

    const handleActionPress = (a: ActionSheetAction) => {
        ActionSheetService.choose(a);
    };

    const renderActions = (actions: ActionSheetAction[]) => (
        <View style={[styles.group, { backgroundColor: colors.background }]}>
            {actions.map((a, idx) => (
                <TouchableOpacity
                    key={idx}
                    onPress={() => handleActionPress(a)}
                    activeOpacity={0.8}
                    style={styles.row}
                >
                    <Text style={[styles.rowText, a.role === 'destructive' ? { color: colors.text } : { color: colors.text }]}>{a.text}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );

    return (
        <View style={styles.root} pointerEvents={pointerEventsRoot}>
            <TouchableWithoutFeedback onPress={s.cancelable ? handleBackdrop : undefined}>
                <Animated.View style={[styles.mask, { backgroundColor: maskColor, opacity: fadeAnim }]} />
            </TouchableWithoutFeedback>

            <View style={styles.bottom} pointerEvents="box-none">
                <Animated.View
                    style={[styles.sheet, { paddingBottom: insets.bottom + 8, transform: [{ translateY }] }]}
                    onLayout={(e) => {
                        sheetHeightRef.current = e.nativeEvent.layout.height;
                        runEnterIfNeeded();
                    }}
                    {...(s.enablePanToClose ? panResponder.panHandlers : {})}
                >
                    {!!s.title && (
                        <View style={[styles.titleWrap, { backgroundColor: colors.background }]}>
                            <Text style={[styles.title, { color: colors.text }]}>{s.title}</Text>
                        </View>
                    )}

                    {!!s.actions?.length && (
                        <View style={styles.section}>
                            {renderActions(s.actions)}
                        </View>
                    )}

                    <View style={styles.section}>
                        <TouchableOpacity
                            onPress={() => ActionSheetService.cancel()}
                            activeOpacity={0.9}
                            style={[styles.cancelBtn, { backgroundColor: colors.background }]}
                        >
                            <Text style={[styles.cancelText, { color: colors.text }]}>{s.cancelText ?? '取消'}</Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    root: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, zIndex: 9998 },
    mask: { ...StyleSheet.absoluteFillObject },
    bottom: { flex: 1, justifyContent: 'flex-end' },
    sheet: { paddingHorizontal: 12 },
    section: { marginTop: 8 },
    titleWrap: { borderRadius: 12, paddingVertical: 12, paddingHorizontal: 16, alignItems: 'center' },
    title: { fontSize: 14, fontWeight: '600' },
    group: { borderRadius: 12, overflow: 'hidden' },
    row: { height: 48, alignItems: 'center', justifyContent: 'center', borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: '#E5E5EA' },
    rowText: { fontSize: 16, fontWeight: '400' },
    cancelBtn: { height: 52, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    cancelText: { fontSize: 16, fontWeight: '600' },
});