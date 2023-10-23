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
    element.register = function (registerName) {
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
          registerStore.data[registerName] = this.value;
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

function label() {
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
      input().setAttrs({ type: "text", name: "fullname" }).register("fullname"),
      input().setAttrs({ type: "text", name: "age" }).register("age"),
      input().setAttrs({ type: "submit" }),
    )
    .addSubmitHandler(submitHandler),
);
