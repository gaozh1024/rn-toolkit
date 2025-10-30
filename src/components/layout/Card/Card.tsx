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
  flex?: number;
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

  // 修复：补回 cardStyle 定义
  const cardStyle: ViewStyle = {
    ...boxStyle,
    ...(props.borderRadius == null ? { borderRadius: borderRadiusValue } : {}),
    ...shadowStyle,
  };

  const spacingStyle = useSpacingStyle(props);

  // 修改：分别检测水平/垂直 padding 键，仅关闭对应轴的默认值
  const hasPaddingH = ['ph', 'pl', 'pr'].some((k) => (props as any)[k] != null);
  const hasPaddingV = ['pv', 'pt', 'pb'].some((k) => (props as any)[k] != null);

  const hasMarginH = ['mh', 'ml', 'mr'].some((k) => (props as any)[k] != null);
  const hasMarginV = ['mv', 'mt', 'mb'].some((k) => (props as any)[k] != null);

  const defaultPadding: ViewStyle =
    props.p != null
      ? {}
      : {
        ...(hasPaddingH ? {} : { paddingHorizontal: theme.spacing.md }),
        ...(hasPaddingV ? {} : { paddingVertical: theme.spacing.md }),
      };

  const defaultMargin: ViewStyle =
    props.m != null
      ? {}
      : {
        ...(hasMarginH ? {} : { marginHorizontal: theme.spacing.sm }),
        ...(hasMarginV ? {} : { marginVertical: theme.spacing.sm }),
      };

  const defaultSpacingStyle: ViewStyle = { ...defaultPadding, ...defaultMargin };

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

  // 新增：仅当 Card 传入 flex 时，让内容层也拉伸填满
  const contentFlexStyle: ViewStyle = props.flex != null ? { flex: 1 } : {};
  // 新增：仅在传入 flex 时应用到外层容器
  const flexStyle: ViewStyle = props.flex != null ? { flex: props.flex } : {};
  // 修改：合并 flexStyle
  const containerStyle = [cardStyle, marginOnly, flexStyle];

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
    <View style={[contentFlexStyle, paddingOnly]}>
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