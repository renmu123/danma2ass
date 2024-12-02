export const enum typeEnum {
  /** 从右至左滚动 */
  R2L = "R2L",
  /** 上方固定 */
  TOP = "TOP",
  /** 下方固定 */
  BTM = "BTM",
  /** 礼物 */
  GIFT = "GIFT",
}

/**
 * 普通文本弹幕
 */
export interface CommonDanma {
  /** 相对时间戳 */
  ts: number;
  /** 文字 */
  text: string;
  /** 弹幕颜色，默认为#FFFFFF */
  color?: string;
}

export interface TextDanma extends CommonDanma {
  type: typeEnum.R2L | typeEnum.TOP | typeEnum.BTM;
}

export const enum GiftTypeEnum {
  /** 礼物 */
  GIFT = "gift",
  /** 舰长 */
  GUARD = "guard",
  /** sc */
  SC = "sc",
}

/**
 * 礼物弹幕
 */
export interface GiftDanma extends CommonDanma {
  type: typeEnum.GIFT;
  text: "";
  /** 礼物名称 */
  giftName: string;
  /** 礼物数量 */
  giftCount: number;
  /** 赠送人 */
  sender: string;
  /** 礼物类型 */
  giftType: GiftTypeEnum;
  /** 礼物价格 */
  price?: number;
}

export type Danma = TextDanma | GiftDanma;
export type DanmaKu = Array<Danma>;

type pxWithPercent = string | number;

export interface Options {
  /** 滚动弹幕持续时间，默认值：12 */
  scrollDuration?: number;
  /** 固定弹幕持续时间，默认值：5 */
  fixedDuration?: number;
  /** 视频宽度，默认值：1920 */
  width?: number;
  /** 视频高度，默认值：1080 */
  height?: number;
  /** 时间偏移，单位秒，默认值：0 */
  timeshift?: number;
  /** 字体 */
  fontname?: string;
  /** 字体大小，默认值40 */
  fontsize?: number;
  /** 加粗，默认值：false */
  bold?: boolean;
  /** 斜体，默认值：false */
  italic?: boolean;
  /** 下划线，默认值：false */
  underline?: boolean;
  /** 透明度，0不透明，255全透明，默认值：0 */
  opacity?: number;
  /** 阴影，默认值：0 */
  shadow?: number;
  /** 描边，默认值：0 */
  outline?: number;
  /** 间距，默认值：12 */
  margin?: number;
  /** 弹幕密度，1: 无限，2: 不重叠，默认为1 */
  density?: 1 | 2;
  /** 滚动弹幕距离顶部和底部距离，你可以指定像素或者使用百分比，默认值：[0,0] */
  scrollLimit?: [pxWithPercent, pxWithPercent];
  /** 固定弹幕距离顶部和底部距离，你可以指定像素或者使用百分比，默认值：[0,0]  */
  fixedLimit?: [pxWithPercent, pxWithPercent];
  /** 屏蔽类型，默认值[] */
  blockType?: typeEnum[];
  /** 礼物框配置 */
  giftConfig?: {
    /** 屏蔽的礼物类型 */
    blockType?: GiftTypeEnum[];
    /** 礼物框宽度 */
    width?: number;
    /** 礼物框高度 */
    height?: number;
    /** X轴坐标，左下角为原点 */
    posX?: number;
    /** Y轴坐标，左下角为原点 */
    posY?: number;
    /** 持续时间 */
    duration?: number;
    /** 最小价格 */
    minPrice?: number;
  };
}

export interface AssLine {
  startTime: number;
  endTime: number;
  style: typeEnum.BTM | typeEnum.TOP | typeEnum.R2L | "MSG";
  text: string;
  layer: number;
  posY: number;
}

export type AllOptional<T> = {
  [P in keyof T]?: T[P];
};

export type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

export type DeepRequired<T> = {
  [P in keyof T]-?: DeepRequired<T[P]>;
};
