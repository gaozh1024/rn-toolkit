# AvatarGroup（头像组）

- 功能点：`items`（数组：`src/name/status`）、`size`、`shape`、`max`、`overlap`。
- 超出 `max` 显示 `+N` 聚合。

## 基本用法

```tsx
<AvatarGroup
  items={[
    { src: 'https://example.com/a1.png', name: 'Alice', status: 'online' },
    { name: 'Bob' },
    { name: 'Carol' },
    { name: 'Dave' },
  ]}
/>

<AvatarGroup
  items={[{ name: 'Alice' }, { name: 'Bob' }, { name: 'Carol' }, { name: 'Dave' }]}
  size="small"
  shape="rounded"
  max={3}
/>
```

## 属性
- `items: { src?: string; name?: string; status?: 'online'|'offline' }[]`。
- `size?: 'small'|'medium'|'large'|number` 与单个头像一致。
- `shape?: 'circle'|'rounded'|'square'`。
- `max?: number` 可见数量上限；超出显示 `+N`。
- `overlap?: number` 头像间重叠像素；默认按尺寸计算。