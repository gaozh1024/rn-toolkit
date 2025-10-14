import React, { useMemo } from 'react';
import { View, Text, ViewStyle, TextStyle, StyleSheet } from 'react-native';
import { useTheme, useSpacingStyle, SpacingProps } from '../../../theme';
import { Avatar, AvatarSize, AvatarShape, AvatarStatus } from '../Avatar';
import { buildTestID, TestableProps } from '../../common/test';
import { buildBoxStyle, BoxProps } from '../../common/box';

export interface AvatarItem { src?: string; name?: string; status?: AvatarStatus }
export interface AvatarGroupProps extends SpacingProps, BoxProps, TestableProps {
  items: AvatarItem[];
  size?: AvatarSize;
  shape?: AvatarShape;
  max?: number;
  overlap?: number;
  style?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle | TextStyle[];
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

  // 公共 spacing：使用 SpacingProps 转换为样式
  const spacingStyle = useSpacingStyle(props);

  // 公共 test：规范化 testID
  const id = buildTestID('AvatarGroup', testID);

  // 公共 box：将外部 style 扁平化为 overrides，单独属性在 buildBoxStyle 中覆盖它
  const styleOverrides = StyleSheet.flatten(style as any);
  const containerBoxStyle = buildBoxStyle(
    { defaultBackground: 'transparent' },
    props,
    styleOverrides,
  );

  const visible = useMemo(() => {
    if (!max || max <= 0) return items;
    return items.slice(0, max);
  }, [items, max]);

  const extraCount = items.length - visible.length;

  return (
    <View
      style={[containerBoxStyle, spacingStyle, { flexDirection: 'row', alignItems: 'center' }]}
      testID={id}
    >
      {visible.map((it, idx) => (
        <View key={`av-${idx}`} style={{ marginLeft: idx === 0 ? 0 : -step, zIndex: idx + 1 }}>
          <Avatar src={it.src} name={it.name} status={it.status} size={px} shape={shape} textStyle={textStyle} />
        </View>
      ))}
      {extraCount > 0 && (
        <View style={{ marginLeft: visible.length === 0 ? 0 : -step, zIndex: visible.length + 1 }}>
          {(() => {
            const tileRadius = shape === 'circle' ? px / 2 : shape === 'rounded' ? theme.borderRadius.md : 0;
            const plusTileStyle = buildBoxStyle(
              { defaultBackground: colors.card },
              { width: px, height: px, borderRadius: tileRadius, borderWidth: 1, borderColor: colors.border },
            );
            return (
              <View style={[plusTileStyle, { alignItems: 'center', justifyContent: 'center' }]}>
                <Text style={{ color: colors.text, fontSize: Math.max(12, Math.floor(px * 0.34)), fontWeight: '600' }}>
                  +{extraCount}
                </Text>
              </View>
            );
          })()}
        </View>
      )}
    </View>
  );
};

export default AvatarGroup;