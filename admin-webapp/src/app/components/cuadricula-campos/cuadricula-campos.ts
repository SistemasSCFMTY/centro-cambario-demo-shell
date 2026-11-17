import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PillEstatus } from '@components/pill-estatus/pill-estatus';
import { CampoDetalle } from '@data/interfaces/campo-detalle';

/**
 * The key/value grid of a detail view (plans/01 Field grid): a semantic `<dl>`, an empty value
 * renders `—`, numbers, IDs and dates take `font-data`, related records are links, enums are pills.
 */
@Component({
  selector: 'app-cuadricula-campos',
  imports: [RouterLink, PillEstatus],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cuadricula-campos.html',
  host: { class: 'block' },
})
export class CuadriculaCampos {
  readonly campos = input.required<readonly CampoDetalle[]>();
  readonly columnas = input<2 | 3>(2);

  protected readonly filas = computed(() =>
    this.campos().map((campo) => ({
      ...campo,
      texto:
        campo.valor === null || campo.valor === undefined || campo.valor === ''
          ? '—'
          : String(campo.valor),
    })),
  );

  protected readonly clasesColumnas = {
    2: 'sm:grid-cols-2',
    3: 'sm:grid-cols-2 lg:grid-cols-3',
  };
}
