# Clipboard（剪贴板）

统一封装 `@react-native-clipboard/clipboard`，支持文本/对象复制与读取、URL/图片检测、清空等能力，并提供 `useClipboard` Hook。

## 安装

已在项目首页列为必装依赖；如需单独安装：

```bash
yarn add @react-native-clipboard/clipboard
```

## 快速使用

Service 方式：

```ts
import { ClipboardService } from '@gaozh1024/rn-toolkit/src/utils';

await ClipboardService.copyToClipboard('Hello', { showToast: true });
const text = await ClipboardService.getFromClipboard();
const ok = await ClipboardService.copyObjectToClipboard({ a: 1 });
const obj = await ClipboardService.getObjectFromClipboard<{ a: number }>();
await ClipboardService.clearClipboard();
```

Hook 方式（组件内）：

```ts
import { useClipboard } from '@gaozh1024/rn-toolkit/src/utils';

const { clipboardText, copyToClipboard, getFromClipboard, clearClipboard, isLoading } = useClipboard();
await copyToClipboard('Hello');
const text = await getFromClipboard();
```

## API

- `ClipboardService.copyToClipboard(text, options?)`：复制文本
- `ClipboardService.getFromClipboard(options?)`：读取文本
- `ClipboardService.copyObjectToClipboard(obj, options?)`：复制对象为 JSON 字符串
- `ClipboardService.getObjectFromClipboard<T>(options?)`：读取 JSON 并解析为对象
- `ClipboardService.hasString()/hasURL()/hasImage()/hasNumber()`：检测剪贴板类型
- `ClipboardService.setImage(imageData)`：设置图片数据
- `ClipboardService.setStrings(strings)`：批量设置文本（换行拼接）
- `ClipboardService.clearClipboard()`：清空剪贴板
- `useClipboard()`：Hook，返回 `clipboardText/isLoading` 与上述能力的封装

## 选项（ClipboardOptions）

```ts
type ClipboardOptions = {
  showToast?: boolean;            // 控制台提示（示例用途）
  toastMessage?: string;          // 自定义提示文案
  onSuccess?: (text: string) => void;
  onError?: (error: Error) => void;
};
```
