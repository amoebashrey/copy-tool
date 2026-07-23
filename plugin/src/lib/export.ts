import type { ChitraComponent, ExportRow, ImportRow, StringItem } from './types';

/** Shape strings + registry into the developer handoff array. */
export function toExportJson(items: StringItem[], components: ChitraComponent[]): ExportRow[] {
  const names = new Map(components.map((c) => [c.id, c.name]));
  return items.map((i) => ({
    id: i.key || i.id, // stable human key when set, node id otherwise
    frame: i.frameName,
    text: i.characters,
    status: i.status,
    component: (i.componentId && names.get(i.componentId)) || null,
  }));
}

const DELIMITERS = ['\t', ';', ','] as const; // priority order on ties

function detectDelimiter(text: string): string {
  let best: string = DELIMITERS[0];
  let bestCount = 0;
  for (const d of DELIMITERS) {
    const count = text.split(d).length - 1;
    if (count > bestCount) {
      best = d;
      bestCount = count;
    }
  }
  return best;
}

function unquote(field: string): string {
  const t = field.trim();
  return t.length >= 2 && t.startsWith('"') && t.endsWith('"') ? t.slice(1, -1) : t;
}

/**
 * Delimiter-agnostic import parse (comma/tab/semicolon), string-along style:
 * each line is `id<delim>text`, split on the first delimiter only so the text
 * may itself contain delimiters. Blank/undelimited lines are skipped.
 */
export function parseImport(text: string): ImportRow[] {
  const delim = detectDelimiter(text);
  const rows: ImportRow[] = [];
  for (const line of text.split('\n')) {
    if (line.trim() === '') continue;
    const at = line.indexOf(delim);
    if (at === -1) continue;
    rows.push({ id: unquote(line.slice(0, at)), text: unquote(line.slice(at + 1)) });
  }
  return rows;
}

/** The id + key of a document node an import row could target. */
export type ImportTarget = Pick<StringItem, 'id' | 'key'>;

/** An import row resolved to the node it should apply to. */
export interface MatchedImportRow {
  nodeId: string;
  text: string;
}

export interface ImportMatch {
  matched: MatchedImportRow[];
  missingIds: string[];
}

/**
 * Resolve parsed import rows against the document: a row's id matches a
 * node's stable key first (what the export emits when a key is set), then
 * falls back to the raw node id. When one node's key collides with another
 * node's id, the key wins — keys are the intentional, human-assigned handle.
 * Row order is preserved; a duplicated id stays duplicated so the last
 * row wins when rows are applied in order.
 */
export function matchImportRows(rows: ImportRow[], targets: Iterable<ImportTarget>): ImportMatch {
  const idByKey = new Map<string, string>();
  const ids = new Set<string>();
  for (const t of targets) {
    ids.add(t.id);
    // Keys are validated unique in the UI; if stale data disagrees, first wins.
    if (t.key && !idByKey.has(t.key)) idByKey.set(t.key, t.id);
  }
  const matched: MatchedImportRow[] = [];
  const missingIds: string[] = [];
  for (const row of rows) {
    const nodeId = idByKey.get(row.id) ?? (ids.has(row.id) ? row.id : undefined);
    if (nodeId !== undefined) matched.push({ nodeId, text: row.text });
    else missingIds.push(row.id);
  }
  return { matched, missingIds };
}
