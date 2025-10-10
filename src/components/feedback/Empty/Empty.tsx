import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { useTheme } from '../../../theme/hooks';

export interface EmptyAction {
    text: string;
    onPress: () => void;
    type?: 'primary' | 'secondary';
}

export interface EmptyProps {
    icon?: React.ReactNode;
    title?: string;
    description?: string;
    actionText?: string;      // 单按钮文案（与 onAction 搭配）
    onAction?: () => void;     // 单按钮回调
    actions?: EmptyAction[];   // 多按钮组（优先级高于单按钮）
    style?: ViewStyle;
    align?: 'center' | 'start'; // 内容对齐
    spacing?: number;           // 行间距
    fullHeight?: boolean;       // 是否占满高度（居中）
}

export const Empty: React.FC<EmptyProps> = ({
    icon,
    title,
    description,
    actionText,
    onAction,
    actions,
    style,
    align = 'center',
    spacing = 8,
    fullHeight = true,
}) => {
    const { theme } = useTheme();
    const { colors } = theme;
    const alignItems = align === 'center' ? 'center' : 'flex-start';

    return (
        <View style={[styles.container, fullHeight && styles.fullHeight, { alignItems }, style]}
            pointerEvents="box-none">
            {icon ? <View style={{ marginBottom: spacing }}>{icon}</View> : null}
            {title ? (
                <Text style={[styles.title, { color: colors.text }, align === 'center' && styles.center]}>
                    {title}
                </Text>
            ) : null}
            {description ? (
                <Text style={[styles.description, { color: colors.textSecondary, marginTop: spacing }, align === 'center' && styles.center]}>
                    {description}
                </Text>
            ) : null}

            {/* 多按钮优先 */}
            {Array.isArray(actions) && actions.length > 0 ? (
                <View style={[styles.actionsRow, { marginTop: spacing * 2 }]}
                    pointerEvents="box-none">
                    {actions.map((a, idx) => (
                        <TouchableOpacity key={idx} style={[styles.actionBtn, a.type === 'primary' ? styles.primaryBtn : styles.secondaryBtn]}
                            activeOpacity={0.8} onPress={a.onPress}>
                            <Text style={[styles.actionText, a.type === 'primary' ? styles.primaryText : styles.secondaryText]}>
                                {a.text}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            ) : (
                actionText && onAction ? (
                    <TouchableOpacity style={[styles.actionBtn, styles.primaryBtn, { marginTop: spacing * 2 }]}
                        activeOpacity={0.8} onPress={onAction}>
                        <Text style={[styles.actionText, styles.primaryText]}>{actionText}</Text>
                    </TouchableOpacity>
                ) : null
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        paddingHorizontal: 24,
    },
    fullHeight: {
        minHeight: 280,
        justifyContent: 'center',
    },
    center: {
        textAlign: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
    },
    description: {
        fontSize: 14,
        lineHeight: 20,
    },
    actionsRow: {
        flexDirection: 'row',
        gap: 12,
    },
    actionBtn: {
        paddingHorizontal: 16,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    primaryBtn: {
        backgroundColor: '#007AFF', // 可由主题扩展
    },
    secondaryBtn: {
        backgroundColor: 'transparent',
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: '#C7C7CC',
    },
    actionText: {
        fontSize: 14,
        fontWeight: '500',
    },
    primaryText: {
        color: '#FFFFFF',
    },
    secondaryText: {
        color: '#007AFF',
    },
});

export default Empty;