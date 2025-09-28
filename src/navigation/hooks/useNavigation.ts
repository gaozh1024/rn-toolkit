import { useNavigation as useRNNavigation } from '@react-navigation/native';
import { StackActions } from '@react-navigation/native';
import { navigationService } from '../services/NavigationService';

/**
 * 组件内导航Hook - 依赖React Navigation上下文
 */
export const useComponentNavigation = () => {
    const navigation = useRNNavigation<any>();

    return {
        // === 基础导航方法（适用于所有导航器） ===
        navigate: (name: string, params?: any) => navigation.navigate(name as any, params),
        goBack: () => navigation.goBack(),
        canGoBack: () => navigation.canGoBack(),

        // === 堆栈导航方法 ===
        push: (name: string, params?: any) => {
            if ('push' in navigation) {
                (navigation as any).push(name, params);
            } else {
                navigation.dispatch(StackActions.push(name, params));
            }
        },
        pop: (count: number = 1) => {
            if ('pop' in navigation) {
                (navigation as any).pop(count);
            } else {
                navigation.dispatch(StackActions.pop(count));
            }
        },
        popToRoot: () => {
            if ('popToTop' in navigation) {
                (navigation as any).popToTop();
            } else {
                navigation.dispatch(StackActions.popToTop());
            }
        },
        replace: (name: string, params?: any) => {
            if ('replace' in navigation) {
                (navigation as any).replace(name, params);
            } else {
                navigation.dispatch(StackActions.replace(name, params));
            }
        },

        // === 标签导航方法 ===
        jumpTo: (name: string, params?: any) => {
            if ('jumpTo' in navigation) {
                (navigation as any).jumpTo(name, params);
            } else {
                navigation.navigate(name as any, params);
            }
        },

        // === 状态和监听器 ===
        getState: () => navigation.getState(),
        addListener: (type: string, listener: any) => navigation.addListener(type as any, listener),
        dispatch: (action: any) => navigation.dispatch(action),

        // === 原始navigation对象 ===
        raw: navigation,
    };
};

/**
 * 全局导航Hook - 不依赖组件上下文，可在任何地方使用（推荐）
 */
export const useNavigation = () => {
    return {
        navigate: (name: string, params?: any) => navigationService.navigate(name, params),
        push: (name: string, params?: any) => navigationService.push(name, params),
        pop: (count: number = 1) => navigationService.pop(count),
        popToRoot: () => navigationService.popToRoot(),
        replace: (name: string, params?: any) => navigationService.replace(name, params),
        reset: (routes: Array<{ name: string; params?: any }>) => navigationService.reset(routes),
        goBack: () => navigationService.goBack(),

        // 状态查询
        getCurrentRouteName: () => navigationService.getCurrentRouteName(),
        getCurrentParams: () => navigationService.getCurrentParams(),
        canGoBack: () => navigationService.canGoBack(),
        getState: () => navigationService.getState(),
        isReady: () => navigationService.isReady(),

        // 监听器
        addStateChangeListener: (listener: any) => navigationService.addStateChangeListener(listener),
    };
};

// === 便捷导出 ===
export { useComponentNavigation as useComponentNav };
export { useNavigation as useNav };

/**
 * 使用示例：
 * 
 * // 全局使用（推荐，可在任何地方使用）
 * const nav = useNavigation();
 * nav.navigate('Home');
 * nav.push('Details', { id: 1 });
 * 
 * // 在组件中使用（依赖React Navigation上下文）
 * const componentNav = useComponentNavigation();
 * componentNav.navigate('Home');
 * componentNav.jumpTo('Profile'); // 标签导航特有方法
 * 
 * // 简写形式
 * const nav = useNav();
 * const componentNav = useComponentNav();
 */