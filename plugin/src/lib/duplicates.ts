import type { DuplicateGroup, StringItem } from './types';

/**
 * Group strings whose trimmed text is identical. A group qualifies when it
 * has 2+ members that are NOT already all linked to the same component —
 * i.e. there is still something to unify. Empty/whitespace-only strings are
 * ignored (nothing to manage). Groups come back largest-first so the UI can
 * lead with the most convincing one.
 */
export function groupDuplicates(items: StringItem[]): DuplicateGroup[] {
  const byText = new Map<string, StringItem[]>();
  for (const item of items) {
    const text = item.characters.trim();
    if (text === '') continue;
    const group = byText.get(text);
    if (group) group.push(item);
    else byText.set(text, [item]);
  }

  const groups: DuplicateGroup[] = [];
  for (const [text, group] of byText) {
    if (group.length < 2) continue;
    const first = group[0].componentId;
    const allSameComponent = first !== null && group.every((i) => i.componentId === first);
    if (allSameComponent) continue; // already managed together
    groups.push({ text, items: group });
  }
  return groups.sort((a, b) => b.items.length - a.items.length);
}
