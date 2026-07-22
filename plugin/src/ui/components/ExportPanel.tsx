import { useState } from 'preact/hooks';
import type { ChitraComponent, StringItem } from '../../lib/types';
import { toExportJson } from '../../lib/export';
import { send } from '../app';

interface Props {
  items: StringItem[];
  components: ChitraComponent[];
}

export function ExportPanel({ items, components }: Props) {
  const [copied, setCopied] = useState(false);
  const [pasted, setPasted] = useState('');
  const rows = toExportJson(items, components);
  const json = JSON.stringify(rows, null, 2);

  const applyImport = () => {
    send({ type: 'import', text: pasted });
    setPasted('');
  };

  const copy = () => {
    navigator.clipboard.writeText(json).catch(() => {
      const ta = document.createElement('textarea');
      ta.value = json;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
    });
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div class="scroll">
      <div class="export-head">
        <span class="sub">
          {rows.length} string{rows.length === 1 ? '' : 's'} for handoff
        </span>
        <button class="primary" onClick={copy}>
          {copied ? 'Copied' : 'Copy JSON'}
        </button>
      </div>
      {rows.map((r) => (
        <div class="handoff-row" key={r.id}>
          <span class={`dot ${r.status}`} />
          <span class="row-text">{r.text || '(empty)'}</span>
          <span class="sub">
            {r.frame}
            {r.component ? ` · ${r.component}` : ''}
          </span>
        </div>
      ))}
      <pre class="json">{json}</pre>

      <div class="import">
        <h3 class="frame-name">Import</h3>
        <p class="sub">
          Paste rows of <strong>id, text</strong> (comma, tab, or semicolon delimited) to
          write copy back onto the canvas. Ids match the export above.
        </p>
        <textarea
          rows={4}
          placeholder={'1:23,Save changes\n1:24,Cancel'}
          value={pasted}
          onInput={(e) => setPasted((e.target as HTMLTextAreaElement).value)}
        />
        <button class="primary" disabled={pasted.trim() === ''} onClick={applyImport}>
          Apply
        </button>
      </div>
    </div>
  );
}
