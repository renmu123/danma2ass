export interface Item {
  /** 相对时间戳 */
  ts: number;
  /** 文字 */
  text: string;
  /** 类型 */
  type: typeEnum;
  /** 弹幕颜色，默认为#FFFFFF */
  color?: string;
}

export const enum typeEnum {
  /** 从右至左滚动 */
  R2L = "R2L",
  /** 上方固定 */
  TOP = "TOP",
  /** 下方固定 */
  BTM = "BTM",
}

export interface Options {
  /** 滚动弹幕持续时间 */
  scrollDuration?: number;
  /** 固定弹幕持续时间 */
  fixedDuration?: number;
  /** 视频宽度 */
  width?: number;
  /** 视频高度 */
  height?: number;
  /** 时间偏移，单位秒 */
  timeshift?: number;
  /** 字体 */
  fontname?: string;
  /** 字体大小 */
  fontsize?: number;
  /** 加粗 */
  bold?: boolean;
  /** 斜体 */
  italic?: boolean;
  /** 下划线 */
  underline?: boolean;
  /** 透明度,0不透明，255全透明 */
  opacity?: number;
  /** 阴影 */
  shadow?: number;
  /** 描边 */
  outline?: number;
  /** 间距 */
  margin?: number;
}

export interface AssLine {
  startTime: number;
  endTime: number;
  style: typeEnum;
  text: string;
  layer: number;
  posY?: number;
}
