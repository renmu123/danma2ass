import { describe, it, expect } from "vitest";
import AssGenerator, { typeEnum } from "../src/index.js";

import type { Item } from "../src/index.js";

describe("AssGenerator", () => {
  const data: Item[] = [
    { ts: 1, text: "Hello", type: typeEnum.R2L, color: "#FF0000" },
    { ts: 2, text: "World", type: typeEnum.TOP, color: "#00FF00" },
    { ts: 3, text: "Test", type: typeEnum.BTM, color: "#0000FF" },
  ];

  const options = {
    scrollDuration: 10,
    fixedDuration: 5,
    width: 1280,
    height: 720,
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
    expect(generator.options.width).toBe(1280);
    expect(generator.options.height).toBe(720);
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
      "Dialogue: 0,00:00:01.000,00:00:11.000,R2L,,0000,0000,0000,,{\\move(1290,1,-85,1)}{\\c&H000000FF}Hello"
    );
    expect(ass).toContain(
      "Dialogue: 1,00:00:02.000,00:00:07.000,TOP,,0000,0000,0000,,{\\pos(600,0)}{\\c&H0000FF00}World"
    );
    expect(ass).toContain(
      "Dialogue: 1,00:00:03.000,00:00:08.000,BTM,,0000,0000,0000,,{\\pos(608,704)}{\\c&H00FF0000}Test"
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
    console.log(ass);
    expect(ass).toContain(
      "Dialogue: 1,00:00:01.000,00:00:06.000,BTM,,0000,0000,0000,,{\\pos(600,704)}{\\c&H000000FF}Hello"
    );
    expect(ass).toContain(
      "Dialogue: 1,00:00:02.000,00:00:07.000,BTM,,0000,0000,0000,,{\\pos(600,684)}{\\c&H000000FF}Hello"
    );
    expect(ass).toContain(
      "Dialogue: 1,00:00:03.000,00:00:08.000,BTM,,0000,0000,0000,,{\\pos(600,664)}{\\c&H000000FF}Hello"
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
      "Dialogue: 1,00:00:01.000,00:00:06.000,TOP,,0000,0000,0000,,{\\pos(600,0)}{\\c&H000000FF}Hello"
    );
    expect(ass).toContain(
      "Dialogue: 1,00:00:02.000,00:00:07.000,TOP,,0000,0000,0000,,{\\pos(600,20)}{\\c&H000000FF}Hello"
    );
    expect(ass).toContain(
      "Dialogue: 1,00:00:10.000,00:00:15.000,TOP,,0000,0000,0000,,{\\pos(600,0)}{\\c&H000000FF}Hello"
    );
  });
});
