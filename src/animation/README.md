# Animation Module

React Native 动画模块，统一封装 `react-native-reanimated`（现在为必须依赖）与少量 Animated 兼容层。

## 特性

- 🔄 兼容层：极少数环境下可临时降级到 React Native `Animated`
- 🎯 **统一 API**: 无论使用哪种动画库，API 保持一致
- 🚀 **高性能**: 优先使用 `react-native-reanimated` 获得更好的性能
- 📦 **可选依赖**: `react-native-reanimated` 作为可选依赖，不强制安装
- 🎨 **丰富预设**: 提供多种预设动画效果
- 🔧 **TypeScript 支持**: 完整的类型定义

## 安装

```bash
npm install @gaozh1024/rn-toolkit react-native-reanimated react-native-gesture-handler
```

```bash
cd ios && pod install
```

## 快速开始

### 1. 以 Reanimated 为默认路径

```typescript
import React, { useEffect } from 'react';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

const MyComponent = () => {
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 300 });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View style={animatedStyle}>
      {/* 你的内容 */}
    </Animated.View>
  );
};
```

### 2. 使用 AnimationService 与预设

```typescript
import { AnimationService, AnimationPresets } from '@gaozh1024/rn-toolkit';
import Animated, { withTiming, useSharedValue, useAnimatedStyle } from 'react-native-reanimated';

const Example = () => {
  const x = useSharedValue(-100);
  useEffect(() => {
    x.value = withTiming(0, { duration: 300 });
    AnimationPresets.initialize();
  }, []);
  const style = useAnimatedStyle(() => ({ transform: [{ translateX: x.value }] }));
  return <Animated.View style={style} />;
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
    if (animation && typeof (animation as any).start === 'function') {
      (animation as any).start();
    }
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
    if (bounceAnimation.type === 'animated') {
      bounceAnimation.animation.start();
    }
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

**返回:** AnimationPreset（统一返回类型）。
- 当 `type === 'reanimated'` 时，`animation` 为 Reanimated 的动画节点（通常用于 shared value/animated style，不调用 start/stop）
- 当 `type === 'animated'` 时，`animation` 为 `Animated.CompositeAnimation`，可调用 `start()/stop()`

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

语义说明：
- Reanimated 路径下返回的是数值动画（0→360），需要在样式层映射为 `'deg'` 字符串，比如配合 `interpolateDeg` 或模板字符串：`transform: [{ rotate: `${value}deg` }]`。
- Animated 路径下建议配合 `Animated.Value.interpolate` 将 0→1 的归一化进度转换成 `'deg'` 字符串。

**参数:**
- `duration` (可选): 动画持续时间，默认 1000ms
- `repeat` (可选): 是否重复，默认 true

##### `sequence(...animations)`
创建序列动画。

**参数:**
- `animations`: 动画数组（支持传入 AnimationPreset 或原始动画对象）

**返回:** AnimationPreset（统一返回类型）

##### `parallel(stopTogether?, ...animations)`
并行动画（同时开始）。

**参数:**
- `stopTogether` (可选): Animated 路径下是否一起停止，默认 true
- `animations`: 动画数组（支持传入 AnimationPreset 或原始动画对象）

**返回:** AnimationPreset（Animated 路径为 Animated.parallel 返回值；Reanimated 路径为动画数组，由调用方赋值到各自 sharedValue）

##### `stagger(delayMs, ...animations)`
交错并行动画（依次延迟启动）。

**参数:**
- `delayMs`: 相邻动画的延迟毫秒数
- `animations`: 动画数组（支持传入 AnimationPreset 或原始动画对象）

**返回:** AnimationPreset（Animated 路径为 Animated.stagger 返回值；Reanimated 路径为通过 withDelay 包装的动画数组）

##### `repeat(animation, numberOfReps?, reverse?)`
创建重复动画。

**参数:**
- `animation`: 要重复的动画
- `numberOfReps` (可选): 重复次数，-1 为无限重复，默认 -1
- `reverse` (可选): 是否反向，默认 false

##### `loop(value?, duration?, iterations?, reverse?)`
创建循环动画（0→1 归一化循环），适合旋转加载、进度条等。

**参数:**

##### 插值器（Interpolators）
提供丰富的插值工具，兼容 Animated 与 Reanimated 两条路径。

- `interpolate(inputRange: number[], outputRange: number[], options?)`: 数值插值（如透明度、位移等）
- `interpolateDeg(inputRange: number[], outputRangeDeg: number[], options?)`: 角度插值（'deg' 字符串输出，用于旋转）
- `interpolateColor(inputRange: number[], outputColors: string[], colorSpace?)`: 颜色插值（Reanimated 原生支持；Animated 可用返回配置在样式层实现）

使用说明：
- 当返回 `type === 'reanimated'` 时，获取 `config` 后在 `useAnimatedStyle` 中使用 `interpolate` 或 `interpolateColor` 应用到 sharedValue。
- 当返回 `type === 'animated'` 时，`value` 为插值配置对象，可配合 `Animated.Value.interpolate` 或在样式层基于归一化进度手动映射。
- `value` (可选): Animated.Value（Animated 路径下必须提供或将自动创建新值）
- `duration` (可选): 单次 0→1 的时长，默认 1000ms
- `iterations` (可选): 循环次数，-1 表示无限循环，默认 -1
- `reverse` (可选): 是否往返（0→1→0 为一轮），默认 false

**返回:** AnimationPreset（Animated 路径返回 Animated.loop(timing/sequence)；Reanimated 路径返回 withRepeat(withTiming(...))）

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
    const preset = AnimationService.fadeIn(fadeAnim, 500);
    if (preset.type === 'animated') {
      preset.animation.start();
    }
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
    const preset = AnimationService.slideIn(slideAnim, 'left', 100, 300);
    if (preset.type === 'animated') {
      preset.animation.start();
    }
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
    const preset = AnimationService.spring(scaleAnim, 1, {
      damping: 10,
      stiffness: 100,
      mass: 1
    });
    if (preset.type === 'animated') {
      preset.animation.start();
    }
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
    const fadeIn = AnimationService.fadeIn(fadeAnim, 300);
    const scaleIn = AnimationService.scale(scaleAnim, 1, 300);
    
    const seqPreset = AnimationService.sequence(fadeIn, scaleIn);
    if (seqPreset.type === 'animated') {
      seqPreset.animation.start();
    }
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

### 并行动画

```typescript
import React, { useRef, useEffect } from 'react';
import { View, Animated } from 'react-native';
import { AnimationService } from '@gaozh1024/rn-toolkit';

