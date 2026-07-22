import type { Status, StringItem } from './types';
import { STATUSES } from './types';

export interface StringFilter {
  search: string;
  status: Status | 'all';
}

/** Guard raw pluginData (missing/legacy values) into a valid Status. */
export function toStatus(raw: string): Status {
  return (STATUSES as readonly string[]).includes(raw) ? (raw as Status) : 'none';
}

export function filterStrings(items: StringItem[], filter: StringFilter): StringItem[] {
  const q = filter.search.trim().toLowerCase();
  return items.filter(
    (i) =>
      (filter.status === 'all' || i.status === filter.status) &&
      (q === '' || i.characters.toLowerCase().includes(q)),
  );
}

export interface FrameGroup {
  frame: string;
  items: StringItem[];
}

/** Group items by frame name, preserving first-appearance order. */
export function groupByFrame(items: StringItem[]): FrameGroup[] {
  const groups: FrameGroup[] = [];
  const byFrame = new Map<string, FrameGroup>();
  for (const item of items) {
    let group = byFrame.get(item.frameName);
    if (!group) {
      group = { frame: item.frameName, items: [] };
      byFrame.set(item.frameName, group);
      groups.push(group);
    }
    group.items.push(item);
  }
  return groups;
}
