import React from 'react';
import { Pressable, View, ViewStyle, Animated } from 'react-native';
import { useTheme } from '../../../theme';
import { useColorInterpolation } from '../../../animation';

export type SwitchSize = 'small' | 'medium' | 'large' | number;
export type SwitchColor = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | string;

export interface SwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
  size?: SwitchSize;
  color?: SwitchColor;
  style?: ViewStyle | ViewStyle[];
  testID?: string;
}

const Switch: React.FC<SwitchProps> = ({
  value,
  onValueChange,
  disabled = false,
  size = 'medium',
  color = 'primary',
  style,
  testID,
}) => {
  const { theme } = useTheme();
  const colors = theme.colors;

  const trackHeight = typeof size === 'number' ? size : size === 'small' ? 20 : size === 'large' ? 28 : 24;
  const trackWidth = Math.round(trackHeight * 1.8);
  const borderRadius = trackHeight / 2;
  const thumbSize = trackHeight - 4;
  const thumbRadius = thumbSize / 2;

  // 新增：归一化进度值（0→1）
  const progress = React.useRef(new Animated.Value(value ? 1 : 0)).current;
  React.useEffect(() => {
    Animated.timing(progress, {
      toValue: value ? 1 : 0,
      duration: 180,
      useNativeDriver: true,
    }).start();
  }, [value, progress]);

  const getThemeColor = (c: SwitchColor): string => {
    const preset = ['primary', 'secondary', 'success', 'warning', 'error', 'info'] as const;
    if (preset.includes(c as any)) return colors[c as keyof typeof colors] as string;
    return c as string;
  };

  const activeColor = getThemeColor(color);
  const inactiveColor = colors.border;
  const disabledTrackColor = colors.textDisabled;
  // 更新：轨道颜色做插值（禁用时保持静态）
  const trackColor = disabled
    ? disabledTrackColor
    : useColorInterpolation(progress, [0, 1], [inactiveColor, activeColor]);
  const thumbColor = disabled ? '#F2F2F2' : '#FFFFFF';

  const padding = 2;
  const maxTranslateX = trackWidth - thumbSize - padding;

  const trackStyle: ViewStyle = {
    width: trackWidth,
    height: trackHeight,
    borderRadius,
    backgroundColor: trackColor as any,
    justifyContent: 'center',
  };

  // 更新：thumb 使用 Animated 平移与轻微缩放
  const thumbStyle: ViewStyle = {
    width: thumbSize,
    height: thumbSize,
    borderRadius: thumbRadius,
    backgroundColor: thumbColor,
    transform: [
      {
        translateX: progress.interpolate({
          inputRange: [0, 1],
          outputRange: [padding, maxTranslateX],
        }),
      },
      {
        scale: progress.interpolate({ inputRange: [0, 1], outputRange: [0.98, 1] }),
      },
    ],
    shadowColor: colors.shadow,
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 2,
  };

  const handlePress = () => {
    if (disabled) return;
    onValueChange(!value);
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        { opacity: disabled ? 0.7 : 1 },
        // 如需完全移除按压态视觉，可删除下一行
        pressed && !disabled ? { opacity: 0.85 } : {},
        style,
      ]}
      accessibilityRole="switch"
      accessibilityState={{ checked: value, disabled }}
      testID={testID}
    >
      <View style={trackStyle}>
        <Animated.View style={thumbStyle} />
      </View>
    </Pressable>
  );
};

export default Switch;