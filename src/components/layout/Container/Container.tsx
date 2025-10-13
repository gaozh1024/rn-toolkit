import React from 'react';
import { View, ViewStyle, StyleProp, ScrollView, StyleSheet, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useTheme } from '../../../theme/hooks';

export interface ContainerProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  backgroundColor?: string;
  padding?: number | { top?: number; bottom?: number; left?: number; right?: number };
  margin?: number | { top?: number; bottom?: number; left?: number; right?: number };
  flex?: number;
  scrollable?: boolean;
  scrollViewProps?: React.ComponentProps<typeof ScrollView>;
  testID?: string;
  transparent?: boolean; // 背景透明（已添加）
  dismissKeyboardOnTapOutside?: boolean; // 新增：点击空白处收起键盘
}

export const Container: React.FC<ContainerProps> = ({
  children,
  style,
  backgroundColor,
  padding = 0,
  margin = 0,
  flex = 1,
  scrollable = false,
  scrollViewProps,
  testID,
  transparent = false,
  dismissKeyboardOnTapOutside = false,
}) => {
  const { theme } = useTheme();
  const colors = theme.colors;

  const paddingStyle = typeof padding === 'number'
    ? { padding }
    : {
      paddingTop: padding.top,
      paddingBottom: padding.bottom,
      paddingLeft: padding.left,
      paddingRight: padding.right,
    };

  const marginStyle = typeof margin === 'number'
    ? { margin }
    : {
      marginTop: margin.top,
      marginBottom: margin.bottom,
      marginLeft: margin.left,
      marginRight: margin.right,
    };

  const viewStyle: ViewStyle = {
    flex,
    backgroundColor: transparent ? 'transparent' : (backgroundColor || colors.background),
    ...marginStyle,
  };

  // 从 props.padding 构建内容层内边距
  let contentPaddingStyle: ViewStyle = { ...paddingStyle };

  // 若用户在 style 中设置了 padding，滚动模式下将其转移到 contentContainerStyle
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

  if (flattened) {
    if (flattened.padding !== undefined) contentPaddingStyle.padding = flattened.padding;
    if (flattened.paddingTop !== undefined) contentPaddingStyle.paddingTop = flattened.paddingTop;
    if (flattened.paddingBottom !== undefined) contentPaddingStyle.paddingBottom = flattened.paddingBottom;
    if (flattened.paddingLeft !== undefined) contentPaddingStyle.paddingLeft = flattened.paddingLeft;
    if (flattened.paddingRight !== undefined) contentPaddingStyle.paddingRight = flattened.paddingRight;
  }

  if (scrollable) {
    return (
      <ScrollView
        style={[viewStyle, styleWithoutPadding]}
        contentContainerStyle={contentPaddingStyle}
        keyboardShouldPersistTaps={dismissKeyboardOnTapOutside ? 'handled' : undefined}
        onScrollBeginDrag={dismissKeyboardOnTapOutside ? Keyboard.dismiss : undefined}
        testID={testID}
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
        <View style={[viewStyle, contentPaddingStyle, style]} testID={testID}>
          {children}
        </View>
      </TouchableWithoutFeedback>
    );
  }

  return (
    <View style={[viewStyle, contentPaddingStyle, style]} testID={testID}>
      {children}
    </View>
  );
};