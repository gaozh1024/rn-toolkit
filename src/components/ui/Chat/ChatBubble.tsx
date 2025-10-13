import React from 'react';
import { View, Text, Image, TouchableOpacity, ViewStyle, TextStyle, StyleProp } from 'react-native';
import { useTheme } from '../../../theme/hooks';

export type ChatBubbleAlign = 'left' | 'right';
export type ChatAction = React.ReactNode | { label: string; onPress?: () => void };

type ChatActionObject = { label: string; onPress?: () => void };
const isActionObject = (x: any): x is ChatActionObject => !!x && typeof x === 'object' && 'label' in x;

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
}

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
}) => {
    const { theme, isDark } = useTheme();
    const colors = theme.colors;

    const isRight = align === 'right';

    const defaultBubbleStyle: ViewStyle = {
        maxWidth: '80%',
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: theme.spacing.sm,
        borderRadius: theme.borderRadius.lg,
        backgroundColor: isRight ? colors.primary : theme.button?.secondary?.backgroundColor ?? (isDark ? '#2C2C2E' : '#F2F2F7'),
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
        <View style={[{ alignItems: 'flex-end' }, style]} testID={testID}>
            {/* 主行：头像 + 气泡 */}
            <View style={{ flexDirection: isRight ? 'row-reverse' : 'row', alignItems: 'flex-end' }}>
                {avatar && <View style={{ marginHorizontal: 8 }}>{avatar}</View>}
                <View style={[defaultBubbleStyle, bubbleStyle]}>
                    {text != null ? <Text style={[defaultTextStyle, textStyle]}>{text}</Text> : children}
                </View>
            </View>

            {/* 底部行：左侧按钮组 + 右侧文字 */}
            {(leftActions?.length || rightFooterText) && (
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: 6,
                    marginLeft: showAvatar && !isRight ? 48 : 0,
                    marginRight: showAvatar && isRight ? 48 : 0,
                }}>
                    <View style={{ flexDirection: 'row' }}>
                        {leftActions?.map(renderAction)}
                    </View>
                    {typeof rightFooterText === 'string' ? (
                        <Text style={[{ fontSize: 12, color: colors.textSecondary ?? (isDark ? '#A1A1A6' : '#6C6C70') }, footerTextStyle]}>
                            {rightFooterText}
                        </Text>
                    ) : (
                        rightFooterText ?? null
                    )}
                </View>
            )}
        </View>
    );
};

export default ChatBubble;