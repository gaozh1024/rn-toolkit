// Container 组件（新增：forwardRef 暴露 scrollToBottom；新增 defaultScrollToBottom）
import React from 'react';
import { View, ViewStyle, StyleProp, ScrollView, StyleSheet, TouchableWithoutFeedback, Keyboard, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
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
  defaultScrollToBottom?: boolean; // 新增：是否默认滚动到最底部
}

export interface ContainerHandle {
  scrollToBottom: (animated?: boolean) => void;
}

export const Container = React.forwardRef<ContainerHandle, ContainerProps>(function Container(
  {
    children,
    style,
    scrollable = false,
    scrollViewProps,
    dismissKeyboardOnTapOutside = false,
    defaultScrollToBottom = false,
    ...props
  },
  ref
) {
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

  // === 新增：滚动到底部能力 ===
  const SCROLL_BOTTOM_THRESHOLD = 100;
  const scrollViewRef = React.useRef<ScrollView>(null);
  const stickToBottomRef = React.useRef<boolean>(!!defaultScrollToBottom);
  const didInitialAutoScrollRef = React.useRef<boolean>(false);

  const scrollToBottom = (animated: boolean = true) => {
    scrollViewRef.current?.scrollToEnd({ animated });
  };

  React.useImperativeHandle(ref, () => ({
    scrollToBottom,
  }), []);

  if (scrollable) {
    // 组合内容层 padding：props 优先，其次来自 style 的 padding（保留原逻辑）
    const contentPaddingStyle: ViewStyle = { ...paddingOnly };
    if (flattened) {
      if (flattened.padding !== undefined) contentPaddingStyle.padding = flattened.padding;
      if (flattened.paddingTop !== undefined) contentPaddingStyle.paddingTop = flattened.paddingTop;
      if (flattened.paddingBottom !== undefined) contentPaddingStyle.paddingBottom = flattened.paddingBottom;
      if (flattened.paddingLeft !== undefined) contentPaddingStyle.paddingLeft = flattened.paddingLeft;
      if (flattened.paddingRight !== undefined) contentPaddingStyle.paddingRight = flattened.paddingRight;
    }

    const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const { contentSize, layoutMeasurement, contentOffset } = e.nativeEvent;
      const distanceFromBottom = contentSize.height - (contentOffset.y + layoutMeasurement.height);
      stickToBottomRef.current = distanceFromBottom <= SCROLL_BOTTOM_THRESHOLD;
      // 透传用户自定义 onScroll
      scrollViewProps?.onScroll?.(e);
    };

    const handleContentSizeChange = (w: number, h: number) => {
      // 首次内容测量后，根据 defaultScrollToBottom 决定是否滚到底部
      if (defaultScrollToBottom && !didInitialAutoScrollRef.current) {
        didInitialAutoScrollRef.current = true;
        scrollToBottom(false);
      } else if (stickToBottomRef.current) {
        // 接近底部时自动保持在底部
        scrollToBottom(true);
      }
      // 透传用户自定义 onContentSizeChange
      scrollViewProps?.onContentSizeChange?.(w, h);
    };

    return (
      <ScrollView
        ref={scrollViewRef}
        // 单独属性优先：外部 style 放前面，基础样式放后面
        style={[styleWithoutPadding, baseContainerStyle]}
        contentContainerStyle={contentPaddingStyle}
        keyboardShouldPersistTaps={dismissKeyboardOnTapOutside ? 'handled' : undefined}
        onScrollBeginDrag={dismissKeyboardOnTapOutside ? Keyboard.dismiss : undefined}
        onScroll={handleScroll}
        onContentSizeChange={handleContentSizeChange}
        scrollEventThrottle={16}
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
});