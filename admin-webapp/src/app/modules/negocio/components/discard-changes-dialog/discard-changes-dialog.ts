import { ChangeDetectionStrategy, Component, computed, model, output } from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDialogImports } from '@spartan-ng/helm/dialog';

/**
 * Asks before a form page drops its unsaved edits. Bind `[(open)]`; «Seguir editando» closes it,
 * «Descartar cambios» closes it and emits `discard`, so the page leaves as Cancelar would.
 */
@Component({
  selector: 'app-discard-changes-dialog',
  imports: [HlmButtonImports, HlmDialogImports],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './discard-changes-dialog.html',
})
export class DiscardChangesDialog {
  readonly discard = output<void>();

  readonly open = model(false);

  protected readonly state = computed(() => (this.open() ? 'open' : 'closed'));

  protected onStateChange(state: 'open' | 'closed'): void {
    this.open.set(state === 'open');
  }

  protected confirm(): void {
    this.open.set(false);
    this.discard.emit();
  }
}
