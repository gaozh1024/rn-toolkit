import React from 'react';
import { Platform, TouchableOpacity, View, StyleSheet } from 'react-native';
import { StackNavigationOptions } from '@react-navigation/stack';
import { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { Icon, Text } from '../../components/ui';

/**
 * 自定义无水滴效果的标签页按钮组件
 */
const RippleFreeTabButton = React.forwardRef<any, any>((props, ref) => {
  const { children, onPress, onLongPress, testID, accessibilityLabel, accessibilityRole, accessibilityState, style, ...restProps } = props;

  if (Platform.OS === 'android') {
    // Android 使用 TouchableOpacity 避免水滴效果
    return (
      <TouchableOpacity
        ref={ref}
        onPress={onPress}
        onLongPress={onLongPress}
        testID={testID}
        accessibilityLabel={accessibilityLabel}
        accessibilityRole={accessibilityRole}
        accessibilityState={accessibilityState}
        style={style}
        activeOpacity={0.6}
        {...restProps}
      >
        {children}
      </TouchableOpacity>
    );
  }

  // iOS 使用默认的 TouchableOpacity
  return (
    <TouchableOpacity
      ref={ref}
      onPress={onPress}
      onLongPress={onLongPress}
      testID={testID}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole={accessibilityRole}
      accessibilityState={accessibilityState}
      style={style}
      activeOpacity={0.6}
      {...restProps}
    >
      {children}
    </TouchableOpacity>
  );
});

RippleFreeTabButton.displayName = 'RippleFreeTabButton';

/**
 * 堆栈导航预设选项
 */
export const StackPresets = {
  /**
   * 默认堆栈选项 - 无水滴效果
   */
  default: {
    headerPressColor: 'transparent',
    headerPressOpacity: 0.6,
    headerTitleAlign: 'center' as const,
    headerBackTitleVisible: false,
  } as StackNavigationOptions,

  /**
   * 模态样式堆栈选项
   */
  modal: {
    presentation: 'modal' as const,
    headerShown: false,
    gestureEnabled: true,
    cardOverlayEnabled: true,
  } as StackNavigationOptions,

  /**
   * 卡片样式 (类似全屏模态)
   */
  card: {
    presentation: 'card' as const,
    headerShown: false,
    gestureEnabled: Platform.OS === 'ios',
    animationEnabled: true,
  } as StackNavigationOptions,

  /**
   * 透明模态样式
   */
  transparentModal: {
    presentation: 'transparentModal' as const,
    headerShown: false,
    cardOverlayEnabled: true,
    cardStyle: { backgroundColor: 'transparent' },
  } as StackNavigationOptions,
};

/**
 * 使用 UI 组件的自定义标签页按钮
 */
export const CustomTabButton = React.forwardRef<any, any>((props, ref) => {
  const {
    children,
    onPress,
    onLongPress,
    testID,
    accessibilityLabel,
    accessibilityRole,
    accessibilityState,
    style,
    ...restProps
  } = props;

  return (
    <TouchableOpacity
      ref={ref}
      onPress={onPress}
      onLongPress={onLongPress}
      testID={testID}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole={accessibilityRole}
      accessibilityState={accessibilityState}
      style={[styles.tabButton, style]}
      activeOpacity={0.6}
      {...restProps}
    >
      <View style={styles.tabButtonContent}>
        {children}
      </View>
    </TouchableOpacity>
  );
});

CustomTabButton.displayName = 'CustomTabButton';

/**
 * 增强的标签页按钮，支持图标和文本
 */
export const EnhancedTabButton = React.forwardRef<any, any>((props, ref) => {
  const {
    children,
    onPress,
    onLongPress,
    testID,
    accessibilityLabel,
    accessibilityRole,
    accessibilityState,
    style,
    // 自定义属性
    iconName,
    iconSize = 24,
    iconColor,
    label,
    labelColor,
    labelSize = 12,
    showLabel = true,
    badge,
    badgeColor = '#FF3B30',
    focused = false,
    ...restProps
  } = props;

  // 如果有自定义图标和标签，使用增强模式
  if (iconName || label) {
    return (
      <TouchableOpacity
        ref={ref}
        onPress={onPress}
        onLongPress={onLongPress}
        testID={testID}
        accessibilityLabel={accessibilityLabel}
        accessibilityRole={accessibilityRole}
        accessibilityState={accessibilityState}
        style={[styles.enhancedTabButton, style]}
        activeOpacity={0.6}
        {...restProps}
      >
        <View style={styles.enhancedTabButtonContent}>
          {/* 图标 */}
          {iconName && (
            <View style={styles.iconContainer}>
              <Icon
                name={iconName}
                size={iconSize}
                color={iconColor || (focused ? '#007AFF' : '#8E8E93')}
              />
              {/* 徽章 */}
              {badge && (
                <View style={[styles.badge, { backgroundColor: badgeColor }]}>
                  <Text
                    style={styles.badgeText}
                    size={10}
                    color="white"
                    weight="medium"
                  >
                    {badge}
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* 标签 */}
          {showLabel && label && (
            <Text
              style={styles.label}
              size={labelSize}
              color={labelColor || (focused ? '#007AFF' : '#8E8E93')}
              weight={focused ? 'medium' : 'normal'}
              numberOfLines={1}
            >
              {label}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  }

  // 默认模式，直接渲染 children
  return (
    <TouchableOpacity
      ref={ref}
      onPress={onPress}
      onLongPress={onLongPress}
      testID={testID}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole={accessibilityRole}
      accessibilityState={accessibilityState}
      style={[styles.tabButton, style]}
      activeOpacity={0.6}
      {...restProps}
    >
      <View style={styles.tabButtonContent}>
        {children}
      </View>
    </TouchableOpacity>
  );
});

EnhancedTabButton.displayName = 'EnhancedTabButton';

// 样式定义
const styles = StyleSheet.create({
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabButtonContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  enhancedTabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 4,
  },
  enhancedTabButtonContent: {
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 48,
  },
  iconContainer: {
    position: 'relative',
    marginBottom: 2,
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -6,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
  },
  label: {
    marginTop: 2,
    textAlign: 'center',
  },
});

/**
 * 标签页导航预设选项
 */
export const TabPresets = {
  /**
   * 默认标签页选项 - 使用自定义按钮
   */
  default: {
    tabBarButton: (props: any) => <CustomTabButton {...props} />,
    headerShown: false,
    tabBarHideOnKeyboard: true,
    tabBarActiveTintColor: '#007AFF',
    tabBarInactiveTintColor: '#8E8E93',
  } as BottomTabNavigationOptions,

  /**
   * 带头部的标签页选项
   */
  withHeader: {
    tabBarButton: (props: any) => <CustomTabButton {...props} />,
    headerShown: true,
    tabBarHideOnKeyboard: true,
    headerTitleAlign: 'center' as const,
  } as BottomTabNavigationOptions,

  /**
   * 简约标签页选项
   */
  minimal: {
    tabBarButton: (props: any) => <CustomTabButton {...props} />,
    headerShown: false,
    tabBarShowLabel: false,
    tabBarStyle: {
      borderTopWidth: 0,
      elevation: 0,
      shadowOpacity: 0,
    },
  } as BottomTabNavigationOptions,

  /**
   * 增强标签页选项 - 支持自定义图标和文本
   */
  enhanced: {
    tabBarButton: (props: any) => <EnhancedTabButton {...props} />,
    headerShown: false,
    tabBarHideOnKeyboard: true,
    tabBarShowLabel: false, // 使用自定义标签
    tabBarActiveTintColor: '#007AFF',
    tabBarInactiveTintColor: '#8E8E93',
    tabBarStyle: {
      height: 65,
      paddingBottom: 10,
      paddingTop: 10,
      paddingHorizontal: 8,
    },
    tabBarItemStyle: {
      borderRadius: 12,
      marginHorizontal: 4,
    },
  } as BottomTabNavigationOptions,
};

/**
 * 动画预设配置
 */
export const AnimationPresets = {
  /**
   * 水平滑动 (iOS 风格)
   */
  slideHorizontal: {
    gestureEnabled: true,
    gestureDirection: 'horizontal' as const,
    transitionSpec: {
      open: {
        animation: 'spring' as const,
        config: {
          stiffness: 1000,
          damping: 500,
          mass: 3,
          overshootClamping: true,
          restDisplacementThreshold: 0.01,
          restSpeedThreshold: 0.01,
        },
      },
      close: {
        animation: 'spring' as const,
        config: {
          stiffness: 1000,
          damping: 500,
          mass: 3,
          overshootClamping: true,
          restDisplacementThreshold: 0.01,
          restSpeedThreshold: 0.01,
        },
      },
    },
  } as StackNavigationOptions,

  /**
   * 垂直滑动 (模态风格)
   */
  slideVertical: {
    gestureEnabled: true,
    gestureDirection: 'vertical' as const,
    cardStyleInterpolator: ({ current, layouts }) => ({
      cardStyle: {
        transform: [
          {
            translateY: current.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [layouts.screen.height, 0],
            }),
          },
        ],
      },
    }),
  } as StackNavigationOptions,

  /**
   * 淡入淡出
   */
  fade: {
    gestureEnabled: false,
    transitionSpec: {
      open: {
        animation: 'timing' as const,
        config: {
          duration: 300,
        },
      },
      close: {
        animation: 'timing' as const,
        config: {
          duration: 200,
        },
      },
    },
    cardStyleInterpolator: ({ current }) => ({
      cardStyle: {
        opacity: current.progress,
      },
    }),
  } as StackNavigationOptions,

  /**
   * 缩放动画
   */
  scale: {
    gestureEnabled: true,
    cardStyleInterpolator: ({ current, next }) => ({
      cardStyle: {
        transform: [
          {
            scale: current.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [0.9, 1],
            }),
          },
        ],
        opacity: current.progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 1],
        }),
      },
      overlayStyle: {
        opacity: current.progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 0.5],
        }),
      },
    }),
  } as StackNavigationOptions,

  /**
   * 无动画
   */
  none: {
    animationEnabled: false,
    gestureEnabled: false,
  } as StackNavigationOptions,
};

