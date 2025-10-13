import React from 'react';
import { View, Text, Image, TouchableOpacity, ViewStyle, TextStyle, StyleProp, DimensionValue } from 'react-native';
import { useTheme } from '../../../theme/hooks';

export type ChatBubbleAlign = 'left' | 'right';
export type ChatAction = React.ReactNode | { label: string; onPress?: () => void };

type ChatActionObject = { label: string; onPress?: () => void };
const isActionObject = (x: any): x is ChatActionObject => !!x && typeof x === 'object' && 'label' in x;

// 文件：ChatBubble.tsx — 更新 ChatBubbleProps 与 ChatBubble 组件

// interface ChatBubbleProps：新增选择开关
export interface ChatBubbleProps {
    // 内容
    text?: string;
    children?: React.ReactNode;
    // 头像
    showAvatar?: boolean;
    avatarUri?: string;
    avatarNode?: React.ReactNode;
    // 排列方向：left=对方消息；right=自己消息
    align?: ChatBubbleAlign;
    // 气泡下方：左侧按钮组、右侧文字
    leftActions?: ChatAction[];
    rightFooterText?: string | React.ReactNode;
    // 外观与样式
    bubbleStyle?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
    footerTextStyle?: StyleProp<TextStyle>;
    style?: StyleProp<ViewStyle>;
    testID?: string;
    /**
     * 气泡最大宽度（默认 '80%'）。支持数字（px）或百分比字符串。
     * 内容超出后将自动换行。
     */
    maxBubbleWidth?: DimensionValue;
    /** 头像垂直对齐：top=顶部，bottom=底部（默认） */
    avatarVerticalAlign?: 'top' | 'bottom';
    /** 气泡圆角半径（默认取主题 theme.borderRadius.lg） */
    bubbleRadius?: number;
    /** 显示头像时，靠近头像的角是否设为直角（默认 false） */
    squareCornerNearAvatar?: boolean;
    /** 独立控制四个角是否直角（在隐藏头像时尤为有用） */
    squareCorners?: {
        topLeft?: boolean;
        topRight?: boolean;
        bottomLeft?: boolean;
        bottomRight?: boolean;
    };
    /** 底部内容位置：inside=在气泡内，outside=在气泡外（默认） */
    footerPlacement?: 'inside' | 'outside';
}

