import { describe, it, expect } from "vitest";
import AssGenerator from "../src/assGenerator.js";

import { typeEnum } from "../src/types.js";
import type { Item } from "../src/types.js";

describe("AssGenerator", () => {
  const data: Item[] = [
    { ts: 1, text: "Hello", type: typeEnum.R2L, color: "#FF0000" },
    { ts: 2, text: "World", type: typeEnum.TOP, color: "#00FF00" },
    { ts: 3, text: "Test", type: typeEnum.BTM, color: "#0000FF" },
  ];

  const options = {
    scrollDuration: 10,
    fixedDuration: 5,
    width: 1920,
    height: 1080,
    timeshift: 0,
    fontname: "Arial",
    fontsize: 30,
    bold: true,
    italic: false,
    underline: false,
    opacity: 0,
    shadow: 1.0,
    outline: 1.0,
  };

  it("should initialize with default options", () => {
    const generator = new AssGenerator(data, {});
    expect(generator.options.scrollDuration).toBe(12);
    expect(generator.options.fixedDuration).toBe(5);
    expect(generator.options.width).toBe(1920);
    expect(generator.options.height).toBe(1080);
    expect(generator.options.fontname).toBe("微软雅黑");
    expect(generator.options.fontsize).toBe(40);
  });

  it("should initialize with provided options", () => {
    const generator = new AssGenerator(data, options);
    expect(generator.options.scrollDuration).toBe(10);
    expect(generator.options.fixedDuration).toBe(5);
    expect(generator.options.width).toBe(1920);
    expect(generator.options.height).toBe(1080);
    expect(generator.options.fontname).toBe("Arial");
    expect(generator.options.fontsize).toBe(30);
  });

  it("should sort data by timestamp", () => {
    const generator = new AssGenerator(data, options);
    expect(generator.data[0].ts).toBe(1);
    expect(generator.data[1].ts).toBe(2);
    expect(generator.data[2].ts).toBe(3);
  });

  it("should generate base ASS script", () => {
    const generator = new AssGenerator(data, options);
    const baseAss = generator.generateBaseAss();
    expect(baseAss).toContain("[Script Info]");
    expect(baseAss).toContain("[V4+ Styles]");
    expect(baseAss).toContain("[Events]");
  });

  it("should convert data to ASS format", () => {
    const generator = new AssGenerator(data, options);
    const ass = generator.convert();
    expect(ass).toContain(
      "Dialogue: 0,00:00:01.00,00:00:11.00,R2L,,0000,0000,0000,,{\\move(1930,1,-85,1)}{\\c&H000000FF}Hello"
    );
    expect(ass).toContain(
      "Dialogue: 1,00:00:02.00,00:00:07.00,TOP,,0000,0000,0000,,{\\pos(920,0)}{\\c&H0000FF00}World"
    );
    expect(ass).toContain(
      "Dialogue: 1,00:00:03.00,00:00:08.00,BTM,,0000,0000,0000,,{\\pos(928,1040)}{\\c&H00FF0000}Test"
    );
  });
  it("should convert data with overlap BTM type", () => {
    const data: Item[] = [
      { ts: 1, text: "Hello", type: typeEnum.BTM, color: "#FF0000" },
      { ts: 2, text: "Hello", type: typeEnum.BTM, color: "#FF0000" },
      { ts: 3, text: "Hello", type: typeEnum.BTM, color: "#FF0000" },
    ];
    const generator = new AssGenerator(data, options);
    const ass = generator.convert();
    expect(ass).toContain(
      "Dialogue: 1,00:00:01.00,00:00:06.00,BTM,,0000,0000,0000,,{\\pos(920,1040)}{\\c&H000000FF}Hello"
    );
    expect(ass).toContain(
      "Dialogue: 1,00:00:02.00,00:00:07.00,BTM,,0000,0000,0000,,{\\pos(920,1000)}{\\c&H000000FF}Hello"
    );
    expect(ass).toContain(
      "Dialogue: 1,00:00:03.00,00:00:08.00,BTM,,0000,0000,0000,,{\\pos(920,960)}{\\c&H000000FF}Hello"
    );
  });

  it("should convert data with overlap TOP type", () => {
    const data: Item[] = [
      { ts: 1, text: "Hello", type: typeEnum.TOP, color: "#FF0000" },
      { ts: 2, text: "Hello", type: typeEnum.TOP, color: "#FF0000" },
      { ts: 10, text: "Hello", type: typeEnum.TOP, color: "#FF0000" },
    ];
    const generator = new AssGenerator(data, options);
    const ass = generator.convert();
    expect(ass).toContain(
      "Dialogue: 1,00:00:01.00,00:00:06.00,TOP,,0000,0000,0000,,{\\pos(920,0)}{\\c&H000000FF}Hello"
    );
    expect(ass).toContain(
      "Dialogue: 1,00:00:02.00,00:00:07.00,TOP,,0000,0000,0000,,{\\pos(920,40)}{\\c&H000000FF}Hello"
    );
    expect(ass).toContain(
      "Dialogue: 1,00:00:10.00,00:00:15.00,TOP,,0000,0000,0000,,{\\pos(920,0)}{\\c&H000000FF}Hello"
    );
  });
});
