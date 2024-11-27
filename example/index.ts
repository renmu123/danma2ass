import fs from "node:fs";
import { convertXml2Ass } from "../src/index.js";

// 获取命令行参数中的文件名
const inputFileName = process.argv[2];
const outputFileName = process.argv[3] || "output.ass";

if (!inputFileName) {
  console.error("请提供输入文件名");
  process.exit(1);
}

const xmlData = fs.readFileSync(inputFileName, "utf-8");
const ass = convertXml2Ass(xmlData, {});

fs.writeFileSync(outputFileName, ass);
