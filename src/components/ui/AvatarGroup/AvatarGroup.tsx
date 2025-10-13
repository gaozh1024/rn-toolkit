import React, { useMemo } from 'react';
import { View, Text, ViewStyle, TextStyle } from 'react-native';
import { useTheme, useSpacingStyle, SpacingProps } from '../../../theme';
import { Avatar, AvatarSize, AvatarShape, AvatarStatus } from '../Avatar';

export interface AvatarItem { src?: string; name?: string; status?: AvatarStatus }
export interface AvatarGroupProps extends SpacingProps {
  items: AvatarItem[];
  size?: AvatarSize;
  shape?: AvatarShape;
  max?: number;
  overlap?: number;
  style?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle | TextStyle[];
  testID?: string;
}

export const AvatarGroup: React.FC<AvatarGroupProps> = ({
  items,
  size = 'medium',
  shape = 'circle',
  max,
  overlap,
  style,
  textStyle,
  testID,
  ...props
}) => {
  const { theme } = useTheme();
  const colors = theme.colors;

  const px = useMemo(() => {
    if (typeof size === 'number') return size;
    return size === 'small' ? 28 : size === 'large' ? 44 : 36;
  }, [size]);

  const step = overlap != null ? overlap : Math.floor(px * 0.35);
  const spacingStyle = useSpacingStyle(props);

  const visible = useMemo(() => {
    if (!max || max <= 0) return items;
    return items.slice(0, max);
  }, [items, max]);

  const extraCount = items.length - visible.length;

  return (
    <View style={[{ flexDirection: 'row', alignItems: 'center' }, spacingStyle, style]} testID={testID}>
      {visible.map((it, idx) => (
        <View key={`av-${idx}`} style={{ marginLeft: idx === 0 ? 0 : -step, zIndex: idx + 1 }}>
          <Avatar src={it.src} name={it.name} status={it.status} size={px} shape={shape} textStyle={textStyle} />
        </View>
      ))}
      {extraCount > 0 && (
        <View style={{ marginLeft: visible.length === 0 ? 0 : -step, zIndex: visible.length + 1 }}>
          <View style={{ width: px, height: px, borderRadius: shape === 'circle' ? px/2 : shape === 'rounded' ? theme.borderRadius.md : 0, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border }}>
            <Text style={{ color: colors.text, fontSize: Math.max(12, Math.floor(px * 0.34)), fontWeight: '600' }}>+{extraCount}</Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default AvatarGroup;