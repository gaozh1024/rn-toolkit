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
    width?: DimensionValue;
    height?: DimensionValue;
    testID?: string;
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

    return (
        <View style={[{ width, height }, containerStyle, style]} testID={testID}>
            {/* 绝对定位的渐变背景层，不遮挡内容与触控 */}
            <View pointerEvents="none" style={StyleSheet.absoluteFill}>
                <Svg width="100%" height="100%" preserveAspectRatio="none">
                    <Defs>
                        {variant === 'linear' ? (
                            <SvgLinearGradient id="bgGradient" x1={s.x} y1={s.y} x2={e.x} y2={e.y}>
                                {stops.map((s, i) => (
                                    <Stop key={i} offset={s.offset} stopColor={s.color} stopOpacity={opacity} />
                                ))}
                            </SvgLinearGradient>
                        ) : (
                            <SvgRadialGradient id="bgGradient" cx={center.x} cy={center.y} r={radius}>
                                {stops.map((s, i) => (
                                    <Stop key={i} offset={s.offset} stopColor={s.color} stopOpacity={opacity} />
                                ))}
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