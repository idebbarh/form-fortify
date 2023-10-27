import { fortify, register, registerError } from "../src/form-fortify";

function submitHandler(data) {
  console.log(data);
}

const myForm = document.getElementById("myForm");
const errorElements = document.querySelectorAll(".error-msg");

fortify(myForm, submitHandler);

for (let i = 0; i < myForm.elements.length; i++) {
  const element = myForm.elements[i];
  if (element.type === "submit") {
    continue;
  }

  const registerName = element.name;
  if (registerName) {
    register(element, registerName, { require: true });
  }
}

for (let i = 0; i < errorElements.length; i++) {
  const element = errorElements[i];
  const registerName = element.previousElementSibling.name;
  if (registerName) {
    registerError(element, registerName);
  }
}
