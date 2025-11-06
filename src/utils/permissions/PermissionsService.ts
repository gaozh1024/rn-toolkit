import { Platform } from 'react-native';
import {
  openSettings,
  checkMultiple,
  requestMultiple,
  RESULTS,
  PERMISSIONS,
  type Permission,
  type PermissionStatus,
  checkNotifications,
  requestNotifications,
  type NotificationOption,
} from 'react-native-permissions';
import type { PermissionAlias, EnsureOptions, PermissionCheckResponse, NotificationOptions } from './types';

const isAndroidTPlus = Platform.OS === 'android' && Number(Platform.Version) >= 33; // Android 13+
const isAndroidQPlus = Platform.OS === 'android' && Number(Platform.Version) >= 29; // Android 10+

// 生成平台配置引导提示（用于开发期警告）
function getConfigHints(alias: PermissionAlias): string {
  if (Platform.OS === 'ios') {
    switch (alias) {
      case 'camera': return '请在 Info.plist 添加 NSCameraUsageDescription';
      case 'microphone': return '请在 Info.plist 添加 NSMicrophoneUsageDescription';
      case 'photo': return '请在 Info.plist 添加 NSPhotoLibraryUsageDescription（写入需 NSPhotoLibraryAddUsageDescription）';
      case 'location':
      case 'locationWhenInUse': return '请在 Info.plist 添加 NSLocationWhenInUseUsageDescription';
      case 'locationAlways': return '请在 Info.plist 添加 NSLocationAlwaysAndWhenInUseUsageDescription';
      case 'bluetooth': return '请在 Info.plist 添加 NSBluetoothAlwaysUsageDescription';
      case 'contacts': return '请在 Info.plist 添加 NSContactsUsageDescription';
      case 'calendar': return '请在 Info.plist 添加 NSCalendarsUsageDescription';
      case 'notification': return 'iOS 通知一般无需 Info.plist 声明，确认设备支持并初始化通知';
      case 'storage': return 'iOS 文件系统无需显式权限（照片库请用 photo）';
      default: return '确认设备支持该能力';
    }
  } else {
    switch (alias) {
      case 'camera': return 'AndroidManifest.xml: <uses-permission android:name="android.permission.CAMERA" />';
      case 'microphone': return 'AndroidManifest.xml: <uses-permission android:name="android.permission.RECORD_AUDIO" />';
      case 'photo':
      case 'storage': return isAndroidTPlus
        ? 'AndroidManifest.xml: READ_MEDIA_IMAGES/READ_MEDIA_VIDEO（可选 READ_MEDIA_AUDIO）'
        : 'AndroidManifest.xml: READ_EXTERNAL_STORAGE（部分机型需 WRITE_EXTERNAL_STORAGE）';
      case 'location':
      case 'locationWhenInUse': return 'AndroidManifest.xml: <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />';
      case 'locationAlways': return 'AndroidManifest.xml: ACCESS_FINE_LOCATION + ACCESS_BACKGROUND_LOCATION（谨慎添加）';
      case 'bluetooth': return 'AndroidManifest.xml: Android 12+ 需 BLUETOOTH_CONNECT（及按需 BLUETOOTH_SCAN/BLUETOOTH_ADVERTISE）；11- 扫描依赖定位权限';
      case 'contacts': return 'AndroidManifest.xml: READ_CONTACTS';
      case 'calendar': return 'AndroidManifest.xml: READ_CALENDAR + WRITE_CALENDAR';
      case 'notification': return 'Android 13+ 需 POST_NOTIFICATIONS 权限';
      default: return '确认设备支持该能力';
    }
  }
}

/**
 * 函数：根据别名与选项解析平台权限列表
 * - Android 13+（T+）：photo 默认仅 READ_MEDIA_IMAGES；opts.includeVideo=true 时加 READ_MEDIA_VIDEO
 * - Android 12-：photo 默认仅 READ_EXTERNAL_STORAGE；opts.write=true 时加 WRITE_EXTERNAL_STORAGE
 */
