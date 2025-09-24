export { SafeAreaView } from './SafeAreaView';
export { SafeAreaContainer } from './SafeAreaContainer';
export type { SafeAreaViewProps } from './SafeAreaView';
export type { SafeAreaContainerProps } from './SafeAreaContainer';

// 重新导出 react-native-safe-area-context 的组件和函数
export {
    SafeAreaProvider,
    useSafeAreaInsets,
    useSafeAreaFrame,
    withSafeAreaInsets,
} from 'react-native-safe-area-context';

// 重新导出 react-native-safe-area-context 的类型
export type {
    Edge,
    EdgeInsets,
    SafeAreaInsetsContext,
    SafeAreaFrameContext,
} from 'react-native-safe-area-context';