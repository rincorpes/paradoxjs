import { ParadoxEventHandlers, ParadoxEventListenerWeakMap, ParadoxEvents } from "../types";

const eventListeners: ParadoxEventListenerWeakMap = new WeakMap();

function normalizeHandlers(handlers: ParadoxEventHandlers): EventListener[] {
  return Array.isArray(handlers) ? handlers : [handlers];
}

/**
 * Attaches event listeners to an HTML element.
 */
function handleEvents(element: HTMLElement, events: ParadoxEvents = {}): void {
  let elementEvents = eventListeners.get(element);

  if (!elementEvents) {
    elementEvents = new Map();
    eventListeners.set(element, elementEvents);
  }

  for (const [eventName, handlers] of Object.entries(events)) {
    const currentHandlers = normalizeHandlers(handlers);
    const previousHandlers = elementEvents.get(eventName) || new Set();

    for (const previousHandler of previousHandlers) {
      element.removeEventListener(eventName, previousHandler);
    }

    const nextHandlers = new Set<EventListener>();

    for (const handler of currentHandlers) {
      element.addEventListener(eventName, handler);
      nextHandlers.add(handler);
    }

    elementEvents.set(eventName, nextHandlers);
  }
}

export default handleEvents;
