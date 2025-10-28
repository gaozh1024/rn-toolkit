import React, { forwardRef, useState } from 'react';
import { TextInput } from 'react-native';
import { Input, InputProps } from '../Input';
import type { IconType } from '../Icon';
import { useTheme } from '../../../theme/hooks';
import { buildShadowStyle, type ShadowProps } from '../../common/shadow';

export interface PasswordInputProps extends Omit<InputProps, 'secureTextEntry' | 'rightIcon'>, ShadowProps {
    secureTextEntry?: boolean; // 默认开启密码模式
    toggleIconVisible?: boolean; // 是否显示显隐切换图标
    toggleIconNames?: { show: string; hide: string }; // 自定义图标名
    toggleIconType?: IconType; // 新增：切换图标库类型（如 'iconfont'）
    onVisibilityChange?: (visible: boolean) => void; // 显隐变化回调
    toggleIconColor?: string; // 可选自定义图标颜色（否则沿用 Input 的 color 逻辑）
    maxLength?: number;
}

const PasswordInput = forwardRef<TextInput, PasswordInputProps>((props, ref) => {
    const {
        secureTextEntry = true,
        toggleIconVisible = true,
        toggleIconNames = { show: 'eye', hide: 'eye-off' },
        toggleIconType,
        onVisibilityChange,
        toggleIconColor,
        value,
        defaultValue,
        maxLength,
        // 透传 Input 的其他 props
        ...rest
    } = props;

    const { theme } = useTheme();
    const shadowStyle = buildShadowStyle((theme as any).styles?.shadow ?? {}, props);

    const [visible, setVisible] = useState<boolean>(false);
    const effectiveSecure = secureTextEntry && !visible; // 当前是否密文
    const hasValue = ((value ?? defaultValue) ?? '').length > 0; // 无值时隐藏切换图标

    const handleToggle = () => {
        setVisible((v) => {
            const next = !v;
            onVisibilityChange?.(next);
            return next;
        });
    };

    // 无值时不显示；密文=闭眼，明文=睁眼
    const rightIcon = toggleIconVisible && hasValue
        ? { name: effectiveSecure ? toggleIconNames.hide : toggleIconNames.show, type: toggleIconType, color: toggleIconColor, onPress: handleToggle }
        : undefined;

    return (
        <Input
            ref={ref}
            secureTextEntry={effectiveSecure}
            value={value}
            defaultValue={defaultValue}
            rightIcon={rightIcon as any}
            style={[shadowStyle, (rest as any).style]}
            maxLength={maxLength}
            {...rest}
        />
    );
});

export default PasswordInput;