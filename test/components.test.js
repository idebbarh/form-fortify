import { describe, expect, test } from "@jest/globals";
import {
  fortify,
  register,
  registerError,
} from "../src/components/registration";

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

describe("error registration", () => {
  test("give non-DOM element to throw error", () => {
    expect(() => registerError("text", "registerName")).toThrowError(
      new Error(
        "Error: registerError() Expected a DOM element, but received a non-DOM element or an invalid object.",
      ),
    );
  });

  test("give non-valid text element to throw error", () => {
    const inputElement = document.createElement("input");
    expect(() => registerError(inputElement, "registerName")).toThrowError(
      new Error(
        "Error: registerError() Expected a valid text element to show the error, but received something else.",
      ),
    );
  });

  test("give text element not in form to throw error", () => {
    const paragraphElement = document.createElement("p");
    expect(() => registerError(paragraphElement, "registerName")).toThrowError(
      new Error(
        "Error: Not able to find a form element for this element. Please add this element inside a fortified (hint: fortify function) form element before add it to showError function.",
      ),
    );
  });

  test("give text element not in fortified form to throw error", () => {
    const paragraphElement = document.createElement("p");
    const formElement = document.createElement("form");
    formElement.appendChild(paragraphElement);

    expect(() => registerError(paragraphElement, "registerName")).toThrowError(
      new Error(
        "Error: Please add this element inside a fortified (hint: fortify function) form element before add it to showError function.",
      ),
    );
  });

  test("register text element with unavailable input register name", () => {
    const paragraphElement = document.createElement("p");
    const formElement = document.createElement("form");
    fortify(formElement, () => {});
    formElement.appendChild(paragraphElement);
    expect(() => registerError(paragraphElement, "registerName")).toThrowError(
      new Error(
        "Error: Not able to find an element with the provided register name.",
      ),
    );
  });

  test("give text element and valid register name to register text element in registerStore", () => {
    const paragraphElement = document.createElement("p");
    const formElement = document.createElement("form");
    const inputElement = document.createElement("input");
    const errorMessage = "this field is required";
    const registerName = "registerName";
    const inputDefaultValue = "default value";

    paragraphElement.innerText = errorMessage;

    const expectedRegisterStore = {
      errors: {
        [registerName]: {
          error: false,
          errorElementInfo: {
            elementInnerText: paragraphElement.innerText,
            element: paragraphElement,
          },
        },
      },
      data: {
        [registerName]: inputDefaultValue,
      },
    };

    inputElement.type = "text";
    inputElement.value = inputDefaultValue;

    formElement.appendChild(inputElement);
    formElement.appendChild(paragraphElement);

    fortify(formElement, () => {});
    register(inputElement, registerName);
    registerError(paragraphElement, registerName);

    expect(formElement.registerStore).toEqual(expectedRegisterStore);
    expect(paragraphElement.innerText).toEqual("");
  });
});
