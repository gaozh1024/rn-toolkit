// 顶部导入处
import React from 'react';
import { View, ViewStyle, StyleProp, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme, useSpacingStyle, SpacingProps } from '../../../theme';
import { BoxProps, buildBoxStyle } from '../../common/box';
import { ShadowProps, buildShadowStyle } from '../../common/shadow';
import { GradientProps, normalizeGradientConfig } from '../../common/gradient';
import { PressEvents } from '../../common/events';
import { TestableProps, buildTestID } from '../../common/test';
import { GradientBackground } from '../GradientBackground/GradientBackground';

export interface CardProps extends SpacingProps, BoxProps, PressEvents, GradientProps, TestableProps, ShadowProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
}

/**
 * Card 组件：通用卡片容器。
 *
 * - 集成边框、渐变、事件、测试工具的公共接口。
 * - 仅使用 SpacingProps 管理内外边距；若未显式传入 spacing 键，则应用默认 padding=md 与 margin=sm。
 */
export const Card: React.FC<CardProps> = ({
  children,
  style,
  onPress,
  disabled = false,
  testID,
  shadowSize = 'none',
  shadowColor,
  ...props
}) => {
  const { theme, styles } = useTheme();

  const borderRadiusValue = typeof props.borderRadius === 'number' ? props.borderRadius : theme.borderRadius.lg;

  const styleOverrides = StyleSheet.flatten(style) ?? undefined;
  const defaultBackground = theme.colors.background;

  const boxStyle = buildBoxStyle(
    { defaultBackground },
    props,
    styleOverrides,
  );

  const shadowStyle = buildShadowStyle(styles.shadow, { shadowSize, shadowColor });

  const spacingStyle = useSpacingStyle(props);

  const cardStyle: ViewStyle = {
    ...boxStyle,
    ...(props.borderRadius == null ? { borderRadius: borderRadiusValue } : {}),
    ...shadowStyle,
  };

  // 拆分 spacing：padding 给内容包裹层，margin 留在容器上
  // 旧逻辑：任何 spacing 键都会关闭默认 padding+margin
  // const hasSpacing = ['m', 'mv', 'mh', 'mt', 'mb', 'ml', 'mr', 'p', 'pv', 'ph', 'pt', 'pb', 'pl', 'pr']
  //   .some((k) => (props as any)[k] != null);
  // const defaultSpacingStyle: ViewStyle = hasSpacing ? {} : { padding: theme.spacing.md, margin: theme.spacing.sm };

  // 新逻辑：分别检测 margin 与 padding 的显式传入，独立应用默认值
  const hasPadding = ['p', 'pv', 'ph', 'pt', 'pb', 'pl', 'pr'].some((k) => (props as any)[k] != null);
  const hasMarginH = ['mh', 'ml', 'mr'].some((k) => (props as any)[k] != null);
  const hasMarginV = ['mv', 'mt', 'mb'].some((k) => (props as any)[k] != null);

  const defaultSpacingStyle: ViewStyle = {
    ...(hasPadding ? {} : { padding: theme.spacing.md }),
    ...(props.m != null
      ? {}
      : {
        ...(hasMarginH ? {} : { marginHorizontal: theme.spacing.sm }),
        ...(hasMarginV ? {} : { marginVertical: theme.spacing.sm }),
      }),
  };

  const spacingCombined = StyleSheet.flatten([defaultSpacingStyle, spacingStyle]) ?? {};
  const {
    padding, paddingHorizontal, paddingVertical, paddingTop, paddingBottom, paddingLeft, paddingRight,
    margin, marginHorizontal, marginVertical, marginTop, marginBottom, marginLeft, marginRight,
  } = spacingCombined as ViewStyle;

  const paddingOnly: ViewStyle = {
    ...(padding != null ? { padding } : {}),
    ...(paddingHorizontal != null ? { paddingHorizontal } : {}),
    ...(paddingVertical != null ? { paddingVertical } : {}),
    ...(paddingTop != null ? { paddingTop } : {}),
    ...(paddingBottom != null ? { paddingBottom } : {}),
    ...(paddingLeft != null ? { paddingLeft } : {}),
    ...(paddingRight != null ? { paddingRight } : {}),
  };

  const marginOnly: ViewStyle = {
    ...(margin != null ? { margin } : {}),
    ...(marginHorizontal != null ? { marginHorizontal } : {}),
    ...(marginVertical != null ? { marginVertical } : {}),
    ...(marginTop != null ? { marginTop } : {}),
    ...(marginBottom != null ? { marginBottom } : {}),
    ...(marginLeft != null ? { marginLeft } : {}),
    ...(marginRight != null ? { marginRight } : {}),
  };

  const containerStyle = [cardStyle, marginOnly];

  const computedTestID = buildTestID('Card', testID);

  const normalizedGradient = normalizeGradientConfig(
    [theme.colors.primary, theme.colors.secondary],
    props,
  );

  // 渐变背景：作为纯背景层（绝对定位），覆盖整个卡片，包括 padding 区域
  const gradientLayer = normalizedGradient.colors ? (
    <GradientBackground
      {...normalizedGradient}
      style={StyleSheet.absoluteFillObject}
      borderRadius={props.borderRadius ?? borderRadiusValue}
    />
  ) : null;

  const content = (
    <View style={paddingOnly}>
      {children}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        style={containerStyle}
        onPress={onPress}
        disabled={disabled}
        activeOpacity={0.7}
        testID={computedTestID}
      >
        {gradientLayer}
        {content}
      </TouchableOpacity>
    );
  }

  return (
    <View style={containerStyle} testID={computedTestID}>
      {gradientLayer}
      {content}
    </View>
  );
}