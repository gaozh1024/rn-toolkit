# Avatar（头像）

- 功能点：`src`、`name`（首字母/颜色生成）、`size`、`shape`（circle/rounded/square）、`status`（online/offline）。
- 颜色来源主题：文本头像背景从 `primary/secondary/success/warning/error/info` 中哈希选择；状态点使用 `success` 与 `textDisabled`；文本颜色在 `colors.text` 与 `colors.background` 间根据背景亮度自动切换。

## 基本用法

```tsx
<Avatar src="https://example.com/u1.png" name="Alice" />
<Avatar name="王小明" />
<Avatar name="Ada Lovelace" shape="rounded" size="large" />
<Avatar name="Bob" status="online" />
```

## 属性
- `src?: string` 图片地址；失败时自动回退到首字母。
- `name?: string` 用于首字母与背景色生成。
- `size?: 'small'|'medium'|'large'|number` 支持像素值。
- `shape?: 'circle'|'rounded'|'square'`。
- `status?: 'online'|'offline'` 显示右下角状态点。
- `textStyle?: TextStyle` 首字母文本样式；`style?: ViewStyle` 外层样式。

## 主题
- 使用 `useTheme()` 获取 `colors` 与 `borderRadius`。
- 避免硬编码，允许通过主题自定义颜色键扩展。