import React from 'react';
import { View, ViewStyle, StyleProp, TouchableOpacity } from 'react-native';
import { useSpacingStyle, SpacingProps } from '../../../theme';
import { BoxProps, PressEvents, TestableProps, buildTestID, buildBoxStyle } from '../../common';

export interface StackProps extends SpacingProps, TestableProps, PressEvents, BoxProps {
  children?: React.ReactNode;
  direction?: 'row' | 'column';
  gap?: number;
  align?: ViewStyle['alignItems'];
  justify?: ViewStyle['justifyContent'];
  wrap?: ViewStyle['flexWrap'];
  style?: StyleProp<ViewStyle>;
  flex?: number;
  fullWidth?: boolean;
  fullHeight?: boolean;
  divider?: React.ReactNode;
  testID?: string;
  disabled?: boolean;
}

/**
 * Stack 组件：用于构建行/列布局容器。
 *
 * 功能：
 * - 支持 `direction`、`gap`、`align`、`justify`、`wrap` 等布局属性。
 * - 支持 `BoxProps` 的宽高（width/height）等尺寸属性，通过 `buildBoxStyle` 应用。
 * - 支持点击事件与测试标识。
 */
export const Stack: React.FC<StackProps> = ({
  children = null,
  direction = 'column',
  gap,
  align = 'stretch',
  justify = 'flex-start',
  wrap = 'nowrap',
  style,
  flex,
  fullWidth,
  fullHeight,
  divider,
  testID,
  onPress,
  disabled,
  ...props
}) => {
  const containerStyle: ViewStyle = {
    flexDirection: direction,
    alignItems: align,
    justifyContent: justify,
    flexWrap: wrap,
    ...(gap != null ? { gap } : {}),
    ...(flex != null ? { flex } : {}),
    ...(fullWidth ? { width: '100%' } : {}),
    ...(fullHeight ? { height: '100%' } : {}),
  };

  const spacingStyle = useSpacingStyle(props);
  const finalTestID = buildTestID('Stack', testID);
  const boxStyle = buildBoxStyle({ defaultBackground: 'transparent' }, props, containerStyle);
  let content: React.ReactNode = children;

  // 若传入 divider，则在子元素之间插入分隔节点；否则使用 gap 控制间距
  if (divider) {
    const items = React.Children.toArray(children).filter(Boolean);
    const interleaved: React.ReactNode[] = [];
    items.forEach((child, i) => {
      interleaved.push(child);
      if (i < items.length - 1) {
        interleaved.push(
          React.isValidElement(divider)
            ? React.cloneElement(divider as any, { key: `divider-${i}` })
            : divider
        );
      }
    });
    content = interleaved;
  }

  if (onPress) {
    return (
      <TouchableOpacity
        style={[boxStyle, spacingStyle, style]}
        onPress={onPress}
        disabled={disabled}
        activeOpacity={0.7}
        testID={finalTestID}
      >
        {content}
      </TouchableOpacity>
    );
  }

  return (
    <View style={[boxStyle, spacingStyle, style]} testID={finalTestID}>
      {content}
    </View>
  );
};

export type RowProps = Omit<StackProps, 'direction'>;
/**
 * Row 组件：`Stack` 的行方向快捷封装。
 */
export const Row: React.FC<RowProps> = ({ children, ...props }) => (
  <Stack direction="row" {...props}>{children}</Stack>
);

export type ColProps = Omit<StackProps, 'direction'>;
/**
 * Col 组件：`Stack` 的列方向快捷封装。
 */
export const Col: React.FC<ColProps> = ({ children, ...props }) => (
  <Stack direction="column" {...props}>{children}</Stack>
);

export type { StackProps as IStackProps };