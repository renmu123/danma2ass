import { describe, it, expect } from "vitest";
import { RGB2BGR, decimalToHex, secondsToTimemark } from "../src/utils.js";

describe("RGB2BGR", () => {
  it("should convert #ffffff to #ffffff", () => {
    expect(RGB2BGR("#ffffff")).toBe("#ffffff");
  });

  it("should convert #123456 to #563412", () => {
    expect(RGB2BGR("#123456")).toBe("#563412");
  });

  it("should convert #abcdef to #efcdab", () => {
    expect(RGB2BGR("#abcdef")).toBe("#efcdab");
  });

  it("should convert #000000 to #000000", () => {
    expect(RGB2BGR("#000000")).toBe("#000000");
  });

  it("should convert #ff0000 to #0000ff", () => {
    expect(RGB2BGR("#ff0000")).toBe("#0000ff");
  });
});

describe("decimalToHex", () => {
  it("should convert 255 to ff", () => {
    expect(decimalToHex(255)).toBe("ff");
  });

  it("should convert 0 to 00", () => {
    expect(decimalToHex(0)).toBe("00");
  });

  it("should convert 16 to 10", () => {
    expect(decimalToHex(16)).toBe("10");
  });

  it("should convert 10 to a", () => {
    expect(decimalToHex(10)).toBe("0a");
  });

  it("should convert 4095 to fff", () => {
    expect(decimalToHex(4095)).toBe("fff");
  });
});

describe("secondsToTimemark", () => {
  it("should convert 3661.123 to 01:01:01.123", () => {
    expect(secondsToTimemark(3661.123)).toBe("01:01:01.123");
  });

  it("should convert 0 to 00:00:00.000", () => {
    expect(secondsToTimemark(0)).toBe("00:00:00.000");
  });

  it("should convert 59.999 to 00:00:59.999", () => {
    expect(secondsToTimemark(59.999)).toBe("00:00:59.999");
  });

  it("should convert 3600 to 01:00:00.000", () => {
    expect(secondsToTimemark(3600)).toBe("01:00:00.000");
  });

  it("should convert 86399.999 to 23:59:59.999", () => {
    expect(secondsToTimemark(86399.999)).toBe("23:59:59.999");
  });
});
