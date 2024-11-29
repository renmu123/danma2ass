import {
  RGB2BGR,
  decimalToHex,
  secondsToTimemark,
  defaultsDeep,
  parsePercentage,
} from "./utils.js";

import { typeEnum } from "./types.js";
import type {
  Danma,
  DanmaKu,
  Options,
  AssLine,
  AllOptional,
  DeepRequired,
} from "./types.js";

export default class AssGenerator {
  data: DanmaKu;
  options: Required<Options>;
  // 记录当前屏幕上的弹幕
  occupiedPositions: {
    FIXED: AssLine[];
    R2L: AssLine[];
  } = {
    FIXED: [],
    R2L: [],
  };

  constructor(data: DanmaKu, options: Options) {
    const defaultOptions: DeepRequired<AllOptional<Options>> = {
      scrollDuration: 12,
      fixedDuration: 5,
      width: 1920,
      height: 1080,
      timeshift: 0,
      fontname: "微软雅黑",
      fontsize: 40,
      bold: false,
      italic: false,
      underline: false,
      opacity: 0,
      shadow: 0.0,
      outline: 0.0,
      margin: 12,
      blockType: [],
      density: 1,
      scrollLimit: [0, 0],
      fixedLimit: [0, 0],
      giftConfig: {
        width: 1920,
        height: 500,
        posX: 20,
        posY: 0,
        duration: 5,
        minPrice: 0,
        blockType: [],
      },
    };
    this.options = defaultsDeep(defaultOptions, options);

    this.data = this.preHandle(data);
  }

  preHandle(data: DanmaKu) {
    return data.toSorted((a, b) => a.ts - b.ts);
  }

  convert() {
    const assLines: string[] = [];
    const baseAss = this.generateBaseAss();

    for (const item of this.data) {
      let assLine: AssLine | null = null;
      switch (item.type) {
        case typeEnum.R2L:
          if (this.options.blockType.includes(typeEnum.R2L)) {
            continue;
          }
          assLine = this.generateMoveLine(item);
          if (!assLine) continue;

          assLines.push(this.generateAssLine(assLine));
          break;
        case typeEnum.TOP:
          if (this.options.blockType.includes(typeEnum.TOP)) {
            continue;
          }
          assLine = this.generateTopLine(item);
          if (!assLine) continue;

          assLines.push(this.generateAssLine(assLine));
          break;
        case typeEnum.BTM:
          if (this.options.blockType.includes(typeEnum.BTM)) {
            continue;
          }
          assLine = this.generateBottomLine(item);
          if (!assLine) continue;

          assLines.push(this.generateAssLine(assLine));
          break;
        case typeEnum.GIFT:
          if (this.options.blockType.includes(typeEnum.GIFT)) {
            continue;
          }
          // assLine = this.generateGiftLine(item);
          break;
      }
    }

    this.occupiedPositions.FIXED = [];
    this.occupiedPositions.R2L = [];

    return baseAss + assLines.join("\n");
  }

  /**
   * @description 获取滚动弹幕的限制范围
   */
  getLimit(type: "scroll" | "fixed"): [number, number] {
    const [startPosYLimit, endPosYLimit] =
      type === "scroll" ? this.options.scrollLimit : this.options.fixedLimit;

    let startPosY = 1;
    if (typeof startPosYLimit === "string") {
      startPosY += Math.round(
        this.options.height * parsePercentage(startPosYLimit)
      );
    } else {
      startPosY += startPosYLimit;
    }

    let endPosY = this.options.height - this.lineDistance;
    if (typeof endPosYLimit === "string") {
      endPosY -= Math.round(
        this.options.height * parsePercentage(endPosYLimit)
      );
    } else {
      endPosY -= endPosYLimit;
    }

    return [startPosY, endPosY];
  }

