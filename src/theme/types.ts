import { TextStyle, ViewStyle } from 'react-native';

// 颜色主题
export interface ColorTheme {
  // 主色调
  primary: string;
  primaryLight: string;
  primaryDark: string;

  // 辅助色
  secondary: string;
  secondaryLight: string;
  secondaryDark: string;

  // 背景色
  background: string;
  surface: string;
  card: string;

  // 文本色
  text: string;
  subtext: string;
  textSecondary: string;
  textDisabled: string;

  // 状态色
  success: string;
  warning: string;
  error: string;
  info: string;

  // 边框和分割线
  border: string;
  divider: string;

  // 透明度变体
  overlay: string;
  shadow: string;
}

// 导航主题
export interface NavigationTheme {
  // 导航栏
  height: number;
  backgroundColor: string;
  borderColor: string;
  shadowColor: string;

  // 标题
  titleColor: string;
  titleSize: number;
  titleWeight: TextStyle['fontWeight'];

  // 图标
  iconColor: string;
  iconActiveColor: string;
  iconSize: number;

  // 标签
  labelColor: string;
  labelActiveColor: string;
  labelSize: number;
  labelWeight: TextStyle['fontWeight'];

  // 徽章
  badgeBackgroundColor: string;
  badgeTextColor: string;
  badgeSize: number;
}

// 文本主题
export interface TextTheme {
  // 标题
  h1: TextStyle;
  h2: TextStyle;
  h3: TextStyle;
  h4: TextStyle;
  h5: TextStyle;
  h6: TextStyle;

  // 正文
  body1: TextStyle;
  body2: TextStyle;

  // 说明文字
  caption: TextStyle;
  overline: TextStyle;

  // 按钮文字
  button: TextStyle;

  // 链接
  link: TextStyle;
}

// 按钮主题
export interface ButtonTheme {
  // 主要按钮
  primary: {
    backgroundColor: string;
    textColor: string;
    borderWidth: number;
    borderColor: string;
    borderRadius: number;
    height: number;
    paddingHorizontal: number;
    fontSize: number;
    fontWeight: TextStyle['fontWeight'];
  };

  // 次要按钮
  secondary: {
    backgroundColor: string;
    textColor: string;
    borderColor: string;
    borderRadius: number;
    height: number;
    paddingHorizontal: number;
    fontSize: number;
    fontWeight: TextStyle['fontWeight'];
  };

  // 轮廓按钮
  outline: {
    backgroundColor: string;
    textColor: string;
    borderColor: string;
    borderRadius: number;
    height: number;
    paddingHorizontal: number;
    fontSize: number;
    fontWeight: TextStyle['fontWeight'];
  };

  // 文本按钮
  text: {
    backgroundColor: string;
    textColor: string;
    borderColor: string;
    borderRadius: number;
    height: number;
    paddingHorizontal: number;
    fontSize: number;
    fontWeight: TextStyle['fontWeight'];
  };

  // 禁用状态
  disabled: {
    backgroundColor: string;
    textColor: string;
    borderColor: string;
  };
}

// 输入框主题
export interface InputTheme {
  // 默认状态
  default: {
    backgroundColor: string;
    borderWidth: number;
    borderColor: string;
    borderRadius: number;
    height: number;
    paddingHorizontal: number;
    paddingVertical: number;
    fontSize: number;
    textColor: string;
    placeholderColor: string;
  };

  // 聚焦状态
  focused: {
    borderColor: string;
    borderWidth: number;
    shadowColor: string;
  };

  // 错误状态
  error: {
    borderColor: string;
    backgroundColor: string;
  };

  // 禁用状态
  disabled: {
    backgroundColor: string;
    textColor: string;
    borderColor: string;
  };

  // 标签样式
  label: {
    fontSize: number;
    fontWeight: TextStyle['fontWeight'];
    color: string;
    marginBottom: number;
  };

  // 帮助文本
  helperText: {
    fontSize: number;
    color: string;
    marginTop: number;
  };

  // 错误文本
  errorText: {
    fontSize: number;
    color: string;
    marginTop: number;
  };
}

// 间距主题
export interface SpacingTheme {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
}

// 圆角主题
export interface BorderRadiusTheme {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  round: number;
}

// 阴影主题
export interface ShadowTheme {
  small: ViewStyle;
  medium: ViewStyle;
  large: ViewStyle;
}

// =============================================================================
// 用户可自定义的主题配置（基础主题）
// =============================================================================
export interface BaseTheme {
  colors: ColorTheme;
  navigation: NavigationTheme;
  text: TextTheme;
  button: ButtonTheme;
  input: InputTheme;
  spacing: SpacingTheme;
  borderRadius: BorderRadiusTheme;
  shadow: ShadowTheme;
}

