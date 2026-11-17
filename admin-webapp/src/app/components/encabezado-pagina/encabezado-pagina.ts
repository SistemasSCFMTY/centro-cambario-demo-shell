import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Params, RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronLeft } from '@ng-icons/lucide';

/**
 * The header of a page's panel: title, description and actions (plans/05 Page anatomy).
 * Actions go in as content, a status pill beside the title as `[meta]`, one line under the
 * description as `[linea]`, and a detail page sets
 * `volverA` (+ `volverParametros`) + `etiquetaVolver` for its back link («Volver a clientes»). No breadcrumbs.
 */
@Component({
  selector: 'app-encabezado-pagina',
  imports: [RouterLink, NgIcon],
  providers: [provideIcons({ lucideChevronLeft })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './encabezado-pagina.html',
  host: { class: 'block' },
})
export class EncabezadoPagina {
  readonly titulo = input.required<string>();
  readonly descripcion = input<string>();
  readonly volverA = input<readonly string[] | null>(null);
  /** Query params of the back link (`{ tab: 'sucursales' }`). */
  readonly volverParametros = input<Params | null>(null);
  readonly etiquetaVolver = input('Volver');
}
