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

export interface PageGroup {
  page: string;
  frames: FrameGroup[];
}

/**
 * Group items by page, then by frame within each page, preserving
 * first-appearance order at both levels.
 */
export function groupByPage(items: StringItem[]): PageGroup[] {
  const groups: { page: string; items: StringItem[] }[] = [];
  const byPage = new Map<string, { page: string; items: StringItem[] }>();
  for (const item of items) {
    let group = byPage.get(item.pageName);
    if (!group) {
      group = { page: item.pageName, items: [] };
      byPage.set(item.pageName, group);
      groups.push(group);
    }
    group.items.push(item);
  }
  return groups.map((g) => ({ page: g.page, frames: groupByFrame(g.items) }));
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
