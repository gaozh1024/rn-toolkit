import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, PanResponder } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, runOnJS } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../../theme/hooks';
import { ActionSheetService, ActionSheetState, ActionSheetAction } from './ActionSheetService';

export const ActionSheetContainer: React.FC = () => {
    const { theme } = useTheme?.() ?? { theme: { colors: { background: '#FFFFFF', text: '#333333', border: '#E5E5EA', destructive: '#FF3B30' } } } as any;
    const colors = theme?.colors ?? { background: '#FFFFFF', text: '#333333', border: '#E5E5EA', destructive: '#FF3B30' } as any;
    const insets = useSafeAreaInsets();

    const [rendering, setRendering] = useState(false);
    const [state, setState] = useState<ActionSheetState>({ visible: false });

    const sheetHeightRef = useRef(300);
    const durationRef = useRef(220);
    const pendingEnterRef = useRef(false);

    // reanimated: 遮罩与底部面板动画
    const opacity = useSharedValue(0);
    const translateY = useSharedValue(sheetHeightRef.current);

    const maskStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));
    const sheetStyle = useAnimatedStyle(() => ({ transform: [{ translateY: translateY.value }] }));

    // 订阅服务状态，驱动动画
    useEffect(() => {
        const unsub = ActionSheetService.subscribe((next) => {
            const duration = next.visible && next.animationDuration != null ? next.animationDuration : 220;
            durationRef.current = duration;

            if (next.visible) {
                setRendering(true);
                setState(next);
                opacity.value = 0;
                translateY.value = sheetHeightRef.current;
                opacity.value = withTiming(1, { duration });
                pendingEnterRef.current = true; // 等待实际高度后执行进入动画
            } else {
                const d = durationRef.current;
                opacity.value = withTiming(0, { duration: d }, (finished) => {
                    if (finished) {
                        runOnJS(setRendering)(false);
                        runOnJS(setState)({ visible: false } as ActionSheetState);
                    }
                });
                translateY.value = withTiming(sheetHeightRef.current, { duration: d });
            }
        });
        return () => unsub();
    }, [opacity, translateY]);

    // onLayout 后按真实高度执行进入动画
    const runEnterIfNeeded = () => {
        if (pendingEnterRef.current) {
            pendingEnterRef.current = false;
            translateY.value = withTiming(0, { duration: durationRef.current });
        }
    };

    const s = (state.visible ? state : {}) as any;
    const maskColor = s.maskColor || 'rgba(0,0,0,0.45)';
    const pointerEventsRoot = s.blocking ? 'auto' : 'none';

    const handleBackdrop = () => {
        if (s.cancelable) ActionSheetService.cancel();
    };

    // 手势：下拉关闭 / 回弹
    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: (_, gesture) => !!(s.visible && s.enablePanToClose && gesture.dy > 6),
            onPanResponderMove: (_, gesture) => {
                // 仅允许向下拖动，且不小于 0
                translateY.value = Math.max(0, gesture.dy);
            },
            onPanResponderRelease: (_, gesture) => {
                if (!s.visible) return;
                const threshold = 80;
                const velocity = gesture.vy;
                const dy = gesture.dy;
                if (dy > threshold || velocity > 0.8) {
                    ActionSheetService.cancel();
                } else {
                    translateY.value = withTiming(0, { duration: 180 });
                }
            },
        })
    ).current;

    if (!rendering) return null;

    return (
        <View style={styles.root} pointerEvents={pointerEventsRoot}>
            <TouchableWithoutFeedback onPress={s.cancelable ? handleBackdrop : undefined}>
                <Animated.View style={[styles.mask, { backgroundColor: maskColor }, maskStyle]} />
            </TouchableWithoutFeedback>

            <View style={styles.bottom} pointerEvents="box-none">
                <Animated.View
                    style={[styles.sheet, { paddingBottom: insets.bottom + 8 }, sheetStyle]}
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
                            {renderActions(s.actions, colors)}
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

function renderActions(actions: ActionSheetAction[], colors: any) {
    return (
        <View style={styles.group}>
            {actions.map((a, idx) => {
                const label = (a as any).text ?? (a as any).label ?? (a as any).title ?? '';
                const destructive = a.role === 'destructive' || (a as any).destructive === true;
                const isLast = idx === actions.length - 1;
                return (
                    <TouchableOpacity
                        key={idx}
                        activeOpacity={0.8}
                        style={[styles.row, !isLast && { borderTopColor: colors.border }]}
                        onPress={() => {
                            try { (a as any).onPress?.(); } finally { ActionSheetService.choose(a); }
                        }}
                    >
                        <Text style={[styles.rowText, { color: destructive ? colors.destructive : colors.text }]}>{label}</Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    root: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, zIndex: 9998 },
    mask: { ...StyleSheet.absoluteFillObject },
    bottom: { flex: 1, justifyContent: 'flex-end' },
    sheet: { paddingHorizontal: 12 },
    section: { marginTop: 8 },
    titleWrap: { borderRadius: 12, paddingVertical: 12, paddingHorizontal: 16, alignItems: 'center' },
    title: { fontSize: 14, fontWeight: '600' },
    group: { borderRadius: 12, overflow: 'hidden' },
    row: { height: 48, alignItems: 'center', justifyContent: 'center', borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: '#E5E5EA', backgroundColor: '#FFFFFF' },
    rowText: { fontSize: 16, fontWeight: '400' },
    cancelBtn: { height: 52, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    cancelText: { fontSize: 16, fontWeight: '600' },
});