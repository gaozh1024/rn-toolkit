// Container 组件（新增：forwardRef 暴露 scrollToBottom；新增 defaultScrollToBottom）
import React from 'react';
import { View, ViewStyle, StyleProp, ScrollView, StyleSheet, TouchableWithoutFeedback, Keyboard, NativeSyntheticEvent, NativeScrollEvent, RefreshControl } from 'react-native';
import { useTheme } from '../../../theme/hooks';
import { SpacingProps, useSpacingStyle } from '../../../theme';
import { BackgroundProps, buildBackgroundStyle, buildTestID, TestableProps } from '../../common';

export interface ContainerProps extends SpacingProps, BackgroundProps, TestableProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  scrollable?: boolean;// 是否可滚动（默认 false）
  scrollViewProps?: React.ComponentProps<typeof ScrollView>;// 滚动视图属性
  dismissKeyboardOnTapOutside?: boolean;// 是否点击外部关闭键盘（默认 false）
  flex?: number;//  flex 比例（默认 1）
  defaultScrollToBottom?: boolean; // 是否默认滚动到最底部
  onReachBottom?: () => void;      // 上拉触底回调（上拉刷新/加载更多）
  reachBottomThreshold?: number;   // 触发阈值（距离底部像素）
  isLoadingMore?: boolean;         // 父组件控制加载中，避免重复触发
  pullToRefresh?: boolean;// 是否开启下拉刷新（默认 false）
  refreshing?: boolean;// 是否正在刷新（下拉刷新时使用）
  onRefresh?: () => void;// 下拉刷新回调
  refreshControlProps?: React.ComponentProps<typeof RefreshControl>;// 下拉刷新组件属性
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
    onReachBottom,
    reachBottomThreshold = 80,
    isLoadingMore = false,
    pullToRefresh = false,
    refreshing = false,
    onRefresh,
    refreshControlProps,
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
  const lastContentHeightRef = React.useRef<number>(0);      // 新增：记录内容高度
  const reachBottomTriggeredRef = React.useRef<boolean>(false); // 新增：触底触发锁

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

      // 新增：上拉触底检测（只在内容高度大于容器高度时有效）
      if (onReachBottom) {
        const nearBottom = distanceFromBottom <= reachBottomThreshold;
        if (
          nearBottom &&
          !isLoadingMore &&
          !reachBottomTriggeredRef.current &&
          contentSize.height > layoutMeasurement.height
        ) {
          reachBottomTriggeredRef.current = true;
          onReachBottom();
        }
      }

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

      // 新增：内容高度增长后，重置触底触发锁，允许再次触发
      if (h > lastContentHeightRef.current) {
        reachBottomTriggeredRef.current = false;
      }
      lastContentHeightRef.current = h;

      // 透传用户自定义 onContentSizeChange
      scrollViewProps?.onContentSizeChange?.(w, h);
    };

    const refreshControlElement = pullToRefresh
      ? (
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh ?? (() => { })}
          {...refreshControlProps}
        />
      )
      : scrollViewProps?.refreshControl;

    return (
      <ScrollView
        ref={scrollViewRef}
        {...scrollViewProps}
        style={[styleWithoutPadding, baseContainerStyle]}
        contentContainerStyle={contentPaddingStyle}
        keyboardShouldPersistTaps={dismissKeyboardOnTapOutside ? 'handled' : undefined}
        onScrollBeginDrag={dismissKeyboardOnTapOutside ? Keyboard.dismiss : undefined}
        onScroll={handleScroll}
        onContentSizeChange={handleContentSizeChange}
        scrollEventThrottle={16}
        testID={computedTestID}
        showsVerticalScrollIndicator={false}
        refreshControl={refreshControlElement}
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