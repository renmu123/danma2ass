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
  /** 礼物名称 */
  giftName: string;
  /** 礼物数量 */
  giftCount: number;
  /** 赠送人 */
  sender: string;
  /** 礼物类型 */
  giftType: GiftTypeEnum;
}

export type Danma = TextDanma | GiftDanma;
export type DanmaKu = Array<Danma>;

type pxWithPercent = string | number;

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
  /** 滚动弹幕距离顶部和底部距离，你可以指定像素或者使用百分比 */
  scrollLimit?: [pxWithPercent, pxWithPercent];
  /** 屏蔽类型 */
  blockType?: typeEnum[];
  /** 礼物框配置 */
  giftConfig?: {
    blockType?: GiftTypeEnum[];
    width?: number;
    height?: number;
    posX?: number;
    posY?: number;
    duration?: number;
    minPrice?: number;
  };
}

export interface AssLine {
  startTime: number;
  endTime: number;
  style: typeEnum;
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
