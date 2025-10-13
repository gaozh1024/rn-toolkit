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
    const progress01 = clamp01(value);

    const normalized = useMemo(() => {
        const arr = segments.map(seg => (
            typeof seg === 'string'
                ? { color: seg, weight: 1, label: undefined, labelStyle: undefined }
                : { color: seg.color, weight: seg.weight ?? 1, label: seg.label, labelStyle: seg.labelStyle }
        ));
        const total = arr.reduce((s, it) => s + (it.weight ?? 1), 0);
        return { items: arr, totalWeight: total };
    }, [segments]);

    // 新增：计算每段填充比例（0-1），供渲染使用
    const fills = useMemo(() => {
        const P = progress01 * normalized.totalWeight;
        const res: number[] = [];
        let remaining = P;
        for (const it of normalized.items) {
            const w = it.weight ?? 1;
            if (remaining <= 0) {
                res.push(0);
            } else if (remaining >= w) {
                res.push(1);
                remaining -= w;
            } else {
                res.push(remaining / w);
                remaining = 0;
            }
        }
        return res;
    }, [progress01, normalized]);

    const track = resolveColor(colors, trackColor, colors.divider);
    const labelCol = resolveColor(colors, labelColor ?? 'subtext', colors.textSecondary);

    // 容器样式：显示标签时不强制固定高度
    const containerStyle: ViewStyle = useMemo(() => ({
        borderRadius: outerR,
        ...(showLabels ? {} : { height: barHeight }),
        overflow: 'hidden',
        backgroundColor: track,
        flexDirection: 'row',
        alignItems: showLabels ? 'flex-start' : 'stretch',
    }), [barHeight, outerR, showLabels, track]);

    return (
        <View style={[containerStyle, style]} testID={testID}>
            {normalized.items.map((it, idx) => {
                const active = resolveColor(colors, it.color, colors.primary);
                const fill = fills[idx];
                const isLast = idx === normalized.items.length - 1;
                const gapStyle: ViewStyle = segmentGap > 0 && !isLast ? { marginRight: segmentGap } : {};
                const segBg = previewMode === 'dim' ? applyOpacity(active, previewOpacity) : track;

                const segWrapper: ViewStyle = { flex: it.weight ?? 1 };
                const barContainer: ViewStyle = {
                    height: barHeight,
                    backgroundColor: fill < 1 ? segBg : track,
                    borderRadius: segR,
                    overflow: 'hidden',
                    justifyContent: 'center',
                };
                const filledStyle: ViewStyle = {
                    width: `${Math.round(fill * 100)}%`,
                    height: '100%',
                    backgroundColor: active,
                };

                const labelNode = showLabels && it.label != null
                    ? (typeof it.label === 'string' || typeof it.label === 'number'
                        ? <Text style={[{ color: labelCol, marginTop: labelGap }, labelStyle as any, it.labelStyle as any]}>{it.label}</Text>
                        : it.label)
                    : null;

                return (
                    <View key={idx} style={[segWrapper, gapStyle]}>
                        <View style={barContainer}>
                            <View style={filledStyle} />
                        </View>
                        {labelNode}
                    </View>
                );
            })}
        </View>
    );
};

export default SegmentedProgress;