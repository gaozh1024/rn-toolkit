import { useEffect, useState } from 'react';
import { AppState, AppStateStatus, Dimensions } from 'react-native';
import DeviceInfoService, { DeviceInformation } from './deviceInfo';

export interface UseDeviceInfoResult {
  info: DeviceInformation | null;
  refresh: () => Promise<void>;
}

export function useDeviceInfo(): UseDeviceInfoResult {
  const [info, setInfo] = useState<DeviceInformation | null>(null);

  const refresh = async () => {
    // 清理缓存，重新拉取并同步最新屏幕尺寸
    DeviceInfoService.clearCache();
    const base = await DeviceInfoService.getDeviceInfo();
    const { width, height } = Dimensions.get('screen');
    setInfo({ ...base, screenWidth: width, screenHeight: height });
  };

  useEffect(() => {
    let mounted = true;

    // 初始化数据
    refresh();

    // 监听屏幕尺寸变化
    const dimSub = Dimensions.addEventListener('change', () => {
      if (mounted) {
        refresh();
      }
    });

    // 监听 AppState，当恢复到前台时刷新
    const appSub = AppState.addEventListener('change', (state: AppStateStatus) => {
      if (state === 'active' && mounted) {
        refresh();
      }
    });

    return () => {
      mounted = false;
      dimSub.remove();
      appSub.remove();
    };
  }, []);

  return { info, refresh };
}

export default useDeviceInfo;