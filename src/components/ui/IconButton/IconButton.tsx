import React from 'react';
import { Pressable, ViewStyle, Insets } from 'react-native';
import { Icon, IconType } from '../Icon';
import { useTheme, useThemeColors } from '../../../theme';

export interface IconButtonProps {
  name: string;
  type?: IconType;
  size?: number; // 图标尺寸（px）
  color?: 'primary' | 'secondary' | 'text' | 'textSecondary' | 'textDisabled' | 'error' | 'warning' | 'success' | 'info' | string;
  variant?: 'filled' | 'ghost' | 'outline';
  disabled?: boolean;
  onPress?: () => void;
  style?: ViewStyle | ViewStyle[];
  hitSlop?: Insets;
  accessibilityLabel?: string;
  testID?: string;
}

const IconButton: React.FC<IconButtonProps> = ({
  name,
  type = 'ionicons',
  size = 20,
  color = 'text',
  variant = 'ghost',
  disabled = false,
  onPress,
  style,
  hitSlop,
  accessibilityLabel,
  testID,
}) => {
  const { theme } = useTheme();
  const colors = useThemeColors();

  const getContainerStyle = (): ViewStyle => {
    const base: ViewStyle = {
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: 40,
      minHeight: 40,
      paddingHorizontal: (theme.spacing as any)?.xs ?? 8,
      paddingVertical: (theme.spacing as any)?.xs ?? 8,
      borderRadius: theme.borderRadius?.md ?? 8,
      opacity: disabled ? 0.6 : 1,
    };

    switch (variant) {
      case 'filled':
        return {
          ...base,
          backgroundColor: (colors as any).surface ?? '#F2F3F5',
          borderWidth: 0,
        };
      case 'outline':
        return {
          ...base,
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: (colors as any).border ?? '#DADDE2',
        };
      case 'ghost':
      default:
        return {
          ...base,
          backgroundColor: 'transparent',
          borderWidth: 0,
        };
    }
  };

  const containerStyle = getContainerStyle();

  return (
    <Pressable
      testID={testID}
      accessible
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || `${name} icon button`}
      disabled={disabled}
      onPress={disabled ? undefined : onPress}
      hitSlop={hitSlop}
      style={[containerStyle, style]}
    >
      <Icon name={name} type={type} size={size} color={disabled ? 'textDisabled' : color} />
    </Pressable>
  );
};

export default IconButton;