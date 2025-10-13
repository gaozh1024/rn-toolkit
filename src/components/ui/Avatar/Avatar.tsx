import React, { useMemo, useState } from 'react';
import { View, Image, Text, ViewStyle, TextStyle } from 'react-native';
import { useTheme, useSpacingStyle, SpacingProps } from '../../../theme';

export type AvatarSize = 'small' | 'medium' | 'large' | number;
export type AvatarShape = 'circle' | 'rounded' | 'square';
export type AvatarStatus = 'online' | 'offline';

export interface AvatarProps extends SpacingProps {
  src?: string;
  name?: string;
  size?: AvatarSize;
  shape?: AvatarShape;
  status?: AvatarStatus;
  style?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle | TextStyle[];
  testID?: string;
}

// 解析颜色到 RGB
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

// 基于背景选择文本颜色（在 theme.colors.text / theme.colors.background 间切换）
function pickReadableTextColor(bg: string, colors: any): string {
  const rgb = parseColorToRgb(bg);
  if (!rgb) return colors.text;
  const lum = getLuminance(rgb);
  // 较亮背景用 text，较暗背景用 background（通常更亮）
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
  const { theme } = useTheme();
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
    if (!name) return '';
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

  const container: ViewStyle = {
    width: px,
    height: px,
    borderRadius: radius,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  };

  const textStyles: TextStyle = {
    color: textColor,
    fontSize: Math.max(12, Math.floor(px * 0.38)),
    fontWeight: '600',
  };

  const statusSize = Math.max(6, Math.floor(px * 0.28));
  const statusStyle: ViewStyle = {
    position: 'absolute',
    right: Math.floor(px * 0.06),
    bottom: Math.floor(px * 0.06),
    width: statusSize,
    height: statusSize,
    borderRadius: statusSize / 2,
    backgroundColor: status === 'online' ? colors.success : colors.textDisabled,
    borderWidth: 2,
    borderColor: colors.background,
  };

  const accessibilityLabel = `${name ?? ''}${status ? `, ${status}` : ''}`.trim();
  const showImage = !!src && !imageError;
  const spacingStyle = useSpacingStyle(props);

  return (
    <View style={[container, spacingStyle, style]} testID={testID} accessibilityLabel={accessibilityLabel}>
      {showImage ? (
        <Image
          source={{ uri: src! }}
          style={{ width: px, height: px, borderRadius: radius }}
          onError={() => setImageError(true)}
        />
      ) : (
        <View style={{ width: px, height: px, borderRadius: radius, backgroundColor: bgColor, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={[textStyles, textStyle]}>{initials}</Text>
        </View>
      )}
      {status ? <View style={statusStyle} /> : null}
    </View>
  );
};
