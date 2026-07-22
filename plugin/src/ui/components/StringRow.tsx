import { useEffect, useState } from 'preact/hooks';
import type { ChitraComponent, StringItem } from '../../lib/types';
import { send } from '../app';
import { StatusBadge } from './StatusBadge';
import { ComponentPicker } from './ComponentPicker';

interface Props {
  item: StringItem;
  components: ChitraComponent[];
  expanded: boolean;
  onToggle(): void;
}

export function StringRow({ item, components, expanded, onToggle }: Props) {
  const [draft, setDraft] = useState(item.characters);
  useEffect(() => setDraft(item.characters), [item.characters]);
  const linked = item.componentId
    ? components.find((c) => c.id === item.componentId)
    : undefined;

  return (
    <div class={expanded ? 'row expanded' : 'row'}>
      <button class="row-head" onClick={onToggle}>
        <span class={`dot ${item.status}`} />
        <span class="row-text">{item.characters || '(empty)'}</span>
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
