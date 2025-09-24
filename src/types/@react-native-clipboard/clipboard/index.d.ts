declare module '@react-native-clipboard/clipboard' {
  export interface ClipboardStatic {
    /**
     * 获取剪贴板中的字符串内容
     */
    getString(): Promise<string>;

    /**
     * 设置剪贴板中的字符串内容
     * @param content 要设置的字符串内容
     */
    setString(content: string): void;

    /**
     * 检查剪贴板是否包含字符串内容
     */
    hasString(): Promise<boolean>;

    /**
     * 检查剪贴板是否包含 URL (仅 iOS)
     */
    hasURL(): Promise<boolean>;

    /**
     * 检查剪贴板是否包含图片
     */
    hasImage(): Promise<boolean>;

    /**
     * 检查剪贴板是否包含数字
     */
    hasNumber(): Promise<boolean>;

    /**
     * 获取剪贴板中的 URL (仅 iOS)
     */
    getURL(): Promise<string>;

    /**
     * 设置剪贴板中的 URL (仅 iOS)
     * @param url 要设置的 URL
     */
    setURL(url: string): void;

    /**
     * 获取剪贴板中的数字
     */
    getNumber(): Promise<number>;

    /**
     * 设置剪贴板中的数字
     * @param number 要设置的数字
     */
    setNumber(number: number): void;

    /**
     * 获取剪贴板中的图片 (PNG 格式)
     */
    getImagePNG(): Promise<string>;

    /**
     * 获取剪贴板中的图片 (JPG 格式)
     */
    getImageJPG(): Promise<string>;

    /**
     * 设置剪贴板中的图片
     * @param imageData base64 编码的图片数据
     */
    setImage(imageData: string): void;

    /**
     * 获取剪贴板中的多个字符串 (仅 iOS)
     */
    getStrings(): Promise<string[]>;

    /**
     * 设置剪贴板中的多个字符串 (仅 iOS)
     * @param strings 字符串数组
     */
    setStrings(strings: string[]): void;

    /**
     * 添加监听器，监听剪贴板内容变化 (仅 iOS)
     * @param callback 回调函数
     */
    addListener(callback: () => void): void;

    /**
     * 移除监听器 (仅 iOS)
     * @param callback 要移除的回调函数
     */
    removeListener(callback: () => void): void;

    /**
     * 移除所有监听器 (仅 iOS)
     */
    removeAllListeners(): void;
  }

  const Clipboard: ClipboardStatic;
  export default Clipboard;

  // 导出类型定义
  export type ClipboardListener = () => void;
  
  export interface ClipboardImageOptions {
    format?: 'png' | 'jpg';
    quality?: number; // 0-1, 仅对 jpg 有效
  }

  export interface ClipboardStringOptions {
    encoding?: 'utf8' | 'base64';
  }
}