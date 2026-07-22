import { useState } from 'preact/hooks';
import type { ChitraComponent, StringItem } from '../../lib/types';
import { send } from '../app';

interface Props {
  item: StringItem;
  components: ChitraComponent[];
  linked: ChitraComponent | undefined;
}

export function ComponentPicker({ item, components, linked }: Props) {
  const [name, setName] = useState('');
  const [selected, setSelected] = useState('');

  if (linked) {
    return (
      <p class="sub">
        Linked to component <strong>{linked.name}</strong>
      </p>
    );
  }
  return (
    <div class="picker">
      {components.length > 0 && (
        <div class="picker-row">
          <select
            value={selected}
            onChange={(e) => setSelected((e.target as HTMLSelectElement).value)}
          >
            <option value="">Link to component…</option>
            {components.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <button
            disabled={!selected}
            onClick={() => send({ type: 'link-component', nodeId: item.id, componentId: selected })}
          >
            Link
          </button>
        </div>
      )}
      <div class="picker-row">
        <input
          placeholder="New component name"
          value={name}
          onInput={(e) => setName((e.target as HTMLInputElement).value)}
        />
        <button
          disabled={!name.trim()}
          onClick={() => send({ type: 'create-component', nodeId: item.id, name: name.trim() })}
        >
          Create
        </button>
      </div>
    </div>
  );
}