  /**
   * @description 生成滚动弹幕
   */
  generateMoveLine(item: Danma): AssLine | null {
    const isTimeOverlap = (pos: AssLine, startTime: number) => {
      return Math.abs(pos.startTime - startTime) < 1.5;
    };

    const startTime = item.ts;
    const endTime = item.ts + this.options.scrollDuration;
    const { width } = this.measureText(item.text);
    const color = this.convertColor(item.color);
    const startPosX = this.options.width + 10 + width;
    const endPosX = -(width + item.text.length);
    const [startPosY, endPosY] = this.getLimit("scroll");
    let posY = startPosY;

    // 删除不在当前屏幕上的数据
    this.occupiedPositions.R2L = this.occupiedPositions.R2L.filter(
      (pos) => pos.endTime > item.ts
    );

    // 确定位置
    while (
      this.occupiedPositions.R2L.some(
        (pos) =>
          Math.abs(pos.posY - posY) < this.lineDistance &&
          isTimeOverlap(pos, startTime)
      )
    ) {
      posY += this.lineDistance;

      // 超过了密度上限
      if (posY > endPosY) {
        if (this.options.density === 1) {
          // 清空屏内弹幕
          this.occupiedPositions.R2L = [];
          break;
        } else if (this.options.density === 2) {
          return null;
        } else {
          throw new Error("not support density");
        }
      }
    }

    const text = `{\\move(${startPosX},${posY},${endPosX},${posY})}${color}${item.text}`;
    const assLine = {
      startTime: item.ts,
      endTime: endTime,
      style: item.type,
      text,
      layer: 0,
      posY: posY,
    };
    this.occupiedPositions.R2L.push(assLine);

    return assLine;
  }

  /**
   * @description 生成顶部固定弹幕
   */
  generateTopLine(item: Danma): AssLine | null {
    const posX = this.options.width / 2;
    const startTime = item.ts;
    const endTime = item.ts + this.options.fixedDuration;
    const [startPosY, endPosY] = this.getLimit("fixed");
    const color = this.convertColor(item.color);
    let posY = startPosY;

    // 删除不在当前屏幕上的数据
    this.occupiedPositions.FIXED = this.occupiedPositions.FIXED.filter(
      (pos) => pos.endTime > startTime
    );

    // 确定位置
    while (
      this.occupiedPositions.FIXED.some(
        (pos) => Math.abs(pos.posY - posY) < this.lineDistance
      )
    ) {
      posY += this.lineDistance;
      // 超过了密度上限
      if (posY > endPosY) {
        if (this.options.density === 1) {
          // 清空屏内弹幕
          this.occupiedPositions.FIXED = [];
          break;
        } else if (this.options.density === 2) {
          return null;
        } else {
          throw new Error("not support density");
        }
      }
    }

    const text = `{\\pos(${posX},${posY})}${color}${item.text}`;
    const assLine = {
      startTime: startTime,
      endTime: endTime,
      style: item.type,
      text,
      layer: 1,
      posY: posY, // 记录位置
    };
    this.occupiedPositions.FIXED.push(assLine);

    return assLine;
  }

  /**
   * @description 生成底部固定弹幕
   */
  generateBottomLine(item: Danma): AssLine | null {
    const posX = this.options.width / 2;
    const startTime = item.ts;
    const endTime = item.ts + this.options.fixedDuration;
    const [startPosY, endPosY] = this.getLimit("fixed");
    const color = this.convertColor(item.color);

    let posY = endPosY - this.lineDistance;

    // 删除不在当前屏幕上的数据
    this.occupiedPositions.FIXED = this.occupiedPositions.FIXED.filter(
      (pos) => pos.endTime > startTime
    );

    // 确定位置
    while (
      this.occupiedPositions.FIXED.some(
        (pos) => Math.abs(pos.posY - posY) < this.lineDistance
      )
    ) {
      posY -= this.lineDistance;
      // 超过了密度上限
      if (posY < startPosY) {
        if (this.options.density === 1) {
          // 清空屏内弹幕
          this.occupiedPositions.FIXED = [];
          break;
        } else if (this.options.density === 2) {
          return null;
        } else {
          throw new Error("not support density");
        }
      }
    }

    const text = `{\\pos(${posX},${posY})}${color}${item.text}`;
    const assLine = {
      startTime: startTime,
      endTime: endTime,
      style: item.type,
      text,
      layer: 1,
      posY: posY, // 记录位置
    };
    this.occupiedPositions.FIXED.push(assLine);

    return assLine;
  }

  /**
   * @description 生成礼物弹幕
   */
  // generateGiftLine(item: Danma): AssLine[] {}

