import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { TabScreenComponent, RootStackParamList } from '../types';
import { TabPresets } from '../styles';
import { useNavigationUtils } from '../utils/navigation';
import { Icon, Text } from '../../components/ui';
import styleService from '../../theme/ThemeService';

const Tab = createBottomTabNavigator<RootStackParamList>();

/**
 * 增强的标签页配置接口
 */
export interface EnhancedTabConfig extends TabScreenComponent {
  // 图标配置
  iconName?: string;
  iconSize?: number;
  label?: string;
  labelSize?: number;
  showLabel?: boolean;
  badge?: string | number;
  badgeColor?: string;
}

/**
 * 标签页主题预设类型
 */
export type TabThemePreset = 'default' | 'minimal' | 'floating' | 'enhanced';

/**
 * 标签页导航器配置接口
 */
export interface TabNavigatorConfig {
  tabs: TabScreenComponent[];
  initialRouteName?: string;
  themePreset?: TabThemePreset;
  customOptions?: any;
  enableTheme?: boolean;
}

/**
 * 增强标签页导航器配置接口
 */
export interface EnhancedTabNavigatorConfig {
  tabs: EnhancedTabConfig[];
  initialRouteName?: string;
  themePreset?: TabThemePreset;
  customOptions?: any;
  enableTheme?: boolean;
  // 全局配置
  globalIconSize?: number;
  globalLabelSize?: number;
  showLabels?: boolean;
}

/**
 * 增强标签页按钮组件
 */
const EnhancedTabButton = React.forwardRef<any, any>((props, ref) => {
  const {
    children,
    onPress,
    onLongPress,
    testID,
    accessibilityLabel,
    accessibilityRole,
    accessibilityState,
    style,
    iconName,
    iconSize = 24,
    label,
    labelSize = 12,
    showLabel = true,
    badge,
    badgeColor,
    focused,
    ...restProps
  } = props;

  const colors = styleService.getAppTheme().currentColors;
  const activeColor = focused ? colors.primary : colors.textSecondary;
  const finalBadgeColor = badgeColor || colors.error;

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
        {iconName && (
          <View style={styles.iconContainer}>
            <Icon
              name={iconName}
              size={iconSize}
              color={activeColor}
            />
            {badge && (
              <View style={[styles.badge, { backgroundColor: finalBadgeColor }]}>
                <Text
                  style={[styles.badgeText, { color: colors.surface }]}
                  variant="caption"
                >
                  {badge}
                </Text>
              </View>
            )}
          </View>
        )}
        {showLabel && label && (
          <Text
            style={[styles.label, { color: activeColor }]}
            variant="caption"
            size={labelSize}
            weight={focused ? 'semibold' : 'normal'}
          >
            {label}
          </Text>
        )}
        {children}
      </View>
    </TouchableOpacity>
  );
});

EnhancedTabButton.displayName = 'EnhancedTabButton';

/**
 * 标签页导航器组件
 */
export const TabNavigator: React.FC<TabNavigatorConfig> = ({
  tabs,
  initialRouteName,
  themePreset = 'default',
  customOptions,
  enableTheme = true,
}) => {
  const { tabStyles, generator, utils } = useNavigationUtils();

  const getScreenOptions = () => {
    if (enableTheme && themePreset) {
      // 对于 enhanced 预设，使用 default 主题但应用自定义选项
      const actualPreset = themePreset === 'enhanced' ? 'default' : themePreset;
      return utils.getTabOptions(actualPreset);
    }
    return customOptions || {};
  };

  return (
    <Tab.Navigator
      initialRouteName={initialRouteName}
      screenOptions={getScreenOptions()}
    >
      {tabs.map((tab) => (
        <Tab.Screen
          key={tab.name}
          name={tab.name}
          component={tab.component}
          options={tab.options}
        />
      ))}
    </Tab.Navigator>
  );
};

/**
 * 增强标签页导航器组件
 */