const ParallelExample = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateX = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    const fadeIn = AnimationService.fadeIn(fadeAnim, 400);
    const slideIn = AnimationService.slideIn(translateX, 'left', 100, 400);
    const preset = AnimationService.parallel(true, fadeIn, slideIn);
    if (preset.type === 'animated') {
      preset.animation.start();
    }
  }, []);

  return (
    <Animated.View style={{ opacity: fadeAnim, transform: [{ translateX }] }}>
      <View style={{ width: 100, height: 100, backgroundColor: 'orange' }} />
    </Animated.View>
  );
};
```

### 交错并行动画（stagger）

```typescript
import React, { useRef, useEffect } from 'react';
import { View, Animated } from 'react-native';
import { AnimationService } from '@gaozh1024/rn-toolkit';

const StaggerExample = () => {
  const x1 = useRef(new Animated.Value(-100)).current;
  const x2 = useRef(new Animated.Value(-100)).current;
  const x3 = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    const a1 = AnimationService.slideIn(x1, 'left', 100, 300);
    const a2 = AnimationService.slideIn(x2, 'left', 100, 300);
    const a3 = AnimationService.slideIn(x3, 'left', 100, 300);
    const preset = AnimationService.stagger(150, a1, a2, a3);
    if (preset.type === 'animated') {
      preset.animation.start();
    }
  }, []);

  return (
    <View style={{ flexDirection: 'row' }}>
      <Animated.View style={{ transform: [{ translateX: x1 }] }}>
        <View style={{ width: 50, height: 50, backgroundColor: 'red' }} />
      </Animated.View>
      <Animated.View style={{ transform: [{ translateX: x2 }] }}>
        <View style={{ width: 50, height: 50, backgroundColor: 'green' }} />
      </Animated.View>
      <Animated.View style={{ transform: [{ translateX: x3 }] }}>
        <View style={{ width: 50, height: 50, backgroundColor: 'blue' }} />
      </Animated.View>
    </View>
  );
};
```

### 循环动画（Spinner / Loading）

```typescript
import React, { useRef, useEffect } from 'react';
import { View, Animated } from 'react-native';
import { AnimationService } from '@gaozh1024/rn-toolkit';