// 用户可修改的主题配置
export interface ThemeConfig {
  colors?: Partial<ColorTheme>;
  navigation?: Partial<NavigationTheme>;
  text?: Partial<TextTheme>;
  button?: Partial<ButtonTheme>;
  input?: Partial<InputTheme>;
  spacing?: Partial<SpacingTheme>;
  borderRadius?: Partial<BorderRadiusTheme>;
  shadow?: Partial<ShadowTheme>;
}

// =============================================================================
// 系统自动生成的样式预设（只读）
// =============================================================================

// 布局样式预设
export interface LayoutTheme {
  // 基础布局
  container: ViewStyle;
  row: ViewStyle;
  column: ViewStyle;
  center: ViewStyle;
  flex1: ViewStyle;

  // 对齐方式
  alignCenter: ViewStyle;
  alignStart: ViewStyle;
  alignEnd: ViewStyle;
  alignStretch: ViewStyle;
  justifyCenter: ViewStyle;
  justifyStart: ViewStyle;
  justifyEnd: ViewStyle;
  justifyBetween: ViewStyle;
  justifyAround: ViewStyle;
  justifyEvenly: ViewStyle;

  // 行布局组合
  rowCenter: ViewStyle;
  rowStart: ViewStyle;
  rowEnd: ViewStyle;
  rowBetween: ViewStyle;
  rowAround: ViewStyle;
  rowEvenly: ViewStyle;

  // 列布局组合
  columnCenter: ViewStyle;
  columnStart: ViewStyle;
  columnEnd: ViewStyle;
  columnBetween: ViewStyle;
  columnAround: ViewStyle;
  columnEvenly: ViewStyle;

  // 定位相关
  absolute: ViewStyle;
  relative: ViewStyle;
  absoluteFill: ViewStyle;
  absoluteTop: ViewStyle;
  absoluteBottom: ViewStyle;
  absoluteLeft: ViewStyle;
  absoluteRight: ViewStyle;
  absoluteCenter: ViewStyle;
  absoluteTopLeft: ViewStyle;
  absoluteTopRight: ViewStyle;
  absoluteBottomLeft: ViewStyle;
  absoluteBottomRight: ViewStyle;
}

// 圆角样式预设
export interface BorderRadiusStyles {
  none: ViewStyle;
  xs: ViewStyle;
  sm: ViewStyle;
  md: ViewStyle;
  lg: ViewStyle;
  xl: ViewStyle;
  round: ViewStyle;

  // 单角圆角
  topLeft: (size: number) => ViewStyle;
  topRight: (size: number) => ViewStyle;
  bottomLeft: (size: number) => ViewStyle;
  bottomRight: (size: number) => ViewStyle;
  top: (size: number) => ViewStyle;
  bottom: (size: number) => ViewStyle;
  left: (size: number) => ViewStyle;
  right: (size: number) => ViewStyle;
}

// 阴影样式预设
export interface ShadowStyles {
  none: ViewStyle;
  xs: ViewStyle;
  sm: ViewStyle;
  md: ViewStyle;
  lg: ViewStyle;
  xl: ViewStyle;

  // 方向阴影
  top: ViewStyle;
  bottom: ViewStyle;
  left: ViewStyle;
  right: ViewStyle;

  // 特殊阴影
  inner: ViewStyle;
  glow: ViewStyle;
}

// 边框样式预设
export interface BorderStyles {
  none: ViewStyle;
  thin: ViewStyle;
  medium: ViewStyle;
  thick: ViewStyle;

  // 方向边框
  top: ViewStyle;
  bottom: ViewStyle;
  left: ViewStyle;
  right: ViewStyle;
  horizontal: ViewStyle;
  vertical: ViewStyle;

  // 边框样式
  solid: ViewStyle;
  dashed: ViewStyle;
  dotted: ViewStyle;
}

// 间距样式预设
export interface SpacingStyles {
  // Padding 样式
  p0: ViewStyle;
  pXs: ViewStyle;
  pSm: ViewStyle;
  pMd: ViewStyle;
  pLg: ViewStyle;
  pXl: ViewStyle;
  pXxl: ViewStyle;

  // Padding 水平
  pxXs: ViewStyle;
  pxSm: ViewStyle;
  pxMd: ViewStyle;
  pxLg: ViewStyle;
  pxXl: ViewStyle;
  pxXxl: ViewStyle;

  // Padding 垂直
  pyXs: ViewStyle;
  pySm: ViewStyle;
  pyMd: ViewStyle;
  pyLg: ViewStyle;
  pyXl: ViewStyle;
  pyXxl: ViewStyle;

