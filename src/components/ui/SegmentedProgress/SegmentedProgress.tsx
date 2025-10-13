import React, { useMemo } from 'react';
import { View, ViewStyle, Text, TextStyle, StyleProp } from 'react-native';
import { useTheme } from '../../../theme/hooks';
import { ColorTheme } from '../../../theme/types';

export type SegmentedProgressPreviewMode = 'none' | 'dim';
export type SegmentedColor = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'text' | 'subtext' | 'border' | 'divider' | string;
export type SegmentedItem = string | { color: SegmentedColor; weight?: number; label?: React.ReactNode | string; labelStyle?: StyleProp<TextStyle> | { [key: string]: any } };

export interface SegmentedProgressProps {
    segments: SegmentedItem[];
    value?: number; // 0-1
    thickness?: number; // 高度
    radius?: number; // 圆角
    segmentRadius?: number; // 分段圆角（不设置时跟随 radius）
    segmentGap?: number; // 段间距
    previewMode?: 'none' | 'dim'; // 未到达部分预览
    previewOpacity?: number; // 预览透明度
    trackColor?: SegmentedColor; // 默认背景
    style?: ViewStyle | ViewStyle[];
    testID?: string;
    // 新增：段标签显示与样式
    showLabels?: boolean;
    labelGap?: number;
    labelStyle?: StyleProp<TextStyle> | { [key: string]: any };
    labelColor?: SegmentedColor;
}

const clamp01 = (v?: number) => {
    const n = typeof v === 'number' ? v : 0;
    return Math.max(0, Math.min(1, n));
};

const resolveColor = (colors: ColorTheme, c?: SegmentedColor, fallback?: string) => {
    if (!c) return fallback ?? colors.primary;
    const themeKeys = ['primary', 'secondary', 'success', 'warning', 'error', 'info', 'text', 'subtext', 'border', 'divider'] as const;
    if (typeof c === 'string' && (themeKeys as readonly string[]).includes(c)) {
        return (colors as any)[c];
    }
    return c as string;
};

const applyOpacity = (hexOrRgba: string, opacity: number) => {
    const o = Math.max(0, Math.min(1, opacity));
    // #RRGGBB / #RGB
    const m = hexOrRgba.replace('#', '');
    if (/^([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/.test(m)) {
        const hex = m.length === 3 ? m.split('').map(ch => ch + ch).join('') : m;
        const r = parseInt(hex.slice(0, 2), 16);
        const g = parseInt(hex.slice(2, 4), 16);
        const b = parseInt(hex.slice(4, 6), 16);
        return `rgba(${r}, ${g}, ${b}, ${o})`;
    }
    // rgba(...) 直接替换透明度（简化处理）
    if (hexOrRgba.startsWith('rgba(')) {
        const body = hexOrRgba.slice(5, -1).split(',').map(s => s.trim());
        if (body.length === 4) return `rgba(${body[0]}, ${body[1]}, ${body[2]}, ${o})`;
    }
    // 无法解析时直接返回原色
    return hexOrRgba;
};

export const SegmentedProgress: React.FC<SegmentedProgressProps> = ({
    segments,
    value = 0,
    thickness = 8,
    radius,
    segmentRadius,
    segmentGap = 4,
    previewMode = 'none',
    previewOpacity = 0.25,
    trackColor = 'divider',
    style,
    testID,
    // 新增 props 默认值
    showLabels = false,
    labelGap = 6,
    labelStyle,
    labelColor,
}) => {
    const { theme } = useTheme();
    const colors = theme.colors;

    const barHeight = thickness;
    const outerR = radius ?? Math.round(barHeight / 2);
    const segR = segmentRadius ?? outerR;
    const track = resolveColor(colors, trackColor, colors.divider);
    const labelCol = resolveColor(colors, labelColor ?? 'subtext', colors.textSecondary);

    const containerStyle: ViewStyle = useMemo(() => ({
        ...(showLabels ? {} : { height: barHeight }),
        flexDirection: 'column',
    }), [barHeight, showLabels]);

    const trackRowStyle: ViewStyle = useMemo(() => ({
        height: barHeight,
        borderRadius: outerR,
        overflow: 'hidden',
        backgroundColor: track,
        flexDirection: 'row',
        alignItems: 'stretch',
    }), [barHeight, outerR, track]);

    const labelRowStyle: ViewStyle = useMemo(() => ({
        flexDirection: 'row',
        alignItems: 'flex-start',
    }), []);

    const normalized = useMemo(() => {
        const items = segments.map(seg => (
            typeof seg === 'string'
                ? { color: seg, weight: 1, label: undefined, labelStyle: undefined }
                : { color: seg.color, weight: seg.weight ?? 1, label: seg.label, labelStyle: seg.labelStyle }
        ));
        const totalWeight = items.reduce((sum, it) => sum + (it.weight ?? 1), 0);
        return { items, totalWeight };
    }, [segments]);

    const fills = useMemo(() => {
        const total = normalized.totalWeight;
        const progress = Math.max(0, Math.min(1, value)) * total;
        let acc = 0;
        return normalized.items.map(it => {
            const w = it.weight ?? 1;
            const f = Math.max(0, Math.min(1, (progress - acc) / w));
            acc += w;
            return f;
        });
    }, [value, normalized]);

    return (
        <View style={[containerStyle, style]} testID={testID}>
            <View style={trackRowStyle}>
                {normalized.items.map((it, idx) => {
                    const active = resolveColor(colors, it.color, colors.primary);
                    const base = previewMode === 'dim' ? applyOpacity(active, previewOpacity) : track;
                    const gapStyle = idx > 0 && segmentGap > 0 ? { marginLeft: segmentGap } : undefined;
                    const fill = fills[idx];
                    return (
                        <View key={idx} style={[{ flex: it.weight ?? 1, backgroundColor: base, borderRadius: segR }, gapStyle]}>
                            <View style={{ height: '100%', width: `${fill * 100}%`, backgroundColor: active, borderRadius: segR }} />
                        </View>
                    );
                })}
            </View>

            {showLabels && (
                <View style={labelRowStyle}>
                    {normalized.items.map((it, idx) => {
                        const gapStyle = idx > 0 && segmentGap > 0 ? { marginLeft: segmentGap } : undefined;
                        const segWrapper: ViewStyle = { flex: it.weight ?? 1, alignItems: 'center' };
                        const labelNode = it.label != null
                            ? <Text style={[{ color: labelCol, marginTop: labelGap }, labelStyle as any, it.labelStyle as any]}>{it.label}</Text>
                            : null;
                        return (
                            <View key={idx} style={[segWrapper, gapStyle]}>
                                {labelNode}
                            </View>
                        );
                    })}
                </View>
            )}
        </View>
    );
}

export default SegmentedProgress;