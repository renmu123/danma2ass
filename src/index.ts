import { RGB2BGR, decimalToHex, secondsToTimemark } from "./utils.js";

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

interface Options {
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

interface AssLine {
  startTime: number;
  endTime: number;
  style: typeEnum;
  text: string;
  layer: number;
  posY?: number;
}

export default class AssGenerator {
  data: Item[];
  options: Required<Options>;
  occupiedPositions: {
    TOP: AssLine[];
    BTM: AssLine[];
  } = {
    TOP: [],
    BTM: [],
  };

  constructor(data: Item[], options: Options) {
    const defaultOptions = {
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
      margin: 20,
    };
    this.options = Object.assign(defaultOptions, options);

    this.data = this.preHandle(data);
  }

  preHandle(data: Item[]) {
    return data.toSorted((a, b) => a.ts - b.ts);
  }

  convert() {
    const assLines: string[] = [];
    const baseAss = this.generateBaseAss();

    for (const item of this.data) {
      let assLine: AssLine;
      switch (item.type) {
        case typeEnum.R2L:
          assLine = this.generateMoveLine(item);
          break;
        case typeEnum.TOP:
          assLine = this.generateTopLine(item);
          this.occupiedPositions.TOP.push(assLine);
          break;
        case typeEnum.BTM:
          assLine = this.generateBottomLine(item);
          this.occupiedPositions.BTM.push(assLine);
          break;
      }
      assLines.push(this.generateAssLine(assLine));
    }

    this.occupiedPositions.TOP = [];
    this.occupiedPositions.BTM = [];

    return baseAss + assLines.join("\n");
  }

  /**
   * @description 生成滚动弹幕
   */
  generateMoveLine(item: Item): AssLine {
    const { width } = this.measureText(item.text);
    const color = this.convertColor(item.color);
    const startPosX = this.options.width + 10;
    const endPosX = -(width + item.text.length);

    const posY = 1;

    const text = `{\\move(${startPosX},${posY},${endPosX},${posY})}${color}${item.text}`;
    return {
      startTime: item.ts,
      endTime: item.ts + this.options.scrollDuration,
      style: item.type,
      text,
      layer: 0,
    };
  }

  /**
   * @description 生成顶部固定弹幕
   */
  generateTopLine(item: Item): AssLine {
    const { width } = this.measureText(item.text);
    const posX = (this.options.width - width) / 2;
    const startTime = item.ts;
    const endTime = item.ts + this.options.fixedDuration;
    let posY = 0;

    const color = this.convertColor(item.color);

    // 确定不冲突的位置
    while (
      this.occupiedPositions.TOP.some(
        (pos) =>
          Math.abs(pos.posY - posY) < this.lineDistance &&
          this.isTimeOverlap(pos, startTime, endTime)
      )
    ) {
      posY += this.lineDistance;
    }

    // 删除已经处理过且不再冲突的数据
    this.occupiedPositions.TOP = this.occupiedPositions.TOP.filter(
      (pos) => pos.endTime > startTime
    );
    // console.log(111, { occupiedPositions });

    const text = `{\\pos(${posX},${posY})}${color}${item.text}`;
    return {
      startTime: startTime,
      endTime: endTime,
      style: item.type,
      text,
      layer: 1,
      posY: posY, // 记录位置
    };
  }

  /**
   * @description 生成底部固定弹幕
   */
  generateBottomLine(item: Item): AssLine {
    const { width } = this.measureText(item.text);
    const posX = (this.options.width - width) / 2;
    const startTime = item.ts;
    const endTime = item.ts + this.options.fixedDuration;
    let posY = this.options.height - this.lineDistance;

    const color = this.convertColor(item.color);

    // 确定不冲突的位置
    while (
      this.occupiedPositions.BTM.some(
        (pos) =>
          Math.abs(pos.posY - posY) < this.lineDistance &&
          this.isTimeOverlap(pos, startTime, endTime)
      )
    ) {
      posY -= this.lineDistance;
    }

    // 删除已经处理过且不再冲突的数据
    this.occupiedPositions.BTM = this.occupiedPositions.BTM.filter(
      (pos) => pos.endTime > startTime
    );

    const text = `{\\pos(${posX},${posY})}${color}${item.text}`;
    return {
      startTime: startTime,
      endTime: endTime,
      style: item.type,
      text,
      layer: 1,
      posY: posY, // 记录位置
    };
  }

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
    return { width: text.length * 16, height: this.lineDistance };
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
    const bold = this.options.bold ? 1 : 0;
    const italic = this.options.italic ? 1 : 0;
    const underline = this.options.underline ? 1 : 0;
    const opacity = decimalToHex(this.options.opacity);
    const primaryColour = `&H${opacity}FFFFFF`;
    const shadow = this.options.shadow;
    const outline = this.options.outline;

    const scriptInfo = `[Script Info]
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

Style: R2L,${this.options.fontname},${this.options.fontsize},${primaryColour},&H00FFFFFF,&H00000000,&H1E6A5149,${bold},${italic},${underline},0,100.00,100.00,0.00,0.00,1,${shadow},${outline},8,0,0,0,1
Style: L2R,${this.options.fontname},${this.options.fontsize},${primaryColour},&H00FFFFFF,&H00000000,&H1E6A5149,${bold},${italic},${underline},0,100.00,100.00,0.00,0.00,1,${shadow},${outline},8,0,0,0,1
Style: TOP,${this.options.fontname},${this.options.fontsize},${primaryColour},&H00FFFFFF,&H00000000,&H1E6A5149,${bold},${italic},${underline},0,100.00,100.00,0.00,0.00,1,${shadow},${outline},8,0,0,0,1
Style: BTM,${this.options.fontname},${this.options.fontsize},${primaryColour},&H00FFFFFF,&H00000000,&H1E6A5149,${bold},${italic},${underline},0,100.00,100.00,0.00,0.00,1,${shadow},${outline},8,0,0,0,1
Style: SP,${this.options.fontname},${this.options.fontsize},${primaryColour},&H00FFFFFF,&H00000000,&H1E6A5149,${bold},${italic},${underline},0,100.00,100.00,0.00,0.00,1,${shadow},${outline},7,0,0,0,1
Style: MSG,${this.options.fontname},${this.options.fontsize},${primaryColour},&H00FFFFFF,&H00000000,&H1E6A5149,${bold},${italic},${underline},0,100.00,100.00,0.00,0.00,1,0.0,0.9,7,0,0,0,1
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
    return 20;
  }

  /**
   * @description 弹幕距离
   */
  get lineDistance() {
    return this.lineHeight + this.margin;
  }
}
