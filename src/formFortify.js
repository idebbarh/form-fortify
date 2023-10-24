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
        `${validator[0]} is not a valid validator name. Please provide a valid one.`,
      );
  }
  return isValid;
}
function validateField(field, validator) {
  if (!isValideValidator(field, validator)) {
    throw Error(
      `The validation object you provide is not a valid . Please provide a valid one.`,
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

function domElement(name) {
  //create dom element
  const element = document.createElement(name);
  //check if element created
  if (!element) {
    throw new Error(
      "Not able to create a DOM element from the provided name. Please provide a valid tag name.",
    );
  }

  //add children to the created element
  element.setChildren = function (...fields) {
    for (let field of fields) {
      this.appendChild(field);
    }
    //if the element is form , apply the register function to all the new children
    if (this.tagName === "FORM") {
      this.registerRegisteredChildren();
    }
    return this;
  };

  //set attributes to the created element
  element.setAttrs = function (attrs) {
    for (let key in attrs) {
      this.setAttribute(key, attrs[key]);
    }
    return this;
  };

  //register element to form data if the element a valid form field
  if (["input", "textarea", "select"].includes(element.tagName.toLowerCase())) {
    element.register = function (registerName, validation = {}) {
      this.registerCallback = function () {
        let currentParent = this.parentElement;

        while (currentParent && currentParent.tagName !== "FORM") {
          currentParent = currentParent.parentElement;
        }

        if (!currentParent) {
          throw new Error(
            "Not able to find a form element for this element. Please add this element inside a form() function before register it.",
          );
        }

        let registerStore = currentParent.registerStore;

        if (registerStore.data.hasOwnProperty(registerName)) {
          throw new Error(
            "Not able to store this element with the provided name. Please provide a name not exist in the store",
          );
        }
        const syncValue = () => {
          const validators = Object.keys(validation);
          registerStore.data[registerName] = this.value;
          registerStore.errors[registerName] = false;

          for (let validator of validators) {
            const isValid = validateField(this, [
              validator,
              validation[validator],
            ]);

            if (!isValid) {
              const validatorMsg = validation[validator];
              registerStore.errors[registerName] =
                typeof validatorMsg === "string"
                  ? {
                      message: validatorMsg,
                    }
                  : true;
            }
          }
        };

        syncValue();

        this.addEventListener("change", syncValue);
      };
      return this;
    };
  }

  return element;
}

function input() {
  const inputElem = domElement("input");
  return inputElem;
}

function form() {
  const formElement = domElement("form");

  formElement.registerStore = { errors: {}, data: {} };

  formElement.addSubmitHandler = function (submitCallback) {
    this.addEventListener("submit", (e) => {
      e.preventDefault();
      submitCallback(this.registerStore);
    });
    return this;
  };

  formElement.registerRegisteredChildren = function () {
    for (let element of formElement.elements) {
      if (!element.hasOwnProperty("registerCallback")) {
        continue;
      }
      element.registerCallback();
    }
  };

  return formElement;
}

function submitHandler(data) {
  console.log(data);
}

document.getElementById("app").appendChild(
  form()
    .setAttrs({ class: "form" })
    .setChildren(
      input()
        .setAttrs({ type: "text", name: "fullname" })
        .register("fullname", { custom: (value) => value === "ismail" }),
      input()
        .setAttrs({ type: "number", name: "age" })
        .register("age", { min: 5 }),
      input().setAttrs({ type: "submit" }),
    )
    .addSubmitHandler(submitHandler),
);
