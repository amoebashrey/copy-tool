/** Single source of truth for shapes shared by main thread, UI, and tests. */

export type Status = 'none' | 'wip' | 'review' | 'final';

export const STATUSES: readonly Status[] = ['none', 'wip', 'review', 'final'];

/** A TEXT node projected to plain data. */
export interface StringItem {
  id: string;
  characters: string;
  frameName: string;
  pageName: string;
  status: Status;
  componentId: string | null;
  /** Stable, human-readable handoff key (pluginData `chitra.key`), if set. */
  key: string | null;
}

/** A reusable copy component (registry lives in figma.root pluginData). */
export interface ChitraComponent {
  id: string;
  name: string;
  text: string;
}

/** One row of the developer handoff export. */
export interface ExportRow {
  /** The item's stable key when set, else its node id. */
  id: string;
  frame: string;
  text: string;
  status: Status;
  component: string | null;
}

/** A parsed row of an imported spreadsheet/CSV-ish paste. */
export interface ImportRow {
  id: string;
  text: string;
}

/**
 * Two or more strings with identical trimmed text that are not already all
 * linked to the same component — the raw material for one-click "Link all".
 */
export interface DuplicateGroup {
  /** The shared, trimmed text. */
  text: string;
  items: StringItem[];
}

export type UiToMain =
  | { type: 'edit-text'; id: string; text: string }
  | { type: 'set-status'; id: string; status: Status }
  | { type: 'set-key'; id: string; key: string }
  | { type: 'create-component'; nodeId: string; name: string }
  | { type: 'link-component'; nodeId: string; componentId: string }
  | { type: 'edit-component'; componentId: string; text: string }
  | { type: 'link-all-duplicates'; nodeIds: string[]; name: string }
  | { type: 'import'; text: string }
  | { type: 'set-onboarded' }
  | { type: 'set-scope'; whole: boolean }
  | { type: 'refresh' };

export type MainToUi =
  | {
      type: 'strings';
      items: StringItem[];
      /** Whether this file has seen (and dismissed) the first-run card. */
      onboarded: boolean;
      /** True when the list is scoped to the current selection, not the whole file. */
      scoped: boolean;
    }
  | { type: 'components'; components: ChitraComponent[] }
  | { type: 'toast'; text: string; tone?: 'info' | 'success' };
