# Animation Module

React Native 动画模块，提供对 `react-native-reanimated` 的可选支持和自动降级机制。

## 特性

- 🔄 **自动降级**: 当 `react-native-reanimated` 不可用时，自动降级到 React Native 的 `Animated` API
- 🎯 **统一 API**: 无论使用哪种动画库，API 保持一致
- 🚀 **高性能**: 优先使用 `react-native-reanimated` 获得更好的性能
- 📦 **可选依赖**: `react-native-reanimated` 作为可选依赖，不强制安装
- 🎨 **丰富预设**: 提供多种预设动画效果
- 🔧 **TypeScript 支持**: 完整的类型定义

## 安装

```bash
npm install @gaozh1024/rn-toolkit

# 可选：安装 react-native-reanimated 以获得更好的性能
npm install react-native-reanimated
```

## 快速开始

### 1. 初始化动画服务

```typescript
import { AnimationService } from '@gaozh1024/rn-toolkit';

// 在应用启动时初始化
await AnimationService.initializeReanimated();
```

### 2. 使用动画服务

```typescript
import React from 'react';
import { View, Animated } from 'react-native';
import { AnimationService } from '@gaozh1024/rn-toolkit';

const MyComponent = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 创建淡入动画
    const animation = AnimationService.fadeIn(300);
    animation.start();
  }, []);

  return (
    <Animated.View style={{ opacity: fadeAnim }}>
      {/* 你的内容 */}
    </Animated.View>
  );
};
```

### 3. 使用动画 Hooks

```typescript
import React from 'react';
import { View } from 'react-native';
import { useAnimation } from '@gaozh1024/rn-toolkit';

const MyComponent = () => {
  const { fadeIn, fadeOut, slideIn, scale, isReanimatedAvailable } = useAnimation();

  const handleFadeIn = () => {
    const animation = fadeIn(300);
    animation.start();
  };

  return (
    <View>
      {/* 你的内容 */}
    </View>
  );
};
```

### 4. 使用预设动画

```typescript
import React from 'react';
import { View } from 'react-native';
import { AnimationPresets } from '@gaozh1024/rn-toolkit';

const MyComponent = () => {
  useEffect(() => {
    // 初始化预设动画服务
    AnimationPresets.initialize();
    
    // 使用弹跳进入动画
    const bounceAnimation = AnimationPresets.bounceIn(500);
    bounceAnimation.animation.start();
  }, []);

  return <View>{/* 你的内容 */}</View>;
};
```

## API 参考

### AnimationService

静态方法类，提供各种动画创建方法。

#### 方法

##### `initializeReanimated(): Promise<void>`
初始化 react-native-reanimated，检测其可用性。

##### `fadeIn(duration?: number, delay?: number)`
创建淡入动画。

**参数:**
- `duration` (可选): 动画持续时间，默认 300ms
- `delay` (可选): 延迟时间，默认 0ms

**返回:** 动画对象

##### `fadeOut(duration?: number)`
创建淡出动画。

**参数:**
- `duration` (可选): 动画持续时间，默认 300ms

##### `slideIn(from, distance?, duration?)`
创建滑入动画。

**参数:**
- `from`: 滑入方向 ('left' | 'right' | 'top' | 'bottom')
- `distance` (可选): 滑动距离，默认 100
- `duration` (可选): 动画持续时间，默认 300ms

##### `spring(toValue, config?)`
创建弹簧动画。

**参数:**
- `toValue`: 目标值
- `config` (可选): 弹簧配置
  - `damping`: 阻尼，默认 15
  - `stiffness`: 刚度，默认 150
  - `mass`: 质量，默认 1

##### `scale(toValue, duration?)`
创建缩放动画。

**参数:**
- `toValue`: 目标缩放值
- `duration` (可选): 动画持续时间，默认 300ms

##### `rotate(duration?, repeat?)`
创建旋转动画。

**参数:**
- `duration` (可选): 动画持续时间，默认 1000ms
- `repeat` (可选): 是否重复，默认 true

##### `sequence(...animations)`
创建序列动画。