  /**
   * @description 判断两个时间段是否有重叠
   */
  isTimeOverlap(pos: AssLine, startTime: number, endTime: number): boolean {
    return !(endTime <= pos.startTime || startTime >= pos.endTime);
  }

  /**
   * @description 转换颜色
   */
  convertColor(color?: string) {
    if (color) {
      const bgrColor = RGB2BGR(color);
      if (bgrColor === "#FFFFFF") {
        return "";
      }
      const opacity = decimalToHex(this.options.opacity);
      return `{\\c&H${opacity}${bgrColor.replace("#", "")}}`;
    } else {
      return "";
    }
  }

  /**
   * @description 测量文本宽度
   */
  measureText(text: string) {
    return {
      width: text.length * Math.floor((this.options.fontsize / 2) * 1.0),
      height: this.lineDistance,
    };
  }

  /**
   * @description 生成ass行
   */
  generateAssLine(options: {
    startTime: number;
    endTime: number;
    style: typeEnum;
    text: string;
    layer: number;
  }) {
    const { startTime, endTime, style, text, layer } = options;

    let shiftStartTime = startTime + this.options.timeshift;
    let shiftEndTime = endTime + this.options.timeshift;
    if (shiftStartTime < 0) {
      shiftStartTime = 0;
      shiftEndTime = endTime;
    }

    const startTimemark = secondsToTimemark(shiftStartTime);
    const endTimemark = secondsToTimemark(shiftEndTime);

    return `Dialogue: ${layer},${startTimemark},${endTimemark},${style},,0000,0000,0000,,${text}`;
  }

  /**
   * @description 生成ass头
   */
  generateBaseAss() {
    const bold = this.options.bold ? -1 : 0;
    const italic = this.options.italic ? -1 : 0;
    const underline = this.options.underline ? -1 : 0;
    const opacity = decimalToHex(this.options.opacity);
    const primaryColour = `&H${opacity}FFFFFF`;
    const outlineColour = `&H00000000`;
    const backColour = `&H1E6A5149`;

    const shadow = this.options.shadow;
    const outline = this.options.outline;

    const scriptInfo = `[Script Info]
; Script generated by https://github.com/renmu123/danma2ass
ScriptType: v4.00+
Collisions: Normal
PlayResX: ${this.options.width}
PlayResY: ${this.options.height}
Timer: 100.0000
WrapStyle: 2
ScaledBorderAndShadow: yes

`;

    const v4Styles = `[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding

Style: R2L,${this.options.fontname},${this.options.fontsize},${primaryColour},&H00FFFFFF,${outlineColour},${backColour},${bold},${italic},${underline},0,100.00,100.00,0.00,0.00,1,${outline},${shadow},8,0,0,0,1
Style: L2R,${this.options.fontname},${this.options.fontsize},${primaryColour},&H00FFFFFF,${outlineColour},${backColour},${bold},${italic},${underline},0,100.00,100.00,0.00,0.00,1,${outline},${shadow},8,0,0,0,1
Style: TOP,${this.options.fontname},${this.options.fontsize},${primaryColour},&H00FFFFFF,${outlineColour},${backColour},${bold},${italic},${underline},0,100.00,100.00,0.00,0.00,1,${outline},${shadow},8,0,0,0,1
Style: BTM,${this.options.fontname},${this.options.fontsize},${primaryColour},&H00FFFFFF,${outlineColour},${backColour},${bold},${italic},${underline},0,100.00,100.00,0.00,0.00,1,${outline},${shadow},8,0,0,0,1
Style: MSG,${this.options.fontname},${this.options.fontsize},${primaryColour},&H00FFFFFF,${outlineColour},${backColour},${bold},${italic},${underline},0,100.00,100.00,0.00,0.00,1,0.0,0.9,7,0,0,0,1

`;

    const events = `[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
`;

    return scriptInfo + v4Styles + events;
  }

  /**
   * @description 弹幕间距
   */
  get margin() {
    return this.options.margin;
  }

  /**
   * @description 弹幕高度
   */
  get lineHeight() {
    return Math.floor((this.options.fontsize / 2) * 1.4);
  }

  /**
   * @description 弹幕距离
   */
  get lineDistance() {
    return this.lineHeight + this.margin;
  }
}
