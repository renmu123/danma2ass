import { XMLParser } from "fast-xml-parser";
import AssGenerator from "./assGenerator.js";
import { intToHexColor } from "./utils.js";

import {
  type Options,
  type Danma,
  type CommonDanma,
  typeEnum,
} from "./types.js";

const traversalObject = (
  obj: any,
  callback: (key: string, value: any) => any
) => {
  for (const key in obj) {
    if (typeof obj[key] === "object" && !Array.isArray(obj[key])) {
      traversalObject(obj[key], callback);
    } else {
      callback(key, obj[key]);
    }
  }
};

/**
 * 解析弹幕数据为对象
 */
export const parseXmlObj = (XMLdata: string) => {
  const parser = new XMLParser({
    ignoreAttributes: false,
    parseTagValue: false,
    isArray: (name) => {
      if (["d", "gift", "guard", "sc"].includes(name)) return true;
      return false;
    },
  });
  const jObj = parser.parse(XMLdata);

  let danmuku = [];
  let sc = [];
  let guard = [];
  let gift = [];

  traversalObject(jObj, (key, value) => {
    if (key === "d") {
      danmuku = value;
    } else if (key === "sc") {
      sc = value;
    } else if (key === "guard") {
      guard = value;
    } else if (key === "gift") {
      gift = value;
    }
  });

  return { jObj, danmuku, sc, guard, gift };
};

const typeMap = {
  1: typeEnum.R2L,
  2: typeEnum.R2L,
  3: typeEnum.R2L,
  4: typeEnum.BTM,
  5: typeEnum.TOP,
};

export function convertXml2Ass(xmlData: string, options: Options = {}) {
  const { danmuku } = parseXmlObj(xmlData);
  const data: CommonDanma[] = danmuku.map((item: any) => {
    const [ts, _, type, color]: [string, string, 1 | 2 | 3 | 4 | 5, string] =
      item["@_p"].split(",");
    const parsedTs = parseFloat(ts);
    const text = item["#text"];
    const parsedType = typeMap[type] ?? typeEnum.R2L;
    const parsedColor = `${intToHexColor(Number(color))}`;

    return { ts: parsedTs, text, type: parsedType, color: parsedColor };
  });

  // @ts-ignore
  const generator = new AssGenerator(data, options);
  return generator.convert();
}
