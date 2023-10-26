import { fortify, register, registerError } from "../src/form-fortify";

function submitHandler(data) {
  console.log(data);
}

const formElement = document.getElementById("form-element");

fortify(formElement, submitHandler);
