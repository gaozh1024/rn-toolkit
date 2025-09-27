import { Theme, BaseTheme, StylePresets } from './types';
import { Dimensions } from 'react-native';
import type {
  LayoutTheme,
  BorderRadiusStyles,
  ShadowStyles,
  BorderStyles,
  SpacingStyles,
  SizeStyles,
  ColorTheme,
  SpacingTheme,
  BorderRadiusTheme
} from './types';

// 创建布局样式的辅助函数
function createLayoutStyles(): LayoutTheme {
  return {
    // 基础布局
    container: { flex: 1, padding: 16 },
    row: { flexDirection: 'row' },
    column: { flexDirection: 'column' },
    center: { justifyContent: 'center', alignItems: 'center' },
    flex1: { flex: 1 },

    // 对齐方式
    alignCenter: { alignItems: 'center' },
    alignStart: { alignItems: 'flex-start' },
    alignEnd: { alignItems: 'flex-end' },
    alignStretch: { alignItems: 'stretch' },
    justifyCenter: { justifyContent: 'center' },
    justifyStart: { justifyContent: 'flex-start' },
    justifyEnd: { justifyContent: 'flex-end' },
    justifyBetween: { justifyContent: 'space-between' },
    justifyAround: { justifyContent: 'space-around' },
    justifyEvenly: { justifyContent: 'space-evenly' },

    // 行布局组合
    rowCenter: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
    rowStart: { flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' },
    rowEnd: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' },
    rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    rowAround: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
    rowEvenly: { flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' },

    // 列布局组合
    columnCenter: { flexDirection: 'column', justifyContent: 'center', alignItems: 'center' },
    columnStart: { flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center' },
    columnEnd: { flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center' },
    columnBetween: { flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center' },
    columnAround: { flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center' },
    columnEvenly: { flexDirection: 'column', justifyContent: 'space-evenly', alignItems: 'center' },

    // 定位相关
    absolute: { position: 'absolute' },
    relative: { position: 'relative' },
    absoluteFill: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
    absoluteTop: { position: 'absolute', top: 0, left: 0, right: 0 },
    absoluteBottom: { position: 'absolute', bottom: 0, left: 0, right: 0 },
    absoluteLeft: { position: 'absolute', left: 0, top: 0, bottom: 0 },
    absoluteRight: { position: 'absolute', right: 0, top: 0, bottom: 0 },
    absoluteCenter: { position: 'absolute', top: '50%', left: '50%', transform: [{ translateX: -50 }, { translateY: -50 }] },
    absoluteTopLeft: { position: 'absolute', top: 0, left: 0 },
    absoluteTopRight: { position: 'absolute', top: 0, right: 0 },
    absoluteBottomLeft: { position: 'absolute', bottom: 0, left: 0 },
    absoluteBottomRight: { position: 'absolute', bottom: 0, right: 0 },
  };
}

// 创建圆角样式的辅助函数
function createBorderRadiusStyles(borderRadius: BorderRadiusTheme): BorderRadiusStyles {
  return {
    // 基础圆角
    none: { borderRadius: 0 },
    xs: { borderRadius: borderRadius.xs },
    sm: { borderRadius: borderRadius.sm },
    md: { borderRadius: borderRadius.md },
    lg: { borderRadius: borderRadius.lg },
    xl: { borderRadius: borderRadius.xl },
    round: { borderRadius: borderRadius.round },

    // 单角圆角
    topLeft: (size: number) => ({ borderTopLeftRadius: size }),
    topRight: (size: number) => ({ borderTopRightRadius: size }),
    bottomLeft: (size: number) => ({ borderBottomLeftRadius: size }),
    bottomRight: (size: number) => ({ borderBottomRightRadius: size }),

    // 组合圆角
    top: (size: number) => ({
      borderTopLeftRadius: size,
      borderTopRightRadius: size
    }),
    bottom: (size: number) => ({
      borderBottomLeftRadius: size,
      borderBottomRightRadius: size
    }),
    left: (size: number) => ({
      borderTopLeftRadius: size,
      borderBottomLeftRadius: size
    }),
    right: (size: number) => ({
      borderTopRightRadius: size,
      borderBottomRightRadius: size
    }),
  };
}

// 创建阴影样式的辅助函数
function createShadowStyles(): ShadowStyles {
  return {
    // 基础阴影
    none: {
      shadowColor: 'transparent',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0,
      shadowRadius: 0,
      elevation: 0,
    },
    xs: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 1,
      elevation: 1,
    },
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 4,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 8,
    },
    xl: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.25,
      shadowRadius: 16,
      elevation: 16,
    },

    // 方向阴影
    top: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 4,
    },
    bottom: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 4,
    },
    left: {
      shadowColor: '#000',
      shadowOffset: { width: -2, height: 0 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 4,
    },
    right: {
      shadowColor: '#000',
      shadowOffset: { width: 2, height: 0 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 4,
    },

    // 特殊阴影
    inner: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 0, // 内阴影在 React Native 中需要特殊处理
    },
    glow: {
      shadowColor: '#007AFF',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    },
  };
}

// 创建边框样式
const createBorderStyles = (colors: ColorTheme): BorderStyles => ({
  // 基础边框
  none: {
    borderWidth: 0,
  },
  thin: {
    borderWidth: 1,
    borderColor: colors.border,
  },
  medium: {
    borderWidth: 2,
    borderColor: colors.border,
  },
  thick: {
    borderWidth: 3,
    borderColor: colors.border,
  },

  // 方向边框
  top: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  bottom: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  left: {
    borderLeftWidth: 1,
    borderLeftColor: colors.border,
  },
  right: {
    borderRightWidth: 1,
    borderRightColor: colors.border,
  },
  horizontal: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderLeftColor: colors.border,
    borderRightColor: colors.border,
  },
  vertical: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderTopColor: colors.border,
    borderBottomColor: colors.border,
  },

  // 边框样式
  solid: {
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'solid',
  },
  dashed: {
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  dotted: {
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dotted',
  },
});

// 创建间距样式的辅助函数
function createSpacingStyles(spacing: SpacingTheme): SpacingStyles {
  return {
    // Padding 样式
    p0: { padding: 0 },
    pXs: { padding: spacing.xs },
    pSm: { padding: spacing.sm },
    pMd: { padding: spacing.md },
    pLg: { padding: spacing.lg },
    pXl: { padding: spacing.xl },
    pXxl: { padding: spacing.xxl },

    // Padding 水平
    pxXs: { paddingHorizontal: spacing.xs },
    pxSm: { paddingHorizontal: spacing.sm },
    pxMd: { paddingHorizontal: spacing.md },
    pxLg: { paddingHorizontal: spacing.lg },
    pxXl: { paddingHorizontal: spacing.xl },
    pxXxl: { paddingHorizontal: spacing.xxl },

    // Padding 垂直
    pyXs: { paddingVertical: spacing.xs },
    pySm: { paddingVertical: spacing.sm },
    pyMd: { paddingVertical: spacing.md },
    pyLg: { paddingVertical: spacing.lg },
    pyXl: { paddingVertical: spacing.xl },
    pyXxl: { paddingVertical: spacing.xxl },

    // Padding 单方向 - Top
    ptXs: { paddingTop: spacing.xs },
    ptSm: { paddingTop: spacing.sm },
    ptMd: { paddingTop: spacing.md },
    ptLg: { paddingTop: spacing.lg },
    ptXl: { paddingTop: spacing.xl },
    ptXxl: { paddingTop: spacing.xxl },

    // Padding 单方向 - Bottom
    pbXs: { paddingBottom: spacing.xs },
    pbSm: { paddingBottom: spacing.sm },
    pbMd: { paddingBottom: spacing.md },
    pbLg: { paddingBottom: spacing.lg },
    pbXl: { paddingBottom: spacing.xl },
    pbXxl: { paddingBottom: spacing.xxl },

    // Padding 单方向 - Left
    plXs: { paddingLeft: spacing.xs },
    plSm: { paddingLeft: spacing.sm },
    plMd: { paddingLeft: spacing.md },
    plLg: { paddingLeft: spacing.lg },
    plXl: { paddingLeft: spacing.xl },
    plXxl: { paddingLeft: spacing.xxl },

    // Padding 单方向 - Right
    prXs: { paddingRight: spacing.xs },
    prSm: { paddingRight: spacing.sm },
    prMd: { paddingRight: spacing.md },
    prLg: { paddingRight: spacing.lg },
    prXl: { paddingRight: spacing.xl },
    prXxl: { paddingRight: spacing.xxl },

    // Margin 样式
    m0: { margin: 0 },
    mXs: { margin: spacing.xs },
    mSm: { margin: spacing.sm },
    mMd: { margin: spacing.md },
    mLg: { margin: spacing.lg },
    mXl: { margin: spacing.xl },
    mXxl: { margin: spacing.xxl },

    // Margin 水平
    mxXs: { marginHorizontal: spacing.xs },
    mxSm: { marginHorizontal: spacing.sm },
    mxMd: { marginHorizontal: spacing.md },
    mxLg: { marginHorizontal: spacing.lg },
    mxXl: { marginHorizontal: spacing.xl },
    mxXxl: { marginHorizontal: spacing.xxl },

    // Margin 垂直
    myXs: { marginVertical: spacing.xs },
    mySm: { marginVertical: spacing.sm },
    myMd: { marginVertical: spacing.md },
    myLg: { marginVertical: spacing.lg },
    myXl: { marginVertical: spacing.xl },
    myXxl: { marginVertical: spacing.xxl },

    // Margin 单方向 - Top
    mtXs: { marginTop: spacing.xs },
    mtSm: { marginTop: spacing.sm },
    mtMd: { marginTop: spacing.md },
    mtLg: { marginTop: spacing.lg },
    mtXl: { marginTop: spacing.xl },
    mtXxl: { marginTop: spacing.xxl },

    // Margin 单方向 - Bottom
    mbXs: { marginBottom: spacing.xs },
    mbSm: { marginBottom: spacing.sm },
    mbMd: { marginBottom: spacing.md },
    mbLg: { marginBottom: spacing.lg },
    mbXl: { marginBottom: spacing.xl },
    mbXxl: { marginBottom: spacing.xxl },

    // Margin 单方向 - Left
    mlXs: { marginLeft: spacing.xs },
    mlSm: { marginLeft: spacing.sm },
    mlMd: { marginLeft: spacing.md },
    mlLg: { marginLeft: spacing.lg },
    mlXl: { marginLeft: spacing.xl },
    mlXxl: { marginLeft: spacing.xxl },

    // Margin 单方向 - Right
    mrXs: { marginRight: spacing.xs },
    mrSm: { marginRight: spacing.sm },
    mrMd: { marginRight: spacing.md },
    mrLg: { marginRight: spacing.lg },
    mrXl: { marginRight: spacing.xl },
    mrXxl: { marginRight: spacing.xxl },
  };
}

// 创建尺寸样式的辅助函数
function createSizeStyles(): SizeStyles {
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

  return {
    // 宽度样式
    w0: { width: 0 },
    wXs: { width: 40 },
    wSm: { width: 80 },
    wMd: { width: 120 },
    wLg: { width: 160 },
    wXl: { width: 200 },
    wFull: { width: '100%' },
    wScreen: { width: screenWidth },

    // 高度样式
    h0: { height: 0 },
    hXs: { height: 40 },
    hSm: { height: 80 },
    hMd: { height: 120 },
    hLg: { height: 160 },
    hXl: { height: 200 },
    hFull: { height: '100%' },
    hScreen: { height: screenHeight },

    // 最小宽度样式
    minW0: { minWidth: 0 },
    minWFull: { minWidth: '100%' },

    // 最小高度样式
    minH0: { minHeight: 0 },
    minHFull: { minHeight: '100%' },
    minHScreen: { minHeight: screenHeight },

    // 最大宽度样式
    maxWFull: { maxWidth: '100%' },
    maxWScreen: { maxWidth: screenWidth },

    // 最大高度样式
    maxHFull: { maxHeight: '100%' },
    maxHScreen: { maxHeight: screenHeight },
  };
}

// 浅色基础主题（用户可修改部分）
export const lightBaseTheme: BaseTheme = {
  colors: {
    // 主色调
    primary: '#007AFF',
    primaryLight: '#4DA3FF',
    primaryDark: '#0056CC',

    // 辅助色
    secondary: '#5856D6',
    secondaryLight: '#7B7AE8',
    secondaryDark: '#3F3EA3',

    // 背景色
    background: '#FFFFFF',
    surface: '#F8F9FA',
    card: '#FFFFFF',

    // 文本色
    text: '#1C1C1E',
    textSecondary: '#6C6C70',
    textDisabled: '#C7C7CC',

    // 状态色
    success: '#34C759',
    warning: '#FF9500',
    error: '#FF3B30',
    info: '#007AFF',

    // 边框和分割线
    border: '#E5E5EA',
    divider: '#F2F2F7',

    // 透明度变体
    overlay: 'rgba(0, 0, 0, 0.5)',
    shadow: 'rgba(0, 0, 0, 0.1)',
  },

  navigation: {
    height: 60,
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E5EA',
    shadowColor: 'rgba(0, 0, 0, 0.1)',

    titleColor: '#1C1C1E',
    titleSize: 17,
    titleWeight: '600',

    iconColor: '#6C6C70',
    iconActiveColor: '#007AFF',
    iconSize: 24,

    labelColor: '#6C6C70',
    labelActiveColor: '#007AFF',
    labelSize: 12,
    labelWeight: '500',

    badgeBackgroundColor: '#FF3B30',
    badgeTextColor: '#FFFFFF',
    badgeSize: 16,
  },

  text: {
    h1: { fontSize: 32, fontWeight: '700', color: '#1C1C1E', lineHeight: 40 },
    h2: { fontSize: 28, fontWeight: '600', color: '#1C1C1E', lineHeight: 36 },
    h3: { fontSize: 24, fontWeight: '600', color: '#1C1C1E', lineHeight: 32 },
    h4: { fontSize: 20, fontWeight: '600', color: '#1C1C1E', lineHeight: 28 },
    h5: { fontSize: 18, fontWeight: '600', color: '#1C1C1E', lineHeight: 24 },
    h6: { fontSize: 16, fontWeight: '600', color: '#1C1C1E', lineHeight: 22 },

    body1: { fontSize: 16, fontWeight: '400', color: '#1C1C1E', lineHeight: 24 },
    body2: { fontSize: 14, fontWeight: '400', color: '#1C1C1E', lineHeight: 20 },

    caption: { fontSize: 12, fontWeight: '400', color: '#6C6C70', lineHeight: 16 },
    overline: { fontSize: 10, fontWeight: '500', color: '#6C6C70', lineHeight: 14, textTransform: 'uppercase' },

    button: { fontSize: 16, fontWeight: '600', color: '#FFFFFF' },

    link: { fontSize: 16, fontWeight: '400', color: '#007AFF', textDecorationLine: 'underline' },
  },

  button: {
    primary: {
      backgroundColor: '#007AFF',
      textColor: '#FFFFFF',
      borderWidth: 1,
      borderColor: '#007AFF',
      borderRadius: 8,
      height: 48,
      paddingHorizontal: 24,
      fontSize: 16,
      fontWeight: '600',
    },
    secondary: {
      backgroundColor: '#F8F9FA',
      textColor: '#1C1C1E',
      borderColor: '#E5E5EA',
      borderRadius: 8,
      height: 48,
      paddingHorizontal: 24,
      fontSize: 16,
      fontWeight: '600',
    },
    outline: {
      backgroundColor: 'transparent',
      textColor: '#007AFF',
      borderColor: '#007AFF',
      borderRadius: 8,
      height: 48,
      paddingHorizontal: 24,
      fontSize: 16,
      fontWeight: '600',
    },
    text: {
      backgroundColor: 'transparent',
      textColor: '#007AFF',
      borderColor: 'transparent',
      borderRadius: 8,
      height: 48,
      paddingHorizontal: 16,
      fontSize: 16,
      fontWeight: '600',
    },
    disabled: {
      backgroundColor: '#F8F9FA',
      textColor: '#C7C7CC',
      borderColor: '#E5E5EA',
    },
  },

  input: {
    default: {
      backgroundColor: '#FFFFFF',
      borderColor: '#E5E5EA',
      borderRadius: 8,
      borderWidth: 1,
      height: 48,
      paddingHorizontal: 16,
      paddingVertical: 12,
      fontSize: 16,
      textColor: '#1C1C1E',
      placeholderColor: '#C7C7CC',
    },
    focused: {
      borderColor: '#007AFF',
      borderWidth: 2,
      shadowColor: 'rgba(0, 122, 255, 0.2)',
    },
    error: {
      borderColor: '#FF3B30',
      backgroundColor: '#FFF5F5',
    },
    disabled: {
      backgroundColor: '#F8F9FA',
      textColor: '#C7C7CC',
      borderColor: '#E5E5EA',
    },
    label: {
      fontSize: 14,
      fontWeight: '500',
      color: '#1C1C1E',
      marginBottom: 8,
    },
    helperText: {
      fontSize: 12,
      color: '#6C6C70',
      marginTop: 4,
    },
    errorText: {
      fontSize: 12,
      color: '#FF3B30',
      marginTop: 4,
    },
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },

  borderRadius: {
    xs: 2,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    round: 999,
  },

  shadow: {
    small: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 4,
    },
    large: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 8,
    },
  },
};

