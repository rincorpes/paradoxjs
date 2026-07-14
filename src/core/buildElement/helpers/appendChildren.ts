import getText from "./getText";

import { ParadoxElementChild, ParadoxElementChildren, ParadoxElementDescriptor, ParadoxElementOptions } from "../types";

type BuildElementFunction = <Tag extends keyof HTMLElementTagNameMap>(
  tag: Tag,
  options?: ParadoxElementOptions<Tag>
) => HTMLElementTagNameMap[Tag];

function isNode(value: unknown): value is Node {
  return typeof Node !== "undefined" && value instanceof Node;
}

function isElementDescriptor(value: unknown): value is ParadoxElementDescriptor {
  return Boolean(value)
    && typeof value === "object"
    && !Array.isArray(value)
    && "tag" in (value as ParadoxElementDescriptor)
    && typeof (value as ParadoxElementDescriptor).tag === "string";
}

function appendChild(
  fragment: DocumentFragment,
  child: ParadoxElementChild,
  buildElement: BuildElementFunction
): void {
  if (child === null || child === undefined || typeof child === "boolean") {
    return;
  }

  if (Array.isArray(child)) {
    for (const nestedChild of child) {
      appendChild(fragment, nestedChild, buildElement);
    }
    return;
  }

  if (isNode(child)) {
    fragment.append(child);
    return;
  }

  if (isElementDescriptor(child)) {
    fragment.append(buildElement(child.tag, child.options));
    return;
  }

  fragment.append(document.createTextNode(getText(String(child))));
}

/**
 * Appends supported child values to a parent element.
 */
function appendChildren(
  element: HTMLElement,
  children: ParadoxElementChildren = [],
  buildElement: BuildElementFunction
): void {
  const fragment = document.createDocumentFragment();

  for (const child of children) {
    appendChild(fragment, child, buildElement);
  }

  element.append(fragment);
}

export default appendChildren;
