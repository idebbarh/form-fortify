import { fortify, register, registerError } from "../src/form-fortify";

function submitHandler(data) {
  console.log(data);
}

const formElement = document.getElementById("form-element");
const fnameInput = document.querySelector(".input-fname");
const lnameInput = document.querySelector(".input-lname");
const fnameError = document.querySelector(".input-fname-error-msg");

fortify(formElement, submitHandler);
register(fnameInput, "fname", { maxLength: 10, require: true });
register(lnameInput, "lname");
registerError(fnameError, "fname");
