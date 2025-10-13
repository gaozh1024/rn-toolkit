import React from 'react';
import { Text, Pressable } from 'react-native';
import { getIconfontChar, getIconfontFamily } from './IconfontRegistry';

export type IconfontRendererProps = {
  name: string;
  size?: number;
  color?: string;
  style?: any;
  onPress?: () => void;
  testID?: string;
  accessibilityLabel?: string;
};

const IconfontRenderer: React.FC<IconfontRendererProps> = ({ name, size = 24, color = '#333', style, onPress, testID, accessibilityLabel }) => {
  const char = getIconfontChar(name);
  if (!char) {
    console.warn(`iconfont: 未找到图标名称 "${name}"，请确认 iconfont.json 的 glyphs.font_class 或设置别名映射`);
    return null;
  }
  const node = (
    <Text
      testID={testID}
      accessibilityLabel={accessibilityLabel || `${name} icon`}
      style={[{ fontFamily: getIconfontFamily(), fontSize: size, color }, style]}
    >
      {char}
    </Text>
  );
  return onPress ? <Pressable onPress={onPress}>{node}</Pressable> : node;
};

export default IconfontRenderer;