// ChatBubble 组件：更新根容器左右对齐
export const ChatBubble: React.FC<ChatBubbleProps> = ({
    text,
    children,
    showAvatar = false,
    avatarUri,
    avatarNode,
    align = 'left',
    leftActions,
    rightFooterText,
    bubbleStyle,
    textStyle,
    footerTextStyle,
    style,
    testID,
    maxBubbleWidth = '80%',
    avatarVerticalAlign = 'bottom',
    bubbleRadius,
    squareCornerNearAvatar = false,
    squareCorners,
    footerPlacement = 'outside',
}) => {
    const { theme, isDark } = useTheme();
    const colors = theme.colors;

    const isRight = align === 'right';

    // 头像上下对齐控制
    const alignItemsRow = avatarVerticalAlign === 'top' ? 'flex-start' : 'flex-end';

    // 角样式计算：跟随头像或独立指定
    const effectiveRadius = bubbleRadius ?? theme.borderRadius.lg;
    const nearCornerKey = isRight
        ? (avatarVerticalAlign === 'top' ? 'topRight' : 'bottomRight')
        : (avatarVerticalAlign === 'top' ? 'topLeft' : 'bottomLeft');

    const square = {
        topLeft: false,
        topRight: false,
        bottomLeft: false,
        bottomRight: false,
        ...(squareCorners ?? {}),
    } as Required<NonNullable<ChatBubbleProps['squareCorners']>>;

    if (showAvatar && squareCornerNearAvatar) {
        square[nearCornerKey] = true;
    }

    const cornerRadiiStyles = {
        borderRadius: effectiveRadius,
        borderTopLeftRadius: square.topLeft ? 0 : effectiveRadius,
        borderTopRightRadius: square.topRight ? 0 : effectiveRadius,
        borderBottomLeftRadius: square.bottomLeft ? 0 : effectiveRadius,
        borderBottomRightRadius: square.bottomRight ? 0 : effectiveRadius,
    } as const;

    // 修正根容器左右对齐：左侧消息靠左、右侧消息靠右
    const rootAlignStyle: ViewStyle = { alignItems: isRight ? 'flex-end' : 'flex-start' };

    // 列容器：约束气泡与底部行的最大宽度
    const bubbleColumnStyle: ViewStyle = {
        maxWidth: maxBubbleWidth,
        flexShrink: 1,
    };

    const defaultBubbleStyle: ViewStyle = {
        // 去除对气泡本身的 maxWidth，改由列容器统一约束
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: theme.spacing.sm,
        ...cornerRadiiStyles,
        backgroundColor: isRight ? colors.primary : theme.button?.secondary?.backgroundColor ?? (isDark ? '#2C2C2E' : '#F2F2F7'),
        flexShrink: 1,
    };

    const defaultTextStyle: TextStyle = {
        fontSize: 16,
        color: isRight ? '#FFFFFF' : (colors.text ?? (isDark ? '#FFFFFF' : '#000000')),
    };

    const avatar = showAvatar ? (
        avatarNode ?? (
            avatarUri ? (
                <Image source={{ uri: avatarUri }} style={{ width: 32, height: 32, borderRadius: 16 }} />
            ) : (
                <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: colors.border }} />
            )
        )
    ) : null;

    const renderAction = (act: ChatAction, idx: number) => {
        if (isActionObject(act)) {
            const { label, onPress } = act;
            return (
                <TouchableOpacity key={`act-${idx}`} onPress={onPress} style={{ paddingHorizontal: 8, paddingVertical: 4 }}>
                    <Text style={{ fontSize: 14, color: colors.primary }}>{label}</Text>
                </TouchableOpacity>
            );
        }
        if (React.isValidElement(act)) {
            return <View key={`act-${idx}`}>{act}</View>;
        }
        if (typeof act === 'string' || typeof act === 'number') {
            return (
                <View key={`act-${idx}`} style={{ paddingHorizontal: 8, paddingVertical: 4 }}>
                    <Text style={{ fontSize: 14, color: colors.primary }}>{String(act)}</Text>
                </View>
            );
        }
        return null;
    };

    return (
        <View style={[rootAlignStyle, style]} testID={testID}>
            <View style={{ flexDirection: isRight ? 'row-reverse' : 'row', alignItems: alignItemsRow }}>
                {avatar && <View style={{ marginHorizontal: 8 }}>{avatar}</View>}
                <View style={bubbleColumnStyle}>
                    <View style={[defaultBubbleStyle, bubbleStyle]}>
                        {text != null ? <Text style={[defaultTextStyle, textStyle]}>{text}</Text> : children}
                        {(leftActions?.length || rightFooterText) && footerPlacement === 'inside' && (
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                marginTop: 6,
                            }}>
                                <View style={{ flexDirection: 'row', flexShrink: 1, flexWrap: 'wrap' }}>
                                    {leftActions?.map(renderAction)}
                                </View>
                                {typeof rightFooterText === 'string' ? (
                                    <Text style={[{ fontSize: 12, color: colors.textSecondary ?? (isDark ? '#A1A1A6' : '#6C6C70'), flexShrink: 1 }, footerTextStyle]}>
                                        {rightFooterText}
                                    </Text>
                                ) : (
                                    rightFooterText ?? null
                                )}
                            </View>
                        )}
                    </View>

                    {(leftActions?.length || rightFooterText) && footerPlacement === 'outside' && (
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginTop: 6,
                        }}>
                            <View style={{ flexDirection: 'row', flexShrink: 1, flexWrap: 'wrap' }}>
                                {leftActions?.map(renderAction)}
                            </View>
                            {typeof rightFooterText === 'string' ? (
                                <Text style={[{ fontSize: 12, color: colors.textSecondary ?? (isDark ? '#A1A1A6' : '#6C6C70'), flexShrink: 1 }, footerTextStyle]}>
                                    {rightFooterText}
                                </Text>
                            ) : (
                                rightFooterText ?? null
                            )}
                        </View>
                    )}
                </View>
            </View>
        </View>
    );
};

export default ChatBubble;