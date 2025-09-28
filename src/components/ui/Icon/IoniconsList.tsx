import React from 'react';
import Icon from "./Icon";

// 常用的 Ionicons 图标名称类型定义
export type IoniconName =
    | 'home'
    | 'home-outline'
    | 'person'
    | 'person-outline'
    | 'settings'
    | 'settings-outline'
    | 'search'
    | 'search-outline'
    | 'heart'
    | 'heart-outline'
    | 'star'
    | 'star-outline'
    | 'add'
    | 'add-outline'
    | 'remove'
    | 'remove-outline'
    | 'close'
    | 'close-outline'
    | 'checkmark'
    | 'checkmark-outline'
    | 'arrow-back'
    | 'arrow-forward'
    | 'arrow-up'
    | 'arrow-down'
    | 'chevron-back'
    | 'chevron-forward'
    | 'chevron-up'
    | 'chevron-down'
    | 'menu'
    | 'menu-outline'
    | 'notifications'
    | 'notifications-outline'
    | 'mail'
    | 'mail-outline'
    | 'call'
    | 'call-outline'
    | 'location'
    | 'location-outline'
    | 'camera'
    | 'camera-outline'
    | 'image'
    | 'image-outline'
    | 'play'
    | 'play-outline'
    | 'pause'
    | 'pause-outline'
    | 'stop'
    | 'stop-outline'
    | 'refresh'
    | 'refresh-outline'
    | 'share'
    | 'share-outline'
    | 'download'
    | 'download-outline'
    | 'cloud'
    | 'cloud-outline'
    | 'wifi'
    | 'wifi-outline'
    | 'bluetooth'
    | 'bluetooth-outline'
    | 'battery-full'
    | 'battery-half'
    | 'battery-dead'
    | 'time'
    | 'time-outline'
    | 'calendar'
    | 'calendar-outline'
    | 'folder'
    | 'folder-outline'
    | 'document'
    | 'document-outline'
    | 'trash'
    | 'trash-outline'
    | 'create'
    | 'create-outline'
    | 'copy'
    | 'copy-outline'
    | 'cut'
    | 'cut-outline'
    | 'eye'
    | 'eye-outline'
    | 'eye-off'
    | 'eye-off-outline'
    | 'lock-closed'
    | 'lock-open'
    | 'shield'
    | 'shield-outline'
    | 'warning'
    | 'warning-outline'
    | 'information'
    | 'information-outline'
    | 'help'
    | 'help-outline'
    | string; // 允许其他 Ionicons 图标名称

/**
 * 创建类型安全的 Ionicons 图标属性
 */
export interface IoniconProps {
    name: IoniconName;
    size?: number;
    color?: string;
    style?: any;
    onPress?: () => void;
    testID?: string;
}

/**
 * 类型安全的 Ionicons 组件
 */
export const Ionicon: React.FC<IoniconProps> = (props) => {
    return <Icon {...props} type="ionicons" />;
};