import IconfontRenderer from './IconfontRenderer';
import { registerIconLibrary, isIconLibraryRegistered } from './Icon';

// 在模块加载时确保注册一次 iconfont 库（渲染时再读取运行时数据）
if (!isIconLibraryRegistered('iconfont')) {
  registerIconLibrary('iconfont', IconfontRenderer as any);
}