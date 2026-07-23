import { useEffect, useState } from 'preact/hooks';
import type { ChitraComponent, StringItem } from '../../lib/types';
import { isLoose, suggestKey, validateKey } from '../../lib/strings';
import { send } from '../app';
import { StatusBadge } from './StatusBadge';
import { ComponentPicker } from './ComponentPicker';

interface Props {
  item: StringItem;
  /** All items in the document, for key-uniqueness validation. */
  allItems: StringItem[];
  components: ChitraComponent[];
  expanded: boolean;
  onToggle(): void;
}

export function StringRow({ item, allItems, components, expanded, onToggle }: Props) {
  const [draft, setDraft] = useState(item.characters);
  useEffect(() => setDraft(item.characters), [item.characters]);
  const [keyDraft, setKeyDraft] = useState(item.key ?? '');
  useEffect(() => setKeyDraft(item.key ?? ''), [item.key]);
  const linked = item.componentId
    ? components.find((c) => c.id === item.componentId)
    : undefined;
  const keyError = validateKey(keyDraft, allItems, item.id);
  const loose = isLoose(item);
  const suggestion = loose
    ? suggestKey(
        item.characters,
        allItems.map((i) => i.key).filter((k): k is string => k !== null),
      )
    : null;

  return (
    <div class={expanded ? 'row expanded' : 'row'}>
      <button class="row-head" onClick={onToggle}>
        <span class={`dot ${item.status}`} />
        <span class="row-text">{item.characters || '(empty)'}</span>
        {item.key && (
          <span class="key-tag" title={`Key: ${item.key}`}>
            {item.key}
          </span>
        )}
        {linked && (
          <span class="component-tag" title={`Linked to ${linked.name}`}>
            ⧉
          </span>
        )}
      </button>
      {expanded && (
        <div class="editor">
          <textarea
            rows={3}
            value={draft}
            onInput={(e) => setDraft((e.target as HTMLTextAreaElement).value)}
          />
          <button
            class="primary"
            disabled={draft === item.characters}
            onClick={() => send({ type: 'edit-text', id: item.id, text: draft })}
          >
            Apply to canvas
          </button>
          <div class="key-field">
            <div class="picker-row">
              <input
                class="key-input"
                type="text"
                placeholder={suggestion ?? 'checkout.cta_primary'}
                value={keyDraft}
                onInput={(e) => setKeyDraft((e.target as HTMLInputElement).value)}
              />
              {suggestion !== null && keyDraft.trim() !== suggestion && (
                <button title={`Use “${suggestion}”`} onClick={() => setKeyDraft(suggestion)}>
                  Suggest
                </button>
              )}
              <button
                disabled={keyError !== null || keyDraft.trim() === (item.key ?? '')}
                onClick={() => send({ type: 'set-key', id: item.id, key: keyDraft.trim() })}
              >
                {keyDraft.trim() === '' && item.key ? 'Clear key' : 'Set key'}
              </button>
            </div>
            {keyError ? (
              <p class="key-error">{keyError}</p>
            ) : loose ? (
              <p class="sub">Untracked copy — a key gives developers a name to call it by.</p>
            ) : (
              <p class="sub">Stable handoff key, e.g. checkout.cta_primary</p>
            )}
          </div>
          <StatusBadge
            value={item.status}
            onChange={(status) => send({ type: 'set-status', id: item.id, status })}
          />
          <ComponentPicker item={item} components={components} linked={linked} />
        </div>
      )}
    </div>
  );
}
