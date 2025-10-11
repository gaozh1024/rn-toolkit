# rn-toolkit

一个面向 React Native 的工程化工具包，提供一致的 API、类型与最佳实践，覆盖 UI 组件、动画、导航、状态栏、主题、存储与常用工具，助你更快搭建高质量应用。

## 特性

- 统一 API：跨模块保持一致的调用风格与类型定义
- 高性能动画：内置 `react-native-reanimated` 支持与预设动画
- 主题系统：亮/暗模式、可持久化与丰富样式预设
- 导航增强：规范化的路由注册、服务化导航调用
- 生产可用：脚本自动化安装与原生平台配置（iOS/Android）
- TypeScript：完备类型，便于开发与维护

## 安装与自动化配置

- 安装：

```bash
npm install @gaozh1024/rn-toolkit react-native-reanimated react-native-gesture-handler
```

### 必须安装的框架

- `react-native-reanimated`
- `react-native-gesture-handler`
- `react-native-screens`
- `react-native-safe-area-context`
- `react-native-vector-icons`
- `react-native-drawer-layout`
- `react-native-mmkv`
- `@react-native-clipboard/clipboard`
- `react-native-svg`
- `react-native-device-info`
- `react-native-localize`
- `react-native-worklets`
- `@react-navigation/native`
- `@react-navigation/stack`
- `@react-navigation/bottom-tabs`

> 提示：安装期间，postinstall 会自动检查缺失的依赖并安装；已存在的依赖会跳过。

### 运行 postinstall（自动安装与配置）

- 已发布包（npm）：

```bash
npx -p @gaozh1024/rn-toolkit rn-toolkit postinstall
```

- yalc/本地联动（不依赖 Registry）：

```bash
INIT_CWD="$(pwd)" node node_modules/@gaozh1024/rn-toolkit/scripts/cli.js postinstall
```

- 直接脚本触发：

```bash
INIT_CWD="$(pwd)" node node_modules/@gaozh1024/rn-toolkit/scripts/postinstall.js
```

- iOS 依赖安装：

```bash
cd ios && pod install
```

- Babel 插件（必须，置于 `plugins` 最后一行）：

```javascript
module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    'react-native-reanimated/plugin',
  ],
};
```

- 自动化：安装期间，postinstall 会尝试：
  - 按精确版本安装必需依赖（含 Reanimated、Gesture Handler 等）
  - 自动为 `babel.config.js` 追加 `'react-native-reanimated/plugin'` 至 `plugins` 数组末尾
  - 配置 `react-native-vector-icons` 的 iOS Pod 与 Android Gradle

> 可通过宿主的 `package.json -> rnToolkit` 配置控制自动化行为（如 `autoInstall`、`manager`、`silent`、`skipConfigure`）。

## 快速上手

- 初始化主题与预设（示例）：

```tsx
import React, { useEffect } from 'react';
import { AnimationPresets } from '@gaozh1024/rn-toolkit';

export default function App() {
  useEffect(() => {
    AnimationPresets.initialize();
  }, []);
  return null;
}
```

- 使用 UI 组件（示例）：

```tsx
import { Button, Text } from '@gaozh1024/rn-toolkit';

function Example() {
  return (
    <>
      <Text variant="h1">Hello</Text>
      <Button variant="primary" title="启动" onPress={() => {}} />
    </>
  );
}
```

- 使用动画（Reanimated 示例）：

```tsx
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

function FadeIn() {
  const opacity = useSharedValue(0);
  const style = useAnimatedStyle(() => ({ opacity: opacity.value }));
  React.useEffect(() => { opacity.value = withTiming(1, { duration: 300 }); }, []);
  return <Animated.View style={style} />;
}
```

## 模块索引与文档

- 动画（Animation）：见 [src/animation/README.md](src/animation/README.md)
- 导航（Navigation）：见 [src/navigation/README.md](src/navigation/README.md)
- 状态栏（StatusBar）：见 [src/statusbar/README.md](src/statusbar/README.md)
- 存储（Storage）：见 [src/storage/README.md](src/storage/README.md)
- 主题（Theme）：见 [src/theme/README.md](src/theme/README.md)
- UI 组件（UI）：见 [src/components/ui/README.md](src/components/ui/README.md)
- 布局组件（Layout）：见 [src/components/layout/README.md](src/components/layout/README.md)
- 反馈组件（Feedback）：见 [src/components/feedback/README.md](src/components/feedback/README.md)

## 目录结构

```text
src/
  animation/        # 动画服务、预设与 Hooks
  components/
    ui/             # 基础 UI 组件（Button/Icon/Input 等）
    layout/         # 布局相关组件（栅格、容器等）
    feedback/       # 反馈类组件（Modal/Toast 等）
  navigation/       # 导航构建器、服务与类型
  statusbar/        # 状态栏服务与 Hooks
  storage/          # 存储服务（MMKV）与类型
  theme/            # 主题服务、预设与 Hooks
  utils/            # 常用工具（剪贴板、本地化、设备信息等）
```

## 约定与最佳实践

- 统一导出：组件在各自目录 `index.ts` 导出，并在聚合出口集中导出
- 主题接入：禁止硬编码颜色，统一来自主题 tokens
- 动画：默认使用 Reanimated；兼容层仅用于特殊/开发场景降级
- 可访问性：遵循 RN 的可访问性属性与交互语义
- 文档：每个模块/组件均包含 `README.md`，含 API 与示例

## 故障排除

- 动画不工作：
  - 确认已安装 `react-native-reanimated` 与启用 Babel 插件（且位于最后）
  - 重启 Metro 并清缓存：

```bash
npm start -- --reset-cache
```

- iOS 编译失败：

```bash
cd ios && pod install
```

- 图标不显示：确认已自动/手动配置 `react-native-vector-icons` 的 Pod 与 Gradle

## 常见问题（FAQ）

- 是否必须使用 Reanimated？是，动画模块以 Reanimated 为默认与必须依赖
- 是否支持暗色模式？是，主题系统内置支持并可持久化
- 是否可禁用自动安装？可在宿主 `package.json -> rnToolkit` 中配置 `autoInstall: false`

## 参与贡献

- 欢迎提交 Issue/PR；遵循模块文档的“验收标准”与“目录与导出约定”

## 许可证

MIT License

### 使用 npm 安装（固定版本）

```bash
npm install --save --save-exact \
  react-native-reanimated@4.1.3 \
  react-native-gesture-handler@2.28.0 \
  react-native-screens@4.16.0 \
  react-native-safe-area-context@5.6.1 \
  react-native-vector-icons@10.3.0 \
  react-native-drawer-layout@4.1.13 \
  react-native-mmkv@3.3.3 \
  @react-native-clipboard/clipboard@1.16.3 \
  react-native-svg@15.14.0 \
  react-native-device-info@14.1.1 \
  react-native-localize@3.5.2 \
  react-native-worklets@0.6.1 \
  @react-navigation/native@7.1.17 \
  @react-navigation/stack@7.4.8 \
  @react-navigation/bottom-tabs@7.4.7
```
