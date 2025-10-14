import React from 'react';
import { View, ViewStyle, StyleProp, ScrollView, StyleSheet, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useTheme } from '../../../theme/hooks';
import { SpacingProps, useSpacingStyle } from '../../../theme';
import { BackgroundProps, buildBackgroundStyle, buildTestID, TestableProps } from '../../common';

export interface ContainerProps extends SpacingProps, BackgroundProps, TestableProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  scrollable?: boolean;
  scrollViewProps?: React.ComponentProps<typeof ScrollView>;
  dismissKeyboardOnTapOutside?: boolean;
  flex?: number;
}

export const Container: React.FC<ContainerProps> = ({
  children,
  style,
  scrollable = false,
  scrollViewProps,
  dismissKeyboardOnTapOutside = false,
  ...props
}) => {
  const { theme } = useTheme();
  const colors = theme.colors;

  // 统一背景（BackgroundProps）
  const backgroundStyle = buildBackgroundStyle(colors.background, props);

  // 统一 spacing（SpacingProps）
  const spacingStyle = useSpacingStyle(props);
  const spacingCombined = StyleSheet.flatten(spacingStyle) as ViewStyle | undefined;

  // 提取 padding / margin
  const paddingOnly: ViewStyle = {
    ...(spacingCombined?.padding != null ? { padding: spacingCombined.padding } : {}),
    ...(spacingCombined?.paddingHorizontal != null ? { paddingHorizontal: spacingCombined.paddingHorizontal } : {}),
    ...(spacingCombined?.paddingVertical != null ? { paddingVertical: spacingCombined.paddingVertical } : {}),
    ...(spacingCombined?.paddingTop != null ? { paddingTop: spacingCombined.paddingTop } : {}),
    ...(spacingCombined?.paddingBottom != null ? { paddingBottom: spacingCombined.paddingBottom } : {}),
    ...(spacingCombined?.paddingLeft != null ? { paddingLeft: spacingCombined.paddingLeft } : {}),
    ...(spacingCombined?.paddingRight != null ? { paddingRight: spacingCombined.paddingRight } : {}),
  };

  const marginOnly: ViewStyle = {
    ...(spacingCombined?.margin != null ? { margin: spacingCombined.margin } : {}),
    ...(spacingCombined?.marginHorizontal != null ? { marginHorizontal: spacingCombined.marginHorizontal } : {}),
    ...(spacingCombined?.marginVertical != null ? { marginVertical: spacingCombined.marginVertical } : {}),
    ...(spacingCombined?.marginTop != null ? { marginTop: spacingCombined.marginTop } : {}),
    ...(spacingCombined?.marginBottom != null ? { marginBottom: spacingCombined.marginBottom } : {}),
    ...(spacingCombined?.marginLeft != null ? { marginLeft: spacingCombined.marginLeft } : {}),
    ...(spacingCombined?.marginRight != null ? { marginRight: spacingCombined.marginRight } : {}),
  };

  // 外层容器基础样式：背景 + 外边距（单独属性优先）
  const baseContainerStyle: ViewStyle = {
    ...backgroundStyle,
    ...marginOnly,
    ...(props.flex != null ? { flex: props.flex } : {}),
  };

  // 外部样式拍平，用于滚动模式下剥离 padding
  const flattened = StyleSheet.flatten(style) as ViewStyle | undefined;
  const styleWithoutPadding: StyleProp<ViewStyle> = flattened
    ? [{
      ...flattened,
      padding: undefined,
      paddingTop: undefined,
      paddingBottom: undefined,
      paddingLeft: undefined,
      paddingRight: undefined,
    }]
    : undefined;

  // testID（统一规范）
  const computedTestID = buildTestID('Container', props.testID);

  if (scrollable) {
    // 组合内容层 padding：props 优先，其次来自 style 的 padding
    const contentPaddingStyle: ViewStyle = { ...paddingOnly };
    if (flattened) {
      if (flattened.padding !== undefined) contentPaddingStyle.padding = flattened.padding;
      if (flattened.paddingTop !== undefined) contentPaddingStyle.paddingTop = flattened.paddingTop;
      if (flattened.paddingBottom !== undefined) contentPaddingStyle.paddingBottom = flattened.paddingBottom;
      if (flattened.paddingLeft !== undefined) contentPaddingStyle.paddingLeft = flattened.paddingLeft;
      if (flattened.paddingRight !== undefined) contentPaddingStyle.paddingRight = flattened.paddingRight;
    }

    return (
      <ScrollView
        // 单独属性优先：外部 style 放前面，基础样式放后面
        style={[styleWithoutPadding, baseContainerStyle]}
        contentContainerStyle={contentPaddingStyle}
        keyboardShouldPersistTaps={dismissKeyboardOnTapOutside ? 'handled' : undefined}
        onScrollBeginDrag={dismissKeyboardOnTapOutside ? Keyboard.dismiss : undefined}
        testID={computedTestID}
        showsVerticalScrollIndicator={false}
        {...scrollViewProps}
      >
        {children}
      </ScrollView>
    );
  }

  if (dismissKeyboardOnTapOutside) {
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        {/* 单独属性优先：外部 style 放前，基础样式与 padding 在后 */}
        <View style={[style, baseContainerStyle, paddingOnly]} testID={computedTestID}>
          {children}
        </View>
      </TouchableWithoutFeedback>
    );
  }

  return (
    // 单独属性优先：外部 style 放前，基础样式与 padding 在后
    <View style={[style, baseContainerStyle, paddingOnly]} testID={computedTestID}>
      {children}
    </View>
  );
};