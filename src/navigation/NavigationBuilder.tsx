import React from 'react';
import { StackNavigationOptions } from '@react-navigation/stack';
import { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { StackScreenComponent, TabScreenComponent } from './types';
import { StackNavigator, TabNavigator, NavigationContainer } from './NavigationContainer';

// 标签页配置接口
export interface TabConfig {
    title?: string;
    icon?: (props: { color: string; size: number; focused: boolean }) => React.ReactNode;
    badge?: string | number;
    options?: BottomTabNavigationOptions;
}

// 屏幕配置接口
export interface ScreenConfig {
    title?: string;
    options?: StackNavigationOptions;
    initialParams?: any;
}

// 导航构建结果接口
export interface NavigationConfig {
    tabs: TabScreenComponent[];
    screens: StackScreenComponent[];
    tabOptions?: BottomTabNavigationOptions;
    stackOptions?: StackNavigationOptions;
    initialTabRoute?: string;
    initialStackRoute?: string;
}

/**
 * 导航配置生成器
 * 提供链式调用API来简化导航配置
 */
export class NavigationBuilder {
    private tabs: TabScreenComponent[] = [];
    private screens: StackScreenComponent[] = [];
    private tabOptions?: BottomTabNavigationOptions;
    private stackOptions?: StackNavigationOptions;
    private initialTabRoute?: string;
    private initialStackRoute?: string;

    /**
     * 添加标签页
     * @param name 屏幕名称
     * @param component 组件
     * @param config 配置选项
     */
    addTab(
        name: string,
        component: React.ComponentType<any>,
        config: TabConfig = {}
    ): NavigationBuilder {
        const { title, icon, badge, options = {} } = config;

        // 构建标签页选项，默认隐藏头部
        const tabOptions: BottomTabNavigationOptions = {
            title: title || name,
            tabBarIcon: icon,
            tabBarBadge: badge,
            headerShown: false, // 默认隐藏头部
            ...options, // 用户可以通过 options 覆盖默认设置
        };

        this.tabs.push({
            name,
            component,
            options: tabOptions,
        });

        return this;
    }

    /**
     * 添加普通屏幕
     * @param name 屏幕名称
     * @param component 组件
     * @param config 配置选项
     */
    addScreen(
        name: string,
        component: React.ComponentType<any>,
        config: ScreenConfig = {}
    ): NavigationBuilder {
        const { title, options = {}, initialParams } = config;

        // 构建屏幕选项，默认隐藏头部
        const screenOptions: StackNavigationOptions = {
            title: title || name,
            headerShown: false, // 默认隐藏头部
            ...options, // 用户可以通过 options 覆盖默认设置
        };

        this.screens.push({
            name,
            component,
            options: screenOptions,
        });

        return this;
    }

    /**
     * 设置堆栈导航器的全局选项
     * @param options 堆栈选项
     */
    setStackOptions(options: StackNavigationOptions): NavigationBuilder {
        // 默认设置隐藏头部，用户可以覆盖
        this.stackOptions = {
            headerShown: false,
            ...options,
        };
        return this;
    }

    /**
     * 设置标签页导航器的全局选项
     * @param options 标签页选项
     */
    setTabOptions(options: BottomTabNavigationOptions): NavigationBuilder {
        // 默认设置隐藏头部，用户可以覆盖
        this.tabOptions = {
            headerShown: false,
            ...options,
        };
        return this;
    }

    /**
     * 设置初始标签页路由
     * @param routeName 路由名称
     */
    setInitialTabRoute(routeName: string): NavigationBuilder {
        this.initialTabRoute = routeName;
        return this;
    }

    /**
     * 设置初始堆栈路由
     * @param routeName 路由名称
     */
    setInitialStackRoute(routeName: string): NavigationBuilder {
        this.initialStackRoute = routeName;
        return this;
    }

    /**
     * 构建导航配置
     */
    build(): NavigationConfig {
        return {
            tabs: this.tabs,
            screens: this.screens,
            tabOptions: this.tabOptions,
            stackOptions: this.stackOptions,
            initialTabRoute: this.initialTabRoute,
            initialStackRoute: this.initialStackRoute,
        };
    }

    /**
     * 构建标签页导航器（不包含NavigationContainer）
     */
    buildTabNavigator(): React.FC {
        const config = this.build();

        return () => (
            <TabNavigator
                tabs={config.tabs}
                initialRouteName={config.initialTabRoute}
                screenOptions={{
                    headerShown: false, // 确保tab页面不显示header
                    ...config.tabOptions,
                }}
            />
        );
    }

    /**
     * 构建堆栈导航器（不包含NavigationContainer）
     */
    buildStackNavigator(): React.FC {
        const config = this.build();

        return () => (
            <StackNavigator
                screens={config.screens}
                initialRouteName={config.initialStackRoute}
                screenOptions={{
                    headerShown: false, // 默认全局隐藏头部
                    ...config.stackOptions,
                }}
            />
        );
    }

    /**
     * 构建完整的导航结构（标签页 + 堆栈）- 不包含NavigationContainer
     * 用户需要在应用根部自己包装NavigationContainer
     */
    buildFullNavigation(): React.FC {
        const config = this.build();

        return () => (
            <StackNavigator
                screens={
                    [
                        {
                            name: 'MainTabs',
                            component: () => (
                                <TabNavigator
                                    tabs={config.tabs}
                                    initialRouteName={config.initialTabRoute}
                                    screenOptions={{
                                        headerShown: false, // 确保tab页面不显示header
                                        ...config.tabOptions,
                                    }}
                                />
                            ),
                            options: { headerShown: false },
                        },
                        ...config.screens,
                    ]
                }
                initialRouteName="MainTabs"
                screenOptions={{
                    headerShown: false, // 默认全局隐藏头部
                    ...config.stackOptions,
                }}
            />
        );
    }

    /**
     * 构建完整的导航结构并包装NavigationContainer
     * 适用于作为App的根导航使用
     */
    buildRootNavigation(): React.FC {
        const config = this.build();

        return () => (
            <NavigationContainer>
                <StackNavigator
                    screens={
                        [
                            {
                                name: 'MainTabs',
                                component: () => (
                                    <TabNavigator
                                        tabs={config.tabs}
                                        initialRouteName={config.initialTabRoute}
                                        screenOptions={{
                                            headerShown: false, // 确保tab页面不显示header
                                            ...config.tabOptions,
                                        }}
                                    />
                                ),
                                options: { headerShown: false },
                            },
                            ...config.screens,
                        ]
                    }
                    initialRouteName="MainTabs"
                    screenOptions={{
                        headerShown: false, // 默认全局隐藏头部
                        ...config.stackOptions,
                    }}
                />
            </NavigationContainer>
        );
    }

    /**
     * 重置构建器
     */
    reset(): NavigationBuilder {
        this.tabs = [];
        this.screens = [];
        this.tabOptions = undefined;
        this.stackOptions = undefined;
        this.initialTabRoute = undefined;
        this.initialStackRoute = undefined;
        return this;
    }
}

/**
 * 创建导航配置生成器实例
 */
export function createNavigation(): NavigationBuilder {
    return new NavigationBuilder();
}