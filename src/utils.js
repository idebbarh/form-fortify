export function isDOM(element) {
  return element instanceof HTMLElement;
}

export function getParentForm(element) {
  let currentParent = element.parentElement;

  while (currentParent && currentParent.tagName !== "FORM") {
    currentParent = currentParent.parentElement;
  }
  return currentParent;
}
