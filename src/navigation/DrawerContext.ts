import React, { createContext, useContext } from 'react';

type DrawerCtrl = {
    openLeft: () => void;           // 打开左侧抽屉
    closeLeft: () => void;          // 关闭左侧抽屉
    toggleLeft: () => void;         // 切换左侧抽屉状态
    openRight: () => void;          // 打开右侧抽屉
    closeRight: () => void;         // 关闭右侧抽屉
    toggleRight: () => void;        // 切换右侧抽屉状态
};
const DrawerContext = createContext<DrawerCtrl>({
    openLeft: () => { },
    closeLeft: () => { },
    toggleLeft: () => { },
    openRight: () => { },
    closeRight: () => { },
    toggleRight: () => { },
});
export const DrawerProvider = DrawerContext.Provider;
export const useDrawer = () => useContext(DrawerContext);
export let globalDrawerController: DrawerCtrl = {
    openLeft: () => { }, closeLeft: () => { }, toggleLeft: () => { },
    openRight: () => { }, closeRight: () => { }, toggleRight: () => { },
};

export const setGlobalDrawerController = (ctrl: DrawerCtrl) => {
    globalDrawerController = ctrl;
};

export const getGlobalDrawerController = (): DrawerCtrl => globalDrawerController;