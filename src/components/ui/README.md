# UI 组件建设清单与规范

本文件用于在 `ui` 目录中跟踪基础组件的建设进度、统一规范与主题接入要求，便于你按清单逐步完成。

## 现状

已完成的基础组件：
- [x] Button（按钮） — 主题接入、尺寸与变体、颜色、禁用态、加载态等
- [x] Icon（图标） — 主题颜色支持、禁用态颜色
- [x] Text（文本） — 主题化文本样式、变体、尺寸、权重、对齐

待建设的组件按优先级列出如下。

## 组件优先级清单

优先级 1：表单与输入（覆盖 80% 业务场景）
- [ ] Input（单行文本输入）
  - 功能点：value/defaultValue、placeholder、secureTextEntry、disabled、error、helperText、leftIcon/rightIcon、size、variant、color、fullWidth/flex、自适应高度（可选）
- [ ] TextArea（多行输入）
  - 功能点：继承 Input 能力 + rows/autoSize
- [ ] PasswordInput（密码输入）
  - 功能点：继承 Input 能力 + 显隐切换
- [ ] Select/Picker（选择器）
  - 功能点：options、value、onChange、placeholder、disabled、searchable、clearable（后续增强）
- [ ] Checkbox（复选框）
  - 功能点：checked/defaultChecked、onChange、label、disabled、size、color
- [ ] Radio + RadioGroup（单选）
  - 功能点：value、onChange、options（label/value/disabled）、layout direction
- [ ] Switch（开关）
  - 功能点：value、onValueChange、disabled、size、color

优先级 2：展示与状态标识
- [ ] Badge（徽标）
  - 功能点：text/value、variant（solid/outline）、color、dot、max、角标位置（配合 children）
- [ ] Chip/Tag（标签）
  - 功能点：label、icon、closable、selected、variant、color、size
- [ ] Avatar + AvatarGroup（头像）
  - 功能点：src、name（首字母/颜色生成）、size、shape（circle/rounded/square）、status（online/offline）
- [ ] Divider（分割线）
  - 功能点：orientation、color、thickness、inset
- [ ] Surface/Card（表面/卡片）
  - 功能点：variant（flat/outlined/tonal）、elevation/阴影、padding、header/footer 插槽

优先级 3：反馈与加载（UI 层）
- [ ] Spinner/ActivityIndicator（加载指示器）
  - 功能点：size、color、animating
- [ ] Progress（进度条）
  - 功能点：value(0-1)、color、trackColor、indeterminate；线性/环形
- [ ] Skeleton（骨架屏）
  - 功能点：variant（rect/circle/line）、width/height、animated

优先级 4：复合/可选
- [ ] ListItem（列表项）
  - 功能点：title、description、left/right（头像/图标/开关）、onPress、disabled、selected
- [ ] IconButton（图标按钮）
  - 功能点：name/type/size/color、variant（filled/ghost/outline）、disabled
- [ ] Link（链接）
  - 功能点：onPress/href、underline、color、disabled
- [ ] Stepper（步进器）
  - 功能点：value、min/max、step、onChange、disabled
- [ ] Slider（滑块）
  - 功能点：value、min/max、step、onValueChange、disabled

---

## 统一规范（所有组件需遵循）

1) 颜色与主题
- color 支持主题色名与自定义色值：
  - 主题色名：primary、secondary、success、warning、error、info、text、subtext、disabled、border、background、surface 等
  - 自定义：'#RRGGBB'、'rgb()'、'rgba()'
- 禁用态/占位提示等需使用主题内的专用 token（如 textDisabled、borderSubtle 等）
- 按压/聚焦/选中/错误等状态优先使用主题内状态色，不得硬编码

2) 尺寸与圆角
- size 使用统一刻度：xs / sm / md / lg / xl
- 尺寸映射与圆角取值从 theme 的 size/borderRadius 派生

3) 变体统一建议
- 通用变体：solid / outline / ghost / text / tonal（按组件适配）
- 按组件落地时保持内部一致；Button 已存在 primary/secondary/outline/text，可在 Button 内部维持现有命名

4) 交互反馈
- 所有可交互组件统一使用通用 Pressable 封装（波纹/opacity/scale 可配），确保一致的按压反馈和无障碍特性

5) 无障碍与语义
- 提供 accessible、accessibilityLabel、accessibilityRole 等基础支持

6) 文档与 Demo
- 每个组件必须包含 README，覆盖 props、主题说明、示例（含暗色模式）、最佳实践

---

## 主题 Tokens 建议增补

为支撑上述组件，建议在主题中增补或确认以下 tokens（命名示例，按你现有 Theme 结构落地）：

