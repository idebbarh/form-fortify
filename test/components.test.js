import { describe, expect, test } from "@jest/globals";
import { fortify } from "../src/components/registration";

describe("registration module", () => {
  test("give non-DOM element to throw error", () => {
    expect(() => fortify("text", () => {})).toThrowError(
      new Error(
        "Error: Fortify() Expected a DOM element, but received a non-DOM element or an invalid object.",
      ),
    );
  });

  test("give non-form element to throw error", () => {
    const inputElement = document.createElement("input");
    expect(() => fortify(inputElement, () => {})).toThrowError(
      new Error(
        "Error: Fortify() Expected a form element, but received a non-form element.",
      ),
    );
  });

  test("give non function second argument to throw error", () => {
    const formElement = document.createElement("form");
    expect(() => fortify(formElement, true)).toThrowError(
      new Error(
        "Error: Fortify() Expected a function, but received something else.",
      ),
    );
  });

  test("give form element and callback function to not throw error", () => {
    const formElement = document.createElement("form");
    try {
      fortify(formElement, () => {});
    } catch (error) {}
  });
  test("give form element and callback function to add registerStore to the form element", () => {
    const formElement = document.createElement("form");
    const registerStore = { errors: {}, data: {} };
    fortify(formElement, () => {});
    expect(formElement.registerStore).toEqual(registerStore);
  });
});
