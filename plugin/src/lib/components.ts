import type { IdemComponent, StringItem } from './types';

export function addComponent(
  components: IdemComponent[],
  component: IdemComponent,
): IdemComponent[] {
  return [...components, component];
}

export function updateComponentText(
  components: IdemComponent[],
  componentId: string,
  text: string,
): IdemComponent[] {
  return components.map((c) => (c.id === componentId ? { ...c, text } : c));
}

/** Tolerant parse of the `idem.components` registry JSON stored in pluginData. */
export function parseRegistry(raw: string): IdemComponent[] {
  if (!raw) return [];
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return [];
  }
  if (!Array.isArray(parsed)) return [];
  return parsed.filter(
    (c): c is IdemComponent =>
      typeof c === 'object' &&
      c !== null &&
      typeof (c as IdemComponent).id === 'string' &&
      typeof (c as IdemComponent).name === 'string' &&
      typeof (c as IdemComponent).text === 'string',
  );
}

/** Ids of items whose text must be updated when the component's text changes. */
export function propagationTargets(items: StringItem[], componentId: string): string[] {
  return items.filter((i) => i.componentId === componentId).map((i) => i.id);
}
