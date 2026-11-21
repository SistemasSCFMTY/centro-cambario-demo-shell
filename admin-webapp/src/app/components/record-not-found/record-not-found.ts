import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EncabezadoPagina } from '@components/encabezado-pagina/encabezado-pagina';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideSearchX } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';

/**
 * The page for a record that doesn't exist (a wrong or stale link): the page header with its back
 * link, then one flat empty state with a way back to the list (plans/01). Every detail page uses
 * it, so a missing operación, cliente or movimiento reads the same.
 */
@Component({
  selector: 'app-record-not-found',
  imports: [EncabezadoPagina, HlmButtonImports, NgIcon, RouterLink],
  providers: [provideIcons({ lucideSearchX })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './record-not-found.html',
  host: { class: 'block' },
})
export class RecordNotFound {
  /** The page title: the kind of record («Operación»). */
  readonly title = input.required<string>();
  /** «No encontramos esta operación». */
  readonly message = input.required<string>();
  readonly description = input(
    'Puede que el enlace sea incorrecto o que el registro ya no exista.',
  );
  readonly backTo = input.required<readonly string[]>();
  /** «Volver a operaciones»: the back link and the button share it. */
  readonly backLabel = input.required<string>();
}
