import React from 'react';
import { View, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { useTheme } from '../../../theme/hooks';
import { Icon } from '../../ui/Icon';
import { Text } from '../../ui/Text';

export type ResultStatus = 'success' | 'error' | 'warning' | 'info' | 'offline';

export interface ResultAction {
  text: string;
  onPress: () => void;
  type?: 'primary' | 'secondary';
}

export interface ResultProps {
  status: ResultStatus;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  extra?: React.ReactNode; // 额外内容区（如自定义按钮/说明）
  actions?: ResultAction[]; // 动作按钮组（优先级高于 extra）
  style?: ViewStyle;
  align?: 'center' | 'start';
  spacing?: number;
  fullHeight?: boolean;
  testID?: string;
}

export const Result: React.FC<ResultProps> = ({
  status,
  title,
  description,
  extra,
  actions,
  style,
  align = 'center',
  spacing = 8,
  fullHeight = true,
  testID,
}) => {
  const { theme } = useTheme();
  const { colors } = theme;
  const alignItems = align === 'center' ? 'center' : 'flex-start';

  const colorMap: Record<ResultStatus, string> = {
    success: colors.success,
    error: colors.error,
    warning: colors.warning,
    info: colors.info,
    offline: colors.border,
  };

  const iconMap: Record<ResultStatus, string> = {
    success: 'checkmark-circle',
    error: 'close-circle',
    warning: 'alert-circle',
    info: 'information-circle',
    offline: 'cloud-offline',
  };

  const statusColor = colorMap[status] ?? colors.primary;
  const statusIcon = iconMap[status] ?? 'information-circle';

  return (
    <View
      style={[styles.container, fullHeight && styles.fullHeight, { alignItems }, style]}
      pointerEvents="box-none"
      testID={testID}
    >
      {/* 状态图标 */}
      <View style={{ marginBottom: spacing }}>
        <Icon name={statusIcon} size={56} color={statusColor} />
      </View>

      {/* 标题 */}
      {title ? (
        typeof title === 'string' ? (
          <Text style={[styles.title, { color: colors.text }, align === 'center' && styles.center]}>{title}</Text>
        ) : (
          <View>{title}</View>
        )
      ) : null}

      {/* 描述 */}
      {description ? (
        typeof description === 'string' ? (
          <Text
            style={[
              styles.description,
              { color: colors.textSecondary, marginTop: spacing },
              align === 'center' && styles.center,
            ]}
          >
            {description}
          </Text>
        ) : (
          <View style={{ marginTop: spacing }}>{description}</View>
        )
      ) : null}

      {/* 动作按钮优先，其次额外内容 */}
      {Array.isArray(actions) && actions.length > 0 ? (
        <View style={[styles.actionsRow, { marginTop: spacing * 2 }]} pointerEvents="box-none">
          {actions.map((a, idx) => (
            <TouchableOpacity
              key={idx}
              style={[styles.actionBtn, a.type === 'primary' ? styles.primaryBtn : styles.secondaryBtn]}
              activeOpacity={0.8}
              onPress={a.onPress}
            >
              <Text style={[styles.actionText, a.type === 'primary' ? styles.primaryText : styles.secondaryText]}>
                {a.text}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      ) : extra ? (
        <View style={{ marginTop: spacing * 2 }} pointerEvents="box-none">{extra}</View>
      ) : null}
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
    fontSize: 20,
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
    backgroundColor: '#007AFF',
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

export default Result;