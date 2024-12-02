import { describe, it, expect } from "vitest";
import AssGenerator from "../src/assGenerator.js";

import { typeEnum } from "../src/types.js";
import type { Danma } from "../src/types.js";

describe("AssGenerator", () => {
  const data: Danma[] = [
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
      "Dialogue: 0,0:00:01.00,0:00:11.00,R2L,,0000,0000,0000,,{\\move(2005,1,-80,1)}{\\c&H000000FF}Hello"
    );
    expect(ass).toContain(
      "Dialogue: 1,0:00:02.00,0:00:07.00,TOP,,0000,0000,0000,,{\\pos(960,1)}{\\c&H0000FF00}World"
    );
    expect(ass).toContain(
      "Dialogue: 1,0:00:03.00,0:00:08.00,BTM,,0000,0000,0000,,{\\pos(960,1014)}{\\c&H00FF0000}Test"
    );
  });
  it("should convert data with overlap BTM type", () => {
    const data: Danma[] = [
      { ts: 1, text: "Hello", type: typeEnum.BTM, color: "#FF0000" },
      { ts: 2, text: "Hello", type: typeEnum.BTM, color: "#FF0000" },
      { ts: 3, text: "Hello", type: typeEnum.BTM, color: "#FF0000" },
    ];
    const generator = new AssGenerator(data, options);
    const ass = generator.convert();
    expect(ass).toContain(
      "Dialogue: 1,0:00:01.00,0:00:06.00,BTM,,0000,0000,0000,,{\\pos(960,1014)}{\\c&H000000FF}Hello"
    );
    expect(ass).toContain(
      "Dialogue: 1,0:00:02.00,0:00:07.00,BTM,,0000,0000,0000,,{\\pos(960,981)}{\\c&H000000FF}Hello"
    );
    expect(ass).toContain(
      "Dialogue: 1,0:00:03.00,0:00:08.00,BTM,,0000,0000,0000,,{\\pos(960,948)}{\\c&H000000FF}Hello"
    );
  });

  it("should convert data with overlap TOP type", () => {
    const data: Danma[] = [
      { ts: 1, text: "Hello", type: typeEnum.TOP, color: "#FF0000" },
      { ts: 2, text: "Hello", type: typeEnum.TOP, color: "#FF0000" },
      { ts: 10, text: "Hello", type: typeEnum.TOP, color: "#FF0000" },
    ];
    const generator = new AssGenerator(data, options);
    const ass = generator.convert();
    expect(ass).toContain(
      "Dialogue: 1,0:00:01.00,0:00:06.00,TOP,,0000,0000,0000,,{\\pos(960,1)}{\\c&H000000FF}Hello"
    );
    expect(ass).toContain(
      "Dialogue: 1,0:00:02.00,0:00:07.00,TOP,,0000,0000,0000,,{\\pos(960,34)}{\\c&H000000FF}Hello"
    );
    expect(ass).toContain(
      "Dialogue: 1,0:00:10.00,0:00:15.00,TOP,,0000,0000,0000,,{\\pos(960,1)}{\\c&H000000FF}Hello"
    );
  });
  it("should convert data with overlap TOP and BTM conflict", () => {
    const data: Danma[] = [
      { ts: 1, text: "Hello", type: typeEnum.TOP, color: "#FF0000" },
      { ts: 2, text: "Hello", type: typeEnum.TOP, color: "#FF0000" },
      { ts: 3, text: "Hello", type: typeEnum.BTM, color: "#FF0000" },
    ];
    const generator = new AssGenerator(data, {
      ...options,
      height: 90,
      density: 2,
    });
    const ass = generator.convert();
    console.log(ass);
    expect(ass).toContain(
      "Dialogue: 1,0:00:01.00,0:00:06.00,TOP,,0000,0000,0000,,{\\pos(960,1)}{\\c&H000000FF}Hello"
    );
    expect(ass).toContain(
      "Dialogue: 1,0:00:02.00,0:00:07.00,TOP,,0000,0000,0000,,{\\pos(960,34)}{\\c&H000000FF}Hello"
    );
    expect(ass).not.toContain(
      "Dialogue: 1,0:00:10.00,0:00:15.00,TOP,,0000,0000,0000,,{\\pos(960,24)}{\\c&H000000FF}Hello"
    );
  });
});
