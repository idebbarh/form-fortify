import { describe, expect, test } from "@jest/globals";
import { fortify, register } from "../src/components/registration";

describe("form registeration", () => {
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
    const expectedRegisterStore = { errors: {}, data: {} };
    fortify(formElement, () => {});
    expect(formElement.registerStore).toEqual(expectedRegisterStore);
  });
});

describe("field registeration", () => {
  test("give non-DOM element to throw error", () => {
    expect(() => register("text", "registerName")).toThrowError(
      new Error(
        "Error: Register() Expected a DOM element, but received a non-DOM element or an invalid object.",
      ),
    );
  });

  test("give non-registable element to throw error", () => {
    const paragraphElement = document.createElement("p");
    expect(() => register(paragraphElement, "registerName")).toThrowError(
      new Error(
        "Error: Register() Expected (input, textarea or select) element, but received a another element.",
      ),
    );
  });

  test("give non valid string register name to throw error", () => {
    const inputElement = document.createElement("input");
    expect(() => register(inputElement, {})).toThrowError(
      new Error(
        "Error: Register() Expected a valid string register name, but received something else.",
      ),
    );
  });

  test("give input not in form to throw error", () => {
    const inputElement = document.createElement("input");
    expect(() => register(inputElement, "registerName")).toThrowError(
      new Error(
        "Error: Not able to find a form element for this element. Please add this element inside a fortified (hint: fortify function) form element before register it.",
      ),
    );
  });

  test("give input not in fortified form to throw error", () => {
    const formElement = document.createElement("form");
    const inputElement = document.createElement("input");
    formElement.appendChild(inputElement);

    expect(() => register(inputElement, "registerName")).toThrowError(
      new Error(
        "Error: Please add this element inside a fortified (hint: fortify function) form element before register it.",
      ),
    );
  });

  test("give input element and valid register name to add input value to form registerStore", () => {
    const formElement = document.createElement("form");
    const inputElement = document.createElement("input");
    const registerName = "registerName";
    const inputDefaultValue = "default value";
    const expectedRegisterStore = {
      errors: { [registerName]: { error: false } },
      data: {
        [registerName]: inputDefaultValue,
      },
    };
    inputElement.type = "text";
    inputElement.value = inputDefaultValue;
    formElement.appendChild(inputElement);
    fortify(formElement, () => {});
    register(inputElement, registerName);
    expect(formElement.registerStore).toEqual(expectedRegisterStore);
  });

  test("give duplicate register name to throw error", () => {
    const formElement = document.createElement("form");
    const inputElement1 = document.createElement("input");
    const inputElement2 = document.createElement("input");
    inputElement1.type = "text";
    inputElement2.type = "text";
    formElement.appendChild(inputElement1);
    formElement.appendChild(inputElement2);
    fortify(formElement, () => {});
    register(inputElement1, "registerName");
    expect(() => register(inputElement2, "registerName")).toThrowError(
      new Error(
        "Error: Not able to store this element with the provided name. Please provide a name not exist in the store",
      ),
    );
  });
});
