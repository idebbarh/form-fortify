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
}

export function syncErrors(registerStore, registerName) {
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
