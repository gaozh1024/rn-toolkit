import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, ViewStyle, TextStyle, StyleProp } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withRepeat } from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';
import { useTheme } from '../../../theme/hooks';
import { ColorTheme } from '../../../theme/types';
import { useSpacingStyle, type SpacingProps } from '../../../theme/spacing';
import { buildTestID, type TestableProps } from '../../common/test';
import { buildBoxStyle, type BoxProps } from '../../common/box';
import { buildShadowStyle, type ShadowProps } from '../../common/shadow';

export type ProgressVariant = 'linear' | 'circular';
export type ProgressColor = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'text' | 'subtext' | 'border' | 'divider' | string;

export interface ProgressProps extends SpacingProps, TestableProps, BoxProps, ShadowProps {
  variant?: ProgressVariant;
  value?: number; // 0-1
  indeterminate?: boolean;
  color?: ProgressColor; // 主题键或自定义色值
  trackColor?: ProgressColor; // 主题键或自定义色值
  thickness?: number; // 线性：高度；环形：描边宽度
  size?: 'small' | 'medium' | 'large' | number; // 线性：高度（可选）；环形：直径
  showLabel?: boolean; // 环形进度中心展示百分比
  label?: string | React.ReactNode; // 环形中心自定义文案
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

const clamp01 = (v?: number) => {
  const n = typeof v === 'number' ? v : 0;
  return Math.max(0, Math.min(1, n));
};

const resolveColor = (colors: ColorTheme, c?: ProgressColor, fallback?: string) => {
  if (!c) return fallback ?? colors.primary;
  const themeKeys = ['primary', 'secondary', 'success', 'warning', 'error', 'info', 'text', 'subtext', 'border', 'divider'] as const;
  // 主题键：从 ColorTheme 取值；自定义色值：直接返回字符串
  if (typeof c === 'string' && (themeKeys as readonly string[]).includes(c)) {
    return (colors as any)[c];
  }
  return c as string;
};

const Progress: React.FC<ProgressProps> = ({
  variant = 'linear',
  value = 0,
  indeterminate = false,
  color = 'primary',
  trackColor = 'divider',
  thickness,
  size = 'medium',
  showLabel = false,
  label,
  style,
  textStyle,
  testID,
  // SpacingProps / BoxProps / ShadowProps 透传
  ...restProps
}) => {
  const { theme, styles } = useTheme();
  const colors = theme.colors;
  const spacingStyle = useSpacingStyle(restProps);
  const computedTestID = buildTestID(undefined, testID);

  const activeColor = resolveColor(colors, color, colors.primary);
  const track = resolveColor(colors, trackColor, colors.divider);

  // ===================== 环形 =====================
  if (variant === 'circular') {
    const diameter = typeof size === 'number' ? size : size === 'small' ? 24 : size === 'large' ? 56 : 40;
    const stroke = thickness ?? Math.max(2, Math.round(diameter * 0.08));
    const progress01 = clamp01(value);

    const r = (diameter - stroke) / 2; // 半径
    const cx = diameter / 2;
    const cy = diameter / 2;
    const circumference = 2 * Math.PI * r;

    // 不确定态旋转动画
    const spinSV = useSharedValue(0);
    useEffect(() => {
      if (indeterminate) {
        spinSV.value = 0;
        spinSV.value = withRepeat(withTiming(1, { duration: 1500 }), -1, false);
      } else {
        // 停止在初始位置
        spinSV.value = 0;
      }
    }, [indeterminate]);

    const rotationStyle = useAnimatedStyle(() => ({
      transform: [{ rotate: `${indeterminate ? spinSV.value * 360 : 0}deg` }],
    }));

    const percent = Math.round(progress01 * 100);
    const defaultTextStyle: TextStyle = {
      color: activeColor,
      fontSize: Math.round(diameter * 0.28),
      fontWeight: '500',
    };

    const labelNode: React.ReactNode = (label != null || showLabel)
      ? (
        <View style={{ position: 'absolute', width: diameter, height: diameter, alignItems: 'center', justifyContent: 'center' }}>
          {label != null ? (
            typeof label === 'string' || typeof label === 'number'
              ? <Text style={[defaultTextStyle, textStyle]}>{label}</Text>
              : label
          ) : (
            <Text style={[defaultTextStyle, textStyle]}>{`${percent}%`}</Text>
          )}
        </View>
      )
      : null;

    const circularContainerStyle = buildBoxStyle(
      { defaultBackground: 'transparent' },
      restProps,
      { width: diameter, height: diameter, justifyContent: 'center', alignItems: 'center' },
    );
    const shadowStyle = buildShadowStyle(styles.shadow, restProps);

    return (
      <View style={[circularContainerStyle, spacingStyle, shadowStyle, style]} testID={computedTestID}>
        <Animated.View style={[{ width: diameter, height: diameter }, rotationStyle]}>
          <Svg width={diameter} height={diameter}>
            {/* 轨道 */}
            <Circle cx={cx} cy={cy} r={r} stroke={track} strokeWidth={stroke} fill="none" />
            {/* 进度圆弧（从正上方开始） */}
            <Circle
              cx={cx}
              cy={cy}
              r={r}
              stroke={activeColor}
              strokeWidth={stroke}
              fill="none"
              strokeDasharray={`${circumference} ${circumference}`}
              strokeDashoffset={indeterminate ? circumference * 0.25 : circumference * (1 - progress01)}
              strokeLinecap="round"
              rotation={-90}
              originX={cx}
              originY={cy}
            />
          </Svg>
        </Animated.View>
        {labelNode}
      </View>
    );
  }

  // ===================== 线性 =====================
  const barHeight = thickness ?? (typeof size === 'number' ? size : size === 'small' ? 4 : size === 'large' ? 10 : 6);
  const radius = barHeight / 2;
  const [containerWidth, setContainerWidth] = useState(0);
  const progress01 = clamp01(value);

  const containerStyleLinear: ViewStyle = useMemo(() => ({
    height: barHeight,
    backgroundColor: track,
    borderRadius: radius,
    overflow: 'hidden',
  }), [barHeight, track, radius]);

  const barStyle: ViewStyle = useMemo(() => ({
    height: barHeight,
    backgroundColor: activeColor,
    borderRadius: radius,
  }), [barHeight, activeColor, radius]);

  // 不确定态：横向滑动动画
  const animSV = useSharedValue(0);
  useEffect(() => {
    if (indeterminate) {
      animSV.value = 0;
      animSV.value = withRepeat(withTiming(1, { duration: 1200 }), -1, false);
    } else {
      animSV.value = progress01; // 供需要时扩展为平滑进度动画
    }
  }, [indeterminate, progress01]);

  const indeterminateStyle = useAnimatedStyle(() => {
    const barW = containerWidth * 0.4; // 40% 宽的滑动块
    const maxX = Math.max(0, containerWidth - barW);
    const x = Math.min(maxX, animSV.value * maxX);
    return { transform: [{ translateX: x }] };
  }, [containerWidth]);

  const linearContainerStyle = buildBoxStyle(
    { defaultBackground: track },
    restProps,
    containerStyleLinear,
  );
  const shadowStyle = buildShadowStyle(styles.shadow, restProps);

  return (
    <View
      style={[linearContainerStyle, spacingStyle, shadowStyle, style]}
      onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
      testID={computedTestID}
    >
      {indeterminate ? (
        <Animated.View style={[barStyle, { width: containerWidth * 0.4 }, indeterminateStyle]} />
      ) : (
        <View style={[barStyle, { width: containerWidth * progress01 }]} />
      )}
    </View>
  );
};

export default Progress;
export { Progress };