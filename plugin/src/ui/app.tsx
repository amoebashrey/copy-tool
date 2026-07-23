import { useEffect, useState } from 'preact/hooks';
import type { ChitraComponent, MainToUi, Status, StringItem, UiToMain } from '../lib/types';
import { filterStrings, groupByPage, looseStrings, suggestKey } from '../lib/strings';
import { groupDuplicates } from '../lib/duplicates';
import { propagationTargets } from '../lib/components';
import { Toolbar } from './components/Toolbar';
import { StringRow } from './components/StringRow';
import { ExportPanel } from './components/ExportPanel';
import { OnboardingCard } from './components/OnboardingCard';
import { SelectionBanner } from './components/SelectionBanner';
import { DuplicateBanner } from './components/DuplicateBanner';

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

interface Toast {
  id: number;
  text: string;
  tone: 'info' | 'success';
}

const TOAST_MS = 3000;
let toastSeq = 0;

export function App() {
  const [tab, setTab] = useState<Tab>('strings');
  const [items, setItems] = useState<StringItem[]>([]);
  const [components, setComponents] = useState<ChitraComponent[]>([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<Status | 'all'>('all');
  const [looseOnly, setLooseOnly] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  // Onboarded defaults true so the card never flashes before the first payload.
  const [onboarded, setOnboarded] = useState(true);
  const [scoped, setScoped] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [dismissedDups, setDismissedDups] = useState<string[]>([]);

  useEffect(() => {
    window.onmessage = (event: MessageEvent) => {
      const msg = event.data?.pluginMessage as MainToUi | undefined;
      if (!msg) return;
      if (msg.type === 'strings') {
        setItems(msg.items);
        setOnboarded(msg.onboarded);
        setScoped(msg.scoped);
      } else if (msg.type === 'components') {
        setComponents(msg.components);
      } else if (msg.type === 'toast') {
        const toast: Toast = { id: ++toastSeq, text: msg.text, tone: msg.tone ?? 'info' };
        setToasts((all) => [...all, toast]);
        setTimeout(() => setToasts((all) => all.filter((t) => t.id !== toast.id)), TOAST_MS);
      }
    };
    send({ type: 'refresh' });
  }, []);

  const visible = filterStrings(items, { search, status, looseOnly });
  const pages = groupByPage(visible);
  const looseCount = looseStrings(items).length;
  const duplicateGroup = groupDuplicates(items).find((g) => !dismissedDups.includes(g.text));

  const dismissOnboarding = () => {
    setOnboarded(true); // optimistic; main thread persists and re-broadcasts
    send({ type: 'set-onboarded' });
  };

  const linkAllDuplicates = () => {
    if (!duplicateGroup) return;
    send({
      type: 'link-all-duplicates',
      nodeIds: duplicateGroup.items.map((i) => i.id),
      // Component name derived from the text, unique among existing names.
      name: suggestKey(
        duplicateGroup.text,
        components.map((c) => c.name),
      ),
    });
  };

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
          <Toolbar
            search={search}
            onSearch={setSearch}
            status={status}
            onStatus={setStatus}
            looseOnly={looseOnly}
            onLooseOnly={setLooseOnly}
            looseCount={looseCount}
          />
          {scoped && (
            <SelectionBanner
              count={items.length}
              onShowWholeFile={() => send({ type: 'set-scope', whole: true })}
            />
          )}
          {duplicateGroup && (
            <DuplicateBanner
              group={duplicateGroup}
              onLinkAll={linkAllDuplicates}
              onDismiss={() => setDismissedDups((d) => [...d, duplicateGroup.text])}
            />
          )}
          <div class="scroll">
            {!onboarded && <OnboardingCard onDismiss={dismissOnboarding} />}
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
                        allItems={items}
                        components={components}
                        expanded={expandedId === item.id}
                        onToggle={() => setExpandedId(expandedId === item.id ? null : item.id)}
                      />
                    ))}
                  </section>
                ))}
              </section>
            ))}
            {items.length === 0 ? (
              <p class="empty">
                {scoped
                  ? 'Nothing in this selection holds text. Select a frame with copy, or show the whole file.'
                  : 'A blank ledger. Add text to the canvas and Chitra will record every word here.'}
              </p>
            ) : (
              visible.length === 0 && <p class="empty">No strings match.</p>
            )}
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

      {toasts.length > 0 && (
        <div class="toasts">
          {toasts.map((t) => (
            <div key={t.id} class={`toast ${t.tone}`}>
              {t.text}
            </div>
          ))}
        </div>
      )}
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
