// 文件：RefreshableList.tsx，接口：RefreshableListProps
import React, { useCallback, useMemo, useRef, useState, useEffect } from 'react';
import {
    FlatList,
    type FlatListProps,
    type ListRenderItemInfo,
    View,
    Text,
    Image,
    ActivityIndicator,
    type NativeSyntheticEvent,
    type NativeScrollEvent,
    StyleSheet,
    RefreshControl,
} from 'react-native';
import { useTheme } from '../../../theme/hooks';
import { Icon } from '../../ui';

export interface RefreshableListProps<T> extends Omit<FlatListProps<T>,
    'refreshing' | 'onRefresh' | 'ListFooterComponent' | 'ListEmptyComponent'> {
    // 刷新
    refreshing?: boolean;
    onRefresh?: () => Promise<void> | void;
    enablePullToRefresh?: boolean; // 是否启用下拉刷新（native/custom 都受控）
    refreshMode?: 'native' | 'custom' | 'auto'; // 默认 auto：传入自定义头自动切到 custom
    refreshThreshold?: number;     // custom 模式触发阈值（默认 80）
    renderRefreshHeader?: (state: { pullDistance: number; threshold: number; refreshing: boolean }) => React.ReactNode;
    refreshIconName?: string;      // custom 模式默认图标
    refreshImageSource?: any;      // custom 模式自定义图片
    refreshTintColor?: string;     // native iOS 指示器颜色
    refreshTitle?: string;         // native iOS 文本
    refreshColors?: string[];      // native Android 指示器颜色
    refreshProgressOffset?: number;// native 指示器顶部偏移

    // 加载更多 / 翻页
    onEndReached?: () => Promise<void> | void;
    loadingMore?: boolean;
    noMore?: boolean;
    onEndReachedThreshold?: number;
    footerLoadingText?: string;
    footerNoMoreText?: string;
    footerLoadingComponent?: React.ComponentType<any> | React.ReactElement | null;
    footerNoMoreComponent?: React.ComponentType<any> | React.ReactElement | null;

    // 空态
    emptyText?: string;
    emptyComponent?: React.ComponentType<any> | React.ReactElement | null;

    // 内容内边距（便捷）
    contentPadding?: number;
}

