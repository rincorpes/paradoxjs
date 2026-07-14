import getText from "./helpers/getText";
import setAttributes from "./helpers/setAttributes";
import handleEvents from "./helpers/handleEvents";
import applyStyles from "./helpers/applyStyles";
import appendChildren from "./helpers/appendChildren";

import { ParadoxClassValue, ParadoxElementOptions } from "./types";

function normalizeClassNames(...classValues: (ParadoxClassValue | undefined)[]): string[] {
  const classNames: string[] = [];

  for (const classValue of classValues) {
    if (!classValue) {
      continue;
    }

    if (Array.isArray(classValue)) {
      for (const className of classValue) {
        if (className && className.trim()) {
          classNames.push(className.trim());
        }
      }
      continue;
    }

    for (const className of classValue.split(" ")) {
      if (className && className.trim()) {
        classNames.push(className.trim());
      }
    }
  }

  return classNames;
}

/**
 * Builds and returns an HTML element with pragmatic DOM-friendly options.
 */
export default function buildElement<Tag extends keyof HTMLElementTagNameMap>(
  tag: Tag,
  options: ParadoxElementOptions<Tag> = {}
): HTMLElementTagNameMap[Tag] {
  if (!tag) {
    throw new Error("Tag is required");
  }

  const {
    id,
    className,
    classList,
    children = [],
    attributes = {},
    data = {},
    aria = {},
    events = {},
    text,
    style = {},
  } = options;

  const element = document.createElement(tag);

  if (id) {
    element.id = id.trim();
  }

  const classNames = normalizeClassNames(className, classList);
  if (classNames.length) {
    element.classList.add(...classNames);
  }

  setAttributes(element, attributes, data, aria);
  handleEvents(element, events);
  applyStyles(element, style);

  if (text !== null && text !== undefined) {
    element.append(document.createTextNode(getText(String(text))));
  }

  appendChildren(element, children, buildElement);

  return element;
}
