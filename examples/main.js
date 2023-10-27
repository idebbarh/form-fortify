import { fortify, register, registerError } from "../src/form-fortify";

function submitHandler(data) {
  console.log(data);
}

const myForm = document.getElementById("myForm");

fortify(myForm, submitHandler);

for (let i = 0; i < myForm.elements.length; i++) {
  const element = myForm.elements[i];
  if (element.type === "submit") {
    continue;
  }

  const registerName = element.name;
  register(element, registerName, { require: true });
}
