// 导出全局类型定义
export * from './global';

// 重新导出第三方库的类型定义
export type { 
  ClipboardStatic, 
  ClipboardListener, 
  ClipboardImageOptions, 
  ClipboardStringOptions 
} from '@react-native-clipboard/clipboard';

export type {
  DeviceInfoModule,
  DeviceType,
  BatteryState,
  PowerState,
  DisplayMetrics,
  DeviceInformation
} from 'react-native-device-info';

export type {
  Locale,
  NumberFormatSettings,
  Calendar,
  Currency,
  LanguageTag,
  TemperatureUnit,
  LocalizationChangeListener,
  LocalizationData,
  NumberFormatOptions,
  CurrencyFormatOptions,
  DateFormatOptions
} from 'react-native-localize';