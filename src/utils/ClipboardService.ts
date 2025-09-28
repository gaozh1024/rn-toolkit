// import Clipboard from '@react-native-clipboard/clipboard';

// export interface ClipboardOptions {
//   showToast?: boolean;
//   toastMessage?: string;
//   onSuccess?: (text: string) => void;
//   onError?: (error: Error) => void;
// }

// class ClipboardService {
//   /**
//    * 复制文本到剪贴板
//    * @param text 要复制的文本
//    * @param options 配置选项
//    */
//   static async copyToClipboard(
//     text: string, 
//     options: ClipboardOptions = {}
//   ): Promise<boolean> {
//     try {
//       await Clipboard.setString(text);
      
//       if (options.onSuccess) {
//         options.onSuccess(text);
//       }
      
//       if (options.showToast) {
//         // 这里可以集成Toast组件
//         console.log(options.toastMessage || '已复制到剪贴板');
//       }
      
//       return true;
//     } catch (error) {
//       const err = error as Error;
      
//       if (options.onError) {
//         options.onError(err);
//       }
      
//       console.error('复制到剪贴板失败:', err);
//       return false;
//     }
//   }

//   /**
//    * 从剪贴板读取文本
//    * @param options 配置选项
//    */
//   static async getFromClipboard(
//     options: Omit<ClipboardOptions, 'toastMessage'> = {}
//   ): Promise<string | null> {
//     try {
//       const text = await Clipboard.getString();
      
//       if (options.onSuccess) {
//         options.onSuccess(text);
//       }
      
//       return text;
//     } catch (error) {
//       const err = error as Error;
      
//       if (options.onError) {
//         options.onError(err);
//       }
      
//       console.error('从剪贴板读取失败:', err);
//       return null;
//     }
//   }

//   /**
//    * 检查剪贴板是否有内容
//    */
//   static async hasString(): Promise<boolean> {
//     try {
//       const result = await Clipboard.hasString();
//       return result ?? false;
//     } catch {
//       return false;
//     }
//   }

//   /**
//    * 清空剪贴板
//    */
//   static async clearClipboard(): Promise<boolean> {
//     try {
//       await Clipboard.setString('');
//       return true;
//     } catch (error) {
//       console.error('清空剪贴板失败:', error);
//       return false;
//     }
//   }

//   /**
//    * 复制对象到剪贴板（JSON格式）
//    * @param obj 要复制的对象
//    * @param options 配置选项
//    */
//   static async copyObjectToClipboard(
//     obj: any,
//     options: ClipboardOptions = {}
//   ): Promise<boolean> {
//     try {
//       const jsonString = JSON.stringify(obj, null, 2);
//       return await this.copyToClipboard(jsonString, options);
//     } catch (error) {
//       console.error('复制对象到剪贴板失败:', error);
//       return false;
//     }
//   }

//   /**
//    * 从剪贴板读取JSON对象
//    * @param options 配置选项
//    */
//   static async getObjectFromClipboard<T = any>(
//     options: Omit<ClipboardOptions, 'toastMessage'> = {}
//   ): Promise<T | null> {
//     try {
//       const text = await this.getFromClipboard(options);
//       if (!text) return null;
      
//       return JSON.parse(text) as T;
//     } catch (error) {
//       console.error('从剪贴板解析JSON失败:', error);
//       return null;
//     }
//   }

//   /**
//    * 检查剪贴板是否包含URL (仅iOS)
//    */
//   static async hasURL(): Promise<boolean> {
//     try {
//       const result = await Clipboard.hasURL();
//       return result ?? false;
//     } catch {
//       return false;
//     }
//   }

//   /**
//    * 检查剪贴板是否包含图片
//    */
//   static async hasImage(): Promise<boolean> {
//     try {
//       const result = await Clipboard.hasImage();
//       return result ?? false;
//     } catch {
//       return false;
//     }
//   }

//   /**
//    * 检查剪贴板是否包含数字 (仅iOS 14+)
//    */
//   static async hasNumber(): Promise<boolean> {
//     try {
//       const result = await Clipboard.hasNumber();
//       return result ?? false;
//     } catch {
//       return false;
//     }
//   }

//   /**
//    * 检查剪贴板内容是否为URL格式
//    * 这是一个自定义实现，用于替代不存在的getURLs方法
//    */
//   static async isClipboardURL(): Promise<boolean> {
//     try {
//       const text = await Clipboard.getString();
//       if (!text) return false;
      
//       // 简单的URL检测正则
//       const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/i;
//       return urlRegex.test(text.trim());
//     } catch {
//       return false;
//     }
//   }

//   /**
//    * 获取剪贴板中的URL（如果内容是URL格式）
//    * 这是一个自定义实现，用于替代不存在的getURLs方法
//    */
//   static async getURLFromClipboard(): Promise<string | null> {
//     try {
//       const text = await Clipboard.getString();
//       if (!text) return null;
      
//       const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/i;
//       if (urlRegex.test(text.trim())) {
//         return text.trim();
//       }
      
//       return null;
//     } catch (error) {
//       console.error('获取URL失败:', error);
//       return null;
//     }
//   }

//   /**
//    * 获取剪贴板中的图片（PNG格式）
//    */
//   static async getImagePNG(): Promise<string | null> {
//     try {
//       return await Clipboard.getImagePNG();
//     } catch (error) {
//       console.error('获取PNG图片失败:', error);
//       return null;
//     }
//   }

//   /**
//    * 获取剪贴板中的图片（JPEG格式）
//    */
//   static async getImageJPG(): Promise<string | null> {
//     try {
//       return await Clipboard.getImageJPG();
//     } catch (error) {
//       console.error('获取JPEG图片失败:', error);
//       return null;
//     }
//   }

//   /**
//    * 设置图片到剪贴板
//    * @param imageData base64格式的图片数据
//    */
//   static async setImage(imageData: string): Promise<boolean> {
//     try {
//       await Clipboard.setImage(imageData);
//       return true;
//     } catch (error) {
//       console.error('设置图片到剪贴板失败:', error);
//       return false;
//     }
//   }

//   /**
//    * 复制多个字符串到剪贴板
//    * @param strings 字符串数组
//    */
//   static async setStrings(strings: string[]): Promise<boolean> {
//     try {
//       await Clipboard.setStrings(strings);
//       return true;
//     } catch (error) {
//       console.error('设置多个字符串到剪贴板失败:', error);
//       return false;
//     }
//   }

//   /**
//    * 获取剪贴板中的多个字符串
//    */
//   static async getStrings(): Promise<string[]> {
//     try {
//       return await Clipboard.getStrings();
//     } catch (error) {
//       console.error('获取多个字符串失败:', error);
//       return [];
//     }
//   }
// }

// export default ClipboardService;