// 深色基础主题
export const darkBaseTheme: BaseTheme = {
  ...lightBaseTheme,
  colors: {
    ...lightBaseTheme.colors,
    // 主色调
    primary: '#0A84FF',
    primaryLight: '#4DA3FF',
    primaryDark: '#0056CC',

    // 背景色
    background: '#000000',
    surface: '#1C1C1E',
    card: '#2C2C2E',

    // 文本色
    text: '#FFFFFF',
    textSecondary: '#8E8E93',
    textDisabled: '#48484A',

    // 边框和分割线
    border: '#38383A',
    divider: '#2C2C2E',

    // 透明度变体
    overlay: 'rgba(0, 0, 0, 0.7)',
    shadow: 'rgba(0, 0, 0, 0.3)',
  },

  navigation: {
    ...lightBaseTheme.navigation,
    backgroundColor: '#1C1C1E',
    borderColor: '#38383A',
    titleColor: '#FFFFFF',
    iconColor: '#8E8E93',
    iconActiveColor: '#0A84FF',
    labelColor: '#8E8E93',
    labelActiveColor: '#0A84FF',
  },

  text: {
    h1: { ...lightBaseTheme.text.h1, color: '#FFFFFF' },
    h2: { ...lightBaseTheme.text.h2, color: '#FFFFFF' },
    h3: { ...lightBaseTheme.text.h3, color: '#FFFFFF' },
    h4: { ...lightBaseTheme.text.h4, color: '#FFFFFF' },
    h5: { ...lightBaseTheme.text.h5, color: '#FFFFFF' },
    h6: { ...lightBaseTheme.text.h6, color: '#FFFFFF' },
    body1: { ...lightBaseTheme.text.body1, color: '#FFFFFF' },
    body2: { ...lightBaseTheme.text.body2, color: '#FFFFFF' },
    caption: { ...lightBaseTheme.text.caption, color: '#8E8E93' },
    overline: { ...lightBaseTheme.text.overline, color: '#8E8E93' },
    button: { ...lightBaseTheme.text.button, color: '#FFFFFF' },
    link: { ...lightBaseTheme.text.link, color: '#0A84FF' },
  },

  button: {
    ...lightBaseTheme.button,
    secondary: {
      ...lightBaseTheme.button.secondary,
      backgroundColor: '#2C2C2E',
      textColor: '#FFFFFF',
      borderColor: '#38383A',
    },
    outline: {
      ...lightBaseTheme.button.outline,
      textColor: '#0A84FF',
      borderColor: '#0A84FF',
    },
    text: {
      ...lightBaseTheme.button.text,
      textColor: '#0A84FF',
    },
    disabled: {
      ...lightBaseTheme.button.disabled,
      backgroundColor: '#2C2C2E',
      textColor: '#48484A',
      borderColor: '#38383A',
    },
  },

  input: {
    ...lightBaseTheme.input,
    default: {
      ...lightBaseTheme.input.default,
      backgroundColor: '#2C2C2E',
      borderColor: '#38383A',
      textColor: '#FFFFFF',
      placeholderColor: '#8E8E93',
    },
    focused: {
      ...lightBaseTheme.input.focused,
      borderColor: '#0A84FF',
      shadowColor: 'rgba(10, 132, 255, 0.2)',
    },
    error: {
      ...lightBaseTheme.input.error,
      backgroundColor: '#2C1B1B',
    },
    disabled: {
      ...lightBaseTheme.input.disabled,
      backgroundColor: '#1C1C1E',
      textColor: '#48484A',
      borderColor: '#38383A',
    },
    label: {
      ...lightBaseTheme.input.label,
      color: '#FFFFFF',
    },
    helperText: {
      ...lightBaseTheme.input.helperText,
      color: '#8E8E93',
    },
  },
};

// 创建样式预设的函数
function createStylePresets(baseTheme: BaseTheme): StylePresets {
  return {
    layout: createLayoutStyles(),
    borderRadius: createBorderRadiusStyles(baseTheme.borderRadius),
    shadow: createShadowStyles(),
    border: createBorderStyles(baseTheme.colors),
    spacing: createSpacingStyles(baseTheme.spacing),
    size: createSizeStyles(),
  };
}

// 创建完整主题的函数
function createFullTheme(baseTheme: BaseTheme): Theme {
  return {
    ...baseTheme,
    styles: createStylePresets(baseTheme),
  };
}

// 导出完整主题
export const lightTheme: Theme = createFullTheme(lightBaseTheme);
export const darkTheme: Theme = createFullTheme(darkBaseTheme);

// 导出基础主题（向后兼容）
export { lightBaseTheme as lightBase, darkBaseTheme as darkBase };