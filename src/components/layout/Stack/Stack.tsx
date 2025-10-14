import React from 'react';
import { View, ViewStyle, StyleProp } from 'react-native';
import { useSpacingStyle, SpacingProps } from '../../../theme';
import { TestableProps, buildTestID } from '../../common/test';

export interface StackProps extends SpacingProps, TestableProps {
  children: React.ReactNode;
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
}

export const Stack: React.FC<StackProps> = ({
  children,
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

  return (
    <View style={[containerStyle, spacingStyle, style]} testID={finalTestID}>
      {content}
    </View>
  );
};

export type { StackProps as IStackProps };