import type { GradientVariant } from '../layout/GradientBackground/GradientBackground';

// 渐变配置
export interface GradientProps {
    gradientEnabled?: boolean;
    gradientVariant?: GradientVariant;
    gradientColors?: string[];
    gradientLocations?: number[];
    gradientAngle?: number;
    gradientStart?: { x: number; y: number };
    gradientEnd?: { x: number; y: number };
    gradientCenter?: { x: number; y: number };
    gradientRadius?: number;
    gradientOpacity?: number;
}

// 归一化后的渐变配置
export interface NormalizedGradientConfig {
    variant: GradientVariant;
    colors?: string[];
    locations?: number[];
    angle?: number;
    start?: { x: number; y: number };
    end?: { x: number; y: number };
    center?: { x: number; y: number };
    radius?: number;
    opacity?: number;
}

// 归一化渐变配置
export function normalizeGradientConfig(
    baseColors: string[] | undefined,
    props: GradientProps | undefined,
): NormalizedGradientConfig {
    const p = props ?? {};
    const variant: GradientVariant = p.gradientVariant ?? 'linear';
    const enabled = !!p.gradientEnabled;
    const colors = enabled
        ? (p.gradientColors && p.gradientColors.length > 0
            ? p.gradientColors
            : baseColors)
        : undefined;

    return {
        variant,
        colors,
        locations: p.gradientLocations,
        angle: p.gradientAngle,
        start: p.gradientStart,
        end: p.gradientEnd,
        center: p.gradientCenter,
        radius: p.gradientRadius,
        opacity: p.gradientOpacity,
    };
}