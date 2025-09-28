import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { CustomTabButtonProps } from '../types';
import { useBottomSafeArea } from '../hooks/useSafeArea';
import { Icon, Text } from '../../components/ui';

export const CustomTabButton: React.FC<CustomTabButtonProps> = ({
  focused,
  label,
  iconName,
  activeIconName,
  iconSize = 24,
  badge,
  badgeColor = '#FF3B30',
  activeColor = '#007AFF',
  inactiveColor = '#8E8E93',
  onPress,
  children,
}) => {
  const bottomSafeArea = useBottomSafeArea();
  const tintColor = focused ? activeColor : inactiveColor;
  const displayIconName = focused ? (activeIconName || iconName) : iconName;
  console.log('Nav Tab', label, focused, activeColor)
  return (
    <TouchableOpacity
      style={[
        styles.container,
        { paddingBottom: Math.max(bottomSafeArea, 8) }
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        {/* 图标区域 */}
        <View style={styles.iconContainer}>
          {children || (
            displayIconName ? (
              <Icon name={displayIconName} size={iconSize} color={tintColor} />
            ) : (
              <View style={[
                styles.defaultIcon,
                {
                  width: iconSize,
                  height: iconSize,
                  backgroundColor: tintColor,
                }
              ]} />
            )
          )}

          {/* 徽章 */}
          {badge && (
            <View style={[styles.badge, { backgroundColor: badgeColor }]}>
              <Text style={styles.badgeText}>{badge}</Text>
            </View>
          )}
        </View>

        {/* 标签 */}
        {label && (
          <Text style={[styles.label, { color: tintColor }]}>
            {label}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 8,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    position: 'relative',
    marginBottom: 4,
  },
  defaultIcon: {
    borderRadius: 4,
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -6,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
  },
});