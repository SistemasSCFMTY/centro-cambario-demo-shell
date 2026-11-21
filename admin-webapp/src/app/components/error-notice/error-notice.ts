import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';

/**
 * The one error pattern of a page (plans/01): a danger callout in its own section, on a hairline,
 * with «Reintentar» when the page can retry (`showRetry`). It goes right under the page header and
 * tabs, above the content it failed to load; the content below never adds an empty state of its own
 * while the error shows.
 */
@Component({
  selector: 'app-error-notice',
  imports: [HlmButtonImports],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './error-notice.html',
  host: {
    class: 'block border-line py-4',
    '[class.border-t]': 'separated()',
    '[class.px-8]': 'padded()',
  },
})
export class ErrorNotice {
  readonly message = input.required<string>();
  readonly showRetry = input(true);
  /** Draws its own top hairline; off where the section above already ends in one (a detail tab panel). */
  readonly separated = input(true);
  /** Brings the page's side gutter; off inside a section that already has it. */
  readonly padded = input(true);

  readonly retry = output<void>();
}
