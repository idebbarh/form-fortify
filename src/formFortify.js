const isDOM = (el) => el instanceof Element;
const REGISTABLE_ELEMENTS = ["input", "textarea", "select"];
const VALID_TEXT_ELEMENT_NAMES = [
  "div",
  "span",
  "p",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "a",
  "button",
  "li",
  "td",
  "th",
];

function getParentForm(element) {
  let currentParent = element.parentElement;

  while (currentParent && currentParent.tagName !== "FORM") {
    currentParent = currentParent.parentElement;
  }
  return currentParent;
}

function syncErrors(registerStore, registerName) {
  const errorElementInfo = registerStore.errors[registerName].errorElementInfo;
  const isError = registerStore.errors[registerName].error;

  if (!errorElementInfo) {
    return;
  }
  if (isError) {
    errorElementInfo.element.innerText = errorElementInfo.errorMessage;
  } else {
    errorElementInfo.element.innerText = "";
  }
}

function isValidForm(errors) {
  for (let value of Object.values(errors)) {
    if (value.error === true) {
      return false;
    }
  }
  return true;
}

function isValideValidator(field, validator) {
  let isValid = true;
  switch (validator[0]) {
    case "require":
      isValid =
        typeof validator[1] === "string" || typeof validator[1] === "boolean";
      break;
    case "maxLength":
      isValid = typeof validator[1] === "number";
      break;
    case "minLength":
      isValid = typeof validator[1] === "number";
      break;
    case "max":
      isValid = typeof validator[1] === "number" && field.type === "number";
      break;
    case "min":
      isValid = typeof validator[1] === "number" && field.type === "number";
      break;
    case "custom":
      isValid =
        typeof validator[1] === "function" &&
        typeof validator[1](field.value) === "boolean";
      break;
    default:
      throw Error(
        `Error: ${validator[0]} is not a valid validator name. Please provide a valid one.`,
      );
  }
  return isValid;
}

function validateField(field, validator) {
  if (!isValideValidator(field, validator)) {
    throw Error(
      `Error: The validation object you provide is not a valid . Please provide a valid one.`,
    );
  }

  let isValid = true;
  switch (validator[0]) {
    case "require":
      isValid = field.value.length > 0;
      break;
    case "maxLength":
      isValid = field.value.length <= validator[1];
      break;
    case "minLength":
      isValid = field.value.length >= validator[1];
      break;
    case "max":
      isValid =
        parseInt(field.value.length > 0 ? field.value : "0") <= validator[1];
      break;
    case "min":
      isValid =
        parseInt(field.value.length > 0 ? field.value : "0") >= validator[1];
      break;
    case "custom":
      isValid = validator[1](field.value);
      break;
    default:
      break;
  }
  return isValid;
}

function register(element, registerName, validation = {}) {
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

  if (registerStore.data.hasOwnProperty(registerName)) {
    throw new Error(
      "Error: Not able to store this element with the provided name. Please provide a name not exist in the store",
    );
  }

  const validators = Object.keys(validation);
  registerStore.data[registerName] = element.value;
  registerStore.errors[registerName] = { error: false };

  const syncValue = () => {
    registerStore.data[registerName] = element.value;
    registerStore.errors[registerName].error = false;

    for (let validator of validators) {
      const isValid = validateField(element, [
        validator,
        validation[validator],
      ]);

      if (!isValid) {
        const validatorMsg = validation[validator];
        registerStore.errors[registerName].error = true;
        if (typeof validatorMsg === "string") {
          registerStore.errors[registerName].message = validatorMsg;
        }
        if (
          registerStore.errors[registerName].errorElementInfo &&
          registerStore.errors[registerName].message
        ) {
          registerStore.errors[registerName].errorElementInfo.errorMessage =
            registerStore.errors[registerName].message;
        }
      }
    }
  };

  syncValue();

  element.addEventListener("input", () => {
    syncValue();
    syncErrors(registerStore, registerName);
  });

  return element;
}

function registerError(element, registerName) {
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
    errorMessage:
      registerStore.errors[registerName].message ?? element.innerText,
    element,
  };

  syncErrors(registerStore, registerName);
}

function fortify(formElement, submitCallback) {
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
    if (!isValidForm(this.registerStore.errors)) {
      return;
    }
    submitCallback(this.registerStore.data);
  });
}

function submitHandler(data) {
  console.log(data);
}

const formElement = document.getElementsByClassName("form-container");
const inputf = document.getElementsByClassName("input-fname");
const inputl = document.getElementsByClassName("input-lname");
const inputfErrorMsg = document.getElementsByClassName("input-fname-error-msg");

fortify(formElement[0], submitHandler);
register(inputf[0], "fname", { require: true });
register(inputl[0], "lname", { require: "last name is required" });
registerError(inputfErrorMsg[0], "fname");
