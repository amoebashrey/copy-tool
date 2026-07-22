import type { Status } from '../../lib/types';
import { STATUSES } from '../../lib/types';

interface Props {
  search: string;
  onSearch(value: string): void;
  status: Status | 'all';
  onStatus(value: Status | 'all'): void;
}

export function Toolbar({ search, onSearch, status, onStatus }: Props) {
  return (
    <div class="toolbar">
      <input
        class="search"
        type="search"
        placeholder="Search copy"
        value={search}
        onInput={(e) => onSearch((e.target as HTMLInputElement).value)}
      />
      <div class="chips">
        <button class={status === 'all' ? 'chip selected' : 'chip'} onClick={() => onStatus('all')}>
          All
        </button>
        {STATUSES.map((s) => (
          <button
            key={s}
            class={status === s ? 'chip selected' : 'chip'}
            onClick={() => onStatus(s)}
          >
            <span class={`dot ${s}`} />
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
