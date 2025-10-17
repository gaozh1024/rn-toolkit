import type { PermissionStatus } from 'react-native-permissions';

export type PermissionAlias =
  | 'camera'              // 
  | 'microphone'
  | 'photo'
  | 'storage'
  | 'location'
  | 'locationWhenInUse'
  | 'locationAlways'
  | 'bluetooth'
  | 'notification'
  | 'contacts'
  | 'calendar';

export type PermissionResult = PermissionStatus; // 'unavailable' | 'denied' | 'blocked' | 'granted' | 'limited'

export interface EnsureOptions {
  openSettingsIfBlocked?: boolean; // blocked 时是否自动跳转设置
}

export interface NotificationOptions {
  alert?: boolean;
  sound?: boolean;
  badge?: boolean;
  carPlay?: boolean;
  criticalAlert?: boolean;
  provisional?: boolean;
  providesAppSettings?: boolean;
  announcement?: boolean;
}

export interface PermissionCheckResponse {
  alias: PermissionAlias;
  status: PermissionResult;
  isGranted: boolean;
}