**参数:**
- `animations`: 动画数组

##### `repeat(animation, numberOfReps?, reverse?)`
创建重复动画。

**参数:**
- `animation`: 要重复的动画
- `numberOfReps` (可选): 重复次数，-1 为无限重复，默认 -1
- `reverse` (可选): 是否反向，默认 false

### useAnimation Hook

提供动画方法的 React Hook。

```typescript
const {
  fadeIn,
  fadeOut,
  slideIn,
  scale,
  isReanimatedAvailable
} = useAnimation();
```

**返回值:**
- `fadeIn(duration?)`: 淡入动画方法
- `fadeOut(duration?)`: 淡出动画方法
- `slideIn(from, distance?, duration?)`: 滑入动画方法
- `scale(toValue, duration?)`: 缩放动画方法
- `isReanimatedAvailable`: react-native-reanimated 是否可用

### 其他 Hooks

#### `useFadeAnimation(initialValue?)`
专门的淡入淡出动画 Hook。

```typescript
const { fadeAnim, fadeIn, fadeOut } = useFadeAnimation(0);
```

#### `useScaleAnimation(initialValue?)`
专门的缩放动画 Hook。

```typescript
const { scaleAnim, scaleIn, scaleOut } = useScaleAnimation(0);
```

#### `useSlideAnimation(initialValue?)`
专门的滑动动画 Hook。

```typescript
const { slideAnim, slideIn, slideOut } = useSlideAnimation(-100);
```

#### `useSequenceAnimation()`
序列动画 Hook。

```typescript
const { runSequence } = useSequenceAnimation();
```

#### `useSharedValue(initialValue)` (仅在 reanimated 可用时)
创建共享值。

```typescript
const sharedValue = useSharedValue(0);
```

#### `useAnimatedStyle(styleFunction, dependencies?)` (仅在 reanimated 可用时)
创建动画样式。

```typescript
const animatedStyle = useAnimatedStyle(() => ({
  opacity: sharedValue.value
}));
```

### AnimationPresets

预设动画服务类。

#### 方法

##### `initialize(): Promise<void>`
初始化预设动画服务。

##### `fadeIn(duration?): AnimationPreset`
淡入预设动画。

##### `fadeOut(duration?): AnimationPreset`
淡出预设动画。

##### `bounceIn(duration?): AnimationPreset`
弹跳进入预设动画。

##### `slideIn(direction?, duration?): AnimationPreset`
滑动进入预设动画。

##### `scaleIn(duration?): AnimationPreset`
缩放进入预设动画。

##### `rotateIn(duration?): AnimationPreset`
旋转进入预设动画。

##### `flipIn(duration?): AnimationPreset`
翻转进入预设动画。

##### `slideInWithFade(direction?, duration?): AnimationPreset`
滑动+淡入组合动画。

## 使用示例

### 基础淡入淡出

```typescript
import React, { useRef, useEffect } from 'react';
import { View, Animated } from 'react-native';
import { AnimationService } from '@gaozh1024/rn-toolkit';

const FadeInExample = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = AnimationService.fadeIn(500);
    animation.start();
  }, []);

  return (
    <Animated.View style={{ opacity: fadeAnim }}>
      <View style={{ width: 100, height: 100, backgroundColor: 'blue' }} />
    </Animated.View>
  );
};
```

### 滑动动画

```typescript
import React, { useRef, useEffect } from 'react';
import { View, Animated } from 'react-native';
import { AnimationService } from '@gaozh1024/rn-toolkit';

const SlideInExample = () => {
  const slideAnim = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    const animation = AnimationService.slideIn('left', 100, 300);
    animation.start();
  }, []);

  return (
    <Animated.View style={{ transform: [{ translateX: slideAnim }] }}>
      <View style={{ width: 100, height: 100, backgroundColor: 'red' }} />
    </Animated.View>
  );
};
```

### 弹簧动画

