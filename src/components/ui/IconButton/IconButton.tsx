// 顶部 import
import React from 'react';
import { Pressable, ViewStyle, Insets, StyleProp, StyleSheet, LayoutChangeEvent, Animated, Easing } from 'react-native';
import { Icon, IconType } from '../Icon';
import { useTheme, useThemeColors, useSpacingStyle, SpacingProps } from '../../../theme';
import { GradientBackground } from '../../layout/GradientBackground';
import { buildTestID, TestableProps } from '../../common/test';
import type { PressEvents } from '../../common/events';
import { buildShadowStyle, type ShadowProps } from '../../common/shadow';
import { normalizeGradientConfig, type GradientProps } from '../../common/gradient';
import { buildBoxStyle, type BoxProps } from '../../common/box';

// 接口：统一公共能力并精简冗余字段
export interface IconButtonProps extends SpacingProps, TestableProps, PressEvents, ShadowProps, GradientProps, BoxProps {
  name: string;
  type?: IconType;
  size?: number;
  color?: 'primary' | 'secondary' | 'text' | 'textSecondary' | 'textDisabled' | 'error' | 'warning' | 'success' | 'info' | string;
  variant?: 'filled' | 'ghost' | 'outline';
  disabled?: boolean;
  loading?: boolean;
  loadingAnimation?: 'none' | 'spinOnce';
  style?: StyleProp<ViewStyle>;
  hitSlop?: Insets;
  accessibilityLabel?: string;
  testID?: string;
}

const IconButton: React.FC<IconButtonProps> = ({
  name,
  type = 'ionicons',
  size = 20,
  color = 'text',
  variant = 'ghost',
  disabled = false,
  loading = false,
  loadingAnimation = 'none',
  style,
  hitSlop,
  accessibilityLabel,
  testID,
  onPress,
  onPressIn,
  onPressOut,
  onLongPress,
  ...props
}) => {
  const { theme } = useTheme();
  const colors = useThemeColors();

  const [containerSize, setContainerSize] = React.useState<{ width: number; height: number } | null>(null);
  const handleLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setContainerSize({ width, height });
  };

  // 统一的间距样式（移除手动 m/mv/... 枚举）
  const spacingStyle = useSpacingStyle(props);
  // 规范化 testID
  const computedTestID = buildTestID('IconButton', testID);
  // 渐变归一化配置（默认使用主题 primary→secondary）
  const gradientConfig = normalizeGradientConfig([colors.primary, colors.secondary], props);
  const gradientEnabled = !!gradientConfig.colors && gradientConfig.colors.length > 0;

  // 交互禁用：loading 时也禁用
  const isDisabled = disabled || loading;

  // 加载动画：仅在 loadingAnimation='spinOnce' 且 loading 时执行一次旋转
  const spinAnim = React.useRef(new Animated.Value(0)).current;
  React.useEffect(() => {
    if (loading && loadingAnimation === 'spinOnce') {
      spinAnim.setValue(0);
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start();
    } else {
      spinAnim.stopAnimation(() => {
        try { spinAnim.setValue(0); } catch {}
      });
    }
    return () => {
      spinAnim.stopAnimation(() => {
        try { spinAnim.setValue(0); } catch {}
      });
    };
  }, [loading, loadingAnimation, spinAnim]);

  const spin = spinAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  const iconWrapperStyle = loading && loadingAnimation === 'spinOnce' ? { transform: [{ rotate: spin }] } : undefined;

  // 容器基础样式与变体处理
  const base: ViewStyle = {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 40,
    minHeight: 40,
    paddingHorizontal: (theme.spacing as any)?.xs ?? 8,
    paddingVertical: (theme.spacing as any)?.xs ?? 8,
    borderRadius: theme.borderRadius?.md ?? 8,
    opacity: isDisabled ? 0.6 : 1,
    ...(gradientEnabled ? { position: 'relative', overflow: 'hidden', backgroundColor: 'transparent' } : {}),
  };
  const isOutline = variant === 'outline';
  const isFilled = variant === 'filled';
  const defaultBackground = isFilled ? (colors as any).surface ?? '#F2F3F5' : 'transparent';
  const variantOverrides: ViewStyle = isOutline
    ? { backgroundColor: 'transparent', borderWidth: 1, borderColor: (colors as any).border ?? '#DADDE2' }
    : { backgroundColor: defaultBackground, borderWidth: 0 };

  // 盒子样式与阴影样式
  const boxStyle = buildBoxStyle({ defaultBackground }, props, { ...base, ...variantOverrides });
  const shadowStyle = buildShadowStyle((theme as any).styles?.shadow ?? {}, props);

  const finalStyle: StyleProp<ViewStyle> = [boxStyle, shadowStyle, spacingStyle, style];

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

  return (
    <Pressable
      testID={computedTestID}
      accessible
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || `${name} icon button`}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      onPress={isDisabled ? undefined : onPress}
      onPressIn={isDisabled ? undefined : onPressIn}
      onPressOut={isDisabled ? undefined : onPressOut}
      onLongPress={isDisabled ? undefined : onLongPress}
      hitSlop={hitSlop}
      onLayout={handleLayout}
      style={finalStyle as StyleProp<ViewStyle>}
    >
      {gradientEnabled && (
        <GradientBackground
          variant={gradientConfig.variant}
          colors={gradientConfig.colors}
          locations={gradientConfig.locations}
          angle={gradientConfig.angle}
          start={gradientConfig.start}
          end={gradientConfig.end}
          center={gradientConfig.center}
          radius={gradientConfig.radius}
          opacity={gradientConfig.opacity}
          borderRadius={effectiveRadius}
          style={{ position: 'absolute', top: 0, left: 0, width: containerSize?.width, height: containerSize?.height }}
        />
      )}
      <Animated.View style={iconWrapperStyle}>
        <Icon name={name} type={type} size={size} color={isDisabled ? 'textDisabled' : color} />
      </Animated.View>
    </Pressable>
  );
};

export default IconButton;