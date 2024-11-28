/**
 * RGB转BGR
 * @param rgb RGB颜色
 * @returns BGR颜色
 * @example
 * #ffffff => #ffffff
 */
export function RGB2BGR(rgb: string) {
  return rgb.replace(/#(..)(..)(..)/, "#$3$2$1");
}

/**
 * 将颜色的十六进制字符串转换为整数
 * @param {string} hexColor - 十六进制颜色字符串
 * @returns {number} - 整数表示的颜色
 */
export function hexColorToInt(hexColor: string): number {
  return parseInt(hexColor.replace("#", ""), 16);
}

/**
 * 将整数转换为颜色的十六进制字符串
 * @param {number} int - 整数表示的颜色
 * @returns {string} - 十六进制颜色字符串
 */
export function intToHexColor(int: number): string {
  const hex = int.toString(16).padStart(6, "0").toUpperCase();
  return `#${hex}`;
}

/**
 * 10进制转16进制
 * @param decimal 10进制数
 * @returns 16进制字符串
 * @example
 * 255 => ff
 * 0 => 00
 */
export function decimalToHex(decimal: number): string {
  return decimal.toString(16).padStart(2, "0");
}

/**
 * Convert seconds into hh:mm:ss.xxx timemark
 *
 * @param {String} seconds seconds
 * @return string
 */
export function secondsToTimemark(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const milliseconds = Math.round((seconds - Math.floor(seconds)) * 1000);

  const hoursStr = hours.toString().padStart(2, "0");
  const minutesStr = minutes.toString().padStart(2, "0");
  const secondsStr = secs.toString().padStart(2, "0");
  const millisecondsStr = Math.floor(milliseconds / 10)
    .toString()
    .padStart(2, "0");

  return `${hoursStr}:${minutesStr}:${secondsStr}.${millisecondsStr}`;
}
