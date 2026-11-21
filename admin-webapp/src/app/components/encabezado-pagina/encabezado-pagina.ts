import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { Params, Router, RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronLeft } from '@ng-icons/lucide';
import { backLinkParams } from '@utils/navigation/back-link';

/**
 * The header of a page's panel: title, description and actions (plans/05 Page anatomy).
 * Actions go in as content, a status pill beside the title as `[meta]`, one line under the
 * description as `[linea]`, and a detail page sets
 * `volverA` (+ `volverParametros`) + `etiquetaVolver` for its back link («Volver a clientes»). No breadcrumbs.
 *
 * When the page was opened from that list (`ListaUrl.backState()` in the history state), the back
 * link returns to the list's view, filters, page and sort; `volverParametros` is the fallback for a
 * deep link or a reload of another entry.
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
  private readonly router = inject(Router);
  private readonly historyState = inject(Location).getState();

  readonly titulo = input.required<string>();
  readonly descripcion = input<string>();
  readonly volverA = input<readonly string[] | null>(null);
  /** Query params of the back link (`{ tab: 'sucursales' }`). */
  readonly volverParametros = input<Params | null>(null);
  readonly etiquetaVolver = input('Volver');
  /** History state for the back link, when the page it returns to needs its own (a review page hands the detail its list state back). */
  readonly backState = input<Record<string, unknown> | undefined>(undefined);

  protected readonly backParams = computed(() => {
    const target = this.volverA();
    if (!target) return null;
    const path = this.router.serializeUrl(this.router.createUrlTree([...target]));
    return backLinkParams(this.historyState, path, this.volverParametros());
  });
}