```typescript
import React, { useRef, useEffect } from 'react';
import { View, Animated } from 'react-native';
import { AnimationService } from '@gaozh1024/rn-toolkit';

const SpringExample = () => {
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = AnimationService.spring(1, {
      damping: 10,
      stiffness: 100,
      mass: 1
    });
    animation.start();
  }, []);

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <View style={{ width: 100, height: 100, backgroundColor: 'green' }} />
    </Animated.View>
  );
};
```

### 序列动画

```typescript
import React, { useRef, useEffect } from 'react';
import { View, Animated } from 'react-native';
import { AnimationService } from '@gaozh1024/rn-toolkit';

const SequenceExample = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fadeIn = AnimationService.fadeIn(300);
    const scaleIn = AnimationService.scale(1, 300);
    
    const sequence = AnimationService.sequence(fadeIn, scaleIn);
    sequence.start();
  }, []);

  return (
    <Animated.View style={{ 
      opacity: fadeAnim,
      transform: [{ scale: scaleAnim }]
    }}>
      <View style={{ width: 100, height: 100, backgroundColor: 'purple' }} />
    </Animated.View>
  );
};
```

### 使用预设动画

```typescript
import React, { useEffect } from 'react';
import { View } from 'react-native';
import { AnimationPresets } from '@gaozh1024/rn-toolkit';

const PresetExample = () => {
  useEffect(() => {
    AnimationPresets.initialize();
    
    // 弹跳进入
    const bounceAnimation = AnimationPresets.bounceIn(600);
    bounceAnimation.animation.start();
    
    // 滑动+淡入组合
    setTimeout(() => {
      const slideWithFade = AnimationPresets.slideInWithFade('right', 400);
      slideWithFade.animation.start();
    }, 1000);
  }, []);

  return (
    <View>
      {/* 你的内容 */}
    </View>
  );
};
```

## 类型定义

```typescript
interface AnimationConfig {
  duration?: number;
  delay?: number;
  easing?: EasingFunction;
}

interface SpringConfig {
  damping?: number;
  stiffness?: number;
  mass?: number;
}

interface AnimationPreset {
  animation: any;
  type: 'reanimated' | 'animated';
}

type AnimationDirection = 'left' | 'right' | 'top' | 'bottom' | 'up' | 'down';

type EasingFunction = (value: number) => number;
```

## 最佳实践

### 1. 初始化
在应用启动时初始化动画服务：

```typescript
// App.tsx
import { AnimationService, AnimationPresets } from '@gaozh1024/rn-toolkit';

const App = () => {
  useEffect(() => {
    const initAnimation = async () => {
      await AnimationService.initializeReanimated();
      await AnimationPresets.initialize();
    };
    initAnimation();
  }, []);

  return <YourApp />;
};
```

### 2. 性能优化
- 优先使用 `useNativeDriver: true`
- 避免在动画过程中修改非动画属性
- 使用 `react-native-reanimated` 获得更好的性能

### 3. 内存管理
- 在组件卸载时停止动画
- 使用 `useRef` 存储动画值

```typescript
useEffect(() => {
  const animation = AnimationService.fadeIn(300);
  animation.start();

  return () => {
    animation.stop(); // 清理动画
  };
}, []);
```

## 故障排除

### 常见问题

1. **TypeScript 错误: 找不到模块 'react-native-reanimated'**
   - 这是正常的，模块会自动处理可选依赖
   - 如果需要完整功能，请安装 `react-native-reanimated`

2. **动画不工作**
   - 确保调用了 `initializeReanimated()`
   - 检查是否正确设置了动画值

3. **性能问题**
   - 安装 `react-native-reanimated` 以获得更好的性能
   - 使用 `useNativeDriver: true`

## 迁移指南

### 从 react-native-reanimated 迁移

```typescript
// 之前
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

// 现在
import { useSharedValue, useAnimatedStyle, AnimationService } from '@gaozh1024/rn-toolkit';
```

### 从 React Native Animated 迁移

```typescript
// 之前
import { Animated } from 'react-native';

// 现在
import { AnimationService, useFadeAnimation } from '@gaozh1024/rn-toolkit';
```

## 许可证

MIT License