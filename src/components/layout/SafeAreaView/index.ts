export { SafeAreaView } from './SafeAreaView';
export { SafeAreaContainer } from './SafeAreaContainer';
export { useSafeArea } from './useSafeArea';
export type { SafeAreaViewProps } from './SafeAreaView';
export type { SafeAreaContainerProps } from './SafeAreaContainer';
export type { SafeAreaConfig } from './useSafeArea';

// 重新导出 react-native-safe-area-context 的类型和组件
export {
    SafeAreaProvider,
    SafeAreaInsetsContext,
    SafeAreaFrameContext,
    useSafeAreaInsets,
    useSafeAreaFrame,
    withSafeAreaInsets,
    type Edge,
    type EdgeInsets,
} from 'react-native-safe-area-context';