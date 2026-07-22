import { useEffect, useState } from 'preact/hooks';
import type { ChitraComponent, MainToUi, Status, StringItem, UiToMain } from '../lib/types';
import { filterStrings, groupByPage } from '../lib/strings';
import { propagationTargets } from '../lib/components';
import { Toolbar } from './components/Toolbar';
import { StringRow } from './components/StringRow';
import { ExportPanel } from './components/ExportPanel';

/** Single point where UI intent leaves the iframe for the main thread. */
export function send(msg: UiToMain): void {
  parent.postMessage({ pluginMessage: msg }, '*');
}

type Tab = 'strings' | 'components' | 'dev';
const TABS: { id: Tab; label: string }[] = [
  { id: 'strings', label: 'Strings' },
  { id: 'components', label: 'Components' },
  { id: 'dev', label: 'Dev' },
];

export function App() {
  const [tab, setTab] = useState<Tab>('strings');
  const [items, setItems] = useState<StringItem[]>([]);
  const [components, setComponents] = useState<ChitraComponent[]>([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<Status | 'all'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    window.onmessage = (event: MessageEvent) => {
      const msg = event.data?.pluginMessage as MainToUi | undefined;
      if (!msg) return;
      if (msg.type === 'strings') setItems(msg.items);
      else if (msg.type === 'components') setComponents(msg.components);
    };
    send({ type: 'refresh' });
  }, []);

  const visible = filterStrings(items, { search, status });
  const pages = groupByPage(visible);

  return (
    <div class="app">
      <nav class="tabs">
        {TABS.map((t) => (
          <button
            key={t.id}
            class={tab === t.id ? 'tab active' : 'tab'}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {tab === 'strings' && (
        <>
          <Toolbar search={search} onSearch={setSearch} status={status} onStatus={setStatus} />
          <div class="scroll">
            {pages.map((p) => (
              <section key={p.page}>
                <h2 class="page-name">{p.page}</h2>
                {p.frames.map((g) => (
                  <section key={g.frame}>
                    <h3 class="frame-name">{g.frame}</h3>
                    {g.items.map((item) => (
                      <StringRow
                        key={item.id}
                        item={item}
                        components={components}
                        expanded={expandedId === item.id}
                        onToggle={() => setExpandedId(expandedId === item.id ? null : item.id)}
                      />
                    ))}
                  </section>
                ))}
              </section>
            ))}
            {visible.length === 0 && <p class="empty">No strings match.</p>}
          </div>
        </>
      )}

      {tab === 'components' && (
        <div class="scroll">
          {components.map((c) => (
            <ComponentRow
              key={c.id}
              component={c}
              linkedCount={propagationTargets(items, c.id).length}
            />
          ))}
          {components.length === 0 && (
            <p class="empty">No copy components yet. Create one from a string.</p>
          )}
        </div>
      )}

      {tab === 'dev' && <ExportPanel items={items} components={components} />}
    </div>
  );
}

function ComponentRow({
  component,
  linkedCount,
}: {
  component: ChitraComponent;
  linkedCount: number;
}) {
  const [draft, setDraft] = useState(component.text);
  useEffect(() => setDraft(component.text), [component.text]);
  return (
    <div class="row expanded">
      <div class="component-head">
        <span class="component-name">{component.name}</span>
        <span class="sub">
          {linkedCount} linked layer{linkedCount === 1 ? '' : 's'}
        </span>
      </div>
      <textarea
        rows={3}
        value={draft}
        onInput={(e) => setDraft((e.target as HTMLTextAreaElement).value)}
      />
      <button
        class="primary"
        disabled={draft === component.text}
        onClick={() => send({ type: 'edit-component', componentId: component.id, text: draft })}
      >
        Update and propagate
      </button>
    </div>
  );
}
