import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { CustomTabButtonProps } from '../types';
import { useBottomSafeArea } from '../hooks/useSafeArea';

export const CustomTabButton: React.FC<CustomTabButtonProps> = ({
  focused,
  label,
  iconName,
  iconSize = 24,
  badge,
  badgeColor = '#FF3B30',
  onPress,
  children,
}) => {
  const bottomSafeArea = useBottomSafeArea();
  
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
            <View style={[
              styles.defaultIcon,
              { 
                width: iconSize, 
                height: iconSize,
                backgroundColor: focused ? '#007AFF' : '#8E8E93'
              }
            ]} />
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
          <Text style={[
            styles.label,
            { color: focused ? '#007AFF' : '#8E8E93' }
          ]}>
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