import React, { useEffect, useState, useRef } from 'react';
import { Drawer } from 'react-native-drawer-layout';
import { DrawerConfig } from '../types';
import { setGlobalDrawerController } from '../DrawerContext';

interface DrawerLayoutProps {
    leftDrawer?: DrawerConfig;
    rightDrawer?: DrawerConfig;
    children: React.ReactNode;
}

export const DrawerLayout: React.FC<DrawerLayoutProps> = ({ leftDrawer, rightDrawer, children }) => {
    const [leftOpen, setLeftOpen] = useState(!!leftDrawer?.open);
    const [rightOpen, setRightOpen] = useState(!!rightDrawer?.open);

    // 受控/非受控判定与当前打开态
    const isLeftControlled = typeof leftDrawer?.open === 'boolean';
    const isRightControlled = typeof rightDrawer?.open === 'boolean';
    const leftOpenValue = isLeftControlled ? !!leftDrawer!.open : leftOpen;
    const rightOpenValue = isRightControlled ? !!rightDrawer!.open : rightOpen;

    // === 新增：用 ref 记录当前打开态，并确保“立即可读” ===
    const leftOpenRef = useRef<boolean>(leftOpenValue);
    const rightOpenRef = useRef<boolean>(rightOpenValue);

    useEffect(() => { leftOpenRef.current = leftOpenValue; }, [leftOpenValue]);
    useEffect(() => { rightOpenRef.current = rightOpenValue; }, [rightOpenValue]);

    /**
     * 立即设置左抽屉打开态（受控/非受控均更新 ref；非受控同步 state）
     * 这样在同一事件流里读取 isLeftOpen() 也能得到最新值
     */
    const setLeftOpenImmediate = (next: boolean) => {
        leftOpenRef.current = next;
        if (!isLeftControlled) setLeftOpen(next);
    };

    /**
     * 立即设置右抽屉打开态（受控/非受控均更新 ref；非受控同步 state）
     * 保证 isRightOpen() 在事件内返回最新值
     */
    const setRightOpenImmediate = (next: boolean) => {
        rightOpenRef.current = next;
        if (!isRightControlled) setRightOpen(next);
    };

    useEffect(() => {
        setGlobalDrawerController({
            openLeft: () => setLeftOpenImmediate(true),
            closeLeft: () => setLeftOpenImmediate(false),
            toggleLeft: () => setLeftOpenImmediate(!leftOpenRef.current),

            openRight: () => setRightOpenImmediate(true),
            closeRight: () => setRightOpenImmediate(false),
            toggleRight: () => setRightOpenImmediate(!rightOpenRef.current),

            /** 查询：左侧抽屉是否打开（即时、无等待） */
            isLeftOpen: () => leftOpenRef.current,
            /** 查询：右侧抽屉是否打开（即时、无等待） */
            isRightOpen: () => rightOpenRef.current,
        });
    }, []);

    const renderDrawerContent = (cfg?: DrawerConfig) => {
        if (!cfg) return null;
        if (typeof cfg.content === 'function') {
            const Comp = cfg.content as React.ComponentType<any>;
            return <Comp />;
        }
        return cfg.content as React.ReactNode;
    };

    const RightWrapped = (
        <Drawer
            open={!!rightDrawer && rightOpenValue}
            onOpen={() => { rightDrawer?.onOpen?.(); setRightOpenImmediate(true); }}
            onClose={() => { rightDrawer?.onClose?.(); setRightOpenImmediate(false); }}
            drawerStyle={{ width: rightDrawer?.width ?? 280 }}
            drawerPosition="right"
            renderDrawerContent={() => renderDrawerContent(rightDrawer) || <></>}
            drawerType={rightDrawer?.drawerType}
            swipeEdgeWidth={rightDrawer?.edgeWidth}
        >
            {children}
        </Drawer>
    );

    return leftDrawer ? (
        <Drawer
            open={leftOpenValue}
            onOpen={() => { leftDrawer?.onOpen?.(); setLeftOpenImmediate(true); }}
            onClose={() => { leftDrawer?.onClose?.(); setLeftOpenImmediate(false); }}
            drawerStyle={{ width: leftDrawer.width ?? 280 }}
            drawerPosition="left"
            renderDrawerContent={() => renderDrawerContent(leftDrawer) || <></>}
            drawerType={leftDrawer.drawerType}
            swipeEdgeWidth={leftDrawer.edgeWidth}
        >
            {RightWrapped}
        </Drawer>
    ) : RightWrapped;
};

export default DrawerLayout;