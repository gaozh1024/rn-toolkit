import React from 'react';
import { Pressable, ViewStyle, Insets, StyleProp, StyleSheet, LayoutChangeEvent } from 'react-native';
import { Icon, IconType } from '../Icon';
import { useTheme, useThemeColors } from '../../../theme';
import { GradientBackground } from '../../layout/GradientBackground';

export interface IconButtonProps {
  name: string;
  type?: IconType;
  size?: number; // 图标尺寸（px）
  color?: 'primary' | 'secondary' | 'text' | 'textSecondary' | 'textDisabled' | 'error' | 'warning' | 'success' | 'info' | string;
  variant?: 'filled' | 'ghost' | 'outline';
  disabled?: boolean;
  onPress?: () => void;
  style?: ViewStyle | ViewStyle[];
  hitSlop?: Insets;
  accessibilityLabel?: string;
  testID?: string;
  // 渐变相关（默认与主题 primary→secondary）
  gradientEnabled?: boolean;
  gradientVariant?: 'linear' | 'radial';
  gradientColors?: string[];
  gradientLocations?: number[];
  gradientAngle?: number;
  gradientStart?: { x: number; y: number };
  gradientEnd?: { x: number; y: number };
  gradientCenter?: { x: number; y: number };
  gradientRadius?: number;
  gradientOpacity?: number;
}

// IconButton 组件（起始于第 20 行）
const IconButton: React.FC<IconButtonProps> = ({
  name,
  type = 'ionicons',
  size = 20,
  color = 'text',
  variant = 'ghost',
  disabled = false,
  onPress,
  style,
  hitSlop,
  accessibilityLabel,
  testID,
  // 渐变相关（默认与主题 primary→secondary）
  gradientEnabled = false,
  gradientVariant = 'linear',
  gradientColors,
  gradientLocations,
  gradientAngle,
  gradientStart,
  gradientEnd,
  gradientCenter = { x: 0.5, y: 0.5 },
  gradientRadius = 0.5,
  gradientOpacity = 1,
}) => {
  const { theme } = useTheme();
  const colors = useThemeColors();

  const [containerSize, setContainerSize] = React.useState<{ width: number; height: number } | null>(null);
  const handleLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setContainerSize({ width, height });
  };

  const getContainerStyle = (): ViewStyle => {
    const base: ViewStyle = {
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: 40,
      minHeight: 40,
      paddingHorizontal: (theme.spacing as any)?.xs ?? 8,
      paddingVertical: (theme.spacing as any)?.xs ?? 8,
      borderRadius: theme.borderRadius?.md ?? 8,
      opacity: disabled ? 0.6 : 1,
    };

    switch (variant) {
      case 'filled':
        return {
          ...base,
          backgroundColor: (colors as any).surface ?? '#F2F3F5',
          borderWidth: 0,
        };
      case 'outline':
        return {
          ...base,
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: (colors as any).border ?? '#DADDE2',
        };
      case 'ghost':
      default:
        return {
          ...base,
          backgroundColor: 'transparent',
          borderWidth: 0,
        };
    }
  };

  // 启用渐变：背景透明 + 相对定位 + 溢出裁剪
  const gradientEnhancer: ViewStyle = { backgroundColor: 'transparent', position: 'relative', overflow: 'hidden' };
  const containerBaseStyle = getContainerStyle();
  const containerStyle = gradientEnabled ? { ...containerBaseStyle, ...gradientEnhancer } : containerBaseStyle;
  const finalStyle: StyleProp<ViewStyle> = [containerStyle, style];

  // 扁平化获取有效圆角
  const flatFinal = StyleSheet.flatten(finalStyle) as ViewStyle | undefined;
  const effectiveRadius =
    typeof flatFinal?.borderRadius === 'number'
      ? (flatFinal.borderRadius as number)
      : (() => {
          const corners = [
            flatFinal?.borderTopLeftRadius,
            flatFinal?.borderTopRightRadius,
            flatFinal?.borderBottomLeftRadius,
            flatFinal?.borderBottomRightRadius,
          ].filter((v) => typeof v === 'number') as number[];
          return corners.length ? Math.max(...corners) : (theme.borderRadius?.md ?? 8);
        })();

  const gradientPalette = (gradientColors && gradientColors.length > 0) ? gradientColors : [colors.primary, colors.secondary];

  return (
    <Pressable
      testID={testID}
      accessible
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || `${name} icon button`}
      disabled={disabled}
      onPress={disabled ? undefined : onPress}
      hitSlop={hitSlop}
      onLayout={handleLayout}
      style={finalStyle as StyleProp<ViewStyle>}
    >
      {gradientEnabled && (
        <GradientBackground
          variant={gradientVariant}
          colors={gradientPalette}
          locations={gradientLocations}
          angle={gradientAngle}
          start={gradientStart}
          end={gradientEnd}
          center={gradientCenter}
          radius={gradientRadius}
          opacity={gradientOpacity}
          borderRadius={effectiveRadius}
          style={{ position: 'absolute', top: 0, left: 0, width: containerSize?.width, height: containerSize?.height }}
        />
      )}
      <Icon name={name} type={type} size={size} color={disabled ? 'textDisabled' : color} />
    </Pressable>
  );
};

export default IconButton;