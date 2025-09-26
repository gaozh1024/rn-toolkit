import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SafeAreaInsets } from '../types';

/**
 * 获取安全区域信息的Hook
 */
export const useSafeArea = (): SafeAreaInsets => {
  const insets = useSafeAreaInsets();
  
  return {
    top: insets.top,
    bottom: insets.bottom,
    left: insets.left,
    right: insets.right,
  };
};

/**
 * 获取底部安全区域高度
 */
export const useBottomSafeArea = (): number => {
  const { bottom } = useSafeArea();
  return bottom;
};