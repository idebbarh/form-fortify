import { fortify, register, registerError } from "../src/form-fortify";

function submitHandler(data) {
  console.log(data);
}

const myForm = document.getElementById("myForm");

for (let i = 0; i < myForm.elements.length; i++) {
  const element = myForm.elements[i];
}
