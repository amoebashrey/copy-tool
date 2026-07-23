interface Props {
  /** How many strings the selection scope produced. */
  count: number;
  /** Ask the main thread to index the whole file despite the selection. */
  onShowWholeFile(): void;
}

/**
 * Makes selection-scoping visible: when something is selected, the list
 * shows only that subtree — say so, and offer the way out.
 */
export function SelectionBanner({ count, onShowWholeFile }: Props) {
  return (
    <div class="banner scope-banner">
      <span class="banner-text">
        Showing {count} string{count === 1 ? '' : 's'} in your selection
      </span>
      <button class="link-btn" onClick={onShowWholeFile}>
        Show whole file
      </button>
    </div>
  );
}
