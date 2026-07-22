/** Single source of truth for shapes shared by main thread, UI, and tests. */

export type Status = 'none' | 'wip' | 'review' | 'final';

export const STATUSES: readonly Status[] = ['none', 'wip', 'review', 'final'];

/** A TEXT node projected to plain data. */
export interface StringItem {
  id: string;
  characters: string;
  frameName: string;
  status: Status;
  componentId: string | null;
}

/** A reusable copy component (registry lives in figma.root pluginData). */
export interface ChitraComponent {
  id: string;
  name: string;
  text: string;
}

/** One row of the developer handoff export. */
export interface ExportRow {
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

export type UiToMain =
  | { type: 'edit-text'; id: string; text: string }
  | { type: 'set-status'; id: string; status: Status }
  | { type: 'create-component'; nodeId: string; name: string }
  | { type: 'link-component'; nodeId: string; componentId: string }
  | { type: 'edit-component'; componentId: string; text: string }
  | { type: 'refresh' };

export type MainToUi =
  | { type: 'strings'; items: StringItem[] }
  | { type: 'components'; components: ChitraComponent[] };
