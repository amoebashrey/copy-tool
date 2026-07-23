import type { DuplicateGroup } from '../../lib/types';

interface Props {
  group: DuplicateGroup;
  onLinkAll(): void;
  onDismiss(): void;
}

const PREVIEW_MAX = 24;

function preview(text: string): string {
  return text.length > PREVIEW_MAX ? `${text.slice(0, PREVIEW_MAX)}…` : text;
}

/**
 * The manufactured aha: identical copy found in several places, offered as
 * one component with a single click.
 */
export function DuplicateBanner({ group, onLinkAll, onDismiss }: Props) {
  return (
    <div class="banner duplicate-banner">
      <span class="banner-text">
        “{preview(group.text)}” appears in {group.items.length} places. Manage them together?
      </span>
      <button class="primary" onClick={onLinkAll}>
        Link all
      </button>
      <button class="banner-dismiss" title="Dismiss" onClick={onDismiss}>
        ×
      </button>
    </div>
  );
}
