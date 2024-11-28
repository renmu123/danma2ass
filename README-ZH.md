# 介绍

这是一个将B站 xml 或 json 转换为 ass 的库。

node>=20

# 安装

`npm install danma2ass`

# 使用

```js
import { convertXml2Ass } from "danma2ass";

const ass = convertXml2Ass(xmlData, {});
```

## 参数

```ts
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

enum typeEnum {
  /** 从右至左滚动 */
  R2L = "R2L",
  /** 上方固定 */
  TOP = "TOP",
  /** 下方固定 */
  BTM = "BTM",
  /** 礼物 */
  GIFT = "GIFT",
}

enum GiftTypeEnum {
  /** 礼物 */
  GIFT = "gift",
  /** 舰长 */
  GUARD = "guard",
  /** sc */
  SC = "sc",
}
```

# 开发

```bash
pnpm i
pnpm run dev
pnpm run build
```

# License

MIT
