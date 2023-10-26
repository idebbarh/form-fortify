export function isDOM(element) {
  return element instanceof Element;
}

export function getParentForm(element) {
  let currentParent = element.parentElement;

  while (currentParent && currentParent.tagName !== "FORM") {
    currentParent = currentParent.parentElement;
  }
  return currentParent;
}
