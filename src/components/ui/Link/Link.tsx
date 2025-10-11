import React from 'react';
import { Pressable, TextStyle, Insets, Linking } from 'react-native';
import { useThemeColors } from '../../../theme';
import { Text } from '../Text';

export interface LinkProps {
  children?: React.ReactNode;
  label?: string;
  href?: string;
  onPress?: () => void;
  underline?: boolean;
  color?: string; // 支持主题颜色名或自定义颜色字符串
  disabled?: boolean;
  style?: TextStyle | TextStyle[];
  accessibilityLabel?: string;
  numberOfLines?: number;
  hitSlop?: Insets;
  testID?: string;
}

const Link: React.FC<LinkProps> = ({
  children,
  label,
  href,
  onPress,
  underline = true,
  color,
  disabled = false,
  style,
  accessibilityLabel,
  numberOfLines,
  hitSlop,
  testID,
}) => {
  const colors = useThemeColors();

  const resolvedColor =
    typeof color === 'string'
      ? (colors as any)[color] ?? color
      : (colors as any).primary ?? '#3B82F6';

  const handlePress = async () => {
    if (disabled) return;
    try {
      onPress?.();
      if (href) {
        const url = String(href).trim().replace(/^['"`]\s*|\s*['"`]$/g, '');
        const supported = await Linking.canOpenURL(url);
        if (supported) {
          await Linking.openURL(url);
        } else {
          // 兜底：部分设备 canOpenURL 返回 false 但仍可打开 http/https
          await Linking.openURL(url).catch(() => { });
        }
      }
    } catch (e) {
      // 忽略打开错误，保持组件健壮性
      console.error('Link opening error:', e);
    }
  };

  const textContent = label ?? children;

  return (
    <Pressable
      testID={testID}
      accessible
      accessibilityRole="link"
      accessibilityLabel={
        accessibilityLabel || (typeof textContent === 'string' ? textContent : 'Link')
      }
      accessibilityState={{ disabled }}
      onPress={disabled ? undefined : handlePress}
      hitSlop={hitSlop}
      style={{ opacity: disabled ? 0.6 : 1 }}
    >
      <Text
        variant="body1"
        numberOfLines={numberOfLines}
        style={[
          { color: resolvedColor, textDecorationLine: underline ? 'underline' : 'none' },
          style,
        ]}
      >
        {textContent}
      </Text>
    </Pressable>
  );
};

export default Link;