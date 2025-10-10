// Progress 组件 - 修复 resolveColor 类型签名与导入
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Animated, ViewStyle, Text, TextStyle } from 'react-native';
import { useTheme, ColorTheme } from '../../../theme';
import Svg, { Circle } from 'react-native-svg';

export type ProgressVariant = 'linear' | 'circular';
export type ProgressColor = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'text' | 'subtext' | 'border' | 'divider' | string;

export interface ProgressProps {
  variant?: ProgressVariant;
  value?: number; // 0-1
  indeterminate?: boolean;
  color?: ProgressColor; // 主题键或自定义色值
  trackColor?: ProgressColor; // 主题键或自定义色值
  thickness?: number; // 线性：高度；环形：描边宽度
  size?: 'small' | 'medium' | 'large' | number; // 线性：高度（可选）；环形：直径
  showLabel?: boolean; // 环形进度中心展示百分比
  label?: string | React.ReactNode; // 环形中心自定义文案
  style?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle | TextStyle[];
  testID?: string;
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
}) => {
  const { theme } = useTheme();
  const colors = theme.colors;

  const activeColor = resolveColor(colors, color, colors.primary);
  const track = resolveColor(colors, trackColor, colors.divider);

  if (variant === 'circular') {
    const diameter = typeof size === 'number' ? size : size === 'small' ? 24 : size === 'large' ? 56 : 40;
    const stroke = thickness ?? Math.max(2, Math.round(diameter * 0.08));
    const progress01 = clamp01(value);

    const r = (diameter - stroke) / 2; // 圆半径
    const cx = diameter / 2;
    const cy = diameter / 2;
    const circumference = 2 * Math.PI * r;

    const spin = useRef(new Animated.Value(0)).current;
    useEffect(() => {
      if (indeterminate) {
        spin.setValue(0);
        Animated.loop(
          Animated.timing(spin, { toValue: 1, duration: 1500, useNativeDriver: true })
        ).start();
      }
    }, [indeterminate, spin]);

    const rotation = indeterminate
      ? spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] })
      : '0deg';

    const percent = Math.round(((indeterminate ? progress01 : progress01) * 100));
    const defaultTextStyle: TextStyle = {
      color: activeColor,
      fontSize: Math.round(diameter * 0.28),
      fontWeight: '500',
    };
    const labelNode: React.ReactNode = (label != null || showLabel)
      ? (
          <View
            style={{ position: 'absolute', width: diameter, height: diameter, alignItems: 'center', justifyContent: 'center' }}
          >
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

    return (
      <View style={[{ width: diameter, height: diameter, justifyContent: 'center', alignItems: 'center' }, style]} testID={testID}>
        <Animated.View style={{ width: diameter, height: diameter, transform: [{ rotate: rotation }] }}>
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

  // Linear
  const barHeight = thickness ?? (typeof size === 'number' ? size : size === 'small' ? 4 : size === 'large' ? 10 : 6);
  const radius = barHeight / 2;
  const [containerWidth, setContainerWidth] = useState(0);
  const progress01 = clamp01(value);

  const anim = useRef(new Animated.Value(progress01)).current;
  useEffect(() => {
    if (indeterminate) {
      anim.setValue(0);
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, { toValue: 1, duration: 1200, useNativeDriver: true }),
          Animated.timing(anim, { toValue: 0, duration: 0, useNativeDriver: true }),
        ])
      ).start();
    } else {
      Animated.timing(anim, { toValue: progress01, duration: 180, useNativeDriver: false }).start();
    }
  }, [indeterminate, progress01, anim]);

  const indetTranslateX = useMemo(() => (
    anim.interpolate({ inputRange: [0, 1], outputRange: [-containerWidth * 0.6, containerWidth] })
  ), [anim, containerWidth]);

  const containerStyleLinear: ViewStyle = {
    height: barHeight,
    borderRadius: radius,
    backgroundColor: track,
    overflow: 'hidden',
    justifyContent: 'center',
  };

  const barStyle: ViewStyle = {
    position: 'absolute',
    height: '100%',
    borderRadius: radius,
    backgroundColor: activeColor,
  };

  return (
    <View style={[containerStyleLinear, style]} onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)} testID={testID}>
      {indeterminate ? (
        <Animated.View style={[barStyle, { width: containerWidth * 0.4, transform: [{ translateX: indetTranslateX }] }]} />
      ) : (
        <View style={[barStyle, { width: containerWidth * progress01 }]} />
      )}
    </View>
  );
};

export default Progress;