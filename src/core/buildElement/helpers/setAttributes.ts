import { ParadoxAriaAttributes, ParadoxAttributes, ParadoxAttributeValue, ParadoxDataAttributes } from "../types";

function toKebabCase(value: string): string {
  return value.replace(/([a-z0-9])([A-Z])/g, "$1-$2").replace(/_/g, "-").toLowerCase();
}

function applyAttribute(element: HTMLElement, key: string, value: ParadoxAttributeValue): void {
  if (value === null || value === undefined || value === false) {
    element.removeAttribute(key);
    return;
  }

  if (value === true) {
    element.setAttribute(key, "");
    return;
  }

  element.setAttribute(key, String(value));
}

function setDataAttributes(element: HTMLElement, data: ParadoxDataAttributes = {}): void {
  for (const [key, value] of Object.entries(data)) {
    applyAttribute(element, `data-${toKebabCase(key)}`, value);
  }
}

function setAriaAttributes(element: HTMLElement, aria: ParadoxAriaAttributes = {}): void {
  for (const [key, value] of Object.entries(aria)) {
    applyAttribute(element, `aria-${toKebabCase(key)}`, value);
  }
}

/**
 * Sets standard, data, and aria attributes on an HTML element.
 */
function setAttributes(
  element: HTMLElement,
  attributes: ParadoxAttributes = {},
  data: ParadoxDataAttributes = {},
  aria: ParadoxAriaAttributes = {}
): void {
  for (const [key, value] of Object.entries(attributes)) {
    applyAttribute(element, key, value);
  }

  setDataAttributes(element, data);
  setAriaAttributes(element, aria);
}

export default setAttributes;
