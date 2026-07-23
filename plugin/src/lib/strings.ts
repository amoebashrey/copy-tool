import type { Status, StringItem } from './types';
import { STATUSES } from './types';

export interface StringFilter {
  search: string;
  status: Status | 'all';
  /** When true, keep only "loose" (untracked) strings — no key, no component. */
  looseOnly?: boolean;
}

/** Guard raw pluginData (missing/legacy values) into a valid Status. */
export function toStatus(raw: string): Status {
  return (STATUSES as readonly string[]).includes(raw) ? (raw as Status) : 'none';
}

/** Untracked copy: strings with neither a stable key nor a linked component. */
export function isLoose(item: StringItem): boolean {
  return item.key === null && item.componentId === null;
}

/** The subset of items that are untracked (no key AND no component). */
export function looseStrings(items: StringItem[]): StringItem[] {
  return items.filter(isLoose);
}

export function filterStrings(items: StringItem[], filter: StringFilter): StringItem[] {
  const q = filter.search.trim().toLowerCase();
  return items.filter(
    (i) =>
      (filter.status === 'all' || i.status === filter.status) &&
      (!filter.looseOnly || isLoose(i)) &&
      (q === '' || i.characters.toLowerCase().includes(q)),
  );
}

// TODO: auto-suggest keys (slugified frame + text, e.g. "checkout.pay_now")
// for loose strings — a separate pass; validation below is the contract.
const KEY_PATTERN = /^[a-z0-9._-]+$/;

/**
 * Validate a key edit for the item `selfId` against the whole document.
 * Returns an error message to show inline, or null when the key is fine.
 * An entirely empty key is fine — it clears the key — but a key that is
 * only whitespace was clearly *meant* to be a key, so it errors.
 */
export function validateKey(key: string, items: StringItem[], selfId: string): string | null {
  const trimmed = key.trim();
  if (trimmed === '') {
    return key === '' ? null : 'Key can’t be only whitespace.';
  }
  if (!KEY_PATTERN.test(trimmed)) {
    return 'Use only a–z, 0–9, ".", "_" and "-".';
  }
  const clash = items.find((i) => i.id !== selfId && i.key === trimmed);
  if (clash) {
    return `Already used by “${clash.characters || '(empty)'}” in ${clash.frameName}.`;
  }
  return null;
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
