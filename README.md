# FormFortify

FormFortify is a JavaScript library designed to assist you with form validation and error handling. It provides functions for registering form fields for validation and fortifying forms for submission using custom validation rules.

## Usage

1. **Fortifying a Form**: Before registering any form fields, you must fortify the form itself using the `fortify` function.

   Example:

   ```javascript
   const formElement = document.querySelector("form#exampleForm");
   fortify(formElement, submitHandler);
   ```

- `formElement` is the form element you want to fortify for submission.
- `submitHandler` is the function that will handle the form submission if all fields pass validation.

2. **Registering a Form Field**: To register a form field, use the `register` function, passing the field element as an argument.

   Example:

   ```javascript
   const inputElement = document.querySelector("input#exampleField");

   // Register the input field with a unique name and optional validation rules
   register(inputElement, "fieldName", {
     require: true, // Example validation rule
     maxLength: 10, // Another example rule
   });
   ```

- `inputElement`: The form field element you want to register.
- `"fieldName"`: A unique name for the field.
- Validation Rules: The object passed as the third parameter contains validation rules. In this example, we're using "require" and "maxLength."
  > Note: Before registering any form field, make sure it is placed inside a fortified form.

3. **Associating an Error Element**: First, create an error element in your HTML that will display the error message. You can select this element in your JavaScript code using `document.querySelector` or a similar method.

   Example:

   ```javascript
   const errorElement = document.querySelector(".error-message");

   // Associate an error element with a registered field
   registerError(errorElement, "fieldName");
   ```

- `errorElement` is the element where you want to display error messages.
- `"fieldName"` is the name of the registered form field you want to associate with this error message.
  > Note: Before registering any error element, ensure that the associated form field has been registered.

### Form Submission

The library prevents form submission if there are validation errors. The form submission is handled by the `submitHandler` function. If all form fields are valid, the `submitHandler` function is called with the form data as an argument.

### Validation Rules

In this library, you can use various validation rules to validate form fields. These rules are specified when registering a form field for validation. Below, we provide a description for each of the available validation rules:

- **require**:

  - **Description**: This rule is used to check if a field is required or not. It can be used for fields that must have a non-empty value.
  - **Example**:
    ```javascript
    register(inputElement, "fieldName", { require: true });
    ```

- **maxLength**:

  - **Description**: This rule validates that the length of the field's value does not exceed a specified maximum length.
  - **Example**:
    ```javascript
    register(inputElement, "fieldName", { maxLength: 10 });
    ```

- **minLength**:

  - **Description**: This rule validates that the length of the field's value is at least a specified minimum length.
  - **Example**:
    ```javascript
    register(inputElement, "fieldName", { minLength: 5 });
    ```

- **max**:

  - **Description**: This rule is used to validate the maximum value for numeric fields. It ensures that the field's value does not exceed a specified maximum.
  - **Example**:
    ```javascript
    register(inputElement, "age", { max: 100 });
    ```

- **min**:

  - **Description**: This rule is used to validate the minimum value for numeric fields. It ensures that the field's value is not less than a specified minimum.
  - **Example**:
    ```javascript
    register(inputElement, "age", { min: 18 });
    ```

- **custom**:

  - **Description**: This rule allows you to define custom validation logic for a field. It accepts a custom validation function that should return a boolean indicating the validation result.
  - **Example**:

    ```javascript
    register(inputElement, "customField", { custom: customValidator });
    ```

    ```javascript
    // Example of a custom validation function
    function customValidator(value) {
      // For example, let's say you want to ensure that the input contains at least one uppercase letter
      const containsUppercase = /[A-Z]/.test(value);

      return containsUppercase;
    }
    ```

## License

This library is open-source and provided under the MIT license. Please refer to the [LICENSE](./LICENSE) file for detailed information regarding the terms and conditions of use, modification, and distribution.
