import type { ChitraComponent, StringItem } from './types';

export function addComponent(
  components: ChitraComponent[],
  component: ChitraComponent,
): ChitraComponent[] {
  return [...components, component];
}

export function updateComponentText(
  components: ChitraComponent[],
  componentId: string,
  text: string,
): ChitraComponent[] {
  return components.map((c) => (c.id === componentId ? { ...c, text } : c));
}

/** Tolerant parse of the `chitra.components` registry JSON stored in pluginData. */
export function parseRegistry(raw: string): ChitraComponent[] {
  if (!raw) return [];
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return [];
  }
  if (!Array.isArray(parsed)) return [];
  return parsed.filter(
    (c): c is ChitraComponent =>
      typeof c === 'object' &&
      c !== null &&
      typeof (c as ChitraComponent).id === 'string' &&
      typeof (c as ChitraComponent).name === 'string' &&
      typeof (c as ChitraComponent).text === 'string',
  );
}

/** Ids of items whose text must be updated when the component's text changes. */
export function propagationTargets(items: StringItem[], componentId: string): string[] {
  return items.filter((i) => i.componentId === componentId).map((i) => i.id);
}
