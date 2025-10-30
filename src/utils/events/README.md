# DeviceEventBus（设备事件总线）

基于 React Native `DeviceEventEmitter` 的事件总线，统一管理 JS 层事件的监听与分发，支持类型安全与自动清理。

## 导入

```ts
import { deviceEventBus, useDeviceEvent, DeviceEventBus } from '@gaozh1024/rn-toolkit/src/utils';
```

## 快速使用

### emit 和 on

```ts
// 发送事件（例如：聊天新消息）
deviceEventBus.emit('chat:new-message', { id: '1', text: 'Hello', time: Date.now() });

// 监听事件（例如：更新列表）
const off = deviceEventBus.on<{ id: string; text: string; time: number }>(
  'chat:new-message',
  (msg) => console.log('收到消息', msg)
);

// 手动取消监听
off();
```

### 一次性监听

```ts
deviceEventBus.once('drawer:closed', () => {
  console.log('抽屉已经关闭，执行后续逻辑');
});
```

### 在组件中监听（自动清理）

```tsx
import { useDeviceEvent } from '@gaozh1024/rn-toolkit/src/utils';

function ChatList() {
  useDeviceEvent<{ id: string; text: string; time: number }>(
    'chat:new-message',
    (msg) => {
      // 更新状态
    },
    [] // 依赖项，变更会重绑监听
  );

  return null;
}
```

### 类型安全（可选）

```ts
// 定义你应用的事件映射（建议集中定义）
type AppEvents = {
  'app:foreground': void;
  'app:background': void;
  'chat:new-message': { id: string; text: string; time: number };
};

const AppEventBus = new DeviceEventBus<AppEvents>();

AppEventBus.on('chat:new-message', (msg) => {
  // msg.id/msg.text/msg.time 有类型提示
});

AppEventBus.emit('app:foreground', undefined);
```

## 事件命名建议

- 使用分层命名：`domain:action`（如 `chat:new-message`、`drawer:closed`）
- 尽量为 payload 定义结构化对象，便于扩展

## 注意事项

- 本总线只清理“通过它注册”的监听器，不会调用 `DeviceEventEmitter.removeAllListeners` 影响外部模块。
- 事件总线仅在 JS 线程内工作；如需与原生模块交互，仍需使用对应原生桥或 `NativeEventEmitter`。