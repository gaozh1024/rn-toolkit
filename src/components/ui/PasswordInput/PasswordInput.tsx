import React, { forwardRef, useState } from 'react';
import { TextInput } from 'react-native';
import { Input, InputProps } from '../Input';
import type { IconType } from '../Icon';

export interface PasswordInputProps extends Omit<InputProps, 'secureTextEntry' | 'rightIcon'> {
    secureTextEntry?: boolean; // 默认开启密码模式
    toggleIconVisible?: boolean; // 是否显示显隐切换图标
    toggleIconNames?: { show: string; hide: string }; // 自定义图标名
    toggleIconType?: IconType; // 新增：切换图标库类型（如 'iconfont'）
    onVisibilityChange?: (visible: boolean) => void; // 显隐变化回调
    toggleIconColor?: string; // 可选自定义图标颜色（否则沿用 Input 的 color 逻辑）
}

const PasswordInput = forwardRef<TextInput, PasswordInputProps>((props, ref) => {
    const {
        secureTextEntry = true,
        toggleIconVisible = true,
        toggleIconNames = { show: 'eye', hide: 'eye-off' },
        toggleIconType,
        onVisibilityChange,
        toggleIconColor,
        // 透传 Input 的其他 props
        ...rest
    } = props;

    const [visible, setVisible] = useState<boolean>(false);
    const effectiveSecure = secureTextEntry && !visible; // 显示时关闭加密

    const handleToggle = () => {
        setVisible((v) => {
            const next = !v;
            onVisibilityChange?.(next);
            return next;
        });
    };

    // 优先显示内置的显隐切换按钮；如需禁用可 toggleIconVisible=false 后自行传递 rightIcon（本组件不接收 rightIcon）
    const rightIcon = toggleIconVisible
        ? { name: visible ? toggleIconNames.hide : toggleIconNames.show, type: toggleIconType, color: toggleIconColor, onPress: handleToggle }
        : undefined;

    return (
        <Input
            ref={ref}
            secureTextEntry={effectiveSecure}
            rightIcon={rightIcon as any}
            {...rest}
        />
    );
});

export default PasswordInput;