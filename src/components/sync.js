import { validateField } from "./validation";

export function syncValue(
  element,
  registerStore,
  registerName,
  validators,
  validation,
) {
  registerStore.data[registerName] = element.value;
  registerStore.errors[registerName].error = false;

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
