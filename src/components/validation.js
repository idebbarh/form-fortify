const validateFieldHandler = {
  require: (fieldValue, validatorValue) =>
    !validatorValue || fieldValue.length > 0,
  maxLength: (fieldValue, validatorValue) =>
    fieldValue.length <= validatorValue,
  minLength: (fieldValue, validatorValue) =>
    fieldValue.length >= validatorValue,
  max: (fieldValue, validatorValue) => parseFloat(fieldValue) <= validatorValue,
  min: (fieldValue, validatorValue) => parseFloat(fieldValue) >= validatorValue,
  custom: (field, validatorValue) => validatorValue(field),
};

const validateValidatorHandler = {
  require: (_, validatorValue) => typeof validatorValue === "boolean",
  maxLength: (_, validatorValue) => typeof validatorValue === "number",
  minLength: (_, validatorValue) => typeof validatorValue === "number",
  max: (field, validatorValue) =>
    typeof validatorValue === "number" &&
    ["number", "range"].includes(field.type),
  max: (field, validatorValue) =>
    typeof validatorValue === "number" &&
    ["number", "range"].includes(field.type),
  custom: (field, validatorValue) =>
    typeof validatorValue === "function" &&
    typeof validatorValue(field.value) === "boolean",
};

export function isValidForm(errors) {
  return Object.values(errors).some((value) => value.error);
}

export function validateField(field, validator) {
  const validatorType = validator[0];
  const validatorValue = validator[1];

  if (!validateValidatorHandler.hasOwnProperty(validatorType)) {
    throw Error(
      `Error: ${validatorType.toUpperCase()} is not a valid validator type.`,
    );
  }

  const validateValidatorFunction = validateValidatorHandler[validatorType];

  if (!validateValidatorFunction(field, validatorValue)) {
    throw Error(`Error: The validation object you provide is not a valid.`);
  }

  const validateFieldFunction = validateFieldHandler[validator[0]];

  return validateFieldFunction(field.value, validator[1]);
}
