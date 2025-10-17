import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Animated } from 'react-native';
import { useTheme, useLayoutStyles, useSpacingStyles } from '../../../theme';
import { useComponentNavigation } from '../../../navigation';
import Button from '../../ui/Button/Button';
import { PickerService, type PickerItem } from './PickerService';

type PickerParams = {
    id: string;
    title?: string;
    direction?: 'bottom' | 'top' | 'left' | 'right' | 'fade' | 'none' | 'ios';
    initialIndices?: number[];
    columns?: PickerItem[][];
};

const ITEM_HEIGHT = 40;
const VISIBLE_COUNT = 5;

const WheelPickerModal: React.FC<any> = ({ route }) => {
    const params = (route?.params || {}) as PickerParams;
    const { id, title = '请选择', direction = 'bottom' } = params;
    const initialIndicesProp = params.initialIndices || [];

    const { theme } = useTheme();
    const layout = useLayoutStyles();
    const spacing = useSpacingStyles();
    const nav = useComponentNavigation();

    const initialColumns = useMemo(() => {
        return PickerService.getColumns(id) || params.columns || [[]];
    }, [id, params.columns]);

    const initialSelectionFromService = useMemo(() => {
        return PickerService.getSelection(id) || initialIndicesProp;
    }, [id, initialIndicesProp]);

    const [columns, setColumns] = useState<PickerItem[][]>(initialColumns);
    const [selectedIndices, setSelectedIndices] = useState<number[]>(
        columns.map((col, i) => {
            const idx = initialSelectionFromService[i] ?? 0;
            return Math.min(Math.max(idx, 0), Math.max(col.length - 1, 0));
        })
    );

    const listsRef = useRef<Array<FlatList<PickerItem> | null>>([]);
    const overlayOpacity = useRef(new Animated.Value(0)).current;
    const cardTranslate = useRef(new Animated.Value(direction === 'bottom' ? 48 : 0)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(overlayOpacity, { toValue: 1, duration: 180, useNativeDriver: true }),
            Animated.timing(cardTranslate, { toValue: 0, duration: 220, useNativeDriver: true }),
        ]).start();
    }, [overlayOpacity, cardTranslate]);

    useEffect(() => {
        const unsub = PickerService.subscribe(id, (nextColumns: PickerItem[][]) => {
            setColumns(nextColumns);
            setSelectedIndices((prev) => {
                const next = nextColumns.map((col, i) => {
                    const old = prev[i] ?? 0;
                    const maxIdx = Math.max(col.length - 1, 0);
                    return Math.min(Math.max(old, 0), maxIdx);
                });
                return next;
            });
            setTimeout(() => {
                nextColumns.forEach((col, i) => {
                    const ref = listsRef.current[i];
                    const idx = selectedIndices[i] ?? 0;
                    if (ref && col.length > 0) {
                        try {
                            ref.scrollToIndex({ index: Math.min(idx, col.length - 1), animated: false });
                        } catch { }
                    }
                });
            }, 0);
        });
        return unsub;
    }, [id, selectedIndices]);

    useEffect(() => {
        const unsubSelection = PickerService.subscribeSelection(id, (nextIndices: number[]) => {
            setSelectedIndices((prev) => {
                const next = nextIndices.map((idx, i) => {
                    const maxIdx = Math.max((columns[i]?.length ?? 0) - 1, 0);
                    return Math.min(Math.max(idx ?? prev[i] ?? 0, 0), maxIdx);
                });
                return next;
            });
            setTimeout(() => {
                nextIndices.forEach((idx, i) => {
                    const ref = listsRef.current[i];
                    const maxIdx = Math.max((columns[i]?.length ?? 0) - 1, 0);
                    const clamped = Math.min(Math.max(idx ?? 0, 0), maxIdx);
                    if (ref && maxIdx >= 0) {
                        try {
                            ref.scrollToIndex({ index: clamped, animated: false });
                        } catch { }
                    }
                });
            }, 0);
        });
        return unsubSelection;
    }, [id, columns]);

    useEffect(() => {
        setTimeout(() => {
            columns.forEach((col, i) => {
                const ref = listsRef.current[i];
                const idx = selectedIndices[i] ?? 0;
                if (ref && col.length > 0) {
                    try {
                        ref.scrollToIndex({ index: Math.min(idx, col.length - 1), animated: false });
                    } catch { }
                }
            });
        }, 0);
    }, []);

    const getItemLayout = (_: any, index: number) => ({
        length: ITEM_HEIGHT,
        offset: ITEM_HEIGHT * index,
        index,
    });

    const onMomentumEnd = (colIndex: number, e: any) => {
        const offsetY = e.nativeEvent.contentOffset?.y ?? 0;
        const idx = Math.round(offsetY / ITEM_HEIGHT);
        setSelectedIndices((prev) => {
            const next = [...prev];
            const maxIdx = Math.max(columns[colIndex].length - 1, 0);
            next[colIndex] = Math.min(Math.max(idx, 0), maxIdx);
            return next;
        });
    };

    const doConfirm = () => {
        const values = selectedIndices.map((idx, i) => columns[i]?.[idx]?.value);
        try {
            PickerService.resolve(id, values);
        } finally {
            nav.goBack();
        }
    };

    const doCancel = () => {
        try {
            PickerService.reject(id, 'cancel');
        } finally {
            nav.goBack();
        }
    };

    const highlightStyle = {
        position: 'absolute' as const,
        top: (Math.floor(VISIBLE_COUNT / 2)) * ITEM_HEIGHT,
        height: ITEM_HEIGHT,
        left: 0,
        right: 0,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: theme.colors.border,
        backgroundColor: theme.colors.surface,
        opacity: 0.85,
    };

    return (
        <View style={[StyleSheet.absoluteFill, { justifyContent: 'flex-end' }]}>
            <Animated.View
                style={[StyleSheet.absoluteFill, { backgroundColor: theme.colors.overlay, opacity: overlayOpacity }]}
            />
            <Animated.View
                style={[
                    { backgroundColor: theme.colors.card, borderTopLeftRadius: theme.borderRadius.lg, borderTopRightRadius: theme.borderRadius.lg },
                    { paddingBottom: spacing.pbMd?.paddingBottom ?? 16 },
                    { transform: [{ translateY: cardTranslate }] },
                ]}
            >
                <View style={[layout.rowBetween, spacing.pxMd, spacing.ptMd, spacing.pbSm]}>
                    <Button variant="text" title="取消" onPress={doCancel} />
                    <Text style={{ ...theme.text.h6, color: theme.colors.text }}>{title}</Text>
                    <Button variant="text" title="确定" onPress={doConfirm} />
                </View>

                <View style={[{ height: ITEM_HEIGHT * VISIBLE_COUNT }, spacing.pxMd]}>
                    <View style={highlightStyle} />
                    <View style={[layout.row, { alignItems: 'center' }]}>
                        {columns.map((col, colIndex) => (
                            <View key={colIndex} style={{ flex: 1 }}>
                                <FlatList
                                    ref={(r) => {
                                        listsRef.current[colIndex] = r;
                                    }}
                                    data={col}
                                    keyExtractor={(item, i) => String(item.value ?? i)}
                                    getItemLayout={getItemLayout}
                                    initialScrollIndex={selectedIndices[colIndex] ?? 0}
                                    showsVerticalScrollIndicator={false}
                                    snapToInterval={ITEM_HEIGHT}
                                    decelerationRate="fast"
                                    onMomentumScrollEnd={(e) => onMomentumEnd(colIndex, e)}
                                    contentContainerStyle={{
                                        paddingVertical: (Math.floor(VISIBLE_COUNT / 2)) * ITEM_HEIGHT,
                                    }}
                                    renderItem={({ item, index }) => {
                                        const isActive = index === selectedIndices[colIndex];
                                        return (
                                            <View style={{ height: ITEM_HEIGHT, justifyContent: 'center' }}>
                                                <Text
                                                    style={{
                                                        textAlign: 'center',
                                                        fontSize: theme.button.primary.fontSize,
                                                        color: isActive ? theme.colors.text : theme.colors.subtext,
                                                    }}
                                                >
                                                    {item.label}
                                                </Text>
                                            </View>
                                        );
                                    }}
                                />
                            </View>
                        ))}
                    </View>
                </View>
            </Animated.View>
        </View>
    );
};

export default WheelPickerModal;