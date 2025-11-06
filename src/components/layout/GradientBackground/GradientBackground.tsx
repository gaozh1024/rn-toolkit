// 文件：GradientBackground.tsx，组件：GradientBackground
import React from 'react';
import { View, ViewStyle, StyleProp, DimensionValue, StyleSheet } from 'react-native';
import Svg, { Defs, LinearGradient as SvgLinearGradient, Stop, Rect, RadialGradient as SvgRadialGradient } from 'react-native-svg';
import { useThemeColors } from '../../../theme/hooks';

export type GradientVariant = 'linear' | 'radial';

export interface GradientBackgroundProps {
    children?: React.ReactNode;
    variant?: GradientVariant;
    colors?: string[];
    locations?: number[];
    angle?: number; // 线性渐变方向角度，0=水平（左->右），单位：度
    start?: { x: number; y: number }; // 线性渐变起点（0..1）
    end?: { x: number; y: number };   // 线性渐变终点（0..1）
    center?: { x: number; y: number }; // 径向渐变中心（0..1）
    radius?: number; // 径向渐变半径（0..1）
    style?: StyleProp<ViewStyle>;
    borderRadius?: number;
    opacity?: number; // 渐变透明度（影响所有 Stop）
    /** 新增：为每个 Stop 单独设置透明度（与 colors 一一对应） */
    stopOpacities?: number[];
    width?: DimensionValue;
    height?: DimensionValue;
    testID?: string;
    /** 新增：是否让背景大小跟随包裹内容自然变化（默认 false=填满父容器） */
    fitContent?: boolean;
}

function computeLinearCoords(angle?: number, start?: { x: number; y: number }, end?: { x: number; y: number }) {
    if (start && end) return { start, end };
    const a = (angle ?? 0) * Math.PI / 180;
    const x = Math.cos(a);
    const y = Math.sin(a);
    return {
        start: { x: 0.5 - x / 2, y: 0.5 - y / 2 },
        end: { x: 0.5 + x / 2, y: 0.5 + y / 2 },
    };
}

function computeStops(colors: string[], locations?: number[]) {
    const n = colors.length;
    if (n === 0) return [];
    if (locations && locations.length === n) {
        return colors.map((c, i) => ({ color: c, offset: Math.max(0, Math.min(1, locations[i])) }));
    }
    return colors.map((c, i) => ({ color: c, offset: n === 1 ? 1 : i / (n - 1) }));
}

/**
 * 函数：解析颜色中的透明度并归一化颜色（去除 alpha）
 * - 支持 rgba(r,g,b,a)、#RRGGBBAA、#RGBA、transparent
 * - 返回不带 alpha 的颜色字符串与 alpha 值（0~1）
 */
function normalizeColorAndAlpha(input: string): { color: string; alpha: number } {
    if (!input) return { color: '#000000', alpha: 1 };
    const trimmed = input.trim().toLowerCase();
    if (trimmed === 'transparent') return { color: 'rgb(0,0,0)', alpha: 0 };

    const rgbaMatch = trimmed.match(/^rgba?\(\s*([0-9]+)\s*,\s*([0-9]+)\s*,\s*([0-9]+)(?:\s*,\s*(\d*\.?\d+))?\s*\)$/);
    if (rgbaMatch) {
        const r = parseInt(rgbaMatch[1], 10);
        const g = parseInt(rgbaMatch[2], 10);
        const b = parseInt(rgbaMatch[3], 10);
        const a = rgbaMatch[4] !== undefined ? Math.max(0, Math.min(1, parseFloat(rgbaMatch[4]))) : 1;
        return { color: `rgb(${r},${g},${b})`, alpha: a };
    }

    const hex8 = trimmed.match(/^#([0-9a-f]{8})$/i);
    if (hex8) {
        const hex = hex8[1];
        const rr = hex.slice(0, 2), gg = hex.slice(2, 4), bb = hex.slice(4, 6), aa = hex.slice(6, 8);
        return { color: `#${rr}${gg}${bb}`, alpha: parseInt(aa, 16) / 255 };
    }

    const hex4 = trimmed.match(/^#([0-9a-f]{4})$/i);
    if (hex4) {
        const hex = hex4[1];
        const r = hex[0], g = hex[1], b = hex[2], a = hex[3];
        return { color: `#${r}${r}${g}${g}${b}${b}`, alpha: parseInt(`${a}${a}`, 16) / 255 };
    }

    // #RRGGBB / #RGB 或命名色：按不透明处理
    return { color: input, alpha: 1 };
}

export const GradientBackground: React.FC<GradientBackgroundProps> = ({
    children,
    variant = 'linear',
    colors: propColors,
    locations,
    angle,
    start,
    end,
    center = { x: 0.5, y: 0.5 },
    radius = 0.5,
    style,
    borderRadius,
    opacity = 1,
    width = '100%',
    height = '100%',
    testID,
    /** 新增：是否让背景大小跟随包裹内容自然变化（默认 false=填满父容器） */
    fitContent = false,
    /** 新增：每个 Stop 的透明度（与 colors 对齐），最终透明度=颜色Alpha×stopOpacity×opacity */
    stopOpacities,
}) => {
    const colorsTheme = useThemeColors() as any;
    const colors = propColors && propColors.length > 0 ? propColors : [colorsTheme.primary, colorsTheme.secondary];

    const { start: s, end: e } = computeLinearCoords(angle, start, end);
    const stops = computeStops(colors, locations);
    const containerStyle: ViewStyle = {
        overflow: borderRadius ? 'hidden' : 'visible',
        borderRadius: borderRadius,
        position: 'relative', // 关键：为绝对定位背景提供参照
    };

    /**
     * 函数：根据 fitContent 决定外层容器尺寸策略
     * - fitContent=true：不设置宽高，容器随内容自然大小
     * - fitContent=false：使用 width/height（默认 100% 填满父容器）
     */
    const wrapperSizeStyle = fitContent ? undefined : { width, height };

    return (
        <View style={[wrapperSizeStyle, containerStyle, style]} testID={testID}>
            {/* 绝对定位的渐变背景层，不遮挡内容与触控 */}
            <View pointerEvents="none" style={StyleSheet.absoluteFill}>
                <Svg width="100%" height="100%" preserveAspectRatio="none">
                    <Defs>
                        {variant === 'linear' ? (
                            <SvgLinearGradient id="bgGradient" x1={s.x} y1={s.y} x2={e.x} y2={e.y}>
                                {stops.map((st, i) => {
                                    const { color, alpha } = normalizeColorAndAlpha(st.color);
                                    const finalOpacity = (stopOpacities?.[i] ?? 1) * alpha * (opacity ?? 1);
                                    return <Stop key={i} offset={st.offset} stopColor={color} stopOpacity={finalOpacity} />;
                                })}
                            </SvgLinearGradient>
                        ) : (
                            <SvgRadialGradient id="bgGradient" cx={center.x} cy={center.y} r={radius}>
                                {stops.map((st, i) => {
                                    const { color, alpha } = normalizeColorAndAlpha(st.color);
                                    const finalOpacity = (stopOpacities?.[i] ?? 1) * alpha * (opacity ?? 1);
                                    return <Stop key={i} offset={st.offset} stopColor={color} stopOpacity={finalOpacity} />;
                                })}
                            </SvgRadialGradient>
                        )}
                    </Defs>
                    <Rect x="0" y="0" width="100%" height="100%" fill="url(#bgGradient)" />
                </Svg>
            </View>

            {/* 内容将位于渐变之上 */}
            {children}
        </View>
    );
};