import { validateField } from "./validation";

const uniqueInputTypeHandlers = {
  checkbox: (element, registerName) =>
    (registerStore.data[registerName] = element.checked),
  file: (element, registerName) =>
    (registerStore.data[registerName] = element.files[0]),
};

export function syncValue(
  element,
  registerStore,
  registerName,
  validators,
  validation,
) {
  const elementType = element.type;
  if (uniqueInputTypeHandlers[elementType]) {
    uniqueInputTypeHandlers[elementType](element, registerName);
  } else if (
    [
      "text",
      "password",
      "radio",
      "number",
      "color",
      "select-one",
      "textarea",
    ].includes(elementType)
  ) {
    registerStore.data[registerName] = element.value;
  } else {
    throw Error("Error: Unknown field type");
  }

  for (let validator of validators) {
    const isValid = validateField(element, [validator, validation[validator]]);

    if (!isValid) {
      registerStore.errors[registerName].error = true;
      break;
    }
  }
}

export function syncErrors(registerStore, registerName) {
  const errorElementInfo = registerStore.errors[registerName].errorElementInfo;

  if (!errorElementInfo) {
    return;
  }

  const isError = registerStore.errors[registerName].error;

  if (isError) {
    errorElementInfo.element.innerText = errorElementInfo.elementInnerText;
  } else {
    errorElementInfo.element.innerText = "";
  }
}
