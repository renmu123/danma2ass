import { describe, it, expect } from "vitest";
import {
  RGB2BGR,
  decimalToHex,
  secondsToTimemark,
  defaultsDeep,
  parsePercentage,
} from "../src/utils.js";

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
    expect(secondsToTimemark(3661.123)).toBe("01:01:01.12");
  });

  it("should convert 0 to 00:00:00.000", () => {
    expect(secondsToTimemark(0)).toBe("00:00:00.00");
  });

  it("should convert 59.999 to 00:00:59.999", () => {
    expect(secondsToTimemark(59.999)).toBe("00:00:59.99");
  });

  it("should convert 3600 to 01:00:00.000", () => {
    expect(secondsToTimemark(3600)).toBe("01:00:00.00");
  });

  it("should convert 86399.999 to 23:59:59.999", () => {
    expect(secondsToTimemark(86399.999)).toBe("23:59:59.99");
  });
});

describe("defaultsDeep", () => {
  it("should merge two simple objects", () => {
    const target = { a: 1, b: 2 };
    const source = { b: 3, c: 4 };
    // @ts-ignore
    const result = defaultsDeep(target, source);
    expect(result).toEqual({ a: 1, b: 3, c: 4 });
  });

  it("should merge two simple objects override", () => {
    const target = { a: 1, b: 2 };
    const source = { a: 3, b: 4 };
    // @ts-ignore
    const result = defaultsDeep(target, source);
    expect(result).toEqual({ a: 3, b: 4 });
  });

  it("should merge nested objects", () => {
    const target = { a: { b: 1 } };
    const source = { a: { c: 2 } };
    // @ts-ignore
    const result = defaultsDeep(target, source);
    expect(result).toEqual({ a: { b: 1, c: 2 } });
  });

  it("should overwrite primitive values with objects", () => {
    const target = { a: 1 };
    const source = { a: { b: 2 } };
    // @ts-ignore
    const result = defaultsDeep(target, source);
    expect(result).toEqual({ a: { b: 2 } });
  });

  it("should not overwrite objects with primitive values", () => {
    const target = { a: { b: 1 } };
    const source = { a: 2 };
    // @ts-ignore
    const result = defaultsDeep(target, source);
    expect(result).toEqual({ a: 2 });
  });

  it("should handle arrays correctly", () => {
    const target = { a: [1, 2, 3] };
    const source = { a: [4, 5] };
    // @ts-ignore
    const result = defaultsDeep(target, source);
    expect(result).toEqual({ a: [4, 5] });
  });
});

describe("parsePercentage", () => {
  it("should convert '50%' to 0.5", () => {
    expect(parsePercentage("50%")).toBe(0.5);
  });

  it("should convert '100%' to 1", () => {
    expect(parsePercentage("100%")).toBe(1);
  });

  it("should convert '0%' to 0", () => {
    expect(parsePercentage("0%")).toBe(0);
  });

  it("should throw an error for '50'", () => {
    expect(() => parsePercentage("50")).toThrow("Invalid percentage");
  });

  it("should throw an error for 'abc%'", () => {
    expect(() => parsePercentage("abc%")).toThrow("Invalid percentage");
  });

  it("should convert '50.5%' to 0.505", () => {
    expect(parsePercentage("50.5%")).toBe(0.505);
  });
});
