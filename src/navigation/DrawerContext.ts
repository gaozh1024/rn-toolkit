import React, { createContext, useContext } from 'react';

type DrawerCtrl = {
    openLeft: () => void;           // 打开左侧抽屉
    closeLeft: () => void;          // 关闭左侧抽屉
    toggleLeft: () => void;         // 切换左侧抽屉状态
    openRight: () => void;          // 打开右侧抽屉
    closeRight: () => void;         // 关闭右侧抽屉
    toggleRight: () => void;        // 切换右侧抽屉状态
    /** 查询：左侧抽屉是否打开 */
    isLeftOpen: () => boolean;
    /** 查询：右侧抽屉是否打开 */
    isRightOpen: () => boolean;
};
const DrawerContext = createContext<DrawerCtrl>({
    openLeft: () => { },
    closeLeft: () => { },
    toggleLeft: () => { },
    openRight: () => { },
    closeRight: () => { },
    toggleRight: () => { },
    isLeftOpen: () => false,
    isRightOpen: () => false,
});
export const DrawerProvider = DrawerContext.Provider;
export const useDrawer = () => useContext(DrawerContext);
export let globalDrawerController: DrawerCtrl = {
    openLeft: () => { }, closeLeft: () => { }, toggleLeft: () => { },
    openRight: () => { }, closeRight: () => { }, toggleRight: () => { },
    isLeftOpen: () => false, isRightOpen: () => false,
};

/** 设置全局抽屉控制器（含状态查询） */
export const setGlobalDrawerController = (ctrl: DrawerCtrl) => {
    globalDrawerController = ctrl;
};

/** 获取全局抽屉控制器 */
export const getGlobalDrawerController = (): DrawerCtrl => globalDrawerController;