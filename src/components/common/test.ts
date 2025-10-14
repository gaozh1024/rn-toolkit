/**
 * TestableProps 接口：为支持测试的组件提供统一的 testID 可选属性。
 */
export interface TestableProps {
  /**
   * 组件的测试标识符。在自动化测试中用于定位组件。
   */
  testID?: string;
}

/**
 * 构建规范化的 testID。
 *
 * 用途：
 * - 在应用内为组件生成统一命名的测试标识（如统一前缀）。
 * - 避免不同模块/页面的 testID 冲突。
 *
 * 参数：
 * - prefix: 可选的命名前缀（如模块名、页面名）。
 * - id: 具体的标识符（组件内的局部名）。
 *
 * 返回：
 * - 规范化后的 `testID` 字符串；如果 `id` 未提供，则返回 `undefined`。
 */
export function buildTestID(prefix?: string, id?: string): string | undefined {
  if (!id) return undefined;
  if (!prefix) return id;
  return `${prefix}-${id}`;
}