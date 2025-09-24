declare module 'react-native-device-info' {
  export interface DeviceInfoModule {
    // 基础设备信息
    getBrand(): Promise<string>;
    getModel(): Promise<string>;
    getDeviceId(): Promise<string>;
    getUniqueId(): Promise<string>;
    getManufacturer(): Promise<string>;
    getDeviceName(): Promise<string>;
    getDeviceToken(): Promise<string>;

    // 系统信息
    getSystemName(): Promise<string>;
    getSystemVersion(): Promise<string>;
    getApiLevel(): Promise<number>;
    getAndroidId(): Promise<string>;
    getIosIdForVendor(): Promise<string>;

    // 应用信息
    getApplicationName(): string;
    getBundleId(): string;
    getVersion(): string;
    getBuildNumber(): string;
    getReadableVersion(): string;
    getVersionNumber(): string;

    // 硬件信息
    getHardware(): Promise<string>;
    getProduct(): Promise<string>;
    getTags(): Promise<string>;
    getType(): Promise<string>;
    getBaseOs(): Promise<string>;
    getPreviewSdkInt(): Promise<number>;
    getSecurityPatch(): Promise<string>;
    getCodename(): Promise<string>;
    getIncremental(): Promise<string>;

    // 内存信息
    getTotalMemory(): Promise<number>;
    getUsedMemory(): Promise<number>;
    getFreeMemory(): Promise<number>;
    getTotalDiskCapacity(): Promise<number>;
    getFreeDiskStorage(): Promise<number>;

    // 网络信息
    getIpAddress(): Promise<string>;
    getMacAddress(): Promise<string>;
    getCarrier(): Promise<string>;

    // 电池信息
    getBatteryLevel(): Promise<number>;
    isBatteryCharging(): Promise<boolean>;
    getPowerState(): Promise<{
      batteryLevel: number;
      batteryState: 'unknown' | 'unplugged' | 'charging' | 'full';
      lowPowerMode: boolean;
    }>;

    // 显示信息
    getDisplay(): Promise<{
      width: number;
      height: number;
      scale: number;
      fontScale: number;
    }>;
    getBrightness(): Promise<number>;

    // 设备状态检查
    isTablet(): Promise<boolean>;
    isEmulator(): Promise<boolean>;
    isPinOrFingerprintSet(): Promise<boolean>;
    hasNotch(): boolean;
    hasDynamicIsland(): boolean;
    hasSystemFeature(feature: string): Promise<boolean>;
    isLocationEnabled(): Promise<boolean>;
    isHeadphonesConnected(): Promise<boolean>;
    isAirplaneMode(): Promise<boolean>;
    isCameraPresent(): Promise<boolean>;

    // 时区和语言
    getTimezone(): string;
    getDeviceLocale(): string;
    getPreferredLocales(): string[];

    // 用户代理
    getUserAgent(): Promise<string>;

    // 字体缩放
    getFontScale(): Promise<number>;

    // 设备类型
    getDeviceType(): 'Handset' | 'Tablet' | 'Tv' | 'Desktop' | 'GamingConsole' | 'unknown';

    // 支持的 ABI (Android)
    supportedAbis(): Promise<string[]>;
    supported32BitAbis(): Promise<string[]>;
    supported64BitAbis(): Promise<string[]>;

    // 安装时间
    getFirstInstallTime(): Promise<number>;
    getLastUpdateTime(): Promise<number>;

    // 序列号
    getSerialNumber(): Promise<string>;

    // 启动时间
    getBootloader(): Promise<string>;
    getDevice(): Promise<string>;
    getFingerprint(): Promise<string>;
    getHost(): Promise<string>;

    // 同步方法
    getBrandSync(): string;
    getModelSync(): string;
    getDeviceIdSync(): string;
    getSystemNameSync(): string;
    getSystemVersionSync(): string;
    getBundleIdSync(): string;
    getVersionSync(): string;
    getBuildNumberSync(): string;
    getApplicationNameSync(): string;
    getDeviceNameSync(): string;
    getUserAgentSync(): string;
    getDeviceLocaleSync(): string;
    getTimezoneSync(): string;
    getFontScaleSync(): number;
    isTabletSync(): boolean;
    isEmulatorSync(): boolean;
    isPinOrFingerprintSetSync(): boolean;
    getDeviceTypeSync(): 'Handset' | 'Tablet' | 'Tv' | 'Desktop' | 'GamingConsole' | 'unknown';

    // 事件监听
    addEventListener(type: string, handler: (data: any) => void): void;
    removeEventListener(type: string, handler: (data: any) => void): void;
  }

  const DeviceInfo: DeviceInfoModule;
  export default DeviceInfo;

  // 导出常用类型
  export type DeviceType = 'Handset' | 'Tablet' | 'Tv' | 'Desktop' | 'GamingConsole' | 'unknown';
  export type BatteryState = 'unknown' | 'unplugged' | 'charging' | 'full';

  export interface PowerState {
    batteryLevel: number;
    batteryState: BatteryState;
    lowPowerMode: boolean;
  }

  export interface DisplayMetrics {
    width: number;
    height: number;
    scale: number;
    fontScale: number;
  }

  // 设备信息接口
  export interface DeviceInformation {
    brand: string;
    model: string;
    deviceId: string;
    systemName: string;
    systemVersion: string;
    appVersion: string;
    buildNumber: string;
    bundleId: string;
    isTablet: boolean;
    isEmulator: boolean;
    deviceType: DeviceType;
  }
}