- input:
  - background、border、placeholder、text、focusBorder、errorBorder、disabledBackground、disabledBorder
- checkbox/radio/switch:
  - fillOn、fillOff、border、disabled、labelColor
- badge/chip:
  - background、border、text、selectedBackground、selectedText
- surface/card:
  - background、border、shadow、overlay（暗色模式提高可读性）
- progress/skeleton:
  - fill、track、shimmer

---

## 目录与导出约定

- 每个组件目录结构：
  - Component/
    - Component.tsx
    - README.md
    - index.ts（export { default as Component } from './Component'）
- 统一在 `src/components/ui/index.ts` 中集中导出，保持与 Button/Icon/Text 一致

---

## 组件开发任务模板（Checklist）

以任一新组件 Foo 为例：

- [ ] 组件文件：`src/components/ui/Foo/Foo.tsx`
- [ ] 出口文件：`src/components/ui/Foo/index.ts`
- [ ] 文档：`src/components/ui/Foo/README.md`
- [ ] 主题接入：使用 `useTheme` / `useThemeColors`，颜色与状态全部来源主题
- [ ] 交互反馈：使用统一的 Pressable 封装（若可交互）
- [ ] 属性与变体：size/variant/color/disabled/loading/fullWidth/flex（按需）
- [ ] 测试：基础渲染、变体/尺寸切换、主题切换、禁用态
- [ ] 导出更新：`src/components/ui/index.ts`
- [ ] 示例完善：覆盖亮/暗主题

---

## 建议实施顺序（Roadmap）

1. 表单与输入：Input（含 PasswordInput、TextArea） → Checkbox/Radio/Switch → Select/Picker
2. 展示类：Badge/Chip/Avatar/Divider → Surface/Card
3. 反馈类：Spinner/Progress/Skeleton
4. 复合类：ListItem、IconButton、Link、Stepper、Slider

---

## 开发参考（示例骨架）

以下为一个最小可用的组件骨架示例，用以说明主题接入与 API 形态（以 Input 为例）：

```typescript
import React, { forwardRef } from 'react';
import { TextInput, View, ViewStyle, TextStyle } from 'react-native';
import { useTheme, useThemeColors } from '../../../theme';

export interface InputProps {
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  secureTextEntry?: boolean;
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'solid' | 'outline' | 'ghost';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'text' | 'subtext' | string;
  fullWidth?: boolean;
  flex?: number;
  style?: ViewStyle;
  inputStyle?: TextStyle;
  onChangeText?: (text: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
}

const Input = forwardRef<TextInput, InputProps>((props, ref) => {
  const {
    value,
    defaultValue,
    placeholder,
    secureTextEntry,
    disabled,
    error,
    size = 'md',
    variant = 'outline',
    color = 'primary',
    fullWidth,
    flex,
    style,
    inputStyle,
    onChangeText,
    onFocus,
    onBlur,
  } = props;

  const { theme } = useTheme();
  const colors = useThemeColors();

  // 示例：根据 variant/size/状态 计算样式（具体细化到主题 tokens）
  const widthStyle: ViewStyle = flex != null ? { flex } : fullWidth ? { width: '100%' } : {};
  const baseBorderColor = error ? colors.error : colors.border;
  const containerStyle: ViewStyle = {
    backgroundColor: variant === 'solid' ? colors.surface : colors.background,
    borderWidth: variant === 'outline' ? 1 : 0,
    borderColor: baseBorderColor,
    borderRadius: theme.borderRadius.md,
    opacity: disabled ? 0.6 : 1,
    paddingHorizontal: theme.size.sm,
    paddingVertical: theme.size.xs,
    ...widthStyle,
  };

  const textColor = disabled ? colors.textDisabled : colors.text;
  const placeholderTextColor = colors.subtext;

  return (
    <View style={[containerStyle, style]}>
      <TextInput
        ref={ref}
        value={value}
        defaultValue={defaultValue}
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor}
        secureTextEntry={secureTextEntry}
        editable={!disabled}
        onChangeText={onChangeText}
        onFocus={onFocus}
        onBlur={onBlur}
        style={[{ color: textColor }, inputStyle]}
      />
    </View>
  );
});

export default Input;
```

---

## 验收标准（Definition of Done）

- 不出现硬编码颜色，全部来源于主题 tokens
- 变体、尺寸、禁用态、错误态等状态完整
- 支持亮/暗主题切换
- 文档完整（API/示例/主题说明）
- 导出已接入到 `src/components/ui/index.ts`
- Demo 运行正常，无明显 UI 抖动或布局问题

---

如果你希望，我可以先按照此清单从 Input 开始落地，并同步补齐相应主题 tokens 与 README 示例。你也可以按上述清单逐项勾选推进。祝开发顺利！