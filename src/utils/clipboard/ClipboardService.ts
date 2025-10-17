import Clipboard from '@react-native-clipboard/clipboard';
import { ClipboardOptions } from './types';

class ClipboardService {
  static async copyToClipboard(text: string, options: ClipboardOptions = {}): Promise<boolean> {
    try {
      await Clipboard.setString(text);
      options.onSuccess?.(text);
      if (options.showToast) {
        console.log(options.toastMessage || '已复制到剪贴板');
      }
      return true;
    } catch (error) {
      const err = error as Error;
      options.onError?.(err);
      console.error('复制到剪贴板失败:', err);
      return false;
    }
  }

  static async getFromClipboard(options: Omit<ClipboardOptions, 'toastMessage'> = {}): Promise<string | null> {
    try {
      const text = await Clipboard.getString();
      options.onSuccess?.(text);
      return text;
    } catch (error) {
      const err = error as Error;
      options.onError?.(err);
      console.error('从剪贴板读取失败:', err);
      return null;
    }
  }

  static async hasString(): Promise<boolean> {
    try {
      const result = await Clipboard.hasString();
      return result ?? false;
    } catch {
      return false;
    }
  }

  static async clearClipboard(): Promise<boolean> {
    try {
      await Clipboard.setString('');
      return true;
    } catch (error) {
      console.error('清空剪贴板失败:', error);
      return false;
    }
  }

  static async copyObjectToClipboard(obj: any, options: ClipboardOptions = {}): Promise<boolean> {
    try {
      const jsonString = JSON.stringify(obj, null, 2);
      return await this.copyToClipboard(jsonString, options);
    } catch (error) {
      console.error('复制对象到剪贴板失败:', error);
      return false;
    }
  }

  static async getObjectFromClipboard<T = any>(options: Omit<ClipboardOptions, 'toastMessage'> = {}): Promise<T | null> {
    try {
      const text = await this.getFromClipboard(options);
      if (!text) return null;
      return JSON.parse(text) as T;
    } catch (error) {
      console.error('从剪贴板解析JSON失败:', error);
      return null;
    }
  }

  static async hasURL(): Promise<boolean> {
    try {
      const result = await Clipboard.hasURL();
      return result ?? false;
    } catch {
      return false;
    }
  }

  static async hasImage(): Promise<boolean> {
    try {
      const result = await Clipboard.hasImage();
      return result ?? false;
    } catch {
      return false;
    }
  }

  static async hasNumber(): Promise<boolean> {
    try {
      const result = await Clipboard.hasNumber();
      return result ?? false;
    } catch {
      return false;
    }
  }

  static async isClipboardURL(): Promise<boolean> {
    try {
      const text = await Clipboard.getString();
      if (!text) return false;
      const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/i;
      return urlRegex.test(text.trim());
    } catch {
      return false;
    }
  }

  static async getURLFromClipboard(): Promise<string | null> {
    try {
      const text = await Clipboard.getString();
      if (!text) return null;
      const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/i;
      return urlRegex.test(text.trim()) ? text.trim() : null;
    } catch (error) {
      console.error('获取URL失败:', error);
      return null;
    }
  }

  static async getImagePNG(): Promise<string | null> {
    try {
      return await Clipboard.getImagePNG();
    } catch (error) {
      console.error('获取PNG图片失败:', error);
      return null;
    }
  }

  static async getImageJPG(): Promise<string | null> {
    try {
      return await Clipboard.getImageJPG();
    } catch (error) {
      console.error('获取JPEG图片失败:', error);
      return null;
    }
  }

  static async setImage(imageData: string): Promise<boolean> {
    try {
      await Clipboard.setImage(imageData);
      return true;
    } catch (error) {
      console.error('设置图片到剪贴板失败:', error);
      return false;
    }
  }

  static async setStrings(strings: string[]): Promise<boolean> {
    try {
      const joined = strings.join('\n');
      await Clipboard.setString(joined);
      return true;
    } catch (error) {
      console.error('设置多个字符串失败:', error);
      return false;
    }
  }
}

export default ClipboardService;