import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmSpinner } from '@spartan-ng/helm/spinner';

/**
 * The sticky action bar of a form page (lead, 2026-11-16): Cancelar (secondary) and Guardar
 * (primary), always visible at the bottom of the content pane while the form scrolls. Put it as the
 * last child of the page's `panel`. Extra content (a summary line) goes in as the bar's start.
 */
@Component({
  selector: 'app-barra-acciones',
  imports: [HlmButtonImports, HlmSpinner],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './barra-acciones.html',
  host: {
    class:
      'sticky bottom-0 z-10 flex flex-wrap items-center justify-end gap-3 border-t border-line bg-panel px-8 py-4',
  },
})
export class BarraAcciones {
  readonly etiquetaCancelar = input('Cancelar');
  readonly etiquetaGuardar = input('Guardar');
  /** Saving: Guardar shows a spinner and both buttons wait. */
  readonly guardando = input(false);
  readonly guardarDeshabilitado = input(false);

  readonly cancelar = output<void>();
  readonly guardar = output<void>();
}
