import { ParadoxStyles } from "../types";

type ParadoxStyleKeys = { [key: string]: string };

const memoizedStyleKeys: ParadoxStyleKeys = {};

function getStyleKey(key: string = ""): string {
  if (memoizedStyleKeys[key] !== undefined) {
    return memoizedStyleKeys[key];
  }

  if (key.startsWith("--")) {
    memoizedStyleKeys[key] = key;
    return key;
  }

  const styleKey = key.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, "$1-$2").toLowerCase();
  memoizedStyleKeys[key] = styleKey;

  return styleKey;
}

/**
 * Applies inline styles to an HTML element.
 */
function applyStyles(element: HTMLElement, style: ParadoxStyles = {}): void {
  const styleDeclaration = element.style;

  for (const [key, value] of Object.entries(style)) {
    if (value === null || value === undefined) {
      styleDeclaration.removeProperty(getStyleKey(key));
      continue;
    }

    styleDeclaration.setProperty(getStyleKey(key), String(value));
  }
}

export default applyStyles;
