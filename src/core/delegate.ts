export type DelegateHandler = (event: Event, matchedElement: Element) => void;
export type DelegateHandlers = DelegateHandler | DelegateHandler[];
export type DelegateSelectorMap = {
  [selector: string]: DelegateHandlers;
};
export type DelegateEventMap = {
  [eventName: string]: DelegateSelectorMap;
};

function normalizeHandlers(handlers: DelegateHandlers): DelegateHandler[] {
  return Array.isArray(handlers) ? handlers : [handlers];
}

function isElementWithinRoot(root: Document | Element, element: Element): boolean {
  if (root instanceof Document) {
    return true;
  }

  return root.contains(element);
}

/**
 * Delegates DOM events from a root node to handlers mapped by selector.
 */
export default function delegate(
  root: Document | Element,
  eventMap: DelegateEventMap
): () => void {
  const removers: Array<() => void> = [];

  for (const [eventName, selectorMap] of Object.entries(eventMap)) {
    const listener = (event: Event) => {
      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }

      for (const [selector, handlers] of Object.entries(selectorMap)) {
        const matchedElement = target.closest(selector);

        if (!matchedElement || !isElementWithinRoot(root, matchedElement)) {
          continue;
        }

        for (const handler of normalizeHandlers(handlers)) {
          handler(event, matchedElement);
        }
      }
    };

    root.addEventListener(eventName, listener);
    removers.push(() => root.removeEventListener(eventName, listener));
  }

  return () => {
    removers.forEach((remove) => remove());
  };
}
