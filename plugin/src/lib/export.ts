import type { ChitraComponent, ExportRow, ImportRow, StringItem } from './types';

/** Shape strings + registry into the developer handoff array. */
export function toExportJson(items: StringItem[], components: ChitraComponent[]): ExportRow[] {
  const names = new Map(components.map((c) => [c.id, c.name]));
  return items.map((i) => ({
    id: i.id,
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
