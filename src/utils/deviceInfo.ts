import { Dimensions, Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';

export interface DeviceInfo {
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

class DeviceInfoService {
  private static cachedInfo: DeviceInfo | null = null;

  /**
   * 获取完整的设备信息
   */
  static async getDeviceInfo(): Promise<DeviceInfo> {
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
        isEmulator
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
        DeviceInfo.isEmulator()
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
        isEmulator
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
        DeviceInfo.getBundleId()
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
   * 清除缓存的设备信息
   */
  static clearCache(): void {
    this.cachedInfo = null;
  }
}

export default DeviceInfoService;