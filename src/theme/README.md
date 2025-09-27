# 主题系统使用文档

RN-Toolkit 提供了一套完整的主题系统，支持浅色/深色模式切换、自定义主题配置以及丰富的样式预设。

## 目录

- [快速开始](#快速开始)
- [基础用法](#基础用法)
- [主题配置](#主题配置)
- [样式预设](#样式预设)
- [Hooks API](#hooks-api)
- [高级用法](#高级用法)
- [最佳实践](#最佳实践)

## 快速开始

### 安装和导入

```typescript
import { useTheme } from 'rn-toolkit';

// 或者导入特定的Hook
import { 
  useTheme, 
  useThemeColors, 
  useStyles,
  lightTheme,
  darkTheme 
} from 'rn-toolkit';
```

### 基本使用

```typescript
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTheme, useStyles } from 'rn-toolkit';

const MyComponent = () => {
  const { theme, isDark, toggleDarkMode } = useTheme();
  const styles = useStyles();

  return (
    <View style={[styles.layout.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[theme.text.h1, { color: theme.colors.text }]}>
        Hello World
      </Text>
      
      <TouchableOpacity 
        style={[styles.spacing.pMd, styles.borderRadius.md]}
        onPress={toggleDarkMode}
      >
        <Text>切换到 {isDark ? '浅色' : '深色'} 模式</Text>
      </TouchableOpacity>
    </View>
  );
};
```

## 基础用法

### 1. 使用主题颜色

```typescript
const { theme } = useTheme();

// 主色调
const primaryButton = {
  backgroundColor: theme.colors.primary,
  borderColor: theme.colors.primaryDark,
};

// 状态色
const errorText = {
  color: theme.colors.error,
};

// 背景色
const container = {
  backgroundColor: theme.colors.background,
};
```

### 2. 使用文本样式

```typescript
const { theme } = useTheme();

return (
  <View>
    <Text style={theme.text.h1}>主标题</Text>
    <Text style={theme.text.body1}>正文内容</Text>
    <Text style={theme.text.caption}>说明文字</Text>
  </View>
);
```

### 3. 使用按钮样式

```typescript
const { theme } = useTheme();

const buttonStyle = {
  ...theme.button.primary,
  // 可以覆盖特定属性
  borderRadius: 12,
};
```

## 主题配置

### 自定义主题

```typescript
import { useTheme, ThemeConfig } from 'rn-toolkit';

const MyComponent = () => {
  const { updateTheme } = useTheme();

  const customizeTheme = () => {
    const config: ThemeConfig = {
      colors: {
        primary: '#FF6B6B',
        secondary: '#4ECDC4',
      },
      text: {
        h1: {
          fontSize: 36,
          fontWeight: '800',
        },
      },
      spacing: {
        md: 20,
        lg: 32,
      },
    };

    updateTheme(config);
  };

  return (
    <TouchableOpacity onPress={customizeTheme}>
      <Text>自定义主题</Text>
    </TouchableOpacity>
  );
};
```

### 重置主题

```typescript
const { resetTheme } = useTheme();

// 重置为默认主题
resetTheme();
```

## 样式预设

### 1. 布局样式

```typescript
const styles = useStyles();

return (
  <View>
    {/* 基础布局 */}
    <View style={styles.layout.container}>
      <View style={styles.layout.row}>
        <Text>行布局</Text>
      </View>
      
      <View style={styles.layout.column}>
        <Text>列布局</Text>
      </View>
    </View>

    {/* 对齐方式 */}
    <View style={styles.layout.center}>
      <Text>居中对齐</Text>
    </View>

    {/* 行布局组合 */}
    <View style={styles.layout.rowBetween}>
      <Text>左侧</Text>
      <Text>右侧</Text>
    </View>

    {/* 定位 */}
    <View style={styles.layout.absolute}>
      <Text>绝对定位</Text>
    </View>
  </View>
);
```

### 2. 间距样式

```typescript
const styles = useStyles();

return (
  <View>
    {/* Padding */}
    <View style={styles.spacing.pMd}>内边距 Medium</View>
    <View style={styles.spacing.pxLg}>水平内边距 Large</View>
    <View style={styles.spacing.pyXs}>垂直内边距 XSmall</View>
    
    {/* Margin */}
    <View style={styles.spacing.mLg}>外边距 Large</View>
    <View style={styles.spacing.mtXl}>顶部外边距 XLarge</View>
  </View>
);
```

### 3. 圆角样式

```typescript
const styles = useStyles();

return (
  <View>
    <View style={[styles.borderRadius.md, { backgroundColor: 'blue' }]}>
      中等圆角
    </View>
    
    <View style={[styles.borderRadius.round, { backgroundColor: 'red' }]}>
      完全圆角
    </View>
    
    <View style={[styles.borderRadius.top, { backgroundColor: 'green' }]}>
      顶部圆角
    </View>
  </View>
);
```

### 4. 阴影样式

```typescript
const styles = useStyles();

return (
  <View>
    <View style={[styles.shadow.sm, { backgroundColor: 'white' }]}>
      小阴影
    </View>
    
    <View style={[styles.shadow.lg, { backgroundColor: 'white' }]}>
      大阴影
    </View>
    
    <View style={[styles.shadow.glow, { backgroundColor: 'white' }]}>
      发光效果
    </View>
  </View>
);
```

### 5. 边框样式

```typescript
const styles = useStyles();

return (
  <View>
    <View style={styles.border.thin}>细边框</View>
    <View style={styles.border.thick}>粗边框</View>
    <View style={styles.border.top}>顶部边框</View>
    <View style={styles.border.dashed}>虚线边框</View>
  </View>
);
```

### 6. 尺寸样式

```typescript
const styles = useStyles();

return (
  <View>
    <View style={styles.size.wFull}>全宽</View>
    <View style={styles.size.hScreen}>屏幕高度</View>
    <View style={[styles.size.wMd, styles.size.hMd]}>固定尺寸</View>
  </View>
);
```

## Hooks API

### useTheme()

主要的主题Hook，提供完整的主题功能。

```typescript
const {
  theme,        // 当前主题对象
  updateTheme,  // 更新主题配置
  resetTheme,   // 重置主题
  isDark,       // 是否为深色模式
  toggleDarkMode // 切换深色模式
} = useTheme();
```

### useStyles()

获取所有样式预设的组合Hook。

```typescript
const {
  colors,       // 颜色
  text,         // 文本样式
  layout,       // 布局样式
  spacing,      // 间距样式
  borderRadius, // 圆角样式
  shadow,       // 阴影样式
  border,       // 边框样式
  size,         // 尺寸样式
} = useStyles();
```

### 特定样式Hooks

```typescript
// 获取特定类型的样式
const colors = useThemeColors();
const textStyles = useTextStyles();
const layoutStyles = useLayoutStyles();
const spacingStyles = useSpacingStyles();
const borderRadiusStyles = useBorderRadiusStyles();
const shadowStyles = useShadowStyles();
const borderStyles = useBorderStyles();
const sizeStyles = useSizeStyles();
```

## 高级用法

### 1. 创建自定义主题预设

```typescript
import { Theme, lightTheme } from 'rn-toolkit';

// 创建品牌主题
export const brandTheme: Theme = {
  ...lightTheme,
  colors: {
    ...lightTheme.colors,
    primary: '#FF6B6B',
    secondary: '#4ECDC4',
    success: '#45B7D1',
  },
  text: {
    ...lightTheme.text,
    h1: {
      ...lightTheme.text.h1,
      fontFamily: 'CustomFont-Bold',
    },
  },
};

// 在应用中使用
const { updateTheme } = useTheme();
updateTheme(brandTheme);
```

### 2. 响应式主题

```typescript
import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const isTablet = width > 768;

const responsiveConfig = {
  text: {
    h1: {
      fontSize: isTablet ? 40 : 32,
    },
  },
  spacing: {
    md: isTablet ? 24 : 16,
  },
};

updateTheme(responsiveConfig);
```

### 3. 主题持久化

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';

// 保存主题配置
const saveThemeConfig = async (config: ThemeConfig) => {
  try {
    await AsyncStorage.setItem('themeConfig', JSON.stringify(config));
  } catch (error) {
    console.error('保存主题配置失败:', error);
  }
};

// 加载主题配置
const loadThemeConfig = async () => {
  try {
    const config = await AsyncStorage.getItem('themeConfig');
    if (config) {
      updateTheme(JSON.parse(config));
    }
  } catch (error) {
    console.error('加载主题配置失败:', error);
  }
};
```

## 最佳实践

### 1. 组件样式组织

```typescript
// 推荐：使用样式预设 + 主题颜色
const MyComponent = () => {
  const { theme } = useTheme();
  const styles = useStyles();

  return (
    <View style={[
      styles.layout.container,
      styles.spacing.pMd,
      { backgroundColor: theme.colors.background }
    ]}>
      <Text style={[
        theme.text.h2,
        styles.spacing.mbSm,
        { color: theme.colors.text }
      ]}>
        标题
      </Text>
    </View>
  );
};
```

### 2. 创建可复用的样式组件

```typescript
import { ViewStyle, TextStyle } from 'react-native';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined';
}

const Card: React.FC<CardProps> = ({ children, variant = 'default' }) => {
  const { theme } = useTheme();
  const styles = useStyles();

  const getCardStyle = (): ViewStyle => {
    const baseStyle = [
      styles.spacing.pMd,
      styles.borderRadius.md,
      { backgroundColor: theme.colors.card }
    ];

    switch (variant) {
      case 'elevated':
        return [...baseStyle, styles.shadow.md];
      case 'outlined':
        return [...baseStyle, styles.border.thin];
      default:
        return baseStyle;
    }
  };

  return (
    <View style={getCardStyle()}>
      {children}
    </View>
  );
};
```

### 3. 主题切换动画

```typescript
import { Animated } from 'react-native';

const AnimatedThemeSwitch = () => {
  const { isDark, toggleDarkMode } = useTheme();
  const animatedValue = useRef(new Animated.Value(isDark ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: isDark ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [isDark]);

  const backgroundColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['#FFFFFF', '#000000'],
  });

  return (
    <Animated.View style={{ backgroundColor }}>
      <TouchableOpacity onPress={toggleDarkMode}>
        <Text>切换主题</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};
```

### 4. 性能优化

```typescript
// 使用 useMemo 缓存样式计算
const MyComponent = () => {
  const { theme } = useTheme();
  const styles = useStyles();

  const computedStyles = useMemo(() => ({
    container: [
      styles.layout.container,
      styles.spacing.pMd,
      { backgroundColor: theme.colors.background }
    ],
    title: [
      theme.text.h1,
      { color: theme.colors.text }
    ],
  }), [theme, styles]);

  return (
    <View style={computedStyles.container}>
      <Text style={computedStyles.title}>标题</Text>
    </View>
  );
};
```

## 类型定义

主题系统提供了完整的 TypeScript 类型支持：

```typescript
import {
  Theme,
  ThemeConfig,
  ColorTheme,
  NavigationTheme,
  TextTheme,
  ButtonTheme,
  InputTheme,
  UseThemeReturn,
} from 'rn-toolkit';
```

## 注意事项

1. **性能考虑**：避免在渲染函数中直接调用 `useTheme()`，建议使用 `useMemo` 缓存样式计算
2. **主题一致性**：建议在应用启动时设置主题，避免频繁切换造成用户体验问题
3. **深色模式**：确保所有自定义颜色在深色模式下都有合适的对比度
4. **平台差异**：某些样式（如阴影）在不同平台上表现可能不同，建议进行充分测试

## 示例项目

查看完整的示例项目以了解更多用法：

```bash
# 克隆示例项目
git clone https://github.com/your-org/rn-toolkit-examples
cd rn-toolkit-examples/theme-example

# 安装依赖
npm install

# 运行项目
npm run ios
# 或
npm run android
```
