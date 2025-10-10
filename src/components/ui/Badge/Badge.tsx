import React from 'react';
import { View, Text, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '../../../theme';

export type BadgeVariant = 'solid' | 'outline';
export type BadgeColor = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | string;
export type BadgePosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
export type BadgeSize = 'small' | 'medium' | 'large' | number;

export interface BadgeProps {
  text?: string;
  value?: number | string;
  max?: number;
  dot?: boolean;
  variant?: BadgeVariant;
  color?: BadgeColor;
  size?: BadgeSize;
  position?: BadgePosition;
  offset?: { x?: number; y?: number };
  children?: React.ReactNode;
  showZero?: boolean; // 针对数值 0 是否显示
  style?: ViewStyle | ViewStyle[]; // 徽标自身样式
  containerStyle?: ViewStyle | ViewStyle[]; // 包裹 children 的容器样式
  textStyle?: TextStyle | TextStyle[];
  testID?: string;
}

const Badge: React.FC<BadgeProps> = ({
  text,
  value,
  max,
  dot = false,
  variant = 'solid',
  color = 'primary',
  size = 'medium',
  position = 'top-right',
  offset,
  children,
  showZero = true,
  style,
  containerStyle,
  textStyle,
  testID,
}) => {
  const { theme } = useTheme();
  const colors = theme.colors;

  const getThemeColor = (c: BadgeColor): string => {
    const preset = ['primary', 'secondary', 'success', 'warning', 'error', 'info'] as const;
    if (preset.includes(c as any)) return colors[c as keyof typeof colors] as string;
    return c as string;
  };

  const activeColor = getThemeColor(color);

  const isDot = !!dot;
  const sizeNumber = (() => {
    if (typeof size === 'number') return size;
    if (isDot) return size === 'small' ? 8 : size === 'large' ? 12 : 10;
    return size === 'small' ? 16 : size === 'large' ? 20 : 18;
  })();

  const height = sizeNumber;
  const paddingH = isDot ? 0 : Math.round(height / 3);
  const minWidth = isDot ? height : height; // 胶囊至少与高度一致
  const borderRadius = Math.round(height / 2);

  const bgColor = variant === 'solid' ? activeColor : 'transparent';
  const bdColor = activeColor;
  const bdWidth = variant === 'outline' ? 1 : 0;
  const txtColor = variant === 'solid' ? '#FFFFFF' : activeColor;

  // 格式化展示内容
  const displayText = (() => {
    if (isDot) return '';
    if (typeof text === 'string' && text.length > 0) return text;
    if (value === undefined || value === null) return '';
    if (typeof value === 'number') {
      if (!showZero && value === 0) return '';
      if (typeof max === 'number' && value > max) return `${max}+`;
      return String(value);
    }
    const v = String(value);
    if (!showZero && v === '0') return '';
    return v;
  })();

  const badgeStyle: ViewStyle = {
    minWidth,
    height,
    paddingHorizontal: paddingH,
    borderRadius,
    backgroundColor: bgColor,
    borderColor: bdColor,
    borderWidth: bdWidth,
    alignItems: 'center',
    justifyContent: 'center',
  };

  const labelStyle: TextStyle = {
    color: txtColor,
    fontSize: Math.max(10, Math.round(height * 0.6)),
    fontWeight: '600',
  };

  const offsetX = offset?.x ?? 0;
  const offsetY = offset?.y ?? 0;

  const cornerStyle = (() => {
    const base: ViewStyle = { position: 'absolute' };
    const half = Math.round(height / 2);
    switch (position) {
      case 'top-right':
        return { ...base, top: -half + offsetY, right: -half + offsetX };
      case 'top-left':
        return { ...base, top: -half + offsetY, left: -half + offsetX };
      case 'bottom-right':
        return { ...base, bottom: -half + offsetY, right: -half + offsetX };
      case 'bottom-left':
        return { ...base, bottom: -half + offsetY, left: -half + offsetX };
      default:
        return base;
    }
  })();

  const content = (
    <View style={[badgeStyle, style]} testID={testID} accessible accessibilityRole={isDot ? undefined : 'text'}>
      {isDot ? null : <Text style={[labelStyle, textStyle]}>{displayText}</Text>}
    </View>
  );

  if (children) {
    return (
      <View style={[{ position: 'relative', alignSelf: 'flex-start' }, containerStyle]}>
        {children}
        <View style={cornerStyle}>{content}</View>
      </View>
    );
  }

  return content;
};

export default Badge;