const SpinnerExample = () => {
  const rotateValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 方式一：使用通用 loop（0→1 归一化循环）
    const preset = AnimationService.loop(rotateValue, 800, -1, false);
    if (preset.type === 'animated') {
      preset.animation.start();
    }

    // 方式二：使用 rotate（直接创建旋转动画）
    // const rotatePreset = AnimationService.rotate(rotateValue, 800, true);
    // if (rotatePreset.type === 'animated') rotatePreset.animation.start();

    // Reanimated 提示：如在 Reanimated 路径，需将数值映射到 'deg' 字符串，可使用 interpolateDeg：
    // const progress = useSharedValue(0);
    // progress.value = withRepeat(withTiming(1, { duration: 800 }), -1, false);
    // const cfg = AnimationService.interpolateDeg([0, 1], [0, 360]);
    // const style = useAnimatedStyle(() => {
    //   const { interpolate } = require('react-native-reanimated');
    //   const rotate = interpolate(progress.value, cfg.config.inputRange, cfg.config.outputRange);
    //   return { transform: [{ rotate }] };
    // });
  }, []);

  const spin = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  return (
    <Animated.View style={{ transform: [{ rotate: spin }] }}>
      <View style={{ width: 40, height: 40, borderRadius: 20, borderWidth: 4, borderColor: '#ccc', borderTopColor: '#333' }} />
    </Animated.View>
  );
};
```

### 插值器使用示例

- 角度插值（Reanimated）
```typescript
import { useSharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { AnimationService } from '@gaozh1024/rn-toolkit';

const progress = useSharedValue(0);
const interp = AnimationService.interpolateDeg([0, 1], [0, 360]);
const style = useAnimatedStyle(() => {
  const { interpolate } = require('react-native-reanimated');
  const rotate = interpolate(progress.value, interp.config.inputRange, interp.config.outputRange);
  return { transform: [{ rotate }] };
});
```

- 颜色插值（Reanimated）
```typescript
import { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

const progress = useSharedValue(0);
const style = useAnimatedStyle(() => {
  const { interpolateColor } = require('react-native-reanimated');
  const color = interpolateColor(progress.value, [0, 1], ['#ff0000', '#0000ff']);
  return { backgroundColor: color };
});
```

- 角度插值（Animated 降级）
```typescript
import { Animated } from 'react-native';
const progress = new Animated.Value(0);
const rotate = progress.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
```

- 颜色插值（Animated 路径，内置 JS Helper）
```typescript
import { Animated } from 'react-native';
import { useEffect } from 'react';
import { interpolateColorJS } from '@gaozh1024/rn-toolkit';

const progress = new Animated.Value(0);
useEffect(() => {
  Animated.timing(progress, { toValue: 1, duration: 1500, useNativeDriver: false }).start();
}, []);

// 在渲染时计算颜色（不依赖 Reanimated）
const color = interpolateColorJS((progress as any)._value ?? 0, [0, 1], ['#ff0000', '#0000ff']);
```

- 颜色插值 Hook（Animated 路径）
```typescript
import { Animated } from 'react-native';
import { useColorInterpolation } from '@gaozh1024/rn-toolkit';

const progress = new Animated.Value(0);
const color = useColorInterpolation(progress, [0, 1], ['#ff0000', '#0000ff']);
```### 使用预设动画

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
      if (slideWithFade.type === 'animated') {
        slideWithFade.animation.start();
      }
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
      // AnimationService 会自动初始化
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
  // 假设有一个 Animated.Value 引用，如 fadeAnim
  const preset = AnimationService.fadeIn(fadeAnim, 300);
  if (preset.type === 'animated') {
    preset.animation.start();
  }

  return () => {
    if (preset.type === 'animated' && preset.animation.stop) {
      preset.animation.stop(); // 清理动画
    }
  };
}, []);
```

## 故障排除

### 常见问题

1. **TypeScript 错误: 找不到模块 'react-native-reanimated'**
   - 这是正常的，模块会自动处理可选依赖
   - 如果需要完整功能，请安装 `react-native-reanimated`

2. **动画不工作**
   - 确认 `react-native-reanimated` 已正确安装（可选）
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