function resolvePermissions(alias: PermissionAlias, opts?: EnsureOptions): Permission[] | 'notification' {
  if (alias === 'notification') return 'notification';

  if (Platform.OS === 'ios') {
    switch (alias) {
      case 'camera': return [PERMISSIONS.IOS.CAMERA];
      case 'microphone': return [PERMISSIONS.IOS.MICROPHONE];
      case 'photo': return [PERMISSIONS.IOS.PHOTO_LIBRARY];
      case 'bluetooth': {
        // 兼容不同版本：优先使用 BLUETOOTH，回退到 BLUETOOTH_PERIPHERAL
        const iosBluetooth: Permission | undefined =
          (PERMISSIONS.IOS as any).BLUETOOTH ?? (PERMISSIONS.IOS as any).BLUETOOTH_PERIPHERAL;
        return iosBluetooth ? [iosBluetooth] : [];
      }
      case 'location': // 默认按 WhenInUse
      case 'locationWhenInUse': return [PERMISSIONS.IOS.LOCATION_WHEN_IN_USE];
      case 'locationAlways': return [PERMISSIONS.IOS.LOCATION_ALWAYS];
      case 'contacts': return [PERMISSIONS.IOS.CONTACTS];
      case 'calendar': return [PERMISSIONS.IOS.CALENDARS];
      case 'storage': return []; // iOS 对文件系统无显式权限；照片库使用 photo
      default: return [];
    }
  } else {
    switch (alias) {
      case 'camera': return [PERMISSIONS.ANDROID.CAMERA];
      case 'microphone': return [PERMISSIONS.ANDROID.RECORD_AUDIO];
      case 'photo': {
        if (isAndroidTPlus) {
          const base: Permission[] = [PERMISSIONS.ANDROID.READ_MEDIA_IMAGES];
          if (opts?.includeVideo) base.push(PERMISSIONS.ANDROID.READ_MEDIA_VIDEO);
          return base;
        }
        const base: Permission[] = [PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE];
        if (opts?.write) base.push(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE);
        return base;
      }
      case 'storage': {
        if (isAndroidTPlus) {
          const base: Permission[] = [PERMISSIONS.ANDROID.READ_MEDIA_IMAGES];
          if (opts?.includeVideo) base.push(PERMISSIONS.ANDROID.READ_MEDIA_VIDEO);
          return base;
        }
        const base: Permission[] = [PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE];
        if (opts?.write) base.push(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE);
        return base;
      }
      case 'bluetooth': {
        // Android 12+：蓝牙运行时权限；更低版本用定位支持扫描
        const sdk =
          typeof Platform?.Version === 'number'
            ? (Platform.Version as number)
            : parseInt(String(Platform.Version), 10) || 0;

        if (Platform.OS === 'android') {
          if (sdk >= 31) {
            const base: Permission[] = [
              PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
              PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
            ];
            // 若需要广播：可按需加入 BLUETOOTH_ADVERTISE
            return base;
          }
          return [PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION];
        }
        return [];
      }
      case 'location':
      case 'locationWhenInUse': return [PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION];
      case 'locationAlways': {
        const base: Permission[] = [PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION];
        if (isAndroidQPlus) base.push(PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION);
        return base;
      }
      case 'contacts': return [PERMISSIONS.ANDROID.READ_CONTACTS];
      case 'calendar': return [PERMISSIONS.ANDROID.READ_CALENDAR, PERMISSIONS.ANDROID.WRITE_CALENDAR];
      default: return [];
    }
  }
}

function isGrantedStatus(alias: PermissionAlias, status: PermissionStatus): boolean {
  // 照片库在 iOS 有 'limited'（受限）也可作为“可用”
  if (alias === 'photo' && status === RESULTS.LIMITED) return true;
  return status === RESULTS.GRANTED;
}

class PermissionsServiceImpl {
  async checkAlias(alias: PermissionAlias): Promise<PermissionCheckResponse> {
    const mapping = resolvePermissions(alias);
    return this.processPermissions(alias, mapping, 'check');
  }

  async requestAlias(alias: PermissionAlias, notificationOptions?: NotificationOptions): Promise<PermissionCheckResponse> {
    const mapping = resolvePermissions(alias);
    return this.processPermissions(alias, mapping, 'request', notificationOptions);
  }

  async ensureAlias(alias: PermissionAlias, options?: EnsureOptions): Promise<boolean> {
    const checked = await this.checkAlias(alias);
    if (checked.isGranted) return true;

    const requested = await this.requestAlias(alias);
    if (requested.isGranted) return true;

    // 被永久拒绝（blocked）时可选择跳到设置
    if (options?.openSettingsIfBlocked && requested.status === RESULTS.BLOCKED) {
      try { await openSettings(); } catch { }
    }
    return false;
  }

  async openSettings(): Promise<void> {
    try { await openSettings(); } catch { }
  }

