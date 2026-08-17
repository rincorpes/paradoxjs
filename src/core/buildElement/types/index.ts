export type ParadoxAttributeValue = string | number | boolean | null | undefined;

export type ParadoxAttributes = {
  [key: string]: ParadoxAttributeValue;
};

export type ParadoxDataAttributes = {
  [key: string]: ParadoxAttributeValue;
};

export type ParadoxAriaAttributes = {
  [key: string]: ParadoxAttributeValue;
};

export type ParadoxStyleValue = string | number | null | undefined;

export type ParadoxStyles = {
  [key: string]: ParadoxStyleValue;
};

export type ParadoxEventHandler = EventListener;
export type ParadoxEventHandlers = ParadoxEventHandler | ParadoxEventHandler[];

export type ParadoxEvents = {
  [key: string]: ParadoxEventHandlers;
};

export type ParadoxTextValue = string | number;
export type ParadoxClassValue = string | string[];

export type ParadoxElementDescriptor<Tag extends keyof HTMLElementTagNameMap = keyof HTMLElementTagNameMap> = {
  tag: Tag;
  options?: ParadoxElementOptions<Tag>;
};

export type ParadoxElementChild =
  | Node
  | ParadoxTextValue
  | boolean
  | null
  | undefined
  | ParadoxElementDescriptor
  | ParadoxElementChild[];

export type ParadoxElementChildren = ParadoxElementChild[];

export type ParadoxElementOptions<Tag extends keyof HTMLElementTagNameMap = keyof HTMLElementTagNameMap> = {
  id?: string;
  className?: ParadoxClassValue;
  classList?: ParadoxClassValue;
  children?: ParadoxElementChildren;
  attributes?: ParadoxAttributes;
  data?: ParadoxDataAttributes;
  aria?: ParadoxAriaAttributes;
  events?: ParadoxEvents;
  text?: ParadoxTextValue;
  style?: ParadoxStyles;
};

export type ParadoxEventListenerWeakMap = WeakMap<HTMLElement, Map<string, Set<EventListener>>>;

export type ParadoxElementMemoizedText = { [key: string]: string };
