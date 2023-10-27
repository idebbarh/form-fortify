export function isValidForm(errors) {
  return !Object.values(errors).some((value) => value.error);
}

export function validateField(fieldValue, fieldType, validator) {
  const validatorType = validator[0];
  const validatorValue = validator[1];

  const validateValidatorHandler = {
    require: () => typeof validatorValue === "boolean",
    maxLength: () => typeof validatorValue === "number" && validatorValue >= 0,
    minLength: () => typeof validatorValue === "number" && validatorValue >= 0,
    max: () =>
      typeof validatorValue === "number" &&
      validatorValue >= 0 &&
      ["number", "range"].includes(fieldType),
    max: () =>
      typeof validatorValue === "number" &&
      validatorValue >= 0 &&
      ["number", "range"].includes(fieldType),
    custom: () =>
      typeof validatorValue === "function" &&
      typeof validatorValue(fieldValue) === "boolean",
  };

  const validateFieldHandler = {
    require: () => {
      if (!validatorValue) {
        return true;
      }
      if (fieldValue) {
        return true;
      }
      return false;
    },
    maxLength: () => fieldValue.length <= validatorValue,
    minLength: () => fieldValue.length >= validatorValue,
    max: () => fieldValue.length && parseFloat(fieldValue) <= validatorValue,
    min: () => fieldValue.length && parseFloat(fieldValue) >= validatorValue,
    custom: () => validatorValue(fieldValue),
  };

  if (!validateValidatorHandler.hasOwnProperty(validatorType)) {
    throw Error(`Error: ${validatorType} is not a valid validator type.`);
  }

  const validateValidatorFunction = validateValidatorHandler[validatorType];

  if (!validateValidatorFunction(fieldValue, validatorValue)) {
    throw Error(`Error: The validation object you provide is not a valid.`);
  }

  const validateFieldFunction = validateFieldHandler[validatorType];

  const isValidField = validateFieldFunction(
    typeof fieldValue === "string" ? fieldValue.trim() : fieldValue,
    fieldType,
    validatorValue,
  );

  return isValidField;
}
