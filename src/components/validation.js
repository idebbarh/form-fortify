export function isValidForm(errors) {
  return Object.values(errors).some((value) => value.error);
}

const validateValidatorHandler = {
  require: (_, validatorValue) => typeof validatorValue === "boolean",
  maxLength: (_, validatorValue) =>
    typeof validatorValue === "number" && validatorValue >= 0,
  minLength: (_, validatorValue) =>
    typeof validatorValue === "number" && validatorValue >= 0,
  max: (field, validatorValue) =>
    typeof validatorValue === "number" &&
    validatorValue >= 0 &&
    ["number", "range"].includes(field.type),
  max: (field, validatorValue) =>
    typeof validatorValue === "number" &&
    validatorValue >= 0 &&
    ["number", "range"].includes(field.type),
  custom: (field, validatorValue) =>
    typeof validatorValue === "function" &&
    typeof validatorValue(field.value) === "boolean",
};

const validateFieldHandler = {
  require: (fieldValue, validatorValue) => !validatorValue || fieldValue,
  maxLength: (fieldValue, validatorValue) =>
    fieldValue.length <= validatorValue,
  minLength: (fieldValue, validatorValue) =>
    fieldValue.length >= validatorValue,
  max: (fieldValue, validatorValue) =>
    fieldValue.length && parseFloat(fieldValue) <= validatorValue,
  min: (fieldValue, validatorValue) =>
    fieldValue.length && parseFloat(fieldValue) >= validatorValue,
  custom: (field, validatorValue) => validatorValue(field),
};

export function validateField(field, validator) {
  const validatorType = validator[0];
  const validatorValue = validator[1];

  if (!validateValidatorHandler.hasOwnProperty(validatorType)) {
    throw Error(`Error: ${validatorType} is not a valid validator type.`);
  }

  const validateValidatorFunction = validateValidatorHandler[validatorType];

  if (!validateValidatorFunction(field, validatorValue)) {
    throw Error(`Error: The validation object you provide is not a valid.`);
  }

  const validateFieldFunction = validateFieldHandler[validator[0]];

  return validateFieldFunction(field.value.trim(), validator[1]);
}
