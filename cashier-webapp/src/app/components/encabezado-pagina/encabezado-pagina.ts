import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** The header of a page's panel: title, description and actions (plans/05 Page anatomy). Actions go in as content. */
@Component({
  selector: 'app-encabezado-pagina',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './encabezado-pagina.html',
  host: { class: 'block' },
})
export class EncabezadoPagina {
  readonly titulo = input.required<string>();
  readonly descripcion = input<string>();
}