  private async processPermissions(
    alias: PermissionAlias,
    mapping: Permission[] | 'notification',
    action: 'check' | 'request',
    notificationOptions?: NotificationOptions
  ): Promise<PermissionCheckResponse> {
    if (mapping === 'notification') {
      const res = action === 'check'
        ? await checkNotifications()
        : await requestNotifications(toNotificationOptionsArray(notificationOptions));
      const status = res.status as PermissionStatus;
      if (status === RESULTS.UNAVAILABLE) {
        this.warnUnavailable(alias);
      }
      return { alias, status, isGranted: isGrantedStatus('notification', status) };
    }

    if (mapping.length === 0) {
      // iOS storage 等无需权限，直接视为 granted
      return { alias, status: RESULTS.GRANTED, isGranted: true };
    }

    const fn = action === 'check' ? checkMultiple : requestMultiple;
    try {
      const statusesObj = await fn(mapping);
      const groupStatuses = Object.values(statusesObj) as PermissionStatus[];

      // 统一触发告警：unavailable 或 Android 相机 blocked
      if (
        groupStatuses.some((s) => s === RESULTS.UNAVAILABLE) ||
        (Platform.OS === 'android' && alias === 'camera' && groupStatuses.some((s) => s === RESULTS.BLOCKED))
      ) {
        this.warnUnavailable(alias);
      }

      const isGrantedGroup = groupStatuses.every((s) => isGrantedStatus(alias, s));
      const worst = this.pickWorstStatus(groupStatuses);
      return { alias, status: worst, isGranted: isGrantedGroup };
    } catch {
      // 未声明或设备不支持等异常情况
      this.warnUnavailable(alias);
      return { alias, status: RESULTS.UNAVAILABLE, isGranted: false };
    }
  }

  // 选择最“差”的状态用于汇总展示
  private pickWorstStatus(statuses: PermissionStatus[]): PermissionStatus {
    // 优先级：blocked > denied > unavailable > limited > granted
    const rank = (s: PermissionStatus) => {
      switch (s) {
        case RESULTS.BLOCKED: return 5;
        case RESULTS.DENIED: return 4;
        case RESULTS.UNAVAILABLE: return 3;
        case RESULTS.LIMITED: return 2;
        case RESULTS.GRANTED: return 1;
        default: return 0;
      }
    };
    return statuses.sort((a, b) => rank(b) - rank(a))[0] ?? RESULTS.UNAVAILABLE;
  }

  private warnUnavailable(alias: PermissionAlias) {
    if (typeof __DEV__ !== 'undefined' && __DEV__) {
      // Android 相机权限未在 Manifest 声明时给出明确提示
      if (Platform.OS === 'android' && alias === 'camera') {
        console.warn('还未配置相机权限，请前往android的AndroidManifest.xml配置<uses-permission android:name="android.permission.CAMERA" />');
        return;
      }
      const hint = getConfigHints(alias);
      console.warn(`[PermissionsService] 权限不可用（${alias}）。可能未在平台配置声明或设备不支持。${hint}。参见 src/utils/permissions/README.md`);
    }
  }

  // 便捷方法
  ensureCamera(opts?: EnsureOptions) { return this.ensureAlias('camera', opts); }
  ensureMicrophone(opts?: EnsureOptions) { return this.ensureAlias('microphone', opts); }
  ensurePhoto(opts?: EnsureOptions) { return this.ensureAlias('photo', opts); }
  ensureStorage(opts?: EnsureOptions) { return this.ensureAlias('storage', opts); }
  ensureLocationWhenInUse(opts?: EnsureOptions) { return this.ensureAlias('locationWhenInUse', opts); }
  ensureLocationAlways(opts?: EnsureOptions) { return this.ensureAlias('locationAlways', opts); }
  ensureBluetooth(opts?: EnsureOptions) { return this.ensureAlias('bluetooth', opts); }
  ensureNotification(opts?: EnsureOptions) { return this.ensureAlias('notification', opts); }
}

export const PermissionsService = new PermissionsServiceImpl();
export default PermissionsService;

// 将对象形态的 NotificationOptions 转为 NotificationOption[]
function toNotificationOptionsArray(opts?: NotificationOptions): NotificationOption[] {
  const o = opts || {};
  const pairs: Array<{ key: NotificationOption; enabled?: boolean }> = [
    { key: 'alert', enabled: o.alert },
    { key: 'sound', enabled: o.sound },
    { key: 'badge', enabled: o.badge },
    { key: 'carPlay', enabled: o.carPlay },
    { key: 'criticalAlert', enabled: o.criticalAlert },
    { key: 'provisional', enabled: o.provisional },
    { key: 'providesAppSettings', enabled: o.providesAppSettings },
    // 移除 announcement，当前库类型不包含该选项
  ];
  return pairs.filter(p => !!p.enabled).map(p => p.key);
}