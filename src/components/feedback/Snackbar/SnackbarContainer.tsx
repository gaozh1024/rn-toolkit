import React, { useEffect, useRef, useState } from 'react';
import { View, Animated, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFadeAnimation } from '../../../animation';
import { useTheme } from '../../../theme/hooks';
import { SnackbarService, SnackbarState } from './SnackbarService';
import { Text } from '../../ui/Text';

export const SnackbarContainer: React.FC = () => {
  const { theme } = useTheme?.() ?? { theme: { colors: { background: '#1C1C1E', text: '#FFFFFF', primary: '#0A84FF' } } } as any;
  const colors = theme?.colors ?? { background: '#1C1C1E', text: '#FFFFFF', primary: '#0A84FF' } as any;
  const insets = useSafeAreaInsets();

  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [actionText, setActionText] = useState<string | undefined>(undefined);
  const [safeArea, setSafeArea] = useState(true);
  // 将 onAction/onClose 改为 ref 存储，避免函数被当作“函数式更新”而执行
  const onActionRef = useRef<(() => void) | undefined>(undefined);
  const onCloseRef = useRef<(() => void) | undefined>(undefined);
  const [duration, setDuration] = useState(3000);

  const { fadeAnim, fadeIn, fadeOut } = useFadeAnimation(0);
  const translateY = useRef(new Animated.Value(30)).current;
  const hideTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const unsub = SnackbarService.subscribe((state: SnackbarState) => {
      // 清理上次计时器
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
        hideTimerRef.current = null;
      }

      if (state.visible) {
        setMessage((state as any).message);
        setActionText((state as any).actionText);
        // 通过 ref 存储函数，避免误触发
        onActionRef.current = (state as any).onAction;
        onCloseRef.current = (state as any).onClose;
        setSafeArea((state as any).safeArea ?? true);
        setDuration((state as any).duration ?? 3000);
        setVisible(true);

        // 入场动画
        (fadeAnim as any).setValue?.(0);
        translateY.setValue(30);
        (fadeIn(180) as any).start?.();
        Animated.timing(translateY, { toValue: 0, duration: 180, useNativeDriver: true }).start();

        // 自动消失
        hideTimerRef.current = setTimeout(() => {
          const out = fadeOut(180);
          (out as any).start?.(() => {
            setVisible(false);
            // 延迟跨组件更新与回调到下一 tick，避免在渲染期间的副作用
            setTimeout(() => {
              SnackbarService.hide();
              onCloseRef.current?.();
            }, 0);
          });
          Animated.timing(translateY, { toValue: 30, duration: 180, useNativeDriver: true }).start();
        }, (state as any).duration ?? 3000);
      } else {
        // 立即隐藏（用于手动关闭）
        const out = fadeOut(150);
        (out as any).start?.(() => {
          setVisible(false);
          // 同样延迟用户回调执行
          setTimeout(() => { onCloseRef.current?.(); }, 0);
        });
        Animated.timing(translateY, { toValue: 30, duration: 150, useNativeDriver: true }).start();
      }
    });
    return () => unsub();
  }, [fadeAnim, fadeIn, fadeOut, translateY]);

  if (!visible) return null;

  const bottomPadding = (safeArea ? insets.bottom : 0) + 16;

  const onPressAction = () => {
    try { onActionRef.current?.(); } finally {
      // 延迟关闭，避免跨组件同步更新警告
      setTimeout(() => SnackbarService.hide(), 0);
    }
  };

  return (
    <View pointerEvents="box-none" style={styles.root}>
      <View pointerEvents="box-none" style={[styles.overlay, { paddingBottom: bottomPadding }]}>
        <Animated.View style={[styles.bar, { backgroundColor: colors.background, opacity: fadeAnim, transform: [{ translateY }] }]}>
          <Text style={[styles.message, { color: colors.text }]} numberOfLines={2}>{message}</Text>
          {!!actionText && (
            <TouchableOpacity onPress={onPressAction} activeOpacity={0.8} style={styles.actionWrap}>
              <Text style={[styles.actionText, { color: colors.primary }]}>{actionText}</Text>
            </TouchableOpacity>
          )}
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, zIndex: 9999 },
  overlay: { flex: 1, alignItems: 'center', justifyContent: 'flex-end', paddingHorizontal: 16 },
  bar: {
    maxWidth: '95%',
    minHeight: 44,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  message: { flex: 1, fontSize: 14 },
  actionWrap: { marginLeft: 12 },
  actionText: { fontSize: 14, fontWeight: '600' },
});