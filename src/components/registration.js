import { REGISTABLE_ELEMENTS, VALID_TEXT_ELEMENT_NAMES } from "../constants";
import { getParentForm, isDOM } from "../utils";
import { syncErrors, syncValue } from "./sync";
import { isValidForm } from "./validation";

export function register(element, registerName, validation = {}) {
  if (!isDOM(element)) {
    throw Error(
      "Error: Register() Expected a DOM element, but received a non-DOM element or an invalid object.",
    );
  }

  if (!REGISTABLE_ELEMENTS.includes(element.tagName.toLowerCase())) {
    throw Error(
      "Error: Register() Expected (input, textarea or select) element, but received a another element.",
    );
  }

  if (typeof registerName !== "string") {
    throw Error(
      "Error: Register() Expected a valid string register name, but received something else.",
    );
  }

  let currentParent = getParentForm(element);

  if (!currentParent) {
    throw new Error(
      "Error: Not able to find a form element for this element. Please add this element inside a fortified (hint: fortify function) form element before register it.",
    );
  }

  let registerStore = currentParent.registerStore;

  if (!registerStore) {
    throw new Error(
      "Error: Please add this element inside a fortified (hint: fortify function) form element before register it.",
    );
  }

  if (
    registerStore.data.hasOwnProperty(registerName) &&
    element.type !== "radio"
  ) {
    throw new Error(
      "Error: Not able to store this element with the provided name. Please provide a name not exist in the store",
    );
  }

  const validators = Object.keys(validation);

  registerStore.errors[registerName] = { error: false };

  syncValue(element, registerStore, registerName, validators, validation);

  element.addEventListener("input", () => {
    syncValue(element, registerStore, registerName, validators, validation);
    syncErrors(registerStore, registerName);
  });

  return element;
}

export function registerError(element, registerName) {
  if (!isDOM(element)) {
    throw Error(
      "Error: registerError() Expected a DOM element, but received a non-DOM element or an invalid object.",
    );
  }

  if (!VALID_TEXT_ELEMENT_NAMES.includes(element.tagName.toLowerCase())) {
    throw Error(
      "Error: registerError() Expected a valid text element to show the error, but received something else.",
    );
  }

  let currentParent = getParentForm(element);

  if (!currentParent) {
    throw new Error(
      "Error: Not able to find a form element for this element. Please add this element inside a fortified (hint: fortify function) form element before add it to showError function.",
    );
  }

  let registerStore = currentParent.registerStore;

  if (!registerStore) {
    throw new Error(
      "Error: Please add this element inside a fortified (hint: fortify function) form element before add it to showError function.",
    );
  }

  if (!registerStore.errors.hasOwnProperty(registerName)) {
    throw new Error(
      "Error: Not able to find an element with the provided register name.",
    );
  }
  registerStore.errors[registerName].errorElementInfo = {
    elementInnerText: element.innerText,
    element,
  };

  element.innerText = "";
}

export function fortify(formElement, submitCallback) {
  if (!isDOM(formElement)) {
    throw Error(
      "Error: Fortify() Expected a DOM element, but received a non-DOM element or an invalid object.",
    );
  }

  if (formElement.tagName !== "FORM") {
    throw Error(
      "Error: Fortify() Expected a form element, but received a non-form element.",
    );
  }

  if (typeof submitCallback !== "function") {
    throw Error(
      "Error: Fortify() Expected a function, but received something else.",
    );
  }

  formElement.registerStore = { errors: {}, data: {} };

  formElement.addEventListener("submit", function (e) {
    e.preventDefault();

    Object.keys(this.registerStore.errors).forEach((registerName) => {
      syncErrors(this.registerStore, registerName);
    });

    if (!isValidForm(this.registerStore.errors)) {
      console.log(this.registerStore.errors);
      return;
    }
    submitCallback(this.registerStore.data);
  });
}
