// 顶部 import
import React from 'react';
import { Pressable, ViewStyle, Insets, StyleProp, StyleSheet, LayoutChangeEvent, Animated } from 'react-native';
import { Icon, IconType } from '../Icon';
import { useTheme, useThemeColors, useSpacingStyle, SpacingProps } from '../../../theme';
import { GradientBackground } from '../../layout/GradientBackground';
import { buildTestID, TestableProps } from '../../common/test';
import type { PressEvents } from '../../common/events';
import { buildShadowStyle, type ShadowProps } from '../../common/shadow';
import { normalizeGradientConfig, type GradientProps } from '../../common/gradient';
import { buildBoxStyle, type BoxProps } from '../../common/box';
import { useIconPressRotate } from '../../common/animation';

// 接口：统一公共能力并精简冗余字段
export interface IconButtonProps extends SpacingProps, TestableProps, PressEvents, ShadowProps, GradientProps, BoxProps {
  name: string;
  type?: IconType;
  size?: number;
  color?: 'primary' | 'secondary' | 'text' | 'textSecondary' | 'textDisabled' | 'error' | 'warning' | 'success' | 'info' | string;
  variant?: 'filled' | 'ghost' | 'outline';
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;// 自定义样式
  hitSlop?: Insets;// 点击区域扩展（默认 8px）
  accessibilityLabel?: string;// 无障碍标签（默认 `${name} 图标按钮`）
  animationName?: 'none' | 'rotate';       // 新增：动画名称（默认无动画）
  animationIterations?: number;            // 新增：动画次数（默认 0，不播放）
  testID?: string;// 测试 ID（默认 `${name}IconButton`）
}

/**
 * 图标按钮组件：支持阴影预设与渐变背景
 * 修复：正确使用样式预设的阴影（styles.shadow）
 */
const IconButton: React.FC<IconButtonProps> = ({
  name,
  type = 'ionicons',
  size = 20,
  color = 'text',
  variant = 'ghost',
  disabled = false,
  loading = false,
  style,
  hitSlop,
  accessibilityLabel,
  animationName = 'none',
  animationIterations = 0,
  testID,
  onPress,
  onPressIn,
  onPressOut,
  onLongPress,
  ...props
}) => {
  const { theme, styles } = useTheme();
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
  const shadowStyle = buildShadowStyle(styles.shadow, props);

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

  // 创建本地动画值与公共 Hook
  const rotateAnim = React.useRef(new Animated.Value(0)).current;
  const { rotateStyle, runPressAnimation } = useIconPressRotate(rotateAnim, {
    animationName,
    iterations: animationIterations,
    duration: 400,
    disabled: isDisabled,
  });

  return (
    <Pressable
      testID={computedTestID}
      accessible
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || `${name} icon button`}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      onPress={isDisabled ? undefined : (event) => {
        // 业务回调需接收事件对象
        onPress?.(event);
        // 点击旋转动画随后播放（并行、不阻塞）
        runPressAnimation();
      }}
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
      <Animated.View style={rotateStyle}>
        <Icon
          name={name}
          type={type}
          size={size}
          // 避免 Icon 内部生成 Pressable，动画由 IconButton 统一控制
          animationName={'none'}
          animationIterations={0}
          color={isDisabled ? 'textDisabled' : color}
        />
      </Animated.View>
    </Pressable>
  );
};

export default IconButton;