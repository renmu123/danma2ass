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
  const millisecondsStr = milliseconds.toString().padStart(3, "0");

  return `${hoursStr}:${minutesStr}:${secondsStr}.${millisecondsStr}`;
}
