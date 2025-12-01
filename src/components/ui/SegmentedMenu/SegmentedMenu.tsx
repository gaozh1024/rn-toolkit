import React, { useMemo, useRef, useState } from 'react';
import { ScrollView, View, Pressable, Text, StyleSheet, LayoutChangeEvent, ViewStyle, TextStyle, ColorValue, StyleProp } from 'react-native';
import { useTheme } from '../../../theme';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

export interface SegmentedMenuItem {
  key: string | number;
  label: string | React.ReactNode;
}

export interface SegmentedMenuProps {
  items: SegmentedMenuItem[];
  index?: number; // 受控选中索引
  defaultIndex?: number; // 非受控初始索引
  onChange?: (key: string | number, index: number) => void;
  setIndex?: (index: number) => void; // 可选：兼容旧用法
  // 样式与主题
  color?: ColorValue; // 文本/未选中颜色（默认取主题）
  selectColor?: ColorValue; // 选中文本颜色（默认取主题 primary）
  lineColor?: ColorValue; // 指示条颜色（默认取主题 primary）
  lineSize?: number; // 指示条宽度（px），默认 24
  indicatorVariant?: 'line' | 'background'; // 指示样式：底部线 or 背景块
  indicatorStyle?: StyleProp<ViewStyle>; // 指示器样式（可定制圆角/高度/颜色等）
  edge?: number; // 每项左右内边距，默认 16
  fontSize?: number; // 字体大小，默认 14
  animatedDuration?: number; // 动画时长，默认 240ms
  // 容器/项样式
  style?: StyleProp<ViewStyle>;
  styleInner?: StyleProp<ViewStyle>;
  itemStyle?: StyleProp<ViewStyle>;
  // 选中样式（文本/容器分离），兼容旧 selectStyle
  selectedTextStyle?: StyleProp<TextStyle>;
  selectedItemStyle?: StyleProp<ViewStyle>;
  selectStyle?: StyleProp<any>;
  testID?: string;
}

const SegmentedMenu: React.FC<SegmentedMenuProps> = ({
  items,
  index,
  defaultIndex = 0,
  onChange,
  setIndex,
  color,
  selectColor,
  lineColor,
  lineSize = 24,
  indicatorVariant = 'line',
  indicatorStyle: indicatorUserStyle,
  edge = 16,
  fontSize = 14,
  animatedDuration = 240,
  style,
  styleInner,
  itemStyle,
  selectedTextStyle,
  selectedItemStyle,
  selectStyle,
  testID,
}) => {
  const { theme } = useTheme();
  const colors = theme.colors as any;

  const textColor = color ?? colors.subtext;
  const textActiveColor = selectColor ?? colors.text;
  const indicatorColor = lineColor ?? colors.primary;

  const scrollRef = useRef<ScrollView>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [measuredWidths, setMeasuredWidths] = useState<number[]>([]);

  // 受控/非受控索引
  const isControlled = typeof index === 'number';
  const [internalIndex, setInternalIndex] = useState(defaultIndex);
  const currentIndex = isControlled ? (index as number) : internalIndex;

  // 指示条 X 偏移
  const translateX = useSharedValue(0);
  const indicatorWidth = useSharedValue(lineSize);
  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    width: indicatorWidth.value,
  }));

  const handleContainerLayout = (e: LayoutChangeEvent) => {
    setContainerWidth(e.nativeEvent.layout.width);
  };

  // 计算每项宽度（含左右内边距）
  const tempWidthsRef = useRef<number[]>([]);
  const handleItemLayout = (i: number, e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    tempWidthsRef.current[i] = w;
    if (tempWidthsRef.current.filter(Boolean).length === items.length) {
      const next = [...tempWidthsRef.current];
      tempWidthsRef.current = [];
      // 避免重复 set
      if (next.join(',') !== measuredWidths.join(',')) setMeasuredWidths(next);
      // 完成初次测量后，定位到当前索引
      if (next.length && typeof currentIndex === 'number') moveIndicatorToIndex(currentIndex, next);
    }
  };

  const sumBefore = (arr: number[], idx: number) => arr.slice(0, idx).reduce((s, n) => s + n, 0);

  const moveIndicatorToIndex = (idx: number, widths = measuredWidths) => {
    if (!widths.length || idx < 0 || idx >= widths.length) return;
    const offsetLeft = sumBefore(widths, idx);
    const w = widths[idx];
    const targetX = indicatorVariant === 'line'
      ? (offsetLeft + Math.max(0, (w - lineSize) / 2))
      : offsetLeft;

    translateX.value = withTiming(targetX, { duration: animatedDuration });
    indicatorWidth.value = withTiming(indicatorVariant === 'line' ? lineSize : w, { duration: animatedDuration });

    // 自动将当前项居中
    const centerX = offsetLeft + w / 2;
    const idealScrollX = Math.max(0, centerX - containerWidth / 2);
    scrollRef.current?.scrollTo({ x: idealScrollX, animated: true });
  };

  const handlePress = (i: number) => {
    const item = items[i];
    if (!isControlled) setInternalIndex(i);
    setIndex?.(i);
    onChange?.(item.key, i);
    moveIndicatorToIndex(i);
  };

  // 当外部 index 变化时，联动到动画
  React.useEffect(() => {
    if (typeof currentIndex === 'number' && measuredWidths.length) {
      moveIndicatorToIndex(currentIndex);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, measuredWidths, animatedDuration, lineSize, containerWidth]);

  const containerStyle: ViewStyle = useMemo(() => ({
    backgroundColor: 'transparent',
  }), []);

  return (
    <View style={[containerStyle, style]} onLayout={handleContainerLayout} testID={testID}>
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[styles.content, styleInner]}
      >
        {indicatorVariant === 'background' && (
          <Animated.View
            pointerEvents="none"
            style={[
              styles.indicatorBg,
              { backgroundColor: indicatorColor },
              indicatorUserStyle,
              indicatorStyle,
            ]}
          />
        )}
        {items.map((item, i) => {
          const isActive = i === currentIndex;
          return (
            <Pressable
              key={String(item.key)}
              onPress={() => handlePress(i)}
              onLayout={(e) => handleItemLayout(i, e)}
              style={({ pressed }) => [
                styles.item,
                { paddingHorizontal: edge },
                itemStyle,
                pressed ? { opacity: 0.85 } : null,
              ]}
              accessibilityRole="button"
              accessibilityState={{ selected: isActive }}
            >
              {typeof item.label === 'string' ? (
                <Text style={[
                  styles.text,
                  { fontSize, color: isActive ? (textActiveColor as string) : (textColor as string) },
                  isActive ? selectedTextStyle : null,
                  isActive ? (selectStyle as any) : null,
                ]}>
                  {item.label}
                </Text>
              ) : (
                <View style={isActive ? [selectedItemStyle, selectStyle as any] : undefined}>{item.label}</View>
              )}
            </Pressable>
          );
        })}
        {indicatorVariant === 'line' && (
          <Animated.View
            pointerEvents="none"
            style={[styles.indicatorLine, { backgroundColor: indicatorColor }, indicatorUserStyle, indicatorStyle]}
          />
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    alignItems: 'center',
  },
  item: {
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontWeight: '500',
  },
  indicatorLine: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    height: 3,
    borderRadius: 2,
  },
  indicatorBg: {
    position: 'absolute',
    top: 4,
    left: 0,
    height: 36,
    borderRadius: 12,
  },
});

export default SegmentedMenu;