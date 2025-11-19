import React from 'react';
import { View, ViewStyle, TextStyle, StyleSheet, StyleProp } from 'react-native';
import { useTheme, useSpacingStyle, SpacingProps } from '../../../theme';
import { buildTestID, TestableProps } from '../../common/test';
import { buildBoxStyle, BoxProps } from '../../common/box';
import { buildShadowStyle, ShadowProps } from '../../common/shadow';
import { Text } from '../Text';

export type BadgeVariant = 'solid' | 'outline';
export type BadgeColor = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | string;
export type BadgePosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
export type BadgeSize = 'small' | 'medium' | 'large' | number;

export interface BadgeProps extends SpacingProps, BoxProps, ShadowProps, TestableProps {
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
  style?: StyleProp<ViewStyle>; // 徽标自身样式（作为 overrides）
  containerStyle?: StyleProp<ViewStyle>; // 包裹 children 的容器样式
  textStyle?: StyleProp<TextStyle>;
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
  ...props
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
  const minWidth = isDot ? height : height;
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

  // 公共 spacing
  const spacingStyle = useSpacingStyle(props);

  // 公共 shadow（主题未配置时返回空对象）
  const shadowStyle = buildShadowStyle((theme as any).styles?.shadow ?? ({} as any), props);

  // 公共 box：将外部 style 拍平为 overrides，再由单独属性覆盖
  const styleOverrides = StyleSheet.flatten(style) ?? undefined;
  const boxBase = buildBoxStyle({ defaultBackground: bgColor }, props, styleOverrides);

  const badgeStyle: ViewStyle = {
    ...boxBase,
    ...shadowStyle,
    minWidth,
    height,
    paddingHorizontal: paddingH,
    borderRadius,
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
    <View
      style={[badgeStyle, children ? undefined : spacingStyle]}
      testID={buildTestID('Badge', testID)}
      accessible
      accessibilityRole={isDot ? undefined : 'text'}
    >
      {isDot ? null : <Text style={[labelStyle, textStyle]}>{displayText}</Text>}
    </View>
  );

  if (children) {
    // 修复：将 spacing 与容器分离，角标相对于内部锚点（children 所在层）绝对定位
    return (
      <View style={[spacingStyle, containerStyle]}>
        <View style={{ position: 'relative', alignSelf: 'flex-start' }}>
          {children}
          <View style={[cornerStyle, { zIndex: 10, pointerEvents: 'none' }]}>
            {content}
          </View>
        </View>
      </View>
    );
  }

  return content;
};

export default Badge;