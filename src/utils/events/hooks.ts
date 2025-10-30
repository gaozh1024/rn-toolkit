import { useEffect, useRef } from 'react';
import { deviceEventBus } from './DeviceEventBus';

/**
 * 在函数式组件中监听设备事件，组件卸载时自动清理
 * - deps 控制重绑时机，默认仅在 eventName 变更时重绑
 */
export function useDeviceEvent<T = any>(eventName: string, listener: (payload: T) => void, deps: any[] = []) {
  const latest = useRef(listener);
  latest.current = listener;

  useEffect(() => {
    const off = deviceEventBus.on(eventName, (payload) => latest.current(payload as T));
    return off;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventName, ...deps]);
}