/**
 * 主题相关的预设选项
 */
export const ThemePresets = {
  /**
   * 亮色主题预设
   */
  light: {
    stack: {
      headerStyle: {
        backgroundColor: '#FFFFFF',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
      },
      headerTintColor: '#000000',
      headerTitleStyle: {
        fontWeight: '600' as const,
      },
    } as StackNavigationOptions,
    tab: {
      tabBarStyle: {
        backgroundColor: '#FFFFFF',
        borderTopColor: '#E5E5E7',
        borderTopWidth: 0.5,
      },
      tabBarActiveTintColor: '#007AFF',
      tabBarInactiveTintColor: '#8E8E93',
    } as BottomTabNavigationOptions,
  },

  /**
   * 暗色主题预设
   */
  dark: {
    stack: {
      headerStyle: {
        backgroundColor: '#1C1C1E',
        shadowColor: 'transparent',
        elevation: 0,
      },
      headerTintColor: '#FFFFFF',
      headerTitleStyle: {
        fontWeight: '600' as const,
        color: '#FFFFFF',
      },
    } as StackNavigationOptions,
    tab: {
      tabBarStyle: {
        backgroundColor: '#1C1C1E',
        borderTopColor: '#38383A',
        borderTopWidth: 0.5,
      },
      tabBarActiveTintColor: '#0A84FF',
      tabBarInactiveTintColor: '#8E8E93',
    } as BottomTabNavigationOptions,
  },
};

/**
 * 导出所有预设的统一接口
 */
export const NavigationPresets = {
  Stack: StackPresets,
  Tab: TabPresets,
  Animation: AnimationPresets,
  Theme: ThemePresets,
} as const;

// 导出类型定义
export type StackPresetKey = keyof typeof StackPresets;
export type TabPresetKey = keyof typeof TabPresets;
export type AnimationPresetKey = keyof typeof AnimationPresets;
export type ThemePresetKey = keyof typeof ThemePresets;