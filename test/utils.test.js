import { describe, expect, test } from "@jest/globals";
import { isDOM } from "../src/utils";

describe("utils module", () => {
  test("give dom elements to return true", () => {
    ["input", "from", "p", "h1", "span"].forEach((tagName) => {
      const element = document.createElement(tagName);
      expect(isDOM(element)).toBe(true);
    });
  });
  test("give text to return false", () => {
    ["input", "from", "p", "h1", "span"].forEach((tagName) => {
      expect(isDOM(tagName)).toBe(false);
    });
  });
});
