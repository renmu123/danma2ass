import XMLParser from "fast-xml-parser/src/v5/XMLParser.js";
import JsObjOutputBuilder from "fast-xml-parser/src/v5/OutputBuilders/JsObjBuilder.js";

import AssGenerator from "./assGenerator.js";
import { intToHexColor } from "./utils.js";

import { type Options, type TextDanma, typeEnum } from "./types.js";

/**
 * 解析弹幕数据为对象
 */
const parseXmlObj = (XMLdata: string) => {
  function parseTag(tag: string) {
    const data = jObj?.i?.[tag];

    if (!data) {
      return [];
    }
    if (Array.isArray(data)) {
      return data;
    } else {
      return [data];
    }
  }
  const parser = new XMLParser({
    OutputBuilder: new JsObjOutputBuilder(),
  });
  const jObj = parser.parse(XMLdata);

  let danmuku = parseTag("d");
  let sc = parseTag("sc");
  let guard = parseTag("guard");
  let gift = parseTag("gift");

  danmuku = danmuku.map((item: any) => {
    const aa = JSON.parse(item["@_raw"]);
    return item;
  });

  return { jObj, danmuku, sc, guard, gift };
};

const typeMap = {
  1: typeEnum.R2L,
  2: typeEnum.R2L,
  3: typeEnum.R2L,
  4: typeEnum.BTM,
  5: typeEnum.TOP,
} as const;

function convertXml2Ass(xmlData: string, options: Options = {}) {
  const { danmuku } = parseXmlObj(xmlData);
  const data: TextDanma[] = danmuku.map((item: any) => {
    const [ts, _, type, color]: [string, string, 1 | 2 | 3 | 4 | 5, string] =
      item["@_p"].split(",");

    const parsedTs = parseFloat(ts);
    const text = item["#text"];
    const parsedType = typeMap[type] ?? typeEnum.R2L;
    const parsedColor = intToHexColor(Number(color));

    return { ts: parsedTs, text, type: parsedType, color: parsedColor };
  });

  const generator = new AssGenerator(data, options);
  return generator.convert();
}

export { AssGenerator, convertXml2Ass };
