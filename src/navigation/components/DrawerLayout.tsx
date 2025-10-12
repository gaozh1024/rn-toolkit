import React, { useEffect, useState } from 'react';
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

    useEffect(() => {
        setGlobalDrawerController({
            openLeft: () => setLeftOpen(true),
            closeLeft: () => setLeftOpen(false),
            toggleLeft: () => setLeftOpen(o => !o),
            openRight: () => setRightOpen(true),
            closeRight: () => setRightOpen(false),
            toggleRight: () => setRightOpen(o => !o),
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
            onOpen={() => { rightDrawer?.onOpen?.(); if (!isRightControlled) setRightOpen(true); }}
            onClose={() => { rightDrawer?.onClose?.(); if (!isRightControlled) setRightOpen(false); }}
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
            onOpen={() => { leftDrawer?.onOpen?.(); if (!isLeftControlled) setLeftOpen(true); }}
            onClose={() => { leftDrawer?.onClose?.(); if (!isLeftControlled) setLeftOpen(false); }}
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