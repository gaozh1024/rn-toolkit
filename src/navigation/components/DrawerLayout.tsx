import React from 'react';
import { Drawer } from 'react-native-drawer-layout';
import { DrawerConfig } from '../types';

interface DrawerLayoutProps {
    leftDrawer?: DrawerConfig;
    rightDrawer?: DrawerConfig;
    children: React.ReactNode;
}

export const DrawerLayout: React.FC<DrawerLayoutProps> = ({ leftDrawer, rightDrawer, children }) => {
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
            open={!!rightDrawer?.open}
            onOpen={rightDrawer?.onOpen || (() => { })}
            onClose={rightDrawer?.onClose || (() => { })}
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
            open={!!leftDrawer?.open}
            onOpen={leftDrawer?.onOpen || (() => { })}
            onClose={leftDrawer?.onClose || (() => { })}
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