  // Padding 单方向
  ptXs: ViewStyle; ptSm: ViewStyle; ptMd: ViewStyle; ptLg: ViewStyle; ptXl: ViewStyle; ptXxl: ViewStyle;
  pbXs: ViewStyle; pbSm: ViewStyle; pbMd: ViewStyle; pbLg: ViewStyle; pbXl: ViewStyle; pbXxl: ViewStyle;
  plXs: ViewStyle; plSm: ViewStyle; plMd: ViewStyle; plLg: ViewStyle; plXl: ViewStyle; plXxl: ViewStyle;
  prXs: ViewStyle; prSm: ViewStyle; prMd: ViewStyle; prLg: ViewStyle; prXl: ViewStyle; prXxl: ViewStyle;

  // Margin 样式
  m0: ViewStyle;
  mXs: ViewStyle;
  mSm: ViewStyle;
  mMd: ViewStyle;
  mLg: ViewStyle;
  mXl: ViewStyle;
  mXxl: ViewStyle;

  // Margin 水平
  mxXs: ViewStyle;
  mxSm: ViewStyle;
  mxMd: ViewStyle;
  mxLg: ViewStyle;
  mxXl: ViewStyle;
  mxXxl: ViewStyle;

  // Margin 垂直
  myXs: ViewStyle;
  mySm: ViewStyle;
  myMd: ViewStyle;
  myLg: ViewStyle;
  myXl: ViewStyle;
  myXxl: ViewStyle;

  // Margin 单方向
  mtXs: ViewStyle; mtSm: ViewStyle; mtMd: ViewStyle; mtLg: ViewStyle; mtXl: ViewStyle; mtXxl: ViewStyle;
  mbXs: ViewStyle; mbSm: ViewStyle; mbMd: ViewStyle; mbLg: ViewStyle; mbXl: ViewStyle; mbXxl: ViewStyle;
  mlXs: ViewStyle; mlSm: ViewStyle; mlMd: ViewStyle; mlLg: ViewStyle; mlXl: ViewStyle; mlXxl: ViewStyle;
  mrXs: ViewStyle; mrSm: ViewStyle; mrMd: ViewStyle; mrLg: ViewStyle; mrXl: ViewStyle; mrXxl: ViewStyle;
}

// 尺寸样式预设
export interface SizeStyles {
  // 宽度
  w0: ViewStyle;
  wXs: ViewStyle;
  wSm: ViewStyle;
  wMd: ViewStyle;
  wLg: ViewStyle;
  wXl: ViewStyle;
  wFull: ViewStyle;
  wScreen: ViewStyle;

  // 高度
  h0: ViewStyle;
  hXs: ViewStyle;
  hSm: ViewStyle;
  hMd: ViewStyle;
  hLg: ViewStyle;
  hXl: ViewStyle;
  hFull: ViewStyle;
  hScreen: ViewStyle;

  // 最小尺寸
  minW0: ViewStyle;
  minWFull: ViewStyle;
  minH0: ViewStyle;
  minHFull: ViewStyle;
  minHScreen: ViewStyle;

  // 最大尺寸
  maxWFull: ViewStyle;
  maxWScreen: ViewStyle;
  maxHFull: ViewStyle;
  maxHScreen: ViewStyle;
}

// 系统生成的样式预设集合
export interface StylePresets {
  layout: LayoutTheme;
  borderRadius: BorderRadiusStyles;
  shadow: ShadowStyles;
  border: BorderStyles;
  spacing: SpacingStyles;
  size: SizeStyles;
}

// =============================================================================
// 完整主题接口
// =============================================================================

// 完整主题接口（包含基础主题 + 样式预设）
export interface Theme extends BaseTheme {
  // 系统自动生成的样式预设（只读）
  readonly styles: StylePresets;
}

// 统一的主题模式类型别名，便于外部复用与扩展
export type ThemeMode = 'light' | 'dark' | 'system';

// Hook返回类型
export interface UseThemeReturn {
  // 基础主题（用户可修改部分）
  theme: BaseTheme;
  // 完整主题（包含样式预设）
  fullTheme: Theme;
  // 样式预设（只读）
  styles: StylePresets;
  // 主题操作方法（异步）
  updateTheme: (config: ThemeConfig) => Promise<void>;
  resetTheme: () => Promise<void>;
  isDark: boolean;
  toggleDarkMode: () => Promise<void>;
  // 新增：系统主题跟随控制
  setThemeMode: (mode: ThemeMode) => Promise<void>;
  currentMode: ThemeMode;
}