export const EnhancedTabNavigator: React.FC<EnhancedTabNavigatorConfig> = ({
  tabs,
  initialRouteName,
  themePreset = 'enhanced',
  customOptions,
  enableTheme = true,
  globalIconSize = 24,
  globalLabelSize = 12,
  showLabels = true,
}) => {
  const { tabStyles, generator, utils } = useNavigationUtils();

  const getScreenOptions = () => {
    if (enableTheme && themePreset) {
      // 对于 enhanced 预设，使用 enhanced 主题生成器
      if (themePreset === 'enhanced') {
        const enhancedOptions = tabStyles.enhanced();
        return {
          ...enhancedOptions,
          ...customOptions,
        };
      }
      // 其他预设使用 NavigationUtils
      return {
        ...utils.getTabOptions(themePreset),
        ...customOptions,
      };
    }
    return customOptions || {};
  };

  const getTabScreenOptions = (tab: EnhancedTabConfig) => {
    const baseOptions = tab.options || {};

    // 如果有自定义图标配置，添加到 tabBarButton props
    if (tab.iconName || tab.label) {
      return {
        ...baseOptions,
        tabBarButton: (props: any) => (
          <EnhancedTabButton
            {...props}
            iconName={tab.iconName}
            iconSize={tab.iconSize || globalIconSize}
            label={tab.label}
            labelSize={tab.labelSize || globalLabelSize}
            showLabel={tab.showLabel !== undefined ? tab.showLabel : showLabels}
            badge={tab.badge}
            badgeColor={tab.badgeColor}
            focused={props.accessibilityState?.selected}
          />
        ),
      };
    }

    return baseOptions;
  };

  return (
    <Tab.Navigator
      initialRouteName={initialRouteName}
      screenOptions={getScreenOptions()}
    >
      {tabs.map((tab) => (
        <Tab.Screen
          key={tab.name}
          name={tab.name}
          component={tab.component}
          options={getTabScreenOptions(tab)}
        />
      ))}
    </Tab.Navigator>
  );
};

/**
 * 标签页导航器构建器
 */
export class TabNavigatorBuilder {
  private config: TabNavigatorConfig = {
    tabs: [],
    enableTheme: true,
    themePreset: 'default',
  };

  /**
   * 设置标签页列表
   */
  setTabs(tabs: TabScreenComponent[]): this {
    this.config.tabs = tabs;
    return this;
  }

  /**
   * 添加单个标签页
   */
  addTab(tab: TabScreenComponent): this {
    this.config.tabs.push(tab);
    return this;
  }

  /**
   * 设置初始路由
   */
  setInitialRoute(routeName: string): this {
    this.config.initialRouteName = routeName;
    return this;
  }

  /**
   * 设置主题预设
   */
  setThemePreset(preset: TabThemePreset): this {
    this.config.themePreset = preset;
    return this;
  }

  /**
   * 设置自定义选项
   */
  setCustomOptions(options: any): this {
    this.config.customOptions = options;
    return this;
  }

  /**
   * 设置是否启用主题
   */
  setThemeEnabled(enabled: boolean): this {
    this.config.enableTheme = enabled;
    return this;
  }

  /**
   * 构建导航器组件
   */
  build(): React.FC {
    const config = { ...this.config };
    return () => <TabNavigator {...config} />;
  }

  /**
   * 获取当前配置
   */
  getConfig(): TabNavigatorConfig {
    return { ...this.config };
  }
}

/**
 * 创建标签页导航器
 */
export const createTabNavigator = (config: TabNavigatorConfig) => {
  return () => <TabNavigator {...config} />;
};

/**
 * 创建标签页导航器构建器
 */
export const createTabNavigatorBuilder = () => {
  return new TabNavigatorBuilder();
};

/**
 * 标签页导航器工厂
 */
