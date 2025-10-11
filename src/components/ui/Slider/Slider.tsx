// 顶部导入
import React from 'react';
import { View, ViewStyle, LayoutChangeEvent, AccessibilityActionEvent } from 'react-native';
import { useTheme, useThemeColors } from '../../../theme';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, runOnJS } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

export interface SliderProps {
    value: number;
    min?: number;
    max?: number;
    step?: number;
    disabled?: boolean;
    onValueChange?: (next: number) => void;
    style?: ViewStyle | ViewStyle[];
    testID?: string;
}

const Slider: React.FC<SliderProps> = ({
    value,
    min = 0,
    max = 100,
    step = 1,
    disabled = false,
    onValueChange,
    style,
    testID,
}) => {
    const { theme } = useTheme();
    const colors = useThemeColors();

    const [trackWidth, setTrackWidth] = React.useState(0);
    const position = useSharedValue(0);
    const trackSV = useSharedValue(0); // 轨道宽度的共享值，用于 worklet

    const range = Math.max(max - min, 0);
    const clamp = (n: number, lo = 0, hi = trackWidth) => Math.min(hi, Math.max(lo, n));
    const snapToStep = (val: number) => {
        if (step <= 0) return val;
        const steps = Math.round(val / step);
        return steps * step;
    };

    // 同步外部 value → 位置（px）
    React.useEffect(() => {
        if (trackWidth <= 0 || range <= 0) return;
        const norm = (value - min) / range;
        position.value = withTiming(clamp(norm * trackWidth), { duration: 0 });
    }, [value, trackWidth, range, min]);

    const onLayoutTrack = (e: LayoutChangeEvent) => {
        const w = e.nativeEvent.layout.width;
        setTrackWidth(w);
        trackSV.value = w; // 同步共享值供 worklet 使用
        if (range > 0) {
            const norm = (value - min) / range;
            position.value = withTiming(clamp(norm * w), { duration: 0 });
        }
    };

    // 将 onUpdateValue 迁回 JS，避免在 worklet 中引用 JS clamp/trackWidth
    const onUpdateValue = (posPx: number) => {
        if (!onValueChange || trackWidth <= 0 || range <= 0) return;
        const norm = clamp(posPx) / trackWidth;
        const raw = min + norm * range;
        const snapped = snapToStep(raw);
        const next = clamp(((snapped - min) / range) * trackWidth);
        position.value = next;
        onValueChange(Math.min(max, Math.max(min, snapped)));
    };

    // 修复：移除 Animated.event，改为 GestureDetector + Gesture.Pan
    const start = useSharedValue(0);
    const pan = Gesture.Pan()
        .enabled(!disabled)
        .onBegin(() => {
            start.value = position.value;
        })
        .onUpdate((e) => {
            // 在 worklet 内联 clamp，使用共享的 trackSV，避免引用 JS 状态
            const next = Math.min(trackSV.value, Math.max(0, start.value + e.translationX));
            position.value = next;
        })
        .onEnd(() => {
            // 从 worklet 回到 JS，计算并回调 value
            runOnJS(onUpdateValue)(position.value);
        });

    const fillStyle = useAnimatedStyle(() => ({
        width: position.value,
    }));

    const thumbStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: position.value }],
    }));

    const containerStyle: ViewStyle = {
        opacity: disabled ? 0.6 : 1,
    };

    const trackStyle: ViewStyle = {
        height: 4,
        backgroundColor: (colors as any).border ?? '#DADDE2',
        borderRadius: theme.borderRadius?.md ?? 8,
        position: 'relative',
    };

    const fillBarStyle: ViewStyle = {
        height: 4,
        backgroundColor: (colors as any).primary ?? '#3B82F6',
        borderRadius: theme.borderRadius?.md ?? 8,
    };

    const thumbBase: ViewStyle = {
        position: 'absolute',
        top: -8,
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: colors.surface ?? '#FFFFFF',
        borderWidth: 1, // 提升边框粗细，增强可见性
        borderColor: colors.border ?? '#9AA0A6', // 更深的回退色，白底也清晰
    };

    const onAccessibilityAction = (event: AccessibilityActionEvent) => {
        const action = event.nativeEvent.actionName;
        if (disabled) return;
        if (action === 'increment') {
            const nextVal = Math.min(max, value + step);
            onValueChange?.(nextVal);
        } else if (action === 'decrement') {
            const nextVal = Math.max(min, value - step);
            onValueChange?.(nextVal);
        }
    };

    return (
        <View
            testID={testID}
            accessible
            accessibilityRole="adjustable"
            accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
            onAccessibilityAction={onAccessibilityAction}
            style={[containerStyle, style]}
        >
            <View onLayout={onLayoutTrack} style={trackStyle}>
                <Animated.View style={[fillBarStyle, fillStyle]} />
                <GestureDetector gesture={pan}>
                    <Animated.View style={[thumbBase, thumbStyle]} />
                </GestureDetector>
            </View>
        </View>
    );
};

export default Slider;