import React from 'react';
import { StackNavigationOptions } from '@react-navigation/stack';
import { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';

// 创建堆栈屏幕配置的辅助函数
export const createStackScreens = (screens: Array<{
    name: string;
    component: React.ComponentType<any>;
    options?: StackNavigationOptions;
}>) => {
    return screens;
};

// 创建标签页屏幕配置的辅助函数
export const createTabScreens = (tabs: Array<{
    name: string;
    component: React.ComponentType<any>;
    options?: BottomTabNavigationOptions;
}>) => {
    return tabs;
};