export const TabNavigatorFactory = {
  /**
   * 创建构建器
   */
  builder: () => createTabNavigatorBuilder(),

  /**
   * 默认样式导航器
   */
  default: (tabs: TabScreenComponent[], initialRoute?: string) =>
    createTabNavigator({
      tabs,
      initialRouteName: initialRoute,
      themePreset: 'default',
    }),

  /**
   * 简约样式导航器
   */
  minimal: (tabs: TabScreenComponent[], initialRoute?: string) =>
    createTabNavigator({
      tabs,
      initialRouteName: initialRoute,
      themePreset: 'minimal',
    }),

  /**
   * 浮动样式导航器
   */
  floating: (tabs: TabScreenComponent[], initialRoute?: string) =>
    createTabNavigator({
      tabs,
      initialRouteName: initialRoute,
      themePreset: 'floating',
    }),

  /**
   * 自定义配置导航器
   */
  custom: (config: TabNavigatorConfig) => createTabNavigator(config),
} as const;

/**
 * 增强标签页导航器构建器
 */
export class EnhancedTabNavigatorBuilder {
  private config: EnhancedTabNavigatorConfig = {
    tabs: [],
    enableTheme: true,
    themePreset: 'enhanced',
    globalIconSize: 24,
    globalLabelSize: 12,
    showLabels: true,
  };

  /**
   * 设置标签页列表
   */
  setTabs(tabs: EnhancedTabConfig[]): this {
    this.config.tabs = tabs;
    return this;
  }

  /**
   * 添加增强标签页
   */
  addEnhancedTab(tab: EnhancedTabConfig): this {
    this.config.tabs.push(tab);
    return this;
  }

  /**
   * 设置全局图标大小
   */
  setGlobalIconSize(size: number): this {
    this.config.globalIconSize = size;
    return this;
  }

  /**
   * 设置全局标签大小
   */
  setGlobalLabelSize(size: number): this {
    this.config.globalLabelSize = size;
    return this;
  }

  /**
   * 设置是否显示标签
   */
  setShowLabels(show: boolean): this {
    this.config.showLabels = show;
    return this;
  }

  /**
   * 设置初始路由
   */
  setInitialRoute(routeName: string): this {
    this.config.initialRouteName = routeName;
    return this;
  }

  /**
   * 设置主题预设
   */
  setThemePreset(preset: TabThemePreset): this {
    this.config.themePreset = preset;
    return this;
  }

  /**
   * 设置自定义选项
   */
  setCustomOptions(options: any): this {
    this.config.customOptions = options;
    return this;
  }

  /**
   * 设置是否启用主题
   */
  setThemeEnabled(enabled: boolean): this {
    this.config.enableTheme = enabled;
    return this;
  }

  /**
   * 构建增强导航器组件
   */
  build(): React.FC {
    const config = { ...this.config };
    return () => <EnhancedTabNavigator {...config} />;
  }

  /**
   * 获取当前配置
   */
  getConfig(): EnhancedTabNavigatorConfig {
    return { ...this.config };
  }
}

/**
 * 创建增强标签页导航器
 */
export const createEnhancedTabNavigator = (config: EnhancedTabNavigatorConfig) => {
  return () => <EnhancedTabNavigator {...config} />;
};

/**
 * 创建增强标签页导航器构建器
 */
export const createEnhancedTabNavigatorBuilder = () => {
  return new EnhancedTabNavigatorBuilder();
};

/**
 * 增强标签页导航器工厂
 */
export const EnhancedTabNavigatorFactory = {
  /**
   * 创建构建器
   */
  builder: () => createEnhancedTabNavigatorBuilder(),

  /**
   * 默认增强导航器
   */
  default: (tabs: EnhancedTabConfig[], initialRoute?: string) =>
    createEnhancedTabNavigator({
      tabs,
      initialRouteName: initialRoute,
      themePreset: 'enhanced',
    }),

  /**
   * 简约增强导航器
   */
  minimal: (tabs: EnhancedTabConfig[], initialRoute?: string) =>
    createEnhancedTabNavigator({
      tabs,
      initialRouteName: initialRoute,
      themePreset: 'enhanced',
      showLabels: false,
    }),

  /**
   * 自定义配置增强导航器
   */
  custom: (config: EnhancedTabNavigatorConfig) => createEnhancedTabNavigator(config),
} as const;

/**
 * 样式定义
 */
const styles = StyleSheet.create({
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

export default TabNavigator;