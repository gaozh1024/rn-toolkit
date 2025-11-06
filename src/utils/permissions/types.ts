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
  /** Android：是否需要写入（旧版需 WRITE_EXTERNAL_STORAGE） */
  write?: boolean;
  /** Android 13+：是否同时请求视频读取（默认只请求图片） */
  includeVideo?: boolean;
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