interface Props {
  onDismiss(): void;
}

/**
 * First-run welcome card. Shown once per file (persisted via the
 * `set-onboarded` message → `chitra.onboarded` on figma.root).
 */
export function OnboardingCard({ onDismiss }: Props) {
  return (
    <div class="onboarding">
      <h2 class="onboarding-title">Chitra keeps the record of every word.</h2>
      <p class="onboarding-lede">
        Every string in this file, already listed below. Three moves cover most days:
      </p>
      <ul class="onboarding-moves">
        <li>
          <strong>Edit copy live</strong> — change it here, the canvas follows.
        </li>
        <li>
          <strong>Track status &amp; keys</strong> — every string named and accounted for.
        </li>
        <li>
          <strong>Reuse and hand off</strong> — link repeats, export clean JSON.
        </li>
      </ul>
      <p class="sub">
        Cautious? Duplicate this file and practice on the copy — the record forgives.
      </p>
      <button class="onboarding-dismiss" onClick={onDismiss}>
        Understood
      </button>
    </div>
  );
}