// 文件：RefreshableList.tsx，函数：RefreshableList
export function RefreshableList<T>(props: RefreshableListProps<T>) {
    const {
        data,
        renderItem,
        keyExtractor,
        refreshing = false,
        onRefresh,
        enablePullToRefresh = true,
        refreshMode = 'auto',
        refreshThreshold = 80,
        renderRefreshHeader,
        refreshIconName = 'refresh',
        refreshImageSource,
        refreshTintColor,
        refreshTitle,
        refreshColors,
        refreshProgressOffset,
        onEndReached,
        loadingMore = false,
        noMore = false,
        onEndReachedThreshold = 0.2,
        footerLoadingText = '加载中...',
        footerNoMoreText = '没有更多了',
        footerLoadingComponent,
        footerNoMoreComponent,
        emptyText = '暂无数据',
        emptyComponent,
        contentPadding,
        style,
        contentContainerStyle,
        removeClippedSubviews = true,
        initialNumToRender = 10,
        maxToRenderPerBatch = 10,
        windowSize = 5,
        updateCellsBatchingPeriod = 50,
        ...rest
    } = props as RefreshableListProps<T>;

    const { theme } = useTheme();
    const colors = theme.colors;

    // 自动模式：提供自定义头则使用 custom，否则 native
    const effectiveMode = useMemo<'native' | 'custom'>(() => {
        if (refreshMode === 'native' || refreshMode === 'custom') return refreshMode;
        const hasCustom = !!renderRefreshHeader || !!refreshImageSource || !!refreshIconName;
        return hasCustom ? 'custom' : 'native';
    }, [refreshMode, renderRefreshHeader, refreshImageSource, refreshIconName]);

    // 将拉动距离的状态放在组件顶层
    const [pullDistance, setPullDistance] = useState(0);
    const isDraggingRef = useRef(false);

    useEffect(() => { if (!refreshing) setPullDistance(0); }, [refreshing]);

    const onScrollBeginDrag = useCallback(() => {
        if (effectiveMode === 'custom') isDraggingRef.current = true;
    }, [effectiveMode]);

    const onScroll = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
        if (effectiveMode !== 'custom' || !enablePullToRefresh || !isDraggingRef.current) return;
        const y = e.nativeEvent.contentOffset.y;
        if (y <= 0) setPullDistance(Math.max(0, -y)); else setPullDistance(0);
    }, [effectiveMode, enablePullToRefresh]);

    const onScrollEndDrag = useCallback(() => {
        isDraggingRef.current = false;
        if (effectiveMode !== 'custom' || !enablePullToRefresh || refreshing) return;
        if (pullDistance >= refreshThreshold) onRefresh?.();
    }, [effectiveMode, enablePullToRefresh, refreshing, pullDistance, refreshThreshold, onRefresh]);

    // 原生刷新控件
    const refreshControlEl = useMemo(() => {
        if (effectiveMode !== 'native' || !enablePullToRefresh || !onRefresh) return undefined;
        return (
            <RefreshControl
                refreshing={!!refreshing}
                onRefresh={() => onRefresh?.()}
                tintColor={refreshTintColor}
                title={refreshTitle}
                colors={refreshColors}
                progressViewOffset={refreshProgressOffset}
            />
        );
    }, [effectiveMode, enablePullToRefresh, refreshing, onRefresh, refreshTintColor, refreshTitle, refreshColors, refreshProgressOffset]);

    // 自定义刷新头
    const HeaderComponent = useMemo<React.ComponentType<any> | React.ReactElement | null>(() => {
        if (!enablePullToRefresh || effectiveMode !== 'custom') return null;
        const height = Math.min(pullDistance, refreshThreshold);
        const content = renderRefreshHeader
            ? renderRefreshHeader({ pullDistance, threshold: refreshThreshold, refreshing })
            : (
                <View style={styles.headerInner}>
                    {refreshImageSource ? (
                        <Image source={refreshImageSource} style={styles.headerImage} />
                    ) : (
                        <Icon name={refreshIconName} size={24} />
                    )}
                    <Text style={styles.headerText}>
                        {refreshing ? '正在刷新...' : pullDistance >= refreshThreshold ? '释放刷新' : '下拉刷新'}
                    </Text>
                </View>
            );
        return (<View style={[styles.headerContainer, { height }]}>{content}</View>);
    }, [enablePullToRefresh, effectiveMode, pullDistance, refreshThreshold, refreshing, renderRefreshHeader, refreshImageSource, refreshIconName]);

    // 底部与空态
    const FooterComponent = useMemo<React.ComponentType<any> | React.ReactElement | null>(() => {
        if (loadingMore) {
            return footerLoadingComponent ?? (
                <View style={styles.footer}>
                    <ActivityIndicator size="small" color={colors.textSecondary} />
                    <Text style={[styles.footerText, { color: colors.textSecondary }]}>{footerLoadingText}</Text>
                </View>
            );
        }
        if (noMore) {
            return footerNoMoreComponent ?? (
                <View style={styles.footer}>
                    <Text style={[styles.footerText, { color: colors.textSecondary }]}>{footerNoMoreText}</Text>
                </View>
            );
        }
        return null;
    }, [loadingMore, noMore, footerLoadingComponent, footerNoMoreComponent, footerLoadingText, footerNoMoreText, colors.textSecondary]);

    const EmptyComponent = useMemo<React.ComponentType<any> | React.ReactElement | null>(() => {
        if (emptyComponent) return emptyComponent;
        return (
            <View style={styles.empty}>
                <Text style={[styles.emptyText, { color: colors.textSecondary }]}>{emptyText}</Text>
            </View>
        );
    }, [emptyComponent, emptyText, colors.textSecondary]);

    const mergedContentContainerStyle = useMemo(() => {
        return [contentContainerStyle, contentPadding != null ? { padding: contentPadding } : null];
    }, [contentContainerStyle, contentPadding]);

    return (
        <FlatList
            data={data}
            renderItem={renderItem as (info: ListRenderItemInfo<T>) => React.ReactElement}
            keyExtractor={keyExtractor as any}
            style={style}
            contentContainerStyle={mergedContentContainerStyle}
            ListHeaderComponent={HeaderComponent}
            ListFooterComponent={FooterComponent}
            ListEmptyComponent={EmptyComponent}
            refreshControl={refreshControlEl}
            onScrollBeginDrag={onScrollBeginDrag}
            onScroll={onScroll}
            onScrollEndDrag={onScrollEndDrag}
            onEndReached={() => { if (!loadingMore && !noMore) onEndReached?.(); }}
            onEndReachedThreshold={onEndReachedThreshold}
            removeClippedSubviews={removeClippedSubviews}
            initialNumToRender={initialNumToRender}
            maxToRenderPerBatch={maxToRenderPerBatch}
            windowSize={windowSize}
            updateCellsBatchingPeriod={updateCellsBatchingPeriod}
            showsVerticalScrollIndicator={false}
            {...rest}
        />
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        width: '100%',
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    headerInner: {
        height: 64,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    headerImage: {
        width: 24,
        height: 24,
        resizeMode: 'contain',
    },
    headerText: {
        fontSize: 13,
    },
    footer: {
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    footerText: {
        fontSize: 13,
    },
    empty: {
        paddingVertical: 80,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyText: {
        fontSize: 14,
    },
});