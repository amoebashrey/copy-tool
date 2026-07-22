import type { Status } from '../../lib/types';
import { STATUSES } from '../../lib/types';

interface Props {
  value: Status;
  onChange(status: Status): void;
}

export function StatusBadge({ value, onChange }: Props) {
  return (
    <div class="chips">
      {STATUSES.map((s) => (
        <button key={s} class={value === s ? 'chip selected' : 'chip'} onClick={() => onChange(s)}>
          <span class={`dot ${s}`} />
          {s}
        </button>
      ))}
    </div>
  );
}
