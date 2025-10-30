import { Dimensions, Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';

export interface DeviceInformation {
  // 基础信息
  brand: string;
  model: string;
  deviceId: string;
  systemName: string;
  systemVersion: string;
  appVersion: string;
  buildNumber: string;
  bundleId: string;

  // 屏幕信息
  screenWidth: number;
  screenHeight: number;

  // 平台信息
  platform: 'ios' | 'android';
  isTablet: boolean;
  isEmulator: boolean;
}

// 同步的基础信息类型（可选导出）
export interface BasicDeviceInfo {
  width: number;
  height: number;
  isTablet: boolean;
  isEmulator: boolean;
  version: string;
  buildNumber: string;
}

class DeviceInfoService {
  private static cachedInfo: DeviceInformation | null = null;

  /**
   * 获取完整的设备信息
   */
  static async getDeviceInfo(): Promise<DeviceInformation> {
    if (this.cachedInfo) {
      return this.cachedInfo;
    }

    try {
      const { width, height } = Dimensions.get('screen');

      const [
        brand,
        model,
        deviceId,
        systemName,
        systemVersion,
        appVersion,
        buildNumber,
        bundleId,
        isTablet,
        isEmulator,
      ] = await Promise.all([
        DeviceInfo.getBrand(),
        DeviceInfo.getModel(),
        DeviceInfo.getDeviceId(),
        DeviceInfo.getSystemName(),
        DeviceInfo.getSystemVersion(),
        DeviceInfo.getVersion(),
        DeviceInfo.getBuildNumber(),
        DeviceInfo.getBundleId(),
        DeviceInfo.isTablet(),
        DeviceInfo.isEmulator(),
      ]);

      this.cachedInfo = {
        brand,
        model,
        deviceId,
        systemName,
        systemVersion,
        appVersion,
        buildNumber,
        bundleId,
        screenWidth: width,
        screenHeight: height,
        platform: Platform.OS as 'ios' | 'android',
        isTablet,
        isEmulator,
      };

      return this.cachedInfo;
    } catch (error) {
      console.error('获取设备信息失败:', error);
      throw new Error('无法获取设备信息');
    }
  }

  /**
   * 获取设备唯一标识符
   */
  static async getDeviceId(): Promise<string> {
    try {
      return await DeviceInfo.getDeviceId();
    } catch (error) {
      console.error('获取设备ID失败:', error);
      return 'unknown';
    }
  }

  /**
   * 获取应用版本信息
   */
  static async getAppInfo(): Promise<{ version: string; buildNumber: string; bundleId: string }> {
    try {
      const [version, buildNumber, bundleId] = await Promise.all([
        DeviceInfo.getVersion(),
        DeviceInfo.getBuildNumber(),
        DeviceInfo.getBundleId(),
      ]);

      return { version, buildNumber, bundleId };
    } catch (error) {
      console.error('获取应用信息失败:', error);
      return { version: 'unknown', buildNumber: 'unknown', bundleId: 'unknown' };
    }
  }

  /**
   * 检查是否为平板设备
   */
  static async isTablet(): Promise<boolean> {
    try {
      return await DeviceInfo.isTablet();
    } catch (error) {
      console.error('检查平板设备失败:', error);
      return false;
    }
  }

  /**
   * 检查是否为模拟器
   */
  static async isEmulator(): Promise<boolean> {
    try {
      return await DeviceInfo.isEmulator();
    } catch (error) {
      console.error('检查模拟器失败:', error);
      return false;
    }
  }

  /**
   * 获取设备类型
   */
  static getDeviceType(): string {
    try {
      return DeviceInfo.getDeviceType();
    } catch (error) {
      console.error('获取设备类型失败:', error);
      return 'unknown';
    }
  }

  /**
   * 获取电池信息
   */
  static async getBatteryInfo() {
    try {
      const [batteryLevel, isCharging, powerState] = await Promise.all([
        DeviceInfo.getBatteryLevel(),
        DeviceInfo.isBatteryCharging(),
        DeviceInfo.getPowerState(),
      ]);

      return {
        batteryLevel,
        isCharging,
        powerState,
      };
    } catch (error) {
      console.error('获取电池信息失败:', error);
      return null;
    }
  }

  /**
   * 获取内存信息
   */
  static async getMemoryInfo() {
    try {
      const [totalMemory, usedMemory, freeMemory] = await Promise.all([
        DeviceInfo.getTotalMemory(),
        DeviceInfo.getUsedMemory(),
        DeviceInfo.getTotalMemory().then(total => DeviceInfo.getUsedMemory().then(used => total - used)),
      ]);

      return {
        totalMemory,
        usedMemory,
        freeMemory,
      };
    } catch (error) {
      console.error('获取内存信息失败:', error);
      return null;
    }
  }

  /**
   * 清除缓存的设备信息
   */
  static clearCache(): void {
    this.cachedInfo = null;
  }

  /**
   * 同步获取基础设备信息（非敏感、可用于布局）
   * - 平板判定：最短边 >= 600
   * - 模拟器：优先使用 isEmulatorSync()，否则回退为 false
   * - 版本与构建号：同步获取
   */
  static getBasicInfoSync(): BasicDeviceInfo {
    const { width, height } = Dimensions.get('window');
    const shortest = Math.min(width, height);
    const isTablet = shortest >= 600;

    let isEmulator = false;
    try {
      const fn = (DeviceInfo as any).isEmulatorSync;
      if (typeof fn === 'function') {
        isEmulator = !!fn();
      }
    } catch {
      // 回退为 false
      isEmulator = false;
    }

    const version = typeof DeviceInfo.getVersion === 'function' ? DeviceInfo.getVersion() : 'unknown';
    const buildNumber =
      typeof DeviceInfo.getBuildNumber === 'function' ? DeviceInfo.getBuildNumber() : 'unknown';

    return { width, height, isTablet, isEmulator, version, buildNumber };
  }
}

export default DeviceInfoService;
