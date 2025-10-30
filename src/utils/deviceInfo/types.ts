export interface DeviceInformation {
  brand: string;
  model: string;
  deviceId: string;
  systemName: string;
  systemVersion: string;
  appVersion: string;
  buildNumber: string;
  bundleId: string;
  screenWidth: number;
  screenHeight: number;
  platform: 'ios' | 'android';
  isTablet: boolean;
  isEmulator: boolean;
}