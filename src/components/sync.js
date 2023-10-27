import { validateField } from "./validation";

export function syncValue(
  element,
  registerStore,
  registerName,
  validators,
  validation,
) {
  const elementType = element.type;

  const uniqueInputTypeHandlers = {
    checkbox: () => (registerStore.data[registerName] = element.checked),
    file: () =>
      (registerStore.data[registerName] =
        element.files.length > 0 ? element.files[0] : null),
    radio: () => {
      if (element.checked) {
        registerStore.data[registerName] = element.value;
      } else if (registerStore.data[registerName] === undefined) {
        registerStore.data[registerName] = "";
      }
    },
  };

  if (uniqueInputTypeHandlers[elementType]) {
    uniqueInputTypeHandlers[elementType]();
  } else if (
    [
      "text",
      "password",
      "number",
      "range",
      "color",
      "select-one",
      "textarea",
    ].includes(elementType)
  ) {
    registerStore.data[registerName] = element.value;
  } else {
    throw Error("Error: Unknown field type");
  }

  registerStore.errors[registerName].error = false;

  for (let validator of validators) {
    const isValid = validateField(
      registerStore.data[registerName],
      element.type,
      [validator, validation[validator]],
    );

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
