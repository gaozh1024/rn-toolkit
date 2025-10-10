import React, { useMemo } from 'react';
import { View, ViewStyle } from 'react-native';
import { useTheme } from '../../../theme';

export type DividerOrientation = 'horizontal' | 'vertical';
export type DividerColor = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'text' | 'subtext' | 'border' | 'divider' | string;

export interface DividerProps {
  orientation?: DividerOrientation;
  color?: DividerColor;
  thickness?: number;
  inset?: number | { start?: number; end?: number };
  style?: ViewStyle | ViewStyle[];
  testID?: string;
}

const Divider: React.FC<DividerProps> = ({
  orientation = 'horizontal',
  color = 'divider',
  thickness = 1,
  inset = 0,
  style,
  testID,
}) => {
  const { theme } = useTheme();
  const colors = theme.colors as any;

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

  return <View style={[containerStyle, style]} testID={testID} />;
};

export default Divider;
export { Divider };