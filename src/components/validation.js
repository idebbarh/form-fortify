export function isValidForm(errors) {
  for (let value of Object.values(errors)) {
    if (value.error === true) {
      return false;
    }
  }
  return true;
}

export function isValideValidator(field, validator) {
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

export function validateField(field, validator) {
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
