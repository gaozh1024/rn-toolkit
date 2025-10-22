import React, { useEffect, useMemo, useState } from 'react';
import { View, Image, Text, ViewStyle, TextStyle, StyleSheet, StyleProp, ImageSourcePropType } from 'react-native';
import { useTheme, useSpacingStyle, SpacingProps } from '../../../theme';
import { TestableProps, buildTestID } from '../../common/test';
import { BoxProps, buildBoxStyle } from '../../common/box';
import { buildShadowStyle, ShadowProps } from '../../common/shadow';

// 头像大小（small/medium/large 或自定义数值）
export type AvatarSize = 'small' | 'medium' | 'large' | number;
// 头像形状（圆形/圆角/方形）
export type AvatarShape = 'circle' | 'rounded' | 'square';
// 头像状态（在线/离线）
export type AvatarStatus = 'online' | 'offline';

export interface AvatarProps extends SpacingProps, BoxProps, TestableProps, ShadowProps {
  src?: string | ImageSourcePropType;
  name?: string;
  size?: AvatarSize;
  shape?: AvatarShape;
  status?: AvatarStatus;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

// 解析颜色到 RGB（支持 #RGB/#RRGGBB 与 rgb(a)）
function parseColorToRgb(input: string): { r: number; g: number; b: number } | null {
  const hex = input.trim();
  const hexMatch = /^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/.exec(hex);
  if (hexMatch) {
    let h = hexMatch[1];
    if (h.length === 3) h = h.split('').map(c => c + c).join('');
    const r = parseInt(h.slice(0, 2), 16);
    const g = parseInt(h.slice(2, 4), 16);
    const b = parseInt(h.slice(4, 6), 16);
    return { r, g, b };
  }
  const rgbMatch = /rgba?\(([^)]+)\)/i.exec(input);
  if (rgbMatch) {
    const parts = rgbMatch[1].split(',').map(p => parseFloat(p.trim()));
    if (parts.length >= 3) {
      return { r: parts[0], g: parts[1], b: parts[2] };
    }
  }
  return null;
}

// 计算亮度（相对亮度近似）
function getLuminance(c: { r: number; g: number; b: number }): number {
  const r = c.r / 255, g = c.g / 255, b = c.b / 255;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

// 基于背景选择可读的文本颜色
function pickReadableTextColor(bg: string, colors: any): string {
  const rgb = parseColorToRgb(bg);
  if (!rgb) return colors.text;
  const lum = getLuminance(rgb);
  return lum > 0.5 ? colors.text : colors.background;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  name,
  size = 'medium',
  shape = 'circle',
  status,
  style,
  textStyle,
  testID,
  ...props
}) => {
  // 正确解构 styles（包含阴影样式预设）
  const { theme, styles } = useTheme();
  const colors = theme.colors as any;
  const br = theme.borderRadius;
  const [imageError, setImageError] = useState(false);

  const px = useMemo(() => {
    if (typeof size === 'number') return size;
    return size === 'small' ? 28 : size === 'large' ? 44 : 36;
  }, [size]);

  const radius = useMemo(() => {
    if (shape === 'circle') return px / 2;
    if (shape === 'rounded') return br.md;
    return 0;
  }, [shape, px, br]);

  const initials = useMemo(() => {
    if (!name || typeof name !== 'string') return '';
    const trimmed = name.trim();
    if (!trimmed) return '';
    const parts = trimmed.split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    const first = trimmed[0];
    const second = trimmed.length > 1 ? trimmed[1] : '';
    return (first + second).toUpperCase();
  }, [name]);

  // 从主题状态色中选择背景色（避免硬编码），基于 name 哈希
  const bgColor = useMemo(() => {
    const palette = [colors.primary, colors.secondary, colors.success, colors.warning, colors.error, colors.info];
    const key = (name || 'A').split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
    return palette[key % palette.length];
  }, [name, colors]);

  const textColor = useMemo(() => pickReadableTextColor(bgColor, colors), [bgColor, colors]);

  // spacing
  const spacingStyle = useSpacingStyle(props);

  // 用外部样式作为 overrides；单独属性（宽高/圆角/边框/背景）更高优先级
  const styleOverrides = StyleSheet.flatten(style) ?? undefined;

  // 统一盒子样式：保证 size/shape 控制的宽高与圆角生效；默认背景透明
  const boxStyle = buildBoxStyle(
    { defaultBackground: 'transparent' },
    { ...props, width: px, height: px, borderRadius: radius },
    styleOverrides,
  );

  // 阴影样式：使用 styles.shadow 预设，再按 ShadowProps 覆盖
  const shadowStyle = buildShadowStyle(styles.shadow, props);

  // 新增：占位底色的手动设置优先级
  const fallbackBgColor = props.backgroundColor ?? styleOverrides?.backgroundColor ?? bgColor;

  // 容器最终样式：不在容器上合并阴影，避免透明容器吞阴影
  const container: ViewStyle = {
    ...boxStyle,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  };

  const textStyles: TextStyle = {
    color: textColor,
    fontSize: Math.max(12, Math.floor(px * 0.38)),
    fontWeight: '600',
  };

  const statusSize = Math.max(6, Math.floor(px * 0.28));
  const statusStyle: ViewStyle = {
    position: 'absolute',
    right: -Math.floor(px * 0.06),
    bottom: -Math.floor(px * 0.06),
    width: statusSize,
    height: statusSize,
    borderRadius: statusSize / 2,
    backgroundColor: status === 'online' ? colors.success : colors.textDisabled,
    borderWidth: 2,
    borderColor: colors.background,
    zIndex: 10,
  };

  // 规范化 testID
  const computedTestID = buildTestID('Avatar', testID);

  // 当 src 变化时重置错误状态
  useEffect(() => {
    setImageError(false);
  }, [src]);

  const accessibilityLabel = `${name ?? ''}${status ? `, ${status}` : ''}`.trim();

  // 统一构造 Image 的 source：远程字符串 => { uri }, 本地资源 => 直接透传
  const imageSource: ImageSourcePropType | undefined =
    typeof src === 'string' ? (src ? { uri: src } : undefined) : (src as ImageSourcePropType | undefined);

  const showImage = !!src && !imageError;

  return (
    <View style={[container, spacingStyle]} testID={computedTestID} accessibilityLabel={accessibilityLabel}>
      {/* 阴影应用在包裹层 View 上，类型与平台表现更稳定 */}
      <View style={[{ width: px, height: px, borderRadius: radius }, shadowStyle]}>
        {showImage ? (
          <Image
            source={imageSource}
            style={{ width: px, height: px, borderRadius: radius }}
            onError={() => setImageError(true)}
          />
        ) : (
          <View
            style={{ width: px, height: px, borderRadius: radius, backgroundColor: fallbackBgColor, alignItems: 'center', justifyContent: 'center' }}
          >
            <Text style={[textStyles, textStyle]}>{initials}</Text>
          </View>
        )}
      </View>
      {status ? <View style={statusStyle} /> : null}
    </View>
  );
};
