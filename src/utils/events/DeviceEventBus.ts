import { DeviceEventEmitter, EmitterSubscription } from 'react-native';

export type DeviceEventMap = Record<string, any>;
export type Unsubscribe = () => void;

/**
 * DeviceEventBus：基于 React Native DeviceEventEmitter 的轻量事件总线
 * - 仅清理本总线注册的监听器，不影响其他模块
 * - 支持 once/on/emit/off/removeAll
 */
export class DeviceEventBus<E extends DeviceEventMap = DeviceEventMap> {
  private subscriptions = new Map<keyof E & string, Set<EmitterSubscription>>();

  on<K extends keyof E & string>(eventName: K, listener: (payload: E[K]) => void): Unsubscribe {
    const sub = DeviceEventEmitter.addListener(eventName, listener as any);
    let set = this.subscriptions.get(eventName);
    if (!set) {
      set = new Set<EmitterSubscription>();
      this.subscriptions.set(eventName, set);
    }
    set.add(sub);

    return () => {
      try {
        sub.remove();
      } finally {
        set!.delete(sub);
      }
    };
  }

  once<K extends keyof E & string>(eventName: K, listener: (payload: E[K]) => void): Unsubscribe {
    const unsubscribe = this.on(eventName, (payload: E[K]) => {
      // 先取消再执行，避免重复触发
      unsubscribe();
      listener(payload);
    });
    return unsubscribe;
  }

  emit<K extends keyof E & string>(eventName: K, payload: E[K]): void {
    DeviceEventEmitter.emit(eventName as string, payload as any);
  }

  /**
   * 只移除本总线注册的该事件监听器，不影响外部注册的监听器
   */
  off<K extends keyof E & string>(eventName: K): void {
    const set = this.subscriptions.get(eventName);
    if (set) {
      for (const s of set) {
        try {
          s.remove();
        } catch {}
      }
      set.clear();
    }
  }

  /**
   * 清理本总线注册的所有监听器
   */
  removeAll(): void {
    for (const [, set] of this.subscriptions) {
      for (const s of set) {
        try {
          s.remove();
        } catch {}
      }
      set.clear();
    }
    this.subscriptions.clear();
  }
}

export const deviceEventBus = new DeviceEventBus();
export default deviceEventBus;