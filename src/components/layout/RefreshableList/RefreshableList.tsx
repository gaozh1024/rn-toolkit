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
} from 'react-native';
import { useTheme } from '../../../theme/hooks';
import { Icon } from '../../ui';

export interface RefreshableListProps<T> extends Omit<FlatListProps<T>,
    'refreshing' | 'onRefresh' | 'ListFooterComponent' | 'ListEmptyComponent'> {
    // 刷新
    refreshing?: boolean;
    onRefresh?: () => Promise<void> | void;
    enablePullToRefresh?: boolean; // 是否启用自定义下拉刷新头（默认 true）
    refreshThreshold?: number;     // 触发刷新阈值（默认 80）
    renderRefreshHeader?: (state: { pullDistance: number; threshold: number; refreshing: boolean }) => React.ReactNode;
    refreshIconName?: string;      // 使用内置 Icon 指示器（优先级低于 renderRefreshHeader）
    refreshImageSource?: any;      // 自定义图片指示器（优先级低于 renderRefreshHeader）

    // 加载更多 / 翻页
    onEndReached?: () => Promise<void> | void;
    loadingMore?: boolean;         // 底部加载中状态
    noMore?: boolean;              // 是否无更多数据
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

export function RefreshableList<T>(props: RefreshableListProps<T>) {
    const {
        data,
        renderItem,
        keyExtractor,
        refreshing = false,
        onRefresh,
        enablePullToRefresh = true,
        refreshThreshold = 80,
        renderRefreshHeader,
        refreshIconName = 'refresh',
        refreshImageSource,
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

    const [pullDistance, setPullDistance] = useState(0);
    const isDraggingRef = useRef(false);

    useEffect(() => {
        // 刷新结束后复位下拉头高度
        if (!refreshing) {
            setPullDistance(0);
        }
    }, [refreshing]);

    const onScrollBeginDrag = useCallback(() => {
        isDraggingRef.current = true;
    }, []);

    const onScroll = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
        if (!enablePullToRefresh || !isDraggingRef.current) return;
        const y = e.nativeEvent.contentOffset.y;
        if (y <= 0) {
            setPullDistance(Math.max(0, -y));
        } else {
            setPullDistance(0);
        }
    }, [enablePullToRefresh]);

    const onScrollEndDrag = useCallback(() => {
        isDraggingRef.current = false;
        if (!enablePullToRefresh || refreshing) return;
        if (pullDistance >= refreshThreshold) {
            onRefresh?.();
        }
    }, [enablePullToRefresh, refreshing, pullDistance, refreshThreshold, onRefresh]);

    const HeaderComponent = useMemo<React.ComponentType<any> | React.ReactElement | null>(() => {
        if (!enablePullToRefresh) return null;
        const height = Math.min(pullDistance, refreshThreshold);
    
        const content = renderRefreshHeader
            ? renderRefreshHeader({ pullDistance, threshold: refreshThreshold, refreshing })
            : (
                <View style={styles.headerInner}>
                    {refreshImageSource ? (
                        <Image source={refreshImageSource} style={styles.headerImage} />
                    ) : (
                        <Icon name={refreshIconName} size={24} color={colors.primary} />
                    )}
                    <Text style={[styles.headerText, { color: colors.text }]}>
                        {refreshing
                            ? '正在刷新...'
                            : pullDistance >= refreshThreshold
                                ? '释放刷新'
                                : '下拉刷新'}
                    </Text>
                </View>
            );
    
        return (
            <View style={[styles.headerContainer, { height }]}>
                {content}
            </View>
        );
    }, [enablePullToRefresh, pullDistance, refreshThreshold, refreshing, renderRefreshHeader, refreshImageSource, refreshIconName, colors]);

    const FooterComponent = useMemo<React.ComponentType<any> | React.ReactElement | null>(() => {
        if (loadingMore) {
            return footerLoadingComponent ?? (
                <View style={styles.footer}>
                    <ActivityIndicator size="small" color={colors.primary} />
                    <Text style={[styles.footerText, { color: colors.text }]}>{footerLoadingText}</Text>
                </View>
            );
        }
        if (noMore) {
            return footerNoMoreComponent ?? (
                <View style={styles.footer}>
                    <Text style={[styles.footerText, { color: colors.text }]}>{footerNoMoreText}</Text>
                </View>
            );
        }
        return null;
    }, [loadingMore, noMore, footerLoadingComponent, footerNoMoreComponent, footerLoadingText, footerNoMoreText, colors]);

    const EmptyComponent = useMemo<React.ComponentType<any> | React.ReactElement | null>(() => {
        if (emptyComponent) return emptyComponent;
        return (
            <View style={styles.empty}>
                <Text style={[styles.emptyText, { color: colors.text }]}>{emptyText}</Text>
            </View>
        );
    }, [emptyComponent, emptyText, colors]);

    const mergedContentContainerStyle = useMemo(() => {
        return [
            contentContainerStyle,
            contentPadding != null ? { padding: contentPadding } : null,
        ];
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