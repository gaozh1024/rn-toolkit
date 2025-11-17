import React, { useMemo } from 'react';
import { View, ViewStyle, StyleProp, Text, TextStyle } from 'react-native';
import { useTheme, useSpacingStyle, SpacingProps } from '../../../theme';
import { buildTestID, TestableProps } from '../../common/test';

export type DividerOrientation = 'horizontal' | 'vertical';
export type DividerColor = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'text' | 'subtext' | 'border' | 'divider' | string;

export interface DividerProps extends SpacingProps, TestableProps {
  orientation?: DividerOrientation;
  color?: DividerColor;
  thickness?: number;
  inset?: number | { start?: number; end?: number };
  style?: StyleProp<ViewStyle>;
  testID?: string;
  /** 中间标题文案（简单场景） */
  title?: string;
  /** 中间标题自定义节点（复杂场景，优先于 title） */
  titleNode?: React.ReactNode;
  /** 标题样式（颜色/字号/字重等） */
  titleStyle?: StyleProp<TextStyle>;
  /** 标题与左右/上下线的间距 */
  titleSpacing?: number;
}

const Divider: React.FC<DividerProps> = ({
  orientation = 'horizontal',
  color = 'divider',
  thickness = 1,
  inset = 0,
  style,
  testID,
  title,
  titleNode,
  titleStyle,
  titleSpacing = 8,
  ...props
}) => {
  /**
   * 函数注释：Divider（支持中间标题/自定义节点）
   * - 未传 title/titleNode：渲染纯线条。
   * - 横向：左线 + 标题 + 右线；纵向：上线 + 标题 + 下线。
   * - 主题色与间距遵循现有规则，inset 控制线条的起止边距。
   */
  const { theme } = useTheme();
  const colors = theme.colors as any;
  const spacingStyle = useSpacingStyle(props);
  const computedTestID = buildTestID('Divider', testID);

  const getThemeColor = (c: DividerColor): string => {
    if (typeof c !== 'string') return colors.divider;
    const key = c.trim();
    if (Object.prototype.hasOwnProperty.call(colors, key)) return colors[key];
    return key;
  };

  const lineColor = getThemeColor(color);
  const { startInset, endInset } = useMemo(() => {
    if (typeof inset === 'number') return { startInset: inset, endInset: 0 };
    return { startInset: inset?.start ?? 0, endInset: inset?.end ?? 0 };
  }, [inset]);

  const hasTitleContent = !!titleNode || !!title;

  // 纯线条渲染（无标题）
  if (!hasTitleContent) {
    const horizontalStyle: ViewStyle = {
      height: thickness,
      alignSelf: 'stretch',
      backgroundColor: lineColor,
      marginLeft: startInset,
      marginRight: endInset,
    };
    const verticalStyle: ViewStyle = {
      width: thickness,
      alignSelf: 'stretch',
      backgroundColor: lineColor,
      marginTop: startInset,
      marginBottom: endInset,
    };
    const containerStyle = orientation === 'vertical' ? verticalStyle : horizontalStyle;
    return <View style={[spacingStyle, containerStyle, style]} testID={computedTestID} />;
  }

  // 带标题的渲染
  const renderTitle = () => {
    if (titleNode) return titleNode;
    return <Text style={[{ color: colors.text }, titleStyle]}>{title}</Text>;
  };

  if (orientation === 'horizontal') {
    const rowStyle: ViewStyle = {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'stretch',
      marginLeft: startInset,
      marginRight: endInset,
    };
    const lineStyle: ViewStyle = { flex: 1, height: thickness, backgroundColor: lineColor };
    return (
      <View style={[spacingStyle, rowStyle, style]} testID={computedTestID}>
        <View style={lineStyle} />
        <View style={{ marginHorizontal: titleSpacing }}>{renderTitle()}</View>
        <View style={lineStyle} />
      </View>
    );
  }

  const colStyle: ViewStyle = {
    flexDirection: 'column',
    alignItems: 'center',
    alignSelf: 'stretch',
    marginTop: startInset,
    marginBottom: endInset,
  };
  const vLineStyle: ViewStyle = { flex: 1, width: thickness, backgroundColor: lineColor };
  return (
    <View style={[spacingStyle, colStyle, style]} testID={computedTestID}>
      <View style={vLineStyle} />
      <View style={{ marginVertical: titleSpacing }}>{renderTitle()}</View>
      <View style={vLineStyle} />
    </View>
  );
};

export default Divider;
export { Divider };